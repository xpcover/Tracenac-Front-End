import { useCallback } from "react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

interface UploadCSVModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDataUpload: (
    data: Array<{
      itemCode: string;
      units: number;
      supplier: string;
    }>,
    bu?: string
  ) => void;
}

interface BulkURLData {
  itemCode: string;
  units: number;
  supplier: string;
  bu?: string;
}

function UploadCSVModal({
  isOpen,
  setIsOpen,
  onDataUpload,
}: UploadCSVModalProps) {
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) return;

          const workbook = XLSX.read(data, { type: "binary" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json<BulkURLData>(firstSheet);

          if (jsonData.length === 0) {
            toast.error("CSV file is empty");
            return;
          }

          // Check if all required fields are present
          const firstRow = jsonData[0];
          if (!firstRow.itemCode || !firstRow.units || !firstRow.supplier) {
            toast.error(
              "CSV is missing required fields (itemCode, units, supplier)"
            );
            return;
          }

          // Get business unit if consistent across all rows
          const businessUnit = jsonData.every(
            (item) => item.bu === jsonData[0].bu
          )
            ? jsonData[0].bu
            : undefined;

          onDataUpload(jsonData, businessUnit);
          setIsOpen(false);
          toast.success(`${jsonData.length} items imported successfully`);
        } catch (error) {
          console.error("Error parsing CSV:", error);
          toast.error("Error parsing CSV file");
        }
      };
      reader.readAsBinaryString(file);
    },
    [onDataUpload, setIsOpen]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type !== "text/csv" && !file?.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }

      const input = document.createElement("input");
      input.type = "file";
      input.files = e.dataTransfer.files;
      const event = {
        target: input,
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(event);
    },
    [handleFileUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Modal
      title="Upload CSV File"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <h3 className="font-medium">Drop files here</h3>
          <p className="text-sm text-gray-500 mt-1">Supported format: CSV.</p>
          <div className="my-2 text-sm text-gray-500">OR</div>
          <input
            type="file"
            id="csv-upload"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button asChild>
            <label htmlFor="csv-upload" className="cursor-pointer">
              Browse files
            </label>
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          <p>
            CSV should contain columns: itemCode, units, supplier (bu is
            optional)
          </p>
          <Link
            to="/bulk_url_template.csv"
            download
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Download template CSV
          </Link>
        </div>
      </div>
    </Modal>
  );
}

export default UploadCSVModal;
