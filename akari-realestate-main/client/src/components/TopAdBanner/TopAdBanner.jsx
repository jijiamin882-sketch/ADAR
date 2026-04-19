import React from 'react';
import './TopAdBanner.css';

export default function TopAdBanner() {
  return (
    <div className="top-ad-wrapper">
      <div className="ad-label">إعلان</div>
      
      {/* حاوية الصورة */}
      <div className="ad-image-container">
        <img 
          src="https://z-cdn-media.chatglm.cn/files/a5c4f98a-254c-4946-9d70-ecc5d3252c6.png?auth_key=1876453041-72c554429e247cdbfc050630e30e7ba-0-aa20de2be56934822b5ea70d80c3663b" 
          alt="إعلان منصة أكاري العقارية"
          className="ad-image"
        />
      </div>
    </div>
  );
}