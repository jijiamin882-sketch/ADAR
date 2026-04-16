import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "../../components/BlogCard/BlogCard";
import { Link } from "react-router-dom";
import { blogData } from "../../blogData";// استيراد من الملف الجديد
import "./Blog.css";

 
   

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  
  const [activeFilter, setActiveFilter] = useState(initialType);
  const [visibleCount, setVisibleCount] = useState(6); // عرض 6 مقالات في البداية

  // عند تغيير الفلتر، نعود لإظهار أول 6 مقالات فقط
  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setActiveFilter(type);
    } else {
      setActiveFilter('all');
    }
    setVisibleCount(6); // إعادة تعيين العداد
  }, [searchParams]);

  const handleFilterChange = (type) => {
    if (type === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ type });
    }
    setActiveFilter(type);
  };

  const filteredData = activeFilter === 'all' 
    ? blogData 
    : blogData.filter(post => post.type === activeFilter);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3); // إضافة 3 مقالات إضافية عند كل ضغطة
  };

  const filters = [
    { key: 'all', label: 'الكل' },
    { key: 'news', label: 'قوانين العقارات' },
    { key: 'tips', label: 'نصائح استثمارية' },
    { key: 'guide', label: 'دليل الولايات' }
  ];

  // البيانات التي سيتم عرضها حالياً (مقطوعة بناءً على العدد)
  const displayedData = filteredData.slice(0, visibleCount);

  return (
    <div className="blog-wrapper">
      
      {/* هيرو المدونة */}
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>المدونة العقارية</h1>
          <p>دليلك الشامل للاستثمار، القوانين، وأهم الأحياء في الجزائر</p>
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

        {/* شبكة المقالات */}
        {displayedData.length > 0 ? (
          <>
            <div className="blog-grid">
              {displayedData.map(post => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>

            {/* زر عرض المزيد */}
            {filteredData.length > visibleCount && (
              <div className="blog-load-more-wrapper">
                <button className="load-more-btn" onClick={handleLoadMore}>
                  عرض المزيد من المقالات
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="blog-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <h3>لا توجد مقالات في هذا التصنيف حالياً</h3>
            <button onClick={() => handleFilterChange('all')}>عرض جميع المقالات</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Blog;