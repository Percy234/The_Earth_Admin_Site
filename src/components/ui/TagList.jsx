import {Grid, GridItem, Tag, Flex, Box} from "@chakra-ui/react"

export default function TagList({tagName, items}) {
    return (
        <Flex alignItems={"center"} marginBottom={2}>
            <Box 
            fontWeight={"bold"} 
            marginRight={2}
            fontSize={12}
            fontStyle={"italic"}
            >{tagName}:</Box>
            <Grid templateColumns={"repeat(2, 1fr)"}>
                {items.map((item, index) => (
                    <GridItem 
                    key={index} marginRight={2} 
                    colSpan={1}
                    >
                        <Tag.Root
                        >
                            <Tag.Label
                            fontSize={8}
                            >{item}</Tag.Label>
                        </Tag.Root>
                    </GridItem>
                ))}
            </Grid>
        </Flex>
    )
};