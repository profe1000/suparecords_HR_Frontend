import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEditGuestForm from "./AddEditGuestForm";
import GuestList from "./GuestList";
import { Guest, GuestFormValues } from "./guest.types";
import { appZIndex } from "../../../utils/appconst";
import {
    createGuest,
    deleteGuest as removeGuest,
    getGuests,
    updateGuest,
} from "../../../apiservice/guests-service";

export default function GuestWrapper() {
    const navigate = useNavigate();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [search, setSearch] = useState("");
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const formId = "guest-form";

    const loadGuests = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getGuests({
                page: 1,
                perPage: 20,
                sort_order: "desc",
                ...(search.trim() ? { search: search.trim() } : {}),
            });
            setGuests(response.data || []);
        } catch (requestError: any) {
            setError(requestError?.response?.data?.message || "Unable to load guests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGuests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const openAddModal = () => {
        setEditingGuest(null);
        setModalOpen(true);
    };

    const openGuestDetails = (guest: Guest) => {
        navigate(`/admin/customers/${guest.id}`);
    };

    const openEditModal = (guest: Guest) => {
        setEditingGuest(guest);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingGuest(null);
    };

    const saveGuest = async (values: GuestFormValues) => {
        setSubmitting(true);
        try {
            if (editingGuest) {
                await updateGuest(editingGuest.id, values);
                setMessage("Guest updated successfully.");
            } else {
                await createGuest(values);
                setMessage("Guest created successfully.");
            }
            closeModal();
            await loadGuests();
        } catch (requestError: any) {
            setError(requestError?.response?.data?.message || "Unable to save guest.");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteGuest = async (guest: Guest) => {
        setDeletingId(guest.id);
        try {
            await removeGuest(guest.id);
            setMessage("Guest deleted successfully.");
            await loadGuests();
        } catch (requestError: any) {
            setError(requestError?.response?.data?.message || "Unable to delete guest.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-full bg-slate-50 p-4 sm:p-6">
            <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Guests</h1>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500">
                        Manage customer profiles, contact details and stay history.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center rounded-lg bg-red-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-900"
                >
                    + Add Guest
                </button>
            </div>

            {message && (
                <div
                    role="status"
                    className="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                >
                    <span>{message}</span>
                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        className="font-bold"
                    >
                        x
                    </button>
                </div>
            )}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-semibold text-slate-900">Guest register</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Search guests by name, email or phone.
                        </p>
                    </div>
                    <div className="grid w-full gap-3 sm:w-auto">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search guests"
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
                    <GuestList
                        guests={guests}
                        loading={loading}
                        deletingId={deletingId}
                        onView={openGuestDetails}
                        onEdit={openEditModal}
                        onDelete={deleteGuest}
                    />
                </div>
            </section>

            <Modal
                zIndex={appZIndex.modal}
                open={modalOpen}
                title={editingGuest ? "Edit Guest" : "Add Guest"}
                onCancel={closeModal}
                footer={null}
                destroyOnClose
                centered
                width={720}
            >
                <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
                    <div className="space-y-5">
                        <p className="text-sm text-slate-500">
                            Use the form below to save guest details.
                        </p>

                        <AddEditGuestForm
                            key={editingGuest?.id || "new"}
                            formId={formId}
                            initialValues={editingGuest}
                            onSubmit={saveGuest}
                        />

                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={submitting}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form={formId}
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900 disabled:opacity-60"
                            >
                                {submitting && <LoadingOutlined />}
                                {editingGuest ? "Save Changes" : "Create Guest"}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}