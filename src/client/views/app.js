import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MiniDrawer from '../components/root';
import ApiSocket from '../components/api-socket';
import { observer } from 'mobx-react';
import { serverEvents, events as EVENTS } from '../components/server-events';
import { ClassIds, NavMessageIds } from '../model/ublox';
import { EventEmitter } from 'events';

/* Migrate to React hooks" */
import useReactRouter from 'use-react-router';
import { MobXProviderContext } from 'mobx-react';
function useStores() {
    return React.useContext(MobXProviderContext);
}
////////////////////////////

class MainInterval extends EventEmitter {
    constructor() {
        super();
    }

    _timeStart = null;
    _interval = 1000;
    _enabled = false;
    _inrevalPrt = null;

    start = (interval, args) => {
        if (this._enabled) {
            return false;
        }
        this._interval = interval || 1000;
        this._timeStart = new Date();
        this._inrevalPrt = setInterval(
            args => {
                this.emit('interval', {
                    totalTime: new Date() - this._timeStart,
                    interval: this._interval,
                    args
                });
            },
            this._interval,
            args
        );
        this._enabled = true;
        return true;
    };

    stop = () => {
        if (this._enabled && this._inrevalPrt) {
            clearInterval(this._inrevalPrt);
            this._enabled = false;
            this._inrevalPrt = null;
            this.emit('stop', {
                totalTime: new Date() - this._timeStart,
                interval: this._interval
            });
            return true;
        } else {
            return false;
        }
    };

    get enabled() {
        return this._enabled;
    }
}

const useStyles = makeStyles(theme => ({}));

const _mainInterval = new MainInterval();
_mainInterval.start(5000);
let _updateErrors = 0;

const App = observer(props => {
    const classes = useStyles();
    const theme = useTheme();

    const { history, location, match } = useReactRouter();
    const stores = useStores();
    const { apiStore, serverEventStore } = stores;
    let timeoutHandler = null;

    const handleServerEvents = (event, msg) => {
        serverEventStore.setMessage(event, msg);
    };

    const updateAllApiState = () => {
        if (apiStore.updateServerState() != null) {
            _updateErrors += 1;
        }
        if (apiStore.updateReceiverState() != null) {
            _updateErrors += 1;
        }
        if (apiStore.updateNtripState() != null) {
            _updateErrors += 1;
        }
    };

    const _updater = args => {
        updateAllApiState();
    };

    const _navMsgCallback = msg => {
        if (msg && msg.class === ClassIds.NAV) {
            //this.handleServerEvents(EVENTS.ubxNav, msg);
            switch (msg.type) {
                case NavMessageIds.PVT:
                    serverEventStore.setPvtMessage(msg);
                    break;
                case NavMessageIds.HPPOSLLH:
                    serverEventStore.setHPPOSLLHMessage(msg);
                    break;
            }
        }
    };

    const componentDidMount = () => {
        console.debug('Mounted APP');

        updateAllApiState();
        _mainInterval.on('interval', _updater);

        timeoutHandler = setTimeout(() => {
            apiStore.updateWiFiList();
        }, 500);

        serverEvents.onDebugMessage(msg =>
            handleServerEvents(EVENTS.debug, msg)
        );

        serverEvents.onUbxNavMessage(_navMsgCallback);
    };

    const componentWillUnmount = () => {
        console.debug('Unmount APP');

        if (timeoutHandler) {
            clearTimeout(timeoutHandler);
        }

        _mainInterval.off('interval', _updater);

        serverEvents.offUbxNavMessage(_navMsgCallback);
    };

    React.useEffect(() => {
        console.info('App useEffect START');
        componentDidMount();
        return () => {
            console.info('App useEffect STOP');
            componentWillUnmount();
        };
    }, []);

    return (
        <div>
            <Helmet>
                {/*<meta charSet="ANSI" />*/}
                {/*<meta charSet="Windows-1252" />*/}
                <meta charSet="utf-8" />
                <title>ESP GPS</title>
                {/*<link rel="icon" href={favicon}/>
                <meta name="msapplication-TileImage" content={favicon}/>*/}
                <meta name="theme-color" content="#9CC2CE" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
                />
                <link
                    href="https://fonts.googleapis.com/css?family=Montserrat+Alternates:300,300i,400,400i,500,500i,600,600i&amp;subset=cyrillic"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
            </Helmet>
            <MiniDrawer>
                {/*<Button onClick={async () => this.sendGnssCmd()}>
                    {gps.enabled ? 'Stop GPS' : 'Start GPS'}
                </Button>
                <Button>Тест utf-8</Button>*/}
                {props.children}
            </MiniDrawer>
        </div>
    );
});

export default App;
