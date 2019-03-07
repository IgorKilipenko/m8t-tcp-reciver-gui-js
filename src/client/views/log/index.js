import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { serverEvents } from '../../components/server-events';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    }
});

class LogView extends React.Component {
    state = {
        messages: []
    };
    componentDidMount = () => {
        serverEvents.onOtaMessage(msg => {
            this.setState(prev => {
                const messages = [...prev.otaMessages.slice(1, 9), msg];
                return { messages };
            });
        });
        serverEvents.onMessage(msg => {
            this.setState(prev => {
                const messages = [...prev.messages.slice(1, 9), msg];
                return { messages };
            });
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <List className={classes.root}>
                {this.state.messages.map((msg, i) => (
                    <ListItem key={i}>
                        <ListItemText
                            primary={msg}
                            secondary={new Date().toDateString()}
                        />
                    </ListItem>
                ))}
            </List>
        );
    }
}

export default withStyles(styles, { withTheme: true })(LogView);
