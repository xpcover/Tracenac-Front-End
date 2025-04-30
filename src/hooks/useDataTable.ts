import { dataTableService } from "@/services/dataTable.service";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDataTable = (url:string) => {
  
  const createData = ({ onSuccess, onError }) => useMutation({
    mutationFn: data => dataTableService.createData(url, data),
    onSuccess: data => onSuccess(data),
    onError: error => onError(error),
  });

  const updateData = useMutation({
    mutationFn: (data) => dataTableService.updateData(url, data),
  });

  const deleteData: UseMutationResult<any, AxiosError, string, unknown> =
    useMutation({
      mutationFn: (url: string) => dataTableService.deleteData(url),
    });

  return {
    createData,
    updateData,
    deleteData,
  };
};
