<<<<<<< HEAD
import React from "react";

function ProductVariantForm({
    variants,
    variantCount,
=======
function ProductVariantForm({
    variants,
>>>>>>> main
    isVariantModalOpen,
    editingVariantId,
    variantForm,
    modalImages,
    isNewColorInModal,
    openAddVariant,
<<<<<<< HEAD
    openEditVariant,
=======
    editVariant,
>>>>>>> main
    closeVariantModal,
    handleVariantFormChange,
    handleModalFiles,
    setModalPrimary,
    removeModalImage,
    saveVariant,
    toggleVariantActive,
    deleteVariant,
<<<<<<< HEAD
}) {
=======
    isSavingVariant,
}) {
    const isEditMode = Boolean(editingVariantId);

>>>>>>> main
    return (
        <>
            <section className="edit-product-page__card">
                <div className="edit-product-page__card-title">
                    <span>Danh sách variants</span>
                    <button
                        type="button"
                        className="edit-product-page__btn edit-product-page__btn--primary"
                        onClick={openAddVariant}
                    >
                        + Thêm variant
                    </button>
                </div>

                {variants.length === 0 ? (
                    <div className="edit-product-page__empty-state">
                        <div className="edit-product-page__empty-icon">📦</div>
                        <div className="edit-product-page__empty-text">
                            Chưa có variant nào. Thêm màu sắc và size để bắt đầu.
                        </div>
                        <button
                            type="button"
                            className="edit-product-page__btn edit-product-page__btn--primary"
                            onClick={openAddVariant}
                        >
                            + Thêm variant đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="edit-product-page__table-wrap">
                        <table className="edit-product-page__variant-table">
                            <thead>
                                <tr>
<<<<<<< HEAD
                                    <th>Màu sắc</th>
                                    <th>Size</th>
                                    <th>SKU</th>
                                    <th>Tồn kho</th>
=======
                                    <th>id</th>
                                    <th>Màu sắc</th>
                                    <th>Mã màu</th>
                                    <th>Size</th>
                                    <th>SKU</th>
                                    <th>Tồn kho</th>
                                    <th>Tồn kho thấp nhất</th>
                                    <th>Thứ tự hiển thị</th>
>>>>>>> main
                                    <th>Giá riêng</th>
                                    <th>Trạng thái</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
<<<<<<< HEAD
                                {variants.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <span
                                                className="edit-product-page__color-dot"
                                                style={{ background: item.hex }}
                                            />
                                            {item.color}
                                        </td>
                                        <td>
                                            <span className="edit-product-page__size-badge">
                                                {item.size}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="edit-product-page__sku-text">
                                                {item.sku}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`edit-product-page__stock-num ${item.stock <= 5
                                                        ? "edit-product-page__stock-num--low"
                                                        : "edit-product-page__stock-num--ok"
                                                    }`}
                                            >
                                                {item.stock}
                                            </span>
                                            {item.stock > 0 && item.stock <= 5 && (
                                                <span className="edit-product-page__stock-low-text">
                                                    thấp
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {item.price ? (
                                                <>₫{item.price.toLocaleString()}</>
                                            ) : (
                                                <span className="edit-product-page__base-price-text">
                                                    base
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className={`edit-product-page__toggle ${item.active
                                                        ? "edit-product-page__toggle--on"
                                                        : ""
                                                    }`}
                                                onClick={() => toggleVariantActive(item.id)}
                                            />
                                        </td>
                                        <td>
                                            <div className="edit-product-page__td-actions">
                                                <button
                                                    type="button"
                                                    className="edit-product-page__btn-ghost"
                                                    onClick={() => openEditVariant(item.id)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    className="edit-product-page__btn-ghost edit-product-page__btn-ghost--danger"
                                                    onClick={() => deleteVariant(item.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
=======
                                {variants.map((item) => {
                                    const colorHex = item.colorHex || item.hex || "#888888";

                                    return (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.color}</td>
                                            <td>
                                                <span
                                                    className="edit-product-page__color-dot"
                                                    style={{ background: colorHex }}
                                                />
                                                {colorHex}
                                            </td>
                                            <td>
                                                <span className="edit-product-page__size-badge">
                                                    {item.size}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="edit-product-page__sku-text">
                                                    {item.sku}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`edit-product-page__stock-num ${item.stock <= (item.minStockLevel ?? 5)
                                                            ? "edit-product-page__stock-num--low"
                                                            : "edit-product-page__stock-num--ok"
                                                        }`}
                                                >
                                                    {item.stock}
                                                </span>
                                                {item.stock > 0 &&
                                                    item.stock <= (item.minStockLevel ?? 5) && (
                                                        <span className="edit-product-page__stock-low-text">
                                                            thấp
                                                        </span>
                                                    )}
                                            </td>
                                            <td>{item.minStockLevel ?? 5}</td>
                                            <td>{item.displayOrder ?? 0}</td>
                                            <td>
                                                {item.price ? (
                                                    <>₫{Number(item.price).toLocaleString()}</>
                                                ) : (
                                                    <span className="edit-product-page__base-price-text">
                                                        base
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={`edit-product-page__toggle ${item.active
                                                            ? "edit-product-page__toggle--on"
                                                            : ""
                                                        }`}
                                                    onClick={() => toggleVariantActive(item.id)}
                                                />
                                            </td>
                                            <td>
                                                <div className="edit-product-page__td-actions">
                                                    <button
                                                        type="button"
                                                        className="edit-product-page__btn-ghost"
                                                        onClick={() => editVariant(item.id)}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="edit-product-page__btn-ghost edit-product-page__btn-ghost--danger"
                                                        onClick={() => deleteVariant(item.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
>>>>>>> main
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <div
                className={`edit-product-page__modal-overlay ${isVariantModalOpen ? "edit-product-page__modal-overlay--open" : ""
                    }`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        closeVariantModal();
                    }
                }}
            >
                <div className="edit-product-page__modal">
                    <div className="edit-product-page__modal-title">
<<<<<<< HEAD
                        {editingVariantId ? "Sửa variant" : "Thêm variant"}
                    </div>

                    <div className="edit-product-page__row edit-product-page__row--2">
                        <div className="edit-product-page__field">
                            <label className="edit-product-page__label">
                                Màu sắc <span className="edit-product-page__req">*</span>
                            </label>
                            <input
                                type="text"
                                className="edit-product-page__input"
                                placeholder="VD: Đỏ, Xanh navy"
                                value={variantForm.color}
                                onChange={(e) =>
                                    handleVariantFormChange("color", e.target.value)
                                }
                            />
                        </div>

                        <div className="edit-product-page__field">
                            <label className="edit-product-page__label">Mã màu hex</label>
                            <div className="edit-product-page__hex-wrap">
                                <input
                                    type="text"
                                    className="edit-product-page__input"
                                    placeholder="#FF0000"
                                    value={variantForm.hex}
                                    onChange={(e) =>
                                        handleVariantFormChange("hex", e.target.value)
                                    }
                                />
                                <input
                                    type="color"
                                    className="edit-product-page__color-picker"
                                    value={variantForm.hex || "#888888"}
                                    onChange={(e) =>
                                        handleVariantFormChange("hex", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="edit-product-page__row edit-product-page__row--2">
                        <div className="edit-product-page__field">
                            <label className="edit-product-page__label">
                                Size <span className="edit-product-page__req">*</span>
                            </label>
                            <input
                                type="text"
                                className="edit-product-page__input"
                                placeholder="S, M, L, XL, 28, 30..."
                                value={variantForm.size}
                                onChange={(e) =>
                                    handleVariantFormChange("size", e.target.value)
                                }
                            />
                        </div>

                        <div className="edit-product-page__field">
                            <label className="edit-product-page__label">
                                SKU <span className="edit-product-page__req">*</span>
                            </label>
                            <input
                                type="text"
                                className="edit-product-page__input"
                                placeholder="SP001-RED-M"
                                value={variantForm.sku}
                                onChange={(e) =>
                                    handleVariantFormChange("sku", e.target.value)
                                }
                            />
                        </div>
                    </div>
=======
                        {isEditMode ? "Sửa variant" : "Thêm variant"}
                    </div>

                    {!isEditMode && (
                        <>
                            <div className="edit-product-page__row edit-product-page__row--2">
                                <div className="edit-product-page__field">
                                    <label className="edit-product-page__label">
                                        Màu sắc <span className="edit-product-page__req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="edit-product-page__input"
                                        placeholder="VD: Đỏ, Xanh navy"
                                        value={variantForm.color}
                                        onChange={(e) =>
                                            handleVariantFormChange("color", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="edit-product-page__field">
                                    <label className="edit-product-page__label">Mã màu hex</label>
                                    <div className="edit-product-page__hex-wrap">
                                        <input
                                            type="text"
                                            className="edit-product-page__input"
                                            placeholder="#FF0000"
                                            value={variantForm.hex}
                                            onChange={(e) =>
                                                handleVariantFormChange("hex", e.target.value)
                                            }
                                        />
                                        <input
                                            type="color"
                                            className="edit-product-page__color-picker"
                                            value={variantForm.hex || "#888888"}
                                            onChange={(e) =>
                                                handleVariantFormChange("hex", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="edit-product-page__row edit-product-page__row--2">
                                <div className="edit-product-page__field">
                                    <label className="edit-product-page__label">
                                        Size <span className="edit-product-page__req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="edit-product-page__input"
                                        placeholder="S, M, L, XL, 28, 30..."
                                        value={variantForm.size}
                                        onChange={(e) =>
                                            handleVariantFormChange("size", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="edit-product-page__field">
                                    <label className="edit-product-page__label">
                                        SKU <span className="edit-product-page__req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="edit-product-page__input"
                                        placeholder="SP001-RED-M"
                                        value={variantForm.sku}
                                        onChange={(e) =>
                                            handleVariantFormChange("sku", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {isEditMode && (
                        <div className="edit-product-page__row edit-product-page__row--2">
                            <div className="edit-product-page__field">
                                <label className="edit-product-page__label">Màu sắc</label>
                                <input
                                    type="text"
                                    className="edit-product-page__input"
                                    value={variantForm.color}
                                    readOnly
                                />
                            </div>

                            <div className="edit-product-page__field">
                                <label className="edit-product-page__label">Mã màu hex</label>
                                <input
                                    type="text"
                                    className="edit-product-page__input"
                                    value={variantForm.hex}
                                    readOnly
                                />
                            </div>

                            <div className="edit-product-page__field">
                                <label className="edit-product-page__label">Size</label>
                                <input
                                    type="text"
                                    className="edit-product-page__input"
                                    value={variantForm.size}
                                    readOnly
                                />
                            </div>

                            <div className="edit-product-page__field">
                                <label className="edit-product-page__label">SKU</label>
                                <input
                                    type="text"
                                    className="edit-product-page__input"
                                    value={variantForm.sku}
                                    readOnly
                                />
                            </div>
                        </div>
                    )}
>>>>>>> main

                    <div className="edit-product-page__row edit-product-page__row--2">
                        <div className="edit-product-page__field">
                            <label className="edit-product-page__label">Tồn kho</label>
                            <input
                                type="number"
                                className="edit-product-page__input"
                                min="0"
                                value={variantForm.stock}
                                onChange={(e) =>
                                    handleVariantFormChange("stock", e.target.value)
                                }
                            />
                        </div>

                        <div className="edit-product-page__field">
                            <label className="edit-product-page__label">
<<<<<<< HEAD
=======
                                Tồn kho thấp nhất
                            </label>
                            <input
                                type="number"
                                className="edit-product-page__input"
                                min="0"
                                value={variantForm.minStockLevel ?? "5"}
                                onChange={(e) =>
                                    handleVariantFormChange("minStockLevel", e.target.value)
                                }
                            />
                        </div>

                        <div className="edit-product-page__field">
                            <label className="edit-product-page__label">
                                Thứ tự hiển thị
                            </label>
                            <input
                                type="number"
                                className="edit-product-page__input"
                                min="0"
                                value={variantForm.displayOrder ?? "0"}
                                onChange={(e) =>
                                    handleVariantFormChange("displayOrder", e.target.value)
                                }
                            />
                        </div>

                        <div className="edit-product-page__field">
                            <label className="edit-product-page__label">
>>>>>>> main
                                Giá riêng
                                <span className="edit-product-page__label-note">
                                    (để trống = dùng giá base)
                                </span>
                            </label>
                            <div className="edit-product-page__price-wrap">
                                <span className="edit-product-page__price-pre">₫</span>
                                <input
                                    type="number"
                                    className="edit-product-page__input"
                                    min="0"
                                    value={variantForm.price}
                                    onChange={(e) =>
                                        handleVariantFormChange("price", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

<<<<<<< HEAD
                    {!editingVariantId && isNewColorInModal && (
=======
                    {!isEditMode && isNewColorInModal && (
>>>>>>> main
                        <div className="edit-product-page__modal-image-section">
                            <div className="edit-product-page__modal-image-title">
                                Hình ảnh màu {variantForm.color.trim()}
                            </div>

                            <label className="edit-product-page__modal-dropzone">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleModalFiles(e.target.files)}
                                />
                                <div className="edit-product-page__modal-dropzone-icon">🖼</div>
                                <div className="edit-product-page__modal-dropzone-text">
                                    Kéo thả hoặc{" "}
                                    <span className="edit-product-page__modal-dropzone-link">
                                        chọn file
                                    </span>
                                </div>
                                <div className="edit-product-page__modal-dropzone-subtext">
                                    Ảnh dùng chung cho tất cả size cùng màu này
                                </div>
                            </label>

                            <div className="edit-product-page__modal-img-grid">
                                {modalImages.map((img, index) => (
                                    <div
                                        key={img.id}
                                        className={`edit-product-page__img-thumb edit-product-page__img-thumb--small ${img.primary
                                                ? "edit-product-page__img-thumb--primary"
                                                : ""
                                            }`}
                                        onClick={() => setModalPrimary(index)}
                                    >
                                        <img
                                            src={img.src}
                                            alt={`modal-${index}`}
                                            className="edit-product-page__img"
                                        />
                                        <button
                                            type="button"
                                            className="edit-product-page__img-del"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeModalImage(index);
                                            }}
                                        >
                                            ×
                                        </button>
                                        {img.primary && (
                                            <span className="edit-product-page__primary-tag">
                                                CHÍNH
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="edit-product-page__modal-footer">
                        <button
                            type="button"
                            className="edit-product-page__btn edit-product-page__btn--outline"
                            onClick={closeVariantModal}
<<<<<<< HEAD
=======
                            disabled={isSavingVariant}
>>>>>>> main
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="edit-product-page__btn edit-product-page__btn--primary"
                            onClick={saveVariant}
<<<<<<< HEAD
                        >
                            Lưu variant
=======
                            disabled={isSavingVariant}
                        >
                            {isSavingVariant ? "Đang lưu..." : "Lưu variant"}
>>>>>>> main
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductVariantForm;