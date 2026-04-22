import React, { useEffect, useState } from "react";
import "./CategorySection.css";

export default function CategorySection({ productId, onSave, showToast }) {
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (productId) {
            fetchProductCategories(productId);
        }
    }, [productId]);

    useEffect(() => {
        if (onSave && selectedCategories.length > 0) {
            onSave(selectedCategories);
        }
    }, [selectedCategories, onSave]);

    const fetchProductCategories = async (productId) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await fetch(
                `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${productId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log("Chi tiết sản phẩm:", result);

            if (result.data && Array.isArray(result.data.categories)) {
                const categoryIds = result.data.categories.map((cat) => cat.id);
                setSelectedCategories(categoryIds);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh mục của sản phẩm:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");
            const accessToken = localStorage.getItem("accessToken");
            const response = await fetch(
                "https://clothes-api.fernirx.io.vn/api/clothes/admin/categories?page=0&size=100",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log("Danh sách danh mục:", result);

            if (result.data && Array.isArray(result.data.content)) {
                setAllCategories(result.data.content);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            setError(error.message || "Không thể tải danh mục");
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories((prev) => {
            const isSelected = prev.includes(categoryId);
            if (isSelected) {
                return prev.filter((id) => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handleSave = async () => {
        if (!productId) {
            alert("Không tìm thấy ID sản phẩm");
            return;
        }

        if (selectedCategories.length === 0) {
            alert("Vui lòng chọn ít nhất một danh mục");
            return;
        }

        try {
            setSaving(true);
            const accessToken = localStorage.getItem("accessToken");
            const response = await fetch(
                `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${productId}/categories`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        categoryIds: selectedCategories,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log("Cập nhật danh mục thành công:", result);

            if (showToast) {
                showToast("Đã lưu danh mục");
            } else {
                alert("Đã lưu danh mục");
            }

            if (onSave) {
                onSave(selectedCategories);
            }
        } catch (error) {
            console.error("Lỗi khi lưu danh mục:", error);
            alert(error.message || "Không thể lưu danh mục");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="category-card">
                <div className="category-card-title">Gán danh mục</div>
                <div className="category-loading">
                    Đang tải danh mục...
                </div>
            </div>
        );
    }

    return (
        <div className="category-card">
            <div className="category-card-title">Gán danh mục</div>

            {error && (
                <div className="category-error">
                    {error}
                </div>
            )}

            <div>
                {allCategories.length === 0 ? (
                    <div className="category-empty">
                        Không có danh mục nào
                    </div>
                ) : (
                    <div className="category-list">
                        {allCategories.map((category) => (
                            <label key={category.id} className="category-item">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => toggleCategory(category.id)}
                                />
                                <span className="category-name">{category.name}</span>
                                {category.description && (
                                    <span className="category-desc">{category.description}</span>
                                )}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="category-item-buttons">
                <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving || selectedCategories.length === 0}
                >
                    {saving ? "Đang lưu..." : "Lưu danh mục"}
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => setSelectedCategories([])}
                >
                    Xóa chọn
                </button>
            </div>

            <div className="category-counter">
                {selectedCategories.length} danh mục được chọn
            </div>
        </div>
    );
}