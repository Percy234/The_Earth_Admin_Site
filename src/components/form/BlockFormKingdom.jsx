import { Box, Grid, GridItem, Input, Textarea } from "@chakra-ui/react"
import KINGDOM_API from "../../services/kingdom.api"

export default function BlockFormKingdom({
    block,
    index,
    updateBlockData,
    textColor,
    themeColor
}) {

    const colorsBlockId = `color-block-${index}`

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
                                        accept="image/*"
                                        display="none"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const previewUrl = URL.createObjectURL(file);

                                            // preview
                                            updateBlockData(index, "img_url", previewUrl);

                                            // lưu file thật
                                            updateBlockData(index, "img_file", file);
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
                                    fontSize={{ base: "14px", md: "16px", lg: "18px" }}
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
                                    fontSize={{ base: "14px", md: "16px", lg: "18px" }}
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
                                        accept="image/*"
                                        display="none"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const previewUrl = URL.createObjectURL(file);

                                            // preview
                                            updateBlockData(index, "img_url", previewUrl);

                                            // 🔥 lưu file thật
                                            updateBlockData(index, "img_file", file);
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
                        bg={themeColor || "#161433"}  
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
                                            const file = e.target.files?.[0]
                                            if (!file) return;

                                            const previewUrl = URL.createObjectURL(file);

                                            // preview
                                            updateBlockData(index, "img_url", previewUrl);

                                            // 🔥 lưu file thật
                                            updateBlockData(index, "img_file", file);
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