import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sb">
      <div className="sb-logo">
        <div className="sb-brand">StyleAdmin</div>
        <div className="sb-sub">Quản trị bán hàng</div>
      </div>
      <div className="sb-body">
        
        <div className="sb-sec">Tổng quan</div>
        <NavLink to="/" end className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".5"/><rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".5"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/></svg>
          Dashboard
        </NavLink>

        <div className="sb-sec">Bán hàng</div>
        <NavLink to="/orders" className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M2 8h12M2 13h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          Đơn hàng
          <span className="sb-badge">14</span>
        </NavLink>
        <NavLink to="/coupons" className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M6 4V3M6 13v-1M10 4V3M10 13v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          Khuyến mãi / Coupon
        </NavLink>
        
        <div className="sb-sec">Sản phẩm</div>
        <NavLink to="/products" className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          Sản phẩm
        </NavLink>
        <NavLink to="/reviews" className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
          Đánh giá & Bình luận
        </NavLink>

        <div className="sb-sec">Kho hàng</div>
        <NavLink to="/inventory" className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="8" width="14" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M1 8l2-6h10l2 6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6 8v7M10 8v7" stroke="currentColor" strokeWidth="1.2"/></svg>
          Tồn kho
        </NavLink>
        <NavLink to="/suppliers" className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 12V5l5-4 5 4v7H1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M5 12V9h4v3" stroke="currentColor" strokeWidth="1.3"/><path d="M11 7h4v5h-4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
          Nhà cung cấp
        </NavLink>
        <NavLink to="/brands" className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 2h10v4l-5 8-5-8V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="8" cy="5" r="1.2" fill="currentColor"/></svg>
          Thương hiệu
        </NavLink>

        <div className="sb-sec">Hệ thống</div>
        <NavLink to="/users" className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          Người dùng
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => isActive ? "sb-item on" : "sb-item"}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 015 5v3l1 2H2l1-2V6a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6 13a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4"/></svg>
          Thông báo
          <span className="sb-badge">5</span>
        </NavLink>

      </div>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-av">AD</div>
          <div>
            <div className="sb-uname">Admin</div>
            <div className="sb-urole">Quản trị viên</div>
          </div>
        </div>
      </div>
    </div>
  );
}