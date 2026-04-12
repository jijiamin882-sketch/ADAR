import React from "react";
import { Link } from "react-router-dom";
import "./BlogCard.css";

const BlogCard = ({ image, category, date, title, description, link }) => {
  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img src={image} alt={title} />
        <span className="blog-card-category">{category}</span>
      </div>
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span>{date}</span>
          <span>•</span>
          <span>5 دقائق للقراءة</span>
        </div>
        <h3 className="blog-card-title">{title}</h3>
        <p className="blog-card-desc">{description}</p>
        <Link to={link} className="blog-card-link">
          اقرأ المزيد
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" transform="scale(-1,1) translate(-24,0)" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;