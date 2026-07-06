import React from "react"
import { Box, Stack, Icon, Text, Grid, GridItem, Image } from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu";
import { TAXONOMY_OPTIONS } from "../../config/data.config";

function getContrastColor(hex) {
    if (!hex) return "#FFFFFF";

    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 155 ? "#0F0F0F" : "#FFFFFF";
}

export default function ReviewKingdom({
    formData,
    templateImgUrl,
    templateBgUrl
}) {
    const textColor = getContrastColor(formData.theme_color);
    return (
        <Box
            h="auto"
            w="100%"
            display="flex"
            flexDirection="column"
            bgColor="#111a3a"
            borderRadius="lg"
            overflow="hidden"
            position="relative"
        >
            <Box
                w="100%"
                h="300px"
                bg={formData.theme_color || "#1f2852"}
            />
            {/* Background */}
            <Box
                position="absolute"
                w="100%"
                h="150px"
                top="40px"
                zIndex={1}
                overflow="hidden"
                bg={"white"}
            >
                {templateBgUrl ? (
                    <Box
                        as="img"
                        src={templateBgUrl}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                    />
                ) : (
                    <Stack justify="center" h="100%" align="center" color="gray.400">
                        <Icon size="sm"><LuUpload /></Icon>
                        <Text fontSize="sm">Chưa tải lên ảnh nền</Text>
                    </Stack>
                )}
            </Box>
            {/* Thumbnail */}
            <Box
                position="absolute"
                w="130px"
                h="130px"
                top="80px"
                right="50px"
                bg="white"
                zIndex={2}
                overflow="hidden"
                borderRadius="md"
                boxShadow="lg"
            >
                {templateImgUrl ? (
                    <Box
                        as="img"
                        src={templateImgUrl}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                    />
                ) : (
                    <Stack justify="center" h="100%" align="center" color="gray.400">
                        <Icon size="sm"><LuUpload /></Icon>
                        <Text fontSize="12px">Chưa tải lên ảnh</Text>
                    </Stack>
                )}
            </Box>
            <Box
                position="absolute"
                top="210px"
                left="30px"
                w="100%"
                zIndex={2}
            >
                <Text
                    color={"#C8AA6E"}
                    fontStyle={"italic"}
                >
                    {formData.science_name || "Tên khoa học"}
                </Text>
                <Text
                    color={textColor}
                    fontSize="24px"
                    fontWeight="bold"
                >
                    {formData.normal_name || "Tên thường gọi"}
                </Text>
            </Box>
            <Box
                w="100%"
                bg="black"
            >
                <Grid
                    minH="100px"
                    alignItems="center"
                    templateColumns="repeat(4, 1fr)"
                    gap={2}
                >
                    {/* Cell Type */}
                    <GridItem
                        display="flex"
                        alignItems="flex-start"
                        gap="4px"
                        p="8px"
                    >
                        <Image
                            src="/backgrounds/home/cell.png"
                            boxSize="15px"
                            mr="4px"
                        />
                        <Box>
                            <Text
                                fontSize="8px"
                                color="white"
                                fontWeight="bold"
                            >
                                Loại Tế Bào
                            </Text>
                            <Text fontSize="8px" color="#A1A1AA" mt="6px">
                                {
                                    TAXONOMY_OPTIONS.cell.find(
                                        o => o.value === formData.cell_type
                                    )?.label || "Chưa chọn"
                                }
                            </Text>
                        </Box>
                    </GridItem>

                    {/* Nutrition */}
                    <GridItem
                        display="flex"
                        alignItems="flex-start"
                        gap="4px"
                    >
                        <Image
                            src="/backgrounds/home/nutrition.png"
                            boxSize="15px"
                            mr="4px"
                        />
                        <Box>
                            <Text
                                fontSize="8px"
                                fontWeight="bold"
                                color="white"
                                whiteSpace="nowrap"
                            >
                                Loại Dinh Dưỡng
                            </Text>
                            <Text fontSize="8px" color="#A1A1AA" mt="6px">
                                {
                                    TAXONOMY_OPTIONS.nutrition.find(
                                        o => o.value === formData.nutrition_mode
                                    )?.label || "Chưa chọn"
                                }
                            </Text>
                        </Box>
                    </GridItem>

                    {/* Reproduction */}
                    <GridItem
                        display="flex"
                        alignItems="flex-start"
                        gap="4px"
                    >
                        <Image
                            src="/backgrounds/home/reproduction.png"
                            boxSize="15px"
                            mr="4px"
                        />
                        <Box>
                            <Text
                                fontSize="8px"
                                fontWeight="bold"
                                color="white"
                                whiteSpace="nowrap"
                            >
                                Loại Sinh Sản
                            </Text>
                            <Text fontSize="8px" color="#A1A1AA" mt="6px">
                                {
                                    TAXONOMY_OPTIONS.reproduction.find(
                                        o => o.value === formData.reproduction_type
                                    )?.label || "Chưa chọn"
                                }
                            </Text>
                        </Box>
                    </GridItem>

                    {/* Earth */}
                    <GridItem
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Image
                            src="/backgrounds/home/earth-white.svg"
                            maxH="50px"
                            objectFit="contain"
                        />
                    </GridItem>
                </Grid>
            </Box>
            <Stack gap={0}>
                {formData.description.map((block, index) => {
                    switch (block.block_type) {
                        case "standard": {
                            const blockTextColor = getContrastColor(
                                block.bg_color || "#FFFFFF"
                            );
                            return (
                                <Box
                                    key={index}
                                    bg={block.bg_color || "#FFFFFF"}
                                    minH="220px"
                                    p={4}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color={blockTextColor}
                                            fontStyle="italic"
                                            pt={3}
                                            mb={2}
                                            textAlign="center"
                                        >
                                            {block.heading || "Tiêu đề"}
                                        </Text>

                                        <Text
                                            color={blockTextColor}
                                            fontSize="8px"
                                            textAlign="center"
                                            whiteSpace="pre-wrap"
                                            wordBreak="break-word"
                                            w="70%"
                                            mx="auto"
                                        >
                                            {block.content || "Nội dung"}
                                        </Text>
                                    </Box>
                                </Box>
                            );
                        }
                        case "image_left": {
                            const blockTextColor = getContrastColor(
                                block.bg_color || "#FFFFFF"
                            );
                            return (
                                <Box
                                    key={index}
                                    bg={block.bg_color || "#FFFFFF"}
                                    minH="200px"
                                    p={4}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection={"column"}
                                    >
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color={blockTextColor}
                                            fontStyle="italic"
                                            ml="50px"
                                            pt={3}
                                        >
                                            {block.heading || "Tiêu đề"}
                                        </Text>
                                        <Grid
                                            templateColumns={"repeat(14, 1fr)"}
                                            gap={4}
                                            w="80%"
                                            mt="10px"
                                            mx="auto"
                                        >
                                            <GridItem
                                                colSpan={9}
                                            >
                                                <Box
                                                    w="100%"
                                                    aspectRatio={16 / 9}
                                                    overflow="hidden"
                                                >
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
                                                            fontSize="8px"
                                                            color="gray.500"
                                                        >
                                                            Chưa tải lên ảnh
                                                        </Box>
                                                    )
                                                    }
                                                </Box>
                                            </GridItem>
                                            <GridItem
                                                colSpan={5}
                                            >
                                                <Text
                                                    color={blockTextColor}
                                                    fontSize="8px"
                                                    whiteSpace="pre-wrap"
                                                    wordBreak="break-word"
                                                >
                                                    {block.content || "Nội dung"}
                                                </Text>
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                </Box>
                            );
                        }
                        case "image_right": {
                            const blockTextColor = getContrastColor(
                                block.bg_color || "#FFFFFF"
                            );
                            return (
                                <Box
                                    key={index}
                                    bg={block.bg_color || "#FFFFFF"}
                                    minH="200px"
                                    p={4}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection={"column"}
                                    >
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color={blockTextColor}
                                            fontStyle="italic"
                                            ml="auto"
                                            mr="50px"
                                            pt={3}
                                        >
                                            {block.heading || "Tiêu đề"}
                                        </Text>
                                        <Grid
                                            templateColumns={"repeat(14, 1fr)"}
                                            gap={4}
                                            w="80%"
                                            mt="10px"
                                            mx="auto"
                                        >
                                            <GridItem
                                                colSpan={5}
                                            >
                                                <Text
                                                    color={blockTextColor}
                                                    fontSize="8px"
                                                    whiteSpace="pre-wrap"
                                                    wordBreak="break-word"
                                                >
                                                    {block.content || "Nội dung"}
                                                </Text>
                                            </GridItem>
                                            <GridItem
                                                colSpan={9}
                                            >
                                                <Box
                                                    w="100%"
                                                    aspectRatio={16 / 9}
                                                    overflow="hidden"
                                                >
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
                                                            fontSize="8px"
                                                            color="gray.500"
                                                        >
                                                            Chưa tải lên ảnh
                                                        </Box>
                                                    )
                                                    }
                                                </Box>
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                </Box>
                            )
                        }
                        case "image_top": {
                            const blockTextColor = getContrastColor(
                                block.bg_color || "#FFFFFF"
                            );
                            return (
                                <Box
                                    key={index}
                                    bg={formData.theme_color || "#1f2852"}
                                    minH="200px"
                                    p={4}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection={"column"}
                                    >
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color={textColor}
                                            fontStyle="italic"
                                            ml="25px"
                                            pt={3}
                                        >
                                            {block.heading || "Tiêu đề"}
                                        </Text>
                                        <Grid
                                            templateColumns="1fr"
                                            w="70%"
                                            mx="auto"
                                            mt="10px"
                                            pb="50px"
                                            gap={4}
                                        >
                                            <GridItem>
                                                <Box
                                                    w="100%"
                                                    aspectRatio={16 / 9}
                                                    overflow="hidden"
                                                >
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
                                                            fontSize="8px"
                                                            color="gray.500"
                                                        >
                                                            Chưa tải lên ảnh
                                                        </Box>
                                                    )
                                                    }
                                                </Box>
                                            </GridItem>
                                            <GridItem>
                                                <Text
                                                    color={textColor}
                                                    fontSize="8px"
                                                    whiteSpace="pre-wrap"
                                                    wordBreak="break-word"
                                                >
                                                    {block.content || "Nội dung"}
                                                </Text>
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                </Box>
                            )
                        }
                        default:
                            return null;
                    }
                })}
            </Stack>
        </Box>
    )
}