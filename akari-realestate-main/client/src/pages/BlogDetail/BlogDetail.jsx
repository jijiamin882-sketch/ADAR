import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogData } from '../../blogData';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ← أضف هذا
  const post = blogData.find(item => String(item.id) === id);

  if (!post) {
    return (
      <div className="blog-wrapper" style={{ textAlign: 'center', padding: '100px 20px', color: 'white' }}>
        <h2>عذراً، المقال غير موجود</h2>
        <button onClick={() => navigate(-1)} className="back-button" style={{ marginTop: '20px' }}>
          العودة للمدونة
        </button>
      </div>
    );
  }

  const getCategoryName = (type) => {
    switch (type) {
      case "news": return "أخبار وقوانين";
      case "tips": return "نصائح قانونية";
      case "guide": return "دليل الاستثمار";
      case "tourism": return "دليل سياحي";
      default: return "عام";
    }
  };

  return (
    <div className="blog-wrapper">
      
      {/* هيرو الصفحة */}
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

          {/* إذا كان المحتوى مصفوفة (مقال سياحي) */}
          {Array.isArray(post.content) && post.content.map((block, index) => {
            switch (block.type) {
              case "paragraph":
                return (
                  <p key={index} style={{ color: '#bbb', fontSize: '16px', lineHeight: '1.9', marginBottom: '20px' }}>
                    {block.text}
                  </p>
                );
              case "heading":
                return (
                  <h2 key={index} style={{ color: '#f1c991', fontSize: '1.4rem', fontWeight: '700', margin: '30px 0 16px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {block.text}
                  </h2>
                );
              case "list":
                return (
                  <ul key={index} style={{ listStyle: 'none', padding: 0, marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {block.items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#bbb', fontSize: '15px', lineHeight: '1.8' }}>
                        <span style={{ color: '#f1c991', fontWeight: 'bold', flexShrink: 0, marginTop: '5px' }}>◆</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              default:
                return null;
            }
          })}

          {/* إذا كان المحتوى نص HTML (مقالات قديمة) */}
          {!Array.isArray(post.content) && (
            <div 
              className="detail-body" 
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          )}

          <div className="detail-footer">
            {/* ← تغيير من Link إلى button مع navigate(-1) */}
            <button onClick={() => navigate(-1)} className="back-button">
              ← العودة إلى المدونة
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BlogDetail;