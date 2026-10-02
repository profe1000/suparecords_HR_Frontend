import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { ReactNode, useState } from "react";
import { appZIndex } from "../../../utils/appconst";
import { ApprovalStatus, StaffSummary } from "./approvals.types";

export const inputClass =
  "mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100";

export const textareaClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100";

/** Pulls a readable message out of a FastAPI error (string detail or validation list). */
export const apiErrorMessage = (error: any, fallback: string): string => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length) {
    return detail
      .map((item: any) => String(item?.msg || "").replace(/^Value error, /, ""))
      .filter(Boolean)
      .join(" ");
  }
  return error?.response?.data?.message || error?.message || fallback;
};

/** Formats a YYYY-MM-DD date without shifting it across time zones. */
export const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

export const formatAmount = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === ""
    ? "-"
    : Number(value).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

export const staffName = (staff?: StaffSummary | null) =>
  staff ? `${staff.first_name} ${staff.last_name}` : "-";

const badgeClasses: Record<ApprovalStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export const StatusBadge = ({ status }: { status: ApprovalStatus }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClasses[status] || badgeClasses.CANCELLED}`}
  >
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
);

export const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "", label: "All" },
];

export const StatusFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
    {STATUS_FILTERS.map((filter) => (
      <button
        key={filter.label}
        type="button"
        role="tab"
        aria-selected={value === filter.value}
        onClick={() => onChange(filter.value)}
        className={
          "rounded-full border px-3 py-1.5 text-sm font-medium transition " +
          (value === filter.value
            ? "border-red-800 bg-red-800 text-white"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")
        }
      >
        {filter.label}
      </button>
    ))}
  </div>
);

export const Banner = ({
  tone,
  children,
  onClose,
}: {
  tone: "success" | "error";
  children: ReactNode;
  onClose?: () => void;
}) => (
  <div
    role={tone === "error" ? "alert" : "status"}
    className={
      "mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm " +
      (tone === "error"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-800")
    }
  >
    <span>{children}</span>
    {onClose && (
      <button type="button" onClick={onClose} className="font-bold" aria-label="Dismiss">
        x
      </button>
    )}
  </div>
);

export const EmptyState = ({ children }: { children: ReactNode }) => (
  <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
    {children}
  </div>
);

export const Pager = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) =>
  totalPages > 1 ? (
    <div className="mt-4 flex items-center justify-end gap-3 text-sm text-slate-600">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  ) : null;

export type ReviewAction = "approve" | "reject";

type ReviewModalProps = {
  open: boolean;
  action: ReviewAction | null;
  title: string;
  summary: ReactNode;
  onCancel: () => void;
  onConfirm: (comment: string) => Promise<void>;
};

/** Confirm dialog for approving or rejecting; a comment is required to reject. */
export const ReviewModal = ({
  open,
  action,
  title,
  summary,
  onCancel,
  onConfirm,
}: ReviewModalProps) => {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const rejecting = action === "reject";

  const close = () => {
    if (submitting) return;
    setComment("");
    setError("");
    onCancel();
  };

  const submit = async () => {
    if (rejecting && !comment.trim()) {
      setError("Please give a reason for rejecting.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onConfirm(comment);
      setComment("");
    } catch (requestError: any) {
      setError(apiErrorMessage(requestError, `Unable to ${action} this item.`));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      zIndex={appZIndex.modal}
      open={open}
      title={title}
      onCancel={close}
      footer={null}
      destroyOnClose
      centered
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{summary}</div>

        <label className="block text-sm font-medium text-slate-700">
          Comment {rejecting ? <span className="text-red-600">*</span> : "(optional)"}
          <textarea
            rows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className={textareaClass}
            placeholder={rejecting ? "Reason for rejecting" : "Add a note for the staff member"}
          />
        </label>

        {error && <Banner tone="error">{error}</Banner>}

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={close}
            disabled={submitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className={
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60 " +
              (rejecting ? "bg-rose-700 hover:bg-rose-800" : "bg-emerald-700 hover:bg-emerald-800")
            }
          >
            {submitting && <LoadingOutlined />}
            {rejecting ? "Reject" : "Approve"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/** Shown on approval pages when the API returns 403. */
export const NoAccess = ({ what }: { what: string }) => (
  <EmptyState>
    <p className="font-medium text-slate-700">You don't have permission to approve {what}.</p>
    <p className="mt-1 text-sm">Approvals are limited to Admin and HR roles.</p>
  </EmptyState>
);
