import {
    useState,
    useEffect,
} from "react";

import {
    Box,
    Heading,
    Text,
    Grid,
    GridItem,
    Card,
    Flex,
} from "@chakra-ui/react";
import CardX from "../../components/ui/CardX";
import { useTheme } from "next-themes";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

//api
import KINGDOM_API from "../../services/kingdom.api";



export default function ManageKingdoms() {
    const { theme } = useTheme();
    const [kingdoms, setKingdoms] = useState([]);
    const navigate = useNavigate();

    //hooks
    useEffect(() => {
        fetchKingdoms();
    }, []);


    //methods
    const fetchKingdoms = async () => {
        const data = await KINGDOM_API.getAll();
        setKingdoms(data.data);
    };

    //setup
    document.title = "Admin | Quản lý Giới";

    return (
        <Box 
            p="5%"
        >
            <Box
                border={"1px solid"}
                // borderColor={theme === "light" ? "gray.200" : "gray.700"}
                p={4}
                borderRadius={6}
            >
                <h1
                style={{
                    fontSize: "100px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    textAlign: "center",
                    letterSpacing: "2px",
                    margin: "0",
                    backgroundImage: "linear-gradient(360deg, #FFFFFF59 0%, #00703c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                }}
                >
                    Bộ sưu tập
                </h1>
                <Text
                    fontSize={"4xl"}
                    fontWeight={"700"}
                    w={"450px"}
                    mx="auto"
                    textAlign={"center"}
                    color={"black"}
                >
                    Quản lý các sinh vật trong hệ thống của The Earth.
                </Text>
            </Box>
            
            <Box
                // borderColor={theme === "light" ? "gray.200" : "gray.700"}
                p={4}
                borderRadius={6}
                my={2}
            >
                <Heading
                        className="dna-heading"
                        mb={6}
                        fontSize={"4xl"}
                        letterSpacing={4}
                        color={"#00703c"}
                    >
                        Danh sách Giới
                    </Heading>
                    <Box
                        w={"30%"}
                        h={"5px"}
                        bg={"green.600"}
                        my={"4"}
                        rounded={"lg"}
                    ></Box>
                <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
                    {kingdoms.map((kingdom, index) => {
                        return (
                            <GridItem key={index} colSpan={1}>
                                <CardX 
                                img={kingdom.thumbnail_url}
                                themeColor={kingdom.theme_color}
                                title={kingdom.normal_name}
                                subTitle={kingdom.science_name}
                                description={kingdom.description}
                                />
                            </GridItem>
                        )
                    })}
                    <GridItem>
                        <Card.Root
                            h={"100%"}
                            w={"95%"}
                            boxShadow="0 4px 20px rgba(0,0,0,0.05)"
                            bg={"white"}
                            display="flex"
                            alignItems="center"
                            borderRadius={"lg"}
                            overflow={"hidden"}
                            border={"2px dashed"}
                            borderColor={"gray.200"}
                            transition="all 0.3s"
                            cursor="pointer"
                            _hover={{ transform: "translateY(-5px)", boxShadow: "xl", borderColor: "green.400" }}
                            onClick={() => navigate("/kingdoms/add")}
                        >
                            <Box
                                bg={"#161433"}
                                w="88%"
                                h="320px"
                                borderRadius={4}
                                mt={6}
                                position={"relative"}
                            >
                                <Box
                                    position={"absolute"}
                                    bottom={0}
                                    left={"50%"}
                                    transform={"translateX(-50%)"}
                                    borderTopRadius="md"
                                    w="75%"
                                    h="80%"
                                    bg={"white"}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                >
                                    <Box
                                        w={"70px"}
                                        h={"70px"}
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        rounded={"full"}
                                        shadow={"sm"}
                                    >
                                        <LuPlus size={80} color="#CBD5E0" />
                                    </Box>
                                </Box>
                            </Box>
                            <Card.Body
                                p={4}
                                bg={"white"}
                                w="full"
                            >
                                <Flex direction="column" align="flex-start">
                                    <Heading 
                                        fontSize={"xl"} 
                                        mb={1}
                                        color={"black"}
                                    >
                                        Thêm Giới mới
                                    </Heading>
                                    <Text fontSize={"sm"} color={"gray.500"}>
                                        Sinh vật mới, kiến thức mới
                                    </Text>
                                </Flex>
                            </Card.Body>
                        </Card.Root>
                    </GridItem>
                </Grid>
            </Box>
        </Box>
    );
};