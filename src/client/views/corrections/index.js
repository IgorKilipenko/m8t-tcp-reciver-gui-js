import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import NtripClient from '../../components/NtripClient';
import SignalCellularAlt from '@material-ui/icons/SignalCellularAlt';

const styles = theme => ({
    root: {
        display: 'flex'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 'auto'
    }
});

@inject('apiStore')
@inject('uiStore')
@inject('serverEventStore')
@withRouter
@observer
class CorrectionsView extends React.Component {
    static icons = {
        main: SignalCellularAlt
    }
        
    static routeInfo = {
        path:'/corrections',
        name:'corrections'
    }
    handlerNtripConnect = async () => {
        const res = await this.props.apiStore.api.setNtripClient(true);
        this.props.apiStore.updateNtripState();
    };
    handlerNtripDisconnect = async () => {
        const res = await this.props.apiStore.api.setNtripClient(false);
        this.props.apiStore.updateNtripState();
    };

    componentDidMount = () => {
        this.props.apiStore.updateNtripState();
    }

    render() {
        const { classes } = this.props;
        console.debug({NTRIP:this.props.apiStore.ntripState.enabled})
        return (
            <div className={classes.root}>
                <NtripClient
                    connected={this.props.apiStore.ntripState.enabled}
                    open={true}
                    handleConnect={this.handlerNtripConnect}
                    handleDisconnect={this.handlerNtripDisconnect}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CorrectionsView);
