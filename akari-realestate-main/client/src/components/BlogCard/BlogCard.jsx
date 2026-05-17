import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import BlogCard from "../../components/BlogCard/BlogCard";
import { blogData } from "../../blogData";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة
import "./BlogCard.css";

const Blog = () => {
  const { t } = useTranslation(); // تعريف الترجمة
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  
  const [activeFilter, setActiveFilter] = useState(initialType);
  const [visibleCount, setVisibleCount] = useState(6);

  // دالة تغيير الفلتر (تمت إضافتها لكي لا يحدث خطأ في الكود)
  const handleFilterChange = (key) => {
    setActiveFilter(key);
    if (key === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ type: key });
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  // تم نقل المصفوفة للداخل لتعمل مع t()، مع الإبقاء على key بالإنجليزية للفلترة
  const filters = [
    { key: 'all', label: t('blog_filter_all') },
    { key: 'news', label: t('blog_filter_news') },
    { key: 'tips', label: t('blog_filter_tips') },
    { key: 'guide', label: t('blog_filter_guide') }
  ];

  // تصفية البيانات
  const filteredData = activeFilter === 'all' 
    ? blogData 
    : blogData.filter(post => post.type === activeFilter);

  const displayedData = filteredData.slice(0, visibleCount);

  return (
    <div className="blog-wrapper">
      
      {/* هيرو المدونة */}
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>{t('blog_hero_title')}</h1>
          <p>{t('blog_hero_desc')}</p>
        </div>
      </div>

      {/* محتوى المدونة */}
      <div className="blog-container">
        
        {/* فلتر التصنيفات */}
        <div className="blog-filters">
          {filters.map(filter => (
            <button 
              key={filter.key}
              className={`blog-filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* عرض المقالات */}
        {displayedData.length > 0 ? (
          <>
            <div className="blog-grid">
              {displayedData.map(post => (
                <Link 
                  to={`/blog/${post.id}`} 
                  className="blog-card-link" 
                  key={post.id}
                >
                  <BlogCard 
                    image={post.image} 
                    category={post.category} 
                    date={post.date} 
                    title={post.title} 
                    description={post.description} 
                  />
                </Link>
              ))}
            </div>

            {/* زر عرض المزيد */}
            {filteredData.length > visibleCount && (
              <div className="blog-load-more-wrapper">
                <button className="load-more-btn" onClick={handleLoadMore}>
                  {t('blog_load_more')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="blog-empty">
            <h3>{t('blog_empty_title')}</h3>
          </div>
        )}

      </div>
    </div>
  );
};

export default Blog;