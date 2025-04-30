import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReportService } from "@/services/report.service";
import toast from "react-hot-toast";
import { Modal } from "../ui/Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const reportTypeSchema = z.object({
  name: z.string().min(1, "Report type name is required"),
});

export type T = z.infer<typeof reportTypeSchema>;

interface ReportTypeTableProps {
  reportTypeModal: boolean;
  setReportTypeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportTypeTable = ({
  reportTypeModal,
  setReportTypeModal,
}: ReportTypeTableProps) => {

const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportTypeSchema),
  });

  const mutation = useMutation({
    mutationFn: ReportService.addReportType,
    onSuccess: () => {
      toast.success("Report type added successfully");
      setReportTypeModal(false); 
    
      queryClient.invalidateQueries(["reportTypes"]);
    },
  });

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["reportTypes"],
    queryFn: ReportService.getReportTypes,
  });

  if (isError) {
    toast.error(error?.message);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (data: T) => {
    mutation.mutate(data);
  };

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="text-start px-4 py-2 border-b">Report Types</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.length > 0 &&
          data.map((type: any) => (
            <tr key={type?.tenantId}>
              <td className="px-4 py-2 border-b">{type?.name}</td>
            </tr>
          ))}
      </tbody>
      <Modal
        isOpen={reportTypeModal}
        onClose={() => setReportTypeModal(false)}
        title="Add Report Type"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <Input
            type="text"
            label="Report Type"
            placeholder="Enter Report Type"
            {...register("name")}
          />
          {errors?.name && (
            <p className="text-red-500 mt-1">{errors?.name?.message}</p>
          )}
          <Button type="submit" className="mt-4">
            Add Report Type
          </Button>
        </form>
      </Modal>
    </table>
  );
};

export default ReportTypeTable;
