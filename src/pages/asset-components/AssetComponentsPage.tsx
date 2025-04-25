import { useState } from "react";
import { format } from "date-fns";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/Table";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { AssetComponent } from "@/lib/types";
import AssetComponentForm from "./AssetComponentForm";
import { useDataTable } from "@/hooks/useDataTable";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { dataTableService } from "@/services/dataTable.service";

const columnHelper = createColumnHelper<AssetComponent>();

const columns = [
  columnHelper.accessor("component_id", {
    header: "Component ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("component_name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("component_type", {
    header: "Type",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          {
            Active: "bg-green-100 text-green-800",
            InActive: "bg-gray-100 text-gray-800",
            Maintenance: "bg-yellow-100 text-yellow-800",
            Disposed: "bg-red-100 text-red-800",
          }[info.getValue()]
        }`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("purchase_date", {
    header: "Purchase Date",
    cell: (info) => format(new Date(info.getValue()), "PP"),
  }),
  columnHelper.accessor("purchase_cost", {
    header: "Purchase Cost",
    cell: (info) => (
      <span className="font-mono">
        ${" "}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => format(new Date(info.getValue()), "PP"),
  }),
];

export default function AssetComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] =
    useState<AssetComponent | null>(null);

  const handleEdit = (component: AssetComponent) => {
    setEditingComponent(component);
    setIsModalOpen(true);
  };

  const handleDelete = (component: AssetComponent) => {
    console.log("Delete component", component);
  };
  

  return (
    <div>
      <PageHeader
        title="Asset Components"
        description="Manage components and parts of assets"
        action={{
          label: "Add Component",
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        url="/assets/components"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingComponent(null);
        }}
        title={editingComponent ? "Edit Component" : "Add Component"}
      >
        <AssetComponentForm
          component={editingComponent}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </div>
  );
}
