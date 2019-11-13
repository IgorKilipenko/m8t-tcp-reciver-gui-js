import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
//import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CellWifiIcon from '@material-ui/icons/CellWifi';
import SdIcon from '@material-ui/icons/SdStorage';
import SignalCellularAlt from '@material-ui/icons/SignalCellularAlt';
import LogIcon from '@material-ui/icons/Message';
import StreamIcon from '@material-ui/icons/Input';
import SpeakerPhoneIcon from '@material-ui/icons/SpeakerPhone';
import { Link, useLocation } from 'react-router-dom';

import { CorrectionsView, CorrectionsViewInfo } from '../views';

///////////////////////////////////
import { apiStore, uiStore } from '../stores';
///////////////////////////////////

import axios from 'axios';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1
        }
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },

    /**App Bar */
    grow: {
        flexGrow: 1
    },
    sectionDesktop: {
        display: 'flex',
        paddingRight: theme.spacing(3)
        //[theme.breakpoints.up('md')]: {
        //    display: 'flex'
        //}
    }
}));

const MiniDrawer = observer(props => {
    console.debug('PROPS', { props });
    let location = useLocation()
    const [state, setState] = React.useState({
        open: false,
        status: null,
        pathname: null
    });
    const classes = useStyles();
    const theme = useTheme();

    React.useEffect(() => {
        console.info('MiniDrawer useEffect START');
        return () => {
            console.info('MiniDrawer useEffect STOP');
        };
    }, []);

    const handleDrawerOpen = () => {
        setState({ open: true });
    };

    const handleDrawerClose = () => {
        setState({ open: false });
    };

    const renderAppBar = () => {
        //const classes = useState();
        const { pathname } = location;
        return (
            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: state.open
                })}
            >
                <Toolbar disableGutters={!state.open}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawerOpen}
                        className={classNames(classes.menuButton, {
                            [classes.hide]: state.open
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap>
                        ESP GPS GUI
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <Typography variant="button" color="inherit" noWrap>
                            Time
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>
        );
    };

    const renderDrawer = () => {
        const { pathname } = location;
        return (
            <Drawer
                variant="permanent"
                className={classNames(classes.drawer, {
                    [classes.drawerOpen]: state.open,
                    [classes.drawerClose]: !state.open
                })}
                classes={{
                    paper: classNames({
                        [classes.drawerOpen]: state.open,
                        [classes.drawerClose]: !state.open
                    })
                }}
                open={state.open}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {/*=================== Home =======================*/}
                    <ListItem
                        button
                        key={1}
                        component={Link}
                        to="/"
                        selected={pathname === '/'}
                    >
                        <ListItemIcon>
                            <SpeakerPhoneIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>

                    {/*=================== StreamView =======================*/}
                    <ListItem
                        button
                        key={'stream'}
                        component={Link}
                        to="/stream"
                        selected={pathname === '/stream'}
                    >
                        <ListItemIcon>
                            <StreamIcon />
                        </ListItemIcon>
                        <ListItemText primary="Stream" />
                    </ListItem>
                </List>
                <Divider />

                {/*=================== Menu =======================*/}
                <List>
                    {/*               WifiView               */}
                    <ListItem
                        button
                        key={'wifi_config'}
                        component={Link}
                        to="/wifi_config"
                        selected={pathname === '/wifi_config'}
                    >
                        <ListItemIcon>
                            <CellWifiIcon />
                        </ListItemIcon>
                        <ListItemText primary="WiFi config" />
                    </ListItem>

                    {/*               LogView               */}
                    <ListItem
                        button
                        key={'log'}
                        component={Link}
                        to="/log"
                        selected={pathname === '/log'}
                    >
                        <ListItemIcon>
                            <LogIcon />
                        </ListItemIcon>
                        <ListItemText primary="Server logs" />
                    </ListItem>

                    {/*               StorageView               */}
                    <ListItem
                        button
                        key={'storage'}
                        component={Link}
                        to="/storage"
                        selected={pathname === '/storage'}
                    >
                        <ListItemIcon>
                            <SdIcon />
                        </ListItemIcon>
                        <ListItemText primary="SD card" />
                    </ListItem>

                    {/*           CorrectionsView                 */}
                    <ListItem
                        button
                        key={CorrectionsViewInfo.routeInfo.name}
                        component={Link}
                        to={CorrectionsViewInfo.routeInfo.path}
                        selected={
                            CorrectionsViewInfo.routeInfo.path === pathname
                        }
                    >
                        <ListItemIcon>
                            <CorrectionsViewInfo.icons.main
                                {...(apiStore.ntripState.enabled
                                    ? { color: 'secondary' }
                                    : {})}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Input corrections" />
                    </ListItem>
                </List>
            </Drawer>
        );
    };

    return (
        <div className={classes.root}>
            {renderAppBar()}
            {renderDrawer()}
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {/*props.children && React.Children.map(props.children, (ch) => <div>{ch}</div>)*/}
                {props.children && React.Children.only(props.children)}
            </main>
        </div>
    );
});

export default MiniDrawer;
