import { Link, useParams } from "react-router-dom";
import { Globe, Languages, ArrowRight, Brain, Sparkles } from "lucide-react";

export default function LanguagePage() {
  // const { token } = useParams();
  const token=localStorage.getItem("token");
  console.log(token)
  return (
    <div className="relative min-h-screen bg-gradient-dark text-white flex items-center justify-center overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

      {/* Particle Effects */}
      <div className="fixed inset-0 particles z-[-1]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-neon-blue rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute bottom-20 right-20 w-16 h-16 bg-neon-green rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-10 w-12 h-12 bg-neon-purple rounded-full opacity-20 animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="card-gradient p-12 max-w-lg text-center animate-fade-in-up shadow-glass border border-neon-blue/20 backdrop-blur-md">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-4 py-2 rounded-full text-sm font-medium mb-4 border border-neon-blue/30 backdrop-blur-md">
            <Languages className="w-4 h-4 animate-pulse" />
            AI Language Selection
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Choose Your{" "}
            <span className="gradient-text" data-text="Language">
              Language
            </span>
          </h2>
          <p className="text-cyber-300">
            Select your preferred language to continue your AI-powered learning
            journey
          </p>
        </div>

        <div className="space-y-6">
          <Link to="/ChildPage/ar" className="group block">
            <div className="card-gradient p-6 hover-lift border border-neon-blue/30 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">العربية</h3>
                    <p className="text-cyber-300 text-sm">Arabic</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neon-blue group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>

          <Link to="/ChildPage/en" className="group block">
            <div className="card-gradient p-6 hover-lift border border-neon-green/30 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">English</h3>
                    <p className="text-cyber-300 text-sm">الإنجليزية</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neon-green group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-neon-cyan rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-neon-pink rounded-full opacity-30 animate-glow"></div>
      </div>
    </div>
  );
}
