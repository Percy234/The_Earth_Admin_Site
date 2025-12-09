import {
    Flex,
    Box,
    Text,
} from '@chakra-ui/react'

export default function Navbar({links}) {
    return (
        <>
        <Box>
            <Flex gap={8}>
                {links.map((link, index) => (
                    <Box key={index} cursor={"pointer"}>
                        <Text 
                        fontSize={"md"}
                        fontWeight={"medium"}
                        >{link.name}</Text>
                    </Box>
                ))}
            </Flex>
        </Box>
        </>
    )
}