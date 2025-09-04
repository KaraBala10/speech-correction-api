import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Shield,
  Brain,
  Sparkles,
  Edit,
  Camera,
  Trophy,
  Star,
  Target,
  X,
  Save,
  Upload,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  Zap,
  Heart,
  Activity,
  BarChart3,
  Settings,
  Bell,
  Share2,
  Download,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";

export default function MyProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  // const [token, setToken] = useState(null);
  const token = localStorage.getItem("token");
  console.log(token);
  // Form state
  const [formData, setFormData] = useState({
    bio: "",
    country: "",
    governorate: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  // const token=localStorage.getItem("token");
  // console.log(token)
  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setError("لم يتم العثور على التوكن. الرجاء تسجيل الدخول مرة أخرى.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("http://localhost:9999/api/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${storedToken}`, // ✅ تم التعديل هنا
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching profile", err);
        setError(err.message);
        setLoading(false);
      });
  };

  const openEditModal = () => {
    if (profileData && profileData.profile) {
      setFormData({
        bio: profileData.profile.bio || "",
        country: profileData.profile.country || "",
        governorate: profileData.profile.governorate || "",
      });
      setPreviewImage(profileData.profile.profile_picture || null);
      setProfilePicture(null);
      setEditError(null);
      setEditSuccess(false);
      setShowEditModal(true);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setFormData({ bio: "", country: "", governorate: "" });
    setProfilePicture(null);
    setPreviewImage(null);
    setEditError(null);
    setEditSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("governorate", formData.governorate);

      if (profilePicture) {
        formDataToSend.append("profile_picture", profilePicture);
      }

      const response = await fetch(
        "http://localhost:9999/api/profile/update/",
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`, // ✅ تم التعديل هنا
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const updatedData = await response.json();
      setProfileData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updatedData,
        },
      }));

      setEditSuccess(true);
      setTimeout(() => {
        closeEditModal();
        setEditSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error updating profile", err);
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-gradient-dark">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

        {/* Particle Effects */}
        <div className="fixed inset-0 particles z-[-1]"></div>

        <div className="card-gradient p-8 text-center animate-fade-in-up">
          <div className="spinner mx-auto mb-4"></div>
          <div className="text-white text-xl font-medium">
            Loading your AI profile...
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-gradient-dark">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

        {/* Particle Effects */}
        <div className="fixed inset-0 particles z-[-1]"></div>

        <div className="card-gradient p-8 text-center animate-fade-in-up">
          <div className="text-red-400 text-lg mb-4">
            {error || "No profile data found."}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Ensure we have the required data structure
  const { user, profile } = profileData;

  if (!user || !profile) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-gradient-dark">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

        {/* Particle Effects */}
        <div className="fixed inset-0 particles z-[-1]"></div>

        <div className="card-gradient p-8 text-center animate-fade-in-up">
          <div className="text-red-400 text-lg">
            Invalid profile data structure.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-dark text-white min-h-screen overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-5 z-[-3]"></div>
      <div className="fixed inset-0 particles z-[-2]"></div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-float"></div>
      <div
        className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-10 w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Floating UI Elements */}
      <div className="absolute top-32 right-32 w-4 h-4 bg-neon-blue rounded-full opacity-60 animate-ping"></div>
      <div
        className="absolute bottom-32 left-32 w-3 h-3 bg-neon-purple rounded-full opacity-60 animate-ping"
        style={{ animationDelay: "1s" }}
      ></div>

      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Ultra-Modern Header Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-4 mb-10 animate-fade-in-down">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300 font-medium">
                  AI-Powered Profile
                </span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
              My{" "}
              <span className="relative">
                <span
                  className="gradient-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  data-text="Profile"
                >
                  Profile
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl"></div>
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Your personalized AI learning dashboard with advanced progress
              tracking, intelligent insights, and real-time performance
              analytics
            </p>

            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-cyan-400 text-sm font-medium">
                  Live Analytics
                </span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="text-purple-400 text-sm font-medium">
                  AI Insights
                </span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <span className="text-green-400 text-sm font-medium">
                  Real-time
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Ultra-Modern Profile Card */}
            <div className="lg:col-span-1">
              <div className="relative group">
                {/* Main Profile Card */}
                <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center overflow-hidden hover:border-white/20 transition-all duration-500">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Profile Picture with Modern Design */}
                  <div className="relative mb-8">
                    <div className="relative inline-block">
                      {profile.profile_picture ? (
                        <div className="relative">
                          <img
                            src={profile.profile_picture}
                            alt="Profile"
                            className="w-32 h-32 object-cover rounded-2xl border-2 border-white/20 shadow-2xl hover:scale-105 transition-all duration-300"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-2xl hover:scale-105 transition-all duration-300">
                          <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>

                      {/* AI Badge */}
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {user.username || "User"}
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm">
                    AI Learning Enthusiast
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-bold text-xl">12</span>
                      </div>
                      <p className="text-gray-400 text-xs">Achievements</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-bold text-xl">
                          4.8
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">Rating</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={openEditModal}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      Edit Profile
                    </button>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Profile Details */}
            <div className="lg:col-span-3 space-y-8">
              {/* Profile Information Card */}
              <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Profile Information
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Your personal details and preferences
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="group">
                        <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <User className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-300 text-sm font-medium mb-1">
                              Username
                            </h4>
                            <p className="text-white font-semibold">
                              {user.username || "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Mail className="w-6 h-6 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-300 text-sm font-medium mb-1">
                              Email
                            </h4>
                            <p className="text-white font-semibold">
                              {user.email || "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-6 h-6 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-300 text-sm font-medium mb-1">
                              Bio
                            </h4>
                            <p className="text-white">
                              {profile.bio || "No bio provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="group">
                        <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <MapPin className="w-6 h-6 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-300 text-sm font-medium mb-1">
                              Country
                            </h4>
                            <p className="text-white">
                              {profile.country || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {profile.governorate && (
                        <div className="group">
                          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                            <div className="w-12 h-12 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <MapPin className="w-6 h-6 text-pink-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-gray-300 text-sm font-medium mb-1">
                                Governorate
                              </h4>
                              <p className="text-white">
                                {profile.governorate}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="group">
                        <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="w-6 h-6 text-orange-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-300 text-sm font-medium mb-1">
                              Member Since
                            </h4>
                            <p className="text-white">
                              {profile.created_at
                                ? new Date(
                                    profile.created_at
                                  ).toLocaleDateString()
                                : "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced AI Progress Section */}
              <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-cyan-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        AI Learning Progress
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Your learning journey and achievements
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Lessons Completed */}
                    <div className="group relative">
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Brain className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">
                              Lessons
                            </h4>
                            <p className="text-gray-400 text-sm">Completed</p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-bold text-blue-400">
                            24
                          </span>
                          <span className="text-gray-400 text-sm">
                            this month
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">
                            +12% from last month
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Accuracy Rate */}
                    <div className="group relative">
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Target className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">
                              Accuracy
                            </h4>
                            <p className="text-gray-400 text-sm">Rate</p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-bold text-green-400">
                            87%
                          </span>
                          <span className="text-gray-400 text-sm">average</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: "87%" }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm">
                            Excellent performance
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Learning Streak */}
                    <div className="group relative">
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-6 h-6 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">Streak</h4>
                            <p className="text-gray-400 text-sm">Days</p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-bold text-purple-400">
                            15
                          </span>
                          <span className="text-gray-400 text-sm">
                            in a row
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 text-sm">
                            Keep it up!
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-white font-semibold text-lg">
                            156
                          </p>
                          <p className="text-gray-400 text-xs">Total Hours</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-semibold text-lg">
                            92%
                          </p>
                          <p className="text-gray-400 text-xs">Success Rate</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-white font-semibold text-lg">
                            2.5h
                          </p>
                          <p className="text-gray-400 text-xs">Daily Average</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-pink-400" />
                        <div>
                          <p className="text-white font-semibold text-lg">8</p>
                          <p className="text-gray-400 text-xs">Badges</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            {/* Modal Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>

            <div className="relative p-8">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Edit className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Edit Profile
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Update your personal information
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeEditModal}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Enhanced Success Message */}
              {editSuccess && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">
                    Profile updated successfully!
                  </span>
                </div>
              )}

              {/* Enhanced Error Message */}
              {editError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">{editError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Enhanced Profile Picture Upload */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
                      <Upload className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-gray-400 text-sm mt-3">
                    Click to upload new profile picture
                  </p>
                </div>

                {/* Enhanced Form Fields */}
                <div className="space-y-4">
                  {/* Bio */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                      placeholder="Enter your country"
                    />
                  </div>

                  {/* Governorate */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Governorate
                    </label>
                    <input
                      type="text"
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                      placeholder="Enter your governorate"
                    />
                  </div>
                </div>

                {/* Enhanced Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className={`flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                      editLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {editLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
