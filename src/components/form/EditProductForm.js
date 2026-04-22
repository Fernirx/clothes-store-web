import { useEffect, useMemo, useState } from "react";
import "./EditProductForm.css";
import { useNavigate, useParams } from "react-router-dom";
import ProductVariantForm from "./ProductVariantForm";
import CategorySection from "./CategorySection";

const INITIAL_COLOR_IMAGES = {
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

const GENDER_MAP = {
    MALE: "MEN",
    FEMALE: "WOMEN",
    UNISEX: "UNISEX",
    KIDS: "KIDS",
    Nam: "MEN",
    Nữ: "WOMEN",
    MEN: "MEN",
    WOMEN: "WOMEN",
};

const normalizeGender = (value) => {
    return GENDER_MAP[value] || "UNISEX";
};

function EditProductForm() {
    const { idProduct } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(TAB_KEYS.BASIC);

    const [name, setName] = useState("Áo thun nam basic oversize");
    const [productCode, setProductCode] = useState("SP001");
    const [description, setDescription] = useState(
        "Áo thun nam form oversize basic, chất liệu 100% cotton thoáng mát, phù hợp mặc hàng ngày."
    );
    const [basePrice, setBasePrice] = useState("299000");
    const [originalPrice, setOriginalPrice] = useState("399000");
    const [costPrice, setCostPrice] = useState("150000");
    const [gender, setGender] = useState("UNISEX");
    const [material, setMaterial] = useState("100% Cotton");
    const [origin, setOrigin] = useState("Việt Nam");
    const [brand, setBrand] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isNew, setIsNew] = useState(true);
    const [isSale, setIsSale] = useState(false);
    const [soldCount, setSoldCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [uploadingColor, setUploadingColor] = useState("");

    const [variants, setVariants] = useState([]);
    const [colorImages, setColorImages] = useState(INITIAL_COLOR_IMAGES);
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [selectedCategoryCount, setSelectedCategoryCount] = useState(0);

    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [isSavingVariant, setIsSavingVariant] = useState(false);

    const [variantForm, setVariantForm] = useState({
        color: "",
        hex: "#888888",
        size: "",
        sku: "",
        stock: "0",
        minStockLevel: "5",
        displayOrder: "0",
        price: "",
    });

    const [modalImages, setModalImages] = useState([]);
    const [toastMessage, setToastMessage] = useState("");

    const [loadingProduct, setLoadingProduct] = useState(false);
    const [productError, setProductError] = useState("");

    const variantCount = variants.length;

    const imageCount = useMemo(() => {
        return Object.values(colorImages).reduce((total, item) => {
            return total + (item.images?.length || 0);
        }, 0);
    }, [colorImages]);

    const stats = useMemo(() => {
        return {
            sold: soldCount,
            views: viewCount,
            stock: variants.reduce((sum, item) => sum + (Number(item.stock) || 0), 0),
        };
    }, [variants, soldCount, viewCount]);

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

    const handleCategorySaved = (categoryIds) => {
        setSelectedCategoryCount(categoryIds ? categoryIds.length : 0);
    };

    const handleSaveBasicInfo = async () => {
        const payload = {
            name,
            description,
            basePrice: Number(basePrice),
            originalPrice: originalPrice ? Number(originalPrice) : null,
            costPrice: costPrice ? Number(costPrice) : null,
            gender,
            material,
            origin,
            isActive,
            isNew,
            isSale,
        };

        try {
            const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
            const response = await fetch(
                `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${idProduct}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // thêm header Authorization
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log("Cập nhật sản phẩm thành công:", result);
            showToast("Đã lưu thay đổi");
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            alert("Không thể lưu thay đổi. Vui lòng thử lại!");
        }
    };

    const toggleVariantActive = async (id) => {
        const currentVariant = variants.find((item) => item.id === id);
        if (!currentVariant || !idProduct) return;

        const nextIsActive = !currentVariant.active;

        try {
            const payload = {
                price: Number(currentVariant.price) || 0,
                stockQuantity: Number(currentVariant.stock) || 0,
                minStockLevel: Number(currentVariant.minStockLevel) || 5,
                displayOrder: Number(currentVariant.displayOrder) || 0,
                isActive: nextIsActive,
            };

            const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
            const response = await fetch(
                `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${idProduct}/variants/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // thêm header Authorization
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    result?.message || "Cập nhật trạng thái variant thất bại"
                );
            }

            const updatedVariant = result?.data || result;

            setVariants((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            active:
                                updatedVariant.isActive !== undefined
                                    ? updatedVariant.isActive
                                    : nextIsActive,
                            price:
                                updatedVariant.price !== undefined
                                    ? updatedVariant.price
                                    : item.price,
                            stock:
                                updatedVariant.stockQuantity !== undefined
                                    ? updatedVariant.stockQuantity
                                    : item.stock,
                            minStockLevel:
                                updatedVariant.minStockLevel !== undefined
                                    ? updatedVariant.minStockLevel
                                    : item.minStockLevel,
                            displayOrder:
                                updatedVariant.displayOrder !== undefined
                                    ? updatedVariant.displayOrder
                                    : item.displayOrder,
                        }
                        : item
                )
            );

            showToast(nextIsActive ? "Đã bật variant" : "Đã tắt variant");
        } catch (error) {
            console.error("Lỗi khi đổi trạng thái variant:", error);
            alert(error.message || "Có lỗi xảy ra khi cập nhật trạng thái variant");
        }
    };

    const deleteVariant = async (id) => {
        const confirmed = window.confirm("Xóa variant này?");
        if (!confirmed) return;

        try {
            const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage

            const response = await fetch(
                `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${idProduct}/variants/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // thêm header Authorization
                    },
                    credentials: "include",
                }
            );

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(result?.message || "Xóa variant thất bại");
            }

            setVariants((prev) => prev.filter((item) => item.id !== id));
            showToast("Đã xóa variant");
        } catch (error) {
            console.error("Lỗi khi xóa variant:", error);
            alert(error.message || "Có lỗi xảy ra khi xóa variant");
        }
    };
    const uploadMediaImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
        const response = await fetch(
            "https://clothes-api.fernirx.io.vn/api/clothes/media/image?context=PRODUCT",
            {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${accessToken}`, // thêm header Authorization
                },
                credentials: "include",
            }
        );

        const result = await response.json().catch(() => null);
        console.log(result.data);

        if (!response.ok) {
            throw new Error(result?.message || "Upload ảnh thất bại");
        }

        return result?.data || result;
    };
    const createProductVariantImage = async ({
        productId,
        color,
        colorHex,
        imageUrl,
        imagePublicId,
        isPrimary,
    }) => {
        const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
        const response = await fetch(
            `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${productId}/images`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`, // thêm header Authorization
                },
                credentials: "include",
                body: JSON.stringify({
                    color,
                    colorHex,
                    imageUrl,
                    imagePublicId,
                    isPrimary,
                }),
            }
        );

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(result?.message || "Tạo ảnh biến thể thất bại");
        }

        return result?.data || result;
    };
    const normalizeColorImages = (images = []) => {
        const nextImages = images.map((img, index) => ({
            id: img.id || `${Date.now()}-${index}`,
            file: img.file,
            src: img.src || "",
            publicId: img.publicId,
            primary: Boolean(img.primary),
        }));

        // luôn đảm bảo chỉ có đúng 1 ảnh chính
        const primaryIndex = nextImages.findIndex((img) => img.primary);

        if (nextImages.length > 0) {
            if (primaryIndex === -1) {
                nextImages[0].primary = true;
            } else {
                nextImages.forEach((img, index) => {
                    img.primary = index === primaryIndex;
                });
            }
        }

        return nextImages;
    };
    const mapImagesByColorFromProduct = (imagesByColor = []) => {
        const nextColorImages = {};

        imagesByColor.forEach((group) => {
            if (!group?.color) return;

            const mappedImages = Array.isArray(group.images)
                ? group.images.map((img, index) => ({
                    id: img.id || `${group.color}-${index}`,
                    src: img.imageUrl || "",
                    publicId: img.publicId || "",
                    primary: Boolean(img.isPrimary),
                }))
                : [];

            // luôn đảm bảo có đúng 1 ảnh chính nếu có ảnh
            const primaryIndex = mappedImages.findIndex((img) => img.primary);
            if (mappedImages.length > 0) {
                if (primaryIndex === -1) {
                    mappedImages[0].primary = true;
                } else {
                    mappedImages.forEach((img, index) => {
                        img.primary = index === primaryIndex;
                    });
                }
            }

            nextColorImages[group.color] = {
                hex: group.colorHex || "#888888",
                images: mappedImages,
            };
        });

        return nextColorImages;
    };
    const openAddVariant = () => {
        setEditingVariantId(null);
        setVariantForm({
            color: "",
            hex: "#888888",
            size: "",
            sku: "",
            stock: "0",
            minStockLevel: "5",
            displayOrder: String(variants.length),
            price: "",
        });
        setModalImages([]);
        setIsVariantModalOpen(true);
    };

    const editVariant = (id) => {
        const variant = variants.find((item) => item.id === id);
        if (!variant) return;

        setEditingVariantId(id);
        setVariantForm({
            color: variant.color || "",
            hex: variant.colorHex || variant.hex || "#888888",
            size: variant.size || "",
            sku: variant.sku || "",
            stock: String(variant.stock ?? 0),
            minStockLevel: String(variant.minStockLevel ?? 5),
            displayOrder: String(variant.displayOrder ?? 0),
            price:
                variant.price !== null && variant.price !== undefined
                    ? String(variant.price)
                    : "",
        });

        setModalImages([]);
        setIsVariantModalOpen(true);
    };

    const saveVariant = async () => {
        const color = variantForm.color.trim();
        const hex = variantForm.hex.trim() || "#888888";
        const size = variantForm.size.trim();
        const sku = variantForm.sku.trim();
        const stock = Number(variantForm.stock) || 0;
        const minStockLevel = Number(variantForm.minStockLevel) || 5;
        const displayOrder = Number(variantForm.displayOrder) || 0;
        const price = variantForm.price ? Number(variantForm.price) : 0;

        if (!editingVariantId && (!color || !size || !sku)) {
            alert("Vui lòng điền màu, size và SKU");
            return;
        }

        try {
            setIsSavingVariant(true);

            // UPDATE: chỉ cho sửa price, stockQuantity, minStockLevel, displayOrder
            if (editingVariantId) {
                const payload = {
                    price,
                    stockQuantity: stock,
                    minStockLevel,
                    displayOrder,
                };
                const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
                const response = await fetch(
                    `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${idProduct}/variants/${editingVariantId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`, // thêm header Authorization
                        },
                        credentials: "include",
                        body: JSON.stringify(payload),
                    }
                );

                const result = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(result?.message || "Cập nhật variant thất bại");
                }

                const updatedVariant = result?.data || result;

                setVariants((prev) =>
                    prev.map((item) =>
                        item.id === editingVariantId
                            ? {
                                ...item,
                                price:
                                    updatedVariant.price !== undefined
                                        ? updatedVariant.price
                                        : price,
                                stock:
                                    updatedVariant.stockQuantity !== undefined
                                        ? updatedVariant.stockQuantity
                                        : stock,
                                minStockLevel:
                                    updatedVariant.minStockLevel !== undefined
                                        ? updatedVariant.minStockLevel
                                        : minStockLevel,
                                displayOrder:
                                    updatedVariant.displayOrder !== undefined
                                        ? updatedVariant.displayOrder
                                        : displayOrder,
                                active:
                                    updatedVariant.isActive !== undefined
                                        ? updatedVariant.isActive
                                        : item.active,
                            }
                            : item
                    )
                );

                showToast("Đã cập nhật variant");
                closeVariantModal();
                return;
            }

            // =========================
            // CREATE VARIANT MỚI
            // 1. Upload media
            // 2. Gọi API tạo ảnh biến thể
            // 3. Gọi API tạo variant
            // =========================
            let uploadedImages = normalizeColorImages(modalImages);

            if (uploadedImages.length > 0) {
                const uploadedResults = await Promise.all(
                    uploadedImages.map(async (img) => {
                        if (img.file) {
                            const uploaded = await uploadMediaImage(img.file);

                            return {
                                ...img,
                                src: uploaded.imageUrl,
                                publicId: uploaded.publicId,
                            };
                        }

                        return img;
                    })
                );

                uploadedImages = normalizeColorImages(uploadedResults);

                // Sau khi media trả về url thì gọi tiếp API tạo ảnh biến thể
                await Promise.all(
                    uploadedImages.map((img) =>
                        createProductVariantImage({
                            productId: idProduct,
                            color,
                            colorHex: hex,
                            imageUrl: img.src,
                            imagePublicId: img.publicId,
                            isPrimary: Boolean(img.primary),
                        })
                    )
                );
            }

            // Sau đó mới tạo variant
            const payload = {
                size,
                color,
                colorHex: hex,
                price,
                sku,
                stockQuantity: stock,
                minStockLevel,
                displayOrder,
            };

            const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
            const response = await fetch(
                `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${idProduct}/variants`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // thêm header Authorization
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(result?.message || "Thêm variant thất bại");
            }

            const createdVariant = result?.data || result;

            setVariants((prev) => [
                ...prev,
                {
                    id: createdVariant.id,
                    color: createdVariant.color,
                    colorHex: createdVariant.colorHex,
                    hex: createdVariant.colorHex,
                    size: createdVariant.size,
                    sku: createdVariant.sku,
                    stock: createdVariant.stockQuantity ?? 0,
                    minStockLevel: createdVariant.minStockLevel ?? minStockLevel,
                    displayOrder: createdVariant.displayOrder ?? displayOrder,
                    price: createdVariant.price ?? 0,
                    active: Boolean(createdVariant.isActive !== false),
                },
            ]);

            // lưu local để tab Hình ảnh biết ảnh nào là ảnh chính
            setColorImages((prev) => ({
                ...prev,
                [color]: {
                    hex,
                    images: uploadedImages,
                },
            }));

            showToast("Đã thêm variant");
            closeVariantModal();
        } catch (error) {
            console.error("Lỗi khi lưu variant:", error);
            alert(error.message || "Có lỗi xảy ra khi lưu variant");
        } finally {
            setIsSavingVariant(false);
        }
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
                        file,
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

    const removeModalImage = (index, id) => {
        setModalImages((prev) => {
            const next = prev.filter((_, i) => i !== index);
            if (next.length > 0 && !next.some((img) => img.primary)) {
                next[0].primary = true;
            }
            // try { 
            //     const response = await fetch(
            //     `https://clothes-api.fernirx.io.vn/api/clothes/media/image`,
            //     {
            //         method: "DELETE",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify({ publicId: id }),
            //     }
            // );
            // } catch (error) {
            //     console.error("Có lỗi xảy ra khi gọi API:", error);
            // }
            // return next;
        });
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

    const addImagesToColor = async (color, fileList) => {
        const files = Array.from(fileList || []);
        if (!files.length || !idProduct) return;

        const colorGroup = colorImages[color];
        if (!colorGroup) {
            alert("Không tìm thấy thông tin màu để thêm ảnh");
            return;
        }

        try {
            setUploadingColor(color);

            const currentImages = colorGroup.images || [];
            const hasPrimary = currentImages.some((img) => img.primary);

            const uploadedImages = await Promise.all(
                files.map(async (file, index) => {
                    if (!file.type.startsWith("image/")) {
                        return null;
                    }

                    // 1. upload media lấy imageUrl + publicId
                    const uploaded = await uploadMediaImage(file);

                    const isPrimary = !hasPrimary && index === 0;

                    // 2. tạo ảnh biến thể theo màu
                    const createdImage = await createProductVariantImage({
                        productId: idProduct,
                        color,
                        colorHex: colorGroup.hex || "#888888",
                        imageUrl: uploaded.imageUrl,
                        imagePublicId: uploaded.publicId,
                        isPrimary,
                    });

                    return {
                        id:
                            createdImage?.id ||
                            `${Date.now()}-${Math.random()}`,
                        src: createdImage?.imageUrl || uploaded.imageUrl,
                        publicId:
                            createdImage?.publicId || uploaded.publicId,
                        primary: Boolean(
                            createdImage?.isPrimary !== undefined
                                ? createdImage.isPrimary
                                : isPrimary
                        ),
                    };
                })
            );

            const validUploadedImages = uploadedImages.filter(Boolean);

            if (validUploadedImages.length === 0) return;

            setColorImages((prev) => {
                const oldImages = prev[color]?.images || [];
                const mergedImages = [...oldImages, ...validUploadedImages];

                // luôn đảm bảo có đúng 1 ảnh chính
                let primaryIndex = mergedImages.findIndex((img) => img.primary);
                if (mergedImages.length > 0) {
                    if (primaryIndex === -1) {
                        primaryIndex = 0;
                    }

                    mergedImages.forEach((img, index) => {
                        img.primary = index === primaryIndex;
                    });
                }

                return {
                    ...prev,
                    [color]: {
                        ...prev[color],
                        images: mergedImages,
                    },
                };
            });

            showToast(`Đã thêm ${validUploadedImages.length} ảnh cho màu ${color}`);
            showToast(`Đã thêm ${validUploadedImages.length} ảnh cho màu ${color}`);
            await getProductDetail(idProduct);
        } catch (error) {
            console.error("Lỗi khi thêm ảnh theo màu:", error);
            alert(error.message || "Có lỗi xảy ra khi thêm ảnh");
        } finally {
            setUploadingColor("");
        }
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

    const getProductVariants = async (productId) => {
        try {
            const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
            const response = await fetch(
                `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${productId}/variants`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // thêm header Authorization
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log("Danh sách variants:", result.data);

            if (result.data && Array.isArray(result.data)) {
                const loadedVariants = result.data.map((v) => ({
                    id: v.id,
                    color: v.color || "",
                    colorHex: v.colorHex || "#888888",
                    hex: v.colorHex || "#888888",
                    size: v.size || "",
                    sku: v.sku || "",
                    stock: v.stockQuantity ?? 0,
                    minStockLevel: v.minStockLevel ?? 5,
                    displayOrder: v.displayOrder ?? 0,
                    price: v.price ?? 0,
                    active: Boolean(v.isActive !== false),
                }));
                setVariants(loadedVariants);
            }
        } catch (error) {
            console.error("Lỗi khi lấy variants:", error);
        }
    };

    let dataProduct = null;
    const getProductDetail = async (productId) => {
        try {
            setLoadingProduct(true);
            setProductError("");

            const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
            const response = await fetch(
                `https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${productId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // thêm header Authorization
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log("Chi tiết sản phẩm:", result.data);

            const dataProduct = result?.data;

            if (!dataProduct) {
                throw new Error("Không lấy được dữ liệu sản phẩm");
            }

            setBrand(dataProduct.brand?.name || "");
            setName(dataProduct.name || "");
            setProductCode(dataProduct.code || "");
            setDescription(dataProduct.description || "");
            setBasePrice(dataProduct.basePrice ? String(dataProduct.basePrice) : "");
            setOriginalPrice(
                dataProduct.originalPrice ? String(dataProduct.originalPrice) : ""
            );
            setCostPrice(dataProduct.costPrice ? String(dataProduct.costPrice) : "");
            setGender(normalizeGender(dataProduct.gender));
            setMaterial(dataProduct.material || "");
            setOrigin(dataProduct.originCountry || "");
            setIsActive(Boolean(dataProduct.isActive));
            setIsNew(Boolean(dataProduct.isNew));
            setIsSale(Boolean(dataProduct.isOnSale));
            setSoldCount(dataProduct.soldCount || 0);
            setViewCount(dataProduct.viewCount || 0);

            // variants lấy trực tiếp từ response product detail
            const loadedVariants = Array.isArray(dataProduct.variants)
                ? dataProduct.variants.map((v) => ({
                    id: v.id,
                    color: v.color || "",
                    colorHex: v.colorHex || "#888888",
                    hex: v.colorHex || "#888888",
                    size: v.size || "",
                    sku: v.sku || "",
                    stock: v.stockQuantity ?? 0,
                    minStockLevel: v.minStockLevel ?? 5,
                    displayOrder: v.displayOrder ?? 0,
                    price: v.price ?? 0,
                    active: Boolean(v.isActive !== false),
                }))
                : [];

            setVariants(loadedVariants);

            // ảnh theo màu lấy trực tiếp từ imagesByColor của BE
            const nextColorImages = mapImagesByColorFromProduct(
                dataProduct.imagesByColor || []
            );
            setColorImages(nextColorImages);

            // cập nhật số danh mục
            if (Array.isArray(dataProduct.categories)) {
                setSelectedCategoryCount(dataProduct.categories.length);
            } else {
                setSelectedCategoryCount(0);
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            setProductError(error.message || "Không thể tải thông tin sản phẩm");
        } finally {
            setLoadingProduct(false);
        }
    };

    useEffect(() => {
        if (!idProduct) return;
        getProductDetail(idProduct);
    }, [idProduct]);

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
                        onClick={() => navigate("/products")}
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
                    className={`edit-product-page__tab ${activeTab === TAB_KEYS.BASIC
                        ? "edit-product-page__tab--active"
                        : ""
                        }`}
                    onClick={() => setActiveTab(TAB_KEYS.BASIC)}
                >
                    Thông tin cơ bản
                </button>

                <button
                    type="button"
                    className={`edit-product-page__tab ${activeTab === TAB_KEYS.VARIANTS
                        ? "edit-product-page__tab--active"
                        : ""
                        }`}
                    onClick={() => setActiveTab(TAB_KEYS.VARIANTS)}
                >
                    Variants
                    <span className="edit-product-page__tab-count">{variantCount}</span>
                </button>

                <button
                    type="button"
                    className={`edit-product-page__tab ${activeTab === TAB_KEYS.IMAGES
                        ? "edit-product-page__tab--active"
                        : ""
                        }`}
                    onClick={() => setActiveTab(TAB_KEYS.IMAGES)}
                >
                    Hình ảnh
                    <span className="edit-product-page__tab-count">{imageCount}</span>
                </button>

                <button
                    type="button"
                    className={`edit-product-page__tab ${activeTab === TAB_KEYS.CATEGORIES
                        ? "edit-product-page__tab--active"
                        : ""
                        }`}
                    onClick={() => setActiveTab(TAB_KEYS.CATEGORIES)}
                >
                    Danh mục
                    <span className="edit-product-page__tab-count">{selectedCategoryCount}</span>
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
                                            readOnly
                                            type="text"
                                            className="edit-product-page__input"
                                            value={productCode}
                                        />
                                    </div>

                                    <div className="edit-product-page__field">
                                        <label className="edit-product-page__label">Thương hiệu</label>
                                        <input
                                            readOnly
                                            type="text"
                                            className="edit-product-page__input"
                                            value={brand}
                                        />
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
                        editVariant={editVariant}
                        closeVariantModal={closeVariantModal}
                        handleVariantFormChange={handleVariantFormChange}
                        handleModalFiles={handleModalFiles}
                        setModalPrimary={setModalPrimary}
                        removeModalImage={removeModalImage}
                        saveVariant={saveVariant}
                        toggleVariantActive={toggleVariantActive}
                        deleteVariant={deleteVariant}
                        isSavingVariant={isSavingVariant}
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
                                                        disabled={uploadingColor === color}
                                                        onChange={async (e) => {
                                                            await addImagesToColor(color, e.target.files);
                                                            e.target.value = "";
                                                        }}
                                                    />
                                                    <span className="edit-product-page__img-add-plus">
                                                        {uploadingColor === color ? "..." : "+"}
                                                    </span>
                                                    <span>
                                                        {uploadingColor === color ? "Đang tải..." : "Thêm ảnh"}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </section>
                )}

                {activeTab === TAB_KEYS.CATEGORIES && (
                    <CategorySection
                        productId={idProduct}
                        showToast={showToast}
                        onSave={handleCategorySaved}
                    />
                )}
            </div>

            {/* danh mục */}

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