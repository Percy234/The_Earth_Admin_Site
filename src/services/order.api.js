import APP_CONFIG from "../config/app.config";
import axios from "axios";

const ORDER_API = {
    createOrder: async (orderData) => {
        try {
            const response = await axios.post(`${APP_CONFIG.BASE_API}/orders`, orderData);
            return response.data;
        } catch (error) {
            console.log("Lỗi tạo bộ mới:", error);
            throw error;
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${APP_CONFIG.BASE_API}/orders`);
            return response.data;
        } catch (error) {
            console.log("Lỗi lấy danh sách bộ:", error);
            throw error;
        }
    },
    uploadThumbnail: async (file) => {
        try {
            const formData = new FormData();
            formData.append("order-thumbnail", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/orders/upload-thumbnail`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload thumbnail bộ:", error);
            throw error;
        }
    },
    uploadBackground: async (file) => {
        try {
            const formData = new FormData();
            formData.append("order-background", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/orders/upload-background`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload background bộ:", error);
            throw error;
        }
    },
    uploadBlockImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append("order-block-image", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/orders/upload-block-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload block image bộ:", error);
            throw error;
        }
    },
    deleteOrder: async (id) => {
        try {
            const response = await axios.delete(`${APP_CONFIG.BASE_API}/orders/${id}`);
            return response.data;
        } catch (error) {
            console.log("Lỗi xóa bộ:", error);
            throw error;
        }
    },
    updateOrder: async (id, orderData) => {
        try {
            const response = await axios.put(`${APP_CONFIG.BASE_API}/orders/${id}`, orderData);
            return response.data;
        } catch (error) {
            console.log("Lỗi cập nhật bộ:", error);
            throw error;
        }
    }
};

export default ORDER_API;
