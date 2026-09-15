import { Modal } from "antd";
import { useEffect, useState } from "react";
import { appZIndex } from "../../../utils/appconst";
import {
  getTransactions,
  deleteTransaction as removeTransaction,
} from "../../../apiservice/transactions-service";
import { PaymentDirection, Transaction, TransactionListResponse } from "../../../apiservice/transactions-service.type";
import TransactionsList from "./TransactionsList";
import TransactionsMetaDashboard from "./TransactionsMetaDashboard";
import ViewTransactionDetails from "./ViewTransactionDetails";

type Props = {
  title: string;
  description: string;
  lockedDirection?: PaymentDirection;
};

const STATUS_OPTIONS = ["PAID", "PENDING", "FAILED", "REFUNDED"];
const TYPE_OPTIONS = ["BOOKING", "LAUNDRY", "EXPENSE"];

export default function PaymentTransactionsWrapper({ title, description, lockedDirection }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metaData, setMetaData] = useState<TransactionListResponse["meta"] | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getTransactions({
        page: 1,
        perPage: 20,
        sort_order: "desc",
        ...(lockedDirection ? { direction: lockedDirection } : {}),
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setTransactions(response.data || []);
      setMetaData(response.meta || null);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedDirection, status, type, search]);

  const openDetailsModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedTransaction(null);
  };

  const deleteTransaction = async (transaction: Transaction) => {
    setDeletingId(transaction.id);
    try {
      await removeTransaction(transaction.id);
      setMessage("Transaction deleted successfully.");
      await loadTransactions();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Unable to delete transaction.");
    } finally {
      setDeletingId(null);
    }
  };

  const selectClass =
    "h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100 bg-white";

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {message && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")} className="font-bold">
            x
          </button>
        </div>
      )}

      {metaData && <TransactionsMetaDashboard meta={metaData} />}

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">Transactions register</h2>
            <p className="mt-1 text-sm text-slate-500">Search by reference, gateway or transaction id.</p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
            <select value={status} onChange={(event) => setStatus(event.target.value)} className={selectClass}>
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select value={type} onChange={(event) => setType(event.target.value)} className={selectClass}>
              <option value="">All types</option>
              {TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions"
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        {error && (
          <div role="alert" className="mx-4 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="p-3 sm:p-4">
          <TransactionsList
            transactions={transactions}
            loading={loading}
            deletingId={deletingId}
            onView={openDetailsModal}
            onDelete={deleteTransaction}
          />
        </div>
      </section>

      <Modal
        zIndex={appZIndex.modal}
        open={detailsModalOpen}
        title={selectedTransaction ? `Transaction ${selectedTransaction.payment_reference}` : "Transaction details"}
        onCancel={closeDetailsModal}
        footer={null}
        destroyOnClose
        centered
        width={880}
      >
        <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          {selectedTransaction && <ViewTransactionDetails transaction={selectedTransaction} />}
        </div>
      </Modal>
    </div>
  );
}
