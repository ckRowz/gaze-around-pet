import React from 'react';

import './CircleButton.css';
import { TailSpin } from 'react-loader-spinner';

export default class CircleButton extends React.Component {
    render() {
        const { image, isLoading } = this.props;

        return (

            <div className='circle-button-container' onClick={(e) => this.props.onClick && this.props.onClick(e)}>
                {Boolean(isLoading)
                    ? <TailSpin wrapperClass='circle-button-spinner' color='#3970A8'/>
                    : <img className='circle-button-image' src={image} />}
            </div>
        );
    }
}