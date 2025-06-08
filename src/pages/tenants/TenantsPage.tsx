import { useState } from "react";
import { format } from "date-fns";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/Table";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Tenant } from "@/lib/types";
import TenantForm from "./TenantForm";
import { useMutation } from "@tanstack/react-query";
import { dataTableService } from "@/services/dataTable.service";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<Tenant>();

const columns = [
  columnHelper.accessor("tenantId", {
    header: "Tenant ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => format(new Date(info.getValue()), "PPp"),
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => format(new Date(info.getValue()), "PPp"),
  }),
];

export default function TenantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const createMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      dataTableService.createData("/tenant/create", data),
    onSuccess: () => {
      toast.success("Tenant created successfully");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to create Tenant");
    },
  });
  const editMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      dataTableService.createData("/tenant/create", data),
    onSuccess: () => {
      toast.success("Tenant updated successfully");
      setEditingTenant(null);
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to update Tenant");
    },
  });

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleDelete = (tenant: Tenant) => {
    // In a real app, this would make an API call
    console.log("Delete tenant:", tenant);
  };

  return (
    <div>
      <PageHeader
        title="Tenants"
        description="Manage your organization's tenants"
        action={{
          label: "Add Tenant",
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        url="/tenant/get-clients"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTenant(null);
        }}
        title={editingTenant ? "Edit Tenant" : "Add Tenant"}
      >
        <TenantForm
          tenant={editingTenant}
          onSubmit={(data) => {
            if (editingTenant) editMutation.mutate(data);
            else createMutation.mutate(data);
          }}
        />
      </Modal>
    </div>
  );
}
