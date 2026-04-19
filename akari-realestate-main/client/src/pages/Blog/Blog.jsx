import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./Blog.css";

// === استيراد آمن: إذا لم يوجد الملف لن يتوقف كل شيء ===
let blogData = [];
let BlogCard = null;

try {
  const dataModule = require("../../blogData");
  if (dataModule && dataModule.blogData) {
    blogData = dataModule.blogData;
  }
} catch (e) {
  console.warn("ملف blogData غير موجود، يتم استخدام بيانات افتراضية");
}

try {
  BlogCard = require("../../components/BlogCard/BlogCard").default;
} catch (e) {
  console.warn("مكون BlogCard غير موجود، يتم استخدام البطاقات الافتراضية");
}

// === بيانات افتراضية في حال عدم وجود الملف ===
const defaultData = [
  {
    id: 1,
    type: "news",
    title: "قانون جديد ينظم البيع العقاري عبر المنصات الرقمية في الجزائر",
    excerpt: "أصدر المجلس الشعبي الوطني قانوناً جديداً يهدف إلى تنظيم عملية البيع والشراء عبر المنصات الرقمية لضمان حقوق جميع الأطراف.",
    img: "https://i.pinimg.com/736x/18/6a/e9/186ae9d142d4c867f1a25f5b7fc69a0f.jpg",
    date: "منذ ساعتين",
    author: "تحرير ADAR",
  },
  {
    id: 2,
    type: "news",
    title: "ارتفاع طلب العقارات في العاصمة بنسبة 12% خلال الربع الأول",
    excerpt: "كشف تقرير حديث عن تزايد الاهتمام بالعقارات التجارية والسكنية في ولاية الجزائر.",
    img: "https://i.pinimg.com/1200x/57/d9/2b/57d92b2088c297bdd9ca4077748e259a.jpg",
    date: "منذ 5 ساعات",
    author: "تحرير ADAR",
  },
  {
    id: 3,
    type: "tips",
    title: "خطوات ضمان عدم الوقوع في نصب عقاري",
    icon: "alert",
    points: [
      "التأكد من عقد الملكية الأصلي لدى الحي العقاري",
      "زيارة العقار شخصياً قبل أي دفعة مالية",
      "التحقق من توثيق الوكالة في منصة ADAR",
    ],
    date: "15 جانفي 2025",
  },
  {
    id: 4,
    type: "tips",
    title: "كيف تحسب قدرتك الشرائية بشكل صحيح؟",
    icon: "check",
    points: [
      "احسب دخلك الشهري الثابت بعد الخصومات",
      "خصم المصاريف الأساسية الشهرية",
      "استخدم حاسبة القروض المتوفرة في منصة ADAR",
    ],
    date: "12 جانفي 2025",
  },
  {
    id: 5,
    type: "guide",
    title: "غرداية",
    excerpt: "عاصمة وادي ميزاب، تجمع بين الطراز المعماري الفريد والسكن الحديث بأسعار مناسبة للمستثمرين.",
    img: "https://i.pinimg.com/1200x/6c/01/1e/6c011e7623cd177d4755aa540a738d73.jpg",
    propertiesCount: "+320",
    date: "10 جانفي 2025",
  },
  {
    id: 6,
    type: "guide",
    title: "قسنطينة",
    excerpt: "مدينة الجسور المعلقة، فرص استثمارية عقارية متنوعة في قلب الشرق الجزائري.",
    img: "https://i.pinimg.com/736x/43/02/2e/43022ed310f6fdb3c4985c5f00605a21.jpg",
    propertiesCount: "+510",
    date: "8 جانفي 2025",
  },
  {
    id: 7,
    type: "neighborhoods",
    title: "براقي - الجزائر العاصمة",
    neighborhoodType: "سكني راقي",
    img: "https://i.pinimg.com/736x/81/ba/92/81ba92c0ef15339647328fc52f60b7a4.jpg",
    features: ["قرب المراكز التجارية", "أمان عالي", "خدمات متطورة"],
    date: "5 جانفي 2025",
  },
  {
    id: 8,
    type: "neighborhoods",
    title: "سيدي الهواري - وهران",
    neighborhoodType: "تاريخي وسياحي",
    img: "https://i.pinimg.com/1200x/14/85/69/1485696014180b3fb2763bd25dc4f63f.jpg",
    features: ["إطلالات بحرية", "معالم تاريخية"],
    date: "3 جانفي 2025",
  },
  {
    id: 9,
    type: "news",
    title: "انطلاق مشروع سكني جديد بشراكة بين ADAR ومجموعة الإعمار",
    excerpt: "أعلنت منصة ADAR عن شراكة استراتيجية لإنشاء مجمع سكني ذكي يضم أكثر من 200 وحدة سكنية.",
    img: "https://i.pinimg.com/1200x/be/8d/e9/be8de90f5424d9ed0c8d9755d266a7ee.jpg",
    date: "أمس",
    author: "تحرير ADAR",
  },
];

// دمج البيانات الافتراضية مع الحقيقية
const allPosts = blogData.length > 0 ? blogData : defaultData;

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "all";

  const [activeFilter, setActiveFilter] = useState(initialType);
  const [visibleCount, setVisibleCount] = useState(6);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef(null);

  // التحديث التلقائي كل 5 دقائق
  useEffect(() => {
    if (activeFilter === "news" || activeFilter === "all") {
      refreshIntervalRef.current = setInterval(() => {
        setLastUpdated(new Date());
      }, 5 * 60 * 1000);
    } else {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    }
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [activeFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "الآن";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    return `منذ ${hours} ساعة`;
  };

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
    setActiveFilter(type);
  };

  const filteredData =
    activeFilter === "all"
      ? allPosts
      : allPosts.filter((post) => post.type === activeFilter);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const filters = [
    { key: "all", label: "الكل" },
    { key: "news", label: "قوانين العقارات" },
    { key: "tips", label: "نصائح استثمارية" },
    { key: "guide", label: "دليل الولايات" },
    { key: "neighborhoods", label: "كتيب الأحياء" },
  ];

  const displayedData = filteredData.slice(0, visibleCount);
  const showRefreshBar = activeFilter === "news" || activeFilter === "all";

  // === دوال عرض كل نوع ===

  const renderDefaultCard = (post) => {
    if (BlogCard) {
      return <BlogCard key={post.id} {...post} />;
    }
    // بطاقة بديلة إذا لم يوجد BlogCard
    return (
      <div className="blog-fallback-card" key={post.id}>
        <div className="fallback-card-img">
          <img src={post.img} alt={post.title} loading="lazy" />
        </div>
        <div className="fallback-card-body">
          <span className="fallback-date">{post.date}</span>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </div>
      </div>
    );
  };

  const renderTipCard = (post) => (
    <div className="blog-tip-card" key={post.id}>
      <div className="tip-card-header">
        <div className="tip-card-icon">
          {post.icon === "alert" ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          )}
        </div>
        <h3>{post.title}</h3>
      </div>
      {post.points && post.points.length > 0 ? (
        <ul className="tip-card-list">
          {post.points.map((point, i) => (
            <li key={i}>
              <svg className="tip-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tip-card-excerpt">{post.excerpt}</p>
      )}
      <div className="tip-card-footer">
        <span className="tip-date">{post.date}</span>
        <Link to={`/blog/${post.id}`} className="tip-link">
          اقرأ التفاصيل
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
      </div>
    </div>
  );

  const renderGuideCard = (post) => (
    <div className="blog-guide-card" key={post.id}>
      <div className="guide-card-img">
        <img src={post.img} alt={post.title} loading="lazy" />
        <div className="guide-card-overlay">
          {post.propertiesCount && (
            <span className="guide-count-badge">{post.propertiesCount} عقار متاح</span>
          )}
        </div>
      </div>
      <div className="guide-card-info">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {post.title}
        </h3>
        <p>{post.excerpt}</p>
        <Link to={`/blog/${post.id}`} className="guide-explore-link">
          استكشف الولاية
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
      </div>
    </div>
  );

  const renderNeighborhoodCard = (post) => (
    <div className="blog-hood-card" key={post.id}>
      <div className="hood-card-img">
        <img src={post.img} alt={post.title} loading="lazy" />
      </div>
      <div className="hood-card-content">
        {post.neighborhoodType && (
          <span className="hood-type-badge">{post.neighborhoodType}</span>
        )}
        <h3>{post.title}</h3>
        {post.features && post.features.length > 0 && (
          <div className="hood-features-list">
            {post.features.map((f, i) => (
              <span className="hood-feature-tag" key={i}>{f}</span>
            ))}
          </div>
        )}
        <Link to={`/blog/${post.id}`} className="hood-details-link">
          التفاصيل الكاملة
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
      </div>
    </div>
  );

  const renderPost = (post) => {
    switch (post.type) {
      case "tips":
        return renderTipCard(post);
      case "guide":
        return renderGuideCard(post);
      case "neighborhoods":
        return renderNeighborhoodCard(post);
      default:
        return renderDefaultCard(post);
    }
  };

  const gridClassName =
    activeFilter === "all"
      ? "blog-grid-mixed"
      : `blog-grid-${activeFilter}`;

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

        {/* شريط التحديث التلقائي */}
        {showRefreshBar && (
          <div className="blog-refresh-bar">
            <div className="refresh-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>آخر تحديث: {getTimeAgo(lastUpdated)}</span>
              <span className="refresh-auto-text">(تحديث تلقائي كل 5 دقائق)</span>
            </div>
            <button
              className={`refresh-btn ${isRefreshing ? "spinning" : ""}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <span>تحديث الآن</span>
            </button>
          </div>
        )}

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
            <div className={`blog-grid ${gridClassName}`}>
              {displayedData.map((post) => renderPost(post))}
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
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <h3>لا توجد مقالات في هذا التصنيف حالياً</h3>
            <button onClick={() => handleFilterChange("all")}>عرض جميع المقالات</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;