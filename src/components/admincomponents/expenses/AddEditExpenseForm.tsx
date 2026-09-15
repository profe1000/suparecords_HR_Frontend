import { FormEvent, useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { getExpenseCategories } from "../../../apiservice/expenses-service";
import { createVendor, getVendors } from "../../../apiservice/vendors-service";
import { getStaffs } from "../../../apiservice/staff-service";
import { appZIndex } from "../../../utils/appconst";
import { ExpenseCategory } from "../../../apiservice/expenses-service.type";
import AddEditVendorForm from "../vendors/AddEditVendorForm";
import { Vendor, VendorFormValues } from "../vendors/vendor.types";
import { StaffRecord } from "../StaffLogin/staffLogin.types";
import { CreateExpensePayload, ExpenseItemParam } from "../../../apiservice/expenses-records-service.type";

type Props = {
  formId: string;
  branchId: number;
  staffId: number;
  onSubmit: (values: CreateExpensePayload) => void;
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export default function AddEditExpenseForm({ formId, branchId, staffId, onSubmit }: Props) {
  const [expenseCategoryId, setExpenseCategoryId] = useState(0);
  const [vendorId, setVendorId] = useState(0);
  const [description, setDescription] = useState("");
  const [requestedBy, setRequestedBy] = useState(staffId);
  const [categoryOptions, setCategoryOptions] = useState<ExpenseCategory[]>([]);
  const [vendorOptions, setVendorOptions] = useState<Vendor[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffRecord[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemUnitCost, setItemUnitCost] = useState(0);
  const [items, setItems] = useState<ExpenseItemParam[]>([]);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [savingVendor, setSavingVendor] = useState(false);
  const [vendorFormError, setVendorFormError] = useState("");
  const vendorFormId = "expense-quick-vendor-form";

  const inputClass =
    "mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100";

  const loadVendors = () =>
    getVendors({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setVendorOptions(response.data || []))
      .catch(() => setVendorOptions([]));

  useEffect(() => {
    getExpenseCategories({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setCategoryOptions(response.data || []))
      .catch(() => setCategoryOptions([]));

    loadVendors();

    getStaffs({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => setStaffOptions(response.data || []))
      .catch(() => setStaffOptions([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  const openVendorModal = () => {
    setVendorFormError("");
    setVendorModalOpen(true);
  };
  const closeVendorModal = () => setVendorModalOpen(false);

  const saveNewVendor = async (values: VendorFormValues) => {
    setSavingVendor(true);
    setVendorFormError("");
    try {
      const response = await createVendor(values);
      const newVendor: Vendor | undefined = response?.data || response;
      await loadVendors();
      if (newVendor?.id) {
        setVendorId(newVendor.id);
      } else {
        const refreshed = await getVendors({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" });
        const match = (refreshed.data || []).find((vendor) => vendor.email === values.email);
        if (match) setVendorId(match.id);
      }
      closeVendorModal();
    } catch (requestError: any) {
      setVendorFormError(requestError?.response?.data?.message || "Unable to add vendor.");
    } finally {
      setSavingVendor(false);
    }
  };

  const addItem = () => {
    if (!itemName.trim() || itemQuantity < 1 || itemUnitCost < 0) return;
    setItems((current) => [...current, { name: itemName.trim(), quantity: itemQuantity, unit_cost: itemUnitCost }]);
    setItemName("");
    setItemQuantity(1);
    setItemUnitCost(0);
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);

  return (
    <>
    <form
      id={formId}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({
          branch_id: branchId,
          expense_category_id: expenseCategoryId,
          vendor_id: vendorId,
          description,
          requested_by: requestedBy,
          items,
        });
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Expense category <span className="text-red-600">*</span>
          <select
            required
            value={expenseCategoryId || ""}
            onChange={(event) => setExpenseCategoryId(Number(event.target.value))}
            className={`${inputClass} bg-white`}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="block text-sm font-medium text-slate-700">
          <div className="flex items-center justify-between">
            <span>
              Vendor <span className="text-red-600">*</span>
            </span>
            <button
              type="button"
              onClick={openVendorModal}
              className="text-xs font-medium text-red-700 underline hover:text-red-900"
            >
              + Add vendor
            </button>
          </div>
          <select
            required
            value={vendorId || ""}
            onChange={(event) => setVendorId(Number(event.target.value))}
            className={`${inputClass} bg-white`}
          >
            <option value="">Select a vendor</option>
            {vendorOptions.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name || vendor.company_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Requested by <span className="text-red-600">*</span>
        <select
          required
          value={requestedBy || ""}
          onChange={(event) => setRequestedBy(Number(event.target.value))}
          className={`${inputClass} bg-white`}
        >
          <option value="">Select a staff member</option>
          {staffOptions.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.first_name} {staff.last_name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Description <span className="text-red-600">*</span>
        <textarea
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={2}
          placeholder="What is this expense for?"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
        />
      </label>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Expense items</h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_100px_120px_auto]">
          <input
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            placeholder="Item name"
            className={`${inputClass} mt-0`}
          />
          <input
            type="number"
            min={1}
            value={itemQuantity}
            onChange={(event) => setItemQuantity(Number(event.target.value))}
            placeholder="Qty"
            className={`${inputClass} mt-0`}
          />
          <input
            type="number"
            min={0}
            value={itemUnitCost}
            onChange={(event) => setItemUnitCost(Number(event.target.value))}
            placeholder="Unit cost"
            className={`${inputClass} mt-0`}
          />
          <button
            type="button"
            onClick={addItem}
            className="h-11 rounded-lg bg-slate-800 px-4 text-sm font-medium text-white transition hover:bg-slate-900"
          >
            Add item
          </button>
        </div>

        {items.length > 0 && (
          <div className="mt-4 space-y-2">
            {items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.quantity} x {currency(item.unit_cost)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900">
                    {currency(item.quantity * item.unit_cost)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
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

    <Modal
      zIndex={appZIndex.tooltips}
      open={vendorModalOpen}
      title="Add Vendor"
      onCancel={closeVendorModal}
      footer={null}
      destroyOnClose
      centered
      width={720}
    >
      <div style={{ maxHeight: "70vh", overflowY: "scroll" }}>
        <div className="space-y-4">
          {vendorFormError && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {vendorFormError}
            </div>
          )}

          <AddEditVendorForm formId={vendorFormId} branchId={branchId} onSubmit={saveNewVendor} />

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={closeVendorModal}
              disabled={savingVendor}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={vendorFormId}
              disabled={savingVendor}
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900 disabled:opacity-60"
            >
              {savingVendor && <LoadingOutlined />}
              Add Vendor
            </button>
          </div>
        </div>
      </div>
    </Modal>
    </>
  );
}
