import { useState, useEffect, useRef } from "react"
import {
    Button,
    Input,
    Image,
    Stack,
    VStack,
    Grid,
    GridItem,
    Textarea,
    Icon,
    Box,
    Heading,
    Text,
} from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu"
import { useTheme } from "next-themes";

//method
import { TAXONOMY_OPTIONS } from "../../config/data.config";

//components
import BlockKingdom from "../../components/form/BlockKingdom";
import { Toaster, toaster } from "../../components/ui/Toaster"
import KINGDOM_API from "../../services/kingdom.api";
import PHYLUM_API from "../../services/phylum.api";
import ReviewKingdom from "../../components/review/reviewKingdom";

export default function AddPhylum() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [uploadFileKey, setUploadFileKey] = useState(Date.now());
    const [templateImgUrl, setTemplateImgUrl] = useState(null);
    const [templateBgUrl, setTemplateBgUrl] = useState(null);
    const [backgroundFileName, setBackgroundFileName] = useState('');
    const [thumbnailFileName, setThumbnailFileName] = useState('');
    const [allKingdoms, setAllKingdoms] = useState([]);
    const backgroundInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const [formData, setFormData] = useState({
        kingdom_id: "",
        normal_name: "",
        science_name: "",
        cell_type: "",
        nutrition_mode: "",
        reproduction_type: "",
        description: [],
        thumbnail_url: null,
        background_url: null,
        theme_color: "",
        thumbnail_file: null,
        background_file: null,
    });

    useEffect(() => {
        document.title = "Admin | Thêm Ngành Mới";
        fetchKingdoms();
    }, []);

    useEffect(() => {
        return () => {
            if (templateImgUrl) URL.revokeObjectURL(templateImgUrl);
            if (templateBgUrl) URL.revokeObjectURL(templateBgUrl);
        };
    }, [templateImgUrl, templateBgUrl]);

    // ============== Handlers ===================
    const fetchKingdoms = async () => {
        try {
            const res = await KINGDOM_API.getAll();
            if (res && res.status === "success") {
                setAllKingdoms(res.data);
            } else if (Array.isArray(res)) {
                setAllKingdoms(res);
            } else if (res && res.data) {
                setAllKingdoms(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách giới:", error);
            toaster.create({
                title: "Lỗi tải dữ liệu",
                description: "Không thể tải danh sách các giới.",
                type: "error"
            });
        }
    };

    const uploadBlockImages = async (description) => {
        return await Promise.all(
            description.map(async (block) => {
                if (block.img_file) {
                    const res = await PHYLUM_API.uploadBlockImage(block.img_file);

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
            let thumbnailUrl = null;
            let backgroundUrl = null;

            if (formData.thumbnail_file) {
                const resThumb = await PHYLUM_API.uploadThumbnail(formData.thumbnail_file);
                if (resThumb.status === "success") {
                    thumbnailUrl = resThumb.data.filePath;
                } else {
                    throw new Error("Upload thumbnail thất bại");
                }
            }

            if (formData.background_file) {
                const resBg = await PHYLUM_API.uploadBackground(formData.background_file);
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

            console.log("Sending Phylum data:", payload);

            const res = await PHYLUM_API.createPhylum(payload);

            toaster.create({
                title: res.title || (res.status === "success" ? "Thành công" : "Lỗi"),
                description: res.message || "Tạo ngành mới thành công",
                type: res.status === "success" ? "success" : "error",
            });

            if (res.status === "success") {
                setFormData({
                    kingdom_id: "",
                    normal_name: "",
                    science_name: "",
                    cell_type: "",
                    nutrition_mode: "",
                    reproduction_type: "",
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

    const checkFormValidity = () => {
        let errors = [];

        if (!formData.kingdom_id) errors.push("Chưa chọn giới");
        if (!formData.normal_name?.trim()) errors.push("Tên thường gọi");
        if (!formData.science_name?.trim()) errors.push("Tên khoa học");
        if (!formData.cell_type) errors.push("Loại tế bào");
        if (!formData.nutrition_mode) errors.push("Chế độ dinh dưỡng");
        if (!formData.reproduction_type) errors.push("Hình thức sinh sản");

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
        }
        setFormData((prev) => ({
            ...prev,
            description: [...prev.description, newBlock],
        }));
    }

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

            const res = await PHYLUM_API.uploadBlockImage(file);
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
    }

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
            <Heading fontSize="40px" my={4}>Thêm ngành mới</Heading>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                <GridItem colSpan={{ base: 12, lg: 8 }}>
                    <Box
                        w="100%"
                        p={6}
                        borderRadius="lg"
                        bg={isDark ? "#111a3a" : "#ffffff"}
                    >
                        <Heading fontWeight="bold" mb={4} fontSize={"2xl"} textAlign="center">Thông tin cơ bản</Heading>
                        <Stack spacing={6}>
                            {/* Giới trực thuộc & Tên */}
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                                gap={4}
                                my={2}
                            >
                                <GridItem>
                                    <Text mb={1}>Thuộc giới</Text>
                                    <Box
                                        as="select"
                                        value={formData.kingdom_id}
                                        onChange={(e) => setFormData({ ...formData, kingdom_id: e.target.value })}
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
                                            -- Chọn giới --
                                        </option>
                                        {allKingdoms.map((k) => (
                                            <option key={k._id || k.id} value={k._id || k.id} style={{ backgroundColor: isDark ? "#111a3a" : "#ffffff", color: isDark ? "white" : "black" }}>
                                                {k.normal_name} ({k.science_name})
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
                                        placeholder="VD: Ngành Thân mềm"
                                        value={formData.normal_name}
                                        onChange={(e) => setFormData({ ...formData, normal_name: e.target.value })}
                                        bg={isDark ? "#1f2852" : "#ffffff"}
                                        borderColor="rgba(148, 163, 184, 0.25)"
                                    />
                                </GridItem>
                                <GridItem>
                                    <Text mb={1}>Tên khoa học</Text>
                                    <Input
                                        placeholder="VD: Mollusca"
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
                                                                    ? "inset 0 0 0 4px #111a3a"
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
                                                                    ? "inset 0 0 0 4px #111a3a"
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
                                                                    ? "inset 0 0 0 4px #111a3a"
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
                        bg={isDark ? "#111a3a" : "#ffffff"}
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
                        bg="#2a69ac"
                        color="white"
                        _hover={{ bg: "#2c5282" }}
                        onClick={submitForm}
                    >
                        Hoàn thành
                    </Button>
                </GridItem>

                {/* Review Panel */}
                <GridItem colSpan={{ base: 12, lg: 4 }}>
                    <ReviewKingdom
                        formData={formData}
                        templateImgUrl={templateImgUrl}
                        templateBgUrl={templateBgUrl}
                        description={formData.description}
                    />
                </GridItem>
            </Grid>
        </Box>
    );
}
