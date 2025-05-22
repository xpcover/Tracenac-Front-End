import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/api.service";

const schema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  keyValuePairs: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
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
});

function BulkUrlEditPage() {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      assetId: "",
      keyValuePairs: [{ key: "", value: "" }],
      redirectUrls: [
        {
          url: "",
          startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          expiryDate: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
        },
      ],
    },
  });

  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => ApiService.get("/assets"),
  });

  const {
    fields: keyValueFields,
    append: appendKeyValue,
    remove: removeKeyValue,
  } = useFieldArray({
    control,
    name: "keyValuePairs",
  });

  const {
    fields: redirectFields,
    append: appendRedirect,
    remove: removeRedirect,
  } = useFieldArray({
    control,
    name: "redirectUrls",
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
        title="PO-12312-23213"
        description="Edit multiple shortened URLs at once"
      >
        <Button variant="ghost" onClick={() => navigate("/bulk-urls")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bulk URLs
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Asset Id
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("assetId")}
            >
              <option value="">Select Asset Id</option>
              {isLoading && (
                <option className="text-center" disabled>
                  Loading...
                </option>
              )}
              {assets?.map((asset) => (
                <option key={asset.assetId} value={asset.assetId}>
                  {asset.assetName}
                </option>
              ))}
            </select>
            {errors.assetId && (
              <ErrorMessage>{errors.assetId.message}</ErrorMessage>
            )}

            <Button
              type="button"
              className="mt-3"
              onClick={() => appendKeyValue({ key: "", value: "" })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-3">
          <div>
            {keyValueFields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col md:flex-row gap-2 relative h-fit border-2 p-3 rounded-lg mb-3"
              >
                <div className="w-full">
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Key
                  </label>
                  <Input
                    placeholder="Enter Key"
                    {...register(`keyValuePairs.${index}.key`)}
                  />
                  {errors.keyValuePairs?.[index]?.key && (
                    <ErrorMessage>
                      {errors.keyValuePairs[index].key.message}
                    </ErrorMessage>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Value
                  </label>
                  <Input
                    placeholder="Enter Value"
                    {...register(`keyValuePairs.${index}.value`)}
                  />
                  {errors.keyValuePairs?.[index]?.value && (
                    <ErrorMessage>
                      {errors.keyValuePairs[index].value.message}
                    </ErrorMessage>
                  )}
                </div>
                {index > 0 && (
                  <Trash2
                    className="w-4 h-4 absolute right-1.5 top-1.5 cursor-pointer"
                    onClick={() => removeKeyValue(index)}
                  />
                )}
              </div>
            ))}

            <div className="mt-6 flex gap-2">
              <Button type="submit" className="px-6">
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/short-urls")}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="space-y-5 flex flex-col items-end">
            <Button type="button" className="mt-3" onClick={handleAddRedirect}>
              <Plus className="w-4 h-4 mr-2" />
              Add Redirect URL
            </Button>

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

export default BulkUrlEditPage;
