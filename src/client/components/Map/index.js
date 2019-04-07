import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GoogleMapReact from 'google-map-react';
import { API_KEY } from '../../../../user-config';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';

const styles = theme => ({
    root: {}
});

const AnyReactComponent = ({ text }) => <div><GpsFixedIcon/></div>;

class GoogleMap extends React.Component {
    static defaultProps = {
        center: {
            lat: 54.93,
            lng: 82.93
        },
        zoom: 15
    };

    handleApiLoaded = (map, maps) => {
        console.log({ map, maps });
    };

    render = () => {
        const { classes } = this.props;
        return (
            <div>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: API_KEY }}
                    //defaultCenter={GoogleMap.defaultProps.center}
                    defaultZoom={GoogleMap.defaultProps.zoom}
                    center={this.props.center}
                    zoom={this.props.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) =>
                        this.handleApiLoaded(map, maps)
                    }
                >
                    <AnyReactComponent
                        lat={this.props.center.lat}
                        lng={this.props.center.lng}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </div>
        );
    };
}

export default withStyles(styles, { withTheme: true })(GoogleMap);
