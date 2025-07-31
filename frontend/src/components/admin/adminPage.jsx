import { useState } from "react";
import SideBar from "./side";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate=useNavigate();
  const users = [
    { name: "Ghaith" },
    { name: "Mohanad" },
    { name: "Baraa" },
    { name: "Moataz" },
  ];

  return (
    <div className="bg-blue-100 min-h-screen">
      <SideBar/>
      {/* Main Content */}
      <div className="md:ml-60 px-6 py-8 transition-all duration-300">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Welcome to Admin Page
        </h1>

        {/* Dashboard Cards */}
        <div className="flex flex-wrap justify-around gap-6 mb-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-2xl w-64 h-36 flex items-center justify-center text-xl font-semibold text-gray-700 hover:scale-105 transition"
            >
              📊 Stats Card {index + 1}
            </div>
          ))}
        </div>
        {/* User Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="relative sm:w-1/3">
              <input
                type="search"
                placeholder="Search users..."
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="bg-yellow-400 text-gray-800 px-6 py-2 rounded-xl font-semibold shadow text-center">
              All Users
            </div>
          </div>

          {/* User List */}
          <div className="space-y-3">
            {users.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 px-6 py-3 rounded-xl shadow hover:bg-gray-100"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  👤 {user.name}
                </h3>
                <button onClick={()=>navigate(`/UserDetails/${user.name}`)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg font-medium cursor-pointer">
                  Show Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
