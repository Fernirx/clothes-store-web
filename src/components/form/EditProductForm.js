import React, { useEffect, useMemo, useState } from "react";
import "./EditProductForm.css";
import { useParams } from "react-router-dom";
import ProductVariantForm from "./ProductVariantForm";

const INITIAL_VARIANTS = [
    {
        id: 1,
        color: "Đỏ",
        hex: "#E53935",
        size: "M",
        sku: "SP001-RED-M",
        stock: 12,
        price: null,
        active: true,
    },
    {
        id: 2,
        color: "Đỏ",
        hex: "#E53935",
        size: "L",
        sku: "SP001-RED-L",
        stock: 3,
        price: null,
        active: true,
    },
    {
        id: 3,
        color: "Xanh navy",
        hex: "#1565C0",
        size: "M",
        sku: "SP001-NAVY-M",
        stock: 20,
        price: null,
        active: true,
    },
    {
        id: 4,
        color: "Xanh navy",
        hex: "#1565C0",
        size: "L",
        sku: "SP001-NAVY-L",
        stock: 0,
        price: 329000,
        active: false,
    },
];

const INITIAL_COLOR_IMAGES = {
    Đỏ: {
        hex: "#E53935",
        images: [
            {
                id: 1,
                src: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&q=80",
                primary: true,
            },
            {
                id: 2,
                src: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&q=80",
                primary: false,
            },
        ],
    },
    "Xanh navy": {
        hex: "#1565C0",
        images: [
            {
                id: 3,
                src: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&q=80",
                primary: true,
            },
            {
                id: 4,
                src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&q=80",
                primary: false,
            },
            {
                id: 5,
                src: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=200&q=80",
                primary: false,
            },
        ],
    },
};

const INITIAL_CATEGORIES = [
    { id: 1, name: "Áo nam", checked: true },
    { id: 2, name: "Áo thun", checked: true },
    { id: 3, name: "Hàng mới", checked: false },
    { id: 4, name: "Sale", checked: false },
    { id: 5, name: "Bộ sưu tập hè 2025", checked: false },
];

const TAB_KEYS = {
    BASIC: "basic",
    VARIANTS: "variants",
    IMAGES: "images",
    CATEGORIES: "categories",
};

function EditProductForm() {
    const { idProduct } = useParams(); // lấy id từ url

    // State lưu tab hiện tại
    const [activeTab, setActiveTab] = useState(TAB_KEYS.BASIC);

    // State lưu tên sản phẩm
    const [name, setName] = useState("Áo thun nam basic oversize");

    // State lưu mã sản phẩm
    const [productCode, setProductCode] = useState("SP001");

    // State lưu mô tả sản phẩm
    const [description, setDescription] = useState(
        "Áo thun nam form oversize basic, chất liệu 100% cotton thoáng mát, phù hợp mặc hàng ngày."
    );

    // State lưu giá bán
    const [basePrice, setBasePrice] = useState("299000");

    // State lưu giá gốc
    const [originalPrice, setOriginalPrice] = useState("399000");

    // State lưu giá vốn
    const [costPrice, setCostPrice] = useState("150000");

    // State lưu thương hiệu
    const [brand, setBrand] = useState("");

    // State lưu giới tính
    const [gender, setGender] = useState("UNISEX");

    // State lưu chất liệu
    const [material, setMaterial] = useState("100% Cotton");

    // State lưu xuất xứ
    const [origin, setOrigin] = useState("Việt Nam");

    // State lưu trạng thái hiển thị web
    const [isActive, setIsActive] = useState(true);

    // State lưu badge NEW
    const [isNew, setIsNew] = useState(true);

    // State lưu badge SALE
    const [isSale, setIsSale] = useState(false);

    // State lưu danh sách variants
    const [variants, setVariants] = useState(INITIAL_VARIANTS);

    // State lưu ảnh theo từng màu
    const [colorImages, setColorImages] = useState(INITIAL_COLOR_IMAGES);

    // State lưu danh mục
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);

    // State lưu việc mở / đóng modal variant
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

    // State lưu id variant đang sửa, null là đang thêm mới
    const [editingVariantId, setEditingVariantId] = useState(null);

    // State lưu dữ liệu form trong modal variant
    const [variantForm, setVariantForm] = useState({
        color: "",
        hex: "#888888",
        size: "",
        sku: "",
        stock: "0",
        price: "",
    });

    // State lưu ảnh tạm trong modal khi thêm màu mới
    const [modalImages, setModalImages] = useState([]);

    // State lưu toast
    const [toastMessage, setToastMessage] = useState("");

    const variantCount = variants.length;

    const imageCount = useMemo(() => {
        return Object.values(colorImages).reduce((total, item) => {
            return total + (item.images?.length || 0);
        }, 0);
    }, [colorImages]);

    const stats = useMemo(() => {
        return {
            sold: 128,
            views: 2341,
            stock: variants.reduce((sum, item) => sum + (Number(item.stock) || 0), 0),
        };
    }, [variants]);

    const availableColors = useMemo(() => {
        return [...new Set(variants.map((item) => item.color))];
    }, [variants]);

    const isNewColorInModal = useMemo(() => {
        const color = variantForm.color.trim();
        return Boolean(color) && !colorImages[color];
    }, [variantForm.color, colorImages]);

    useEffect(() => {
        if (!toastMessage) return;

        const timer = setTimeout(() => {
            setToastMessage("");
        }, 2500);

        return () => clearTimeout(timer);
    }, [toastMessage]);

    const showToast = (message) => {
        setToastMessage(`✓ ${message}`);
    };

    const handleSaveBasicInfo = () => {
        const payload = {
            name,
            productCode,
            description,
            basePrice: Number(basePrice),
            originalPrice: originalPrice ? Number(originalPrice) : null,
            costPrice: costPrice ? Number(costPrice) : null,
            brand,
            gender,
            material,
            origin,
            isActive,
            isNew,
            isSale,
        };

        console.log("Basic info payload:", payload);
        showToast("Đã lưu thay đổi");
    };

    const toggleVariantActive = (id) => {
        setVariants((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, active: !item.active } : item
            )
        );
    };

    const deleteVariant = (id) => {
        const confirmed = window.confirm("Xóa variant này?");
        if (!confirmed) return;

        setVariants((prev) => prev.filter((item) => item.id !== id));
        showToast("Đã xóa variant");
    };

    const openAddVariant = () => {
        setEditingVariantId(null);
        setVariantForm({
            color: "",
            hex: "#888888",
            size: "",
            sku: "",
            stock: "0",
            price: "",
        });
        setModalImages([]);
        setIsVariantModalOpen(true);
    };

    const openEditVariant = (id) => {
        const variant = variants.find((item) => item.id === id);
        if (!variant) return;

        setEditingVariantId(id);
        setVariantForm({
            color: variant.color,
            hex: variant.hex || "#888888",
            size: variant.size,
            sku: variant.sku,
            stock: String(variant.stock ?? 0),
            price: variant.price ? String(variant.price) : "",
        });
        setModalImages([]);
        setIsVariantModalOpen(true);
    };

    const closeVariantModal = () => {
        setIsVariantModalOpen(false);
        setEditingVariantId(null);
        setModalImages([]);
    };

    const handleVariantFormChange = (field, value) => {
        setVariantForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleModalFiles = (fileList) => {
        const files = Array.from(fileList || []);
        if (!files.length) return;

        files.forEach((file) => {
            if (!file.type.startsWith("image/")) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                setModalImages((prev) => [
                    ...prev,
                    {
                        id: `${Date.now()}-${Math.random()}`,
                        src: event.target?.result || "",
                        primary: prev.length === 0,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const setModalPrimary = (index) => {
        setModalImages((prev) =>
            prev.map((img, i) => ({
                ...img,
                primary: i === index,
            }))
        );
    };

    const removeModalImage = (index) => {
        setModalImages((prev) => {
            const next = prev.filter((_, i) => i !== index);
            if (next.length > 0 && !next.some((img) => img.primary)) {
                next[0].primary = true;
            }
            return next;
        });
    };

    const saveVariant = () => {
        const color = variantForm.color.trim();
        const hex = variantForm.hex.trim() || "#888888";
        const size = variantForm.size.trim();
        const sku = variantForm.sku.trim();
        const stock = Number(variantForm.stock) || 0;
        const price = variantForm.price ? Number(variantForm.price) : null;

        if (!color || !size || !sku) {
            alert("Vui lòng điền màu, size và SKU");
            return;
        }

        if (editingVariantId) {
            setVariants((prev) =>
                prev.map((item) =>
                    item.id === editingVariantId
                        ? { ...item, color, hex, size, sku, stock, price }
                        : item
                )
            );

            showToast("Đã cập nhật variant");
        } else {
            const newVariant = {
                id: Date.now(),
                color,
                hex,
                size,
                sku,
                stock,
                price,
                active: true,
            };

            setVariants((prev) => [...prev, newVariant]);

            if (!colorImages[color]) {
                setColorImages((prev) => ({
                    ...prev,
                    [color]: {
                        hex,
                        images: modalImages,
                    },
                }));
            }

            showToast("Đã thêm variant");
        }

        closeVariantModal();
    };

    const setPrimaryImage = (color, index) => {
        setColorImages((prev) => ({
            ...prev,
            [color]: {
                ...prev[color],
                images: prev[color].images.map((img, i) => ({
                    ...img,
                    primary: i === index,
                })),
            },
        }));
    };

    const removeColorImage = (color, index) => {
        setColorImages((prev) => {
            const nextImages = prev[color].images.filter((_, i) => i !== index);

            if (nextImages.length > 0 && !nextImages.some((img) => img.primary)) {
                nextImages[0].primary = true;
            }

            return {
                ...prev,
                [color]: {
                    ...prev[color],
                    images: nextImages,
                },
            };
        });
    };

    const addImagesToColor = (color, fileList) => {
        const files = Array.from(fileList || []);
        if (!files.length) return;

        files.forEach((file) => {
            if (!file.type.startsWith("image/")) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                setColorImages((prev) => {
                    const currentImages = prev[color]?.images || [];
                    return {
                        ...prev,
                        [color]: {
                            ...prev[color],
                            images: [
                                ...currentImages,
                                {
                                    id: `${Date.now()}-${Math.random()}`,
                                    src: event.target?.result || "",
                                    primary: currentImages.length === 0,
                                },
                            ],
                        },
                    };
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const toggleCategory = (id) => {
        setCategories((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const handleSaveCategories = () => {
        console.log("Selected categories:", categories.filter((item) => item.checked));
        showToast("Đã lưu danh mục");
    };

    // call api branch
    const [apiBrands, setApiBrands] = useState([]);
    const apiBranch = async () => {
        try {
            const response = await fetch("https://clothes-api.fernirx.io.vn/api/clothes/api/v1/brands", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const data = await response.json();
            setApiBrands(data?.data?.content || []);
            console.log(data);

            return data;
        } catch (error) {
            console.error("Lỗi khi gọi API thương hiệu:", error);
        }
    };

    // get product lên
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [productError, setProductError] = useState("");
    const getProductDetail = async (productId) => {
        try {
            setLoadingProduct(true);
            setProductError("");

            const response = await fetch(
                `https://clothes-api.fernirx.io.vn/api/clothes/api/v1/products/${productId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log("Chi tiết sản phẩm:", result);

            const product = result?.data;

            if (!product) {
                throw new Error("Không lấy được dữ liệu sản phẩm");
            }

            setName(product.name || "");
            setProductCode(product.code || "");
            setDescription(product.description || "");
            setBasePrice(product.basePrice ? String(product.basePrice) : "");
            setOriginalPrice(product.originalPrice ? String(product.originalPrice) : "");
            setCostPrice(product.costPrice ? String(product.costPrice) : "");
            setBrand(product.brandId ? String(product.brandId) : "");
            setGender(product.gender || "UNISEX");
            setMaterial(product.material || "");
            setOrigin(product.originCountry || "");
            setIsActive(Boolean(product.isActive));
            setIsNew(Boolean(product.isNew));
            setIsSale(Boolean(product.isOnSale));
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            setProductError(error.message || "Không thể tải thông tin sản phẩm");
        } finally {
            setLoadingProduct(false);
        }
    };

    // use effect để gọi api
    useEffect(() => {
        if (!idProduct) return;
        getProductDetail(idProduct);
    }, [idProduct]);

    useEffect(() => {
        apiBranch();
    }, []);

    // render loading
    if (loadingProduct) {
        return (
            <div className="edit-product-page">
                <div className="edit-product-page__page">
                    <div className="edit-product-page__card">
                        <div className="edit-product-page__card-title">
                            Đang tải thông tin sản phẩm...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // render error
    if (productError) {
        return (
            <div className="edit-product-page">
                <div className="edit-product-page__page">
                    <div className="edit-product-page__card">
                        <div className="edit-product-page__card-title">
                            Không tải được sản phẩm
                        </div>
                        <p>{productError}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-product-page">
            <div className="edit-product-page__topbar">
                <div className="edit-product-page__topbar-left">
                    <button
                        type="button"
                        className="edit-product-page__back-btn"
                        onClick={() => console.log("Back to product list")}
                    >
                        ← Sản phẩm
                    </button>
                    <span className="edit-product-page__sep">/</span>
                    <span className="edit-product-page__topbar-title">{name}</span>
                    <span className="edit-product-page__product-code">{productCode}</span>
                </div>
            </div>

            <div className="edit-product-page__tabs">
                <button
                    type="button"
                    className={`edit-product-page__tab ${activeTab === TAB_KEYS.BASIC ? "edit-product-page__tab--active" : ""
                        }`}
                    onClick={() => setActiveTab(TAB_KEYS.BASIC)}
                >
                    Thông tin cơ bản
                </button>

                <button
                    type="button"
                    className={`edit-product-page__tab ${activeTab === TAB_KEYS.VARIANTS ? "edit-product-page__tab--active" : ""
                        }`}
                    onClick={() => setActiveTab(TAB_KEYS.VARIANTS)}
                >
                    Variants
                    <span className="edit-product-page__tab-count">{variantCount}</span>
                </button>

                <button
                    type="button"
                    className={`edit-product-page__tab ${activeTab === TAB_KEYS.IMAGES ? "edit-product-page__tab--active" : ""
                        }`}
                    onClick={() => setActiveTab(TAB_KEYS.IMAGES)}
                >
                    Hình ảnh
                    <span className="edit-product-page__tab-count">{imageCount}</span>
                </button>
            </div>

            <div className="edit-product-page__page">
                {activeTab === TAB_KEYS.BASIC && (
                    <div className="edit-product-page__layout">
                        <div>
                            <section className="edit-product-page__card">
                                <div className="edit-product-page__card-title">
                                    Thông tin cơ bản
                                </div>

                                <div className="edit-product-page__field">
                                    <label className="edit-product-page__label">
                                        Tên sản phẩm <span className="edit-product-page__req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="edit-product-page__input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="edit-product-page__field">
                                    <label className="edit-product-page__label">Mô tả</label>
                                    <textarea
                                        className="edit-product-page__textarea"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </section>

                            <section className="edit-product-page__card">
                                <div className="edit-product-page__card-title">Giá</div>

                                <div className="edit-product-page__row edit-product-page__row--3">
                                    <div className="edit-product-page__field">
                                        <label className="edit-product-page__label">
                                            Giá bán <span className="edit-product-page__req">*</span>
                                        </label>
                                        <div className="edit-product-page__price-wrap">
                                            <span className="edit-product-page__price-pre">₫</span>
                                            <input
                                                type="number"
                                                className="edit-product-page__input"
                                                value={basePrice}
                                                onChange={(e) => setBasePrice(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="edit-product-page__field">
                                        <label className="edit-product-page__label">Giá gốc</label>
                                        <div className="edit-product-page__price-wrap">
                                            <span className="edit-product-page__price-pre">₫</span>
                                            <input
                                                type="number"
                                                className="edit-product-page__input"
                                                value={originalPrice}
                                                onChange={(e) => setOriginalPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="edit-product-page__field">
                                        <label className="edit-product-page__label">Giá vốn</label>
                                        <div className="edit-product-page__price-wrap">
                                            <span className="edit-product-page__price-pre">₫</span>
                                            <input
                                                type="number"
                                                className="edit-product-page__input"
                                                value={costPrice}
                                                onChange={(e) => setCostPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="edit-product-page__card">
                                <div className="edit-product-page__card-title">Mã & Phân loại</div>

                                <div className="edit-product-page__row edit-product-page__row--2">
                                    <div className="edit-product-page__field">
                                        <label className="edit-product-page__label">Mã sản phẩm</label>
                                        <input
                                            type="text"
                                            className="edit-product-page__input"
                                            value={productCode}
                                            onChange={(e) => setProductCode(e.target.value)}
                                        />
                                    </div>

                                    <div className="edit-product-page__field">
                                        <label className="edit-product-page__label">Thương hiệu</label>
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

                                <div className="edit-product-page__field">
                                    <label className="edit-product-page__label">Giới tính</label>
                                    <div className="edit-product-page__gender-wrap">
                                        {[
                                            { label: "Nam", value: "MEN" },
                                            { label: "Nữ", value: "WOMEN" },
                                            { label: "Unisex", value: "UNISEX" },
                                            { label: "Trẻ em", value: "KIDS" },
                                        ].map((item) => (
                                            <button
                                                key={item.value}
                                                type="button"
                                                className={`edit-product-page__g-pill ${gender === item.value
                                                    ? "edit-product-page__g-pill--active"
                                                    : ""
                                                    }`}
                                                onClick={() => setGender(item.value)}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="edit-product-page__card">
                                <div className="edit-product-page__card-title">Thuộc tính</div>

                                <div className="edit-product-page__row edit-product-page__row--2">
                                    <div className="edit-product-page__field">
                                        <label className="edit-product-page__label">Chất liệu</label>
                                        <input
                                            type="text"
                                            className="edit-product-page__input"
                                            value={material}
                                            onChange={(e) => setMaterial(e.target.value)}
                                        />
                                    </div>

                                    <div className="edit-product-page__field">
                                        <label className="edit-product-page__label">Xuất xứ</label>
                                        <input
                                            type="text"
                                            className="edit-product-page__input"
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div>
                            <section className="edit-product-page__card">
                                <div className="edit-product-page__card-title">Trạng thái</div>

                                <div className="edit-product-page__toggle-row">
                                    <span>Hiển thị trên web</span>
                                    <button
                                        type="button"
                                        className={`edit-product-page__toggle ${isActive ? "edit-product-page__toggle--on" : ""
                                            }`}
                                        onClick={() => setIsActive((prev) => !prev)}
                                    />
                                </div>

                                <div className="edit-product-page__toggle-row">
                                    <span>
                                        Badge <b>NEW</b>
                                    </span>
                                    <button
                                        type="button"
                                        className={`edit-product-page__toggle ${isNew ? "edit-product-page__toggle--on" : ""
                                            }`}
                                        onClick={() => setIsNew((prev) => !prev)}
                                    />
                                </div>

                                <div className="edit-product-page__toggle-row">
                                    <span>
                                        Badge <b>SALE</b>
                                    </span>
                                    <button
                                        type="button"
                                        className={`edit-product-page__toggle ${isSale ? "edit-product-page__toggle--on" : ""
                                            }`}
                                        onClick={() => setIsSale((prev) => !prev)}
                                    />
                                </div>
                            </section>

                            <section className="edit-product-page__card">
                                <div className="edit-product-page__card-title">Thống kê</div>
                                <div className="edit-product-page__info-row">
                                    <span className="edit-product-page__key">Đã bán</span>
                                    <span className="edit-product-page__val">
                                        {stats.sold.toLocaleString()}
                                    </span>
                                </div>
                                <div className="edit-product-page__info-row">
                                    <span className="edit-product-page__key">Lượt xem</span>
                                    <span className="edit-product-page__val">
                                        {stats.views.toLocaleString()}
                                    </span>
                                </div>
                                <div className="edit-product-page__info-row">
                                    <span className="edit-product-page__key">Tổng tồn kho</span>
                                    <span className="edit-product-page__val">
                                        {stats.stock.toLocaleString()}
                                    </span>
                                </div>
                            </section>

                            <button
                                type="button"
                                className="edit-product-page__btn edit-product-page__btn--primary edit-product-page__btn--full"
                                onClick={handleSaveBasicInfo}
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === TAB_KEYS.VARIANTS && (
                    <ProductVariantForm
                        variants={variants}
                        isVariantModalOpen={isVariantModalOpen}
                        editingVariantId={editingVariantId}
                        variantForm={variantForm}
                        modalImages={modalImages}
                        isNewColorInModal={isNewColorInModal}
                        openAddVariant={openAddVariant}
                        openEditVariant={openEditVariant}
                        closeVariantModal={closeVariantModal}
                        handleVariantFormChange={handleVariantFormChange}
                        handleModalFiles={handleModalFiles}
                        setModalPrimary={setModalPrimary}
                        removeModalImage={removeModalImage}
                        saveVariant={saveVariant}
                        toggleVariantActive={toggleVariantActive}
                        deleteVariant={deleteVariant}
                    />
                )}

                {activeTab === TAB_KEYS.IMAGES && (
                    <section className="edit-product-page__card">
                        <div className="edit-product-page__card-title">
                            <span>Hình ảnh theo màu sắc</span>
                            <span className="edit-product-page__card-note">
                                Click ảnh để đặt làm ảnh chính · Hover để xóa
                            </span>
                        </div>

                        {availableColors.length === 0 ? (
                            <div className="edit-product-page__empty-state">
                                <div className="edit-product-page__empty-icon">🖼</div>
                                <div className="edit-product-page__empty-text">
                                    Thêm variant trước để quản lý ảnh theo màu sắc.
                                </div>
                            </div>
                        ) : (
                            availableColors.map((color) => {
                                const colorGroup = colorImages[color] || {
                                    hex: "#888888",
                                    images: [],
                                };

                                return (
                                    <div key={color} className="edit-product-page__color-group">
                                        <div className="edit-product-page__color-group-header">
                                            <div className="edit-product-page__color-group-title">
                                                <span
                                                    className="edit-product-page__color-dot edit-product-page__color-dot--large"
                                                    style={{ background: colorGroup.hex }}
                                                />
                                                {color}
                                                <span className="edit-product-page__color-group-meta">
                                                    {colorGroup.images.length} ảnh
                                                </span>
                                            </div>
                                            <span className="edit-product-page__color-group-side-note">
                                                Dùng chung cho tất cả size màu này
                                            </span>
                                        </div>

                                        <div className="edit-product-page__color-group-body">
                                            <div className="edit-product-page__img-grid">
                                                {colorGroup.images.map((img, index) => (
                                                    <div
                                                        key={img.id}
                                                        className={`edit-product-page__img-thumb ${img.primary
                                                            ? "edit-product-page__img-thumb--primary"
                                                            : ""
                                                            }`}
                                                        onClick={() => setPrimaryImage(color, index)}
                                                    >
                                                        <img
                                                            src={img.src}
                                                            alt={`${color}-${index}`}
                                                            className="edit-product-page__img"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="edit-product-page__img-del"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeColorImage(color, index);
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

                                                <label className="edit-product-page__img-add">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            addImagesToColor(color, e.target.files)
                                                        }
                                                    />
                                                    <span className="edit-product-page__img-add-plus">
                                                        +
                                                    </span>
                                                    <span>Thêm ảnh</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </section>
                )}
            </div>

            <div
                className={`edit-product-page__toast ${toastMessage ? "edit-product-page__toast--show" : ""
                    }`}
            >
                {toastMessage}
            </div>
        </div>
    );
}

export default EditProductForm;