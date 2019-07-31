import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import GoogleMapReact from 'google-map-react';
import { API_KEY } from '../../../../user-config';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        '& > div': {
            'min-height': 500,
            overflow: ['auto', '!important']
        }
    }
}));

const AnyReactComponent = ({ text }) => (
    <div>
        <GpsFixedIcon />
    </div>
);

const defaultProps = {
    center: {
        lat: 54.93,
        lng: 82.93
    },
    zoom: 15
};

const GoogleMap = props => {
    const classes = useStyles();
    const theme = useTheme();

    const handleApiLoaded = (map, maps) => {
        console.log({ map, maps });
    };

    return (
        <div className={classes.root}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: API_KEY }}
                //defaultCenter={GoogleMap.defaultProps.center}
                defaultZoom={defaultProps.zoom}
                center={props.center}
                zoom={props.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) =>
                    handleApiLoaded(map, maps)
                }
            >
                <AnyReactComponent
                    lat={props.center.lat}
                    lng={props.center.lng}
                    text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );
};

export default GoogleMap;
