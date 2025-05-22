import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { QrCodeModal } from "../../components/modals/QrCodeModal";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ApiService from "@/services/api.service";

const formSchema = z.object({
  baseUrl: z.string().url("Please enter a valid URL").min(1, "URL is required"),
  customCode: z.string().optional(),
  enableParams: z.boolean().default(false),
  params: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
      isUrl: z.boolean().default(false),
      isPage: z.boolean().default(false),
    })
  ),
  generateQr: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateShortUrlPage() {
  const navigate = useNavigate();
  const [showQrModal, setShowQrModal] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseUrl: "",
      customCode: "",
      enableParams: false,
      params: [{ key: "", value: "", isUrl: false, isPage: false }],
      generateQr: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "params",
  });

  const enableParams = watch("enableParams");

  const mutate = useMutation({
    mutationFn: (data: FormValues) => {
      const apiData = {
        baseUrl: data.baseUrl,
        params: data.enableParams ? data.params : [],
        customCode: data.customCode || undefined,
        generateQr: data.generateQr,
      };
      return ApiService.post("/shortcode/url-shortner", apiData);
    },
    onSuccess: () => {
      toast.success("Short URL created successfully");
      if (watch("generateQr")) {
        setShowQrModal(true);
      } else {
        navigate("/short-urls");
      }
    },
    onError: () => {
      toast.error("Failed to create short URL");
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    mutate.mutate(data);
  };

  const addKeyValuePair = () => {
    append({ key: "", value: "", isUrl: false, isPage: false });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Short URL"
        description="Create a unique short user URL"
      >
        <Button variant="ghost" onClick={() => navigate("/short-urls")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Short URLs
        </Button>
      </PageHeader>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="col-span-2">
                <Input
                  {...register("baseUrl")}
                  label="URL to Shorten"
                  type="url"
                  placeholder="https://example.com/long/url"
                  className="w-full"
                  error={errors.baseUrl?.message}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the URL you want to retrieve. The URL must start with
                  https:// or http://
                </p>
              </div>
              <Input
                {...register("customCode")}
                type="text"
                label="Short URL"
                placeholder="Enter a short URL"
                className="w-full"
                error={errors.customCode?.message}
              />
              <Input
                {...register("customCode")}
                type="text"
                label="Custom back-half (optional)"
                placeholder="Enter a custom back-half"
                className="w-full"
                error={errors.customCode?.message}
              />
            </div>

            <div className="">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enable-params"
                  {...register("enableParams")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="enable-params"
                  className="text-sm font-medium text-gray-700"
                >
                  Add Key Value Parameters (example URL, tracking ui, affiliate
                  ID)
                </label>
              </div>

              {enableParams && (
                <>
                  <div className="flex justify-end mb-3">
                    <Button
                      type="button"
                      onClick={addKeyValuePair}
                      className="text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Key Value Pair
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border border-gray-200 rounded-md p-3"
                      >
                        <div className="md:col-span-4">
                          <Input
                            {...register(`params.${index}.key`)}
                            placeholder="Key"
                            error={errors.params?.[index]?.key?.message}
                            label="Parameter Key"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Input
                            {...register(`params.${index}.value`)}
                            placeholder="Value"
                            error={errors.params?.[index]?.value?.message}
                            label="Parameter Value"
                          />
                        </div>
                        <div className="md:col-span-3 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`isUrl-${index}`}
                              {...register(`params.${index}.isUrl`)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`isUrl-${index}`}
                              className="text-sm text-gray-700"
                            >
                              URL
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`isPage-${index}`}
                              {...register(`params.${index}.isPage`)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`isPage-${index}`}
                              className="text-sm text-gray-700"
                            >
                              Page
                            </label>
                          </div>
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => fields.length > 1 && remove(index)}
                            className="text-red-500 hover:text-red-700"
                            disabled={fields.length <= 1}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="generate-qr"
                  {...register("generateQr")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="generate-qr" className="text-sm text-gray-700">
                  Generate QR Code (10000 free every month)
                </label>
              </div>
              <Link
                to="#"
                className="text-sm text-blue-700 font-semibold underline"
              >
                Upgrade for more
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/short-urls")}
              className="px-6"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-6" disabled={mutate.isLoading}>
              {mutate.isLoading ? "Creating..." : "Create Short URL"}
            </Button>
          </div>
        </form>
      </div>

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => {
          setShowQrModal(false);
          navigate("/short-urls");
        }}
        url={watch("baseUrl")}
      />
    </div>
  );
}
