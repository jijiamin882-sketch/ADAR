import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogData } from '../../blogData';
import './BlogDetail.css'; // الآن سيتم استخدام التنسيق بشكل كامل

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogData.find(item => item.id === parseInt(id));

  // في حال عدم وجود المقال
  if (!post) {
    return (
      <div className="blog-wrapper" style={{ textAlign: 'center', padding: '100px 20px', color: 'white' }}>
        <h2>عذراً، المقال غير موجود</h2>
        <Link to="/blog" className="back-button" style={{ marginTop: '20px', display: 'inline-block' }}>
          العودة للمدونة
        </Link>
      </div>
    );
  }

  // تحديد اسم التصنيف بالعربية
  const getCategoryName = (type) => {
    switch (type) {
      case "news": return "أخبار وقوانين";
      case "tips": return "نصائح قانونية";
      case "guide": return "دليل الاستثمار";
      default: return "عام";
    }
  };

  return (
    <div className="blog-wrapper">
      
      {/* هيرو الصفحة (يتحكم فيه الـ CSS بالكامل) */}
      <div className="detail-hero" style={{ backgroundImage: `url(${post.img})` }}>
        <div className="detail-hero-overlay">
          <div className="detail-container">
            <span className="detail-category">{getCategoryName(post.type)}</span>
            <h1 className="detail-title">{post.title}</h1>
            <div className="detail-meta">
              <span className="detail-date">{post.date}</span>
              <span className="detail-separator">•</span>
              <span className="detail-author">{post.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى المقال */}
      <div className="detail-container">
        <div className="detail-content-wrapper">
          <div 
            className="detail-body" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          
          <div className="detail-footer">
            <Link to="/blog" className="back-button">
              ← العودة إلى المدونة
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BlogDetail;