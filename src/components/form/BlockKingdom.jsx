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

    switch(block.block_type) {
        case "standard":
            return (
                <Box
                    w="100%"
                    mt={6}
                    borderRadius="lg"
                    bgColor="#111a3a"
                >
                    <Text fontSize="2xl" fontWeight="bold" p={2} textAlign="center" borderRadius="lg">Văn Bản</Text>
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
    }
}