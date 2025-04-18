import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import JsBarcode from "jsbarcode";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// Define Zod schema for validation
const barcodeSchema = z.object({
  value: z.string().min(1, "Barcode value is required"),
  format: z.string().min(1, "Format is required"),
  width: z.number().min(0.1).max(5),
  height: z.number().min(10).max(500),
  margin: z.number().min(0).max(50),
  background: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  lineColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  displayValue: z.boolean(),
  textAlign: z.enum(["left", "center", "right"]),
  font: z.string().min(1, "Font is required"),
  fontOptions: z.object({
    bold: z.boolean(),
    italic: z.boolean(),
  }),
  fontSize: z.number().min(8).max(72),
  textMargin: z.number().min(0).max(50),
});

type BarcodeSettings = z.infer<typeof barcodeSchema>;

const fontOptions: string[] = ["monospace", "Arial", "Helvetica", "Times New Roman"];
const formatOptions: string[] = [
  "CODE128",
  "EAN13",
  "MSI",
  "Pharmacode",
  "Codabar",
  "UPC",
  "CODE39",
  "ITF",
];

const BarcodeGenerator: React.FC = () => {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string>("");
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BarcodeSettings>({
    resolver: zodResolver(barcodeSchema),
    defaultValues: {
      value: "1234",
      format: "CODE128",
      width: 2,
      height: 100,
      margin: 3,
      background: "#FFFFFF",
      lineColor: "#000000",
      displayValue: true,
      textAlign: "center",
      font: "monospace",
      fontOptions: {
        bold: false,
        italic: false,
      },
      fontSize: 20,
      textMargin: 0,
    },
    mode: "onChange",
  });

  // Watch all form values
  const formValues = watch();

  // Generate barcode whenever form values change
  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, formValues.value, {
          format: formValues.format,
          width: formValues.width,
          height: formValues.height,
          margin: formValues.margin,
          background: formValues.background,
          lineColor: formValues.lineColor,
          displayValue: formValues.displayValue,
          textAlign: formValues.textAlign,
          font: formValues.font,
          fontOptions: formValues.fontOptions.bold
            ? "bold"
            : formValues.fontOptions.italic
            ? "italic"
            : "normal",
          fontSize: formValues.fontSize,
          textMargin: formValues.textMargin,
        });
      } catch (error: any) {
        console.error("Barcode generation error:", error);
        setError(error.message)
      }
    }
  }, [formValues]);

  const handleSliderChange = (value: number | number[], key: keyof BarcodeSettings) => {
    if (typeof value === "number") {
      setValue(key, value, { shouldValidate: true });
    }
  };

  const handleFontOptionChange = (option: keyof BarcodeSettings["fontOptions"]) => {
    setValue(
      "fontOptions",
      {
        ...formValues.fontOptions,
        [option]: !formValues.fontOptions[option],
      },
      { shouldValidate: true }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Barcode Generator</h1>

      <div className="grid grid-cols-1 gap-8">
        {/* Barcode Preview */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex flex-col items-center">
          <div className="bg-white p-4 rounded border border-gray-300 mb-2">
            <svg ref={barcodeRef} className="w-full" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {formValues.format} {formValues.format === "CODE128" && "auto"}
          </p>
          {(error || errors.value) && (
            <p className="text-red-500 text-sm mt-2">{errors.value.message}</p>
          )}
        </div>

        {/* Settings Panel */}
        <div className="gap-5 grid grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barcode Value
            </label>
            <Input
              {...register("value")}
              error={errors.value?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              {...register("format")}
              className={`w-full px-3 py-2 border ${
                errors.format ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              {formatOptions.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
            {errors.format && (
              <p className="text-red-500 text-xs mt-1">{errors.format.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bar Width: {formValues.width}
            </label>
            <Slider
              min={1}
              max={5}
              step={0.1}
              value={formValues.width}
              onChange={(value) => handleSliderChange(value, "width")}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height: {formValues.height}
            </label>
            <Slider
              min={50}
              max={200}
              step={1}
              value={formValues.height}
              onChange={(value) => handleSliderChange(value, "height")}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margin: {formValues.margin}
            </label>
            <Slider
              min={0}
              max={20}
              step={1}
              value={formValues.margin}
              onChange={(value) => handleSliderChange(value, "margin")}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background
              </label>
              <Input
                type="color"
                {...register("background")}
                className="w-full h-10 p-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line Color
              </label>
              <Input
                type="color"
                {...register("lineColor")}
                className="w-full h-10 p-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Show text
            </label>
            <div className="flex space-x-4">
              <Button
                variant={formValues.displayValue ? "primary" : "secondary"}
                size="sm"
                onClick={() => setValue("displayValue", true, { shouldValidate: true })}
              >
                Show
              </Button>
              <Button
                variant={!formValues.displayValue ? "primary" : "secondary"}
                size="sm"
                onClick={() => setValue("displayValue", false, { shouldValidate: true })}
              >
                Hide
              </Button>
            </div>
          </div>

          {formValues.displayValue && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Align
                </label>
                <div className="flex space-x-4">
                  {(["left", "center", "right"] as const).map((align) => (
                    <Button
                      key={align}
                      variant={formValues.textAlign === align ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setValue("textAlign", align, { shouldValidate: true })}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font
                </label>
                <select
                  {...register("font")}
                  className={`w-full px-3 py-2 border ${
                    errors.font ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  {fontOptions.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
                {errors.font && (
                  <p className="text-red-500 text-xs mt-1">{errors.font.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Options
                </label>
                <div className="flex space-x-4">
                  <Button
                    variant={formValues.fontOptions.bold ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleFontOptionChange("bold")}
                  >
                    Bold
                  </Button>
                  <Button
                    variant={formValues.fontOptions.italic ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleFontOptionChange("italic")}
                  >
                    Italic
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Size: {formValues.fontSize}
                </label>
                <Slider
                  min={10}
                  max={40}
                  step={1}
                  value={formValues.fontSize}
                  onChange={(value) => handleSliderChange(value, "fontSize")}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Margin: {formValues.textMargin}
                </label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={formValues.textMargin}
                  onChange={(value) => handleSliderChange(value, "textMargin")}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;