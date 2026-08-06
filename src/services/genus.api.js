import APP_CONFIG from "../config/app.config";
import axios from "axios";

const GENUS_API = {
    createGenus: async (genusData) => {
        try {
            const response = await axios.post(`${APP_CONFIG.BASE_API}/genuses`, genusData);
            return response.data;
        } catch (error) {
            console.log("Lỗi tạo chi mới:", error);
            throw error;
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${APP_CONFIG.BASE_API}/genuses`);
            return response.data;
        } catch (error) {
            console.log("Lỗi lấy danh sách chi:", error);
            throw error;
        }
    },
    uploadThumbnail: async (file) => {
        try {
            const formData = new FormData();
            formData.append("genus-thumbnail", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/genuses/upload-thumbnail`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload thumbnail chi:", error);
            throw error;
        }
    },
    uploadBackground: async (file) => {
        try {
            const formData = new FormData();
            formData.append("genus-background", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/genuses/upload-background`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload background chi:", error);
            throw error;
        }
    },
    uploadBlockImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append("genus-block-image", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/genuses/upload-block-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload block image chi:", error);
            throw error;
        }
    },
    deleteGenus: async (id) => {
        try {
            const response = await axios.delete(`${APP_CONFIG.BASE_API}/genuses/${id}`);
            return response.data;
        } catch (error) {
            console.log("Lỗi xóa chi:", error);
            throw error;
        }
    },
    updateGenus: async (id, genusData) => {
        try {
            const response = await axios.put(`${APP_CONFIG.BASE_API}/genuses/${id}`, genusData);
            return response.data;
        } catch (error) {
            console.log("Lỗi cập nhật chi:", error);
            throw error;
        }
    }
};

export default GENUS_API;
