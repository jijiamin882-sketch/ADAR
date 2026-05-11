import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { blogData } from "../../blogData"; // استيراد البيانات الحقيقية
import "./Blog.css";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "all";

  const [activeFilter, setActiveFilter] = useState(initialType);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const type = searchParams.get("type");
    setActiveFilter(type || "all");
    setVisibleCount(6);
  }, [searchParams]);

  const handleFilterChange = (type) => {
    if (type === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ type });
    }
  };

  const filteredData =
    activeFilter === "all"
      ? blogData
      : blogData.filter((post) => post.type === activeFilter);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const filters = [
    { key: "all", label: "الكل" },
    { key: "news", label: "أخبار وقوانين" },
    { key: "tips", label: "نصائح قانونية" },
    { key: "guide", label: "دليل الاستثمار" },
  ];

  const displayedData = filteredData.slice(0, visibleCount);

  // تحديد لون الشارة حسب النوع
  const getTypeColor = (type) => {
    switch (type) {
      case "news": return "#e74c3c";
      case "tips": return "#f39c12";
      case "guide": return "#3498db";
      default: return "#333";
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case "news": return "أخبار وقوانين";
      case "tips": return "نصائح قانونية";
      case "guide": return "دليل الاستثمار";
      default: return "عام";
    }
  };

  return (
    <div className="blog-wrapper">
      {/* هيرو المدونة */}
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>المدونة العقارية</h1>
          <p>دليلك الشامل للاستثمار، القوانين، وأهم الأحياء في الجزائر</p>
        </div>
      </div>

      <div className="blog-container">
        
        {/* فلتر التصنيفات */}
        <div className="blog-filters">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`blog-filter-btn ${activeFilter === filter.key ? "active" : ""}`}
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
              {displayedData.map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="blog-card-fallback">
                    <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                      <img 
                        src={post.img} 
                        alt={post.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s' }}
                        loading="lazy"
                      />
                      <span style={{
                        position: 'absolute', top: '10px', right: '10px', background: getTypeColor(post.type),
                        color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                      }}>
                        {getTypeName(post.type)}
                      </span>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <span style={{ fontSize: '12px', color: '#888' }}>{post.date} • {post.author}</span>
                      <h3 style={{ margin: '10px 0', fontSize: '18px', lineHeight: '1.5' }}>{post.title}</h3>
                      <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.excerpt}
                      </p>
                      {post.propertiesCount && (
                        <span style={{ display: 'inline-block', marginTop: '10px', background: '#e8f4fd', color: '#2980b9', padding: '5px 10px', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                          {post.propertiesCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

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
            <h3>لا توجد مقالات في هذا التصنيف حالياً</h3>
            <button onClick={() => handleFilterChange("all")}>عرض جميع المقالات</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;