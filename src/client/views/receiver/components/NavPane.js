import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import { GNSSfixTypes } from '../../../model/ublox/ClassIds';
import green from '@material-ui/core/colors/green';

const useStyles = makeStyles(theme => ({
    receiverComponent: {
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
    },
    carrFix: {
        color: green[800]
    }
}));

const fixModeMap = GNSSfixTypes;
const CARR_SOL = {
    fixed: 2,
    float: 1
};
const NavPane = props => {
    const classes = useStyles();
    const theme = useTheme();
    const { fixMode = 0, carrierSolution = 0, position, satelitInfo } = props;

    const getFixMode = (mode, carrSol) => {
        let res = '';
        if (mode !== null) {
            mode = fixModeMap.find(m => m.val == mode);
            res += mode ? mode.name : '';
            if (carrSol) {
                res += '/DGNSS';
                if (carrSol == CARR_SOL.fixed) {
                    res += '/Fixed';
                } else {
                    res += '/Float';
                }
            }
        }
        return res;
    };

    return (
        <div className={classes.receiverComponent}>
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                >
                    <div className={classes.column}>
                        <Typography
                            className={clsx(classes.heading, {
                                [classes.carrFix]: carrierSolution == 2
                            })}
                        >
                            {`Fix Mode: ${getFixMode(
                                fixMode,
                                carrierSolution
                            )}`}
                        </Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    <div className={classes.column}>
                        {position && (
                            <React.Fragment>
                                <Typography>
                                    {`Latitude: ${position.latitude.toFixed(
                                        8
                                    )}`}
                                </Typography>
                                <Typography>
                                    {`Longitude: ${position.longitude.toFixed(
                                        8
                                    )}`}
                                </Typography>
                                <Typography>
                                    {`HeightMSL: ${position.heightMSL.toFixed(
                                        3
                                    )}`}
                                </Typography>
                            </React.Fragment>
                        )}
                    </div>

                    <div className={classes.column} />
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <Divider />
        </div>
    );
};

/*
NavPane.propTypes = {
    classes: PropTypes.object.isRequired,
    fixMode: PropTypes.number.isRequired,
    carrierSolution: PropTypes.number.isRequired,
    position: PropTypes.object.isRequired,
    satelitInfo: PropTypes.object.isRequired
};*/

export default NavPane;
