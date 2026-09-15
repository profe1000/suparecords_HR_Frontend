import { FormEvent, useState } from "react";
import { RoomType, RoomTypeFormValues } from "./roomType.types";

type Props = {
  initialValues?: RoomType | null;
  formId: string;
  onSubmit: (values: RoomTypeFormValues) => void;
};

export default function AddEditRoomTypeForm({
  initialValues,
  formId,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<RoomTypeFormValues>({
    branch_id: initialValues?.branch_id || 0,
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    base_price: Number(initialValues?.base_price || 0),
    discounted_price: Number(initialValues?.discounted_price || 0),
    website_price: Number(initialValues?.website_price || 0),
    cooperate_price: Number(initialValues?.cooperate_price || 0),
    max_adults: initialValues?.max_adults || 1,
    max_children: initialValues?.max_children || 0,
    room_size: Number(initialValues?.room_size || 0),
    bed_type: initialValues?.bed_type || "",
    total_beds: initialValues?.total_beds || 1,
    feature_image: initialValues?.feature_image || "",
    feature_video_url: initialValues?.feature_video_url || "",
    images: initialValues?.images || [],
    staff_id: initialValues?.staff_id || undefined,
  });
  const update = <K extends keyof RoomTypeFormValues>(
    key: K,
    value: RoomTypeFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));
  const inputClass =
    "mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";
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
        Room type name <span className="text-red-600">*</span>
        <input
          required
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="e.g. Deluxe King"
          className={inputClass}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          rows={3}
          placeholder="Brief description of this room type"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {([
          ["base_price", "Base price (₦)"],
          ["discounted_price", "Discounted price (₦)"],
          ["website_price", "Website price (₦)"],
          ["cooperate_price", "Corporate price (₦)"],
          ["room_size", "Room size"],
        ] as const).map(([key, label]) => (
          <label key={key} className="block text-sm font-medium text-slate-700">
            {label} <span className="text-red-600">*</span>
          <input
            required
            min="0"
            type="number"
            value={values[key] || ""}
            onChange={(event) =>
              update(key, Number(event.target.value))
            }
            className={inputClass}
          />
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Maximum adults <span className="text-red-600">*</span>
          <input
            required
            min="1"
            type="number"
            value={values.max_adults}
            onChange={(event) => update("max_adults", Number(event.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Maximum children
          <input
            min="0"
            type="number"
            value={values.max_children}
            onChange={(event) => update("max_children", Number(event.target.value))}
            className={inputClass}
          />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Bed type <span className="text-red-600">*</span>
          <input
            required
            value={values.bed_type}
            onChange={(event) => update("bed_type", event.target.value)}
            placeholder="e.g. 1 King bed"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Total beds <span className="text-red-600">*</span>
          <input
            required
            min="1"
            type="number"
            value={values.total_beds}
            onChange={(event) => update("total_beds", Number(event.target.value))}
            className={inputClass}
          />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Feature image URL
          <input
            value={values.feature_image}
            onChange={(event) => update("feature_image", event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Feature video URL
          <input
            value={values.feature_video_url}
            onChange={(event) => update("feature_video_url", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      {/* Images are submitted as an array; individual image management can be added when upload endpoints are available. */}
      <input type="hidden" value={JSON.stringify(values.images)} readOnly />
    </form>
  );
}
