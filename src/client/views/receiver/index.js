import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ApiSocket from '../../components/api-socket';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SdIcon from '@material-ui/icons/SdStorage';
import IconButton from '@material-ui/core/IconButton';

const api = new ApiSocket();

const styles = theme => ({
    root: {
        //display: 'flex'
    },
    button: {
        margin: theme.spacing.unit
    },
    receiverCard: {
        minWidth: 275,
        maxWidth: 500
    }
});

@inject('apiStore')
@withRouter
@observer
class ReceiverView extends React.Component {
    constructor() {
        super();
        this.state = {
            timeReceive: 0
        };
        this.recTiemeInterval = null;
    }

    getTimeReceive = () => {
        let date = new Date(this.props.apiStore.timeReceive || 0);

        return this.timeToString(date);
    };

    timeToString = date => {
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

    buttonClickHandler = async () => {
        this.props.apiStore.updateServerState();
        try {
            const { enabled } = this.props.apiStore.receiverState;
            const options = [
                this.props.apiStore.serverState.sdSuccess,
                true
            ]
            const res = await api.setReceive(!enabled, ...options);
            //              const receiverState = {};
            //              receiverState.enabled = res.data.enabled;
            this.props.apiStore.updateReceiverState();
            if (res.data.enabled) {
                //          receiverState.timeStart = res.data.timeStart;
                this.startRecTimeInterval();
            } else {
                this.clearRecTimeInterval();
                //          receiverState.timeStart = 0;
                //          this.setState({ timeReceive: 0 });
            }
            //              this.props.apiStore.setReceiverState({ ...receiverState });
        } catch (err) {
            console.log({ err }, this);
        }
    };

    componentDidMount = async () => {
        this.setState({
            timeReceive: this.getTimeReceive()
        });
        //      try {
        //          const resp = await api.getReceiverState();
        //          //console.log({ res });
        //          const receiverState = { enabled: resp.data.enabled };
        //          if (receiverState.enabled) {
        //              receiverState.timeStart = resp.data.timeStart;
        //              this.startRecTimeInterval();
        //          }
        //          this.props.apiStore.setReceiverState({ ...receiverState })//
        //          //this.setState({ enabled: resp.data.enabled || false });
        //      } catch (err) {
        //          console.log({ err }, this);
        //      }

        this.props.apiStore.updateReceiverState();
        if (this.props.apiStore.receiverState.enabled) {
            this.startRecTimeInterval();
        }
    };

    componentWillUnmount = () => {
        console.log('Unmount receiverView');
        this.clearRecTimeInterval();
    };

    renderReceiverInfo = classes => {
        return (
            <Card className={classes.receiverCard}>
                <CardContent>
                    <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                    >
                        {`Receiver ip: `}
                    </Typography>
                </CardContent>
                <CardActions>
                    <IconButton color="primary" className={classes.button} disabled={!this.props.apiStore.serverState.sdSuccess}>
                        <SdIcon />
                    </IconButton>
                </CardActions>
            </Card>
        );
    };

    clearRecTimeInterval = () => {
        if (this.recTiemeInterval != null) {
            clearInterval(this.recTiemeInterval);
            this.recTiemeInterval = null;
            console.log('Clear interval');
        }
    };

    startRecTimeInterval = (interval = 1000) => {
        if (this.recTiemeInterval == null) {
            this.recTiemeInterval = setInterval(() => {
                this.setState(prev => ({
                    timeReceive: this.getTimeReceive()
                }));
            }, interval);
        }
    };

    render() {
        const { classes } = this.props;
        const enabled = this.props.apiStore.receiverState.enabled;
        return (
            <div className={classes.root}>
                {this.renderReceiverInfo(classes)}
                <Button
                    variant="outlined"
                    color={enabled ? 'secondary' : 'primary'}
                    className={classes.button}
                    onClick={() => this.buttonClickHandler()}
                >
                    {enabled ? 'Stop' : 'Start'}
                </Button>
                <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                    inline={true}
                >
                    {`Rec time :  ${this.state.timeReceive} sec`}
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ReceiverView);
