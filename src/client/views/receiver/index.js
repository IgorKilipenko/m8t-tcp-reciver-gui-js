import React from 'react';
import Button from '@material-ui/core/Button';
//import ApiSocket from '../../components/api-socket';
import { observer } from 'mobx-react';
import { trace } from 'mobx';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ReceiverInfo from './components/ReceiverInfo';
import NavPane from './components/NavPane';
import GoogleMap from '../../components/Map';

////////////////////////////////////
import {apiStore, serverEventStore} from '../../stores';
////////////////////////////////////

const useStyles = makeStyles(theme => ({
    root: {
        //display: 'flex'
    },
    details: {
        display: 'flex',
        flexDirection: 'column'
    },
    button: {
        margin: theme.spacing(1)
    },
}));

const ReceiverView = observer(props => {
    const classes = useStyles();
    const theme = useTheme();

    const [state, setState] = React.useState({
        timeReceive: 0
    });
    let recTiemeInterval = null;
    const enabled = apiStore.receiverState.enabled;

    const enableMobxTrace = enable => {
        trace(true);
    };

    const getTimeReceive = () => {
        let date = new Date(apiStore.timeReceive || 0);

        return timeToString(date);
    };

    const timeToString = date => {
        return (
            ('00' + date.getUTCHours()).slice(-2) +
            ':' +
            ('00' + date.getUTCMinutes()).slice(-2) +
            ':' +
            ('00' + date.getUTCSeconds()).slice(
                -2
            ) /* +
            '.' +
            ('00' + date.getUTCMilliseconds()).slice(-2)*/
        );
    };

    const buttonClickHandler = async () => {
        apiStore.updateServerState();
        try {
            const { enabled } = apiStore.receiverState;
            const options = [apiStore.serverState.sdSuccess, true];
            const res = await api.setReceive(!enabled, ...options);
            apiStore.updateReceiverState();
            if (res.data.enabled) {
                startRecTimeInterval();
            } else {
                clearRecTimeInterval();
            }
        } catch (err) {
            console.log({ err }, this);
        }
    };

    const _didMount /*componentDidMount*/ = () => {
        apiStore.updateReceiverState();
        setTimeout(() => {
            setState({
                timeReceive: getTimeReceive()
            });
            console.log({
                receiverState: apiStore.receiverState.enabled
            });
            if (apiStore.receiverState.enabled) {
                startRecTimeInterval();
            }
        }, 1000);
    };

    const _willUnmount /*componentWillUnmount*/ = () => {
        console.log('Unmount receiverView');
        clearRecTimeInterval();
    };

    React.useEffect(() => {
        console.info('ReceiverView useEffect START');
        _didMount();
        return () => {
            console.info('ReceiverView useEffect STOP');
            _willUnmount();
        };
    }, []);

    const clearRecTimeInterval = () => {
        if (recTiemeInterval != null) {
            clearInterval(recTiemeInterval);
            recTiemeInterval = null;
            console.log('Clear interval');
        }
    };

    const startRecTimeInterval = (interval = 1000) => {
        if (recTiemeInterval == null) {
            recTiemeInterval = setInterval(() => {
                setState(prev => ({
                    timeReceive: getTimeReceive()
                }));
            }, interval);
        }
    };

    return (
        <div className={classes.root}>
            <ReceiverInfo
                navPane={props => (<NavPane {...props}/>)}
                googleMap={props => (<GoogleMap {...props}/>)}
                ubxPvtMessage={serverEventStore.ubxPvtMessage}
                ubxHPPOSLLHMessage={serverEventStore.ubxHPPOSLLHMessage}
                sdSuccess={apiStore.serverState.sdSuccess}
            />
            <Button
                variant="outlined"
                color={enabled ? 'secondary' : 'primary'}
                className={classes.button}
                onClick={() => buttonClickHandler()}
            >
                {enabled ? 'Stop' : 'Start'}
            </Button>
            <Typography
                className={classes.title}
                id="time-receive"
                color="textSecondary"
                gutterBottom
                display={'inline'}
                //value={`Rec time :  ${state.timeReceive} sec`}
            >
            {`Rec time :  ${state.timeReceive} sec`}
            </Typography>}
        </div>
    );
});

export default ReceiverView;
