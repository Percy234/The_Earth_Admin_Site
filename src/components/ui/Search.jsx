import {
    Box,
    Text,
    Kbd
} from '@chakra-ui/react'
import { HiOutlineSearch } from 'react-icons/hi'
import { useTheme } from 'next-themes'


export default function Search() {
    const { theme } = useTheme()
    return (
        <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        p={"4px 8px"}
        borderRadius={2}
        backgroundColor={theme === 'dark' ? "#242424" : "#F0F0F0"}
        backdropBlur={1}
        fontSize={14}
        >
            <Box flex={1}>
                <HiOutlineSearch size={"20px"} />
            </Box>
            <Text flex={5}>Search...</Text>
            <Box 
            >
                <Kbd>Ctrl+K</Kbd>
            </Box>
        </Box>
    )
}