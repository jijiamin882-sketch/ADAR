import React from 'react';
import './TopAdBanner.css';
import { useTranslation } from "react-i18next"; // استدعاء الترجمة

export default function TopAdBanner() {
  const { t } = useTranslation(); // تعريف الترجمة

  return (
    <div className="top-ad-wrapper">
      <div className="ad-label">{t('top_ad_label')}</div>
      
      {/* حاوية الصورة */}
      <div className="ad-image-container">
        <img 
          src="https://z-cdn-media.chatglm.cn/files/a5c4f98a-254c-4946-9d70-ecc5d3252c6.png?auth_key=1876453041-72c554429e247cdbfc050630e30e7ba-0-aa20de2be56934822b5ea70d80c3663b" 
          alt={t('top_ad_alt_text')}
          className="ad-image"
        />
      </div>
    </div>
  );
}