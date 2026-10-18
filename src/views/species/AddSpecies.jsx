import { useState, useEffect, useRef } from "react";
import {
    Button,
    Input,
    Stack,
    Grid,
    GridItem,
    Box,
    Heading,
    Text,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TAXONOMY_OPTIONS } from "../../config/data.config";
import APP_CONFIG from "../../config/app.config";

// components
import BlockKingdom from "../../components/form/BlockKingdom";
import { toaster } from "../../components/ui/Toaster";
import GENUS_API from "../../services/genus.api";
import SPECIES_API from "../../services/species.api";
import Review from "../../components/review/Review";
import MultiSelectTagInput from "../../components/form/MultiSelectTagInput";

export default function AddSpecies() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const isEdit = !!id;
    const navigate = useNavigate();

    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [uploadFileKey, setUploadFileKey] = useState(Date.now());
    const [templateImgUrl, setTemplateImgUrl] = useState(null);
    const [templateBgUrl, setTemplateBgUrl] = useState(null);
    const [backgroundFileName, setBackgroundFileName] = useState('');
    const [thumbnailFileName, setThumbnailFileName] = useState('');
    const [allGenuses, setAllGenuses] = useState([]);
    const backgroundInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const [formData, setFormData] = useState({
        genus_id: "",
        normal_name: "",
        science_name: "",
        cell_type: "",
        nutrition_mode: "",
        reproduction_type: "",
        habitat: [],
        distribution: [],
        average_size: { value: "", unit: "cm" },
        average_weight: { value: "", unit: "kg" },
        lifespan: { value: "", unit: "năm" },
        description: [],
        thumbnail_url: null,
        background_url: null,
        theme_color: "",
        thumbnail_file: null,
        background_file: null,
    });

    useEffect(() => {
        document.title = isEdit ? "Admin | Chỉnh Sửa Loài" : "Admin | Thêm Loài Mới";
        fetchGenusesAndSpecies();
    }, [id, isEdit]);

    useEffect(() => {
        return () => {
            if (templateImgUrl) URL.revokeObjectURL(templateImgUrl);
            if (templateBgUrl) URL.revokeObjectURL(templateBgUrl);
        };
    }, [templateImgUrl, templateBgUrl]);

    // ============== Handlers ===================
    const parseMeasurement = (val, defaultUnit) => {
        if (!val) return { value: "", unit: defaultUnit };
        if (typeof val === "object" && val !== null) {
            return { value: val.value || "", unit: val.unit || defaultUnit };
        }
        return { value: String(val), unit: defaultUnit };
    };

    const parseArrayField = (val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === "string" && val.trim()) return [val.trim()];
        return [];
    };

    const fetchGenusesAndSpecies = async () => {
        try {
            const resGenuses = await GENUS_API.getAll();
            const listGenuses = resGenuses.data || resGenuses;
            setAllGenuses(listGenuses);

            if (isEdit) {
                const resSpecies = await SPECIES_API.getAll();
                const listSpecies = resSpecies.data || resSpecies;
                const currentSpecies = listSpecies.find(s => (s._id || s.id) === id);
                if (currentSpecies) {
                    setFormData({
                        genus_id: currentSpecies.genus_id || "",
                        normal_name: currentSpecies.normal_name || "",
                        science_name: currentSpecies.science_name || "",
                        cell_type: currentSpecies.cell_type || "",
                        nutrition_mode: currentSpecies.nutrition_mode || "",
                        reproduction_type: currentSpecies.reproduction_type || "",
                        habitat: parseArrayField(currentSpecies.habitat),
                        distribution: parseArrayField(currentSpecies.distribution),
                        average_size: parseMeasurement(currentSpecies.average_size, "cm"),
                        average_weight: parseMeasurement(currentSpecies.average_weight, "kg"),
                        lifespan: parseMeasurement(currentSpecies.lifespan, "năm"),
                        description: currentSpecies.description || [],
                        thumbnail_url: currentSpecies.thumbnail_url || null,
                        background_url: currentSpecies.background_url || null,
                        theme_color: currentSpecies.theme_color || "",
                        thumbnail_file: null,
                        background_file: null,
                    });
                    if (currentSpecies.thumbnail_url) {
                        setTemplateImgUrl(currentSpecies.thumbnail_url.startsWith("http") || currentSpecies.thumbnail_url.startsWith("blob:") ? currentSpecies.thumbnail_url : `${APP_CONFIG.BASE_API}/${currentSpecies.thumbnail_url}`);
                        setThumbnailFileName(currentSpecies.thumbnail_url.split('/').pop());
                    }
                    if (currentSpecies.background_url) {
                        setTemplateBgUrl(currentSpecies.background_url.startsWith("http") || currentSpecies.background_url.startsWith("blob:") ? currentSpecies.background_url : `${APP_CONFIG.BASE_API}/${currentSpecies.background_url}`);
                        setBackgroundFileName(currentSpecies.background_url.split('/').pop());
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            toaster.create({
                title: "Lỗi tải dữ liệu",
                description: "Không thể tải danh sách chi hoặc thông tin loài.",
                type: "error"
            });
        }
    };

    const uploadBlockImages = async (description) => {
        return await Promise.all(
            description.map(async (block) => {
                if (block.img_file) {
                    const res = await SPECIES_API.uploadBlockImage(block.img_file);

                    if (res.status === "success") {
                        return {
                            ...block,
                            img_url: res.data.filePath
                        };
                    }
                }
                return block;
            })
        );
    };

    const submitForm = async () => {
        const message = checkFormValidity();
        if (message.length > 0) {
            const errorConfig = {
                title: "Form không hợp lệ",
                description: message,
                type: "error",
            };

            if (toaster.error) toaster.error(errorConfig);
            else toaster.create(errorConfig);

            return;
        }

        try {
            let thumbnailUrl = formData.thumbnail_url;
            let backgroundUrl = formData.background_url;

            if (formData.thumbnail_file) {
                const resThumb = await SPECIES_API.uploadThumbnail(formData.thumbnail_file);
                if (resThumb.status === "success") {
                    thumbnailUrl = resThumb.data.filePath;
                } else {
                    throw new Error("Upload thumbnail thất bại");
                }
            }

            if (formData.background_file) {
                const resBg = await SPECIES_API.uploadBackground(formData.background_file);
                if (resBg.status === "success") {
                    backgroundUrl = resBg.data.filePath;
                } else {
                    throw new Error("Upload background thất bại");
                }
            }

            const updatedDescription = await uploadBlockImages(formData.description);
            const cleanDescription = updatedDescription.map(block => {
                const { img_file, ...rest } = block;
                return rest;
            });

            const payload = {
                ...formData,
                thumbnail_url: thumbnailUrl,
                background_url: backgroundUrl,
                description: cleanDescription
            };

            delete payload.thumbnail_file;
            delete payload.background_file;

            console.log("Sending Species data:", payload);

            const res = isEdit
                ? await SPECIES_API.updateSpecies(id, payload)
                : await SPECIES_API.createSpecies(payload);

            toaster.create({
                title: res.title || (res.status === "success" ? "Thành công" : "Lỗi"),
                description: res.message || (isEdit ? "Cập nhật loài thành công" : "Tạo loài mới thành công"),
                type: res.status === "success" ? "success" : "error",
            });

            if (res.status === "success") {
                if (isEdit) {
                    setTimeout(() => {
                        navigate("/kingdoms/manage");
                    }, 1500);
                } else {
                    setFormData({
                        genus_id: "",
                        normal_name: "",
                        science_name: "",
                        cell_type: "",
                        nutrition_mode: "",
                        reproduction_type: "",
                        habitat: [],
                        distribution: [],
                        average_size: { value: "", unit: "cm" },
                        average_weight: { value: "", unit: "kg" },
                        lifespan: { value: "", unit: "năm" },
                        description: [],
                        thumbnail_url: null,
                        background_url: null,
                        theme_color: "",
                        thumbnail_file: null,
                        background_file: null,
                    });

                    setTemplateImgUrl(null);
                    setTemplateBgUrl(null);
                    setThumbnailFileName('');
                    setBackgroundFileName('');
                    setUploadFileKey(Date.now());
                }
            }

        } catch (error) {
            console.error("Submit Error:", error);

            const failConfig = {
                title: "Lỗi hệ thống",
                description: error.message || "Không thể kết nối đến máy chủ.",
                type: "error"
            };

            if (toaster.error) toaster.error(failConfig);
            else toaster.create(failConfig);
        }
    };

    const containsNegative = (str) => {
        if (!str || typeof str !== "string") return false;
        const cleaned = str.replace(/\d+(\.\d+)?\s*-\s*\d+(\.\d+)?/g, "");
        return /-\s*\d+/.test(cleaned) || /^-\s*/.test(str.trim());
    };

    const checkFormValidity = () => {
        let errors = [];

        if (!formData.genus_id) errors.push("Chưa chọn chi");
        if (!formData.normal_name?.trim()) errors.push("Tên thường gọi");
        if (!formData.science_name?.trim()) errors.push("Tên khoa học");
        if (!formData.cell_type) errors.push("Loại tế bào");
        if (!formData.nutrition_mode) errors.push("Chế độ dinh dưỡng");
        if (!formData.reproduction_type) errors.push("Hình thức sinh sản");

        if (containsNegative(formData.average_size?.value)) {
            errors.push("Kích thước trung bình không được là số âm");
        }
        if (containsNegative(formData.average_weight?.value)) {
            errors.push("Trọng lượng trung bình không được là số âm");
        }
        if (containsNegative(formData.lifespan?.value)) {
            errors.push("Tuổi thọ trung bình không được là số âm");
        }

        return errors.length > 0 ? `- ${errors.join("\n- ")}` : "";
    };

    const handleImageInputChange = (e, type) => {
        const file = e.target.files?.[0];

        if (file) {
            if (type === "thumbnail") {
                setThumbnailFileName(file.name);
                setTemplateImgUrl(URL.createObjectURL(file));

                setFormData(prev => ({
                    ...prev,
                    thumbnail_file: file
                }));
            }
            else if (type === "background") {
                setBackgroundFileName(file.name);
                setTemplateBgUrl(URL.createObjectURL(file));

                setFormData(prev => ({
                    ...prev,
                    background_file: file
                }));
            }
        }
    };

    const addDescriptionBlock = (type) => {
        const newBlock = {
            block_type: type,
            heading: "",
            content: "",
            img_url: null,
            bg_color: "",
        };
        setFormData((prev) => ({
            ...prev,
            description: [...prev.description, newBlock],
        }));
    };

    const updateBlockData = (index, field, value) => {
        const updatedDescription = [...formData.description];
        updatedDescription[index][field] = value;
        setFormData({ ...formData, description: updatedDescription });
    };

    const removeDescriptionBlock = (index) => {
        setFormData((prev) => ({
            ...prev,
            description: prev.description.filter((_, i) => i !== index),
        }));
    };

    const handleBlockImageChange = async (index, e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            const res = await SPECIES_API.uploadBlockImage(file);
            if (res.status === "success") {
                const updatedDescription = [...formData.description];
                updatedDescription[index].img_url = res.data.filePath;
                setFormData({ ...formData, description: updatedDescription });

                toaster.success({
                    title: "Upload ảnh block thành công",
                    description: res.message,
                });
            }
        }
    };

    function getContrastColor(hex) {
        if (!hex) return "#FFFFFF";

        hex = hex.replace("#", "");

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness > 155 ? "#0F0F0F" : "#FFFFFF";
    }

    const textColor = getContrastColor(formData.theme_color);

    return (
        <Box>
            <Heading fontSize="40px" my={4}>{isEdit ? "Chỉnh sửa loài" : "Thêm loài mới"}</Heading>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                <GridItem colSpan={{ base: 12, lg: 8 }}>
                    <Box
                        w="100%"
                        p={6}
                        borderRadius="lg"
                        bg={isDark ? "#141e33" : "#ffffff"}
                    >
                        <Heading fontWeight="bold" mb={4} fontSize={"2xl"} textAlign="center">Thông tin cơ bản</Heading>
                        <Stack spacing={6}>
                            {/* Chi trực thuộc & Tên */}
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                                gap={4}
                                my={2}
                            >
                                <GridItem>
                                    <Text mb={1}>Thuộc chi</Text>
                                    <Box
                                        as="select"
                                        value={formData.genus_id}
                                        onChange={(e) => setFormData({ ...formData, genus_id: e.target.value })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor="rgba(148, 163, 184, 0.25)"
                                        borderWidth="1px"
                                        borderRadius="md"
                                        w="100%"
                                        h="40px"
                                        px={3}
                                        color={isDark ? "white" : "black"}
                                        style={{
                                            appearance: "none",
                                            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='${isDark ? "%23FFFFFF" : "%236B7280"}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                                            backgroundPosition: "right 0.75rem center",
                                            backgroundSize: "1.2em 1.2em",
                                            backgroundRepeat: "no-repeat"
                                        }}
                                    >
                                        <option value="" disabled style={{ backgroundColor: isDark ? "#1f2852" : "#ffffff", color: "gray" }}>
                                            -- Chọn chi --
                                        </option>
                                        {allGenuses.map((g) => (
                                            <option key={g._id || g.id} value={g._id || g.id} style={{ backgroundColor: isDark ? "#141e33" : "#ffffff", color: isDark ? "white" : "black" }}>
                                                {g.normal_name} ({g.science_name})
                                            </option>
                                        ))}
                                    </Box>
                                </GridItem>
                                <GridItem></GridItem>
                            </Grid>

                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                                gap={4}
                                my={2}
                            >
                                <GridItem>
                                    <Text mb={1}>Tên thường gọi</Text>
                                    <Input
                                        placeholder="Tên loài"
                                        value={formData.normal_name}
                                        onChange={(e) => setFormData({ ...formData, normal_name: e.target.value })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor="rgba(148, 163, 184, 0.25)"
                                    />
                                </GridItem>
                                <GridItem>
                                    <Text mb={1}>Tên khoa học</Text>
                                    <Input
                                        placeholder="Tên chuyên môn"
                                        value={formData.science_name}
                                        onChange={(e) => setFormData({ ...formData, science_name: e.target.value })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor="rgba(148, 163, 184, 0.25)"
                                    />
                                </GridItem>
                            </Grid>

                            {/* Ảnh */}
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                                gap={4}
                                my={2}
                            >
                                <GridItem>
                                    <Text mb={1}>Thêm ảnh nền</Text>
                                    <Box
                                        as="button"
                                        type="button"
                                        w="100%"
                                        onClick={() => backgroundInputRef.current?.click()}
                                        p={2}
                                        borderRadius="md"
                                        bg={isDark ? "#1f2852" : "#f8fafc"}
                                        border="1px solid"
                                        borderColor="rgba(148, 163, 184, 0.25)"
                                        cursor="pointer"
                                        transition="all 0.2s"
                                        _hover={{
                                            borderColor: "rgba(148, 163, 184, 0.5)",
                                            bg: isDark ? "#252d4a" : "#eef2f7"
                                        }}
                                        textAlign="left"
                                    >
                                        <Text fontSize="sm" color={backgroundFileName ? (isDark ? "#e2e8f0" : "#0f172a") : "#94a3b8"}>
                                            {backgroundFileName || "Chọn ảnh nền..."}
                                        </Text>
                                    </Box>
                                    <input
                                        ref={backgroundInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageInputChange(e, "background")}
                                        style={{ display: "none" }}
                                    />
                                </GridItem>
                                <GridItem>
                                    <Text mb={1}>Thêm ảnh đại diện</Text>
                                    <Box
                                        as="button"
                                        type="button"
                                        w="100%"
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        p={2}
                                        borderRadius="md"
                                        bg={isDark ? "#1f2852" : "#f8fafc"}
                                        border="1px solid"
                                        borderColor="rgba(148, 163, 184, 0.25)"
                                        cursor="pointer"
                                        transition="all 0.2s"
                                        _hover={{
                                            borderColor: "rgba(148, 163, 184, 0.5)",
                                            bg: isDark ? "#252d4a" : "#eef2f7"
                                        }}
                                        textAlign="left"
                                    >
                                        <Text fontSize="sm" color={thumbnailFileName ? (isDark ? "#e2e8f0" : "#0f172a") : "#94a3b8"}>
                                            {thumbnailFileName || "Chọn ảnh đại diện..."}
                                        </Text>
                                    </Box>
                                    <input
                                        ref={thumbnailInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageInputChange(e, "thumbnail")}
                                        style={{ display: "none" }}
                                    />
                                </GridItem>
                            </Grid>

                            {/* Tiêu chí phân loại */}
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                                gap={4}
                                my={2}
                            >
                                <GridItem>
                                    <Stack spacing={3}>
                                        <Text mb={1}>Loại tế bào</Text>
                                        <Stack direction={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 6 }} wrap="wrap">
                                            {TAXONOMY_OPTIONS.cell.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center cursor-pointer text-xs md:text-sm lg:text-base gap-1.5 md:gap-2.5"
                                                    style={{
                                                        color: isDark ? "white" : "#0f172a",
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="cell_type"
                                                        value={option.value}
                                                        checked={formData.cell_type === option.value}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                cell_type: e.target.value,
                                                            })
                                                        }
                                                        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-all duration-200"
                                                        style={{
                                                            appearance: "none",
                                                            border: "2px solid",
                                                            borderColor: isDark ? "white" : "#0f172a",
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                formData.cell_type === option.value
                                                                    ? "#ffffff"
                                                                    : "transparent",
                                                            boxShadow:
                                                                formData.cell_type === option.value
                                                                    ? "inset 0 0 0 4px #141e33"
                                                                    : "none",
                                                        }}
                                                    />
                                                    {option.label}
                                                </label>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </GridItem>
                                <GridItem>
                                    <Stack spacing={3}>
                                        <Text mb={1}>Loại dinh dưỡng</Text>
                                        <Stack direction={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 6 }} wrap="wrap">
                                            {TAXONOMY_OPTIONS.nutrition.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center cursor-pointer text-xs md:text-sm lg:text-base gap-1.5 md:gap-2.5"
                                                    style={{
                                                        color: isDark ? "white" : "#0f172a",
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="nutrition_mode"
                                                        value={option.value}
                                                        checked={formData.nutrition_mode === option.value}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                nutrition_mode: e.target.value,
                                                            })
                                                        }
                                                        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-all duration-200"
                                                        style={{
                                                            appearance: "none",
                                                            border: "2px solid",
                                                            borderColor: isDark ? "white" : "#0f172a",
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                formData.nutrition_mode === option.value
                                                                    ? "#ffffff"
                                                                    : "transparent",
                                                            boxShadow:
                                                                formData.nutrition_mode === option.value
                                                                    ? "inset 0 0 0 4px #141e33"
                                                                    : "none",
                                                        }}
                                                    />
                                                    {option.label}
                                                </label>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </GridItem>
                            </Grid>
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                                gap={4}
                                my={2}
                            >
                                <GridItem>
                                    <Stack spacing={3}>
                                        <Text mb={1}>Loại sinh sản</Text>
                                        <Stack direction={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 6 }} wrap="wrap">
                                            {TAXONOMY_OPTIONS.reproduction.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center cursor-pointer text-xs md:text-sm lg:text-base gap-1.5 md:gap-2.5"
                                                    style={{
                                                        color: isDark ? "white" : "#0f172a",
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="reproduction_type"
                                                        value={option.value}
                                                        checked={formData.reproduction_type === option.value}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                reproduction_type: e.target.value,
                                                            })
                                                        }
                                                        className="w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-all duration-200"
                                                        style={{
                                                            appearance: "none",
                                                            border: "2px solid",
                                                            borderColor: isDark ? "white" : "#0f172a",
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                formData.reproduction_type === option.value
                                                                    ? "#ffffff"
                                                                    : "transparent",
                                                            boxShadow:
                                                                formData.reproduction_type === option.value
                                                                    ? "inset 0 0 0 4px #141e33"
                                                                    : "none",
                                                        }}
                                                    />
                                                    {option.label}
                                                </label>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </GridItem>
                                <GridItem>
                                    <Stack spacing={3}>
                                        <Text mb={1}>Màu chủ đề</Text>
                                        <Stack direction="row" gap={2} w="100%">
                                            <Input
                                                placeholder="VD: #2a69ac"
                                                value={formData.theme_color}
                                                onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                                                bg={isDark ? "#1f2852" : "#ffffff"}
                                                borderColor="rgba(148, 163, 184, 0.25)"
                                            />
                                            <Box
                                                position="relative"
                                                w="40px"
                                                h="40px"
                                                borderRadius="md"
                                                border="1px solid"
                                                borderColor="rgba(148, 163, 184, 0.25)"
                                                bg={formData.theme_color || "#1f2852"}
                                                flexShrink={0}
                                            >
                                                <input
                                                    type="color"
                                                    value={formData.theme_color || "#1f2852"}
                                                    onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                                                    style={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        opacity: 0,
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </GridItem>
                            </Grid>
                        </Stack>
                    </Box>

                    {/* Phân bố địa lý & Môi trường sống */}
                    <Box
                        w="100%"
                        p={6}
                        mt={4}
                        borderRadius="lg"
                        bg={isDark ? "#141e33" : "#ffffff"}
                    >
                        <Heading fontWeight="bold" mb={4} fontSize={"2xl"} textAlign="center">
                            Phân bố địa lý & Môi trường sống
                        </Heading>
                        <Stack spacing={6}>
                            <MultiSelectTagInput
                                label="Môi trường sống"
                                placeholder="Chọn môi trường hoặc nhập môi trường mới..."
                                options={TAXONOMY_OPTIONS.habitat}
                                selectedValues={formData.habitat || []}
                                onChange={(newHabitatList) => setFormData(prev => ({ ...prev, habitat: newHabitatList }))}
                                isDark={isDark}
                            />

                            <MultiSelectTagInput
                                label="Phân bố địa lý"
                                placeholder="Chọn khu vực hoặc nhập địa điểm mới..."
                                options={TAXONOMY_OPTIONS.distribution}
                                selectedValues={formData.distribution || []}
                                onChange={(newDistList) => setFormData(prev => ({ ...prev, distribution: newDistList }))}
                                isDark={isDark}
                            />
                        </Stack>
                    </Box>

                    {/* Đặc điểm hình thái & Tuổi thọ */}
                    <Box
                        w="100%"
                        p={6}
                        mt={4}
                        borderRadius="lg"
                        bg={isDark ? "#141e33" : "#ffffff"}
                    >
                        <Heading fontWeight="bold" mb={4} fontSize={"2xl"} textAlign="center">
                            Đặc điểm hình thái & Tuổi thọ
                        </Heading>
                        <Grid
                            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                            gap={4}
                        >
                            <GridItem>
                                <Text mb={1}>Kích thước trung bình</Text>
                                <Stack direction="row" spacing={2}>
                                    <Input
                                        placeholder="Kích thước"
                                        value={formData.average_size?.value || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            average_size: {
                                                ...formData.average_size,
                                                value: e.target.value
                                            }
                                        })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor={containsNegative(formData.average_size?.value) ? "red.500" : "rgba(148, 163, 184, 0.25)"}
                                    />
                                    <Box
                                        as="select"
                                        value={formData.average_size?.unit || "cm"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            average_size: {
                                                ...formData.average_size,
                                                unit: e.target.value
                                            }
                                        })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor="rgba(148, 163, 184, 0.25)"
                                        borderWidth="1px"
                                        borderRadius="md"
                                        w="110px"
                                        h="40px"
                                        px={2}
                                        color={isDark ? "white" : "black"}
                                        flexShrink={0}
                                        style={{
                                            appearance: "none",
                                            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='${isDark ? "%23FFFFFF" : "%236B7280"}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                                            backgroundPosition: "right 0.5rem center",
                                            backgroundSize: "1.1em 1.1em",
                                            backgroundRepeat: "no-repeat"
                                        }}
                                    >
                                        {TAXONOMY_OPTIONS.size_units.map(u => (
                                            <option key={u.value} value={u.value} style={{ backgroundColor: isDark ? "#141e33" : "#ffffff", color: isDark ? "white" : "black" }}>
                                                {u.label}
                                            </option>
                                        ))}
                                    </Box>
                                </Stack>
                                {containsNegative(formData.average_size?.value) && (
                                    <Text fontSize="xs" color="red.400" mt={1}>
                                        ⚠️ Kích thước không được là số âm
                                    </Text>
                                )}
                            </GridItem>
                            <GridItem>
                                <Text mb={1}>Trọng lượng trung bình</Text>
                                <Stack direction="row" spacing={2}>
                                    <Input
                                        placeholder="Trọng lượng"
                                        value={formData.average_weight?.value || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            average_weight: {
                                                ...formData.average_weight,
                                                value: e.target.value
                                            }
                                        })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor={containsNegative(formData.average_weight?.value) ? "red.500" : "rgba(148, 163, 184, 0.25)"}
                                    />
                                    <Box
                                        as="select"
                                        value={formData.average_weight?.unit || "kg"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            average_weight: {
                                                ...formData.average_weight,
                                                unit: e.target.value
                                            }
                                        })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor="rgba(148, 163, 184, 0.25)"
                                        borderWidth="1px"
                                        borderRadius="md"
                                        w="110px"
                                        h="40px"
                                        px={2}
                                        color={isDark ? "white" : "black"}
                                        flexShrink={0}
                                        style={{
                                            appearance: "none",
                                            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='${isDark ? "%23FFFFFF" : "%236B7280"}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                                            backgroundPosition: "right 0.5rem center",
                                            backgroundSize: "1.1em 1.1em",
                                            backgroundRepeat: "no-repeat"
                                        }}
                                    >
                                        {TAXONOMY_OPTIONS.weight_units.map(u => (
                                            <option key={u.value} value={u.value} style={{ backgroundColor: isDark ? "#141e33" : "#ffffff", color: isDark ? "white" : "black" }}>
                                                {u.label}
                                            </option>
                                        ))}
                                    </Box>
                                </Stack>
                                {containsNegative(formData.average_weight?.value) && (
                                    <Text fontSize="xs" color="red.400" mt={1}>
                                        ⚠️ Trọng lượng không được là số âm
                                    </Text>
                                )}
                            </GridItem>
                            <GridItem>
                                <Text mb={1}>Tuổi thọ trung bình</Text>
                                <Stack direction="row" spacing={2}>
                                    <Input
                                        placeholder="Tuổi thọ"
                                        value={formData.lifespan?.value || ""}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            lifespan: {
                                                ...formData.lifespan,
                                                value: e.target.value
                                            }
                                        })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor={containsNegative(formData.lifespan?.value) ? "red.500" : "rgba(148, 163, 184, 0.25)"}
                                    />
                                    <Box
                                        as="select"
                                        value={formData.lifespan?.unit || "năm"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            lifespan: {
                                                ...formData.lifespan,
                                                unit: e.target.value
                                            }
                                        })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor="rgba(148, 163, 184, 0.25)"
                                        borderWidth="1px"
                                        borderRadius="md"
                                        w="110px"
                                        h="40px"
                                        px={2}
                                        color={isDark ? "white" : "black"}
                                        flexShrink={0}
                                        style={{
                                            appearance: "none",
                                            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='${isDark ? "%23FFFFFF" : "%236B7280"}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                                            backgroundPosition: "right 0.5rem center",
                                            backgroundSize: "1.1em 1.1em",
                                            backgroundRepeat: "no-repeat"
                                        }}
                                    >
                                        {TAXONOMY_OPTIONS.lifespan_units.map(u => (
                                            <option key={u.value} value={u.value} style={{ backgroundColor: isDark ? "#141e33" : "#ffffff", color: isDark ? "white" : "black" }}>
                                                {u.label}
                                            </option>
                                        ))}
                                    </Box>
                                </Stack>
                                {containsNegative(formData.lifespan?.value) && (
                                    <Text fontSize="xs" color="red.400" mt={1}>
                                        ⚠️ Tuổi thọ không được là số âm
                                    </Text>
                                )}
                            </GridItem>
                        </Grid>
                    </Box>

                    {/* Blocks */}
                    <Stack spacing={0} w="100%" mt={4}>
                        {formData.description.map((block, index) => (
                            <Box
                                key={index}
                                position="relative"
                            >
                                <Button
                                    position="absolute"
                                    top="35px"
                                    right="10px"
                                    zIndex={10}
                                    size="sm"
                                    bg="red.500"
                                    color="white"
                                    _hover={{
                                        bg: "red.600"
                                    }}
                                    onClick={() => removeDescriptionBlock(index)}
                                >
                                    Xoá
                                </Button>
                                <BlockKingdom
                                    block={block}
                                    index={index}
                                    updateBlockData={updateBlockData}
                                    handleBlockImageChange={handleBlockImageChange}
                                    getContrastColor={getContrastColor}
                                    textColor={textColor}
                                    themeColor={formData.theme_color}
                                />
                            </Box>
                        ))}
                    </Stack>

                    {/* Block Adders */}
                    <Box
                        w="100%"
                        mt={4}
                        borderRadius="lg"
                        bg={isDark ? "#141e33" : "#ffffff"}
                        border={isDark ? "none" : "1px solid #e2e8f0"}
                    >
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            p={2}
                            borderRadius="lg"
                            textAlign="center"
                        >Thêm nội dung</Text>
                        <Box p={2}>
                            <Grid
                                templateColumns={{ sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
                                gap={4}
                            >
                                <Button
                                    onClick={() => addDescriptionBlock("standard")}
                                    bg={isDark ? "#1f2852" : "#f8fafc"}
                                    color={isDark ? "white" : "#0f172a"}
                                    _hover={{ bg: isDark ? "#252d4a" : "#eef2f7" }}
                                    border="1px solid"
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                >
                                    <Text>Văn Bản</Text>
                                </Button>
                                <Button
                                    onClick={() => addDescriptionBlock("image_left")}
                                    bg={isDark ? "#1f2852" : "#f8fafc"}
                                    color={isDark ? "white" : "#0f172a"}
                                    _hover={{ bg: isDark ? "#252d4a" : "#eef2f7" }}
                                    border="1px solid"
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                >
                                    <Text>Ảnh + Văn Bản</Text>
                                </Button>
                                <Button
                                    onClick={() => addDescriptionBlock("image_right")}
                                    bg={isDark ? "#1f2852" : "#f8fafc"}
                                    color={isDark ? "white" : "#0f172a"}
                                    _hover={{ bg: isDark ? "#252d4a" : "#eef2f7" }}
                                    border="1px solid"
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                >
                                    <Text>Văn Bản + Ảnh</Text>
                                </Button>
                                <Button
                                    onClick={() => addDescriptionBlock("image_top")}
                                    bg={isDark ? "#1f2852" : "#f8fafc"}
                                    color={isDark ? "white" : "#0f172a"}
                                    _hover={{ bg: isDark ? "#252d4a" : "#eef2f7" }}
                                    border="1px solid"
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                >
                                    <Text>Ảnh Trên + Văn Bản Dưới</Text>
                                </Button>
                            </Grid>
                        </Box>
                    </Box>

                    <Button
                        mt={4}
                        w="100%"
                        bg="#38A169"
                        color="white"
                        _hover={{ bg: "#2F855A" }}
                        onClick={submitForm}
                    >
                        Hoàn thành
                    </Button>
                </GridItem>

                {/* Review Panel */}
                <GridItem colSpan={{ base: 12, lg: 4 }}>
                    <Box position="sticky" top="80px">
                        <Review
                            formData={formData}
                            templateImgUrl={templateImgUrl}
                            templateBgUrl={templateBgUrl}
                            description={formData.description}
                        />
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}
