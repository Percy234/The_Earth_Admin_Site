import { useState, useEffect } from "react"
import {
    Button,
    Field,
    Fieldset,
    For,
    Input,
    NativeSelect,
    Stack,
    Grid,
    GridItem,
    Textarea,
    FileUpload,
    Icon,
    Box,
    Heading,
    Text,
} from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu"
import { useTheme } from "next-themes";

//method
import {
    provide_cell_types,
    provide_nutrition_types,
    provide_reproduction_types
} from "../../config/data.config";

//api
import KINGDOM_API from "../../services/kingdom.api";

//components
import { Toaster, toaster } from "../../components/ui/Toaster"
import { Tooltip } from "../../components/ui/Tooltip";
import TagList from "../../components/ui/TagList";


export default function AddKingdomView() {
    const { theme } = useTheme();
    const [uploadFileKey, setUploadFileKey] = useState(Date.now());
    const [templateImgUrl, setTemplateImgUrl] = useState(null);
    const [allKingdoms, setAllKingdoms] = useState([]);
    const [formData, setFormData] = useState({
        normal_name: "",
        science_name: "",
        cell_type: "",
        nutrition_mode: "",
        reproduction_type: "",
        description: "",
        thumbnail_url: null,
        background_url: null,
        theme_color: "",
    });


    //setup
    document.title = "Admin | Thêm Giới Mới";

    //hooks
    useEffect(() => {
        fetchAllKingdoms();
    }, [uploadFileKey]);




    // ============== Handlers ===================
    const fetchAllKingdoms = async () => {
        const kingdoms = await KINGDOM_API.getAll();
        // console.log(kingdoms);
        setAllKingdoms(kingdoms.data);
    };
    const submitForm = async () => {
        const message = checkFormValidity();
        if(message.length > 0){
            toaster.error({
                title: "Form không hợp lệ",
                description: `Vui lòng sửa các lỗi sau:\n${message}`,
            });
            return;
        }
        console.log(formData);
        //submit form data to server 
        const res = await KINGDOM_API.createKingdom(formData)
        toaster[res.status]({
            title: res.title,
            description: res.message,
        })

        //reset form if success
        if(res.status === "success"){
            setFormData({
                normal_name: "",
                science_name: "",
                cell_type: "",
                nutrition_mode: "",
                reproduction_type: "",
                description: "",
                thumbnail_url: null,
                background_url: null,
                theme_color: "",
            });
            setTemplateImgUrl(null);
            setUploadFileKey(Date.now());
        }
    }

    const checkFormValidity = () => {
        let message = "";
        for(let key in formData){
            if(!formData[key] || formData[key].length === 0){
                message = `- ${key} is required.\n`;
                break;
            }
        }
        return message;
    }

    //get files
    const handleFileChange = (files, type) => {
        if(files  && files.acceptedFiles.length > 0){
            //lấy file đầu tiên
            const file = files.acceptedFiles[0];

            if (type === "thumbnail") {
                //tạo URL tạm thời để hiển thị ảnh
                setTemplateImgUrl(URL.createObjectURL(file));
                //upload file lên server
                uploadKingdomThumbnail(file);
            }
            if (type === "background") {
                uploadBackground(file);
            }
        }
    }

    //upload file to server
    const uploadKingdomThumbnail = async (file) => {
        const res = await KINGDOM_API.uploadThumbnail(file);
        toaster[res.status]({
            title: res.title,
            description: res.message,
        });
        if(res.status === "success"){
            setFormData((prev) => ({
                ...prev,
                thumbnail_url: res.data.filePath,
            }));
        }
    }

    const uploadBackground = async (file) => {
        const res = await KINGDOM_API.uploadBackground(file);
        toaster[res.status]({
            title: res.title,
            description: res.message,
        });
        if(res.status === "success"){
            setFormData((prev) => ({
                ...prev,
                background_url: res.data.filePath,
            }));
        }
    }



    return (
        <Grid templateColumns="repeat(5, 1fr)" p={4} gap={6}>
            <GridItem colSpan={3}>
                <Fieldset.Root 
                border={"1px solid"}
                borderColor={theme === 'dark' ? "gray.700" : "gray.200"}
                p={4} size={"lg"} 
                maxW={"100%"}
                borderRadius={6}
                >
                    {/* label */}
                    <Stack>
                        <Fieldset.Legend
                        fontSize={"32px"}
                        textTransform={"uppercase"}
                        fontWeight={"bold"}
                        >Thêm Giới mới</Fieldset.Legend>
                        <Fieldset.HelperText>
                        Vui lòng cung cấp thông tin giới của bạn bên dưới.
                        </Fieldset.HelperText>
                    </Stack>
                    {/* content */}
                    <Fieldset.Content>
                        <Field.Root>
                            <Field.Label>Tên thường gọi</Field.Label>
                            <Input value={formData.normal_name} onChange={e => setFormData({...formData, normal_name: e.target.value})} placeholder="Nhập tên thường gọi" />
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Tên khoa học</Field.Label>
                            <Input value={formData.science_name} onChange={e => setFormData({...formData, science_name: e.target.value})} placeholder="Nhập tên khoa học" />
                        </Field.Root>
                        <Grid templateColumns={"repeat(2, 1fr)"} gap={6}>
                            <GridItem>
                                <Field.Root>
                                    <Field.Label>Loại tế bào</Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field 
                                        value={formData.cell_type}
                                        onChange={e => setFormData({...formData, cell_type: e.target.value})}>
                                            <option value={null}>Vui lòng chọn</option>
                                            <For each={[
                                                { value: "P", label: "Nhân sơ" },
                                                { value: "E", label: "Nhân thực" },
                                                { value: "B", label: "Hỗn hợp" },
                                            ]}>
                                                {(option, index) => (
                                                    <option key={index} value={option.value}>{option.label}</option>
                                                )}
                                            </For>
                                        </NativeSelect.Field>
                                    </NativeSelect.Root>
                                </Field.Root>
                            </GridItem>
                            <GridItem>
                                <Field.Root>
                                    <Field.Label>Chế độ dinh dưỡng</Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field
                                        value={formData.nutrition_mode}
                                        onChange={e => setFormData({...formData, nutrition_mode: e.target.value})}>
                                            <option value={null}>Vui lòng chọn</option>
                                            <For each={[
                                                { value: "A", label: "Tự dưỡng" },
                                                { value: "H", label: "Dị dưỡng" },
                                                { value: "M", label: "Hỗn hợp" },
                                            ]}>
                                                {(option, index) => (
                                                    <option key={index} value={option.value}>{option.label}</option>
                                                )}
                                            </For>
                                        </NativeSelect.Field>
                                    </NativeSelect.Root>
                                </Field.Root>
                            </GridItem>
                            <GridItem>
                                <Field.Root>
                                    <Field.Label>Phương thức sinh sản</Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field
                                        value={formData.reproduction_type}
                                        onChange={e => setFormData({...formData, reproduction_type: e.target.value})}>
                                            <option value={null}>Vui lòng chọn</option>
                                            <For each={[
                                                { value: "A", label: "Không hữu tính" },
                                                { value: "S", label: "Hữu tính" },
                                                { value: "B", label: "Hỗn hợp" },
                                            ]}>
                                                {(option, index) => (
                                                    <option key={index} value={option.value}>{option.label}</option>
                                                )}
                                            </For>
                                        </NativeSelect.Field>
                                    </NativeSelect.Root>
                                </Field.Root>
                            </GridItem>
                            <GridItem>
                                <Field.Root>
                                    <Field.Label>Màu chủ đề</Field.Label>
                                    <Input
                                        type="color"
                                        value={formData.theme_color}
                                        cursor="pointer"
                                        onChange={(e) =>
                                            setFormData({ ...formData, theme_color: e.target.value })
                                        }
                                        p="0"
                                        h="40px"
                                        sx={{
                                            '&::-webkit-color-swatch-wrapper': {
                                            padding: 0,
                                            },
                                            '&::-webkit-color-swatch': {
                                            border: 'none',
                                            },
                                        }}
                                    />
                                </Field.Root>
                            </GridItem>
                        </Grid>
                        <Field.Root>
                            <Field.Label>Mô tả</Field.Label>
                            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Nhập mô tả" />
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Ảnh đại diện giới</Field.Label>
                            <FileUpload.Root 
                            maxW="100%" 
                            alignItems="stretch" 
                            maxFiles={1}
                            onFileChange={(files) => handleFileChange(files, "thumbnail")}
                            key={uploadFileKey}

                            >
                            <FileUpload.HiddenInput />
                            <FileUpload.Dropzone
                                h="120px"
                                w="250px"
                            >
                                <Icon size="md" color="fg.muted">
                                <LuUpload />
                                </Icon>
                                <FileUpload.DropzoneContent>
                                <Box>Kéo và thả tệp vào đây</Box>
                                <Box color="fg.muted">Kích thước đề xuất: 630 x 630  px</Box>
                                </FileUpload.DropzoneContent>
                            </FileUpload.Dropzone>
                            <FileUpload.List />
                            </FileUpload.Root>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Ảnh nền giới</Field.Label>
                            <FileUpload.Root 
                            maxW="100%" 
                            alignItems="stretch" 
                            maxFiles={1}
                            onFileChange={(files) => handleFileChange(files, "background")}
                            key={uploadFileKey}

                            >
                            <FileUpload.HiddenInput />
                            <FileUpload.Dropzone>
                                <Icon size="md" color="fg.muted">
                                <LuUpload />
                                </Icon>
                                <FileUpload.DropzoneContent>
                                <Box>Kéo và thả tệp vào đây</Box>
                                <Box color="fg.muted">Kích thước đề xuất: 1440 x 560 px</Box>
                                </FileUpload.DropzoneContent>
                            </FileUpload.Dropzone>
                            <FileUpload.List />
                            </FileUpload.Root>
                        </Field.Root>
                        <Button 
                        onClick={submitForm}
                        mt={4} 
                        colorScheme={"teal"}>Thêm Giới</Button>
                    </Fieldset.Content>
                </Fieldset.Root>
            </GridItem>
            <GridItem colSpan={2}>
                <Box p={4} border={"1px solid"}
                borderColor={theme === 'dark' ? "gray.700" : "gray.200"}
                borderRadius={6}
                h={"100%"}
                >
                    <Toaster />
                    <Heading mb={4} fontSize={24}>Xem trước</Heading>
                    <Box 
                    border={"1px solid"}
                    borderColor={theme === 'dark' ? "gray.700" : "gray.200"}
                    borderRadius={6}
                    bgColor={theme === 'dark' ? "gray.800" : "gray.50"}
                    >
                        <Grid templateColumns={"repeat(5, 1fr)"} gap={4}>
                            <GridItem colSpan={2}>
                                {templateImgUrl && (
                                    <Box
                                    as="img"
                                    src={templateImgUrl}
                                    alt="Template"
                                    h={"100%"}
                                    objectFit={"contain"}
                                    />
                                )}
                            </GridItem>
                            <GridItem colSpan={3} p={2}>
                                <Heading>{formData.normal_name || "Chưa có tên"}</Heading>
                                <Tooltip
                                    content={formData.description || "Không có tên khoa học"}
                                >
                                    <Text 
                                    fontStyle={"italic"}
                                    fontSize={12}
                                    color={theme === 'dark' ? "gray.400" : "gray.600"}
                                    lineClamp={2}
                                    >{formData.description || "Không có mô tả nào cho giới này."}
                                    </Text>
                                </Tooltip>
                                <Box marginTop={4}>
                                    <TagList tagName="Loại tế bào" items={provide_cell_types(formData.cell_type)} />
                                    <TagList tagName="Chế độ dinh dưỡng" items={provide_nutrition_types(formData.nutrition_mode)} />
                                    <TagList tagName="Phương thức sinh sản" items={provide_reproduction_types(formData.reproduction_type)} />
                                </Box>
                            </GridItem>
                        </Grid>
                    </Box>

                    <Heading
                    fontSize={24} mt={8}
                    >Các Giới đã có
                    </Heading>
                    <Grid templateColumns={"repeat(2, 1fr)"} gap={2} mt={4}>
                        {allKingdoms.length > 0 && allKingdoms.map((kingdom, index) => {
                            return (
                                <GridItem key={index}
                                colSpan={1}>
                                    <Text>{kingdom.normal_name}</Text>
                                </GridItem>
                            )
                        })}
                    </Grid>

                </Box>
            </GridItem>
        </Grid>
    )
}