import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MiniDrawer from '../components/root';
import ApiSocket from '../components/api-socket';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { serverEvents, events as EVENTS } from '../components/server-events';

const api = new ApiSocket();

const styles = theme => ({});

@inject('apiStore')
@inject('serverEventStore')
@withRouter
@observer
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            gps: {},
            server: {}
        };
    }

    handleServerEvents = (event, msg) => {
        this.props.serverEventStore.setMessage(event, msg);
    }


    componentDidMount = async () => {
        
        this.props.apiStore.updateServerState();
        this.props.apiStore.updateReceiverState();

        this.timeoutHandler = setTimeout(() => {
            this.props.apiStore.updateWiFiList();
        }, 1000);

        serverEvents.onDebugMessage(msg => this.handleServerEvents(EVENTS.debug, msg));
        serverEvents.onUbxNavMessage(msg => this.handleServerEvents(EVENTS.ubxNav, msg))
    };

    componentWillUnmount = () => {
        if (this.timeoutHandler){
            clearTimeout(this.timeoutHandler)
        }
    }



    render() {
        const { gps } = this.state;
        return (
            <div>
                <Helmet>
                    {/*<meta charSet="ANSI" />*/}
                    {/*<meta charSet="Windows-1252" />*/}
                    <meta charSet="utf-8" />
                    <title>ESP GPS</title>
                    {/*<link rel="icon" href={favicon}/>
                    <meta name="msapplication-TileImage" content={favicon}/>*/}
                    <meta name="theme-color" content="#9CC2CE" />
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
                    />
                    <link
                        href="https://fonts.googleapis.com/css?family=Montserrat+Alternates:300,300i,400,400i,500,500i,600,600i&amp;subset=cyrillic"
                        rel="stylesheet"
                    />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
                </Helmet>
                <MiniDrawer>
                    {/*<Button onClick={async () => this.sendGnssCmd()}>
                        {gps.enabled ? 'Stop GPS' : 'Start GPS'}
                    </Button>
                    <Button>Тест utf-8</Button>*/}
                    {this.props.children} 
                </MiniDrawer>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(App);
