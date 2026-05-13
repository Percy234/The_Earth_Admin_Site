import { useState, useEffect, useRef } from "react"
import {
    Button,
    Input,
    NativeSelect,
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
import { LuUpload } from "react-icons/lu";
import { useTheme } from "next-themes";

//method
import { TAXONOMY_OPTIONS } from "../../config/data.config";

//api
import KINGDOM_API from "../../services/kingdom.api";

//components
import BlockFormKingdom from "../../components/form/BlockFormKingdom";
import { Toaster, toaster } from "../../components/ui/Toaster"
import { Tooltip } from "../../components/ui/Tooltip";
import TagList from "../../components/ui/TagList";

export default function AddKingdomView() {
    const { theme } = useTheme();
    const [uploadFileKey, setUploadFileKey] = useState(Date.now());
    const [templateImgUrl, setTemplateImgUrl] = useState(null);
    const [allKingdoms, setAllKingdoms] = useState([]);
    const [formData, setFormData] = useState({
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

    //hooks
    useEffect(() => {
        document.title = "Admin | Thêm Giới Mới";
        fetchAllKingdoms();
    }, []);

    // ============== Handlers ===================
    const fetchAllKingdoms = async () => {
        const kingdoms = await KINGDOM_API.getAll();
        // console.log(kingdoms);
        setAllKingdoms(kingdoms.data);
    };
    const uploadBlockImages = async (description) => {
        return await Promise.all(
            description.map(async (block) => {
                if (block.img_file) {
                    const res = await KINGDOM_API.uploadBlockImage(block.img_file);

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
                const resThumb = await KINGDOM_API.uploadThumbnail(formData.thumbnail_file);
                if (resThumb.status === "success") {
                    thumbnailUrl = resThumb.data.filePath;
                } else {
                    throw new Error("Upload thumbnail thất bại");
                }
            }

            if (formData.background_file) {
                const resBg = await KINGDOM_API.uploadBackground(formData.background_file);
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

            console.log("Sending data:", payload);

            const res = await KINGDOM_API.createKingdom(payload);

            toaster.create({
                title: res.title || (res.status === "success" ? "Thành công" : "Lỗi"),
                description: res.message,
                type: res.status === "success" ? "success" : "error",
            });

            if (res.status === "success") {
                setFormData({
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
        
        if (!formData.normal_name?.trim()) errors.push("Tên thường gọi");
        if (!formData.science_name?.trim()) errors.push("Tên khoa học");
        if (!formData.cell_type) errors.push("Loại tế bào");
        if (!formData.nutrition_mode) errors.push("Chế độ dinh dưỡng");
        if (!formData.reproduction_type) errors.push("Hình thức sinh sản");
        // if (formData.description.length === 0) errors.push("Nội dung mô tả");

        return errors.length > 0 ? `- ${errors.join("\n- ")}` : "";
    };

    //get files
    const handleFileChange = (files, type) => {
        if (files && files.acceptedFiles.length > 0) {
            const file = files.acceptedFiles[0];

            if (type === "thumbnail") {
                // preview
                setTemplateImgUrl(URL.createObjectURL(file));

                // lưu file thật
                setFormData(prev => ({
                    ...prev,
                    thumbnail_file: file
                }));
            }

            if (type === "background") {
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
    const handleBlockImageChange = async (index, e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            const res = await KINGDOM_API.uploadBlockImage(file);
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
    // Hàm kiểm tra màu sáng hay tối
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
    const colorInputRef = useRef(null);
    const bgInputRef = useRef(null);
    const thumbInputRef = useRef(null);
    const [openSelect, setOpenSelect] = useState(null);
    
    const [templateBgUrl, setTemplateBgUrl] = useState(null);
    useEffect(() => {
        return () => {
            if (templateImgUrl) URL.revokeObjectURL(templateImgUrl);
            if (templateBgUrl) URL.revokeObjectURL(templateBgUrl);
        };
    }, [templateImgUrl, templateBgUrl]);
    return(
        <Box
            display={"flex"}
            flexDirection={"column"}
        >
            {/* Hero banner */}
            <Box
                position="relative"
                w="100%"
                h="130vh"
                overflow="hidden"
            >
                {/* Màu nền */}
                <Box
                    w="100%"
                    h="100%"
                    position={"absolute"}
                    bg={formData.theme_color || "#161433"}
                    cursor="pointer"
                    transition="0.2s"
                    _hover={{ opacity: 0.8 }}
                    onClick={() => colorInputRef.current?.click()}
                    zIndex={0}
                >
                    <Input
                        ref={colorInputRef}
                        type="color"
                        value={formData.theme_color || "#c3b4b4"}
                        onChange={(e) =>
                        setFormData((prev) => ({ 
                            ...prev, 
                            theme_color: e.target.value }))
                        }
                        display="none"
                    />
                </Box>
                <Box
                    w={"100%"}
                    h={"510px"}
                    bg={"white"}
                    position={"absolute"}
                    top="90px"
                    zIndex={1}
                    cursor="pointer"
                    overflow="hidden"
                    onClick={() => bgInputRef.current?.click()}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ opacity: 0.9 }}
                >
                    {(templateBgUrl || formData.background_url) ? (
                        <Box
                            as="img"
                            src={templateBgUrl || `${import.meta.env.VITE_API_URL}/${formData.background_url}`}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                        />
                    ) : (
                        <Stack align="center" color="gray.400">
                            <Icon size="xl"><LuUpload /></Icon>
                            <Text>Nhấn để tải lên ảnh nền giới</Text>
                        </Stack>
                    )}
                    <input
                        type="file"
                        ref={bgInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                handleFileChange({ acceptedFiles: Array.from(e.target.files) }, "background");
                            }
                        }}
                    />
                </Box>
                {/* Ảnh đại diện Giới */}
                <Box
                    position="absolute"
                    top={{ base: "450px", sm: "380px", md: "320px", lg: "230px" }}
                    right={{ base: "30%", md: "8%", lg: "10%" }}
                    transform={{ base: "translateX(50%)", md: "none" }}
                    w={{ base: "180px", sm: "240px", md: "300px", lg: "400px" }}
                    h={{ base: "180px", sm: "240px", md: "300px", lg: "400px" }}
                    borderRadius="md"
                    bg="white"
                    zIndex={2}
                    cursor="pointer"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="lg"
                    onClick={() => thumbInputRef.current?.click()}
                >
                    {(templateImgUrl || formData.thumbnail_url) ? (
                        <Box
                            as="img"
                            src={templateImgUrl || `${import.meta.env.VITE_API_URL}/${formData.thumbnail_url}`}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                        />
                    ) : (
                        <Stack align="center" color="gray.400">
                            <Icon size="xl"><LuUpload /></Icon>
                            <Text textAlign="center" fontSize="sm" px={4}>
                                Nhấn để tải lên ảnh đại diện giới
                            </Text>
                        </Stack>
                    )}
                    <input
                        type="file"
                        ref={thumbInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                handleFileChange({ acceptedFiles: Array.from(e.target.files) }, "thumbnail");
                            }
                        }}
                    />
                </Box>
                <Box
                    position={"absolute"}
                    top={"620px"}
                    w={"100%"}
                    zIndex={2}
                >
                    <Input
                        value={formData.science_name}
                        onChange={(e) => setFormData({ ...formData, science_name: e.target.value })}
                        placeholder="Nhập tên khoa học"
                        _placeholder={{
                            color: "#C8AA6E"
                        }}
                        color={"#C8AA6E"}
                        fontSize={{ base: "24px", md: "24px", lg: "40px" }}
                        variant="unstyled"
                        w={"100%"}
                        h="80px"
                        px={{ base: "24px", md: "50px", lg: "120px" }}
                        py={4}
                        fontStyle={"italic"}
                    />
                    <Input
                        value={formData.normal_name}
                        onChange={(e) => setFormData({ ...formData, normal_name: e.target.value })}
                        placeholder="Nhập tên thường gọi"
                        _placeholder={{
                            color: textColor
                        }}
                        fontSize={{ base: "52px", md: "52px", lg: "80px" }}
                        variant="unstyled"
                        w={"100%"}
                        h="120px"
                        px={{ base: "24px", md: "50px", lg: "120px" }}
                        py={8}
                        fontWeight={"bold"}
                    />
                </Box>
            </Box>

            {/* Taxonomic Criteria (tiêu chí phân loại) */}
            <Box
                w="100%"
                bg="black"
            >
                <Grid
                    minH="200px"
                    mx="30px"
                    my="30px"
                    alignItems="center"
                    templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
                    gap={6}
                >
                    <GridItem
                        colSpan={{ base: 5, md: 1 }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        position="relative"
                    >
                        <Text
                            fontSize="24px"
                            color="white"
                            fontWeight="bold"
                            cursor="pointer"
                            display="flex"
                            alignItems="center"
                            gap="8px"
                            onClick={() => setOpenSelect(openSelect === "cell" ? null : "cell")}
                        >
                            <Image 
                                src="/backgrounds/home/cell.png"
                                boxSize="50px"
                            />
                            Loại Tế Bào
                        </Text>
                        {formData.cell_type && (
                            <Text color="#A1A1AA" mt="6px">
                                {TAXONOMY_OPTIONS.cell.find(o => o.value === formData.cell_type)?.label}
                            </Text>
                        )}
                        {openSelect === "cell" && (
                            <Box
                                position="absolute"
                                top="70px"
                                bg="white"
                                borderRadius="8px"
                                overflow="hidden"
                                zIndex="1000"
                                boxShadow="0 8px 20px rgba(0,0,0,0.4)"
                                minW="160px"
                            >
                                {TAXONOMY_OPTIONS.cell.map((option) => (
                                    <Box
                                        key={option.value}
                                        px="16px"
                                        py="8px"
                                        color="black"
                                        cursor="pointer"
                                        _hover={{ bg: "black", color: "white" }}
                                        onClick={() => {
                                            setFormData({ ...formData, cell_type: option.value });
                                            setOpenSelect(null);
                                        }}
                                    >
                                        {option.label}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </GridItem>
                    <GridItem
                        colSpan={{ base: 5, md: 1 }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        position="relative"
                    >
                        <Text
                            fontSize="24px"
                            fontWeight="bold"
                            color="white"
                            cursor="pointer"
                            display="flex"
                            alignItems="center"
                            gap="8px"
                            onClick={() => setOpenSelect(openSelect === "nutrition" ? null : "nutrition")}
                        >
                            <Image
                                src="/backgrounds/home/nutrition.png"
                                boxSize="50px"
                            />
                            Loại Dinh Dưỡng
                        </Text>
                        {formData.nutrition_mode && (
                            <Text color="#A1A1AA" mt="6px">
                                {TAXONOMY_OPTIONS.nutrition.find(o => o.value === formData.nutrition_mode)?.label}
                            </Text>
                        )}
                        {openSelect === "nutrition" && (
                            <Box
                                position="absolute"
                                top="70px"
                                bg="white"
                                borderRadius="8px"
                                overflow="hidden"
                                zIndex="1000"
                                boxShadow="0 8px 20px rgba(0, 0, 0, 0.4)"
                                minW="160px"
                            >
                                {TAXONOMY_OPTIONS.nutrition.map((option) => (
                                    <Box
                                        key={option.value}
                                        px="16px"
                                        py="8px"
                                        color="black"
                                        cursor="pointer"
                                        _hover={{ bg: "black", color: "white" }}
                                        onClick={() => {
                                            setFormData({ ...formData, nutrition_mode: option.value });
                                            setOpenSelect(null);
                                        }}
                                    >
                                        {option.label}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </GridItem>
                    <GridItem
                        colSpan={{ base: 5, md: 1 }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        position="relative"
                    >
                        <Text
                            fontSize="24px"
                            fontWeight="bold"
                            cursor="pointer"
                            color="white"
                            display="flex"
                            alignItems="center"
                            gap="8px"
                            onClick={() => setOpenSelect(openSelect === "reproduction" ? null : "reproduction")}
                        >
                            <Image
                                src="/backgrounds/home/reproduction.png"
                                boxSize="50px"
                            />
                            Loại Sinh Sản
                        </Text>
                        {formData.reproduction_type && (
                            <Text color="#A1A1AA" mt="6px">
                            {TAXONOMY_OPTIONS.reproduction.find(o => o.value === formData.reproduction_type)?.label}
                            </Text>
                        )}
                        {openSelect === "reproduction" && (
                            <Box
                                position="absolute"
                                top="70px"
                                bg="white"
                                zIndex="1000"
                                overflow="hidden"
                                boxShadow="0 8px 20px rgba(0, 0, 0, 0.4)"
                                borderRadius="8px"
                                minW="160px"
                            >
                                {TAXONOMY_OPTIONS.reproduction.map((option) => (
                                    <Box
                                        key={option.value}
                                        px="16px"
                                        py="8px"
                                        cursor="pointer"
                                        color="black"
                                        _hover={{ bg: "black", color: "white"}}
                                        onClick={() => {
                                            setFormData({ ...formData, reproduction_type: option.value});
                                            setOpenSelect(null);
                                        }}
                                    >
                                        {option.label}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </GridItem>
                    <GridItem 
                        colSpan={{ base: 5, md: 2 }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Image
                            src="/backgrounds/home/earth-white.svg"
                            maxH="120px"
                            objectFit="contain"
                        />
                    </GridItem>
                </Grid>
            </Box>

            {/* Content */}
            <Box
                w="100%"
                bg="#FFFFFF"
            >
                {formData.description.map((block, index) => (
                    <Box
                        key={index}
                        position="relative"
                        borderBottom="1px solid"
                    >
                        <BlockFormKingdom
                            block={block}
                            index={index}
                            updateBlockData={updateBlockData}
                            textColor={textColor}
                            themeColor={formData.theme_color}
                        />

                        <Button
                            position="absolute"
                            top={4}
                            right={4}
                            size="sm"
                            colorScheme="red"
                            bg="red.600"
                            color="white"
                            zIndex={10}
                            onClick={() => {
                                const newDesc = formData.description.filter((_, i) => i !== index);
                                setFormData({ ...formData, description: newDesc });
                            }}
                        >
                            Xóa
                        </Button>
                    </Box>
                ))}
            </Box>
            <Box
                w="100%"
                minH="30vh"
                bgColor="white"
            >
                <Text
                    fontSize={{ base: "24px", md: "24px", lg: "40px" }}
                    color={"#C8AA6E"}
                    fontWeight={"bold"}
                    textAlign={"center"}
                    textTransform={"uppercase"}
                    mt={"18px"}
                >
                    Thêm Nội Dung Mới
                </Text>
                <Grid templateColumns={{ sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} p={6}>
                    <Button
                        h={{ base: "80px", md: "100px" }} 
                        variant="ghost"
                        border="1px solid"
                        borderColor="#C8AA6E"
                        color="#C8AA6E"
                        onClick={() => addDescriptionBlock("standard")}
                    >
                        <VStack>
                            <Icon size="2xl"><LuUpload /></Icon>
                            <Text>Văn Bản</Text>
                        </VStack>
                    </Button>
                    <Button
                        h={{ base: "80px", md: "100px" }} 
                        variant="ghost"
                        border="1px solid"
                        borderColor="#C8AA6E"
                        color="#C8AA6E"
                        onClick={() => addDescriptionBlock("image_left")}
                    >
                        <VStack>
                            <Icon size="2xl"><LuUpload /></Icon>
                            <Text>Văn Bản + Ảnh</Text>
                        </VStack>
                    </Button>
                    <Button
                        h={{ base: "80px", md: "100px" }}
                        variant="ghost"
                        border="1px solid"
                        borderColor="#C8AA6E"
                        color="#C8AA6E"
                        onClick={() => addDescriptionBlock("image_right")}
                    >
                        <VStack>
                            <Icon size="2xl"><LuUpload /></Icon>
                            <Text>Ảnh + Văn Bản</Text>
                        </VStack>
                    </Button>
                    <Button
                        h={{ base: "80px", md: "100px" }}
                        variant="ghost"
                        border="1px solid"
                        borderColor="#C8AA6E"
                        color="#C8AA6E"
                        onClick={() => addDescriptionBlock("image_top")}
                    >
                        <VStack>
                            <Icon size="2xl"><LuUpload /></Icon>
                            <Text>Ảnh Trên + Văn Bản Dưới</Text>
                        </VStack>
                    </Button>
                </Grid>
                <Button
                    size="xl"
                    bg="#C8AA6E"
                    color="white"
                    w="70%"
                    mx="auto"
                    display="block"
                    mb={4}
                    onClick={submitForm}
                    _hover={{
                        transform: "scale(1.02)",
                    }}
                >
                    Hoàn Tất
                </Button>
            </Box>
        </Box>
    )
}