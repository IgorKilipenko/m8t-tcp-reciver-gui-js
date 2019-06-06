import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import NtripClient from '../../components/NtripClient';
import SignalCellularAlt from '@material-ui/icons/SignalCellularAlt';

import { NTRIP_CLIENT_DEF as userConfig } from '../../../../user-config';

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
    };

    static routeInfo = {
        path: '/corrections',
        name: 'corrections'
    };

    ntripConnInfo = userConfig;

    handlerNtripConnect = async ntripOptions => {
        const res = this.props.apiStore.ntripAction(true, ntripOptions);
        //this.props.apiStore.updateNtripState();
        if (!localStorage) {
            console.warn('localStorage is null');
        } else if (res && res.data && res.data.enabled) {
            const json = JSON.stringify(this.state.ntripClient);
            localStorage.setItem('ntripClient', json);
        }
    };
    handlerNtripDisconnect = async ntripOptions => {
        this.props.apiStore.ntripAction(false, ntripOptions);
        //this.props.apiStore.updateNtripState();
    };

    componentDidMount = () => {
        this.props.apiStore.updateNtripState();
        if (!localStorage) {
            console.warn('localStorage is null');
        } else {
            const json = localStorage.getItem('ntripClient');
            console.debug({json});
            if (json) {
                try {
                    this.ntripConnInfo = JSON.parse(json);
                    console.debug({ connectionInfo: this.ntripConnInfo});
                } catch (err) {
                    console.warn(err);
                }
            }
            if (!this.ntripConnInfo) {
                this.ntripConnInfo = userConfig;
            }
        }
    };

    render() {
        const { classes } = this.props;
        console.debug({ NTRIP: this.props.apiStore.ntripState.enabled });
        return (
            <div className={classes.root}>
                <NtripClient
                    connected={this.props.apiStore.ntripState.enabled}
                    open={true}
                    handleConnect={this.handlerNtripConnect}
                    handleDisconnect={this.handlerNtripDisconnect}
                    connectionInfo={this.ntripConnInfo}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CorrectionsView);
