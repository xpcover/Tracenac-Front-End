import { axiosInstance } from "@/config/axiosInstance";

export class dataTableService {
  static fetchAllData = async (url: string,params?: Record<string, string>) => {
    try {
      const response = await axiosInstance.get(url,{params});
      return response.data?.msg;
    } catch (error: unknown) {
      console.log("DATA TABLE ERR:",error)  
      throw error;
    }
  };

  static fetchSingleData = async (url: string) => {
    try {
      const response = await axiosInstance.get(url);
      return response.data?.msg;
    } catch (error: unknown) {
      console.log("DATA TABLE ERR:",error)  
      throw error;
    }
  };

  static deleteData = async (url: string) => {
    try {
      const response = await axiosInstance.delete(url);
      return response.data?.msg;
    } catch (error: unknown) {
      console.log("DATA TABLE ERR:",error)  
      throw error;
    }
  };

  static updateData = async (url: string,data: Record<string, string>) => {
    try {
      const response = await axiosInstance.put(url,data);
      return response.data?.msg;
    } catch (error: unknown) {
      console.log("DATA TABLE ERR:",error)  
      throw error;
    }
  };

  static createData = async (url: string,data: Record<string, string>) => {
    try {
      const response = await axiosInstance.post(url,data);
      return response.data?.msg;
    } catch (error: unknown) {
      console.log("DATA TABLE ERR:",error)  
      throw error;
    }
  };
}
