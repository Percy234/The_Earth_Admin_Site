import APP_CONFIG from "../config/app.config"
import axios from "axios";

const KINGDOM_API = {
    createKingdom: async (kingdomData) => {
        try {
            const response = await axios.post(`${APP_CONFIG.BASE_API}/kingdoms`, kingdomData);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${APP_CONFIG.BASE_API}/kingdoms`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    uploadThumbnail: async (file) => {
        try {
            const formData = new FormData();
            formData.append("kingdom-thumbnail", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/kingdoms/upload-thumbnail`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    uploadBackground: async (file) => {
        try {
            const formData = new FormData();
            formData.append("kingdom-background", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/kingdoms/upload-background`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    uploadBlockImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append("kingdom-block-image", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/kingdoms/upload-block-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload block image:", error);
            throw error;
        }
    },
    deleteKingdom: async (id) => {
        try {
            const response = await axios.delete(`${APP_CONFIG.BASE_API}/kingdoms/${id}`);
            return response.data;
        } catch (error) {
            console.log("Lỗi xóa giới:", error);
            throw error;
        }
    }
}

export default KINGDOM_API;