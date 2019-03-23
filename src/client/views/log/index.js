import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import { serverEvents } from '../../components/server-events';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    }
});

@inject('apiStore')
@inject('serverEventStore')
@inject('uiStore')
@withRouter
@observer
class LogView extends React.Component {
    state = {
        messages: []
    };

    handleTabChange = (event, value) => {
        this.props.uiStore.setState({ logView: { activeTab: value } });
    };
    componentDidMount = () => {};

    renderTabContent = (classes, msgs) => {
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

    render() {
        const { classes, uiStore } = this.props;
        const activeTab = uiStore.state.logView.activeTab;
        return (
            <div>
                <Tabs value={activeTab} onChange={this.handleTabChange}>
                    <Tab label="Server LOG" />
                    <Tab label="Ublox messages" />
                </Tabs>
                {activeTab === 0 &&
                    this.renderTabContent(
                        classes,
                        this.props.serverEventStore.debugMessage
                    )}
                {activeTab === 1 &&
                    this.renderTabContent(
                        classes,
                        this.props.serverEventStore.ubxNavMessage
                    )}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(LogView);
