import {
    Card,
    Box,
    Flex,
    Heading,
    Text,
    Grid,
    GridItem,
    Image,
    Stack,
    Button,
} from "@chakra-ui/react";
import { Tooltip } from "../ui/Tooltip.jsx";
import { LuPencilLine, LuTrash2 } from "react-icons/lu";

//config
import APP_CONFIG from "../../config/app.config";

export default function CardX({
    img,
    title,
    subTitle,
    themeColor,
    description,
    onEdit,
    onDelete,
}) {
    return (
        <Card.Root 
            h={"100%"}
            w={"95%"}
            boxShadow="0 4px 20px rgba(0,0,0,0.05)"
            bg={"white"}
            display="flex"
            alignItems="center"
            borderRadius={"lg"}
            overflow={"hidden"}
            border={"none"}
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
        >
            <Box
                bg={themeColor}
                w="88%"
                h="320px"
                borderRadius={4}
                mt={6}
                position={"relative"}
            >
                <Image
                    src={`${APP_CONFIG.BASE_API}${img}`}
                    alt={title}
                    borderTopRadius="md"
                    w="75%"
                    h="80%"
                    position={"absolute"}
                    left={"50%"}
                    transform={"translateX(-50%)"}  
                    bottom={0}
                    objectFit="cover"
                />
            </Box>
            <Card.Body 
                p={4}
                bg={"white"}
            >
                <Grid
                    templateColumns="repeat(5, 1fr)"
                    gap={2}
                >
                    <GridItem colSpan={3}>
                        <Heading 
                            fontSize={"xl"} 
                            mb={2}
                            color={"black"}
                        >
                            {title}
                        </Heading>
                        <Text fontSize={"sm"} color={"gray.500"} mb={2}>
                            {subTitle}
                        </Text>
                    </GridItem>
                    <GridItem
                        colSpan={2}
                    >
                        <Stack 
                            direction={"row"}
                            spacing={2}
                            justifyContent={"flex-end"}
                            w="full"
                        >
                           
                        </Stack>
                    </GridItem>
                </Grid>
            </Card.Body>
        
        </Card.Root>
    )
}