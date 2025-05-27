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

    static async getSingle(url: string) {
        try {
            const response = await axiosInstance.get(url);
            return response?.data?.msg
        } catch (error) {
            console.log("API SERVICE ERR: ", error)
            throw error
        }
    }
    static async getAll(url: string, params?: Record<string, string>) {
        try {
            const response = await axiosInstance.get(url,params);
            return response?.data || []
        } catch (error) {
            console.log("API SERVICE ERR: ", error)
            throw error
        }
    }

    static async put(url: string, data: any) {
        try {
            const response = await axiosInstance.put(url, data);
            return response?.data
        } catch (error) {
            console.log("API SERVICE ERR: ", error)
            throw error
        }
    }

    static async delete(url: string) {
        try {
            const response = await axiosInstance.delete(url);
            return response?.data
        } catch (error) {
            console.log("API SERVICE ERR: ", error)
            throw error
        }
    }

    static async post(url: string, data: any) {
        try {
            const response = await axiosInstance.post(url, data);
            return response?.data
        } catch (error) {
            console.log("API SERVICE ERR: ", error)
            throw error
        }
    }
}