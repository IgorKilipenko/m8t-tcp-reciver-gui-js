import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import WifiList from '../../components/WiFiList';
import ApiSocket from '../../components/api-socket';

const apiSocket = new ApiSocket();

const styles = (theme) => ({
    root: {
        display: 'flex'
    }
});

class WiFiConfigView extends React.Component {
    constructor() {
        super();
        this.state = {
            wifiData: []
        };
    }

    componentDidMount = async () => {
        try {
            const res = await apiSocket.getWifiList();
            //console.log({ res });

                this.setState({ wifiData: res.data || [] });
        } catch (err) {
            console.log({ err }, this);
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <WifiList wifiListData={this.state.wifiData} />
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(WiFiConfigView);
