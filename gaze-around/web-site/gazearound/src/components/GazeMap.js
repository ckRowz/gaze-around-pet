import React from 'react';
import { renderToStaticMarkup } from "react-dom/server";

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import './GazeMap.css';
import L, { LatLng } from 'leaflet';

import CircleButton from './base/CircleButton';
import DefMarkerImg from '../resources/images/def-marker.png';
import DefPinImg from '../resources/images/def-pin.png';
import { baseUrl } from '../constants/const';

const requestLocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

const iconUser = new L.DivIcon({
    className: 'map-marker-container',
    html: renderToStaticMarkup(
        <img className='map-marker' src={DefMarkerImg} />
    ),
    iconAnchor: [0, 42.5]
});

const iconTrip = new L.DivIcon({
    className: 'map-marker-container',
    html: renderToStaticMarkup(
        <img className='map-marker' src={DefPinImg} />
    ),
    iconAnchor: [0, 0]
});

const CUR_LOC_ZOOM = 14;

export default class GazeMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            radius: 3500,
            userLocationAvaliable: null,
            userLocation: null,
            userLocationLoading: false,
            trips: []
        }

        this.mapRef = null;
    }

    requestLocation() {
        const setCurrentPosition = (location) => {
            console.log(location)
            this.setState({ userLocation: location, userLocationAvaliable: true },
                () => {
                    const { userLocation } = this.state;
                    if (userLocation) {
                        this.mapRef.flyTo([userLocation.coords.latitude, userLocation.coords.longitude], CUR_LOC_ZOOM)
                    }
                    this.setState({ userLocationLoading: false });
                })
        }

        const onErrorRequestLocation = (err) => {
            console.error(`err-code: ${err.code}, err-msg: ${err.message}`);
            this.setState({ userLocationAvaliable: false, userLocationLoading: false })
        }

        this.setState({ userLocationLoading: true });

        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    if (result.state === "granted") {
                        navigator.geolocation.getCurrentPosition(setCurrentPosition);
                    } else if (result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(setCurrentPosition, onErrorRequestLocation, requestLocationOptions);
                    } else if (result.state === "denied") {
                        this.setState({ userLocationAvaliable: false })
                    }
                })
                .catch(() => {
                    this.setState({ userLocationLoading: false });
                });
        } else {
            alert("Невозможно получить Ваше местоположение :( Вам будут не доступны некоторые функции приложения");
            this.setState({ userLocationLoading: false });
        }
    }

    getTrips() {
        const { radius, userLocation } = this.state;


        fetch(`${baseUrl}/Trip?radius=${radius}&lon=${userLocation.coords.longitude}&lat=${userLocation.coords.latitude}`)
            .then(response => response.json())
            .then(trips => {
                this.setState({ trips: trips })
            });
    }

    onMapCreated(map) {
        this.mapRef = map && map.target;
    }


    render() {
        const {
            userLocationAvaliable,
            userLocation,
            trips
        } = this.state;

        return (
            <div className='map-container'>
                <div className='overlay-location-button'>
                    <CircleButton
                        image={DefMarkerImg}
                        isLoading={this.state.userLocationLoading}
                        onClick={this.requestLocation.bind(this)} />
                    <CircleButton
                        image={DefPinImg}
                        onClick={this.getTrips.bind(this)} />
                </div>
                <MapContainer
                    id="map"
                    center={[57.095, 65.34]}
                    whenReady={this.onMapCreated.bind(this)}
                    zoom={CUR_LOC_ZOOM}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    zoomControl={false}
                    minZoom={3}
                    maxZoom={18}>
                    <TileLayer
                        url={'http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}'}
                    />
                    {userLocation && Boolean(userLocationAvaliable) ?
                        <Marker
                            position={new LatLng(userLocation.coords.latitude, userLocation.coords.longitude)}
                            icon={iconUser}
                        /> : null}
                    {trips.map(x => {
                        return <Marker
                            position={new LatLng(x.point.lat, x.point.lon)}
                            icon={iconTrip}
                        />
                    })}
                </MapContainer>

            </div>
        );
    }
}


/*

                <div style={{
                    position: 'absolute',
                    left: 15,
                    top: 15,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: '#CCC',
                    zIndex: 1
                }}
                    onClick={this.requestLocation.bind(this)}
                >

                </div>

*/