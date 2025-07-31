import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  Brain,
  Sparkles,
  Shield,
} from "lucide-react";

export default function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!username || !email || !password) {
      setError("Please fill out all fields");
      return;
    }
    fetch(`http://localhost:9999/api/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        navigate("/VerifyCode");
      })
      .catch((err) => {
        console.error(err);
        setError("Server error. Please try again later.");
      });
  };

  return (
    <div className="relative min-h-screen bg-gradient-dark text-white flex items-center justify-center px-4 overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

      {/* Particle Effects */}
      <div className="fixed inset-0 particles z-[-1]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-neon-purple rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute bottom-20 left-20 w-16 h-16 bg-neon-green rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 right-10 w-12 h-12 bg-neon-cyan rounded-full opacity-20 animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="card-gradient p-10 w-full max-w-md animate-fade-in-up shadow-glass border border-neon-purple/20 backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-purple px-4 py-2 rounded-full text-sm font-medium mb-4 border border-neon-purple/30 backdrop-blur-md">
            <UserPlus className="w-4 h-4 animate-pulse" />
            Join Sayar AI
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Create{" "}
            <span className="gradient-text" data-text="Account">
              Account
            </span>
          </h2>
          <p className="text-cyber-300">
            Start your AI-powered speech therapy journey
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-md">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-cyber-200 flex items-center gap-2">
              <User className="w-4 h-4 text-neon-blue" />
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username"
                className="input-enhanced pr-10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <User className="w-5 h-5 text-cyber-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-cyber-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-neon-green" />
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-enhanced pr-10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Mail className="w-5 h-5 text-cyber-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-cyber-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-neon-purple" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-enhanced pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyber-400 hover:text-neon-purple transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-cyber-800/30 p-4 rounded-xl border border-cyber-700/50">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-green" />
              Security Features
            </h4>
            <ul className="space-y-2 text-xs text-cyber-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neon-green rounded-full"></div>
                End-to-end encryption
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neon-green rounded-full"></div>
                AI-powered security monitoring
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neon-green rounded-full"></div>
                Secure data storage
              </li>
            </ul>
          </div>

          <button
            onClick={handleSubmit}
            className="btn-primary w-full inline-flex items-center justify-center gap-2 group"
          >
            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Create Account
          </button>

          <div className="text-center pt-4 border-t border-cyber-700/50">
            <p className="text-cyber-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-neon-blue hover:text-neon-cyan transition-colors duration-300 hover:underline"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-neon-cyan rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-neon-pink rounded-full opacity-30 animate-glow"></div>
      </div>
    </div>
  );
}
