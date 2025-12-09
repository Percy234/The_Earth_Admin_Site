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
            formData.append("kingdom-img", file);
            const response = await axios.post(`${APP_CONFIG.BASE_API}/kingdoms/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
}

export default KINGDOM_API;