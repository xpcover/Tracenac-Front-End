import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpFromLine,
  FileCode,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { QrCodeModal } from "../../components/modals/QrCodeModal";
import ApiService from "@/services/api.service";
import { useCallback, useState } from "react";
import Select from "react-select";
import { Modal } from "@/components/ui/Modal";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import toast from "react-hot-toast";
import UploadCSVModal from "../../components/modals/UploadCSVModal";

// Zod validation schema
const schema = z.object({
  generateQr: z.boolean().default(false),
  items: z.array(
    z.object({
      itemCode: z.string().min(1, "Item Code is required"),
      units: z.number().min(1, "Units is required"),
      supplier: z.string().min(1, "Supplier is required"),
    })
  ),
  bu: z.string().min(1, "Business Unit is required"),
  qrTemplate: z.string().optional(),
  labelType: z.string().optional(),
  labelName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AssetOption {
  value: string;
  label: string;
}

export default function CreateBulkUrlPage() {
  const navigate = useNavigate();
  const [showQrModal, setShowQrModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      generateQr: false,
      bu: "",
      items: [{ itemCode: "", units: 1, supplier: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const { data: assets, isLoading: isLoadingAssets } = useQuery({
    queryKey: ["assets"],
    queryFn: () => ApiService.get("/assets"),
  });

  const { data: businessUnits, isLoading: isLoadingBU } = useQuery({
    queryKey: ["business-unit"],
    queryFn: () => ApiService.getAll("/partner/bu"),
  });

  const { data: suppliers, isLoading: isLoadingSupplier } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => ApiService.get("/partner/suppliers"),
  });

  const createShortUrl = useMutation({
    mutationFn: (data: FormData) => ApiService.post("/generator/batch", data),
    onSuccess: (data) => {
      toast.success("Short URL created successfully");
      console.log("Short URL created:", data);
    },
    onError: (error) => {
      toast.error("Failed to create short URL");
      console.error("Error creating short URL:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    createShortUrl.mutate(data);
  };

  const totalUrls = fields.reduce(
    (sum, _, i) => sum + (watch(`items.${i}.units`) || 0),
    0
  );
  const generateQr = watch("generateQr");

  const handleLabelValue = (data: any[], val: string, lbl?: string | null) => {
    if (!data || data?.length < 1) return [];
    return data?.map((item) => ({
      value: item[val],
      label: lbl ? item[lbl] : item[val],
    }));
  };

  const handleCSVDataUpload = useCallback((
  data: Array<{
    itemCode: string;
    units: number;
    supplier: string;
  }>, 
  bu?: string
) => {
  remove();
  
  if (bu) {
    console.log("===>",bu);
    setValue('bu', businessUnits?.find((bu) => bu.value === bu));
  }
  
  data.forEach((item) => {
    append({
      itemCode: item.itemCode,
      units: item.units,
      supplier: item.supplier
    });
  });
}, [append, remove, setValue]);


  return (
    <div className="space-y-6">
      <PageHeader title="Create Bulk URL" description="Create a bulk URL">
        <Button variant="ghost" onClick={() => navigate("/bulk-urls")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bulk URLs
        </Button>
      </PageHeader>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Business Unit
              </label>
              <Controller
                name="bu"
                control={control}
                render={({ field }) => (
                  <Select
                    options={handleLabelValue(businessUnits, "bu")}
                    isLoading={isLoadingBU}
                    classNamePrefix="react-select"
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              {errors?.bu?.message && (
                <ErrorMessage>{errors.bu.message}</ErrorMessage>
              )}
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <p className="text-xs flex items-center gap-1">
                Download CSV Template <FileCode className="w-4 h-4" />
              </p>
              <Button type="button" onClick={() => setUploadModal(true)}>
                Upload CSV <ArrowUpFromLine className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p>Asset URLs</p>
                <Button
                  type="button"
                  onClick={() =>
                    append({ itemCode: "", units: 1, supplier: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Asset
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 border p-3 rounded-lg">
                  <p className="flex items-center justify-between">
                    Asset {index + 1}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </p>
                  <div className="flex flex-col xl:flex-row gap-2">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Asset Id
                      </label>
                      <Controller
                        name={`items.${index}.itemCode`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            className="react-select-container min-w-[10rem]"
                            classNamePrefix="react-select"
                            options={handleLabelValue(
                              assets,
                              "assetId",
                              "assetName"
                            )}
                            isLoading={isLoadingAssets}
                            getOptionValue={(asset: AssetOption) =>
                              asset?.value
                            }
                            getOptionLabel={(asset: AssetOption) =>
                              asset?.label
                            }
                            onChange={(selected) =>
                              field.onChange(selected?.value)
                            }
                          />
                        )}
                      />
                      {errors?.items?.[index]?.itemCode?.message && (
                        <ErrorMessage>
                          {errors.items[index]?.itemCode?.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <Input
                      label="Number Of URLs"
                      {...register(`items.${index}.units`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Please enter number of URLs"
                      type="number"
                      min="1"
                      error={errors?.items?.[index]?.units?.message}
                    />

                    <div className="space-y-1 flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Supplier
                      </label>
                      <Controller
                        name={`items.${index}.supplier`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={handleLabelValue(suppliers, "partnerName")}
                            isLoading={isLoadingSupplier}
                            onChange={(selected) =>
                              field.onChange(selected?.value)
                            }
                          />
                        )}
                      />
                      {errors?.items?.[index]?.supplier?.message && (
                        <ErrorMessage>
                          {errors.items[index]?.supplier?.message}
                        </ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <p className="text-slate-500 text-sm">
                Total URLs to generate: {totalUrls} (Maximum 100)
              </p>

              <div className="flex items-center gap-2">
                <input
                  id="generateQr"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register("generateQr")}
                />
                <label htmlFor="generateQr" className="text-sm">
                  Generate QR Codes
                </label>
              </div>

              {generateQr && (
                <>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      QR Template
                    </label>
                    <Controller
                      name="qrTemplate"
                      control={control}
                      render={({ field }) => (
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={[
                            { value: "default", label: "Default Template" },
                            { value: "minimal", label: "Minimal Design" },
                            { value: "branded", label: "Branded Template" },
                          ]}
                          value={[
                            { value: "default", label: "Default Template" },
                            { value: "minimal", label: "Minimal Design" },
                            { value: "branded", label: "Branded Template" },
                          ].find((option) => option.value === field.value)}
                          onChange={(selected) =>
                            field.onChange(selected?.value)
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Label Type
                    </label>
                    <Controller
                      name="labelType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Label Name
                    </label>
                    <Controller
                      name="labelName"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      )}
                    />
                  </div>
                </>
              )}

              <Button type="submit" disabled={createShortUrl.isPending}>
                {createShortUrl.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Create URLs
              </Button>
            </div>
            <div className="space-y-5">
              <div className="space-y-2 max-w-[80%] max-h-[50dvh] overflow-hidden">
                <p>Page Design</p>
                <img
                  src="/images/preview.png"
                  alt=""
                  className="object-cover"
                />
              </div>
              {generateQr && (
                <div className="w-[40dvh] h-[40dvh]">
                  <img
                    src="/images/preview.png"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <UploadCSVModal 
  isOpen={uploadModal} 
  setIsOpen={setUploadModal}
  onDataUpload={handleCSVDataUpload}
/>

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => {
          setShowQrModal(false);
          navigate("/short-urls");
        }}
        // url={watch("url") ?? ""}
      />
    </div>
  );
}
