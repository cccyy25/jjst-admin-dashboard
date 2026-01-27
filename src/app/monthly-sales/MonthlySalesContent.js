"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMonthlySales, logout } from "@/backend/actions";
import Link from "next/link";
import PageBackground from "@/app/utility/PageBackgroung";
import LogoutIcon from "@/app/asset/icon/logoutIcon";
import { BackIcon } from "@/app/asset/icon/backIcon";

const UTC_OFFSET_HOURS = 8;

const PAYMENT_METHODS = ['QR', 'Cash', 'Bank Transfer', 'Credit Card'];
const PAYMENT_COLORS = {
    'QR': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    'Cash': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'Bank Transfer': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    'Credit Card': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
};

const BRANCHES = [
    { slug: null, name: 'All Branches' },
    { slug: 'bukit-indah', name: 'Bukit Indah' },
    { slug: 'sri-petaling', name: 'Sri Petaling' },
    { slug: 'cheras', name: 'Cheras' },
    { slug: 'subang', name: 'Subang' },
    { slug: 'kota-damansara', name: 'Kota Damansara' },
    { slug: 'puchong', name: 'Puchong' },
];

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

function getCurrentMonthUTC8() {
    const now = new Date();
    const utc8 = new Date(now.getTime() + (UTC_OFFSET_HOURS * 60 * 60 * 1000));
    const year = utc8.getUTCFullYear();
    const month = String(utc8.getUTCMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

function getMonthName(month) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
}

export default function MonthlySalesContent() {
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthUTC8());
    const [selectedBranch, setSelectedBranch] = useState(0);
    const [salesData, setSalesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoggingOut(true);
        await logout();
        router.push("/internalUse/login");
        router.refresh();
    };

    const fetchMonthlySales = async () => {
        setLoading(true);
        const [year, month] = selectedMonth.split('-').map(Number);
        const branch = BRANCHES[selectedBranch].slug;
        const result = await getMonthlySales(year, month, branch);
        setSalesData(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchMonthlySales();
    }, [selectedMonth, selectedBranch]);

    const [year, month] = selectedMonth.split('-').map(Number);

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
                                <h1 className="text-xl font-bold text-white">Monthly Sales</h1>
                            </div>

                            {/* Logout */}
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
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    {/* Controls Section */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            {/* Month Selector */}
                            <div className="flex gap-3">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Select Month</label>
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedMonth(getCurrentMonthUTC8())}
                                className="px-4 py-2 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-lg hover:bg-violet-500/30 transition-colors text-sm font-medium h-[42px]"
                            >
                                This Month
                            </button>
                        </div>

                        {/* Branch Tabs */}
                        <div className="mt-5 pt-5 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <BuildingIcon />
                                <span className="text-sm text-slate-400">Filter by Branch</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {BRANCHES.map((branch, index) => (
                                    <button
                                        key={branch.slug || 'all'}
                                        onClick={() => setSelectedBranch(index)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            selectedBranch === index
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {branch.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <span className="text-slate-400">Loading sales data...</span>
                        </div>
                    ) : salesData && (
                        <>
                            {/* Period Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                                    <ChartIcon />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {getMonthName(month)} {year}
                                    </h2>
                                    <p className="text-slate-400 text-sm">{BRANCHES[selectedBranch].name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                                    <p className="text-slate-400 text-sm mb-1">Total Sales</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-white">{salesData.totalSales.toFixed(2)}</p>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">
                                    <p className="text-yellow-400/80 text-sm mb-1">Golden Sales</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{salesData.totalGolden.toFixed(2)}</p>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                                    <p className="text-blue-400/80 text-sm mb-1">Service/Product</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-400">{salesData.totalServiceProduct.toFixed(2)}</p>
                                </div>

                                <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-5">
                                    <p className="text-pink-400/80 text-sm mb-1">Surcharge</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-pink-400">{(salesData.totalSurcharge || 0).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 mb-6">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Payment Methods</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {PAYMENT_METHODS.map(method => {
                                        const colors = PAYMENT_COLORS[method];
                                        return (
                                            <div
                                                key={method}
                                                className={`${colors.bg} ${colors.border} border rounded-xl p-4`}
                                            >
                                                <p className={`text-sm ${colors.text} opacity-80 mb-1`}>{method}</p>
                                                <p className={`text-xl font-bold ${colors.text}`}>
                                                    {salesData.byPayment[method].toFixed(2)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Staff Commission Breakdown */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <UserIcon />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Staff Commission Breakdown</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales(Rm)</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Golden Sales(Rm)</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Service Sales(Rm)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {salesData.staffSales.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center">
                                                    <div className="text-slate-400">
                                                        <p className="text-lg mb-2">No sales found</p>
                                                        <p className="text-sm">No staff sales data for this period</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            salesData.staffSales.map((staff, index) => {
                                                return (
                                                    <tr
                                                        key={staff.staffId}
                                                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                                                            index % 2 === 0 ? 'bg-white/[0.02]' : ''
                                                        }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                                index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                                    index === 1 ? 'bg-slate-400/20 text-slate-300' :
                                                                        index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                                            'bg-white/5 text-slate-500'
                                                            }`}>
                                                                {index + 1}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                                                    <span className="text-white font-semibold text-sm">
                                                                        {staff.staffName.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <span className="text-white font-medium truncate">{staff.staffName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className="text-white text-sm font-semibold">
                                                                {staff.totalSales.toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className="text-yellow-400 text-sm font-semibold">
                                                                {staff.goldenSales.toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className="text-blue-400 text-sm font-semibold">
                                                                {staff.serviceProductSales.toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
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
        </PageBackground>
    );
}