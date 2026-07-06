import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import ScrollToTop from '../components/ui/ScrollToTop';
import Sidebar from '../components/ui/Sidebar';
import TopNavbar from '../components/ui/TopNavbar';
import { Toaster } from '../components/ui/Toaster';

export default function MainLayout() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const links = [
        { name: 'Tổng quan', path: '/' },
        { name: 'Danh sách các giới', path: '/kingdoms/manage' },
        { name: 'Thêm giới mới', path: '/kingdoms/addKingdom' },
    ];

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchKeyword = searchParams.get('search') || '';

    const handleSearchChange = (value) => {
        if (location.pathname !== '/kingdoms/manage') {
            navigate(`/kingdoms/manage?search=${encodeURIComponent(value)}`);
        } else {
            setSearchParams(value ? { search: value } : {});
        }
    };

    return (
        <Box minH="100vh" bg={isDark ? '#0b1026' : '#f5f7fb'}>
            <Box display="flex" minH="100vh">
                <Sidebar links={links} />

                <Box flex="1" minW="0" ml={{ base: 0, md: '260px', lg: '280px' }} display="flex" flexDirection="column">
                    <Box
                        position="fixed"
                        top={0}
                        left={{ base: 0, md: '260px', lg: '280px' }}
                        right={0}
                        zIndex={10}
                        bg={isDark ? '#0b1026' : '#f5f7fb'}
                        borderBottom="1px solid"
                        borderColor={isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'}
                    >
                        <TopNavbar
                            searchValue={searchKeyword}
                            onSearchChange={handleSearchChange}
                            searchPlaceholder="Tìm kiếm..."
                        />
                    </Box>

                    {/* Spacer to push content down below the fixed header */}
                    <Box h="60px" />

                    <Box flex="1" p={6}>
                        <ScrollToTop />
                        <Outlet />
                    </Box>
                    <Toaster />
                </Box>
            </Box>
        </Box>
    );
}