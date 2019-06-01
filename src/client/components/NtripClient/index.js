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


const styles = theme => ({
    root: {
        width: '100%'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
    },
    column: {
        flexBasis: '33.33%'
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
    }
});
class NtripClient extends React.Component {
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
        console.debug({connected});

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
                        <div className={classes.column} />
                        <div className={classes.column}>
                            <Chip label="Barbados" onDelete={() => {}} />
                        </div>
                        <div className={clsx(classes.column, classes.helper)}>
                            <Typography variant="caption">
                                Select your destination of choice
                                <br />
                                <a
                                    href="#sub-labels-and-columns"
                                    className={classes.link}
                                >
                                    Learn more
                                </a>
                            </Typography>
                        </div>
                    </ExpansionPanelDetails>
                    <Divider />
                    <ExpansionPanelActions>
                        <Button  size="small" onClick={handleDisconnect}>
                            Stop
                        </Button>
                        <Button
                            size="small"
                            color="primary"
                            onClick={handleConnect}
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
    handleDisconnect: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(NtripClient);
