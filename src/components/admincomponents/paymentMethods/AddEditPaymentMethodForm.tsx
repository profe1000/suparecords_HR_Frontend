import { FormEvent, useState } from "react";
import {
  PaymentMethod,
  PaymentMethodFormValues,
  PaymentMethodStatus,
} from "./paymentMethod.types";

type Props = {
  initialValues?: PaymentMethod | null;
  formId: string;
  branchId: number;
  onSubmit: (values: PaymentMethodFormValues) => void;
};

export default function AddEditPaymentMethodForm({
  initialValues,
  formId,
  branchId,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<PaymentMethodFormValues>({
    branch_id: initialValues?.branch_id || branchId,
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    type: initialValues?.type || "",
    is_default: initialValues?.is_default || false,
    status: initialValues?.status || "ACTIVE",
  });

  const update = <K extends keyof PaymentMethodFormValues>(
    key: K,
    value: PaymentMethodFormValues[K],
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Name <span className="text-red-600">*</span>
          <input
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="e.g. Cash"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Type <span className="text-red-600">*</span>
          <input
            required
            value={values.type}
            onChange={(event) => update("type", event.target.value)}
            placeholder="e.g. cash"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          rows={3}
          placeholder="Optional description"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            value={values.status}
            onChange={(event) => update("status", event.target.value as PaymentMethodStatus)}
            className={`${inputClass} bg-white`}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>

        <label className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-700 sm:mt-8">
          <input
            type="checkbox"
            checked={values.is_default}
            onChange={(event) => update("is_default", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Set as default
        </label>
      </div>
    </form>
  );
}
