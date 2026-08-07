import { useState, useEffect } from "react";
import {
    Box,
    Text,
    VStack,
    HStack,
    Icon,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react';

import { LuMenu, LuChevronDown, LuChevronRight } from "react-icons/lu";
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';

function ExpandableNavItem({ link, isDark, onNavigate }) {
    const location = useLocation();
    const isSubActive = link.subLinks?.some(sub =>
        location.pathname.toLowerCase() === sub.path.toLowerCase()
    );
    const [isExpanded, setIsExpanded] = useState(!!isSubActive);

    useEffect(() => {
        if (isSubActive) {
            setIsExpanded(true);
        }
    }, [location.pathname, isSubActive]);

    if (!link.subLinks) {
        return (
            <NavLink
                to={link.path}
                end={true}
                onClick={onNavigate}
                style={({ isActive }) => ({
                    display: 'block',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    fontWeight: 600,
                    color: isActive
                        ? (isDark ? '#60a5fa' : '#2563eb')
                        : (isDark ? '#f8fafc' : '#0f172a'),
                    background: isActive
                        ? (isDark ? 'rgba(59, 130, 246, 0.18)' : '#eef4ff')
                        : 'transparent',
                    border: '1px solid',
                    borderColor: isActive
                        ? (isDark ? '#3b82f6' : '#c7d2fe')
                        : 'transparent',
                    transition: 'all 0.2s ease',
                })}
            >
                {link.name}
            </NavLink>
        );
    }

    return (
        <Box>
            <Box
                onClick={() => setIsExpanded(prev => !prev)}
                cursor="pointer"
                borderRadius="14px"
                p="14px 16px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                fontWeight={600}
                color={isSubActive ? (isDark ? '#60a5fa' : '#2563eb') : (isDark ? '#f8fafc' : '#0f172a')}
                bg={isSubActive ? (isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)') : 'transparent'}
                _hover={{ bg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc' }}
                transition="all 0.2s ease"
            >
                <Text fontWeight={600}>{link.name}</Text>
                <Icon
                    as={isExpanded ? LuChevronDown : LuChevronRight}
                    boxSize={4}
                    color={isSubActive ? (isDark ? '#60a5fa' : '#2563eb') : 'gray.400'}
                    transition="transform 0.2s ease"
                />
            </Box>

            {isExpanded && (
                <VStack
                    spacing={1}
                    align="stretch"
                    mt={1}
                    ml={3}
                    pl={3}
                    borderLeft="2px solid"
                    borderColor={isSubActive ? (isDark ? '#3b82f6' : '#93c5fd') : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0')}
                >
                    {link.subLinks.map((sub) => (
                        <NavLink
                            key={sub.path}
                            to={sub.path}
                            end={true}
                            onClick={onNavigate}
                            style={({ isActive }) => ({
                                display: 'block',
                                borderRadius: '10px',
                                padding: '10px 14px',
                                fontSize: '13px',
                                fontWeight: isActive ? 600 : 500,
                                color: isActive
                                    ? (isDark ? '#60a5fa' : '#2563eb')
                                    : (isDark ? '#cbd5e1' : '#475569'),
                                background: isActive
                                    ? (isDark ? 'rgba(59, 130, 246, 0.18)' : '#eef4ff')
                                    : 'transparent',
                                border: '1px solid',
                                borderColor: isActive
                                    ? (isDark ? '#3b82f6' : '#c7d2fe')
                                    : 'transparent',
                                transition: 'all 0.2s ease',
                            })}
                        >
                            {sub.name}
                        </NavLink>
                    ))}
                </VStack>
            )}
        </Box>
    );
}

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
                    {links.map((link, idx) => (
                        <ExpandableNavItem
                            key={link.path || link.name || idx}
                            link={link}
                            isDark={isDark}
                            onNavigate={onNavigate}
                        />
                    ))}
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
    );
}

export default function Sidebar({ links }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { open, onOpen, onClose } = useDisclosure();

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
    );
}