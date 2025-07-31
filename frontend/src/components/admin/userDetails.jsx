import { useParams } from "react-router-dom";
import SideBar from "./side";
import { BadgeCheck, Calendar, User, Activity, CheckCircle  } from "lucide-react";

export default function UserDetails() {
    const { name } = useParams();

    return (
        <div className="bg-blue-50 min-h-screen">
            <SideBar />
            <main className="flex-1 md:ml-72 p-6 ">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">👤 User Details</h1>

                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center text-5xl mb-4">
                            <User size={40} className="text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700">{name}</h2>
                        <p className="text-sm text-gray-500">Registered User</p>
                    </div>

                    <div className="space-y-4 mt-6">
                        <DetailItem icon={<BadgeCheck className="text-green-500" />} label="Status" value="User" />
                        <DetailItem icon={<Calendar className="text-indigo-500" />} label="Signup Date" value="11/11/2025" />
                        {/* <DetailItem icon={<Activity className="text-yellow-500" />} label="Active" value="Yes" /> */}
                        <DetailItem icon={<Activity className="text-yellow-500" />} label="Last Interaction" value="12/12/2025" />
                        <DetailItem icon={<CheckCircle className="text-blue-700" />} label="Passed Tests" value="Grammer Test" />
                    </div>
                </div>
            </main>
        </div>
    );
}

function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-center space-x-4 border-b pb-3">
            <div className="w-6 h-6">{icon}</div>
            <span className="text-gray-600 font-medium">{label}:</span>
            <span className="text-blue-700 font-semibold">{value}</span>
        </div>
    );
}
