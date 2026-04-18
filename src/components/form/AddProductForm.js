import React, { useEffect, useMemo, useRef, useState } from "react";
import "./AddProductForm.css";
import { useNavigate } from "react-router-dom";

const GENDER_OPTIONS = [
    { label: "Unisex", value: "UNISEX" },
    { label: "Nam", value: "MEN" },
    { label: "Nữ", value: "WOMEN" },
    { label: "Trẻ em", value: "KIDS" },
];

const BRAND_OPTIONS = ["Nike", "Adidas", "Uniqlo", "Local Brand"];

function AddProductForm() {
    const navigate = useNavigate();
    // State lưu tên sản phẩm
    const [name, setName] = useState("");

    // State lưu mô tả sản phẩm
    const [description, setDescription] = useState("");

    // State lưu giá bán
    const [basePrice, setBasePrice] = useState("");

    // State lưu giá gốc
    const [originalPrice, setOriginalPrice] = useState("");

    // State lưu giá vốn
    const [costPrice, setCostPrice] = useState("");

    // State lưu mã sản phẩm
    const [code, setCode] = useState("");

    // State lưu thương hiệu
    const [brand, setBrand] = useState("");

    // State lưu giới tính sản phẩm
    const [gender, setGender] = useState("UNISEX");

    // State lưu chất liệu
    const [material, setMaterial] = useState("");

    // State lưu xuất xứ
    const [origin, setOrigin] = useState("");

    // State lưu trạng thái hiển thị trên web
    const [isActive, setIsActive] = useState(true);

    // State lưu badge NEW
    const [isNew, setIsNew] = useState(false);

    // State lưu badge SALE
    const [isSale, setIsSale] = useState(false);

    // State lưu danh sách ảnh upload
    const [images, setImages] = useState([]);

    // State lưu nội dung toast
    const [toastMessage, setToastMessage] = useState("");

    // Ref để reset input file sau khi chọn ảnh
    const fileInputRef = useRef(null);

    const totalImages = images.length;

    const summaryText = useMemo(() => {
        return {
            variants: "thêm sau",
            stock: "—",
            colorImages: totalImages > 0 ? `${totalImages} ảnh chung` : "thêm sau",
            categories: "chưa gán",
        };
    }, [totalImages]);

    const showToast = (message) => {
        setToastMessage(message);

        setTimeout(() => {
            setToastMessage("");
        }, 2800);
    };

    const handleFiles = (fileList) => {
        const files = Array.from(fileList || []);

        if (!files.length) return;

        const validFiles = files.filter((file) => file.type.startsWith("image/"));

        validFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                setImages((prev) => [
                    ...prev,
                    {
                        id: `${file.name}-${Date.now()}-${Math.random()}`,
                        src: event.target?.result || "",
                        primary: prev.length === 0,
                    },
                ]);
            };

            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleFiles(event.dataTransfer.files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const setPrimaryImage = (id) => {
        setImages((prev) =>
            prev.map((img) => ({
                ...img,
                primary: img.id === id,
            }))
        );
    };

    const removeImage = (id) => {
        setImages((prev) => {
            const nextImages = prev.filter((img) => img.id !== id);

            if (nextImages.length > 0 && !nextImages.some((img) => img.primary)) {
                nextImages[0].primary = true;
            }

            return nextImages;
        });
    };

    const handleSubmit = async () => {
        if (!name.trim() || !code.trim() || !brand || !basePrice) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
            return;
        }

        const payload = {
            brandId: Number(brand),
            code: code.trim(),
            name: name.trim(),
            description: description.trim() || "",
            gender: gender,
            material: material.trim() || "",
            originCountry: origin.trim() || "",
            basePrice: Number(basePrice),
            originalPrice: originalPrice ? Number(originalPrice) : 0,
            costPrice: costPrice ? Number(costPrice) : 0,
            isNew: isNew,
            isOnSale: isSale,
            isActive: isActive,
        };

        try {
            const response = await fetch(
                "https://clothes-api.fernirx.io.vn/api/clothes/admin/products",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();


            if (!response.ok) {
                throw new Error(data?.message || "Tạo sản phẩm thất bại");
            }

            console.log("Tạo sản phẩm thành công:", data);
            showToast("✓ Sản phẩm đã được tạo thành công");
            navigate(`/products/form/edit//${data.data.id}`);
        } catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            alert(error.message || "Có lỗi xảy ra khi tạo sản phẩm");
        }
    };

    const handleCancel = () => {
        console.log("Hủy tạo sản phẩm");
    };

    // call api branch
    const [apiBrands, setApiBrands] = useState([]);
    const apiBranch = async () => {
        try {
            const response = await fetch("https://clothes-api.fernirx.io.vn/api/clothes/admin/brands", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const data = await response.json();
            setApiBrands(data.data.content);
            console.log(data);


            return data;
        } catch (error) {
            console.error("Lỗi khi gọi API thương hiệu:", error);
        }
    }
    useEffect(() => {
        apiBranch();
    }, []);

    return (
        <div className="add-product">
            <div className="add-product__topbar">
                <div className="add-product__topbar-left">
                    <button
                        type="button"
                        className="add-product__back-btn"
<<<<<<< HEAD
                        onClick={() => console.log("Quay lại danh sách sản phẩm")}
=======
                        onClick={() => navigate("/products")}
>>>>>>> main
                    >
                        <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M9 2L4 7l5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Sản phẩm
                    </button>

                    <span className="add-product__topbar-sep">/</span>
                    <span className="add-product__topbar-title">Thêm sản phẩm</span>
                </div>


            </div>

            <div className="add-product__page">
                <div className="add-product__layout">
                    <div className="add-product__main">
                        <section className="add-product__card">
                            <div className="add-product__card-title">Thông tin cơ bản</div>

                            <div className="add-product__field">
                                <label className="add-product__label">
                                    Tên sản phẩm <span className="add-product__req">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="add-product__input"
                                    placeholder="VD: Áo thun nam basic oversize"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="add-product__field">
                                <label className="add-product__label">Mô tả sản phẩm</label>
                                <textarea
                                    className="add-product__textarea"
                                    placeholder="Mô tả chi tiết về sản phẩm, chất liệu, phong cách..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </section>

                        <section className="add-product__card">
                            <div className="add-product__card-title">Giá</div>

                            <div className="add-product__row add-product__row--3">
                                <div className="add-product__field">
                                    <label className="add-product__label">
                                        Giá bán <span className="add-product__req">*</span>
                                    </label>
                                    <div className="add-product__price-wrap">
                                        <span className="add-product__price-prefix">₫</span>
                                        <input
                                            type="number"
                                            min="0"
                                            className="add-product__input"
                                            placeholder="299000"
                                            value={basePrice}
                                            onChange={(e) => setBasePrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="add-product__field">
                                    <label className="add-product__label">Giá gốc</label>
                                    <div className="add-product__price-wrap">
                                        <span className="add-product__price-prefix">₫</span>
                                        <input
                                            type="number"
                                            min="0"
                                            className="add-product__input"
                                            placeholder="399000"
                                            value={originalPrice}
                                            onChange={(e) => setOriginalPrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="add-product__field">
                                    <label className="add-product__label">
                                        Giá vốn <span className="add-product__muted">(nội bộ)</span>
                                    </label>
                                    <div className="add-product__price-wrap">
                                        <span className="add-product__price-prefix">₫</span>
                                        <input
                                            type="number"
                                            min="0"
                                            className="add-product__input"
                                            placeholder="150000"
                                            value={costPrice}
                                            onChange={(e) => setCostPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="add-product__card">
                            <div className="add-product__card-title">Mã & Phân loại</div>

                            <div className="add-product__row add-product__row--2">
                                <div className="add-product__field">
                                    <label className="add-product__label">
                                        Mã sản phẩm <span className="add-product__req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="add-product__input"
                                        placeholder="SP001"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                </div>

                                <div className="add-product__field">
                                    <label className="add-product__label">
                                        Thương hiệu <span className="add-product__req">*</span>
                                    </label>
                                    <select
                                        className="edit-product-page__select"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {apiBrands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="add-product__field">
                                <label className="add-product__label">Giới tính</label>
                                <div className="add-product__gender-wrap">
                                    {GENDER_OPTIONS.map((item) => (
                                        <button
                                            key={item.value}
                                            type="button"
                                            className={`add-product__g-pill ${gender === item.value ? "add-product__g-pill--active" : ""
                                                }`}
                                            onClick={() => setGender(item.value)}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="add-product__card">
                            <div className="add-product__card-title">Thuộc tính</div>

                            <div className="add-product__row add-product__row--2">
                                <div className="add-product__field">
                                    <label className="add-product__label">Chất liệu</label>
                                    <input
                                        type="text"
                                        className="add-product__input"
                                        placeholder="VD: 100% Cotton, Polyester blend"
                                        value={material}
                                        onChange={(e) => setMaterial(e.target.value)}
                                    />
                                </div>

                                <div className="add-product__field">
                                    <label className="add-product__label">Xuất xứ</label>
                                    <input
                                        type="text"
                                        className="add-product__input"
                                        placeholder="VD: Việt Nam, Trung Quốc"
                                        value={origin}
                                        onChange={(e) => setOrigin(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>


                        <section className="add-product__card add-product__card--soft">
                            <div className="add-product__card-title">
                                Sau khi tạo — bước tiếp theo
                            </div>

                            <div className="add-product__next-step">
                                <div className="add-product__step-num">1</div>
                                <div className="add-product__step-info">
                                    <div className="add-product__step-name">Thêm variants</div>
                                    <div className="add-product__step-desc">
                                        Tạo các tổ hợp màu + size, nhập tồn kho và SKU
                                    </div>
                                </div>
                            </div>

                            <div className="add-product__next-step">
                                <div className="add-product__step-num">2</div>
                                <div className="add-product__step-info">
                                    <div className="add-product__step-name">Upload ảnh theo màu</div>
                                    <div className="add-product__step-desc">
                                        Mỗi màu sắc có bộ ảnh riêng dùng chung cho tất cả size
                                    </div>
                                </div>
                            </div>

                            <div className="add-product__next-step">
                                <div className="add-product__step-num">3</div>
                                <div className="add-product__step-info">
                                    <div className="add-product__step-name">Gán danh mục</div>
                                    <div className="add-product__step-desc">
                                        Phân loại sản phẩm vào một hoặc nhiều danh mục
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="add-product__sidebar">
                        <div className="add-product__sidebar-card">
                            <section className="add-product__card">
                                <div className="add-product__card-title">Trạng thái</div>

                                <div className="add-product__toggle-row">
                                    <span>Hiển thị trên web</span>
                                    <button
                                        type="button"
                                        className={`add-product__toggle ${isActive ? "add-product__toggle--on" : ""
                                            }`}
                                        onClick={() => setIsActive((prev) => !prev)}
                                    />
                                </div>

                                <div className="add-product__toggle-row">
                                    <span>
                                        Badge <strong>NEW</strong>
                                    </span>
                                    <button
                                        type="button"
                                        className={`add-product__toggle ${isNew ? "add-product__toggle--on" : ""
                                            }`}
                                        onClick={() => setIsNew((prev) => !prev)}
                                    />
                                </div>

                                <div className="add-product__toggle-row">
                                    <span>
                                        Badge <strong>SALE</strong>
                                    </span>
                                    <button
                                        type="button"
                                        className={`add-product__toggle ${isSale ? "add-product__toggle--on" : ""
                                            }`}
                                        onClick={() => setIsSale((prev) => !prev)}
                                    />
                                </div>
                            </section>
                            <button
                                type="button"
                                className="add-product__btn add-product__btn--primary"
                                onClick={handleSubmit}
                            >
                                Tạo sản phẩm
                            </button>

                            <button
                                type="button"
                                className="add-product__btn add-product__btn--outline"
                                onClick={handleCancel}
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            <div
                className={`add-product__toast ${toastMessage ? "add-product__toast--show" : ""
                    }`}
            >
                {toastMessage}
            </div>
        </div>
    );
}

export default AddProductForm;