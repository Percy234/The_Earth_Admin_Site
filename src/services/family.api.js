import APP_CONFIG from "../config/app.config";
import axios from "axios";

const FAMILY_API = {
    createFamily: async (familyData) => {
        try {
            const response = await axios.post(`${APP_CONFIG.BASE_API}/families`, familyData);
            return response.data;
        } catch (error) {
            console.log("Lỗi tạo họ mới:", error);
            throw error;
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${APP_CONFIG.BASE_API}/families`);
            return response.data;
        } catch (error) {
            console.log("Lỗi lấy danh sách họ:", error);
            throw error;
        }
    },
    uploadThumbnail: async (file) => {
        try {
            const formData = new FormData();
            formData.append("family-thumbnail", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/families/upload-thumbnail`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload thumbnail họ:", error);
            throw error;
        }
    },
    uploadBackground: async (file) => {
        try {
            const formData = new FormData();
            formData.append("family-background", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/families/upload-background`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload background họ:", error);
            throw error;
        }
    },
    uploadBlockImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append("family-block-image", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/families/upload-block-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload block image họ:", error);
            throw error;
        }
    },
    deleteFamily: async (id) => {
        try {
            const response = await axios.delete(`${APP_CONFIG.BASE_API}/families/${id}`);
            return response.data;
        } catch (error) {
            console.log("Lỗi xóa họ:", error);
            throw error;
        }
    },
    updateFamily: async (id, familyData) => {
        try {
            const response = await axios.put(`${APP_CONFIG.BASE_API}/families/${id}`, familyData);
            return response.data;
        } catch (error) {
            console.log("Lỗi cập nhật họ:", error);
            throw error;
        }
    }
};

export default FAMILY_API;
