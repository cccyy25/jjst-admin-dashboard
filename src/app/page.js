import Link from "next/link";

const branches = [
    {
        name: "Bukit Indah",
        location: "Johor Bahru",
        url: "https://www.google.com/maps/place/Just+Dye+It+Studio+%E6%9F%93%E5%A4%B4%E6%AF%9B/data=!4m2!3m1!1s0x0:0x57a1efca111d370b",
        instagram: "https://www.instagram.com/justdyeit_jb/",
        whatsapp:
            "https://api.whatsapp.com/send?phone=601121303655&text=Hello%20%F0%9F%91%8B%F0%9F%8F%BBI%20want%20to%20make%20an%20appointment%20%0A%0A%F0%9F%93%8DJB%20Bukit%20Indah%20Branch%0A%0ADate%EF%BC%9A%0ATime%EF%BC%9A",
        closedNote: "Closed on Tuesday",
    },
    {
        name: "Sri Petaling",
        location: "Kuala Lumpur",
        url: "https://www.google.com/maps/place/%E6%9F%93%E5%A4%B4%E6%AF%9BKL+Just+Dye+It+Studio+Sri+Petaling/data=!4m2!3m1!1s0x0:0xf7dc21d615fccd09",
        instagram: "https://www.instagram.com/justdyeit_kl/",
        whatsapp:
            "https://api.whatsapp.com/send?phone=601121303655&text=Hello%20%F0%9F%91%8B%F0%9F%8F%BBI%20want%20to%20make%20an%20appointment%20%0A%0A%F0%9F%93%8DSri%20Petaling%20Branch%0A%0ADate%EF%BC%9A%0ATime%EF%BC%9A",
    },
    {
        name: "Cheras",
        location: "Kuala Lumpur",
        url: "https://www.google.com/maps/place/%E6%9F%93%E5%A4%B4%E6%AF%9B+Just+Dye+It+Studio+Cheras/data=!4m2!3m1!1s0x0:0x8113580061a86e17",
        instagram: "https://www.instagram.com/justdyeit_cheras/",
        whatsapp:
            "https://api.whatsapp.com/send?phone=601121303655&text=Hello%20%F0%9F%91%8B%F0%9F%8F%BBI%20want%20to%20make%20an%20appointment%20%0A%0A%F0%9F%93%8DCheras%20Trader%20Square%20Branch%0A%0ADate%EF%BC%9A%0ATime%EF%BC%9A",
    },
    {
        name: "Subang",
        location: "Selangor",
        url: "https://www.google.com/maps/place/%E6%9F%93%E5%A4%B4%E6%AF%9B+Just+Dye+It+Studio+Subang+Jaya/data=!4m2!3m1!1s0x0:0x7c557a1192284aed",
        instagram: "https://www.instagram.com/justdyeit_subang/",
        whatsapp:
            "https://api.whatsapp.com/send?phone=601121303655&text=Hello%20%F0%9F%91%8B%F0%9F%8F%BBI%20want%20to%20make%20an%20appointment%20%0A%0A%F0%9F%93%8DSubang%20Taipan%20Branch%0A%0ADate%EF%BC%9A%0ATime%EF%BC%9A",
    },
    {
        name: "Kota Damansara",
        location: "Selangor",
        url: "https://www.google.com/maps/place/%E6%9F%93%E5%A4%B4%E6%AF%9BJust+Dye+It+Studio+Kota+Damansara/data=!4m2!3m1!1s0x0:0x809d8ca3d8958147",
        instagram: "https://www.instagram.com/justdyeit_kotadamansara/",
        whatsapp:
            "https://api.whatsapp.com/send?phone=601121303655&text=Hello%20%F0%9F%91%8B%F0%9F%8F%BBI%20want%20to%20make%20an%20appointment%20%0A%0A%F0%9F%93%8DKota%20Damansara%20Branch%0A%0ADate%EF%BC%9A%0ATime%EF%BC%9A",
    },
    {
        name: "Puchong",
        location: "Selangor",
        url: "https://www.google.com/maps/place/%E6%9F%93%E5%A4%B4%E6%AF%9B+Just+Dye+It+Studio+Puchong/data=!4m2!3m1!1s0x0:0x582d28fb1e120e7c",
        instagram: "https://www.instagram.com/justdyeit_puchong",
        whatsapp:
            "https://api.whatsapp.com/send?phone=601121303655&text=Hello%20%F0%9F%91%8B%F0%9F%8F%BBI%20want%20to%20make%20an%20appointment%20%F0%9F%93%8DPuchong%20Branch%0A%0ADate%EF%BC%9A%0ATime%EF%BC%9A",
    },
];

// Icon components
const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            {/* Main content */}
            <div className="relative z-10 px-4 py-12 sm:py-16">
                <div className="max-w-5xl mx-auto">

                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-block mb-6">
                            <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
                                <span className="text-gray-800">JUST </span>
                                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">DYE </span>
                                <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">IT</span>
                            </h1>
                            <div className="mt-2 h-1 w-24 mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 rounded-full" />
                        </div>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">
                            Professional Hair Coloring Studio
                        </p>
                    </div>

                    {/* Branches Section */}
                    <div className="mb-12">
                        <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
                            Visit Our Branches
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {branches.map((branch, index) => (
                                <div
                                    key={branch.name}
                                    className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                                >
                                    {/* Card accent bar */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="p-6">
                                        {/* Branch name & location */}
                                        <a
                                            href={branch.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block group/link"
                                        >
                                            <h3 className="text-lg font-bold text-gray-800 group-hover/link:text-pink-600 transition-colors">
                                                {branch.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                <MapPinIcon />
                                                <span>{branch.location}</span>
                                            </div>
                                        </a>

                                        {/* Operating hours */}
                                        <div className="mt-4 flex items-center gap-2 text-gray-600 text-sm">
                                            <ClockIcon />
                                            <span>11:00 AM - 8:00 PM Daily</span>
                                        </div>

                                        {/* Closed note */}
                                        {branch.closedNote && (
                                            <div className="mt-2 inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                                                {branch.closedNote}
                                            </div>
                                        )}

                                        {/* Action buttons */}
                                        <div className="mt-5 flex gap-3">
                                            <a
                                                href={branch.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-medium text-sm hover:opacity-90 transition-opacity"
                                            >
                                                <InstagramIcon />
                                                <span>Instagram</span>
                                            </a>
                                            <a
                                                href={branch.whatsapp}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 text-white font-medium text-sm hover:bg-green-600 transition-colors"
                                            >
                                                <WhatsAppIcon />
                                                <span>WhatsApp</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Linktree CTA */}
                    <div className="text-center">
                        <a
                            href="https://linktr.ee/justdyeitsalon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                        >
                            <LinkIcon />
                            <span>View All Links</span>
                        </a>
                    </div>

                    {/* Footer */}
                    <footer className="mt-16 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} Just Dye It Studio. All rights reserved.</p>
                    </footer>

                </div>
            </div>
        </div>
    );
}
