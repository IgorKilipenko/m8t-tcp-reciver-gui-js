import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
//import { serverEvents } from '../../components/server-events';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { observer } from 'mobx-react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';


//////////////////////////////////
import {uiStore, serverEventStore} from '../../stores'
//////////////////////////////////

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    }
}));

const LogView = observer(props => {
    const classes = useStyles();
    const theme = useTheme();

    const activeTab = uiStore.state.logView.activeTab;
    const [state, setState] = React.useState({
        messages: []
    });

    const handleTabChange = (event, value) => {
        uiStore.setState({ logView: { activeTab: value } });
    };

    const renderTabContent = (classes, msgs) => {
        if (msgs.length > 50) {
            msgs = msgs.slice(msgs.length - 50);
        }
        return (
            <div>
                {msgs.map((msg, i) => (
                    <Typography component="div" key={i}>
                        {msg}
                    </Typography>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Server LOG" />
                <Tab label="Ublox messages" />
            </Tabs>
            {activeTab === 0 &&
                renderTabContent(
                    classes,
                    serverEventStore.debugMessage
                )}
            {/*activeTab === 1 &&
                    renderTabContent(
                        classes,
                        serverEventStore.ubxNavMessage
                    )*/}
        </div>
    );
});

export default LogView;
