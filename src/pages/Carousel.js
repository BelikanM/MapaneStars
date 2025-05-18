import React from 'react';
import Slider from 'react-slick';
import AuthComponent from './AuthComponent';
import Liste from './Liste';
import Upload from './Upload';
import Parametres from './Parametres';
import Update from './Update';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carousel() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    return (
        <Slider {...settings}>
            <div><AuthComponent /></div>
            <div><Liste /></div>
            <div><Upload /></div>
            <div><Parametres /></div>
            <div><Update /></div>
        </Slider>
    );
}
