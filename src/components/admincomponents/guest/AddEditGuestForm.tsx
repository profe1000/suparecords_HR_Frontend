import { FormEvent, useState } from "react";
import { Guest, GuestFormValues } from "./guest.types";

type Props = {
  initialValues?: Guest | null;
  formId: string;
  onSubmit: (values: GuestFormValues) => void;
};

export default function AddEditGuestForm({
  initialValues,
  formId,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<GuestFormValues>({
    first_name: initialValues?.first_name || "",
    last_name: initialValues?.last_name || "",
    email: initialValues?.email || "",
    phone: initialValues?.phone || "",
    gender: initialValues?.gender || "",
    date_of_birth: initialValues?.date_of_birth || "",
    nationality: initialValues?.nationality || "",
    country: initialValues?.country || "",
    state: initialValues?.state || "",
    city: initialValues?.city || "",
    address: initialValues?.address || "",
    id_type: initialValues?.id_type || "",
    id_number: initialValues?.id_number || "",
    profile_image: initialValues?.profile_image || "",
    email_verified: initialValues?.email_verified || false,
    phone_verified: initialValues?.phone_verified || false,
    opening_balance: initialValues?.opening_balance || "0.00",
  });

  const update = <K extends keyof GuestFormValues>(
    key: K,
    value: GuestFormValues[K],
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
          First name <span className="text-red-600">*</span>
          <input
            required
            value={values.first_name}
            onChange={(event) => update("first_name", event.target.value)}
            placeholder="e.g. Adaeze"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Last name <span className="text-red-600">*</span>
          <input
            required
            value={values.last_name}
            onChange={(event) => update("last_name", event.target.value)}
            placeholder="e.g. Okafor"
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
            placeholder="e.g. adaeze@example.com"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Phone number <span className="text-red-600">*</span>
          <input
            required
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="e.g. +234 803 555 0193"
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Gender
          <select
            value={values.gender}
            onChange={(event) => update("gender", event.target.value)}
            className={`${inputClass} bg-white`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Date of birth
          <input
            type="date"
            value={values.date_of_birth}
            onChange={(event) => update("date_of_birth", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Nationality <span className="text-red-600">*</span>
          <input
            required
            value={values.nationality}
            onChange={(event) => update("nationality", event.target.value)}
            placeholder="e.g. NG"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Country
          <input
            value={values.country}
            onChange={(event) => update("country", event.target.value)}
            placeholder="e.g. Nigeria"
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          State
          <input
            value={values.state}
            onChange={(event) => update("state", event.target.value)}
            placeholder="e.g. Delta"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          City
          <input
            value={values.city}
            onChange={(event) => update("city", event.target.value)}
            placeholder="e.g. Warri"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Address
        <input
          value={values.address}
          onChange={(event) => update("address", event.target.value)}
          placeholder="e.g. My Street"
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          ID type
          <input
            value={values.id_type}
            onChange={(event) => update("id_type", event.target.value)}
            placeholder="e.g. National Id"
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          ID number
          <input
            value={values.id_number}
            onChange={(event) => update("id_number", event.target.value)}
            placeholder="e.g. 20020202002"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Profile image URL
        <input
          value={values.profile_image}
          onChange={(event) => update("profile_image", event.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={values.email_verified}
            onChange={(event) => update("email_verified", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Email verified
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={values.phone_verified}
            onChange={(event) => update("phone_verified", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Phone verified
        </label>
      </div>
    </form>
  );
}