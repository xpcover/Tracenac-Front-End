import { axiosInstance } from "@/config/axiosInstance";

export default class ApiService {
    static async get(url: string, params?: Record<string, string>) {
        try {
            const response = await axiosInstance.get(url,params);
            return response?.data?.msg || []
        } catch (error) {
            console.log("API SERVICE ERR: ", error)
            throw error
        }
    }

    static async post(url: string, data: any) {
        try {
            const response = await axiosInstance.post(url, data);
            return response?.data?.msg || []
        } catch (error) {
            console.log("API SERVICE ERR: ", error)
            throw error
        }
    }
}