import {
    Card,
    Grid,
    GridItem,
    Image,
} from "@chakra-ui/react";
import { Tooltip } from "../ui/Tooltip.jsx";

//config
import APP_CONFIG from "../../config/app.config";

export default function CardX({
    img,
    title,
    description,
    category,
}) {
    return (
        <Card.Root h={"100%"}>
        <Card.Body alignItems={"center"} justifyContent={"center"} gap="2">
            <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                <GridItem colSpan={2}>
                    <Image
                    src={`${APP_CONFIG.BASE_API}${img}`}
                    alt={title}
                    borderRadius={6}
                    />
                </GridItem>
                <GridItem colSpan={3}>
                    <Card.Title mt="2">{title}</Card.Title>
                    <Tooltip content={description}>
                        <Card.Description
                        lineClamp={2}
                        >
                            {description}
                        </Card.Description>
                    </Tooltip>
                </GridItem>
            </Grid>
        </Card.Body>
        </Card.Root>
    )
}