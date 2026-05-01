import {
    Box,
    Text,
    VStack,
    HStack,
} from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import { useTheme } from 'next-themes'


export default function Sidebar({ links }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Box
            w={{ base: '260px', lg: '280px' }}
            minH="100vh"
            position="sticky"
            top={0}
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
                    {/* <Box
                        w="42px"
                        h="42px"
                        borderRadius="14px"
                        bg={isDark ? '#172554' : '#0f172a'}
                    /> */}
                    <Box>
                        <Text fontSize="lg" fontWeight="700" lineHeight="1.1">
                            The Earth
                        </Text>
                        <Text fontSize="sm" color={isDark ? '#cbd5e1' : '#64748b'}>
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
                    color={isDark ? '#94a3b8' : '#94a3b8'}
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
                                end={isHomeLink}
                                style={({ isActive }) => ({
                                    display: 'block',
                                    borderRadius: '14px',
                                    padding: '14px 16px',
                                    fontWeight: 600,
                                    color: isDark ? '#f8fafc' : '#0f172a',
                                    background: isActive
                                        ? (isDark ? 'rgba(59, 130, 246, 0.18)' : '#eef4ff')
                                        : 'transparent',
                                    border: isActive
                                        ? '1px solid'
                                        : '1px solid transparent',
                                    borderColor: isActive
                                        ? (isDark ? '#3b82f6' : '#c7d2fe')
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

            <Box px={5} py={4} borderTop="1px solid" borderColor={isDark ? '#1d2a5e' : '#eef2f7'}>
                <Text fontSize="sm" color={isDark ? '#cbd5e1' : '#64748b'}>
                    The Earth Admin
                </Text>
            </Box>
        </Box>
    )
}