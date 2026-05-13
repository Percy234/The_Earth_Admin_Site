import {
    Box,
    Flex,
    Input,
    Switch,
} from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { HiMoon, HiOutlineSearch, HiSun } from 'react-icons/hi';

export default function TopNavbar({
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Tìm kiếm nhanh...',
    showSearch = true,
    showThemeToggle = true,
}) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    const inputProps = onSearchChange
        ? {
            value: searchValue ?? '',
            onChange: (e) => onSearchChange(e.target.value, e),
        }
        : {
            defaultValue: searchValue ?? '',
        };

    return (
        <Flex
            direction={{ base: 'row', md: 'row' }}
            align={{ base: 'center', md: 'center' }}
            justify={{ base: 'space-between', md: 'space-between' }}
            wrap={{ base: 'nowrap', md: 'nowrap' }}
            h={{ base: 'auto', md: '60px' }}
            gap={3}
            ps={{ base: '64px', md: 4 }}
            pe={4}
            py={3}
        >
            {showSearch && (
                <Flex
                    align='center'
                    gap={2}
                    w='100%'
                    minW={0}
                    flex={{ base: '1 1 auto', md: '0 1 360px' }}
                    maxW={{ base: '100%', md: '360px' }}
                    p='10px 12px'
                    border='1px solid'
                    borderColor={isDark ? '#1d2a5e' : '#d2d9e7'}
                    borderRadius='lg'
                    bg={isDark ? '#111a3a' : '#ffffff'}
                >
                    <HiOutlineSearch size={18} color={isDark ? '#cbd5e1' : '#475569'} />
                    <Input
                        {...inputProps}
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
                </Flex>
            )}

            {showThemeToggle && (
                <Box marginStart={{ base: 0, md: 'auto' }}>
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
                </Box>
            )}
        </Flex>
    );
}
