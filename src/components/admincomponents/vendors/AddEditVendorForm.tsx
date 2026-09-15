import { FormEvent, useState } from "react";
import { Vendor, VendorFormValues, VendorStatus } from "./vendor.types";

type Props = {
  initialValues?: Vendor | null;
  formId: string;
  branchId: number;
  onSubmit: (values: VendorFormValues) => void;
};

export default function AddEditVendorForm({
  initialValues,
  formId,
  branchId,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<VendorFormValues>({
    branch_id: initialValues?.branch_id || branchId,
    first_name: initialValues?.first_name || "",
    last_name: initialValues?.last_name || "",
    company_name: initialValues?.company_name || "",
    name: initialValues?.name || "",
    email: initialValues?.email || "",
    phone: initialValues?.phone || "",
    address: initialValues?.address || "",
    opening_balance: initialValues?.opening_balance ?? 0,
    status: initialValues?.status || "ACTIVE",
  });

  const update = <K extends keyof VendorFormValues>(
    key: K,
    value: VendorFormValues[K],
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
          First Name <span className="text-red-600">*</span>
          <input
            required
            value={values.first_name}
            onChange={(event) => update("first_name", event.target.value)}
            placeholder="e.g. Emmanuel"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Last Name <span className="text-red-600">*</span>
          <input
            required
            value={values.last_name}
            onChange={(event) => update("last_name", event.target.value)}
            placeholder="e.g. Soligbo"
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Vendor Name <span className="text-red-600">*</span>
          <input
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Vendor display name"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Company Name
          <input
            value={values.company_name}
            onChange={(event) => update("company_name", event.target.value)}
            placeholder="e.g. Profeworld"
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Email <span className="text-red-600">*</span>
          <input
            required
            type="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="e.g. vendor@example.com"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Phone <span className="text-red-600">*</span>
          <input
            required
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="e.g. +2348148115883"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Address
        <textarea
          value={values.address}
          onChange={(event) => update("address", event.target.value)}
          rows={3}
          placeholder="Optional address"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Opening Balance
          <input
            type="number"
            step="0.01"
            value={values.opening_balance}
            onChange={(event) => update("opening_balance", Number(event.target.value))}
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            value={values.status}
            onChange={(event) => update("status", event.target.value as VendorStatus)}
            className={`${inputClass} bg-white`}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>
      </div>
    </form>
  );
}
