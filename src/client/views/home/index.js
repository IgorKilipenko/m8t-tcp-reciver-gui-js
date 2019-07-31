import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ReceiverView from '../receiver';

const useStyles = makeStyles(theme => ({
    root: {
        //display: 'flex'
    }
}));

const HomeView = props => {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className={classes.root}>
            <ReceiverView />
        </div>
    );
};

export default HomeView;
