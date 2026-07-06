import APP_CONFIG from "../config/app.config"
import axios from "axios";

const PHYLUM_API = {
    createPhylum: async (phylumData) => {
        try {
            const response = await axios.post(`${APP_CONFIG.BASE_API}/phylums`, phylumData);
            return response.data;
        } catch (error) {
            console.log("Lỗi tạo ngành mới:", error);
            throw error;
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${APP_CONFIG.BASE_API}/phylums`);
            return response.data;
        } catch (error) {
            console.log("Lỗi lấy danh sách ngành:", error);
            throw error;
        }
    },
    uploadThumbnail: async (file) => {
        try {
            const formData = new FormData();
            formData.append("phylum-thumbnail", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/phylums/upload-thumbnail`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload thumbnail ngành:", error);
            throw error;
        }
    },
    uploadBackground: async (file) => {
        try {
            const formData = new FormData();
            formData.append("phylum-background", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/phylums/upload-background`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload background ngành:", error);
            throw error;
        }
    },
    uploadBlockImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append("phylum-block-image", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/phylums/upload-block-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload block image ngành:", error);
            throw error;
        }
    },
    deletePhylum: async (id) => {
        try {
            const response = await axios.delete(`${APP_CONFIG.BASE_API}/phylums/${id}`);
            return response.data;
        } catch (error) {
            console.log("Lỗi xóa ngành:", error);
            throw error;
        }
    },
    updatePhylum: async (id, phylumData) => {
        try {
            const response = await axios.put(`${APP_CONFIG.BASE_API}/phylums/${id}`, phylumData);
            return response.data;
        } catch (error) {
            console.log("Lỗi cập nhật ngành:", error);
            throw error;
        }
    }
}

export default PHYLUM_API;
