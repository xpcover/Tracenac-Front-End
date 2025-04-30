import { axiosInstance } from "@/config/axiosInstance";

export class ReportService {
  static async getReportTypes() {
    try {
      const response = await axiosInstance.get("/report/report-type");
      return response.data?.data;
    } catch (error) {
      console.error("Error fetching report types:", error);
      throw error;
    }
  }

  static async addReportType(data: any) {
    try {
      const response = await axiosInstance.post("/report/report-type", data);
      return response.data?.data;
    } catch (error) {
      console.error("Error adding report type:", error);
      throw error;
    }
  }

  static async getReasons(reportTypeId: string) {
    try {
      const response = await axiosInstance.get(
        `/assets/reasons/${reportTypeId}`
      );
      return response.data?.data;
    } catch (error) {
      console.error("Error fetching reasons:", error);
      return []
    }
  }

  static async getCategories() {
    try {
      const response = await axiosInstance.get("/category");
      return response.data?.msg;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  static async createReport(data: any) {
    try {
      const response = await axiosInstance.post(
        "/assets/report-template",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating report template:", error);
      throw error;
    }
  }
}
