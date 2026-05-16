import React from 'react';
import './PrivacyPolicy.css';
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  const sections = [
    {
      title: "privacy_sec1_title",
      content: [
        { type: 'text', value: "privacy_sec1_text" },
        { 
          type: 'list', 
          value: ["privacy_sec1_list_1", "privacy_sec1_list_2", "privacy_sec1_list_3", "privacy_sec1_list_4", "privacy_sec1_list_5"] 
        }
      ]
    },
    {
      title: "privacy_sec2_title",
      content: [
        { type: 'list', value: ["privacy_sec2_list_1", "privacy_sec2_list_2", "privacy_sec2_list_3", "privacy_sec2_list_4"] }
      ]
    },
    {
      title: "privacy_sec3_title",
      content: [
        { type: 'text', value: "privacy_sec3_text" }
      ]
    },
    {
      title: "privacy_sec4_title",
      content: [
        { type: 'text', value: "privacy_sec4_text" }
      ]
    },
    {
      title: "privacy_sec5_title",
      content: [
        { type: 'list', value: ["privacy_sec5_list_1", "privacy_sec5_list_2", "privacy_sec5_list_3"] }
      ]
    },
    {
      title: "privacy_sec6_title",
      content: [
        { type: 'list', value: ["privacy_sec6_list_1", "privacy_sec6_list_2", "privacy_sec6_list_3"] }
      ]
    },
    {
      title: "privacy_sec7_title",
      content: [
        { type: 'text', value: "privacy_sec7_text" }
      ]
    },
    {
      title: "privacy_sec8_title",
      content: [
        { type: 'text', value: "privacy_sec8_text" }
      ]
    },
    {
      title: "privacy_sec9_title",
      content: [
        { type: 'text', value: "privacy_sec9_text" }
      ]
    },
    {
      title: "privacy_sec10_title",
      content: [
        { type: 'text', value: "privacy_sec10_text" }
      ]
    }
  ];

  return (
    <div className="privacy-page-wrapper">
      <div className="privacy-container">
        
        <div className="privacy-header">
          <h1 className="privacy-main-title">{t('privacy_main_title')}</h1>
          <p className="privacy-update-date">{t('privacy_update_date')}</p>
        </div>

        {sections.map((section, index) => (
          <div key={index} className="privacy-section">
            <h2>{t(section.title)}</h2>
            {section.content.map((item, i) => (
              item.type === 'text' ? (
                <p key={i}>{t(item.value)}</p>
              ) : (
                <ul key={i}>
                  {item.value.map((li, idx) => {
                    // 1. نأخذ النص المترجم أولاً
                    const translatedText = t(li); 
                    
                    // 2. نتحقق إذا كان النص يحتوي على نقطتين (:) لتفعيل الـ Bold
                    if (translatedText.includes(':')) {
                      const parts = translatedText.split(':');
                      return (
                        <li key={idx}>
                          <strong>{parts[0]}:</strong>{parts[1]}
                        </li>
                      );
                    }
                    
                    // 3. إذا لم يحتوي على نقطتين، نطبعه كاملاً بدون تعديل
                    return <li key={idx}>{translatedText}</li>;
                  })}
                </ul>
              )
            ))}
          </div>
        ))}

        <div className="privacy-section">
          <h2>{t('privacy_sec11_title')}</h2>
          <p>{t('privacy_sec11_text')}</p>
        </div>

        <div className="privacy-contact-section">
          <div className="privacy-highlight-box">
            <p style={{ margin: 0, textAlign: 'center' }}>
              {t('privacy_contact_text')}
            </p>
          </div>
          <p style={{ margin: '20px 0 5px 0' }}>{t('privacy_email_label')}:</p>
          <a href="mailto:privacy@adar-dz.com" className="privacy-email-link">
            privacy@adar-dz.com
          </a>
        </div>

      </div>
    </div>
  );
}