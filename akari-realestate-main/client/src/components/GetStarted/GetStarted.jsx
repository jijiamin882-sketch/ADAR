 import React from "react";
import "./GetStarted.css";
import { useTranslation } from "react-i18next"; // 1. استيراد الخطاف

const GetStarted = () => {
  const { t } = useTranslation(); // 2. تعريف دالة t (هذا هو السطر الذي كان ينقصك)

  return (
    <div id="get-started" className="g-wrapper">
      <div className="paddings innerWidth g-container">
        <div className="flexColCenter inner-container">
          <span className="primaryText">{t("get_started_title")}</span>
          <span className="secondaryText">
            {t("get_started_subtitle")}
            <br />
            {t("get_started_subtitle2")}
          </span>
          <button className="button">
            {/* تأكدي أن href نص وليس true */}
            <a href="mailto:zainkeepscode@gmail.com">{t("get_started_btn")}</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;