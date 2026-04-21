import {
    Box,
    Grid,
    GridItem,
} from '@chakra-ui/react'

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { PieChart, BarChart, RadarChart } from '../components/ui/Chart';
import TopNavbar from '../components/ui/TopNavbar';

export default function Dashboard() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const { theme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <Box
            minH='100vh'
            bg={isDark ? '#0b1026' : '#ffffff'}
            color={isDark ? '#f8fafc' : '#020626'}
            px={4}
            py={3}
        >
            <TopNavbar
                searchValue={searchKeyword}
                onSearchChange={setSearchKeyword}
                searchPlaceholder='Tìm kiếm nhanh...'
            />

            <Box
                fontSize={"3xl"}
                fontWeight={"bold"}
                px={1}
                ml={8}
                display={"flex"}
                color={isDark ? '#f8fafc' : '#020626'}
            >
                Tổng Quan
            </Box>
            <Grid
                templateColumns="repeat(4, 1fr)"
                minH='504px'
            >
                <GridItem 
                    colSpan={2}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <PieChart />
                </GridItem>
                <GridItem colSpan={2}>
                    <Box>
                        <RadarChart />
                        <BarChart />
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    )
}