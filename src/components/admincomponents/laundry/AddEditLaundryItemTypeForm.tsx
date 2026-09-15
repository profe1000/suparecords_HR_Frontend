import { FormEvent, useState } from "react";
import { LaundryItemType, LaundryItemTypeFormValues } from "./laundryItemType.types";

type Props = {
  initialValues?: LaundryItemType | null;
  formId: string;
  branchId: number;
  onSubmit: (values: LaundryItemTypeFormValues) => void;
};

export default function AddEditLaundryItemTypeForm({
  initialValues,
  formId,
  branchId,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<LaundryItemTypeFormValues>({
    branch_id: initialValues?.branch_id || branchId,
    name: initialValues?.name || "",
    price: initialValues?.price ?? 0,
  });

  const update = <K extends keyof LaundryItemTypeFormValues>(
    key: K,
    value: LaundryItemTypeFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const inputClass =
    "mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100";

  return (
    <form
      id={formId}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="space-y-4"
    >
      <label className="block text-sm font-medium text-slate-700">
        Name <span className="text-red-600">*</span>
        <input
          required
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="e.g. Shirt"
          className={inputClass}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Price <span className="text-red-600">*</span>
        <input
          required
          type="number"
          step="0.01"
          min={0}
          value={values.price}
          onChange={(event) => update("price", Number(event.target.value))}
          placeholder="e.g. 1000"
          className={inputClass}
        />
      </label>
    </form>
  );
}
