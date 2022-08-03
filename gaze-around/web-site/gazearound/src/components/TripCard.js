import React from 'react';
import { Scrollbar } from 'swiper';

import distImg from '../resources/images/distance.png';
import timeImg from '../resources/images/time.png';
import './TripCard.css';

export default class TripCard extends React.Component {
    componentDidMount() {

    }

    formatDistance(distance) {
        let dist = typeof distance === 'number' ? distance : (Number(distance) || 0);

        const captionStarting = "Расстояние до объекта: ";

        const captionEnding = dist > 1000
            ? `${(dist / 1000).toFixed(1)} км.`
            : `${dist.toFixed(0)} м.`;

        return captionStarting + captionEnding;
    }

    formatTime(travelTime) {
        let tvlTime = typeof travelTime === 'number' ? travelTime : (Number(travelTime) || 0);

        const captionStarting = "Время в пути: ";

        return captionStarting + tvlTime.toFixed(0) + " мин.";
    }

    renderInfoRow(imageSrc, value) {
        return <div className='trip-card-info-row'>
            <div>
                <img className='trip-card-info-image' src={imageSrc} />
            </div>
            <div className='trip-card-info-value'>
                {value}
            </div>
        </div>
    }

    render() {
        const { trip, avgHumanSpeed } = this.props;

        return (
            <div className='trip-card'>
                <div className='trip-card-status-container'>
                    <div className='trip-card-status'>
                        <div className='trip-card-status-badge-outer'>
                            <div className='trip-card-status-badge-inner' />
                        </div>
                        <div className='trip-card-statis-text'>
                            Достопримечательность
                        </div>
                    </div>
                </div>
                <div className='trip-card-body'>
                    <div className='trip-card-header' title={trip.name}>
                        {trip.name.length < 55 ? trip.name : trip.name.substring(0, 55) + "..."}
                    </div>
                    <div className='trip-card-content'>
                        {this.renderInfoRow(distImg, this.formatDistance(trip.dist))}
                        {this.renderInfoRow(timeImg, this.formatTime(trip.travelTime))}
                    </div>
                </div>
            </div>
        );
    }
}