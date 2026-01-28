"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStaffList, createStaff, updateStaff, deleteStaff, logout } from "@/backend/actions";
import Link from "next/link";
import PageBackground from "@/app/utility/PageBackgroung";
import LogoutIcon from "@/app/asset/icon/logoutIcon";
import { BackIcon } from "@/app/asset/icon/backIcon";

const StaffStatus = Object.freeze({
    Inactive: "inactive",
    Active: "active"
});

// Icon components
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function StaffContent() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({ name: "", isActive: true });
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoggingOut(true);
        await logout();
        router.push("/internalUse/login");
        router.refresh();
    };

    const fetchStaff = async () => {
        setLoading(true);
        const result = await getStaffList();
        setStaffList(result.staffList);
        setLoading(false);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleCreate = () => {
        setEditingStaff(null);
        setFormData({ name: "", isActive: true });
        setShowModal(true);
    };

    const handleEdit = (staff) => {
        setEditingStaff(staff);
        setFormData({ name: staff.name, isActive: staff.isActive });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this staff?")) {
            await deleteStaff(id);
            fetchStaff();
        }
    };

    const handleSubmit = async (e) => {
        setCreating(true);
        e.preventDefault();
        if (editingStaff) {
            await updateStaff(editingStaff._id, formData);
        } else {
            await createStaff(formData);
        }
        setShowModal(false);
        setCreating(false);
        fetchStaff();
    };

    const activeCount = staffList.filter(s => s.isActive).length;
    const inactiveCount = staffList.filter(s => !s.isActive).length;

    return (
        <PageBackground>
            <div className="relative z-10 min-h-screen">
                {/* Header */}
                <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Back & Title */}
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/internalUse"
                                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    <BackIcon />
                                    <span className="hidden sm:inline">Back</span>
                                </Link>
                                <div className="h-6 w-px bg-white/20" />
                                <h1 className="text-xl font-bold text-white">Staff Management</h1>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleCreate}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
                                >
                                    <PlusIcon />
                                    <span className="hidden sm:inline">Add Staff</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <LogoutIcon />
                                    <span className="hidden sm:inline text-sm">
                                        {loggingOut ? "..." : "Logout"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Total Staff</p>
                                    <p className="text-3xl font-bold text-white mt-1">{staffList.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <UserIcon />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Active</p>
                                    <p className="text-3xl font-bold text-emerald-400 mt-1">{activeCount}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Inactive</p>
                                    <p className="text-3xl font-bold text-red-400 mt-1">{inactiveCount}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Staff Table */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10">
                            <h2 className="text-lg font-semibold text-white">All Staff Members</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                    <span className="text-slate-400">Loading staff...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : staffList.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                                                        <UserIcon />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400">No staff members found</p>
                                                        <p className="text-slate-500 text-sm mt-1">Click "Add Staff" to create one</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        staffList.map((staff) => (
                                            <tr key={staff._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                                            <span className="text-white font-semibold text-sm">
                                                                {staff.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="text-white font-medium">{staff.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                                            staff.isActive
                                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                        }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${staff.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                                        {staff.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(staff)}
                                                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                                            title="Edit staff"
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(staff._id)}
                                                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                            title="Delete staff"
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-white/10 mt-auto">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                        <p className="text-center text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} Just Dye It Studio. Internal Use Only.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal Container */}
                    <div className="min-h-full flex items-start sm:items-center justify-center p-4 py-8">
                        {/* Modal Content */}
                        <div className="relative w-full max-w-md bg-slate-800 border border-white/10 rounded-2xl shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">
                                {editingStaff ? "Edit Staff" : "Add New Staff"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit}>
                            <div className="px-6 py-6 space-y-5">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Staff Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter staff name"
                                        required
                                    />
                                </div>

                                {/* Status Select */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Status
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: true })}
                                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                                                formData.isActive
                                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                                                Active
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: false })}
                                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                                                !formData.isActive
                                                    ? 'bg-red-500/20 border-red-500 text-red-400'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${!formData.isActive ? 'bg-red-400' : 'bg-slate-500'}`} />
                                                Inactive
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-white/5">
                                <button
                                    type="button"
                                    disabled={creating}
                                    onClick={() => setShowModal(false)}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/25"
                                >
                                    {editingStaff ? "Save Changes" : "Add Staff"}
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            )}
        </PageBackground>
    );
}