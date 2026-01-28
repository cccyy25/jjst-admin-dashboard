"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSalesByBranch, createSales, updateSales, deleteSales, getActiveStaff, logout } from "@/backend/actions";
import Link from "next/link";
import PageBackground from "@/app/utility/PageBackgroung";
import LogoutIcon from "@/app/asset/icon/logoutIcon";
import {BackIcon} from "@/app/asset/icon/backIcon";

const PAYMENT_METHODS = ['QR', 'Cash', 'Bank Transfer', 'Credit Card'];
const SALES_TYPES = ['Golden', 'Service/Product'];
const UTC_OFFSET_HOURS = 8;

// Surcharge configuration
const SURCHARGE_OPTIONS = {
    'Hair Cut': [10, 15, 35],
    'Other': [25, 35, 45],
};

// Helper to convert numeric surcharge to string key for form
function getSurchargeKey(value) {
    if (!value || value === 0) return 0;
    // Find which category this value belongs to
    for (const [category, values] of Object.entries(SURCHARGE_OPTIONS)) {
        if (values.includes(value)) {
            return `${category}-${value}`;
        }
    }
    return 0;
}

// Payment method colors for dark theme
const PAYMENT_COLORS = {
    'QR': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    'Cash': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    'Bank Transfer': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    'Credit Card': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
};

// UTC+8 timezone utilities
function formatDateUTC8(date) {
    const d = new Date(date);
    const utc8Date = new Date(d.getTime() + (UTC_OFFSET_HOURS * 60 * 60 * 1000));
    return utc8Date.toISOString().split('T')[0];
}

function getTodayUTC8() {
    return formatDateUTC8(new Date());
}

// Get current month date boundaries (UTC+8)
function getCurrentMonthBounds() {
    const now = new Date();
    const utc8Now = new Date(now.getTime() + (UTC_OFFSET_HOURS * 60 * 60 * 1000));
    const year = utc8Now.getUTCFullYear();
    const month = utc8Now.getUTCMonth();

    // First day of current month
    const firstDay = new Date(Date.UTC(year, month, 1));
    // Last day of current month
    const lastDay = new Date(Date.UTC(year, month + 1, 0));

    return {
        minDate: firstDay.toISOString().split('T')[0],
        maxDate: lastDay.toISOString().split('T')[0],
    };
}

// Icon components
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const CloneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default function BranchSalesPage({ branchSlug, branchName, isAdmin = false }) {
    const [salesList, setSalesList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSales, setEditingSales] = useState(null);
    const [dateFilter, setDateFilter] = useState(getTodayUTC8());
    const [searchTerms, setSearchTerms] = useState({});
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();

    // Date restrictions for non-admin users (current month only)
    const dateBounds = useMemo(() => {
        if (isAdmin) return { minDate: null, maxDate: null };
        return getCurrentMonthBounds();
    }, [isAdmin]);

    // Clamp date to bounds (for mobile browsers that don't respect min/max)
    const clampDate = (dateStr) => {
        if (isAdmin || !dateStr) return dateStr;
        const { minDate, maxDate } = dateBounds;
        if (minDate && dateStr < minDate) return minDate;
        if (maxDate && dateStr > maxDate) return maxDate;
        return dateStr;
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        await logout();
        router.push("/internalUse/login");
        router.refresh();
    };

    const initialFormData = {
        type: 'Service/Product',
        depositCode: '',
        depositAmount: 0,
        salesAmount: 0,
        paymentMethod: 'QR',
        responsiblePersons: [''],
        date: getTodayUTC8(),
        branch: branchSlug,
        surcharge: 0,
        remarks: '',
    };
    const [formData, setFormData] = useState(initialFormData);

    // Calculate summary totals
    const summary = useMemo(() => {
        const totals = {
            total: 0,
            serviceProduct: 0,
            golden: 0,
            surcharge: 0,
            byPayment: {
                'QR': 0,
                'Cash': 0,
                'Bank Transfer': 0,
                'Credit Card': 0,
            },
        };

        salesList.forEach(sale => {
            totals.total += sale.salesAmount;
            totals.surcharge += sale.surcharge || 0;
            if (sale.type === 'Service/Product') {
                totals.serviceProduct += sale.salesAmount;
            } else if (sale.type === 'Golden') {
                totals.golden += sale.salesAmount;
            }
            if (totals.byPayment[sale.paymentMethod] !== undefined) {
                totals.byPayment[sale.paymentMethod] += sale.salesAmount;
            }
        });

        return totals;
    }, [salesList]);

    const fetchSales = async () => {
        setLoading(true);
        const result = await getSalesByBranch(branchSlug, dateFilter);
        setSalesList(result.salesList);
        setLoading(false);
    };

    const fetchStaff = async () => {
        const result = await getActiveStaff();
        setStaffList(result.staffList);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    // Ensure dateFilter is within bounds on mount and when bounds change (mobile fix)
    useEffect(() => {
        if (!isAdmin) {
            const clamped = clampDate(dateFilter);
            if (clamped !== dateFilter) {
                setDateFilter(clamped);
            }
        }
    }, [dateBounds]);

    useEffect(() => {
        fetchSales();
    }, [dateFilter]);

    const handleCreate = () => {
        setEditingSales(null);
        setFormData({ ...initialFormData, branch: branchSlug, date: getTodayUTC8() });
        setSearchTerms({});
        setShowModal(true);
    };

    const handleEdit = (sales) => {
        setEditingSales(sales);
        setFormData({
            type: sales.type,
            depositCode: sales.depositCode || '',
            depositAmount: sales.depositAmount || 0,
            salesAmount: sales.salesAmount,
            paymentMethod: sales.paymentMethod,
            responsiblePersons: sales.responsiblePersons.map(p => p._id),
            date: formatDateUTC8(sales.date),
            branch: branchSlug,
            surcharge: getSurchargeKey(sales.surcharge),
            remarks: sales.remarks || '',
        });
        setSearchTerms({});
        setShowModal(true);
    };

    const handleClone = (sales) => {
        setEditingSales(null); // null means create new
        setFormData({
            type: sales.type,
            depositCode: sales.depositCode || '',
            depositAmount: sales.depositAmount || 0,
            salesAmount: sales.salesAmount,
            paymentMethod: sales.paymentMethod,
            responsiblePersons: sales.responsiblePersons.map(p => p._id),
            date: formatDateUTC8(sales.date), // Use original date for clone
            branch: branchSlug,
            surcharge: getSurchargeKey(sales.surcharge),
            remarks: sales.remarks || '',
        });
        setSearchTerms({});
        setShowModal(true);
    };

    const handleDelete = async (sales) => {
        if (confirm(`Are you sure you want to delete this sales record?\n\nType: ${sales.type}\nAmount: RM ${sales.salesAmount.toFixed(2)}\nResponsible: ${sales.responsiblePersons.map(p => p.name).join(', ')}`)) {
            await deleteSales(sales._id);
            fetchSales();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate date is within bounds (extra safety for mobile)
        if (!isAdmin) {
            const { minDate, maxDate } = dateBounds;
            if ((minDate && formData.date < minDate) || (maxDate && formData.date > maxDate)) {
                alert('Date must be within current month');
                return;
            }
        }

        setCreating(true);
        // Parse surcharge: if it's a string like "Hair Cut-35", extract the number
        let surchargeValue = formData.surcharge;
        if (typeof surchargeValue === 'string' && surchargeValue.includes('-')) {
            surchargeValue = parseInt(surchargeValue.split('-').pop()) || 0;
        }

        const dataToSubmit = {
            ...formData,
            responsiblePersons: formData.responsiblePersons.filter(p => p !== ''),
            surcharge: surchargeValue,
        };

        if (editingSales) {
            await updateSales(editingSales._id, dataToSubmit);
        } else {
            await createSales(dataToSubmit);
        }
        setShowModal(false);
        setCreating(false);
        fetchSales();
    };

    const addResponsiblePerson = () => {
        setFormData({
            ...formData,
            responsiblePersons: [...formData.responsiblePersons, ''],
        });
    };

    const removeResponsiblePerson = (index) => {
        if (formData.responsiblePersons.length > 1) {
            const newPersons = formData.responsiblePersons.filter((_, i) => i !== index);
            setFormData({ ...formData, responsiblePersons: newPersons });
        }
    };

    const updateResponsiblePerson = (index, value) => {
        const newPersons = [...formData.responsiblePersons];
        newPersons[index] = value;
        setFormData({ ...formData, responsiblePersons: newPersons });
    };

    // Filter staff: exclude already selected staff (except current index)
    const getFilteredStaff = (index) => {
        const term = searchTerms[index] || '';
        const selectedIds = formData.responsiblePersons.filter((id, i) => id !== '' && i !== index);
        return staffList.filter(s =>
            s.name.toLowerCase().includes(term.toLowerCase()) &&
            !selectedIds.includes(s._id)
        );
    };

    const getStaffName = (staffId) => {
        const staff = staffList.find(s => s._id === staffId);
        return staff ? staff.name : 'Unknown';
    };

    return (
        <PageBackground>
            <div className="relative z-10 min-h-screen">
                {/* Header */}
                <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Left: Back button and Title */}
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/internalUse"
                                    className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                >
                                    <BackIcon />
                                    <span className="hidden sm:inline text-sm">Back</span>
                                </Link>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-white">{branchName}</h1>
                                    <p className="text-slate-400 text-sm">Branch Sales Dashboard</p>
                                </div>
                            </div>

                            {/* Right: Create button and Logout */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleCreate}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all shadow-lg shadow-emerald-500/25"
                                >
                                    <PlusIcon />
                                    <span className="hidden sm:inline">Create Sales</span>
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
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    {/* Date Filter */}
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                            <CalendarIcon />
                            <span className="text-slate-400 text-sm">Filter by Date:</span>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(clampDate(e.target.value))}
                                min={dateBounds.minDate || undefined}
                                max={dateBounds.maxDate || undefined}
                                className="bg-transparent text-white border-none outline-none cursor-pointer"
                            />
                        </div>
                        <button
                            onClick={() => setDateFilter(getTodayUTC8())}
                            className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-xl transition-colors"
                        >
                            Today
                        </button>
                        {!isAdmin && (
                            <span className="text-slate-500 text-sm">
                                (Current month only)
                            </span>
                        )}
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {/* Total Sales */}
                        <div className="bg-gradient-to-br from-slate-600/50 to-slate-700/50 rounded-xl p-4 border border-white/10">
                            <p className="text-slate-400 text-sm mb-1">Total Sales</p>
                            <p className="text-2xl font-bold text-white">RM {summary.total.toFixed(2)}</p>
                        </div>
                        {/* Service/Product */}
                        <div className="bg-gradient-to-br from-blue-600/30 to-blue-700/30 rounded-xl p-4 border border-blue-500/20">
                            <p className="text-blue-300 text-sm mb-1">Service/Product</p>
                            <p className="text-2xl font-bold text-white">RM {summary.serviceProduct.toFixed(2)}</p>
                        </div>
                        {/* Golden */}
                        <div className="bg-gradient-to-br from-yellow-600/30 to-amber-700/30 rounded-xl p-4 border border-yellow-500/20">
                            <p className="text-yellow-300 text-sm mb-1">Golden</p>
                            <p className="text-2xl font-bold text-white">RM {summary.golden.toFixed(2)}</p>
                        </div>
                        {/* Surcharge */}
                        <div className="bg-gradient-to-br from-pink-600/30 to-rose-700/30 rounded-xl p-4 border border-pink-500/20">
                            <p className="text-pink-300 text-sm mb-1">Surcharge</p>
                            <p className="text-2xl font-bold text-white">RM {summary.surcharge.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Payment Methods Summary */}
                    <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-slate-400 text-sm mb-3">Payment Methods</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {PAYMENT_METHODS.map(method => (
                                <div key={method} className={`px-4 py-3 rounded-lg ${PAYMENT_COLORS[method]}`}>
                                    <p className="text-sm opacity-80">{method}</p>
                                    <p className="text-lg font-bold">RM {summary.byPayment[method].toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sales Table */}
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">Deposit Code</th>
                                        <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">Deposit Amt</th>
                                        <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">Sales Amt</th>
                                        <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">Surcharge</th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">Remarks</th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">Payment</th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">Responsible</th>
                                        <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">Sales/Pax</th>
                                        <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="10" className="px-4 py-8 text-center text-slate-400">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : salesList.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="px-4 py-12 text-center">
                                                <div className="text-slate-400">
                                                    <p className="text-lg mb-2">No sales found</p>
                                                    <p className="text-sm">Create your first sale for this date!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        salesList.map((sale, index) => (
                                            <tr
                                                key={sale._id}
                                                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                                                    index % 2 === 0 ? 'bg-white/[0.02]' : ''
                                                }`}
                                            >
                                                <td className="px-4 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        sale.type === 'Golden'
                                                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                    }`}>
                                                        {sale.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-slate-300">{sale.depositCode || '-'}</td>
                                                <td className="px-4 py-4 text-right text-slate-300">{sale.depositAmount.toFixed(2)}</td>
                                                <td className="px-4 py-4 text-right font-medium text-white">{sale.salesAmount.toFixed(2)}</td>
                                                <td className="px-4 py-4 text-right">
                                                    {sale.surcharge > 0 ? (
                                                        <span className="px-2 py-1 rounded text-xs bg-pink-500/20 text-pink-300 border border-pink-500/30">
                                                            {sale.surcharge.toFixed(2)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-slate-400 max-w-[150px] truncate">
                                                    {sale.remarks || '-'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${PAYMENT_COLORS[sale.paymentMethod]}`}>
                                                        {sale.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-slate-300">
                                                    {sale.responsiblePersons.map(p => p.name).join(', ')}
                                                </td>
                                                <td className="px-4 py-4 text-right font-medium text-cyan-400">
                                                    {sale.salesPerPax?.toFixed(2) || (sale.salesAmount / sale.responsiblePersons.length).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleClone(sale)}
                                                            className="p-2 bg-slate-500/20 hover:bg-slate-500/40 text-slate-300 rounded-lg transition-colors"
                                                            title="Clone this sale"
                                                        >
                                                            <CloneIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(sale)}
                                                            className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-lg transition-colors"
                                                            title="Edit this sale"
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(sale)}
                                                            className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors"
                                                            title="Delete this sale"
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
                <footer className="border-t border-white/10 mt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        <p className="text-center text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} Just Dye It Studio. Internal Use Only.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto">
                    <div className="min-h-full flex items-start sm:items-center justify-center p-4 py-8">
                        <div className="bg-slate-800 border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-lg shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingSales ? "Update Sales" : "Create Sales"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* 1. Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Date (UTC+8)
                                    {!isAdmin && <span className="text-slate-500 text-xs ml-1 sm:ml-2">(Current month only)</span>}
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: clampDate(e.target.value) })}
                                    min={dateBounds.minDate || undefined}
                                    max={dateBounds.maxDate || undefined}
                                    className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>

                            {/* 2. Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                                    required
                                >
                                    {SALES_TYPES.map(type => (
                                        <option key={type} value={type} className="bg-slate-800">{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 3. Responsible Persons */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Responsible Persons</label>
                                {formData.responsiblePersons.map((personId, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span className="text-sm text-slate-500 sm:w-20 shrink-0">
                                                Person {index + 1}
                                            </span>
                                            <div className="flex items-center gap-2 flex-1">
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Search staff..."
                                                        value={searchTerms[index] ?? (personId ? getStaffName(personId) : '')}
                                                        onChange={(e) => {
                                                            setSearchTerms({ ...searchTerms, [index]: e.target.value });
                                                            if (e.target.value === '') {
                                                                updateResponsiblePerson(index, '');
                                                            }
                                                        }}
                                                        onFocus={() => setSearchTerms({ ...searchTerms, [index]: searchTerms[index] || '' })}
                                                        className="w-full px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                    {searchTerms[index] !== undefined && (
                                                        <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-white/10 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                                                            {getFilteredStaff(index).map(staff => (
                                                                <div
                                                                    key={staff._id}
                                                                    onClick={() => {
                                                                        updateResponsiblePerson(index, staff._id);
                                                                        setSearchTerms({ ...searchTerms, [index]: undefined });
                                                                    }}
                                                                    className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white"
                                                                >
                                                                    {staff.name}
                                                                </div>
                                                            ))}
                                                            {getFilteredStaff(index).length === 0 && (
                                                                <div className="px-4 py-2 text-slate-400">No staff found</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {formData.responsiblePersons.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeResponsiblePerson(index)}
                                                        className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors shrink-0"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addResponsiblePerson}
                                    className="mt-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors text-sm w-full sm:w-auto"
                                >
                                    + Add Responsible Person
                                </button>
                            </div>

                            {/* 4. Sales Amount + Payment Method (same row on desktop) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Sales Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.salesAmount}
                                        onChange={(e) => setFormData({ ...formData, salesAmount: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Payment Method</label>
                                    <select
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                                        required
                                    >
                                        {PAYMENT_METHODS.map(method => (
                                            <option key={method} value={method} className="bg-slate-800">{method}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 5. Deposit Code + Deposit Amount (same row on desktop) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Deposit Code</label>
                                    <input
                                        type="text"
                                        value={formData.depositCode}
                                        onChange={(e) => setFormData({ ...formData, depositCode: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Deposit Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.depositAmount}
                                        onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* 6. Surcharge */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Surcharge</label>
                                <div className="space-y-3">
                                    {/* No surcharge option */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="surcharge"
                                            checked={formData.surcharge === 0 || formData.surcharge === '0'}
                                            onChange={() => setFormData({ ...formData, surcharge: 0 })}
                                            className="w-4 h-4 accent-blue-500"
                                        />
                                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">No Surcharge</span>
                                    </label>

                                    {/* Surcharge options */}
                                    {Object.entries(SURCHARGE_OPTIONS).map(([category, values]) => (
                                        <div key={category} className="ml-2 p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="text-sm font-medium text-slate-400 mb-2">{category}</div>
                                            <div className="flex flex-wrap gap-4">
                                                {values.map((value) => (
                                                    <label key={`${category}-${value}`} className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name="surcharge"
                                                            checked={formData.surcharge === `${category}-${value}`}
                                                            onChange={() => setFormData({ ...formData, surcharge: `${category}-${value}` })}
                                                            className="w-4 h-4 accent-pink-500"
                                                        />
                                                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">RM{value}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 7. Remarks */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Remarks</label>
                                <textarea
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    rows="2"
                                    placeholder="Optional remarks..."
                                />
                            </div>

                            {/* Preview Sales Per Pax */}
                            {formData.salesAmount > 0 && formData.responsiblePersons.filter(p => p !== '').length > 0 && (
                                <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                                    <span className="text-cyan-300 text-sm">Sales Per Pax: </span>
                                    <span className="font-bold text-cyan-400 text-lg">
                                        RM {(formData.salesAmount / formData.responsiblePersons.filter(p => p !== '').length).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    disabled={creating}
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/25"
                                >
                                    {editingSales ? "Update" : "Create"}
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