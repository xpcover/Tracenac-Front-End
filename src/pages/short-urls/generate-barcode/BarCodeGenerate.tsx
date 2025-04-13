import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import JsBarcode from "jsbarcode";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type FontOptions = {
  bold: boolean;
  italic: boolean;
};

type BarcodeSettings = {
  value: string;
  format: string;
  width: number;
  height: number;
  margin: number;
  background: string;
  lineColor: string;
  displayValue: boolean;
  textAlign: "left" | "center" | "right";
  font: string;
  fontOptions: FontOptions;
  fontSize: number;
  textMargin: number;
};

const BarcodeGenerator: React.FC = () => {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [settings, setSettings] = useState<BarcodeSettings>({
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
  });

  const fontOptions: string[] = ["monospace", "Arial", "Helvetica", "Times New Roman"];
  const formatOptions: string[] = ["CODE128", "EAN13", "MSI", "Pharmacode", "Codabar", "UPC", "CODE39", "ITF"];

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, settings.value, {
        format: settings.format,
        width: settings.width,
        height: settings.height,
        margin: settings.margin,
        background: settings.background,
        lineColor: settings.lineColor,
        displayValue: settings.displayValue,
        textAlign: settings.textAlign,
        font: settings.font,
        fontOptions: settings.fontOptions.bold ? "bold" : settings.fontOptions.italic ? "italic" : "normal",
        fontSize: settings.fontSize,
        textMargin: settings.textMargin,
      });
    }
  }, [settings]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleFontOptionChange = (option: keyof FontOptions) => {
    setSettings({
      ...settings,
      fontOptions: {
        ...settings.fontOptions,
        [option]: !settings.fontOptions[option],
      },
    });
  };

  const handleSliderChange = (value: number | number[], key: keyof BarcodeSettings) => {
    if (typeof value === "number") {
      setSettings({ ...settings, [key]: value });
    }
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
            {settings.format} {settings.format === "CODE128" && "auto"}
          </p>
        </div>

        {/* Settings Panel */}
        <div className="gap-5 grid grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode Value</label>
            <Input
              name="value"
              value={settings.value}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              name="format"
              value={settings.format}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {formatOptions.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bar Width: {settings.width}
            </label>
            <Slider
              min={1}
              max={5}
              step={0.1}
              value={settings.width}
              onChange={(value) => handleSliderChange(value, "width")}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height: {settings.height}
            </label>
            <Slider
              min={50}
              max={200}
              step={1}
              value={settings.height}
              onChange={(value) => handleSliderChange(value, "height")}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margin: {settings.margin}
            </label>
            <Slider
              min={0}
              max={20}
              step={1}
              value={settings.margin}
              onChange={(value) => handleSliderChange(value, "margin")}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
              <Input
                type="color"
                name="background"
                value={settings.background}
                onChange={handleInputChange}
                className="w-full h-10 p-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Line Color</label>
              <Input
                type="color"
                name="lineColor"
                value={settings.lineColor}
                onChange={handleInputChange}
                className="w-full h-10 p-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Show text</label>
            <div className="flex space-x-4">
              <Button
                variant={settings.displayValue ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSettings({ ...settings, displayValue: true })}
              >
                Show
              </Button>
              <Button
                variant={!settings.displayValue ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSettings({ ...settings, displayValue: false })}
              >
                Hide
              </Button>
            </div>
          </div>

          {settings.displayValue && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
                <div className="flex space-x-4">
                  {(["left", "center", "right"] as const).map((align) => (
                    <Button
                      key={align}
                      variant={settings.textAlign === align ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, textAlign: align })}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
                <select
                  name="font"
                  value={settings.font}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Options</label>
                <div className="flex space-x-4">
                  <Button
                    variant={settings.fontOptions.bold ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleFontOptionChange("bold")}
                  >
                    Bold
                  </Button>
                  <Button
                    variant={settings.fontOptions.italic ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleFontOptionChange("italic")}
                  >
                    Italic
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Size: {settings.fontSize}
                </label>
                <Slider
                  min={10}
                  max={40}
                  step={1}
                  value={settings.fontSize}
                  onChange={(value) => handleSliderChange(value, "fontSize")}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Margin: {settings.textMargin}
                </label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={settings.textMargin}
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