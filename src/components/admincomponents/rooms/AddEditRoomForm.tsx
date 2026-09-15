import { FormEvent, useState } from "react";
import { Room, RoomFormValues } from "./room.types";
import { RoomType } from "../roomTypes/roomType.types";

type Props = {
    initialValues?: Room | null;
    formId: string;
    roomTypeOptions: RoomType[];
    branchId: number;
    onSubmit: (values: RoomFormValues) => void;
};

export default function AddEditRoomForm({ initialValues, formId, roomTypeOptions, branchId, onSubmit }: Props) {
    const [values, setValues] = useState<RoomFormValues>({
        branch_id: initialValues?.branch_id || branchId,
        room_type_id: initialValues?.room_type_id || roomTypeOptions[0]?.id || 0,
        room_number: initialValues?.room_number || "",
        floor: initialValues?.floor || "",
        status: initialValues?.status || "",
        cleaning_status: initialValues?.cleaning_status || "",
        maintenance_note: initialValues?.maintenance_note || "",
        is_active: initialValues?.is_active ?? true,
        staff_id: initialValues?.staff_id || null,
        images: initialValues?.images || [],
    });

    const update = <K extends keyof RoomFormValues>(key: K, value: RoomFormValues[K]) =>
        setValues((current) => ({ ...current, [key]: value }));
    const inputClass = "mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100";

    return (
        <form id={formId} onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSubmit(values); }} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">Room number <span className="text-red-600">*</span>
                    <input required value={values.room_number} onChange={(event) => update("room_number", event.target.value)} className={inputClass} />
                </label>
                <label className="block text-sm font-medium text-slate-700">Room type <span className="text-red-600">*</span>
                    <select required value={values.room_type_id} onChange={(event) => update("room_type_id", Number(event.target.value))} className={`${inputClass} bg-white`}>
                        {roomTypeOptions.map((roomType) => <option key={roomType.id} value={roomType.id}>{roomType.name}</option>)}
                    </select>
                </label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">Floor <span className="text-red-600">*</span>
                    <input required value={values.floor} onChange={(event) => update("floor", event.target.value)} className={inputClass} />
                </label>
                <label className="block text-sm font-medium text-slate-700">Status
                    <input value={values.status} onChange={(event) => update("status", event.target.value)} placeholder="e.g. Available" className={inputClass} />
                </label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">Cleaning status
                    <input value={values.cleaning_status} onChange={(event) => update("cleaning_status", event.target.value)} placeholder="e.g. Clean" className={inputClass} />
                </label>
                <label className="flex items-center gap-3 pt-8 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={values.is_active} onChange={(event) => update("is_active", event.target.checked)} className="h-4 w-4 accent-red-800" /> Active room
                </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">Maintenance note
                <textarea value={values.maintenance_note} onChange={(event) => update("maintenance_note", event.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100" />
            </label>
        </form>
    );
}
