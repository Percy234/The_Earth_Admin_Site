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
            {/* Header Image / Theme Color */}
            <Box
                h="110px"
                w="100%"
                bg={item.theme_color || "#1f2852"}
                position="relative"
                overflow="hidden"
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
                borderRadius="md"
                overflow="hidden"
                bg="white"
                border="3px solid"
                borderColor={isDark ? "#111a3a" : "white"}
                boxShadow="sm"
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
                    <Stack justify="center" h="100%" align="center" color="gray.300">
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
                        onClick={onEdit}
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
                        onClick={onDelete}
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
}
