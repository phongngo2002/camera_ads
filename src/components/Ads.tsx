import React, { useState, useEffect } from "react";

function ImageSlider({ apiData }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tải danh sách ảnh từ API khi component được render
  useEffect(() => {
    setImages(apiData);
  }, [apiData]);

  // Hàm để chuyển ảnh tiếp theo
  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Hàm để chuyển ảnh trước đó
  const previousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    // Tự động chuyển ảnh sau một khoảng thời gian
    const interval = setInterval(() => {
      nextImage();
    }, 5000); // Đổi số 5000 thành khoảng thời gian bạn muốn hiển thị mỗi ảnh (đơn vị là mili giây)

    // Clear interval khi component unmount
    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  return (
    <div>
      <div>
        <button onClick={previousImage}>Ảnh trước</button>
        <button onClick={nextImage}>Ảnh tiếp theo</button>
      </div>
      <img src={images[currentIndex]} alt={`Ảnh ${currentIndex + 1}`} />
    </div>
  );
}

export default ImageSlider;