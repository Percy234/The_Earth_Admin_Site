import { Outlet } from 'react-router-dom'
import {
    Container,
    Grid,
    GridItem,
    Box
} from '@chakra-ui/react'

export default function MainLayout() {
    return (
        <Box className='bg-white text-black min-h-screen'>
            <Box px={32} py={4} className='shadow'>
                <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                    <GridItem colSpan={1} className='h-full'>
                        <Box className=''>
                            Dashboard
                        </Box>
                    </GridItem>
                    <GridItem colSpan={3}>
                        <Box>
                            options
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
            <Box px={32}>
                {/* phần thân */}
                <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                    <GridItem colSpan={1} className='h-full'>
                        <Box border={1} className='border border-black'>
                            Dashboard
                        </Box>
                    </GridItem>
                    <GridItem colSpan={3}>
                        <Box>
                            <Outlet />
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
        </Box>
    )
}