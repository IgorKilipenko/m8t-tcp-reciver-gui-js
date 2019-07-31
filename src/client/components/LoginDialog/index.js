import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing.unit
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 'auto'
    }
}));

const LoginDialog = props => {
    const classes = useStyles();
    const theme = useTheme();
    const { open, ssid, onCloseDialog } = props;

    const [state, setState] = React.useState({
        showPassword: false,
        login: ''
    });

    const handleClose = () => {
        setState({ open: false });
    };

    const handleChange = prop => event => {
        setState({ [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setState(state => ({ showPassword: !state.showPassword }));
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {`Enter yore login ${ssid ? 'to ' + ssid : ''}`}
                </DialogTitle>
                <DialogContent>
                    {/*<TextField
                            id="outlined-adornment-login"
                            className={classNames(
                                classes.margin,
                                classes.textField
                            )}
                            //variant="outlined"
                            label="Login"
                            value={state.weight}
                            onChange={handleChange('login')}
                        />*/}
                    <TextField
                        id="outlined-adornment-password"
                        className={classNames(
                            classes.margin,
                            classes.textField
                        )}
                        variant="outlined"
                        type={state.showPassword ? 'text' : 'password'}
                        label="Password"
                        autoComplete="current-password"
                        value={state.password}
                        onChange={handleChange('password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={handleClickShowPassword}
                                    >
                                        {state.showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            onCloseDialog &&
                                onCloseDialog(ssid, state.password, false);
                        }}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onCloseDialog &&
                                onCloseDialog(ssid, state.password, true);
                        }}
                        color="primary"
                    >
                        Connect
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

/*
LoginDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    ssid: PropTypes.string
};*/

export default LoginDialog;
