import React from 'react';

export default function Topbar({ title = "Dashboard", buttonText = "+ Thêm mới", onButtonClick }) {
  return (
    <div className="topbar">
      <span className="tb-title">{title}</span>
      <div className="tb-search">
        <svg className="tb-si" width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input type="text" placeholder="Tìm kiếm..." />
      </div>
      <button className="btn" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
}