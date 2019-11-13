import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './views/app';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';
import {apiStore, uiStore, serverEventStore} from './stores';
//import ScrollRouterStore from './stores/scroll-router-store';
import routes, { ScrollRouter } from './routes';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    }
});

//const browserHistory = createBrowserHistory();
//const scrollRoutingStore = new ScrollRouterStore(routes);



ReactDOM.render(
    <Router>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <App>
                <Switch>
                    <ScrollRouter />
                </Switch>
            </App>
        </MuiThemeProvider>
    </Router>,
    document.getElementById('app')
);
