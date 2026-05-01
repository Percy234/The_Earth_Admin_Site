import { Box } from '@chakra-ui/react'
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { PieChart, BarChart, RadarChart, EraLineChart } from '../components/ui/Chart';
import TopNavbar from '../components/ui/TopNavbar';

export default function Dashboard() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Box
            h="100vh"
            display="flex"
            flexDirection="column"
            bg={isDark ? '#0b1026' : '#ffffff'}
            color={isDark ? '#f8fafc' : '#020626'}
            overflow="hidden"
        >
            <TopNavbar
                style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000
                }}
                searchValue={searchKeyword}
                onSearchChange={setSearchKeyword}
                searchPlaceholder='Tìm kiếm nhanh...'
            />

            <Box
                flex="1"
                display="flex"
                flexDirection="column"
                px={4}
                pb={3}
                overflow="auto"
            >
                <Box
                    flex="1"
                    display="grid"
                    gridTemplateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
                    gridTemplateRows={{ base: 'repeat(4, minmax(260px, auto))', xl: '320px 280px' }}
                    gap={3}
                    alignItems="stretch"
                >
                    <Box
                        minH={{ base: '260px', xl: '0' }}
                        w="100%"
                        bg={isDark ? '#111a3a' : '#ffffff'}
                        border="1px solid"
                        borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
                        borderRadius="18px"
                        boxShadow="sm"
                        p={3}
                    >
                        <PieChart />
                    </Box>

                    <Box
                        minH={{ base: '260px', xl: '0' }}
                        w="100%"
                        bg={isDark ? '#111a3a' : '#ffffff'}
                        border="1px solid"
                        borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
                        borderRadius="18px"
                        boxShadow="sm"
                        p={3}
                    >
                        <RadarChart />
                    </Box>

                    <Box
                        minH={{ base: '260px', xl: '0' }}
                        w="100%"
                        bg={isDark ? '#111a3a' : '#ffffff'}
                        border="1px solid"
                        borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
                        borderRadius="18px"
                        boxShadow="sm"
                        p={3}
                    >
                        <BarChart />
                    </Box>

                    <Box
                        gridColumn={{ base: 'auto', xl: '1 / -1' }}
                        minH={{ base: '260px', xl: '0' }}
                        w="100%"
                        bg={isDark ? '#111a3a' : '#ffffff'}
                        border="1px solid"
                        borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
                        borderRadius="18px"
                        boxShadow="sm"
                        p={3}
                    >
                        <EraLineChart />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}