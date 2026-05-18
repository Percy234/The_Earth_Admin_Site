import { Outlet } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import ScrollToTop from '../components/ui/ScrollToTop'
import Sidebar from '../components/ui/Sidebar'
import { Toaster } from '../components/ui/Toaster'

export default function MainLayout() {
    const links = [
        { name: 'Tổng quan', path: '/' },
        { name: 'Quản lý các giới', path: '/kingdoms' },
        { name: 'Thêm giới mới', path: '/kingdoms/addKingdom' },
    ]

    return (
        <Box minH="100vh" bg="#f5f7fb">
            <Box display="flex" minH="100vh">
                <Sidebar links={links} />

                <Box flex="1" minW="0" ml={{ base: 0, md: '260px', lg: '280px' }}>
                    <ScrollToTop />
                    <Outlet />
                    <Toaster />
                </Box>
            </Box>
        </Box>
    )
}