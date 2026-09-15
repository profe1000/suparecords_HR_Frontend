import { LoadingOutlined } from "@ant-design/icons";
import { LaundryItemType } from "./laundryItemType.types";

type Props = {
  itemTypes: LaundryItemType[];
  loading?: boolean;
  deletingId?: number | null;
  onEdit: (itemType: LaundryItemType) => void;
  onDelete: (itemType: LaundryItemType) => void;
};

export default function LaundryItemTypeList({ itemTypes, loading, deletingId, onEdit, onDelete }: Props) {
  const actions = (itemType: LaundryItemType) => {
    const isDeleting = deletingId === itemType.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(itemType)}
          disabled={isDeleting}
          className="rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete ${itemType.name}?`)) onDelete(itemType);
          }}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
        >
          {isDeleting && <LoadingOutlined />}
          Delete
        </button>
      </div>
    );
  };

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading laundry item types...</div>;
  }

  if (itemTypes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No laundry item types yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemTypes.map((itemType) => (
              <tr key={itemType.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-3 py-4 font-medium text-slate-900">{itemType.name}</td>
                <td className="px-3 py-4 text-slate-700">{itemType.price.toLocaleString()}</td>
                <td className="px-3 py-4">{actions(itemType)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {itemTypes.map((itemType) => (
          <article key={itemType.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{itemType.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{itemType.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4">{actions(itemType)}</div>
          </article>
        ))}
      </div>
    </>
  );
}
