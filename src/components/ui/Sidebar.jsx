import {
    Box,
    Grid,
    GridItem,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'


export default function Sidebar({links}) {
    return (
        <Box>
            <Grid>
                {links.map((link, index) => (
                    <GridItem 
                    key={index} p={4} 
                    borderBottom={"1px solid"} 
                    borderColor={"gray.200"}
                    cursor={"pointer"}
                    _hover={
                        {
                            backgroundColor: "gray.100",
                            backdropFilter: "blur(10px)",
                            transition: "all 0.2s ease-in-out",
                            color: "blue.500",
                        }
                    }
                    >
                        <Link style={{
                            display: "block",
                        }} to={link.path}>{link.name}</Link>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    )
}