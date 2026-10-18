import { useState, useEffect, useMemo } from "react";
import {
    Box,
    Text,
    Image,
    VStack,
    HStack,
    Flex,
    Input,
    Icon,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react';

import { LuMenu, LuChevronDown, LuChevronRight } from "react-icons/lu";
import { HiOutlineSearch } from "react-icons/hi";
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';

const GREEN_500 = "#38A169";

function NeoBrutalistNavItem({ link, isDark, onNavigate, searchTerm }) {
    const location = useLocation();
    const isSubActive = link.subLinks?.some(sub =>
        location.pathname.toLowerCase() === sub.path.toLowerCase()
    );
    const [isExpanded, setIsExpanded] = useState(!!isSubActive);

    useEffect(() => {
        if (isSubActive || (searchTerm && link.subLinks?.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase())))) {
            setIsExpanded(true);
        }
    }, [location.pathname, isSubActive, searchTerm]);

    // Single link (Tổng quan, Danh sách): No arrow chevron, turns green on hover & active
    if (!link.subLinks) {
        return (
            <NavLink
                to={link.path}
                end={true}
                onClick={onNavigate}
                style={{ textDecoration: 'none', display: 'block' }}
            >
                {({ isActive }) => (
                    <Box position="relative" mb={3} ml="4px" w="calc(100% - 6px)">
                        {/* Offset backing shadow */}
                        <Box
                            position="absolute"
                            top="4px"
                            left="-4px"
                            w="100%"
                            h="100%"
                            bg={isDark ? "white" : "black"}
                            zIndex={1}
                        />

                        {/* Floating button */}
                        <Box
                            position="relative"
                            zIndex={2}
                            h="40px"
                            bg={isActive ? GREEN_500 : (isDark ? "#141e33" : "white")}
                            color={isActive ? "white" : (isDark ? "white" : "black")}
                            border={isDark ? "2px solid white" : "3px solid black"}
                            borderRadius="0"
                            px={3}
                            display="flex"
                            alignItems="center"
                            transform={isActive ? "translate(-4px, 4px)" : "none"}
                            transition="transform 0.15s ease-in-out, background-color 0.15s ease-in-out, color 0.15s ease-in-out"
                            _hover={{
                                transform: "translate(-4px, 4px)",
                                bg: GREEN_500,
                                color: "white"
                            }}
                        >
                            <Text
                                fontWeight="800"
                                fontSize="xs"
                                textTransform="uppercase"
                                letterSpacing="0.5px"
                                lineHeight="1"
                            >
                                {link.name}
                            </Text>
                        </Box>
                    </Box>
                )}
            </NavLink>
        );
    }

    const filteredSubLinks = link.subLinks.filter(sub =>
        !searchTerm || sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (searchTerm && filteredSubLinks.length === 0 && !link.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return null;
    }

    return (
        <Box mb={3}>
            {/* Expandable parent button: Has chevron arrow */}
            <Box position="relative" ml="4px" w="calc(100% - 6px)">
                {/* Offset backing shadow */}
                <Box
                    position="absolute"
                    top="4px"
                    left="-4px"
                    w="100%"
                    h="100%"
                    bg={isDark ? "white" : "black"}
                    zIndex={1}
                />

                {/* Floating expandable button */}
                <Box
                    position="relative"
                    zIndex={2}
                    h="40px"
                    bg={isSubActive || isExpanded ? (isSubActive ? GREEN_500 : (isDark ? "#1e293b" : "gray.100")) : (isDark ? "#141e33" : "white")}
                    color={isSubActive ? "white" : (isDark ? "white" : "black")}
                    border={isDark ? "2px solid white" : "3px solid black"}
                    borderRadius="0"
                    px={3}
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    onClick={() => setIsExpanded(prev => !prev)}
                    transform={isSubActive || isExpanded ? "translate(-4px, 4px)" : "none"}
                    transition="transform 0.15s ease-in-out, background-color 0.15s ease-in-out, color 0.15s ease-in-out"
                    _hover={{
                        transform: "translate(-4px, 4px)",
                        bg: GREEN_500,
                        color: "white"
                    }}
                >
                    <Text
                        fontWeight="800"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.5px"
                        lineHeight="1"
                    >
                        {link.name}
                    </Text>
                    <Icon
                        as={isExpanded ? LuChevronDown : LuChevronRight}
                        boxSize={4}
                        strokeWidth={2.5}
                    />
                </Box>
            </Box>

            {/* Sublinks: Fixed height 34px, 2px borders, perfectly covers shadow on hover */}
            {isExpanded && (
                <VStack
                    spacing={2}
                    align="stretch"
                    mt={3}
                    ml="8px"
                    pl={2}
                    borderLeft={isDark ? "2px solid white" : "3px solid black"}
                >
                    {filteredSubLinks.map((sub) => {
                        return (
                            <NavLink
                                key={sub.path}
                                to={sub.path}
                                end={true}
                                onClick={onNavigate}
                                style={{ textDecoration: 'none', display: 'block' }}
                            >
                                {({ isActive }) => (
                                    <Box position="relative" ml="3px" w="calc(100% - 5px)">
                                        <Box
                                            position="absolute"
                                            top="3px"
                                            left="-3px"
                                            w="100%"
                                            h="34px"
                                            bg={isDark ? "white" : "black"}
                                            zIndex={1}
                                        />
                                        <Box
                                            position="relative"
                                            zIndex={2}
                                            h="34px"
                                            display="flex"
                                            alignItems="center"
                                            bg={isActive ? GREEN_500 : (isDark ? "#141e33" : "white")}
                                            color={isActive ? "white" : (isDark ? "white" : "black")}
                                            border={isDark ? "2px solid white" : "2px solid black"}
                                            borderRadius="0"
                                            px={2.5}
                                            transform={isActive ? "translate(-3px, 3px)" : "none"}
                                            transition="transform 0.15s ease-in-out, background-color 0.15s ease-in-out, color 0.15s ease-in-out"
                                            _hover={{
                                                transform: "translate(-3px, 3px)",
                                                bg: GREEN_500,
                                                color: "white"
                                            }}
                                        >
                                            <Text
                                                fontWeight="700"
                                                fontSize="11px"
                                                textTransform="uppercase"
                                                letterSpacing="0.4px"
                                                lineHeight="1"
                                                isTruncated
                                            >
                                                {sub.name}
                                            </Text>
                                        </Box>
                                    </Box>
                                )}
                            </NavLink>
                        );
                    })}
                </VStack>
            )}
        </Box>
    );
}

function SidebarContent({ links, isDark, onNavigate }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLinks = useMemo(() => {
        if (!searchTerm.trim()) return links;
        const q = searchTerm.toLowerCase().trim();
        return links.filter(link => {
            if (link.name.toLowerCase().includes(q)) return true;
            if (link.subLinks?.some(sub => sub.name.toLowerCase().includes(q))) return true;
            return false;
        });
    }, [links, searchTerm]);

    return (
        <Box
            w={{ base: '100%', md: '240px' }}
            minH="100vh"
            bg={isDark ? '#141e33' : '#ffffff'}
            color={isDark ? '#f8fafc' : '#0f172a'}
            borderRight={isDark ? "2px solid rgba(255, 255, 255, 0.15)" : "3px solid black"}
            display="flex"
            flexDirection="column"
            overflowX="hidden"
        >
            {/* Logo & Brand Header */}
            <Box px={4} py={5}>
                <NavLink to="/" onClick={onNavigate} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <HStack spacing={2.5} align="center">
                        <Image
                            src={isDark ? "/images/logo/earth-white.svg" : "/images/logo/earth-black.svg"}
                            alt="Logo Trái Đất"
                            boxSize="32px"
                            objectFit="contain"
                        />
                        <Text fontSize="md" fontWeight="800" lineHeight="1.1" textTransform="uppercase" letterSpacing="0.5px">
                            Trái Đất
                        </Text>
                    </HStack>
                </NavLink>
            </Box>

            {/* Navigation Body */}
            <Box flex="1" px={3.5} py={2}>
                <Text
                    mb={3}
                    fontSize="xs"
                    fontWeight="900"
                    letterSpacing="1px"
                    textTransform="uppercase"
                    color={isDark ? "white" : "black"}
                >
                    Điều hướng
                </Text>

                {/* Quick Search Bar matching User Site style */}
                <Box position="relative" mb={3} ml="4px" w="calc(100% - 6px)">
                    <Box
                        position="absolute"
                        top="3px"
                        left="-3px"
                        w="100%"
                        h="100%"
                        bg={isDark ? "white" : "black"}
                        zIndex={1}
                    />
                    <Flex
                        position="relative"
                        zIndex={2}
                        align="center"
                        h="36px"
                        px={2.5}
                        bg={isDark ? "#141e33" : "white"}
                        border={isDark ? "2px solid white" : "3px solid black"}
                        borderRadius="0"
                        transition="transform 0.15s ease-in-out"
                        _hover={{ transform: "translate(-3px, 3px)" }}
                        _focusWithin={{ transform: "translate(-3px, 3px)" }}
                    >
                        <HiOutlineSearch size={15} color={isDark ? "#94a3b8" : "#475569"} />
                        <Input
                            placeholder="Tìm kiếm nhanh..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            border="none"
                            outline="none"
                            boxShadow="none"
                            fontSize="xs"
                            fontWeight="bold"
                            color={isDark ? "white" : "black"}
                            px={2}
                            h="100%"
                            borderRadius="0"
                            _placeholder={{ color: isDark ? "gray.500" : "gray.400", fontWeight: "normal" }}
                            _focus={{ boxShadow: "none", outline: "none" }}
                        />
                    </Flex>
                </Box>

                {/* Divider Line */}
                <Box h="1px" bg={isDark ? "rgba(255,255,255,0.15)" : "#e2e8f0"} mb={3.5} />

                {/* Navigation Items in Neo-Brutalist Card Style */}
                <VStack spacing={0} align="stretch">
                    {filteredLinks.map((link, idx) => (
                        <NeoBrutalistNavItem
                            key={link.path || link.name || idx}
                            link={link}
                            isDark={isDark}
                            onNavigate={onNavigate}
                            searchTerm={searchTerm}
                        />
                    ))}
                </VStack>
            </Box>

            {/* Footer */}
            <Box
                px={4}
                py={3}
                borderTop={isDark ? "2px solid rgba(255, 255, 255, 0.15)" : "3px solid black"}
            >
                <Text
                    fontSize="xs"
                    fontWeight="700"
                    color={isDark ? '#cbd5e1' : '#475569'}
                    letterSpacing="0.5px"
                >
                    Trái Đất © Admin
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
                    bg={isDark ? '#141e33' : '#ffffff'}
                    color={isDark ? '#e2e8f0' : '#0f172a'}
                    border={isDark ? "2px solid white" : "2.5px solid black"}
                    borderRadius="0"
                    boxShadow={isDark ? "2px 2px 0px white" : "2px 2px 0px black"}
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
                w={{ md: '240px' }}
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
                left={open ? 0 : '-240px'}
                w="240px"
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