import { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Heading,
    Text,
    Button,
    HStack,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useSearchParams, useNavigate } from "react-router-dom";

import KINGDOM_API from "../../services/kingdom.api";
import PHYLUM_API from "../../services/phylum.api";
import CLASS_API from "../../services/class.api";
import ORDER_API from "../../services/order.api";
import FAMILY_API from "../../services/family.api";
import GENUS_API from "../../services/genus.api";
import { toaster } from "../../components/ui/Toaster";
import TaxonomyCard from "../../components/taxonomy/TaxonomyCard";

export default function ManageKingdoms() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [activeTab, setActiveTab] = useState("kingdom");
    const [kingdoms, setKingdoms] = useState([]);
    const [phylums, setPhylums] = useState([]);
    const [classes, setClasses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [families, setFamilies] = useState([]);
    const [genuses, setGenuses] = useState([]);
    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get("search") || "";
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "Admin | Danh Sách Phân Loài";
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resK, resP, resC, resO, resF, resG] = await Promise.all([
                KINGDOM_API.getAll(),
                PHYLUM_API.getAll(),
                CLASS_API.getAll(),
                ORDER_API.getAll(),
                FAMILY_API.getAll(),
                GENUS_API.getAll()
            ]);
            setKingdoms(resK.data || resK);
            setPhylums(resP.data || resP);
            setClasses(resC.data || resC);
            setOrders(resO.data || resO);
            setFamilies(resF.data || resF);
            setGenuses(resG.data || resG);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu phân loài:", error);
            toaster.create({
                title: "Lỗi tải dữ liệu",
                description: "Không thể kết nối đến máy chủ.",
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (type, id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa "${name}" không? Hành động này không thể hoàn tác.`)) {
            return;
        }

        try {
            let res;
            if (type === "kingdom") {
                res = await KINGDOM_API.deleteKingdom(id);
                if (res?.status === "success") setKingdoms(prev => prev.filter(item => (item._id || item.id) !== id));
            } else if (type === "phylum") {
                res = await PHYLUM_API.deletePhylum(id);
                if (res?.status === "success") setPhylums(prev => prev.filter(item => (item._id || item.id) !== id));
            } else if (type === "class") {
                res = await CLASS_API.deleteClass(id);
                if (res?.status === "success") setClasses(prev => prev.filter(item => (item._id || item.id) !== id));
            } else if (type === "order") {
                res = await ORDER_API.deleteOrder(id);
                if (res?.status === "success") setOrders(prev => prev.filter(item => (item._id || item.id) !== id));
            } else if (type === "family") {
                res = await FAMILY_API.deleteFamily(id);
                if (res?.status === "success") setFamilies(prev => prev.filter(item => (item._id || item.id) !== id));
            } else if (type === "genus") {
                res = await GENUS_API.deleteGenus(id);
                if (res?.status === "success") setGenuses(prev => prev.filter(item => (item._id || item.id) !== id));
            }

            if (res?.status === "success") {
                toaster.create({
                    title: "Xóa thành công",
                    description: res.message || `Đã xóa "${name}" thành công.`,
                    type: "success"
                });
            } else {
                toaster.create({
                    title: "Lỗi xóa dữ liệu",
                    description: res?.message || "Không thể xóa đối tượng này.",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toaster.create({
                title: "Lỗi hệ thống",
                description: error.message || "Đã xảy ra lỗi khi kết nối tới máy chủ.",
                type: "error"
            });
        }
    };

    const filterItems = (list) => {
        const query = searchKeyword.toLowerCase();
        return list.filter(item => {
            const normalName = (item.normal_name || "").toLowerCase();
            const scienceName = (item.science_name || "").toLowerCase();
            return normalName.includes(query) || scienceName.includes(query);
        });
    };

    const tabs = [
        { key: "kingdom", label: "Giới" },
        { key: "phylum", label: "Ngành" },
        { key: "class", label: "Lớp" },
        { key: "order", label: "Bộ" },
        { key: "family", label: "Họ" },
        { key: "genus", label: "Chi" },
    ];

    const getActiveData = () => {
        switch (activeTab) {
            case "kingdom":
                return {
                    list: filterItems(kingdoms),
                    emptyText: "giới",
                    getParentText: () => null,
                    editRoute: (id) => `/kingdoms/addKingdom?id=${id}`
                };
            case "phylum":
                return {
                    list: filterItems(phylums),
                    emptyText: "ngành",
                    getParentText: (p) => {
                        const kName = kingdoms.find(k => (k._id || k.id) === p.kingdom_id)?.normal_name || "Không rõ";
                        return <>Thuộc giới: <strong>{kName}</strong></>;
                    },
                    editRoute: (id) => `/phylums/addPhylum?id=${id}`
                };
            case "class":
                return {
                    list: filterItems(classes),
                    emptyText: "lớp",
                    getParentText: (c) => {
                        const pName = phylums.find(p => (p._id || p.id) === c.phylum_id)?.normal_name || "Không rõ";
                        return <>Thuộc ngành: <strong>{pName}</strong></>;
                    },
                    editRoute: (id) => `/classes/addClass?id=${id}`
                };
            case "order":
                return {
                    list: filterItems(orders),
                    emptyText: "bộ",
                    getParentText: (o) => {
                        const cName = classes.find(c => (c._id || c.id) === o.class_id)?.normal_name || "Không rõ";
                        return <>Thuộc lớp: <strong>{cName}</strong></>;
                    },
                    editRoute: (id) => `/orders/addOrder?id=${id}`
                };
            case "family":
                return {
                    list: filterItems(families),
                    emptyText: "họ",
                    getParentText: (f) => {
                        const oName = orders.find(o => (o._id || o.id) === f.order_id)?.normal_name || "Không rõ";
                        return <>Thuộc bộ: <strong>{oName}</strong></>;
                    },
                    editRoute: (id) => `/families/addFamily?id=${id}`
                };
            case "genus":
                return {
                    list: filterItems(genuses),
                    emptyText: "chi",
                    getParentText: (g) => {
                        const fName = families.find(f => (f._id || f.id) === g.family_id)?.normal_name || "Không rõ";
                        return <>Thuộc họ: <strong>{fName}</strong></>;
                    },
                    editRoute: (id) => `/genuses/addGenus?id=${id}`
                };
            default:
                return { list: [], emptyText: "dữ liệu", getParentText: () => null, editRoute: () => "" };
        }
    };

    const activeConfig = getActiveData();

    return (
        <Box>
            <Box mb={6}>
                <Heading fontSize={{ base: "3xl", md: "40px" }} color={isDark ? "white" : "#0f172a"}>
                    Danh sách phân loài
                </Heading>
            </Box>

            {/* Custom Tab Selector */}
            <HStack gap={4} mb={6} borderBottom="1px solid" borderColor={isDark ? "rgba(255,255,255,0.06)" : "#eef2f7"} pb={3}>
                {tabs.map((tab) => (
                    <Button
                        key={tab.key}
                        variant={activeTab === tab.key ? "solid" : "ghost"}
                        bg={activeTab === tab.key ? "#2a69ac" : "transparent"}
                        color={activeTab === tab.key ? "white" : (isDark ? "gray.400" : "gray.600")}
                        _hover={{ bg: activeTab === tab.key ? "#2c5282" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)") }}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </Button>
                ))}
            </HStack>

            {isLoading ? (
                <Box textAlign="center" py={12}>
                    <Text color="gray.400">Đang tải danh sách...</Text>
                </Box>
            ) : activeConfig.list.length === 0 ? (
                <Box
                    bg={isDark ? "#111a3a" : "white"}
                    p={8}
                    borderRadius="xl"
                    textAlign="center"
                    border="1px solid"
                    borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                >
                    <Text color="gray.400" fontSize="lg">
                        {searchKeyword ? `Không tìm thấy ${activeConfig.emptyText} phù hợp với từ khóa.` : `Chưa có ${activeConfig.emptyText} nào được tạo.`}
                    </Text>
                </Box>
            ) : (
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={6}>
                    {activeConfig.list.map((item) => {
                        const itemId = item._id || item.id;
                        return (
                            <TaxonomyCard
                                key={itemId}
                                item={item}
                                parentText={activeConfig.getParentText(item)}
                                onEdit={() => navigate(activeConfig.editRoute(itemId))}
                                onDelete={() => handleDelete(activeTab, itemId, item.normal_name)}
                                isDark={isDark}
                            />
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
}
