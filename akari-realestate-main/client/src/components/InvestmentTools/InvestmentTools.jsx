import React from 'react';
import { FiSearch, FiTrendingUp, FiList, FiChevronLeft } from 'react-icons/fi';
import './InvestmentTools.css';
import { useTranslation } from "react-i18next"; // استدعاء الترجمة

export default function InvestmentTools() {
  const { t } = useTranslation(); // تعريف الترجمة

  // تم نقل المصفوفة للداخل لترجمتها
  const tools = [
    {
      id: 1,
      icon: <FiSearch />,
      title: t('inv_tool_1_title'),
      description: t('inv_tool_1_desc'),
      colorClass: 'icon-bg-blue'
    },
    {
      id: 2,
      icon: <FiTrendingUp />,
      title: t('inv_tool_2_title'),
      description: t('inv_tool_2_desc'),
      colorClass: 'icon-bg-green'
    },
    {
      id: 3,
      icon: <FiList />,
      title: t('inv_tool_3_title'),
      description: t('inv_tool_3_desc'),
      colorClass: 'icon-bg-purple'
    }
  ];

  return (
    <section className="inv-tools-section">
      <div className="inv-tools-header">
        <h1>{t('inv_tools_main_title')}</h1>
        <p>{t('inv_tools_main_desc')}</p>
      </div>

      <div className="inv-tools-grid">
        {tools.map((tool) => (
          <div className="inv-tools-card" key={tool.id}>
            <div className={`inv-icon-box ${tool.colorClass}`}>
              {tool.icon}
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <div className="inv-card-link">
              <span>{t('inv_tools_discover_more')}</span>
              <FiChevronLeft className="inv-link-arrow" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}