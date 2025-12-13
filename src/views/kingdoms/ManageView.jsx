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
} from "@chakra-ui/react";
import CardX from "../../components/ui/CardX";
import { useTheme } from "next-themes";

//api
import KINGDOM_API from "../../services/kingdom.api";



export default function ManageKingdoms() {
    const { theme } = useTheme();
    const [kingdoms, setKingdoms] = useState([]);

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
        p={4}
        >
            <Box
            border={"1px solid"}
            borderColor={theme === "light" ? "gray.200" : "gray.700"}
            p={4}
            borderRadius={6}
            >
                <Heading
                size="3xl"
                textTransform={"uppercase"}
                letterSpacing={2}
                borderBottom={"1px solid"}
                pb={2}
                >Quản lý giới</Heading>
                <Text
                mt={2}
                fontSize={"sm"}
                fontStyle={"italic"}
                >Xem, sửa, xóa các giới đã được thêm vào hệ thống.</Text>
            </Box>
            
            <Box
            border={"1px solid"}
            borderColor={theme === "light" ? "gray.200" : "gray.700"}
            p={4}
            borderRadius={6}
            my={2}
            >
                <Heading>Danh sách giới</Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
                    {kingdoms.map((kingdom, index) => {
                        return (
                            <GridItem key={index} colSpan={1}>
                                <CardX 
                                img={kingdom.thumbnail_url}
                                title={kingdom.normal_name}
                                description={kingdom.description}
                                />
                            </GridItem>
                        )
                    })}
                </Grid>
            </Box>
        </Box>
    );
};