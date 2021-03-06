import React, { Fragment } from 'react';

import Index from './views/home'
import App from './views/app';
import WiFiConfigView from './views/wifi-config';
import LogView from './views/log';
import StreamView from './views/stream';
import {CorrectionsView, CorrectionsViewInfo} from './views';
//import ProductInfo from './views/product-info/product-info';
//import Products from './views/products/products';
//import Contacts from '../client/views/contacts/contacts';
import {Route} from 'react-router-dom';

const routes = [
        {
            name: 'Root',
            component: App,
            routes: [
            {
                name: 'index',
                path: '/',
                component: Index,
                exact: true,
                scrollOrder: 0,
                routes: [

                ],
                isScrollRoute: false
            },
            {
                name: 'wifi_config',
                path: '/wifi_config',
                component: WiFiConfigView,
                isScrollRoute: false
            },
            {
                name: 'log',
                path: '/log',
                component: LogView,
                isScrollRoute: false
            },
            {
                name: 'stream',
                path: '/stream',
                component: StreamView,
                isScrollRoute: false
            },
            {
                name: CorrectionsViewInfo.routeInfo.name,
                path: CorrectionsViewInfo.routeInfo.path,
                component: CorrectionsView,
                isScrollRoute: false
            }
        ]
    }
]
export default routes;

export const ScrollRouter = (props) => {
    const scrollRoutes = routes[0].routes;
    return (
            scrollRoutes.map((route,i, branch) => (
                <Route key={i} exact={route.exact} path={route.path} render={props => props.match && <route.component {...props} route={route} routes={route.routes} branch={{routes:branch}}/>} />
            ))
    )
}

