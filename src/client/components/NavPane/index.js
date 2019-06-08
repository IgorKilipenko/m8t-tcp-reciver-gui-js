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
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import { GNSSfixTypes } from '../../model/ublox';

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

const fixModeMap = GNSSfixTypes;

class NavPane extends React.Component {
    static _carrSol = {
        fixed: 2,
        float: 1
    };
    getFixMode = (mode, isCarrSol) => {
        let res = 'Fix Mode: ';
        if (mode !== null) {
            if (isCarrSol) {
                res += 'DGPS';
                if (mode == NavPane._carrSol.fixed) {
                    res += '/Fixed';
                } else {
                    res += '/Float';
                }
            } else {
                mode = fixModeMap.find(m => m.val == mode);
                res += mode ? mode.name : '';
            }
        }
        return res;
    };
    render = () => {
        const {
            classes,
            fixMode = 0,
            carrierSolution = 0,
            position,
            satelitInfo
        } = this.props;
        return (
            <div className={classes.root}>
                <ExpansionPanel defaultExpanded>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1c-content"
                        id="panel1c-header"
                    />
                    <div className={classes.column}>
                        <Typography className={classes.heading}>
                            Navigation panel
                        </Typography>
                    </div>
                    <div className={classes.column}>
                        <Typography
                            className={classes.secondaryHeading}
                            color={fixMode ? 'primary' : 'secondary'}
                            value={this.getFixMode()}
                        />
                    </div>
                </ExpansionPanel>
            </div>
        );
    };
}

NavPane.propTypes = {
    classes: PropTypes.object.isRequired,
    fixMode: PropTypes.bool.isRequired,
    position: PropTypes.object.isRequired,
    satelitInfo: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(NavPane);
