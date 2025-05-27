import Button from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/Table";
import { createColumnHelper } from "@tanstack/react-table";

function PackChain() {
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("levels", {
      header: "Levels",
      cell: (info) => (
        <span className="truncate max-w-xs block">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("businessUnit", {
      header: "Packing Type",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("location", {
      header: "Description",
      cell: (info) => <p>{info.getValue()}</p>,
    }),
    columnHelper.accessor("businessUnit", {
      header: "QTY of Lower Level",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("businessUnit", {
      header: "Parents",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("businessUnit", {
      header: "Packing Code",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("businessUnit", {
      header: "Edit",
      cell: () => <Button variant="ghost">Edit</Button>,
    }),
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        title="Pack Chain"
        description="Create a Mapping of Boxes for tracking"
        />
      {/* <DataTable
        columns={columns}
        // url="/shortcode/url-shortner"
      /> */}
    </div>
  );
}

export default PackChain;
