import { CopyOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { FormEvent, useEffect, useState } from "react";
import { resetStaffPassword, StaffPasswordResetResult } from "../../../apiservice/staff-service";
import { appZIndex } from "../../../utils/appconst";
import { apiErrorMessage, Banner, inputClass } from "../Approvals/ApprovalShared";

type Props = {
  staff: { id: number; first_name: string; last_name: string; email: string } | null;
  onClose: () => void;
};

/** Admin/HR resets a staff member's password: type one or let the system generate it. */
export default function ResetStaffPasswordModal({ staff, onClose }: Props) {
  const [mode, setMode] = useState<"generate" | "manual">("generate");
  const [password, setPassword] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<StaffPasswordResetResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fresh state each time the dialog opens for someone.
    setMode("generate");
    setPassword("");
    setSendEmail(true);
    setError("");
    setResult(null);
    setCopied(false);
  }, [staff?.id]);

  const close = () => {
    if (!submitting) onClose();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!staff) return;
    setSubmitting(true);
    setError("");
    try {
      setResult(
        await resetStaffPassword(staff.id, {
          ...(mode === "manual" ? { new_password: password } : {}),
          send_email: sendEmail,
        }),
      );
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to reset this password."));
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.temporary_password);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const name = staff ? `${staff.first_name} ${staff.last_name}` : "";

  return (
    <Modal
      zIndex={appZIndex.modal}
      open={Boolean(staff)}
      title={`Reset password · ${name}`}
      onCancel={close}
      footer={null}
      destroyOnClose
      centered
    >
      {result ? (
        <div className="space-y-4">
          <Banner tone={result.email_sent || !sendEmail ? "success" : "error"}>
            {result.email_sent
              ? `Password reset. The new password was emailed to ${staff?.email}.`
              : sendEmail
                ? `Password reset, but the email could not be sent${result.email_error ? ` (${result.email_error})` : ""}. Give ${staff?.first_name} the password below.`
                : `Password reset. Give ${staff?.first_name} the password below.`}
          </Banner>
          <div>
            <p className="text-sm font-medium text-slate-700">New password</p>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-slate-100 px-3 py-2 font-mono text-base tracking-wide text-slate-900">
                {result.temporary_password}
              </code>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <CopyOutlined /> {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              This is shown only once. Ask {staff?.first_name} to change it after signing in (Settings → Change Password).
            </p>
          </div>
          <div className="flex justify-end border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-900"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-slate-600">
            {name} ({staff?.email}) will need the new password to sign in. Their current password stops working immediately.
          </p>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-700">New password</legend>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" checked={mode === "generate"} onChange={() => setMode("generate")} />
              Generate a temporary password
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" checked={mode === "manual"} onChange={() => setMode("manual")} />
              Set a password myself
            </label>
            {mode === "manual" && (
              <input
                required
                type="text"
                minLength={6}
                autoComplete="off"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                aria-label="New password"
                className={inputClass}
              />
            )}
          </fieldset>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={sendEmail} onChange={(event) => setSendEmail(event.target.checked)} />
            Email the new password to {staff?.email}
          </label>

          {error && <Banner tone="error">{error}</Banner>}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={close}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-900 disabled:opacity-60"
            >
              {submitting && <LoadingOutlined />}
              Reset Password
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
