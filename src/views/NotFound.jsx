import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { useTheme } from "next-themes";

export default function NotFound() {
    const navigate = useNavigate();
    const error = useRouteError();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    if (error) {
        console.error("Route error:", error);
    }

    const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);
    const errorMessage = isRouteErrorResponse(error)
        ? (error.statusText || "Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.")
        : (error?.message || "Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.");

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minH="60vh"
            textAlign="center"
            px={4}
        >
            <Heading
                fontSize={{ base: "6xl", md: "8xl" }}
                fontWeight="extrabold"
                color="#2a69ac"
                lineHeight="1"
                mb={2}
            >
                {is404 ? "404" : "Lỗi"}
            </Heading>
            <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={3}
                color={isDark ? "white" : "#0f172a"}
            >
                {is404 ? "Trang không tồn tại" : "Đã xảy ra lỗi hệ thống"}
            </Heading>
            <Text
                color="gray.400"
                maxW="500px"
                mb={6}
            >
                {errorMessage}
            </Text>
            <Button
                bg="#2a69ac"
                color="white"
                _hover={{ bg: "#2c5282" }}
                onClick={() => navigate("/")}
            >
                Quay lại Trang chủ
            </Button>
        </Box>
    );
}
