import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
        width: '100%'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
    },
    column: {
        flexBasis: '50%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15)
    },
    details: {
        alignItems: 'center'
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2)
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20
    },
    divider: {
        height: 1
    }
});
class NtripClient extends React.Component {
    state = {
        ntripClient: {
            host: '82.202.202.138',
            port: 2102,
            user: 'user',
            password: 'pass',
            mountPoint: 'MOUNT',
            ...this.props.connectionInfo
        }
    };

    handleNtripClientFormChanged = prop => event => {
        console.debug(event);
        const value = event.target.value || '';
        this.setState(prevState => ({
            ntripClient: {
                ...prevState.ntripClient,
                [prop]: value
            }
        }));
    };

    render() {
        const {
            connected,
            open,
            handleConnect,
            handleDisconnect,
            classes,
            ...other
        } = this.props;
        //const connected = this.props.uiStore.state.corrections.enabled;
        console.debug({ connected });

        return (
            <div className={classes.root}>
                <ExpansionPanel defaultExpanded>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1c-content"
                        id="panel1c-header"
                    >
                        <div className={classes.column}>
                            <Typography className={classes.heading}>
                                Ntrip Client
                            </Typography>
                        </div>
                        <div className={classes.column}>
                            <Typography
                                className={classes.secondaryHeading}
                                color={connected ? 'primary' : 'secondary'}
                            >
                                {connected ? 'Connected' : ''}
                            </Typography>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                        <div className={classes.column}>
                            <form
                                className={classes.container}
                                noValidate
                                autoComplete="off"
                            >
                                <div className={classes.column}>
                                    <TextField
                                        id="host-input"
                                        label="Host*"
                                        placeholder="e.g. 192.168.1.1"
                                        className={classes.textField}
                                        margin="normal"
                                        value={this.state.ntripClient.host}
                                        onChange={this.handleNtripClientFormChanged(
                                            'host'
                                        )}
                                        disabled={connected}
                                        required={true}
                                    />
                                    <TextField
                                        id="port-input"
                                        label="Port"
                                        className={classes.textField}
                                        margin="normal"
                                        value={this.state.ntripClient.port}
                                        onChange={this.handleNtripClientFormChanged(
                                            'port'
                                        )}
                                        disabled={connected}
                                    />
                                    <TextField
                                        id="mountpoint-input"
                                        label="Mount point"
                                        className={classes.textField}
                                        margin="normal"
                                        value={
                                            this.state.ntripClient.mountPoint
                                        }
                                        onChange={this.handleNtripClientFormChanged(
                                            'mountPoint'
                                        )}
                                        disabled={connected}
                                        required={true}
                                    />
                                </div>
                                <div className={classes.column}>
                                    <TextField
                                        id="user-input"
                                        label="User"
                                        className={classes.textField}
                                        margin="normal"
                                        value={this.state.ntripClient.user}
                                        onChange={this.handleNtripClientFormChanged(
                                            'user'
                                        )}
                                        disabled={connected}
                                    />
                                    <TextField
                                        id="password-input"
                                        label="User"
                                        className={classes.textField}
                                        margin="normal"
                                        value={this.state.ntripClient.password}
                                        type="password"
                                        autoComplete="current-password"
                                        onChange={this.handleNtripClientFormChanged(
                                            'password'
                                        )}
                                        disabled={connected}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className={clsx(classes.column, classes.helper)}>
                            {!connected && (
                                <Typography variant="caption">
                                    Source Table
                                    <br />
                                    <a
                                        href="#sub-labels-and-columns"
                                        className={classes.link}
                                    >
                                        Load Table
                                    </a>
                                </Typography>
                            )}
                        </div>
                    </ExpansionPanelDetails>
                    <Divider className={classes.divider} />
                    <ExpansionPanelActions>
                        <Button size="small" onClick={() => handleDisconnect({...this.state.ntripClient})}>
                            Stop
                        </Button>
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => handleConnect({...this.state.ntripClient})}
                            disabled={connected}
                        >
                            Connect
                        </Button>
                    </ExpansionPanelActions>
                </ExpansionPanel>
            </div>
        );
    }
}

NtripClient.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    connected: PropTypes.bool.isRequired,
    handleConnect: PropTypes.func.isRequired,
    handleDisconnect: PropTypes.func.isRequired,
    connectionInfo: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(NtripClient);
