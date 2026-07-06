import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Flex,
    Input,
    Switch,
    Heading,
    Image,
    Text,
    Spinner,
} from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { HiMoon, HiOutlineSearch, HiSun } from 'react-icons/hi';
import KINGDOM_API from '../../services/kingdom.api';
import APP_CONFIG from '../../config/app.config';

export default function TopNavbar({
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Tìm kiếm nhanh...',
    showSearch = true,
    showThemeToggle = true,
}) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const location = useLocation();

    const [inputValue, setInputValue] = useState(searchValue);
    const [kingdoms, setKingdoms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);

    const containerRef = useRef(null);

    useEffect(() => {
        setInputValue(searchValue);
    }, [searchValue]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpenSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchKingdoms = async () => {
        if (kingdoms.length > 0 || isLoading) return;
        setIsLoading(true);
        try {
            const res = await KINGDOM_API.getAll();
            if (res && res.status === "success") {
                setKingdoms(res.data);
            } else if (Array.isArray(res)) {
                setKingdoms(res);
            } else if (res && res.data) {
                setKingdoms(res.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách gợi ý:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setIsOpenSuggestions(true);
        fetchKingdoms();
        if (location.pathname === '/kingdoms/manage' && onSearchChange) {
            onSearchChange(value);
        }
    };

    const handleInputFocus = () => {
        setIsOpenSuggestions(true);
        fetchKingdoms();
    };

    const handleSuggestionClick = (kingdomName) => {
        setInputValue(kingdomName);
        setIsOpenSuggestions(false);
        if (onSearchChange) {
            onSearchChange(kingdomName);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsOpenSuggestions(false);
            if (onSearchChange) {
                onSearchChange(inputValue);
            }
        }
    };

    // Filter logic
    const filteredSuggestions = kingdoms.filter((k) => {
        const query = inputValue.toLowerCase().trim();
        if (!query) return false;
        const normalName = (k.normal_name || '').toLowerCase();
        const scienceName = (k.science_name || '').toLowerCase();
        return normalName.includes(query) || scienceName.includes(query);
    });

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
            return url;
        }
        return `${APP_CONFIG.BASE_API}/${url}`;
    };

    return (
        <Flex
            direction="row"
            align="center"
            justify="space-between"
            wrap="nowrap"
            h={{ base: 'auto', md: '60px' }}
            gap={3}
            ps={{ base: '64px', md: 4 }}
            pe={4}
            py={3}
            w="100%"
        >

            {showSearch && (
                <Box
                    ref={containerRef}
                    position="relative"
                    w="100%"
                    maxW={{ base: '100%', md: '360px' }}
                    flex={{ base: '1 1 auto', md: '0 1 360px' }}
                    mx={4}
                >
                    <Flex
                        align='center'
                        gap={2}
                        p='10px 12px'
                        border='1px solid'
                        borderColor={isDark ? '#1d2a5e' : '#d2d9e7'}
                        borderRadius='lg'
                        bg={isDark ? '#111a3a' : '#ffffff'}
                    >
                        <HiOutlineSearch size={18} color={isDark ? '#cbd5e1' : '#475569'} />
                        <Input
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onKeyDown={handleKeyDown}
                            placeholder={searchPlaceholder}
                            border='none'
                            outline='none'
                            p={0}
                            h='20px'
                            minW={0}
                            _focus={{ boxShadow: 'none', outline: 'none', borderColor: 'transparent' }}
                            _focusVisible={{ boxShadow: 'none', outline: 'none', borderColor: 'transparent' }}
                            color={isDark ? '#e2e8f0' : '#1e293b'}
                            _placeholder={{ color: isDark ? '#94a3b8' : '#64748b' }}
                        />
                        {isLoading && <Spinner size="xs" color={isDark ? "blue.400" : "blue.500"} />}
                    </Flex>

                    {isOpenSuggestions && inputValue.trim().length > 0 && (
                        <Box
                            position="absolute"
                            top="calc(100% + 6px)"
                            left={0}
                            right={0}
                            bg={isDark ? '#111a3a' : '#ffffff'}
                            border='1px solid'
                            borderColor={isDark ? '#1d2a5e' : '#d2d9e7'}
                            borderRadius='lg'
                            boxShadow='lg'
                            maxH='260px'
                            overflowY='auto'
                            zIndex={100}
                            py={2}
                        >
                            {isLoading ? (
                                <Flex align="center" justify="center" p={4}>
                                    <Spinner size="sm" mr={2} />
                                    <Text fontSize="xs" color="gray.400">Đang tìm kiếm...</Text>
                                </Flex>
                            ) : filteredSuggestions.length > 0 ? (
                                filteredSuggestions.map((kingdom) => {
                                    const id = kingdom._id || kingdom.id;
                                    return (
                                        <Flex
                                            key={id}
                                            align="center"
                                            gap={3}
                                            px={4}
                                            py={2.5}
                                            cursor="pointer"
                                            _hover={{ bg: isDark ? 'rgba(255, 255, 255, 0.05)' : 'gray.50' }}
                                            onClick={() => handleSuggestionClick(kingdom.normal_name)}
                                        >
                                            <Box
                                                w="24px"
                                                h="24px"
                                                borderRadius="full"
                                                overflow="hidden"
                                                bg="gray.200"
                                                flexShrink={0}
                                            >
                                                {kingdom.thumbnail_url ? (
                                                    <Image
                                                        src={getImageUrl(kingdom.thumbnail_url)}
                                                        alt=""
                                                        w="100%"
                                                        h="100%"
                                                        objectFit="cover"
                                                    />
                                                ) : (
                                                    <Box w="100%" h="100%" bg={kingdom.theme_color || "gray.400"} />
                                                )}
                                            </Box>
                                            <Box minW={0}>
                                                <Text fontSize="sm" fontWeight="600" color={isDark ? 'white' : 'gray.800'} isTruncated>
                                                    {kingdom.normal_name}
                                                </Text>
                                                <Text fontSize="10px" color="gray.400" fontStyle="italic" isTruncated>
                                                    {kingdom.science_name}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    );
                                })
                            ) : (
                                <Box px={4} py={3} textAlign="center">
                                    <Text fontSize="xs" color="gray.400">
                                        Không tìm thấy giới nào
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            )}

            <Flex align="center" gap={4} flex="0 0 auto" marginStart="auto">
                {showThemeToggle && (
                    <Switch.Root
                        size='lg'
                        checked={theme === 'dark'}
                        onCheckedChange={(e) => setTheme(e.checked ? 'dark' : 'light')}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control>
                            <Switch.Thumb>
                                <Switch.ThumbIndicator fallback={<HiSun />}>
                                    <HiMoon />
                                </Switch.ThumbIndicator>
                            </Switch.Thumb>
                        </Switch.Control>
                    </Switch.Root>
                )}
            </Flex>
        </Flex>
    );
}
