import { LoadingOutlined } from "@ant-design/icons";
import { FormEvent, useState } from "react";
import "./admin-settings-Comp.css";
import { changeMyPassword } from "../../../apiservice/staff-service";
import { apiErrorMessage, Banner } from "../Approvals/ApprovalShared";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

const AdminProfileChangePasswordComp = () => {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (key: keyof typeof emptyForm, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.newPassword.length < 6) {
      setError("The new password must be at least 6 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("The new passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await changeMyPassword(form.currentPassword, form.newPassword);
      setForm(emptyForm);
      setSuccess("Your password has been changed. Use the new password next time you sign in.");
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Unable to change your password."));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "pl-4 pr-4 py-2 border rounded-lg w-full h-14 bg-stone-100";

  return (
    <div className="grid p-4">
      <div className="mb-6">
        <p className="font-sans text-lg">Change Your Password</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="relative mb-5 block w-full">
          <span>Current Password</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(event) => update("currentPassword", event.target.value)}
            className={inputClass}
          />
        </label>

        <label className="relative mb-5 block w-full">
          <span>New Password</span>
          <input
            required
            type="password"
            minLength={6}
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(event) => update("newPassword", event.target.value)}
            className={inputClass}
          />
          <span className="mt-1 block text-xs text-slate-500">At least 6 characters.</span>
        </label>

        <label className="relative mb-5 block w-full">
          <span>Confirm New Password</span>
          <input
            required
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) => update("confirmPassword", event.target.value)}
            className={inputClass}
          />
        </label>

        {error && <Banner tone="error">{error}</Banner>}
        {success && <Banner tone="success">{success}</Banner>}

        <button
          type="submit"
          className="flex h-14 w-full items-center justify-center rounded-xl bg-red-800 font-sans text-lg text-white hover:bg-red-900 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? <LoadingOutlined /> : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default AdminProfileChangePasswordComp;
