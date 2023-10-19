import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Slider from "react-slick";
const AdsImage = (props) => {
    const { data, posId, callback, itemIndex, slideIndex, fetchImage } = props
    const { media_url: url, view_time: time, id } = data
    const toggleFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    };
    useEffect(() => {
        itemIndex === slideIndex && setTimeout(() => {
            fetchImage(id, posId);
        }, time / 2 * 1000);
        itemIndex === slideIndex && setTimeout(() => {
            callback()
        }, time * 1000 > 0 ? time * 1000 : 1000)

        return () => {
            clearTimeout(callback)
            clearTimeout(fetchImage(id, posId))
        };
    },)
    return <img src={url} onClick={() => toggleFullScreen()} style={{ width: '100%', height: '100vh' }} alt="img" />
}
const AdsVideo = (props) => {
    const { data, posId, callback, fetchImage, itemIndex, slideIndex } = props
    const { media_url: url, id } = data
    const toggleFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    };
    const videoRef = useRef(null)
    useEffect(() => {

        itemIndex === slideIndex && videoRef.current?.play()
        itemIndex === slideIndex && setTimeout(() => {
            fetchImage(id, posId);
        }, videoRef.current.duration / 2 * 1000);
        itemIndex === slideIndex && videoRef.current?.addEventListener('ended', () => {
            callback()
        })
        return () => {
            clearTimeout(fetchImage(id, posId))
        };
    })
    return <video onClick={() => toggleFullScreen()} src={url} ref={videoRef} controls muted></video>

}
const App = () => {
    const webcamRef = useRef(null);
    const [data, setData] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true)
    const fetchImage = async (adsId, posId) => {

        try {
            const imageSrc = webcamRef.current.getScreenshot();
            const response = await fetch('https://dev-api.pos1b.shop/camera-detect/create', {
                method: 'post',
                body: JSON.stringify({
                    ads_id: adsId,
                    pos_id: posId,
                    image: imageSrc,
                    api_key: "QzwLiKr3Vs3o6Jpg8qCMo0tMvdG0BQFYD78dLKEotenYWRRApzlTIsUq2SAqkzti"
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const { data } = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const settings = {
        dots: false,
        speed: 500,
        slidesToShow: 1,
        fade: true,
        slidesToScroll: 1,
        autoplay: false,
    };
    const sliderRef = useRef(null);

    const fetchAds = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('https://dev-api.pos1b.shop/pos/ads');
            const { data } = await response.json();
            setData(data)
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        } finally {
            setIsLoading(false)
            setCurrentIndex(0)
        }
    }
    useEffect(() => {
        fetchAds()
    }, []);
    return (
        <>
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{ position: 'absolute', right: '100%' }}
            />
            {isLoading ? 'Loading...' : <Slider {...settings} beforeChange={(currentSlide, nextSlide) => {
                setCurrentIndex(nextSlide);
            }} ref={sliderRef}>
                {data.map((item, index) => {
                    if (item.media_type === "0") {
                        return (<AdsImage data={item} posId={123} ref={sliderRef} itemIndex={index} slideIndex={currentIndex} callback={() => {
                            if (index === (data.length - 1)) {
                                fetchAds()
                            } else {
                                sliderRef.current.slickNext();
                            }
                        }} fetchImage={fetchImage} />)
                    } else {
                        return (<AdsVideo data={item} posId={123} itemIndex={index} slideIndex={currentIndex === data.length ? data.length - 1 : currentIndex} ref={sliderRef} callback={() => {
                            if (index === (data.length - 1)) {
                                fetchAds()
                            } else {
                                sliderRef.current.slickNext();
                            }
                        }} fetchImage={fetchImage} />)
                    }
                })}
            </Slider>}

            {/* {!ads ? 'Loading' : <AdsImage data={ads} posId={1} fetchImage={fetchImage} callback={() => {
                const currentIndex = data.findIndex(item => item.id === ads.id)
                const index = currentIndex === data.length - 1 ? fetchAds() : currentIndex + 1
                setAds(data[index])
            }}/>} */}
        </>
    );
};

export default App
