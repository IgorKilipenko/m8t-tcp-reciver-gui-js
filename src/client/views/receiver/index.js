import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ApiSocket from '../../components/api-socket';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

const api = new ApiSocket();

const styles = theme => ({
    root: {
        //display: 'flex'
    },
    button: {
        margin: theme.spacing.unit
    }
});

@inject('apiStore')
@withRouter
@observer
class ReceiverView extends React.Component {
    state = {
        timeReceive: 0
    };

    startRecTimeInterval = () => {
        const interval = setInterval(() => {
            let date = new Date(this.props.apiStore.timeReceive);
            date = ('00' + date.getUTCHours()).slice(-2) + ':' + ('00' + date.getUTCMinutes()).slice(-2) + ':' + ('00' + date.getUTCSeconds()).slice(-2) + '.' + ('00' + date.getUTCMilliseconds()).slice(-2);
            //date.setTime(this.props.apiStore.timeReceive);
            this.setState(prev => ({
                timeReceive: date
            }));
        }, 1000);
        return interval;
    };

    buttonClickHandler = async () => {
        this.props.apiStore.updateServerState();
        try {
            const { enabled } = this.props.apiStore.receiverState;
            const res = await api.setReceive(!enabled);
            const receiverState = {};
            receiverState.enabled = res.data.enabled;
            if (res.data.enabled) {
                receiverState.timeStart = res.data.timeStart;
                //this.props.apiStore.setReceiverState({ ...receiverState });
                this.reqInterval = this.startRecTimeInterval();
                //console.log({time:this.props.apiStore.timeReceive})
            } else {
                if (this.reqInterval) {
                    clearInterval(this.reqInterval);
                }
                receiverState.timeStart = 0;
                this.setState({ timeReceive: 0 });
            }
            this.props.apiStore.setReceiverState({ ...receiverState });
        } catch (err) {
            console.log({ err }, this);
        }
    };

    componentDidMount = async () => {
        try {
            const resp = await api.getReceiverState();
            //console.log({ res });
            const receiverState = { enabled: resp.data.enabled };
            if (receiverState.enabled) {
                receiverState.timeStart = resp.data.timeStart;
                this.reqInterval = this.startRecTimeInterval();
            }
            this.props.apiStore.setReceiverState({ ...receiverState });
            
            //this.setState({ enabled: resp.data.enabled || false });
        } catch (err) {
            console.log({ err }, this);
        }
    };

    componentWillUnmount = () => {
        if (this.reqInterval) {
            clearInterval(this.reqInterval);
        }
    };

    render() {
        const { classes } = this.props;
        const enabled = this.props.apiStore.receiverState.enabled;
        return (
            <div className={classes.root}>
                <div>{`Rec time :  ${this.state.timeReceive} sec`}</div>
                <Button
                    variant="outlined"
                    color={enabled ? 'secondary' : 'primary'}
                    className={classes.button}
                    onClick={() => this.buttonClickHandler()}
                >
                    {enabled ? 'Stop' : 'Start'}
                </Button>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ReceiverView);
