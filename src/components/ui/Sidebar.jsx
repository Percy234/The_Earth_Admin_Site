import {
    Box,
    Text,
    VStack,
    HStack,
    Icon,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react'

import { LuMenu } from "react-icons/lu";
import { NavLink } from 'react-router-dom'
import { useTheme } from 'next-themes'

function SidebarContent({ links, isDark, onNavigate }) {
    return (
        <Box
            w={{ base: '100%', md: '260px', lg: '280px' }}
            minH="100vh"
            bg={isDark ? '#0b1026' : '#ffffff'}
            color={isDark ? '#f8fafc' : '#0f172a'}
            borderRight="1px solid"
            borderColor={isDark ? '#1d2a5e' : '#e5e7eb'}
            boxShadow={isDark ? 'none' : '0 8px 24px rgba(15, 23, 42, 0.06)'}
            display="flex"
            flexDirection="column"
        >
            <Box
                px={5}
                py={6}
                borderBottom="1px solid"
                borderColor={isDark ? '#1d2a5e' : '#eef2f7'}
            >
                <HStack spacing={3} align="center">
                    <Box>
                        <Text fontSize="lg" fontWeight="700" lineHeight="1.1">
                            The Earth
                        </Text>

                        <Text
                            fontSize="sm"
                            color={isDark ? '#cbd5e1' : '#64748b'}
                        >
                            Admin dashboard
                        </Text>
                    </Box>
                </HStack>
            </Box>

            <Box flex="1" px={4} py={5}>
                <Text
                    px={2}
                    mb={3}
                    fontSize="xs"
                    fontWeight="700"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    color="#94a3b8"
                >
                    Điều hướng
                </Text>

                <VStack spacing={2} align="stretch">
                    {links.map((link) => {
                        const isHomeLink = link.path === '/'

                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={true}
                                onClick={onNavigate}
                                style={({ isActive }) => ({
                                    display: 'block',
                                    borderRadius: '14px',
                                    padding: '14px 16px',
                                    fontWeight: 600,
                                    color: isDark ? '#f8fafc' : '#0f172a',
                                    background: isActive
                                        ? (
                                            isDark
                                                ? 'rgba(59, 130, 246, 0.18)'
                                                : '#eef4ff'
                                        )
                                        : 'transparent',
                                    border: isActive
                                        ? '1px solid'
                                        : '1px solid transparent',
                                    borderColor: isActive
                                        ? (
                                            isDark
                                                ? '#3b82f6'
                                                : '#c7d2fe'
                                        )
                                        : 'transparent',
                                    transition: 'all 0.2s ease',
                                })}
                            >
                                {link.name}
                            </NavLink>
                        )
                    })}
                </VStack>
            </Box>

            <Box
                px={5}
                py={4}
                borderTop="1px solid"
                borderColor={isDark ? '#1d2a5e' : '#eef2f7'}
            >
                <Text
                    fontSize="sm"
                    color={isDark ? '#cbd5e1' : '#64748b'}
                >
                    The Earth Admin
                </Text>
            </Box>
        </Box>
    )
}

export default function Sidebar({ links }) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const { open, onOpen, onClose } = useDisclosure()

    return (
    <>
        {/* Mobile Menu Button */}
        <Box
            display={{ base: 'block', md: 'none' }}
            position="fixed"
            top={3}
            left={4}
            zIndex={1200}
        >
            <IconButton
                onClick={onOpen}
                aria-label="Open menu"
                size="sm"
                bg={isDark ? '#111a3a' : '#ffffff'}
                color={isDark ? '#e2e8f0' : '#0f172a'}
                border="1px solid"
                borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
                boxShadow={isDark ? 'none' : 'sm'}
                _hover={{ bg: isDark ? '#1b2755' : '#f1f5f9' }}
            >
                <Icon as={LuMenu} boxSize={5} />
            </IconButton>
        </Box>

        {/* Desktop Sidebar */}
        <Box
            display={{ base: 'none', md: 'block' }}
            position="fixed"
            top={0}
            left={0}
            h="100vh"
            zIndex={120}
            w={{ md: '260px', lg: '280px' }}
        >
            <SidebarContent
                links={links}
                isDark={isDark}
            />
        </Box>

        {/* Mobile Sidebar */}
        <Box
            display={{ base: 'block', md: 'none' }}
            position="fixed"
            top={0}
            left={open ? 0 : '-280px'}
            w="260px"
            h="100vh"
            zIndex={2000}
            transition="left 0.3s ease"
        >
            <SidebarContent
                links={links}
                isDark={isDark}
                onNavigate={onClose}
            />
        </Box>

        {/* Backdrop */}
        {open && (
            <Box
                display={{ base: 'block', md: 'none' }}
                position="fixed"
                inset={0}
                bg="rgba(0,0,0,0.4)"
                zIndex={1500}
                onClick={onClose}
            />
        )}
    </>
)
}