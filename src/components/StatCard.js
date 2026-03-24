import React from 'react';

export default function StatCard({ title, value, change, isUp, colorClass }) {
  return (
    <div className={`sc ${colorClass}`}>
      <div className="sc-label">{title}</div>
      <div className="sc-val">{value}</div>
      <div className={`sc-ch ${isUp ? 'up' : 'dn'}`}>
        {isUp ? '▲' : '▼'} {change}
      </div>
    </div>
  );
}