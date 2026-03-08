import { useState, useEffect, useRef } from "react"
import {
    Button,
    Input,
    NativeSelect,
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
import {
    provide_cell_types,
    provide_nutrition_types,
    provide_reproduction_types
} from "../../config/data.config";

//api
import KINGDOM_API from "../../services/kingdom.api";

//components
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
    });

    //setup
    document.title = "Admin | Thêm Giới Mới";

    //hooks
    useEffect(() => {
        fetchAllKingdoms();
    }, [uploadFileKey]);

    // ============== Handlers ===================
    const fetchAllKingdoms = async () => {
        const kingdoms = await KINGDOM_API.getAll();
        // console.log(kingdoms);
        setAllKingdoms(kingdoms.data);
    };
    const submitForm = async () => {
        const message = checkFormValidity();
        if(message.length > 0){
            toaster.error({
                title: "Form không hợp lệ",
                description: `Vui lòng sửa các lỗi sau:\n${message}`,
            });
            return;
        }
        console.log(formData);
        //submit form data to server 
        const res = await KINGDOM_API.createKingdom(formData)
        toaster[res.status]({
            title: res.title,
            description: res.message,
        })

        //reset form if success
        if(res.status === "success"){
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
            });
            setTemplateImgUrl(null);
            setUploadFileKey(Date.now());
        }
    }

    const checkFormValidity = () => {
        let message = "";
        for(let key in formData){
            if(!formData[key] || formData[key].length === 0){
                message = `- ${key} is required.\n`;
                break;
            }
        }
        return message;
    }

    //get files
    const handleFileChange = (files, type) => {
        if(files  && files.acceptedFiles.length > 0){
            //lấy file đầu tiên
            const file = files.acceptedFiles[0];

            if (type === "thumbnail") {
                //tạo URL tạm thời để hiển thị ảnh
                setTemplateImgUrl(URL.createObjectURL(file));
                //upload file lên server
                uploadKingdomThumbnail(file);
            }
            if (type === "background") {
                setTemplateBgUrl(URL.createObjectURL(file));
                uploadBackground(file);
            }
        }
    }

    //upload file to server
    const uploadKingdomThumbnail = async (file) => {
        const res = await KINGDOM_API.uploadThumbnail(file);
        toaster[res.status]({
            title: res.title,
            description: res.message,
        });
        if(res.status === "success"){
            setFormData((prev) => ({
                ...prev,
                thumbnail_url: res.data.filePath,
            }));
        }
    }

    const uploadBackground = async (file) => {
        const res = await KINGDOM_API.uploadBackground(file);
        toaster[res.status]({
            title: res.title,
            description: res.message,
        });
        if(res.status === "success"){
            setFormData((prev) => ({
                ...prev,
                background_url: res.data.filePath,
            }));
        }
    }

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
        hex = hex.replace("#", "");

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness > 155 ? "#0F0F0F" : "#FFFFFF";
    }
    const renderBlockForm = (block, index) => {
        const colorsBlockId = `color-block-${index}`; 

        switch(block.block_type){
            case "standard":
                return (
                    <Box
                        w="100%"
                        minH="90vh"
                        bg={block.bg_color || "#FFFFFF"}
                        cursor="pointer"
                        onClick={() => document.getElementById(colorsBlockId)?.click()}
                    >
                        
                        <Input
                            id={colorsBlockId}
                            type="color"
                            value={block.bg_color || "#FFFFFF"}
                            onChange={(e) => updateBlockData(index, "bg_color", e.target.value)}
                            display="none"
                        />
                        <Box
                            w="80%"
                            onClick={(e) => e.stopPropagation()}
                            mx="auto"
                            pt="80px"
                        >
                            <Input
                                value={block.heading}
                                onChange={(e) => updateBlockData(index, "heading", e.target.value)}
                                placeholder="Nhập tiêu đề"
                                _placeholder={{
                                    color: "#0F0F0F",
                                    fontWeight: "bold"
                                }}
                                color={"#0F0F0F"}
                                fontWeight="bold"
                                textAlign="center"
                                fontSize={{ base: "24px", md: "24px", lg: "40px" }}
                                variant="unstyled"
                                w={"100%"}
                                h="80px"
                                px={{ base: "24px", md: "50px", lg: "120px" }}
                                py={4}
                                fontStyle={"italic"}
                            />
                        </Box>
                        <Box
                            w="80%"
                            mt="30px"
                            mx="auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Textarea
                                value={block.content}
                                onChange={(e) => {
                                    e.target.style.height = "auto";
                                    e.target.style.height = e.target.scrollHeight + "px";
                                    updateBlockData(index, "content", e.target.value);
                                }}
                                placeholder="Nhập nội dung"
                                color="#4B4B4B"
                                textAlign={"center"}
                                _placeholder={{ color: "gray.400" }}
                                fontSize={{ base: "16px", md: "18px", lg: "24px" }}
                                variant="unstyled"
                                lineHeight="1.8"
                                w="100%"
                                minH="200px"
                                h="auto"
                                resize="none"
                                px={{ base: "24px", md: "50px", lg: "120px" }}
                                py={4}
                            />
                        </Box>
                    </Box>
                );
            case "image_left":
                return (
                    <Box
                        w="100%"
                        minH="90vh"
                        bg={block.bg_color || "#FFFFFF"}
                        cursor="pointer"
                        onClick={() => document.getElementById(colorsBlockId)?.click()}
                    >
                        <Input
                            id={colorsBlockId}
                            type="color"
                            value={block.bg_color || "#FFFFFF"}
                            onChange={(e) => updateBlockData(index, "bg_color", e.target.value)}
                            display="none"
                        />
                        <Box
                            w="80%"
                            pt="80px"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Input
                                value={block.heading}
                                onChange={(e) => updateBlockData(index, "heading", e.target.value)}
                                placeholder="Nhập tiêu đề"
                                _placeholder={{
                                    color: "#0F0F0F",
                                    fontWeight: "bold"
                                }}
                                color={"#0F0F0F"}
                                fontWeight="bold"
                                fontSize={{ base: "24px", md: "24px", lg: "40px" }}
                                variant="unstyled"
                                w="100%"
                                h="80px"
                                px={{ base: "24px", md: "50px", lg: "120px" }}
                                py={4}
                                ml="60px"
                                fontStyle={"italic"}
                            />
                        </Box>
                        <Grid
                            templateColumns={"repeat(14, 1fr)"}
                            gap={6}
                            w="80%"
                            mt="30px"
                            mx="auto"
                            pb="100px"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GridItem
                                colSpan={{ base: 14, lg: 9 }}
                            >
                                <Box
                                    position="relative"
                                    w="100%"
                                    aspectRatio={16 / 9}
                                    overflow="hidden"
                                    cursor="pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById(`image-${index}`)?.click();
                                    }}
                                >
                                    <Input
                                        id={`image-${index}`}
                                        type="file"
                                        accept="image/"
                                        display="none"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const previewUrl = URL.createObjectURL(file);
                                            updateBlockData(index, "img_url", previewUrl); 

                                            const res = await KINGDOM_API.uploadBlockImage(file);
                                            if (res.status === "success") {
                                                updateBlockData(index, "img_url", res.data.filePath);
                                            }
                                        }}
                                    />
                                {block.img_url ? (
                                    <Box
                                        as="img"
                                        src={block.img_url}
                                        alt=""
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                    />
                                    ) : (
                                    <Box
                                        w="100%"
                                        h="100%"
                                        bg="gray.200"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        fontSize="18px"
                                        color="gray.500"
                                    >
                                        Nhấn để chọn ảnh
                                    </Box>
                                    )
                                }
                                </Box>
                            </GridItem>
                            <GridItem
                                colSpan={{ base: 14, lg: 5 }}
                            >
                                <Textarea
                                    value={block.content}
                                    onChange={(e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = e.target.scrollHeight + "px";
                                        updateBlockData(index, "content", e.target.value);
                                    }}
                                    color="#4B4B4B"
                                    placeholder="Nhập nội dung"
                                    variant="unstyled"
                                    resize="none"
                                    fontSize={{ base: "16px", md: "18px", lg: "24px" }}
                                    lineHeight="1.8"
                                    w="100%"
                                    h="auto"
                                    minH="200px"
                                />
                            </GridItem>
                        </Grid>
                    </Box>
                );
            case "image_right":
                return (
                    <Box
                        w="100%"
                        minH="90vh"
                        bg={block.bg_color || "#FFFFFF"}
                        cursor="pointer"
                        onClick={() => document.getElementById(colorsBlockId)?.click()}
                    >
                        <Input
                            id={colorsBlockId}
                            type="color"
                            value={block.bg_color || "#FFFFFF"}
                            onChange={(e) => updateBlockData(index, "bg_color", e.target.value)}
                            display="none"
                        />
                        <Box
                            w="80%"
                            pt="80px"
                            ml="auto"
                            mr={"70px"}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Input
                                value={block.heading}
                                onChange={(e) => updateBlockData(index, "heading", e.target.value)}
                                placeholder="Nhập tiêu đề"
                                _placeholder={{
                                    color: "#0F0F0F",
                                    fontWeight: "bold"
                                }}
                                color="#0F0F0F"
                                fontWeight="bold"
                                fontSize={{ base: "24px", md: "24px", lg: "40px" }}
                                variant="unstyled"
                                w="100%"
                                h="80px"
                                fontStyle={"italic"}
                                textAlign="right"
                                px={{ base: "24px", md: "50px", lg: "120px" }}
                                py={4}
                            />
                        </Box>
                        <Grid
                            templateColumns={"repeat(14, 1fr)"}
                            gap={6}
                            w="80%"
                            mt="30px"
                            mx="auto"
                            pb="100px"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GridItem
                                colSpan={{ base: 14, lg: 5 }}
                            >
                                <Textarea
                                    value={block.content}
                                    onChange={(e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = e.target.scrollHeight + "px";
                                        updateBlockData(index, "content", e.target.value);
                                    }}
                                    color="#4B4B4B"
                                    placeholder="Nhập nội dung"
                                    variant="unstyled"
                                    resize="none"
                                    fontSize={{ base: "16px", md: "18px", lg: "24px" }}
                                    lineHeight="1.8"
                                    w="100%"
                                    h="auto"
                                    minH="200px"
                                />
                            </GridItem>
                            <GridItem
                                colSpan={{ base: 14, lg: 9 }}
                            >
                                <Box
                                    position="relative"
                                    w="100%"
                                    aspectRatio={16 / 9}
                                    overflow="hidden"
                                    cursor="pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById(`image-${index}`)?.click();
                                    }}
                                >
                                    <Input
                                        id={`image-${index}`}
                                        type="file"
                                        accept="image/"
                                        display="none"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const previewUrl = URL.createObjectURL(file);
                                            updateBlockData(index, "img_url", previewUrl); 

                                            const res = await KINGDOM_API.uploadBlockImage(file);
                                            if (res.status === "success") {
                                                updateBlockData(index, "img_url", res.data.filePath);
                                            }
                                        }}
                                    />
                                {block.img_url ? (
                                    <Box
                                        as="img"
                                        src={block.img_url}
                                        alt=""
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                    />
                                    ) : (
                                    <Box
                                        w="100%"
                                        h="100%"
                                        bg="gray.200"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        fontSize="18px"
                                        color="gray.500"
                                    >
                                        Nhấn để chọn ảnh
                                    </Box>
                                    )
                                }
                                </Box>
                            </GridItem>
                        </Grid>
                    </Box>
                );
            case "image_top":
                return (
                    <Box
                        w="100%"
                        minH="90vh"
                        bg={formData.theme_color || "#161433"}  
                    >
                        <Box
                            w="100%"
                            pt="80px"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Input
                                value={block.heading}
                                onChange={(e) => updateBlockData(index, "heading", e.target.value)}
                                placeholder="Nhập tiêu đề"
                                _placeholder={{
                                    color: textColor,
                                    fontWeight: "bold"
                                }}
                                color={textColor}
                                fontWeight="bold"
                                fontSize={{ base: "24px", md: "24px", lg: "40px" }}
                                variant="unstyled"
                                w="100%"
                                h="80px"
                                px={{ base: "24px", md: "50px", lg: "120px" }}
                                py={4}
                                fontStyle="italic"
                                mx={"auto"}
                            />
                        </Box>
                        <Grid
                            templateColumns="1fr"
                            w="70%"
                            mx="auto"
                            mt="30px"
                            pb="100px"
                            gap={8}
                        >
                            <GridItem>
                                <Box
                                    w="100%"
                                    aspectRatio={16 / 9}
                                    overflow="hidden"
                                    cursor="pointer"
                                    borderRadius={"sm"}
                                    onClick={() => document.getElementById(`image-${index}`)?.click()}
                                >
                                    <Input
                                        id={`image-${index}`}
                                        type="file"
                                        accept="image/*"
                                        display="none"
                                        onChange={async (e) => {
                                            const file = e.target.file?.[0]
                                            if (!file) return;

                                            const previewUrl = URL.createObjectURL(file);
                                            updateBlockData(index, "img_url", previewUrl); 

                                            const res = await KINGDOM_API.uploadBlockImage(file);
                                            if (res.status === "success") {
                                                updateBlockData(index, "img_url", res.data.filePath);
                                            }
                                        }}
                                    />
                                {block.img_url ? (
                                    <Box
                                        as="img"
                                        src={block.img_url}
                                        alt=""
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                    />
                                    ) : (
                                    <Box
                                        w="100%"
                                        h="100%"
                                        bg="gray.200"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        fontSize="18px"
                                        color="gray.500"
                                    >
                                        Nhấn để chọn ảnh
                                    </Box>
                                    )
                                }
                                </Box>
                            </GridItem>
                            <GridItem>
                                <Textarea
                                    value={block.content}
                                    onChange={(e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = e.target.scrollHeight + "px";
                                        updateBlockData(index, "content", e.target.value);
                                    }}
                                    color={textColor}
                                    placeholder="Nhập nội dung"
                                    variant="unstyled"
                                    resize="none"
                                    fontSize={{ base: "16px", md: "18px", lg: "24px" }}
                                    lineHeight="1.8"
                                    w="100%"
                                    h="auto"
                                    minH="200px"
                                />
                            </GridItem>
                        </Grid>
                    </Box>
                );
            default:
                return null;
        }
        
    }

    const colorInputRef = useRef(null);
    const bgInputRef = useRef(null);
    const thumbInputRef = useRef(null);
    const [templateBgUrl, setTemplateBgUrl] = useState(null);
    const textColor = getContrastColor(formData.theme_color);

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
                        {renderBlockForm(block, index)}
                        <Button
                            position="absolute"
                            top={4}
                            right={4}
                            size="sm"
                            colorScheme="red"
                            bg={"red.600"}
                            color={"white"}
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
                    _hover={{
                        scale: 1.02,
                    }}
                >
                    Hoàn Tất
                </Button>
            </Box>
        </Box>
    )
}