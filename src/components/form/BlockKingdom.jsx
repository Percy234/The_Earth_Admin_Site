import KINGDOM_API from "../../services/kingdom.api";
import { Box, Button, Grid, GridItem, Text, Textarea, Input, Stack } from "@chakra-ui/react";
import { useRef } from "react";
import { useTheme } from "next-themes";

export default function BlockKingdom({
    block,
    index,
    updateBlockData,
    getContrastColor,
    textColor,
    themeColor
}) {
    const colorsBlockId = `colors-block-${index}`;
    const backgroundInputRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    switch (block.block_type) {
        case "standard":
            return (
                <Box
                    w="100%"
                    mt={6}
                    borderRadius="lg"
                    bg={isDark ? "#111a3a" : "#ffffff"}
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
                            bg={isDark ? "#1f2852" : "#f8fafc"}
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} px={4}>
                        <GridItem>
                            <Text mb={1}>Màu nền</Text>
                            <Stack direction="row" gap={2} w="100%" h="40px">
                                <Input
                                    placeholder="VD: #ffffff"
                                    value={block.bg_color || ""}
                                    onChange={(e) => updateBlockData(index, "bg_color", e.target.value)}
                                    bg={isDark ? "#1f2852" : "#ffffff"}
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                    h="100%"
                                />
                                <Box
                                    position="relative"
                                    w="40px"
                                    h="40px"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                    bg={block.bg_color || (isDark ? "#1f2852" : "#f8fafc")}
                                    flexShrink={0}
                                >
                                    <input
                                        type="color"
                                        value={block.bg_color || (isDark ? "#1f2852" : "#f8fafc")}
                                        onChange={(e) =>
                                            updateBlockData(index, "bg_color", e.target.value)
                                        }
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
                            bg={isDark ? "#1f2852" : "#ffffff"}
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
                    bg={isDark ? "#111a3a" : "#ffffff"}
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
                            bg={isDark ? "#1f2852" : "#f8fafc"}
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} px={4}>
                        <GridItem>
                            <Text mb={1}>Màu nền</Text>
                            <Stack direction="row" gap={2} w="100%" h="40px">
                                <Input
                                    placeholder="VD: #ffffff"
                                    value={block.bg_color || ""}
                                    onChange={(e) => updateBlockData(index, "bg_color", e.target.value)}
                                    bg={isDark ? "#1f2852" : "#ffffff"}
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                    h="100%"
                                />
                                <Box
                                    position="relative"
                                    w="40px"
                                    h="40px"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                    bg={block.bg_color || (isDark ? "#1f2852" : "#f8fafc")}
                                    flexShrink={0}
                                >
                                    <input
                                        type="color"
                                        value={block.bg_color || (isDark ? "#1f2852" : "#f8fafc")}
                                        onChange={(e) =>
                                            updateBlockData(index, "bg_color", e.target.value)
                                        }
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
                                bg={isDark ? "#1f2852" : "#f8fafc"}
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
                                    color={block.img_file ? (isDark ? "#e2e8f0" : "#0f172a") : (isDark ? "#94a3b8" : "#64748b")}
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
                            bg={isDark ? "#1f2852" : "#ffffff"}
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
                    bg={isDark ? "#111a3a" : "#ffffff"}
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
                            bg={isDark ? "#1f2852" : "#f8fafc"}
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} px={4}>
                        <GridItem>
                            <Text mb={1}>Màu nền</Text>
                            <Stack direction="row" gap={2} w="100%" h="40px">
                                <Input
                                    placeholder="VD: #ffffff"
                                    value={block.bg_color || ""}
                                    onChange={(e) => updateBlockData(index, "bg_color", e.target.value)}
                                    bg={isDark ? "#1f2852" : "#ffffff"}
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                    h="100%"
                                />
                                <Box
                                    position="relative"
                                    w="40px"
                                    h="40px"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                    bg={block.bg_color || (isDark ? "#1f2852" : "#f8fafc")}
                                    flexShrink={0}
                                >
                                    <input
                                        type="color"
                                        value={block.bg_color || (isDark ? "#1f2852" : "#f8fafc")}
                                        onChange={(e) =>
                                            updateBlockData(index, "bg_color", e.target.value)
                                        }
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
                                bg={isDark ? "#1f2852" : "#f8fafc"}
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
                                    color={block.img_file ? (isDark ? "#e2e8f0" : "#0f172a") : (isDark ? "#94a3b8" : "#64748b")}
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
                            bg={isDark ? "#1f2852" : "#ffffff"}
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
                    bg={isDark ? "#111a3a" : "#ffffff"}
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
                            bg={isDark ? "#1f2852" : "#f8fafc"}
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} px={4}>
                        <GridItem>
                            <Text mb={1}>Màu nền</Text>
                            <Stack direction="row" gap={2} w="100%" h="40px">
                                <Input
                                    placeholder="VD: #ffffff"
                                    value={block.bg_color || ""}
                                    onChange={(e) => updateBlockData(index, "bg_color", e.target.value)}
                                    bg={isDark ? "#1f2852" : "#ffffff"}
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                    h="100%"
                                />
                                <Box
                                    position="relative"
                                    w="40px"
                                    h="40px"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="rgba(148, 163, 184, 0.25)"
                                    bg={block.bg_color || (isDark ? "#1f2852" : "#f8fafc")}
                                    flexShrink={0}
                                >
                                    <input
                                        type="color"
                                        value={block.bg_color || (isDark ? "#1f2852" : "#f8fafc")}
                                        onChange={(e) =>
                                            updateBlockData(index, "bg_color", e.target.value)
                                        }
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
                                display="flex"
                                alignItems="center"
                                overflow="hidden"
                            >
                                <Text
                                    color={block.img_file ? (isDark ? "#e2e8f0" : "#0f172a") : (isDark ? "#94a3b8" : "#64748b")}
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
                            bg={isDark ? "#1f2852" : "#ffffff"}
                            borderColor="rgba(148, 163, 184, 0.25)"
                        />
                    </Box>
                </Box>
            );
        default:
            return null;
    }
}