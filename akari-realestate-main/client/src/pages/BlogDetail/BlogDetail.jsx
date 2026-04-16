import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogData } from '../../blogData'; // تأكد من مسار الاستيراد الصحيح
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams(); // جلب ID من الرابط
  const post = blogData.find(item => item.id === parseInt(id));

  // في حال عدم وجود المقال
  if (!post) {
    return (
      <div className="blog-wrapper">
        <div className="blog-container" style={{ textAlign: 'center', padding: '100px 0', color: 'white' }}>
          <h2>عذراً، المقال غير موجود</h2>
          <Link to="/blog" className="back-link">العودة للمدونة</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-wrapper">
      
      {/* هيرو الصفحة (صورة المقال) */}
      <div className="detail-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="detail-hero-overlay">
          <div className="detail-container">
            <span className="detail-category">{post.category}</span>
            <h1 className="detail-title">{post.title}</h1>
            <div className="detail-meta">
              <span className="detail-date">{post.date}</span>
              <span className="detail-separator">•</span>
              <span className="detail-author">تحرير العقار</span>
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