import APP_CONFIG from "../config/app.config";
import axios from "axios";

const CLASS_API = {
    createClass: async (classData) => {
        try {
            const response = await axios.post(`${APP_CONFIG.BASE_API}/classes`, classData);
            return response.data;
        } catch (error) {
            console.log("Lỗi tạo lớp mới:", error);
            throw error;
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${APP_CONFIG.BASE_API}/classes`);
            return response.data;
        } catch (error) {
            console.log("Lỗi lấy danh sách lớp:", error);
            throw error;
        }
    },
    uploadThumbnail: async (file) => {
        try {
            const formData = new FormData();
            formData.append("class-thumbnail", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/classes/upload-thumbnail`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload thumbnail lớp:", error);
            throw error;
        }
    },
    uploadBackground: async (file) => {
        try {
            const formData = new FormData();
            formData.append("class-background", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/classes/upload-background`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload background lớp:", error);
            throw error;
        }
    },
    uploadBlockImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append("class-block-image", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/classes/upload-block-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Lỗi upload block image lớp:", error);
            throw error;
        }
    },
    deleteClass: async (id) => {
        try {
            const response = await axios.delete(`${APP_CONFIG.BASE_API}/classes/${id}`);
            return response.data;
        } catch (error) {
            console.log("Lỗi xóa lớp:", error);
            throw error;
        }
    },
    updateClass: async (id, classData) => {
        try {
            const response = await axios.put(`${APP_CONFIG.BASE_API}/classes/${id}`, classData);
            return response.data;
        } catch (error) {
            console.log("Lỗi cập nhật lớp:", error);
            throw error;
        }
    }
};

export default CLASS_API;
