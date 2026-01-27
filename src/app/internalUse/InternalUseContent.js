"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "@/backend/actions";
import PageBackground from "@/app/utility/PageBackgroung";
import LogoutIcon from "@/app/asset/icon/logoutIcon";

const branches = [
    { name: "Bukit Indah", slug: "bukit-indah", location: "Johor Bahru" },
    { name: "Sri Petaling", slug: "sri-petaling", location: "Kuala Lumpur" },
    { name: "Cheras", slug: "cheras", location: "Kuala Lumpur" },
    { name: "Subang", slug: "subang", location: "Selangor" },
    { name: "Kota Damansara", slug: "kota-damansara", location: "Selangor" },
    { name: "Puchong", slug: "puchong", location: "Selangor" },
];

// Icon components
const UserGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ChevronIcon = ({ isOpen }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);

export default function InternalUseContent({ role, username, branch }) {
    const [showBranches, setShowBranches] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();

    const isSuperAdmin = role === "superadmin";
    const staffBranch = branch ? branches.find(b => b.slug === branch) : null;

    const handleLogout = async () => {
        setLoggingOut(true);
        await logout();
        router.push("/internalUse/login");
        router.refresh();
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <PageBackground>
            <div className="relative z-10 min-h-screen">
                {/* Header */}
                <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo & Title */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">J</span>
                                </div>
                                <div>
                                    <h1 className="text-white font-bold text-lg">Just Dye It</h1>
                                    <p className="text-slate-400 text-xs">Admin Dashboard</p>
                                </div>
                            </div>

                            {/* User info & Logout */}
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block text-right">
                                    <p className="text-white text-sm font-medium">{username}</p>
                                    <p className="text-slate-400 text-xs">
                                        {isSuperAdmin ? "Super Admin" : "Staff"}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
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
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            {getGreeting()}, {username}!
                        </h2>
                        <p className="text-slate-400">
                            {isSuperAdmin
                                ? "Welcome to your admin dashboard. Manage your branches and view reports."
                                : `Welcome back! Access your branch dashboard below.`
                            }
                        </p>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Staff Management - SuperAdmin only */}
                        {isSuperAdmin && (
                            <Link
                                href="/staff"
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                        <UserGroupIcon />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Staff Management</h3>
                                    <p className="text-white/70 text-sm mb-4">Manage staff members and assignments</p>
                                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium group-hover:gap-3 transition-all">
                                        <span>Manage Staff</span>
                                        <ArrowRightIcon />
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Monthly Sales - SuperAdmin only */}
                        {isSuperAdmin && (
                            <Link
                                href="/monthly-sales"
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                        <ChartIcon />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Monthly Sales</h3>
                                    <p className="text-white/70 text-sm mb-4">View sales reports and analytics</p>
                                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium group-hover:gap-3 transition-all">
                                        <span>View Reports</span>
                                        <ArrowRightIcon />
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* For staff: show their assigned branch */}
                        {!isSuperAdmin && staffBranch && (
                            <Link
                                href={`/branches/${staffBranch.slug}`}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-3"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                        <BuildingIcon />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{staffBranch.name} Branch</h3>
                                    <div className="flex items-center gap-1 text-white/70 text-sm mb-4">
                                        <MapPinIcon />
                                        <span>{staffBranch.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium group-hover:gap-3 transition-all">
                                        <span>Open Dashboard</span>
                                        <ArrowRightIcon />
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Branches Section - SuperAdmin only */}
                    {isSuperAdmin && (
                        <div className="mt-8">
                            <button
                                onClick={() => setShowBranches(!showBranches)}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors mb-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <BuildingIcon />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-white font-semibold">Branch Dashboards</h3>
                                        <p className="text-slate-400 text-sm">Access individual branch sales</p>
                                    </div>
                                </div>
                                <div className="text-slate-400">
                                    <ChevronIcon isOpen={showBranches} />
                                </div>
                            </button>

                            {/* Branch Grid */}
                            {showBranches && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                                    {branches.map((b, index) => (
                                        <Link
                                            key={b.slug}
                                            href={`/branches/${b.slug}`}
                                            className="group relative overflow-hidden rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-5 transition-all duration-300 hover:border-blue-500/50"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                                                        {b.name}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                                                        <MapPinIcon />
                                                        <span>{b.location}</span>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                    <ArrowRightIcon />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
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

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </PageBackground>
    );
}