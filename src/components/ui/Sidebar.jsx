import {
    Box,
    Grid,
    GridItem,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useTheme } from 'next-themes'


export default function Sidebar({ links }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Box
            minH="100vh"
            bg={isDark ? '#020626' : '#f5f5f5'}
            color={isDark ? '#f8fafc' : '#0f172a'}
            borderRight="1px solid"
            borderColor={isDark ? '#1d2a5e' : '#dbe2ef'}
        >
            <Box
                fontSize={"3xl"}
                fontWeight={"bold"}
                p={4}
                display={"flex"}
                justifyContent="center"
                borderBottom="1px solid"
                borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
            >
                The Earth
            </Box>
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                mt="30%"
            >
                <Grid
                    fontSize={"xl"}
                    fontWeight={"bold"}
                    w={"100%"}
                >
                    {links.map((link, index) => (
                        <GridItem
                            key={index} p={4}
                            cursor={"pointer"}
                            bg={isDark ? '#0f173d' : '#f1f5f9'}
                            textAlign="center"
                            borderBottom="1px solid"
                            borderColor={isDark ? '#1d2a5e' : '#dbe2ef'}
                            transition="background-color 0.2s ease"
                            _hover={{
                                bg: isDark ? '#1b265a' : '#e2e8f0',
                            }}
                        >
                            <Link style={{
                                display: "block",
                                color: "inherit",
                            }} to={link.path}>{link.name}</Link>
                        </GridItem>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}