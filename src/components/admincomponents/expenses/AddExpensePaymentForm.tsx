import { FormEvent, useEffect, useState } from "react";
import { getPaymentMethods } from "../../../apiservice/payment-methods-service";
import { PaymentMethod } from "../paymentMethods/paymentMethod.types";
import { Expense, CreateExpensePaymentPayload } from "../../../apiservice/expenses-records-service.type";

type Props = {
  formId: string;
  branchId: number;
  expense: Expense;
  onSubmit: (values: CreateExpensePaymentPayload) => void;
};

const today = () => new Date().toISOString();

export default function AddExpensePaymentForm({ formId, branchId, expense, onSubmit }: Props) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [values, setValues] = useState<CreateExpensePaymentPayload>({
    expense_id: expense.id,
    payment_method_id: 0,
    amount: 0,
    currency: "NGN",
    status: "PAID",
    payment_gateway: "cash",
    transaction_id: "",
    paid_at: today(),
  });

  useEffect(() => {
    getPaymentMethods({ branch_id: branchId, page: 1, perPage: 100, sort_order: "desc" })
      .then((response) => {
        setPaymentMethods(response.data || []);
        const defaultMethod = (response.data || []).find((method) => method.is_default) || response.data?.[0];
        if (defaultMethod) {
          setValues((current) => ({
            ...current,
            payment_method_id: defaultMethod.id,
            payment_gateway: defaultMethod.type,
          }));
        }
      })
      .catch(() => setPaymentMethods([]));
  }, [branchId]);

  const update = <K extends keyof CreateExpensePaymentPayload>(
    key: K,
    value: CreateExpensePaymentPayload[K],
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
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        Expense: <span className="font-medium text-slate-900">{expense.reference}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Payment method <span className="text-red-600">*</span>
          <select
            required
            value={values.payment_method_id || ""}
            onChange={(event) => {
              const methodId = Number(event.target.value);
              const method = paymentMethods.find((item) => item.id === methodId);
              update("payment_method_id", methodId);
              if (method) update("payment_gateway", method.type);
            }}
            className={`${inputClass} bg-white`}
          >
            <option value="">Select a payment method</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Amount (NGN) <span className="text-red-600">*</span>
          <input
            required
            min="1"
            type="number"
            value={values.amount || ""}
            onChange={(event) => update("amount", Number(event.target.value))}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            value={values.status}
            onChange={(event) => update("status", event.target.value)}
            className={`${inputClass} bg-white`}
          >
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Transaction reference
          <input
            value={values.transaction_id}
            onChange={(event) => update("transaction_id", event.target.value)}
            placeholder="Optional gateway transaction id"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Paid at
        <input
          type="datetime-local"
          value={values.paid_at.slice(0, 16)}
          onChange={(event) => update("paid_at", new Date(event.target.value).toISOString())}
          className={inputClass}
        />
      </label>
    </form>
  );
}
