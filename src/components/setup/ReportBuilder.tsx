import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Modal } from "../ui/Modal";
import ReportTypeTable from "./ReportTypeTable";
import { ReportService } from "@/services/report.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Type definitions
interface Category {
  _id: string;
  category_name: string;
}

interface Reason {
  _id: string;
  name: string;
}

interface ReportType {
  _id: string;
  name: string;
}

// Zod validation schema
const reportSchema = z.object({
  name: z.string().min(1, "Report name is required"),
  image: z.instanceof(FileList).optional(),
  placement: z.string().min(1, "Placement is required"),
  reportFor: z.enum([
    "Customers",
    "Employees",
    "Vendors",
    "Partners",
    "Common",
  ]),
  assetCategories: z.string().min(1, "Asset category is required"),
  reason: z.string().min(1, "Reason is required"),
  reportType: z.string().min(1, "Report type is required"),
});

type ReportFormData = z.infer<typeof reportSchema>;

export function ReportBuilder() {
  const queryClient = useQueryClient();
  const [reportTypeModal, setReportTypeModal] = useState(false);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportFor: "Customers",
    },
  });

  const { data: reportTypes, isLoading: reportTypeLoading } = useQuery({
    queryKey: ["reportTypes"],
    queryFn: ReportService.getReportTypes,
  });

  const { data: reasons, isLoading: reasonLoading } = useQuery({
    queryKey: ["reasons", watch("reportType")],
    queryFn: () => ReportService.getReasons(watch("reportType")),
  });

  const { data: categories, isLoading: categoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: ReportService.getCategories,
  });

  const mutation = useMutation({
    mutationFn: ReportService.createReport,
    onSuccess: () => {
      toast.success("Report created successfully");
    },
    onError: () => {
      toast.error("Error creating report");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", "1.jpg");
  };

  const onSubmit = async (data: ReportFormData) => {
    mutation.mutate({...data,image:"1.jpg"});
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Report Name
        </label>
        <Input type="text" className="mt-1" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Report Image/Icon
        </label>
        <div className="mt-1 flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1"
            {...register("image")}
          />
        </div>
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      {/* Placement */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Placement
        </label>
        <Input type="text" className="mt-1" {...register("placement")} />
        {errors.placement && (
          <p className="mt-1 text-sm text-red-600">
            {errors.placement.message}
          </p>
        )}
      </div>

      {/* Report For */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Report for
        </label>
        <select
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...register("reportFor")}
        >
          <option value="Customers">Customers</option>
          <option value="Employees">Employees</option>
          <option value="Vendors">Vendors</option>
          <option value="Partners">Partners</option>
          <option value="Common">Common</option>
        </select>
        {errors.reportFor && (
          <p className="mt-1 text-sm text-red-600">
            {errors.reportFor.message}
          </p>
        )}
      </div>

      {/* Assets */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assets
        </label>
        <select
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...register("assetCategories")}
        >
          <option value="">Select</option>
          {categoryLoading ? (
            <option>Loading...</option>
          ) : (
            categories &&
            categories.length > 0 &&
            categories.map((category: Category) => (
              <option key={category._id} value={category._id}>
                {category?.category_name}
              </option>
            ))
          )}
        </select>
        {errors.assetCategories && (
          <p className="mt-1 text-sm text-red-600">
            {errors.assetCategories.message}
          </p>
        )}
      </div>

      {/* Report Type */}
      <div className="flex gap-4 items-end">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Report Type
          </label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...register("reportType")}
          >
            <option value="">Select</option>
            {reportTypeLoading ? (
              <option>Loading...</option>
            ) : (
              reportTypes &&
              reportTypes.length > 0 &&
              reportTypes.map((type: ReportType) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))
            )}
          </select>
          {errors.reportType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.reportType.message}
            </p>
          )}
        </div>
        <Button
          type="button"
          className="w-fit text-nowrap"
          onClick={() => setReportTypeModal(true)}
        >
          Add Report Type
        </Button>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reason
        </label>
        <select
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...register("reason")}
        >
          <option value="">Select</option>
          {reasonLoading ? (
            <option>Loading...</option>
          ) : (
            reasons &&
            reasons.length > 0 &&
            reasons.map((reason: Reason) => (
              <option key={reason._id} value={reason._id}>
                {reason.name}
              </option>
            ))
          )}
          {
            reasons?.length === 0 && (
              <option value="" disabled>No Reason Found</option>
            )
          }
        </select>
        {errors.reason && (
          <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
        )}
      </div>

      <Button type="submit" className="mt-4">
        Save Report
      </Button>

      <ReportTypeTable
        reportTypeModal={reportTypeModal}
        setReportTypeModal={setReportTypeModal}
      />
    </form>
  );
}
