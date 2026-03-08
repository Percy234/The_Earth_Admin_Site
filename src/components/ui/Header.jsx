import { Box, Text, Flex } from "@chakra-ui/react";

export default function DashboardHeader({ activeSection, onScrollTo }) {
    return (
        <Box
            position="fixed"
            top={0}
            w="100%"
            zIndex={1000}
            p={6}
            display="flex"
            justifyContent="center"
            transition="all 0.4s ease"
            bg={activeSection === 'home' ? "transparent" : "rgba(255, 255, 255, 0.7)"}
            backdropFilter={activeSection === 'home' ? "none" : "blur(12px)"}
            borderBottom={activeSection === 'home' ? "none" : "1px solid rgba(0,0,0,0.05)"}
        >
            <Flex gap={12}>
                <NavItem 
                    label="TRANG CHỦ" 
                    isActive={activeSection === 'home'} 
                    isLight={activeSection === 'home'}
                    onClick={() => onScrollTo('home')}
                />
                <NavItem 
                    label="BỘ SƯU TẬP" 
                    isActive={activeSection === 'collection'} 
                    isLight={activeSection === 'home'}
                    activeColor="green.500"
                    onClick={() => onScrollTo('collection')}
                />
            </Flex>
        </Box>
    );
}

function NavItem({ label, isActive, onClick, isLight, activeColor = "white" }) {
    return (
        <Text
            fontWeight="bold"
            fontSize="sm"
            letterSpacing="widest"
            cursor="pointer"
            transition="all 0.3s"
            onClick={onClick}
            color={isActive ? (isLight ? "white" : activeColor) : "gray.400"}
            _hover={{ color: isLight ? "white" : "black" }}
            position="relative"
            _after={{
                content: '""',
                position: "absolute",
                bottom: "-4px",
                left: "0",
                width: isActive ? "100%" : "0%",
                height: "2px",
                bg: isActive ? (isLight ? "white" : activeColor) : "transparent",
                transition: "width 0.3s"
            }}
        >
            {label}
        </Text>
    );
}