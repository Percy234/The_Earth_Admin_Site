import KINGDOM_API from "../../services/kingdom.api";
import { Box, Button, Grid, GridItem, Text, Textarea} from "@chakra-ui/react";
import { useRef } from "react";

export default function BlockKingdom({
    block,
    index,
    updateBlockData,
    textColor,
    themeColor
}) {
    const colorsBlockId = `colors-block-${index}`;
    const colorInputRef = useRef(null);
    const backgroundInputRef = useRef(null);

    switch(block.block_type) {
        case "standard":
            return (
                <Box
                    w="100%"
                    mt={6}
                    borderRadius="lg"
                    bgColor="#111a3a"
                >
                    <Text fontSize="2xl" fontWeight="bold" p={6} textAlign="center" borderRadius="lg">Văn Bản</Text>
                    <Box mb={4} px={4}>
                        <Text mb={1}>Tiêu đề</Text>
                        <Textarea
                            value={block.heading}
                            onChange={(e) =>
                                updateBlockData(index, "heading", e.target.value)
                            }
                            placeholder="Nhập tiêu đề"
                            bg="#1f2852"
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} px={4}>
                        <GridItem>
                            <Text mb={1}>Màu nền</Text>
                            <Box
                                as="button"
                                type="button"
                                w="100%"
                                h="40px"
                                px={3}
                                display="flex"
                                alignItems="center"
                                borderRadius="md"
                                bg={block.bg_color || "#1f2852"}
                                border="1px solid"
                                borderColor="rgba(148, 163, 184, 0.25)"
                                textAlign="left"
                                cursor="pointer"
                                onClick={() => colorInputRef.current?.click()}
                            >
                                <Text color={textColor}>
                                    {block.bg_color || "Chọn màu nền"}
                                </Text>
                            </Box>
                            <input
                                ref={colorInputRef}
                                type="color"
                                value={block.bg_color || "#1f2852"}
                                onChange={(e) =>
                                    updateBlockData(index, "bg_color", e.target.value)
                                }
                                style={{ display: "none" }}
                            />
                        </GridItem>
                        <GridItem></GridItem>
                    </Grid>
                    <Box mb={4} px={4}>
                        <Text mb={1}>Nội dung</Text>
                        <Textarea
                            value={block.content}
                            onChange={(e) =>
                                updateBlockData(index, "content", e.target.value)
                            }
                            placeholder="Nhập nội dung"
                            bg="#1f2852"
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                </Box>
            )
        case "image_left":
            return (
                <Box
                    w="100%"
                    mt={6}
                    borderRadius="lg"
                    bgColor="#111a3a"
                >
                    <Text fontSize="2xl" fontWeight="bold" p={6} textAlign="center" borderRadius="lg">Ảnh + Văn Bản</Text>
                    <Box mb={4} px={4}>
                        <Text mb={1}>Tiêu đề</Text>
                        <Textarea
                            value={block.heading}
                            onChange={(e) =>
                                updateBlockData(index, "heading", e.target.value)
                            }
                            placeholder="Nhập tiêu đề"
                            bg="#1f2852"
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} px={4}>
                        <GridItem>
                            <Text mb={1}>Màu nền</Text>
                            <Box
                                as="button"
                                type="button"
                                w="100%"
                                h="40px"
                                px={3}
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: "rgba(148, 163, 184, 0.5)",
                                    bg: "#252d4a"
                                }}
                                display="flex"
                                alignItems="center"
                                borderRadius="md"
                                bg={block.bg_color || "#1f2852"}
                                border="1px solid"
                                borderColor="rgba(148, 163, 184, 0.25)"
                                textAlign="left"
                                cursor="pointer"
                                onClick={() => colorInputRef.current?.click()}
                            >
                                <Text color={textColor}>
                                    {block.bg_color || "Chọn màu nền"}
                                </Text>
                            </Box>
                            <input
                                ref={colorInputRef}
                                type="color"
                                value={block.bg_color || "#1f2852"}
                                onChange={(e) =>
                                    updateBlockData(index, "bg_color", e.target.value)
                                }
                                style={{ display: "none" }}
                            />
                        </GridItem>
                        <GridItem>
                            <Text mb={1}>Thêm ảnh</Text>
                            <Box
                                as="button"
                                type="button"
                                w="100%"
                                h="40px"
                                onClick={() => backgroundInputRef.current?.click()}
                                p={2}
                                borderRadius="md"
                                bg={"#1f2852"}
                                border="1px solid"
                                borderColor="rgba(148, 163, 184, 0.25)"
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: "rgba(148, 163, 184, 0.5)",
                                    bg: "#252d4a"
                                }}
                                textAlign="left"
                                display="flex"
                                alignItems="center"
                                overflow="hidden"
                            >
                                <Text
                                    color={block.img_file ? "#e2e8f0" : "#94a3b8"}
                                    fontSize="sm"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                >
                                    {block.img_file?.name || "Chọn ảnh..."}
                                </Text>
                            </Box>
                            <input
                                ref={backgroundInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file);
                                        updateBlockData(index, "img_url", previewUrl);
                                        updateBlockData(index, "img_file", file); 
                                    }
                                }}
                                style={{ display: "none" }}
                            />
                        </GridItem>
                    </Grid>
                    <Box mb={4} px={4}>
                        <Text mb={1}>Nội dung</Text>
                        <Textarea
                            value={block.content}
                            onChange={(e) =>
                                updateBlockData(index, "content", e.target.value)
                            }
                            placeholder="Nhập nội dung"
                            bg="#1f2852"
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                </Box>
            )
        case "image_right":
            return (
                <Box
                    w="100%"
                    mt={6}
                    borderRadius="lg"
                    bgColor="#111a3a"
                >
                    <Text fontSize="2xl" fontWeight="bold" p={6} textAlign="center" borderRadius="lg">Văn Bản + Ảnh</Text>
                    <Box mb={4} px={4}>
                        <Text mb={1}>Tiêu đề</Text>
                        <Textarea
                            value={block.heading}
                            onChange={(e) =>
                                updateBlockData(index, "heading", e.target.value)
                            }
                            placeholder="Nhập tiêu đề"
                            bg="#1f2852"
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} px={4}>
                        <GridItem>
                            <Text mb={1}>Màu nền</Text>
                            <Box
                                as="button"
                                type="button"
                                w="100%"
                                h="40px"
                                px={3}
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: "rgba(148, 163, 184, 0.5)",
                                    bg: "#252d4a"
                                }}
                                display="flex"
                                alignItems="center"
                                borderRadius="md"
                                bg={block.bg_color || "#1f2852"}
                                border="1px solid"
                                borderColor="rgba(148, 163, 184, 0.25)"
                                textAlign="left"
                                cursor="pointer"
                                onClick={() => colorInputRef.current?.click()}
                            >
                                <Text color={textColor}>
                                    {block.bg_color || "Chọn màu nền"}
                                </Text>
                            </Box>
                            <input
                                ref={colorInputRef}
                                type="color"
                                value={block.bg_color || "#1f2852"}
                                onChange={(e) =>
                                    updateBlockData(index, "bg_color", e.target.value)
                                }
                                style={{ display: "none" }}
                            />
                        </GridItem>
                        <GridItem>
                            <Text mb={1}>Thêm ảnh</Text>
                            <Box
                                as="button"
                                type="button"
                                w="100%"
                                h="40px"
                                onClick={() => backgroundInputRef.current?.click()}
                                p={2}
                                borderRadius="md"
                                bg={"#1f2852"}
                                border="1px solid"
                                borderColor="rgba(148, 163, 184, 0.25)"
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: "rgba(148, 163, 184, 0.5)",
                                    bg: "#252d4a"
                                }}
                                textAlign="left"
                                display="flex"
                                alignItems="center"
                                overflow="hidden"
                            >
                                <Text
                                    color={block.img_file ? "#e2e8f0" : "#94a3b8"}
                                    fontSize="sm"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                >
                                    {block.img_file?.name || "Chọn ảnh..."}
                                </Text>
                            </Box>
                            <input
                                ref={backgroundInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file);
                                        updateBlockData(index, "img_url", previewUrl);
                                        updateBlockData(index, "img_file", file); 
                                    }
                                }}
                                style={{ display: "none" }}
                            />
                        </GridItem>
                    </Grid>
                    <Box mb={4} px={4}>
                        <Text mb={1}>Nội dung</Text>
                        <Textarea
                            value={block.content}
                            onChange={(e) =>
                                updateBlockData(index, "content", e.target.value)
                            }
                            placeholder="Nhập nội dung"
                            bg="#1f2852"
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                </Box>
            )
        case "image_top":
            return (
                <Box
                    w="100%"
                    mt={6}
                    borderRadius="lg"
                    bgColor="#111a3a"
                >
                    <Text fontSize="2xl" fontWeight="bold" p={6} textAlign="center" borderRadius="lg">Ảnh Trên + Văn Bản Dưới</Text>
                    <Box mb={4} px={4}>
                        <Text mb={1}>Tiêu đề</Text>
                        <Textarea
                            value={block.heading}
                            onChange={(e) =>
                                updateBlockData(index, "heading", e.target.value)
                            }
                            placeholder="Nhập tiêu đề"
                            bg="#1f2852"
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} px={4}>
                        <GridItem>
                            <Text mb={1}>Màu nền</Text>
                            <Box
                                as="button"
                                type="button"
                                w="100%"
                                h="40px"
                                px={3}
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: "rgba(148, 163, 184, 0.5)",
                                    bg: "#252d4a"
                                }}
                                display="flex"
                                alignItems="center"
                                borderRadius="md"
                                bg={block.bg_color || "#1f2852"}
                                border="1px solid"
                                borderColor="rgba(148, 163, 184, 0.25)"
                                textAlign="left"
                                cursor="pointer"
                                onClick={() => colorInputRef.current?.click()}
                            >
                                <Text color={textColor}>
                                    {block.bg_color || "Chọn màu nền"}
                                </Text>
                            </Box>
                            <input
                                ref={colorInputRef}
                                type="color"
                                value={block.bg_color || "#1f2852"}
                                onChange={(e) =>
                                    updateBlockData(index, "bg_color", e.target.value)
                                }
                                style={{ display: "none" }}
                            />
                        </GridItem>
                        <GridItem>
                            <Text mb={1}>Thêm ảnh</Text>
                            <Box
                                as="button"
                                type="button"
                                w="100%"
                                h="40px"
                                onClick={() => backgroundInputRef.current?.click()}
                                p={2}
                                borderRadius="md"
                                bg={"#1f2852"}
                                border="1px solid"
                                borderColor="rgba(148, 163, 184, 0.25)"
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: "rgba(148, 163, 184, 0.5)",
                                    bg: "#252d4a"
                                }}
                                textAlign="left"
                                display="flex"
                                alignItems="center"
                                overflow="hidden"
                            >
                                <Text
                                    color={block.img_file ? "#e2e8f0" : "#94a3b8"}
                                    fontSize="sm"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                >
                                    {block.img_file?.name || "Chọn ảnh..."}
                                </Text>
                            </Box>
                            <input
                                ref={backgroundInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file);
                                        updateBlockData(index, "img_url", previewUrl);
                                        updateBlockData(index, "img_file", file); 
                                    }
                                }}
                                style={{ display: "none" }}
                            />
                        </GridItem>
                    </Grid>
                    <Box mb={4} px={4}>
                        <Text mb={1}>Nội dung</Text>
                        <Textarea
                            value={block.content}
                            onChange={(e) =>
                                updateBlockData(index, "content", e.target.value)
                            }
                            placeholder="Nhập nội dung"
                            bg="#1f2852"
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                </Box>
            );
        default:
            return null;
    }
}