import { FormEvent, useEffect, useState } from "react";
import { getRooms } from "../../../apiservice/rooms-service";
import { getGuests } from "../../../apiservice/guests-service";
import { getLaundryItemTypes } from "../../../apiservice/laundry-service";
import { Room } from "../rooms/room.types";
import { Guest } from "../guest/guest.types";
import { LaundryItemType } from "./laundryItemType.types";
import { CreateLaundryOrderPayload } from "../../../apiservice/laundry-orders-service.type";

type Props = {
  formId: string;
  branchId: number;
  onSubmit: (values: CreateLaundryOrderPayload) => void;
};

type SelectedItem = {
  laundry_item_type_id: number;
  quantity: number;
  unit_price: number;
  name: string;
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export default function AddEditLaundryOrderForm({ formId, branchId, onSubmit }: Props) {
  const [roomId, setRoomId] = useState(0);
  const [guestId, setGuestId] = useState(0);
  const [notes, setNotes] = useState("");
  const [roomOptions, setRoomOptions] = useState<Room[]>([]);
  const [guestOptions, setGuestOptions] = useState<Guest[]>([]);
  const [itemTypeOptions, setItemTypeOptions] = useState<LaundryItemType[]>([]);
  const [pickedItemTypeId, setPickedItemTypeId] = useState(0);
  const [pickedQuantity, setPickedQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const inputClass =
    "mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  useEffect(() => {
    getRooms({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setRoomOptions(response.data || []))
      .catch(() => setRoomOptions([]));

    getGuests({ page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setGuestOptions(response.data || []))
      .catch(() => setGuestOptions([]));

    getLaundryItemTypes({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setItemTypeOptions(response.data || []))
      .catch(() => setItemTypeOptions([]));
  }, [branchId]);

  const addItem = () => {
    const itemType = itemTypeOptions.find((item) => item.id === pickedItemTypeId);
    if (!itemType || pickedQuantity < 1) return;

    setSelectedItems((current) => {
      const existing = current.find((item) => item.laundry_item_type_id === itemType.id);
      if (existing) {
        return current.map((item) =>
          item.laundry_item_type_id === itemType.id
            ? { ...item, quantity: item.quantity + pickedQuantity }
            : item,
        );
      }
      return [
        ...current,
        {
          laundry_item_type_id: itemType.id,
          quantity: pickedQuantity,
          unit_price: itemType.price,
          name: itemType.name,
        },
      ];
    });
    setPickedItemTypeId(0);
    setPickedQuantity(1);
  };

  const removeItem = (itemTypeId: number) => {
    setSelectedItems((current) => current.filter((item) => item.laundry_item_type_id !== itemTypeId));
  };

  const updateItemQuantity = (itemTypeId: number, quantity: number) => {
    setSelectedItems((current) =>
      current.map((item) =>
        item.laundry_item_type_id === itemTypeId ? { ...item, quantity: Math.max(quantity, 1) } : item,
      ),
    );
  };

  const total = selectedItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <form
      id={formId}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({
          branch_id: branchId,
          room_id: roomId,
          guest_id: guestId,
          notes,
          items: selectedItems.map(({ laundry_item_type_id, quantity, unit_price }) => ({
            laundry_item_type_id,
            quantity,
            unit_price,
          })),
        });
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Guest <span className="text-red-600">*</span>
          <select
            required
            value={guestId || ""}
            onChange={(event) => setGuestId(Number(event.target.value))}
            className={`${inputClass} bg-white`}
          >
            <option value="">Select a guest</option>
            {guestOptions.map((guest) => (
              <option key={guest.id} value={guest.id}>
                {guest.first_name} {guest.last_name} ({guest.email})
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Room <span className="text-red-600">*</span>
          <select
            required
            value={roomId || ""}
            onChange={(event) => setRoomId(Number(event.target.value))}
            className={`${inputClass} bg-white`}
          >
            <option value="">Select a room</option>
            {roomOptions.map((room) => (
              <option key={room.id} value={room.id}>
                Room {room.room_number} (Floor {room.floor})
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Notes
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
          placeholder="Optional instructions"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Laundry items</h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px_auto]">
          <select
            value={pickedItemTypeId || ""}
            onChange={(event) => setPickedItemTypeId(Number(event.target.value))}
            className={`${inputClass} mt-0 bg-white`}
          >
            <option value="">Select item type</option>
            {itemTypeOptions.map((itemType) => (
              <option key={itemType.id} value={itemType.id}>
                {itemType.name} ({currency(itemType.price)})
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={pickedQuantity}
            onChange={(event) => setPickedQuantity(Number(event.target.value))}
            className={`${inputClass} mt-0`}
            placeholder="Qty"
          />

          <button
            type="button"
            onClick={addItem}
            className="h-11 rounded-lg bg-slate-800 px-4 text-sm font-medium text-white transition hover:bg-slate-900"
          >
            Add item
          </button>
        </div>

        {selectedItems.length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedItems.map((item) => (
              <div
                key={item.laundry_item_type_id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{currency(item.unit_price)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateItemQuantity(item.laundry_item_type_id, Number(event.target.value))
                    }
                    className="h-9 w-20 rounded-lg border border-slate-300 px-2 text-sm outline-none focus:border-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-900">
                    {currency(item.unit_price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.laundry_item_type_id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end border-t border-slate-200 pt-3">
              <p className="text-sm font-semibold text-slate-900">Total: {currency(total)}</p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
