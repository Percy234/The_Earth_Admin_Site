import APP_CONFIG from "../config/app.config";
import axios from "axios";

const SPECIES_API = {
    createSpecies: async (speciesData) => {
        try {
            const response = await axios.post(`${APP_CONFIG.BASE_API}/species`, speciesData);
            return response.data;
        } catch (error) {
            console.log("Lỗi tạo loài mới:", error);
            throw error;
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${APP_CONFIG.BASE_API}/species`);
            return response.data;
        } catch (error) {
            console.log("Lỗi lấy danh sách loài:", error);
            throw error;
        }
    },
    uploadThumbnail: async (file) => {
        try {
            const formData = new FormData();
            formData.append("species-thumbnail", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/species/upload-thumbnail`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload thumbnail loài:", error);
            throw error;
        }
    },
    uploadBackground: async (file) => {
        try {
            const formData = new FormData();
            formData.append("species-background", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/species/upload-background`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload background loài:", error);
            throw error;
        }
    },
    uploadBlockImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append("species-block-image", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/species/upload-block-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload block image loài:", error);
            throw error;
        }
    },
    deleteSpecies: async (id) => {
        try {
            const response = await axios.delete(`${APP_CONFIG.BASE_API}/species/${id}`);
            return response.data;
        } catch (error) {
            console.log("Lỗi xóa loài:", error);
            throw error;
        }
    },
    updateSpecies: async (id, speciesData) => {
        try {
            const response = await axios.put(`${APP_CONFIG.BASE_API}/species/${id}`, speciesData);
            return response.data;
        } catch (error) {
            console.log("Lỗi cập nhật loài:", error);
            throw error;
        }
    }
};

export default SPECIES_API;
