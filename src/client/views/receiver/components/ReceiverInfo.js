import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import SdIcon from '@material-ui/icons/SdStorage';
import IconButton from '@material-ui/core/IconButton';
import { height } from 'dom-helpers';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    receiverCard: {
        minWidth: 275,
        //maxWidth: 500,
        flexDirection: 'row',
        height: '80vh'
    }
}));

const ReceiverInfo = props => {
    const classes = useStyles();
    const {
        navPane,
        googleMap,
        ubxPvtMessage,
        ubxHPPOSLLHMessage,
        sdSuccess
    } = props;
    const carrierSolution = ubxPvtMessage
        ? ubxPvtMessage.carrierSolution
        : null;
    const poss =
        carrierSolution && ubxHPPOSLLHMessage
            ? ubxHPPOSLLHMessage
            : ubxPvtMessage;

    return (
        <Card className={classes.receiverCard}>
            <CardContent>
                {poss && (
                    <div>
                        <div>
                            {navPane && navPane({
                                position: poss,
                                carrierSolution,
                                fixMode: ubxPvtMessage.fixType
                            })}
                            {googleMap && googleMap({
                                center: {
                                    lng: poss.longitude,
                                    lat: poss.latitude
                                }
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
            <CardActions>
                <IconButton
                    color="primary"
                    className={classes.button}
                    disabled={!sdSuccess}
                >
                    <SdIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default ReceiverInfo;
