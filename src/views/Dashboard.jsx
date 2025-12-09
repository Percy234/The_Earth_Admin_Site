import { 
    Heading,
    Box,
    Text
 } from '@chakra-ui/react'
import { 
    useChart
 } from "@chakra-ui/charts"

export default function Dashboard() {
    
    return (
        <>
            <Heading my='4'>Welcome to Admin dashboard</Heading>
            <Box>
                <Text
                fontSize={"xl"}
                fontWeight={"semibold"}
                >Comming soon!....</Text>
            </Box>
        </>
    )
}