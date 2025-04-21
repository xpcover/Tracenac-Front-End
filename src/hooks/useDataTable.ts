import { dataTableService } from "@/services/dataTable.service";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDataTable = () => {
  const createData: UseMutationResult<
    any,
    AxiosError,
    { url: string; data: Record<string, string> },
    unknown
  > = useMutation({
    mutationFn: ({ url, data }) => dataTableService.createData(url, data),
  });

  const updateData: UseMutationResult<
    any,
    AxiosError,
    { url: string; data: Record<string, string> },
    unknown
  > = useMutation({
    mutationFn: ({ url, data }) => dataTableService.updateData(url, data),
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
