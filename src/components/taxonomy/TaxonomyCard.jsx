import {
    Box,
    Heading,
    Text,
    Button,
    Image,
    Stack,
    HStack,
    Badge,
} from "@chakra-ui/react";
import { LuUpload, LuPencil, LuTrash2 } from "react-icons/lu";
import { TAXONOMY_OPTIONS } from "../../config/data.config";
import APP_CONFIG from "../../config/app.config";

export default function TaxonomyCard({
    item,
    parentText,
    onEdit,
    onDelete,
    isDark
}) {
    const itemId = item._id || item.id;
    const cellLabel = TAXONOMY_OPTIONS.cell.find(o => o.value === item.cell_type)?.label || "Chưa chọn";
    const nutritionLabel = TAXONOMY_OPTIONS.nutrition.find(o => o.value === item.nutrition_mode)?.label || "Chưa chọn";
    const reproductionLabel = TAXONOMY_OPTIONS.reproduction.find(o => o.value === item.reproduction_type)?.label || "Chưa chọn";

    const getImageUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
            return url;
        }
        return `${APP_CONFIG.BASE_API}/${url}`;
    };

    return (
        <Box
            key={itemId}
            bg={isDark ? "#111a3a" : "white"}
            borderRadius="0"
            boxShadow={isDark ? "4px 4px 0px 0px white" : "4px 4px 0px 0px black"}
            border={isDark ? "2px solid white" : "3px solid black"}
            transition="all 0.15s ease-in-out"
            _hover={{
                transform: "translate(-2px, -2px)",
                boxShadow: isDark ? "6px 6px 0px 0px white" : "6px 6px 0px 0px black"
            }}
            display="flex"
            flexDirection="column"
            position="relative"
        >
            {/* Header Image / Theme Color */}
            <Box
                h="110px"
                w="100%"
                bg={item.theme_color || "#1f2852"}
                position="relative"
                overflow="hidden"
                borderBottom={isDark ? "2px solid white" : "3px solid black"}
            >
                {item.background_url && (
                    <Image
                        src={getImageUrl(item.background_url)}
                        alt=""
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        opacity="0.8"
                    />
                )}
            </Box>

            {/* Thumbnail */}
            <Box
                position="absolute"
                top="75px"
                right="16px"
                w="60px"
                h="60px"
                borderRadius="0"
                overflow="hidden"
                bg="white"
                border={isDark ? "2px solid white" : "2px solid black"}
                boxShadow={isDark ? "2px 2px 0px 0px white" : "2px 2px 0px 0px black"}
            >
                {item.thumbnail_url ? (
                    <Image
                        src={getImageUrl(item.thumbnail_url)}
                        alt=""
                        w="100%"
                        h="100%"
                        objectFit="cover"
                    />
                ) : (
                    <Stack justify="center" h="100%" align="center" color="gray.400">
                        <LuUpload size={20} />
                    </Stack>
                )}
            </Box>

            {/* Body */}
            <Box p={4} flex="1" display="flex" flexDirection="column">
                <Text color="#C8AA6E" fontSize="xs" fontStyle="italic" fontWeight="600">
                    {item.science_name || "Science Name"}
                </Text>
                <Heading fontSize="lg" mt={0.5} mb={parentText ? 1 : 3} color={isDark ? "white" : "#0f172a"} noOfLines={1}>
                    {item.normal_name || "Tên mới"}
                </Heading>
                
                {parentText && (
                    <Text fontSize="xs" color="gray.500" mb={3}>
                        {parentText}
                    </Text>
                )}

                <Stack spacing={2} mb={4} fontSize="xs" flex="1">
                    <HStack justify="space-between">
                        <Text color="gray.400">Loại tế bào:</Text>
                        <Badge borderRadius="0" border={isDark ? "1px solid rgba(255,255,255,0.4)" : "1.5px solid black"} colorScheme="blue" variant="outline">{cellLabel}</Badge>
                    </HStack>
                    <HStack justify="space-between">
                        <Text color="gray.400">Dinh dưỡng:</Text>
                        <Badge borderRadius="0" border={isDark ? "1px solid rgba(255,255,255,0.4)" : "1.5px solid black"} colorScheme="green" variant="outline">{nutritionLabel}</Badge>
                    </HStack>
                    <HStack justify="space-between">
                        <Text color="gray.400">Sinh sản:</Text>
                        <Badge borderRadius="0" border={isDark ? "1px solid rgba(255,255,255,0.4)" : "1.5px solid black"} colorScheme="purple" variant="outline">{reproductionLabel}</Badge>
                    </HStack>

                    {/* Hiển thị chi tiết cho cấp Loài nếu có */}
                    {item.average_size?.value && (
                        <HStack justify="space-between">
                            <Text color="gray.400">Kích thước:</Text>
                            <Badge borderRadius="0" border={isDark ? "1px solid rgba(255,255,255,0.4)" : "1.5px solid black"} colorScheme="teal" variant="subtle">{item.average_size.value} {item.average_size.unit}</Badge>
                        </HStack>
                    )}
                    {item.average_weight?.value && (
                        <HStack justify="space-between">
                            <Text color="gray.400">Trọng lượng:</Text>
                            <Badge borderRadius="0" border={isDark ? "1px solid rgba(255,255,255,0.4)" : "1.5px solid black"} colorScheme="orange" variant="subtle">{item.average_weight.value} {item.average_weight.unit}</Badge>
                        </HStack>
                    )}
                    {item.lifespan?.value && (
                        <HStack justify="space-between">
                            <Text color="gray.400">Tuổi thọ:</Text>
                            <Badge borderRadius="0" border={isDark ? "1px solid rgba(255,255,255,0.4)" : "1.5px solid black"} colorScheme="pink" variant="subtle">{item.lifespan.value} {item.lifespan.unit}</Badge>
                        </HStack>
                    )}
                    {Array.isArray(item.habitat) && item.habitat.length > 0 && (
                        <Box pt={1}>
                            <Text color="gray.400" mb={1}>Môi trường sống:</Text>
                            <HStack gap={1} wrap="wrap">
                                {item.habitat.map((h, idx) => (
                                    <Badge key={idx} borderRadius="0" border={isDark ? "1px solid rgba(255,255,255,0.4)" : "1px solid black"} fontSize="10px" colorScheme="cyan" variant="solid">{h}</Badge>
                                ))}
                            </HStack>
                        </Box>
                    )}
                </Stack>

                <HStack justify="space-between" pt={3} borderTop={isDark ? "2px solid white" : "3px solid black"}>
                    <Button
                        size="sm"
                        borderRadius="0"
                        border={isDark ? "2px solid white" : "2px solid black"}
                        bg={isDark ? "#141e33" : "white"}
                        color={isDark ? "white" : "black"}
                        boxShadow={isDark ? "2px 2px 0px 0px white" : "2px 2px 0px 0px black"}
                        _hover={{
                            bg: "#38A169",
                            color: "white",
                            transform: "translate(-1px, -1px)",
                            boxShadow: isDark ? "3px 3px 0px 0px white" : "3px 3px 0px 0px black"
                        }}
                        transition="all 0.15s ease-in-out"
                        onClick={onEdit}
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                    >
                        <LuPencil size={15} />
                        Chỉnh sửa
                    </Button>
                    <Button
                        size="sm"
                        borderRadius="0"
                        border={isDark ? "2px solid white" : "2px solid black"}
                        bg={isDark ? "#141e33" : "white"}
                        color={isDark ? "white" : "black"}
                        boxShadow={isDark ? "2px 2px 0px 0px white" : "2px 2px 0px 0px black"}
                        _hover={{
                            bg: "#E53E3E",
                            color: "white",
                            transform: "translate(-1px, -1px)",
                            boxShadow: isDark ? "3px 3px 0px 0px white" : "3px 3px 0px 0px black"
                        }}
                        transition="all 0.15s ease-in-out"
                        onClick={onDelete}
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                    >
                        <LuTrash2 size={15} />
                        Xóa
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
}
