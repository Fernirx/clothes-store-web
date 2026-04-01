import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const PRESET_COLORS = [
  "#6ee7b7",
  "#a78bfa",
  "#f87171",
  "#fbbf24",
  "#60a5fa",
  "#f472b6",
];

const makeSize = () => ({
  size: "",
  sku: "",
  stock: 0,
});

const makeVariant = (i) => ({
  color: "",
  colorHex: PRESET_COLORS[i % PRESET_COLORS.length],
  sizes: [makeSize()],
  images: [],
  open: true,
});

export default function CreateProductForm() {
  const navigate = useNavigate();
  const [variants, setVariants] = useState([makeVariant(0)]);
  const [defaultVariantIndex, setDefaultVariantIndex] = useState(0);
  const [gender, setGender] = useState("UNISEX");
  const [showVariantError, setShowVariantError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    brand: "",
    category: "",
    desc: "",
    material: "",
    origin: "",
    basePrice: "",
    originalPrice: "",
    costPrice: "",
  });

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, makeVariant(prev.length)]);
  };

  const removeVariant = (i) => {
    if (variants.length === 1) return;

    const newVariants = variants.filter((_, index) => index !== i);

    let newDefaultIndex = defaultVariantIndex;
    if (defaultVariantIndex === i) newDefaultIndex = 0;
    else if (defaultVariantIndex > i) newDefaultIndex = defaultVariantIndex - 1;

    setVariants(newVariants);
    setDefaultVariantIndex(newDefaultIndex);
  };

  const setDefault = (i) => {
    setDefaultVariantIndex(i);
  };

  const toggleOpen = (i) => {
    setVariants((prev) =>
      prev.map((item, index) =>
        index === i ? { ...item, open: !item.open } : item
      )
    );
  };

  const addSize = (vi) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === vi
          ? { ...variant, sizes: [...variant.sizes, makeSize()] }
          : variant
      )
    );
  };

  const removeSize = (vi, si) => {
    setVariants((prev) =>
      prev.map((variant, index) => {
        if (index !== vi) return variant;
        if (variant.sizes.length === 1) return variant;

        return {
          ...variant,
          sizes: variant.sizes.filter((_, sizeIndex) => sizeIndex !== si),
        };
      })
    );
  };

  const updateSize = (vi, si, field, value) => {
    setVariants((prev) =>
      prev.map((variant, index) => {
        if (index !== vi) return variant;

        return {
          ...variant,
          sizes: variant.sizes.map((size, sizeIndex) =>
            sizeIndex === si
              ? {
                ...size,
                [field]: field === "stock" ? +value : value,
              }
              : size
          ),
        };
      })
    );
  };

  const updateColor = (vi, value) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === vi ? { ...variant, color: value } : variant
      )
    );
  };

  const updateColorHex = (vi, value) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === vi ? { ...variant, colorHex: value } : variant
      )
    );
  };

  const handleFiles = (vi, files) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        setVariants((prev) =>
          prev.map((variant, index) => {
            if (index !== vi) return variant;

            const newImage = {
              dataUrl: e.target.result,
              file,
              primary: variant.images.length === 0,
            };

            return {
              ...variant,
              images: [...variant.images, newImage],
            };
          })
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (vi, ii) => {
    setVariants((prev) =>
      prev.map((variant, index) => {
        if (index !== vi) return variant;

        const nextImages = variant.images.filter((_, imgIndex) => imgIndex !== ii);

        if (nextImages.length > 0 && !nextImages.some((img) => img.primary)) {
          nextImages[0] = { ...nextImages[0], primary: true };
        }

        return {
          ...variant,
          images: nextImages,
        };
      })
    );
  };

  const setPrimary = (vi, ii) => {
    setVariants((prev) =>
      prev.map((variant, index) => {
        if (index !== vi) return variant;

        return {
          ...variant,
          images: variant.images.map((img, imgIndex) => ({
            ...img,
            primary: imgIndex === ii,
          })),
        };
      })
    );
  };

  const handleSubmit = async () => {
    const { name, code, brand, category, basePrice } = form;

    // 1. Kiểm tra điều kiện bắt buộc
    if (!name || !code || !brand || !category || !basePrice) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc (*)");
      return;
    }

    const hasInvalid = variants.some(
      (v) =>
        !v.color.trim() ||
        v.sizes.length === 0 ||
        v.sizes.some((s) => !s.size.trim() || !s.sku.trim())
    );

    if (hasInvalid) {
      setShowVariantError(true);
      return;
    }
    setShowVariantError(false);

    // 2. Format dữ liệu cho khớp với API
    const generateSlug = (str) => {
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    let apiGender = "UNISEX";
    if (gender === "MEN") apiGender = "MALE";
    if (gender === "WOMEN") apiGender = "FEMALE";
    if (gender === "KIDS") apiGender = "KIDS";

    // 3. Tạo Payload chuẩn (Ép kiểu chuỗi thành số cho các ID và Giá)
    const payload = {
      brandId: parseInt(form.brand, 10) || 0,// Đảm bảo value của option là số (id)
      code: form.code,
      slug: generateSlug(form.name),
      name: form.name,
      description: form.desc,
      gender: apiGender,  
      material: form.material,
      originCountry: form.origin,
      basePrice: Number(form.basePrice) || 0,
      originalPrice: Number(form.originalPrice) || 0,
      costPrice: Number(form.costPrice) || 0,
      isNew: true,
      isOnSale: false,
      isActive: true,
      categoryIds: [Number(form.category)] // API yêu cầu mảng
    };

    console.log("📦 Đang gửi Payload:", payload);

    // 4. Gọi API POST
    try {
      const response = await fetch("https://clothes-api.fernirx.io.vn/api/clothes/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lỗi HTTP: " + response.status);
      }

      // 5. Xử lý sau khi thành công
      setShowToast(true);
      
      // Đợi 2 giây để user nhìn thấy thông báo thành công, sau đó chuyển hướng
      setTimeout(() => {
        setShowToast(false);
        navigate("/products"); // Đổi "/products" thành đường dẫn thực tế của trang ProductLists của bạn
      }, 2000);

    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      alert("Tạo sản phẩm thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="create-product-page">
      <div className="product-form">
        <div className="pf-header">
          <div className="pf-header-icon">👕</div>
          <div>
            <h1>Lưu</h1>
            <p>Mỗi biến thể = 1 màu · Mỗi màu có nhiều size · Ảnh dùng chung cho cùng màu</p>
          </div>
        </div>

        <div className="pf-card">
          <div className="pf-card-title">Thông tin cơ bản</div>
          <div className="pf-grid">
            <div className="pf-field">
              <label>
                Tên sản phẩm <span className="req">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Áo thun nam basic oversize"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />
            </div>

            <div className="pf-field">
              <label>
                Mã sản phẩm <span className="req">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: SP001"
                value={form.code}
                onChange={(e) => updateForm("code", e.target.value)}
              />
            </div>

            <div className="pf-field">
              <label>
                Thương hiệu <span className="req">*</span>
              </label>
              <select
                value={form.brand}
                onChange={(e) => updateForm("brand", e.target.value)}
              >
                <option value="">— Chọn thương hiệu —</option>
                {/* BẮT BUỘC ĐỔI VALUE THÀNH SỐ */}
                <option value="1">Zara</option> 
                <option value="2">H&M</option>
                <option value="3">Uniqlo</option>
                <option value="4">Nike</option>
              </select>
           </div>

            <div className="pf-field">
              <label>
                Danh mục <span className="req">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
              >
                <option value="">— Chọn danh mục —</option>
                {/* BẮT BUỘC ĐỔI VALUE THÀNH SỐ */}
                <option value="1">Áo thun</option>
                <option value="2">Áo sơ mi</option>
                <option value="3">Quần jean</option>
                <option value="4">Váy</option>
              </select>
            </div>

            <div className="pf-field pf-col-full">
              <label>Mô tả sản phẩm</label>
              <textarea
                placeholder="Mô tả chi tiết về sản phẩm..."
                value={form.desc}
                onChange={(e) => updateForm("desc", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pf-card">
          <div className="pf-card-title">Thuộc tính</div>
          <div className="pf-grid">
            <div className="pf-field">
              <label>Giới tính</label>
              <div className="gender-group">
                {[
                  { label: "Unisex", value: "UNISEX" },
                  { label: "Nam", value: "MEN" },
                  { label: "Nữ", value: "WOMEN" },
                  { label: "Trẻ em", value: "KIDS" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    className={`gender-pill ${gender === item.value ? "active" : ""}`}
                    onClick={() => setGender(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pf-field">
              <label>Chất liệu vải</label>
              <input
                type="text"
                placeholder="VD: 100% Cotton, Polyester"
                value={form.material}
                onChange={(e) => updateForm("material", e.target.value)}
              />
            </div>

            <div className="pf-field">
              <label>Quốc gia sản xuất</label>
              <input
                type="text"
                placeholder="VD: Việt Nam, Trung Quốc"
                value={form.origin}
                onChange={(e) => updateForm("origin", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pf-card">
          <div className="pf-card-title">Giá bán</div>
          <div className="pf-grid">
            <div className="pf-field">
              <label>
                Giá bán <span className="req">*</span>
              </label>
              <div className="price-prefix">
                <span>₫</span>
                <input
                  type="number"
                  placeholder="299000"
                  min="0"
                  value={form.basePrice}
                  onChange={(e) => updateForm("basePrice", e.target.value)}
                />
              </div>
            </div>

            <div className="pf-field">
              <label>Giá gốc (trước giảm)</label>
              <div className="price-prefix">
                <span>₫</span>
                <input
                  type="number"
                  placeholder="399000"
                  min="0"
                  value={form.originalPrice}
                  onChange={(e) => updateForm("originalPrice", e.target.value)}
                />
              </div>
            </div>

            <div className="pf-field">
              <label>Giá vốn (chỉ admin)</label>
              <div className="price-prefix">
                <span>₫</span>
                <input
                  type="number"
                  placeholder="150000"
                  min="0"
                  value={form.costPrice}
                  onChange={(e) => updateForm("costPrice", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pf-card">
          <div className="pf-card-title">
            Biến thể &amp; Hình ảnh <span style={{ color: "var(--pf-accent)" }}>*</span>
          </div>

          <div className="variant-list-header">
            <span style={{ fontSize: 13, color: "var(--pf-muted)" }}>
              Mỗi biến thể = 1 màu · Thêm nhiều size trong cùng 1 màu · Ảnh dùng chung
            </span>
          </div>

          <div id="variantList">
            {variants.map((v, vi) => {
              const isDefault = vi === defaultVariantIndex;
              const sizeCount = v.sizes.filter((s) => s.size.trim()).length;

              return (
                <div
                  key={vi}
                  className={`variant-card ${isDefault ? "is-default" : ""}`}
                >
                  <div
                    className={`variant-card-header ${v.open ? "is-open" : ""}`}
                    onClick={() => toggleOpen(vi)}
                  >
                    <div className="variant-badge">
                      <div
                        className="color-dot"
                        style={{ background: v.colorHex }}
                      />
                      <span className="variant-label">{v.color || "Màu ?"}</span>

                      <span className="size-count-badge">
                        {sizeCount > 0 ? `${sizeCount} size` : "Chưa có size"}
                      </span>

                      <span className="variant-meta">
                        {v.images.length > 0 ? `${v.images.length} ảnh` : "Chưa có ảnh"}
                      </span>

                      {isDefault && <span className="default-badge">MẶC ĐỊNH</span>}
                    </div>

                    <div className="variant-header-right">
                      <button
                        type="button"
                        className="btn-remove-variant"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVariant(vi);
                        }}
                        disabled={variants.length === 1}
                      >
                        Xóa
                      </button>

                      <span className={`chevron ${v.open ? "open" : ""}`}>▼</span>
                    </div>
                  </div>

                  {v.open && (
                    <div className="variant-card-body">
                      <div className="color-info-row">
                        <div className="field-sm">
                          <label>
                            Màu sắc <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Đỏ, Xanh navy, Trắng"
                            value={v.color}
                            onChange={(e) => updateColor(vi, e.target.value)}
                          />
                        </div>

                        <div className="field-sm">
                          <label>Hex</label>
                          <input
                            type="color"
                            value={v.colorHex}
                            style={{
                              width: "52px",
                              height: "40px",
                              padding: "4px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              background: "var(--pf-surface2)",
                              border: "1px solid var(--pf-border)",
                            }}
                            onChange={(e) => updateColorHex(vi, e.target.value)}
                          />
                        </div>

                        <div
                          className="field-sm"
                          style={{ display: "flex", alignItems: "flex-end" }}
                        >
                          <div
                            style={{
                              width: "100%",
                              background: "rgba(110,231,183,0.06)",
                              border: "1px solid rgba(110,231,183,0.15)",
                              borderRadius: "8px",
                              padding: "10px 12px",
                              fontSize: "12px",
                              color: "var(--pf-accent)",
                              lineHeight: 1.4,
                            }}
                          >
                            📸 Ảnh upload ở đây sẽ dùng chung cho <strong>tất cả size</strong> của màu này
                          </div>
                        </div>
                      </div>

                      <div className="size-section-label">Size &amp; Tồn kho</div>

                      <div className="size-list">
                        {v.sizes.map((s, si) => (
                          <div className="size-row" key={si}>
                            <div className="size-field">
                              <label>
                                Size <span className="req">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="S, M, L, XL..."
                                value={s.size}
                                onChange={(e) =>
                                  updateSize(vi, si, "size", e.target.value)
                                }
                              />
                            </div>

                            <div className="size-field">
                              <label>
                                SKU <span className="req">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="VD: SP001-RED-M"
                                value={s.sku}
                                onChange={(e) =>
                                  updateSize(vi, si, "sku", e.target.value)
                                }
                              />
                            </div>

                            <div className="size-field">
                              <label>Tồn kho</label>
                              <input
                                type="number"
                                placeholder="0"
                                min="0"
                                value={s.stock}
                                onChange={(e) =>
                                  updateSize(vi, si, "stock", e.target.value)
                                }
                              />
                            </div>

                            <button
                              type="button"
                              className="btn-remove-size"
                              onClick={() => removeSize(vi, si)}
                              disabled={v.sizes.length === 1}
                              title="Xóa size"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="btn-add-size"
                        onClick={() => addSize(vi)}
                      >
                        + Thêm size
                      </button>

                      <span className="upload-label">
                        Hình ảnh màu {v.color || "?"} · Dùng chung cho tất cả size · Click ảnh để đặt làm ảnh chính
                      </span>

                      <div
                        className="dropzone"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add("dragover");
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove("dragover");
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove("dragover");
                          handleFiles(vi, e.dataTransfer.files);
                        }}
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFiles(vi, e.target.files)}
                        />
                        <div className="dropzone-icon">🖼️</div>
                        <div className="dropzone-hint">
                          Kéo thả ảnh vào đây hoặc <span>chọn file</span>
                        </div>
                      </div>

                      <div className="img-previews">
                        {v.images.map((img, ii) => (
                          <div
                            key={ii}
                            className={`img-thumb ${img.primary ? "is-primary" : ""}`}
                            onClick={() => setPrimary(vi, ii)}
                            title="Click để đặt làm ảnh chính"
                          >
                            <img src={img.dataUrl} alt={`preview-${ii}`} />
                            <button
                              type="button"
                              className="del-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(vi, ii);
                              }}
                            >
                              ×
                            </button>
                            {img.primary && <div className="primary-tag">CHÍNH</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className={`error-msg ${showVariantError ? "show" : ""}`}>
            ⚠ Mỗi biến thể cần có: Màu sắc, ít nhất 1 size (điền Size + SKU), và ít nhất 1 ảnh
          </p>

          <button type="button" className="btn-add-variant" onClick={addVariant}>
            + Thêm màu mới
          </button>
        </div>

        <div className="actions">
          <button type="button" className="btn-cancel">
            Hủy
          </button>
          <button type="button" className="btn-submit" onClick={handleSubmit}>
           LƯU
          </button>
        </div>
      </div>

      <div className={`toast ${showToast ? "show" : ""}`}>
        ✓ Tạo sản phẩm thành công!
      </div>
    </div>
  );
}