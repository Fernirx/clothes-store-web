import React from 'react';

export default function ShopTopbar() {
  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 40px',
      backgroundColor: '#000000',
      borderBottom: '1px solid #e5e5ea'
    }}>
      

      {/* Thanh tìm kiếm */}
      <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm áo thun, quần jean..." 
          style={{ 
            width: '100%', padding: '10px 16px', borderRadius: '20px',
            border: '1px solid #d2d2d7', backgroundColor: '#f5f5f7',
            outline: 'none', fontSize: '14px', position:'right'
          }}
        />
      </div>

      {/* Cụm icon bên phải (Giỏ hàng & Avatar) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Giỏ hàng (Có số lượng đính kèm) */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: '24px' }}>🛒</span>
          <span style={{
            position: 'absolute', top: '-5px', right: '-10px',
            backgroundColor: '#ff3b30', color: 'white', fontSize: '12px',
            fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px'
          }}>3</span>
        </div>

        {/* Ảnh đại diện User */}
        <img 
          src="https://via.placeholder.com/40" 
          alt="User Avatar" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}