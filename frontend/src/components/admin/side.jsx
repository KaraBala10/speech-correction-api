import { useState } from "react";

export default function SideBar(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return(
        <>
                  {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-60 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 z-20 transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <ul className="space-y-4 text-lg">
                <li className="hover:text-blue-300 cursor-pointer">Dashboard</li>
                <li className="hover:text-blue-300 cursor-pointer">Users</li>
                <li className="hover:text-blue-300 cursor-pointer">Settings</li>
                </ul>
            </div>

            {/* Overlay (Mobile) */}
            {/* {sidebarOpen && (
                <div
                className="fixed inset-0 bg-red-200 bg-opacity-40 z-10 md:hidden"
                onClick={() => setSidebarOpen(false)}
                />
            )} */}

            {/* Topbar (Mobile) */}
            <div className="md:hidden flex items-center p-4 bg-white shadow justify-between sticky top-0 z-10">
                <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-blue-700 text-2xl font-bold"
                >
                ☰
                </button>
                <span className="text-xl font-semibold text-blue-900">Admin</span>
            </div>
        </>
    )
}