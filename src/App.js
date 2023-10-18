import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const AdsImage = (props) => {
  const { data, posId, callback, fetchImage } = props
  const { media_url: url, view_time: time, media_type, id } = data
  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };
  const videoRef = useRef(null)
  useEffect(() => {
    if (media_type === "0") {
      fetchImage(id, posId)
      setTimeout(() => {
        callback()
      }, 2000)
      // Xóa sự kiện lắng nghe khi component bị unmount
      return () => {
        clearTimeout(callback)
      };

    } else {
      setTimeout(() => {

      }, videoRef.current.duration / 2 * 1000)
      videoRef.current?.addEventListener('ended', () => {
        console.log(1);
        callback()
      })
    }

  })
  return media_type === "0" ? <img src={url} onClick={() => toggleFullScreen()} style={{ width: '100%', height: '100vh' }} alt="img" /> : <video onClick={() => toggleFullScreen()} src={url} ref={videoRef} autoPlay muted></video>
}

const App = () => {
  const webcamRef = useRef(null);
  const [data, setData] = useState([])
  const [ads, setAds] = useState()
  const fetchImage = async (adsId, posId) => {
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc);
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
  const fetchAds = async () => {
    try {
      const response = await fetch('https://dev-api.pos1b.shop/pos/ads');
      const { data } = await response.json();
      setData(data)
      setAds(data[0])
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  }
  useEffect(() => {
    fetchAds()
    // fetchImage();

    // // Sử dụng setInterval để gọi lại API sau mỗi 5 giây
    // const interval = setInterval(() => {
    //   fetchImage();
    // }, 5000);

    // // Xóa interval khi component bị unmount
    // return () => {
    //   clearInterval(interval);
    // };
  }, []);
  return (
    <>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      {/* {!ads ? 'Loading' : <AdsImage data={ads} posId={1} fetchImage={fetchImage} callback={() => {
        const currentIndex = data.findIndex(item => item.id === ads.id)
        const index = currentIndex === data.length - 1 ? 0 : currentIndex + 1
        setAds(data[index])
      }} />} */}
    </>
  );
};

export default App
