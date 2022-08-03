import React from 'react';
import { renderToStaticMarkup } from "react-dom/server";

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import './GazeMap.css';
import L, { LatLng } from 'leaflet';

import CircleButton from './base/CircleButton';
import DefMarkerImg from '../resources/images/def-marker.png';
import DefPinImg from '../resources/images/def-pin.png';

import { baseUrl } from '../constants/const';
import TripCard from './TripCard';

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
    iconAnchor: [5, 10]
});

const iconTrip = new L.DivIcon({
    className: 'map-marker-container',
    html: renderToStaticMarkup(
        <div style={{ width: '100%', height: '100%' }}>
            <img className='map-marker' src={DefPinImg} />
        </div>
    ),
    iconAnchor: [0, 0]
});

const CUR_LOC_ZOOM = 14;

export default class GazeMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            radius: 4500,
            userLocationAvaliable: null,
            userLocation: null,
            userLocationLoading: false,
            trips: [],
            tripsLoading: false,
            showSwiper: true
        }

        this.mapRef = null;
        this.slideTo = null;

        this.hideSwiper = this.hideSwiper.bind(this);
    }

    requestLocation() {
        const setCurrentPosition = (location) => {
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

        this.setState({ tripsLoading: true });
        fetch(`${baseUrl}/Trip?radius=${radius}&lon=${userLocation.coords.longitude}&lat=${userLocation.coords.latitude}`)
            .then(response => response.json())
            .then(trips => {
                this.setState({ trips: trips, tripsLoading: false })
            })
            .catch(err => {
                console.error(err);
                this.setState({ tripsLoading: false });
            });
    }

    onMapClick = (e) => {
        const { lat, lng } = e.latlng;

        this.setState({
            userLocation: {
                coords: {
                    latitude: lat,
                    longitude: lng
                }
            }
        })
    }

    onMarkerClick = (e) => {
        this.slideTo(e.target.options.index, 1900, false)
    }

    onMapCreated(map) {
        this.mapRef = map && map.target;
        this.mapRef.on('click', (e) => this.onMapClick(e));
    }

    onSlideChange(e) {
        const { realIndex } = e;
        const { trips } = this.state;

        const curTrip = trips[realIndex];
        const location = [curTrip.point.lat, curTrip.point.lon];
        this.mapRef.flyTo(location, 18);
    }

    hideSwiper = () => {
        this.setState({trips: []})
    }

    render() {
        const {
            userLocationAvaliable,
            userLocation,
            trips
        } = this.state;

        return (
            <div className='map-container'>
                <div className='overlay-button-container'>
                    <div className='overlay-button'>
                        <CircleButton
                            image={DefMarkerImg}
                            isLoading={this.state.userLocationLoading}
                            onClick={this.requestLocation.bind(this)} />
                    </div>
                    <div className='overlay-button'>
                        {userLocation ?
                            <CircleButton
                                image={DefPinImg}
                                isLoading={this.state.tripsLoading}
                                onClick={this.getTrips.bind(this)} /> : null}
                    </div>
                </div>
                <div className='trip-card-container'>
                    {this.state.showSwiper && trips && trips.length > 0 ?
                        <div style={{width: '100%', height: '100%'}}>
                            <div className='trip-card-close-button' onClick={this.hideSwiper }>
                                x
                            </div>
                            <Swiper
                                className='trip-card'
                                onSwiper={(swiper) => {
                                    if (swiper && !Boolean(swiper.destroyed)) {
                                        this.slideTo = swiper.slideTo.bind(swiper);
                                    }
                                }}                                
                                navigation={true}
                                autoplay={true}
                                modules={[Navigation]}
                                onSlideChange={(e) => this.onSlideChange(e)}
                            //onSwiper={(e) => console.log(e)}
                            >
                                {this.state.trips.map((x) => {
                                    return (
                                        <SwiperSlide key={x.xid}>
                                            <TripCard trip={x} />
                                        </SwiperSlide>)
                                })}
                            </Swiper>
                        </div> : null}
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
                    {userLocation ?
                        <Marker
                            position={new LatLng(userLocation.coords.latitude, userLocation.coords.longitude)}
                            icon={iconUser}
                        /> : null}
                    {trips.map((x, i) => {
                        return <Marker
                            key={`tr_${i}`}
                            index={i}
                            position={new LatLng(x.point.lat, x.point.lon)}
                            icon={iconTrip}
                            eventHandlers={{
                                click: (e) => this.onMarkerClick(e)
                            }}
                        />
                    })}
                </MapContainer>

            </div >
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