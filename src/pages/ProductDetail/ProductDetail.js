import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import Topbar from '../../components/HomeTopbar';
import { useCart } from '../../context/CartContext';

const API_BASE_URL = 'https://clothes-api.fernirx.io.vn/api/clothes';

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

export default function ProductDetail() {
  const { id: slug } = useParams();
  const { addToCart } = useCart();
  const [productInfo, setProductInfo] = useState({});
  const [allVariants, setAllVariants] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [sizesForColor, setSizesForColor] = useState([]);
  const [displayImages, setDisplayImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImgIndex, setMainImgIndex] = useState(0);
  const [activeVariant, setActiveVariant] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
        const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (!response.ok) throw new Error("Không tìm thấy sản phẩm");

        const json = await response.json();
        const data = json.data;

        if (data) {
          setProductInfo(data);
          setAllVariants(data.variants || []);

          const colorsWithImages = data.imagesByColor || [];
          setAvailableColors(colorsWithImages);

          if (colorsWithImages.length > 0) {
            setSelectedColor(colorsWithImages[0].color);
          }
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchDetailData();
  }, [slug]);

  useEffect(() => {
    if (selectedColor && availableColors.length > 0) {

      const variantsForColor = allVariants.filter(v => v.color === selectedColor);
      const availableSizesForThisColor = [...new Set(variantsForColor.map(v => v.size.toUpperCase()))];
      setSizesForColor(availableSizesForThisColor);
      if (!availableSizesForThisColor.includes(selectedSize)) {
        setSelectedSize('');
      }

      // 2.2 Cập nhật list ảnh
      const colorObj = availableColors.find(c => c.color === selectedColor);
      if (colorObj && colorObj.images) {
        const sortedImages = [...colorObj.images].sort((a, b) => (a.isPrimary === b.isPrimary) ? 0 : a.isPrimary ? -1 : 1);
        setDisplayImages(sortedImages);
      } else {
        setDisplayImages([]);
      }

      setMainImgIndex(0);
    }
  }, [selectedColor, availableColors, allVariants]);
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const matched = allVariants.find(
        // Cần in hoa v.size lên để phòng ngừa API trả về chữ thường (vd: "s")
        v => v.color === selectedColor && v.size.toUpperCase() === selectedSize
      );
      setActiveVariant(matched || null);
    } else {
      setActiveVariant(null);
    }
  }, [selectedColor, selectedSize, allVariants]);


  if (isLoading) return <div style={{ padding: '100px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  return (
    <div className="layout-wrapper">
      <div className="main-content">
        <Topbar />

        <div className="product-detail-container">

          <div className="product-gallery">
            <div className="thumbnail-list">
              {displayImages.map((img, index) => (
                <img
                  key={index}
                  src={img.imageUrl}
                  alt={`Thumbnail ${index}`}
                  className={`thumbnail-item ${mainImgIndex === index ? 'active' : ''}`}
                  onMouseEnter={() => setMainImgIndex(index)}
                />
              ))}
            </div>

            <div className="main-image">
              <img
                src={displayImages[mainImgIndex]?.imageUrl || 'https://placehold.co/600x800?text=No+Image'}
                alt={productInfo.name}
              />
            </div>
          </div>

          <div className="product-info-panel">
            <div className="sustainability-tag">{productInfo.material || 'Chất liệu tiêu chuẩn'}</div>
            <h1 className="product-title">{productInfo.name}</h1>
            <h2 className="product-category">{productInfo.brand?.name || 'Thời trang'}</h2>

            <div className="product-price">
              {(activeVariant && activeVariant.price)
                ? `${activeVariant.price.toLocaleString('vi-VN')} ₫`
                : `${productInfo.basePrice?.toLocaleString('vi-VN')} ₫`}

              {productInfo.originalPrice && (
                <span className="original-price" style={{ marginLeft: '8px' }}>
                  {productInfo.originalPrice.toLocaleString('vi-VN')} ₫
                </span>
              )}
            </div>

            <div className="color-selector" style={{ marginBottom: '20px' }}>
              <div className="size-header" style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: '500' }}>Màu sắc: {selectedColor}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {availableColors.map((cObj) => (
                  <button
                    key={cObj.color}
                    onClick={() => setSelectedColor(cObj.color)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: cObj.colorHex || '#ccc',
                      border: 'none',
                      outline: selectedColor === cObj.color ? '2px solid #111' : '1px solid #ddd',
                      outlineOffset: '2px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    title={cObj.color}
                  />
                ))}
              </div>
            </div>

            <div className="size-selector">
              <div className="size-header">
                <span>Chọn Kích Thước</span>
                <a href="#guide" style={{ color: '#707072', textDecoration: 'none' }}>Bảng quy đổi kích cỡ</a>
              </div>
              <div className="size-grid">
                {/* Dùng thẳng mảng cố định STANDARD_SIZES thay vì map data từ API */}
                {STANDARD_SIZES.map(size => {
                  const isAvailable = sizesForColor.includes(size);
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        opacity: isAvailable ? 1 : 0.4,
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        backgroundColor: !isAvailable ? '#f5f5f5' : (selectedSize === size ? '#111' : '#fff'),
                        color: !isAvailable ? '#a0a0a0' : (selectedSize === size ? '#fff' : '#111')
                      }}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginTop: '15px', marginBottom: '15px', minHeight: '24px' }}>
              {activeVariant ? (
                <span style={{ color: activeVariant.stockQuantity > 0 ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                  {activeVariant.stockQuantity > 0 ? `Còn ${activeVariant.stockQuantity} sản phẩm` : 'Sản phẩm tạm hết hàng'}
                </span>
              ) : (
                <span style={{ color: '#707072' }}>Vui lòng chọn Màu và Kích thước</span>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="btn-add-cart"
                disabled={!activeVariant || activeVariant.stockQuantity <= 0 || isAddingToCart}
                style={{
                  opacity: (!activeVariant || activeVariant.stockQuantity <= 0 || isAddingToCart) ? 0.5 : 1,
                  cursor: (!activeVariant || activeVariant.stockQuantity <= 0 || isAddingToCart) ? 'not-allowed' : 'pointer'
                }}
                onClick={async () => {
                  if (!activeVariant) return;
                  try {
                    setIsAddingToCart(true);
                    setCartMessage('');
                    await addToCart(activeVariant.id, 1);
                    setCartMessage(`✅ Đã thêm ${productInfo.name} vào giỏ hàng!`);
                    setTimeout(() => setCartMessage(''), 3000);
                  } catch (error) {
                    setCartMessage(`❌ Lỗi: ${error.message || 'Không thể thêm vào giỏ hàng'}`);
                    setTimeout(() => setCartMessage(''), 3000);
                  } finally {
                    setIsAddingToCart(false);
                  }
                }}
              >
                {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </button>
              <button
                className="btn-buy-now"
                disabled={!activeVariant || activeVariant.stockQuantity <= 0}
                style={{
                  opacity: (!activeVariant || activeVariant.stockQuantity <= 0) ? 0.5 : 1,
                  cursor: (!activeVariant || activeVariant.stockQuantity <= 0) ? 'not-allowed' : 'pointer'
                }}
              >
                Mua ngay
              </button>
            </div>

            {cartMessage && (
              <div style={{
                marginTop: '15px',
                padding: '10px 15px',
                backgroundColor: cartMessage.includes('✅') ? '#f0fdf4' : '#fef2f2',
                color: cartMessage.includes('✅') ? '#10b981' : '#ef4444',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {cartMessage}
              </div>
            )}

            <div className="product-description" style={{ marginTop: '30px' }}>
              <p>{productInfo.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}