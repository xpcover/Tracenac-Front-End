import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import ApiService from "@/services/api.service";
import toast from "react-hot-toast";

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
  redirectUrls: z.array(
    z.object({
      url: z.string().url("Invalid URL format"),
      startDate: z.string(),
      expiryDate: z.string().refine((val) => new Date(val) > new Date(), {
        message: "Expiry date must be in the future",
      }),
    })
  ),
  generateQr: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

function EditShortURLPage() {
  const navigate = useNavigate();

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

  const {
    fields,
    append: appendKeyValue,
    remove,
  } = useFieldArray({
    control,
    name: "params",
  });

  const {
    fields: redirectFields,
    append: appendRedirect,
    remove: removeRedirect,
  } = useFieldArray({
    control,
    name: "redirectUrls",
  });

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
      navigate("/short-urls");
    },
    onError: () => {
      toast.error("Failed to create short URL");
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Handle form submission
  };

  const handleAddRedirect = () => {
    const lastRedirect =
      watch("redirectUrls")[watch("redirectUrls").length - 1];
    appendRedirect({
      url: "",
      startDate: lastRedirect.expiryDate,
      expiryDate: format(
        new Date(new Date(lastRedirect.expiryDate).getTime() + 86400000), // +1 day
        "yyyy-MM-dd'T'HH:mm"
      ),
    });
  };

  return (
    <div>
      <PageHeader
        title="Edit Short URL"
        description="Edit multiple shortened URLs at once"
      >
        <Button variant="ghost" onClick={() => navigate("/short-urls")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Short URLs
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
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
          <div>
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
            <div className="flex justify-end">
              <Button
                type="button"
                className="mt-3"
                onClick={() => appendKeyValue({ key: "", value: "" })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Key Value Pair
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" className="mt-3" onClick={handleAddRedirect}>
              <Plus className="w-4 h-4 mr-2" />
              Add Redirect URL
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-3">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center border border-gray-200 rounded-md p-5 relative"
              >
                <Input
                  {...register(`params.${index}.key`)}
                  placeholder="Key"
                  error={errors.params?.[index]?.key?.message}
                  label="Parameter Key"
                />
                <Input
                  {...register(`params.${index}.value`)}
                  placeholder="Value"
                  error={errors.params?.[index]?.value?.message}
                  label="Parameter Value"
                />
                <div className="flex items-center gap-3 absolute top-2 right-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id={`isUrl-${index}`}
                      {...register(`params.${index}.isUrl`)}
                      className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`isUrl-${index}`}
                      className="text-xs text-gray-700"
                    >
                      URL
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id={`isPage-${index}`}
                      {...register(`params.${index}.isPage`)}
                      className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`isPage-${index}`}
                      className="text-xs text-gray-700"
                    >
                      Page
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => fields.length > 1 && remove(index)}
                    disabled={fields.length <= 1}
                  >
                    <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
                  </button>
                </div>
              </div>
            ))}
            <div>
                <div>
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
            </div>
          </div>

          <div className="space-y-5 flex flex-col items-end">
            {redirectFields.map((field, index) => (
              <div
                key={field.id}
                className="relative w-full border-2 p-3 rounded-lg space-y-3"
              >
                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Redirect URL
                  </label>
                  <Input
                    placeholder="Enter Redirect URL"
                    {...register(`redirectUrls.${index}.url`)}
                  />
                  {errors.redirectUrls?.[index]?.url && (
                    <ErrorMessage>
                      {errors.redirectUrls[index].url.message}
                    </ErrorMessage>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="w-full">
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Start Date
                    </label>
                    <Input
                      type="datetime-local"
                      disabled={index > 0}
                      {...register(`redirectUrls.${index}.startDate`)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <Input
                      type="datetime-local"
                      min={watch(`redirectUrls.${index}.startDate`)}
                      {...register(`redirectUrls.${index}.expiryDate`)}
                    />
                    {errors.redirectUrls?.[index]?.expiryDate && (
                      <ErrorMessage>
                        {errors.redirectUrls[index].expiryDate.message}
                      </ErrorMessage>
                    )}
                  </div>
                </div>
                {index > 0 && (
                  <Trash2
                    className="w-4 h-4 absolute right-1.5 top-1.5 cursor-pointer"
                    onClick={() => removeRedirect(index)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditShortURLPage;
