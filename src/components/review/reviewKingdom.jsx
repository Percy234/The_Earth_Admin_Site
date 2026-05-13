import React from "react"
import { Box, Stack, Icon, Text } from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu";

export default function ReviewKingdom({
    formData,
    templateImgUrl,
    templateBgUrl
}) {
    return (
        <Box
            h="80vh"
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
            ></Box>
                
        </Box>
    )
}