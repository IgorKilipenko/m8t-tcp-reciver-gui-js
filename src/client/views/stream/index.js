import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
        display: 'flex'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 'auto'
    }
});

class StreamView extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <TextField
                id="standard-multiline-flexible"
                label="Multiline"
                multiline
                rowsMax="4"
                value="Input stream"
                className={classes.textField}
                margin="normal"
                InputProps={{
                    readOnly: true
                }}
            />
        );
    }
}

export default withStyles(styles, { withTheme: true })(StreamView);
