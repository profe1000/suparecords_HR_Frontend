import { LoadingOutlined } from "@ant-design/icons";
import { ExpenseCategory } from "../../../apiservice/expenses-service.type";

type Props = {
  categories: ExpenseCategory[];
  loading?: boolean;
  deletingId?: number | null;
  onEdit: (category: ExpenseCategory) => void;
  onDelete: (category: ExpenseCategory) => void;
};

export default function ExpenseCategoriesList({
  categories,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  const actions = (category: ExpenseCategory) => {
    const isDeleting = deletingId === category.id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(category)}
          disabled={isDeleting}
          className="rounded-lg border border-blue-700 px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete ${category.name}?`)) onDelete(category);
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
    return <div className="py-10 text-center text-slate-500">Loading expense categories...</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
        No expense categories yet.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-3 py-4">
                  <div className="font-medium text-slate-900">{category.name}</div>
                </td>
                <td className="px-3 py-4 text-slate-700">
                  <div className="max-w-xs truncate text-sm">
                    {category.description || "-"}
                  </div>
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      category.deleted_at
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {category.deleted_at ? "Deleted" : "Active"}
                  </span>
                </td>
                <td className="px-3 py-4">{actions(category)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900">{category.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{category.description || "-"}</p>
              </div>
              <span
                className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                  category.deleted_at
                    ? "bg-rose-100 text-rose-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {category.deleted_at ? "Deleted" : "Active"}
              </span>
            </div>
            <div className="mt-4">{actions(category)}</div>
          </article>
        ))}
      </div>
    </>
  );
}
