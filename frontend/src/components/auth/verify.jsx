import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Smartphone,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Lock,
  Sparkles,
} from "lucide-react";

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", "", "", "", "", ""]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next field
    if (value && index < 7) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        document.getElementById(`code-${index - 1}`).focus();
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
      }
    }
  };

  const handleSubmit = () => {
    const enteredCode = code.join("");
    navigate("/login");
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <div className="relative min-h-screen bg-gradient-dark text-white flex items-center justify-center overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

      {/* Particle Effects */}
      <div className="fixed inset-0 particles z-[-1]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-neon-blue rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute bottom-20 right-20 w-16 h-16 bg-neon-purple rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-10 w-12 h-12 bg-neon-green rounded-full opacity-20 animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="card-gradient p-10 w-full max-w-lg animate-fade-in-up shadow-glass border border-neon-blue/20 backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-4 py-2 rounded-full text-sm font-medium mb-4 border border-neon-blue/30 backdrop-blur-md">
            <Shield className="w-4 h-4 animate-pulse" />
            AI Security Verification
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Verify Your{" "}
            <span className="gradient-text" data-text="Code">
              Code
            </span>
          </h2>
          <p className="text-cyber-300">
            Enter the 8-digit verification code sent to your email or phone
          </p>
        </div>

        {/* Code Input */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center bg-cyber-800/50 border border-cyber-700/50 rounded-xl text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300 backdrop-blur-md"
                placeholder="•"
              />
            ))}
          </div>

          {/* Security Features */}
          <div className="bg-cyber-800/30 p-4 rounded-xl border border-cyber-700/50 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-neon-green" />
              <span className="text-white font-medium">Security Features</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-cyber-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                End-to-end encryption
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                AI-powered security
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                Time-limited codes
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                Secure verification
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isCodeComplete}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group ${
            isCodeComplete
              ? "btn-primary"
              : "bg-cyber-800/50 text-cyber-400 cursor-not-allowed"
          }`}
        >
          <Shield className="w-5 h-5" />
          Verify Code
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        {/* Resend Section */}
        <div className="text-center mt-6 pt-6 border-t border-cyber-700/50">
          <p className="text-cyber-300 text-sm mb-4">
            Didn't receive the code?
          </p>
          <button
            className="inline-flex items-center gap-2 text-neon-blue hover:text-neon-cyan transition-colors duration-300 font-medium group"
            onClick={() => alert("Code resent!")}
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            Resend Code
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-neon-cyan rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-neon-pink rounded-full opacity-30 animate-glow"></div>
      </div>
    </div>
  );
}
