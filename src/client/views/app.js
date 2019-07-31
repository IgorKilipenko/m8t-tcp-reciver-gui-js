import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MiniDrawer from '../components/root';
import ApiSocket from '../components/api-socket';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { serverEvents, events as EVENTS } from '../components/server-events';
import { ClassIds, NavMessageIds } from '../model/ublox';
import { EventEmitter } from 'events';

//import { UbxDecoder, ClassIds, NavMessageIds } from '../model/ublox';

//const api = new ApiSocket();

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

const styles = theme => ({});

const _mainInterval = new MainInterval();
_mainInterval.start(5000);
const _updateErrors = 0;

@inject('apiStore')
@inject('serverEventStore')
@withRouter
@observer
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            gps: {},
            server: {}
        };
        //this.decoder = new UbxDecoder();
    }

    handleServerEvents = (event, msg) => {
        //console.debug("msg app", {event, msg})
        this.props.serverEventStore.setMessage(event, msg);
    };

    updateAllApiState = () => {
        if (this.props.apiStore.updateServerState() != null) {
            this._updateErrors += 1;
        }
        if (this.props.apiStore.updateReceiverState() != null) {
            this._updateErrors += 1;
        }
        if (this.props.apiStore.updateNtripState() != null) {
            this._updateErrors += 1;
        }
    };

    _updater = args => {
        this.updateAllApiState();
        //serverEvents.pongUbxWs();
    };
    _lock = false;

    _navMsgCallback = msg => {
        if (msg && msg.class === ClassIds.NAV) {
            //this.handleServerEvents(EVENTS.ubxNav, msg);
            switch (msg.type) {
                case NavMessageIds.PVT:
                    this.props.serverEventStore.setPvtMessage(msg);
                    break;
                case NavMessageIds.HPPOSLLH:
                    this.props.serverEventStore.setHPPOSLLHMessage(msg);
                    break;
            }
        }
    };
    componentDidMount = () => {
        console.debug('Mounted APP');

        this.updateAllApiState();
        _mainInterval.on('interval', this._updater);

        this.timeoutHandler = setTimeout(() => {
            this.props.apiStore.updateWiFiList();
        }, 500);

        serverEvents.onDebugMessage(msg =>
            this.handleServerEvents(EVENTS.debug, msg)
        );

        serverEvents.onUbxNavMessage(this._navMsgCallback);
    };

    componentWillUnmount = () => {
        console.debug('Unmount APP');

        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }

        _mainInterval.off('interval', this._updater);

        serverEvents.offUbxNavMessage(this._navMsgCallback);
    };

    render() {
        const { gps } = this.state;
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
                    {this.props.children}
                </MiniDrawer>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(App);
