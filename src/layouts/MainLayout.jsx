import { Outlet } from 'react-router-dom'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import ScrollToTop from '../components/ui/ScrollToTop'
import Sidebar from '../components/ui/Sidebar';
import { Toaster } from '../components/ui/Toaster';

export default function MainLayout() {
    return (
        <Box
            minH="100vh"
            bg="#f5f7fb"
        >
            <Box display="flex" minH="100vh">
                <Sidebar
                    links={[
                        { name: 'Tổng quan', path: '/' },
                        { name: 'Quản lý các giới', path: '/kingdoms' },
                        { name: 'Thêm giới mới', path: '/kingdoms/add' },
                    ]}
                />

                <Box flex="1" minW="0">
                    <ScrollToTop />
                    <Outlet />
                    <Toaster />
                </Box>
            </Box>
        </Box>
    )
}