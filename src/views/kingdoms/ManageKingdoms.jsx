import { useState, useEffect } from "react";
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Input,
    Button,
    Image,
    Stack,
    HStack,
    Icon,
    Badge,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { LuSearch, LuTrash2, LuEye, LuUpload, LuPencil } from "react-icons/lu";

import KINGDOM_API from "../../services/kingdom.api";
import PHYLUM_API from "../../services/phylum.api";
import APP_CONFIG from "../../config/app.config";
import { TAXONOMY_OPTIONS } from "../../config/data.config";
import { Toaster, toaster } from "../../components/ui/Toaster";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ManageKingdoms() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [activeTab, setActiveTab] = useState("kingdom");
    const [kingdoms, setKingdoms] = useState([]);
    const [phylums, setPhylums] = useState([]);
    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get("search") || "";
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "Admin | Danh Sách";
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Lấy giới
            const resKingdoms = await KINGDOM_API.getAll();
            const listKingdoms = resKingdoms.data || resKingdoms;
            setKingdoms(listKingdoms);

            // Lấy ngành
            const resPhylums = await PHYLUM_API.getAll();
            const listPhylums = resPhylums.data || resPhylums;
            setPhylums(listPhylums);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu phân loài:", error);
            toaster.create({
                title: "Lỗi tải dữ liệu",
                description: "Không thể tải danh sách giới hoặc ngành.",
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteKingdom = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa giới "${name}" không? Hành động này không thể hoàn tác.`)) {
            return;
        }

        try {
            const res = await KINGDOM_API.deleteKingdom(id);
            if (res && res.status === "success") {
                toaster.create({
                    title: "Xóa thành công",
                    description: res.message || `Đã xóa giới "${name}" thành công.`,
                    type: "success"
                });
                setKingdoms(prev => prev.filter(k => k._id !== id && k.id !== id));
            } else {
                toaster.create({
                    title: "Lỗi xóa giới",
                    description: res?.message || "Không thể xóa giới này.",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Lỗi khi xóa giới:", error);
            toaster.create({
                title: "Lỗi hệ thống",
                description: error.message || "Đã xảy ra lỗi khi kết nối tới máy chủ.",
                type: "error"
            });
        }
    };

    const handleDeletePhylum = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa ngành "${name}" không? Hành động này không thể hoàn tác.`)) {
            return;
        }

        try {
            const res = await PHYLUM_API.deletePhylum(id);
            if (res && res.status === "success") {
                toaster.create({
                    title: "Xóa thành công",
                    description: res.message || `Đã xóa ngành "${name}" thành công.`,
                    type: "success"
                });
                setPhylums(prev => prev.filter(p => p._id !== id && p.id !== id));
            } else {
                toaster.create({
                    title: "Lỗi xóa ngành",
                    description: res?.message || "Không thể xóa ngành này.",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Lỗi khi xóa ngành:", error);
            toaster.create({
                title: "Lỗi hệ thống",
                description: error.message || "Đã xảy ra lỗi khi kết nối tới máy chủ.",
                type: "error"
            });
        }
    };

    const getImageUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
            return url;
        }
        return `${APP_CONFIG.BASE_API}/${url}`;
    };

    // Lọc theo từ khóa tìm kiếm
    const filteredKingdoms = kingdoms.filter(k => {
        const query = searchKeyword.toLowerCase();
        const normalName = (k.normal_name || "").toLowerCase();
        const scienceName = (k.science_name || "").toLowerCase();
        return normalName.includes(query) || scienceName.includes(query);
    });

    const filteredPhylums = phylums.filter(p => {
        const query = searchKeyword.toLowerCase();
        const normalName = (p.normal_name || "").toLowerCase();
        const scienceName = (p.science_name || "").toLowerCase();
        return normalName.includes(query) || scienceName.includes(query);
    });

    return (
        <Box>
            <Box mb={6}>
                <Heading fontSize={{ base: "3xl", md: "40px" }} color={isDark ? "white" : "#0f172a"}>
                    Danh sách phân loài
                </Heading>
            </Box>

            {/* Custom Tab Selector */}
            <HStack gap={4} mb={6} borderBottom="1px solid" borderColor={isDark ? "rgba(255,255,255,0.06)" : "#eef2f7"} pb={3}>
                <Button
                    variant={activeTab === "kingdom" ? "solid" : "ghost"}
                    bg={activeTab === "kingdom" ? "#2a69ac" : "transparent"}
                    color={activeTab === "kingdom" ? "white" : (isDark ? "gray.400" : "gray.600")}
                    _hover={{ bg: activeTab === "kingdom" ? "#2c5282" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)") }}
                    onClick={() => setActiveTab("kingdom")}
                >
                    Giới
                </Button>
                <Button
                    variant={activeTab === "phylum" ? "solid" : "ghost"}
                    bg={activeTab === "phylum" ? "#2a69ac" : "transparent"}
                    color={activeTab === "phylum" ? "white" : (isDark ? "gray.400" : "gray.600")}
                    _hover={{ bg: activeTab === "phylum" ? "#2c5282" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)") }}
                    onClick={() => setActiveTab("phylum")}
                >
                    Ngành
                </Button>
            </HStack>

            {isLoading ? (
                <Box textAlign="center" py={12}>
                    <Text color="gray.400">Đang tải danh sách...</Text>
                </Box>
            ) : activeTab === "kingdom" ? (
                filteredKingdoms.length === 0 ? (
                    <Box
                        bg={isDark ? "#111a3a" : "white"}
                        p={8}
                        borderRadius="xl"
                        textAlign="center"
                        border="1px solid"
                        borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                    >
                        <Text color="gray.400" fontSize="lg">
                            {searchKeyword ? "Không tìm thấy giới phù hợp với từ khóa." : "Chưa có giới nào được tạo."}
                        </Text>
                    </Box>
                ) : (
                    <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={6}>
                        {filteredKingdoms.map((kingdom) => {
                            const kingdomId = kingdom._id || kingdom.id;
                            const cellLabel = TAXONOMY_OPTIONS.cell.find(o => o.value === kingdom.cell_type)?.label || "Chưa chọn";
                            const nutritionLabel = TAXONOMY_OPTIONS.nutrition.find(o => o.value === kingdom.nutrition_mode)?.label || "Chưa chọn";
                            const reproductionLabel = TAXONOMY_OPTIONS.reproduction.find(o => o.value === kingdom.reproduction_type)?.label || "Chưa chọn";

                            return (
                                <Box
                                    key={kingdomId}
                                    bg={isDark ? "#111a3a" : "white"}
                                    borderRadius="xl"
                                    overflow="hidden"
                                    boxShadow="sm"
                                    border="1px solid"
                                    borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                                    transition="all 0.2s"
                                    _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                                    display="flex"
                                    flexDirection="column"
                                    position="relative"
                                >
                                    <Box
                                        h="110px"
                                        w="100%"
                                        bg={kingdom.theme_color || "#1f2852"}
                                        position="relative"
                                        overflow="hidden"
                                    >
                                        {kingdom.background_url && (
                                            <Image
                                                src={getImageUrl(kingdom.background_url)}
                                                alt=""
                                                w="100%"
                                                h="100%"
                                                objectFit="cover"
                                                opacity="0.8"
                                            />
                                        )}
                                    </Box>

                                    <Box
                                        position="absolute"
                                        top="75px"
                                        right="16px"
                                        w="60px"
                                        h="60px"
                                        borderRadius="md"
                                        overflow="hidden"
                                        bg="white"
                                        border="3px solid"
                                        borderColor={isDark ? "#111a3a" : "white"}
                                        boxShadow="sm"
                                    >
                                        {kingdom.thumbnail_url ? (
                                            <Image
                                                src={getImageUrl(kingdom.thumbnail_url)}
                                                alt=""
                                                w="100%"
                                                h="100%"
                                                objectFit="cover"
                                            />
                                        ) : (
                                            <Stack justify="center" h="100%" align="center" color="gray.300">
                                                <LuUpload size={20} />
                                            </Stack>
                                        )}
                                    </Box>

                                    <Box p={4} flex="1" display="flex" flexDirection="column">
                                        <Text color="#C8AA6E" fontSize="xs" fontStyle="italic" fontWeight="600">
                                            {kingdom.science_name || "Science Name"}
                                        </Text>
                                        <Heading fontSize="lg" mt={0.5} mb={3} color={isDark ? "white" : "#0f172a"} noOfLines={1}>
                                            {kingdom.normal_name || "Giới mới"}
                                        </Heading>

                                        <Stack spacing={2} mb={4} fontSize="xs" flex="1">
                                            <HStack justify="space-between">
                                                <Text color="gray.400">Loại tế bào:</Text>
                                                <Badge colorScheme="blue" variant="outline">{cellLabel}</Badge>
                                            </HStack>
                                            <HStack justify="space-between">
                                                <Text color="gray.400">Dinh dưỡng:</Text>
                                                <Badge colorScheme="green" variant="outline">{nutritionLabel}</Badge>
                                            </HStack>
                                            <HStack justify="space-between">
                                                <Text color="gray.400">Sinh sản:</Text>
                                                <Badge colorScheme="purple" variant="outline">{reproductionLabel}</Badge>
                                            </HStack>
                                        </Stack>

                                        <HStack justify="space-between" pt={3} borderTop="1px solid" borderColor={isDark ? "rgba(255,255,255,0.06)" : "#eef2f7"}>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="blue"
                                                onClick={() => navigate(`/kingdoms/addKingdom?id=${kingdomId}`)}
                                                display="flex"
                                                alignItems="center"
                                                gap={1.5}
                                            >
                                                <LuPencil size={16} />
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                                onClick={() => handleDeleteKingdom(kingdomId, kingdom.normal_name)}
                                                display="flex"
                                                alignItems="center"
                                                gap={1.5}
                                            >
                                                <LuTrash2 size={16} />
                                                Xóa
                                            </Button>
                                        </HStack>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Grid>
                )
            ) : (
                filteredPhylums.length === 0 ? (
                    <Box
                        bg={isDark ? "#111a3a" : "white"}
                        p={8}
                        borderRadius="xl"
                        textAlign="center"
                        border="1px solid"
                        borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                    >
                        <Text color="gray.400" fontSize="lg">
                            {searchKeyword ? "Không tìm thấy ngành phù hợp với từ khóa." : "Chưa có ngành nào được tạo."}
                        </Text>
                    </Box>
                ) : (
                    <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={6}>
                        {filteredPhylums.map((phylum) => {
                            const phylumId = phylum._id || phylum.id;
                            const cellLabel = TAXONOMY_OPTIONS.cell.find(o => o.value === phylum.cell_type)?.label || "Chưa chọn";
                            const nutritionLabel = TAXONOMY_OPTIONS.nutrition.find(o => o.value === phylum.nutrition_mode)?.label || "Chưa chọn";
                            const reproductionLabel = TAXONOMY_OPTIONS.reproduction.find(o => o.value === phylum.reproduction_type)?.label || "Chưa chọn";
                            const belongToKingdom = kingdoms.find(k => (k._id || k.id) === phylum.kingdom_id)?.normal_name || "Không rõ";

                            return (
                                <Box
                                    key={phylumId}
                                    bg={isDark ? "#111a3a" : "white"}
                                    borderRadius="xl"
                                    overflow="hidden"
                                    boxShadow="sm"
                                    border="1px solid"
                                    borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                                    transition="all 0.2s"
                                    _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                                    display="flex"
                                    flexDirection="column"
                                    position="relative"
                                >
                                    <Box
                                        h="110px"
                                        w="100%"
                                        bg={phylum.theme_color || "#1f2852"}
                                        position="relative"
                                        overflow="hidden"
                                    >
                                        {phylum.background_url && (
                                            <Image
                                                src={getImageUrl(phylum.background_url)}
                                                alt=""
                                                w="100%"
                                                h="100%"
                                                objectFit="cover"
                                                opacity="0.8"
                                            />
                                        )}
                                    </Box>

                                    <Box
                                        position="absolute"
                                        top="75px"
                                        right="16px"
                                        w="60px"
                                        h="60px"
                                        borderRadius="md"
                                        overflow="hidden"
                                        bg="white"
                                        border="3px solid"
                                        borderColor={isDark ? "#111a3a" : "white"}
                                        boxShadow="sm"
                                    >
                                        {phylum.thumbnail_url ? (
                                            <Image
                                                src={getImageUrl(phylum.thumbnail_url)}
                                                alt=""
                                                w="100%"
                                                h="100%"
                                                objectFit="cover"
                                            />
                                        ) : (
                                            <Stack justify="center" h="100%" align="center" color="gray.300">
                                                <LuUpload size={20} />
                                            </Stack>
                                        )}
                                    </Box>

                                    <Box p={4} flex="1" display="flex" flexDirection="column">
                                        <Text color="#C8AA6E" fontSize="xs" fontStyle="italic" fontWeight="600">
                                            {phylum.science_name || "Science Name"}
                                        </Text>
                                        <Heading fontSize="lg" mt={0.5} mb={1} color={isDark ? "white" : "#0f172a"} noOfLines={1}>
                                            {phylum.normal_name || "Ngành mới"}
                                        </Heading>
                                        <Text fontSize="xs" color="gray.500" mb={3}>
                                            Thuộc giới: <strong>{belongToKingdom}</strong>
                                        </Text>

                                        <Stack spacing={2} mb={4} fontSize="xs" flex="1">
                                            <HStack justify="space-between">
                                                <Text color="gray.400">Loại tế bào:</Text>
                                                <Badge colorScheme="blue" variant="outline">{cellLabel}</Badge>
                                            </HStack>
                                            <HStack justify="space-between">
                                                <Text color="gray.400">Dinh dưỡng:</Text>
                                                <Badge colorScheme="green" variant="outline">{nutritionLabel}</Badge>
                                            </HStack>
                                            <HStack justify="space-between">
                                                <Text color="gray.400">Sinh sản:</Text>
                                                <Badge colorScheme="purple" variant="outline">{reproductionLabel}</Badge>
                                            </HStack>
                                        </Stack>

                                        <HStack justify="space-between" pt={3} borderTop="1px solid" borderColor={isDark ? "rgba(255,255,255,0.06)" : "#eef2f7"}>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="blue"
                                                onClick={() => navigate(`/phylums/addPhylum?id=${phylumId}`)}
                                                display="flex"
                                                alignItems="center"
                                                gap={1.5}
                                            >
                                                <LuPencil size={16} />
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                                onClick={() => handleDeletePhylum(phylumId, phylum.normal_name)}
                                                display="flex"
                                                alignItems="center"
                                                gap={1.5}
                                            >
                                                <LuTrash2 size={16} />
                                                Xóa
                                            </Button>
                                        </HStack>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Grid>
                )
            )}
        </Box>
    );
}
