import { Link, useParams } from "react-router-dom";
import sk from "../../../model/skills.json";
import {
  Brain,
  Target,
  BookOpen,
  Users,
  ArrowRight,
  Sparkles,
  Trophy,
  Star,
  GraduationCap,
  Lightbulb,
} from "lucide-react";

export default function AdultPage() {
  const token  = localStorage.getItem("token")
  const userName=localStorage.getItem("userName")
  const skills = sk;

  return (
    <div className="relative min-h-screen bg-gradient-dark text-white overflow-hidden">
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

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <Users className="w-4 h-4 animate-pulse" />
              AI-Powered Adult Learning
            </div>
            <h1 className="text-responsive-xl font-bold text-white mb-6">
              Hello{" "}
              <span className="gradient-text" data-text="Name">
                {userName}
              </span>
              , let's have a wonderful and useful time.
            </h1>
            <p className="text-cyber-300 text-lg max-w-2xl mx-auto">
              Choose the suitable quiz and enhance your skills with AI-powered
              learning technology
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((elem, i) => (
              <Link
                to={`/${elem.skillName}`}
                key={i}
                className="group block"
              >
                <div
                  className="card-gradient p-8 rounded-2xl shadow-glass border border-cyber-700/50 backdrop-blur-md hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow mb-6">
                    <BookOpen className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors duration-300">
                    {elem.skillName}
                  </h3>
                  <p className="text-cyber-300 text-sm mb-6 leading-relaxed">
                    {elem.skillDesc}
                  </p>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neon-blue group-hover:text-neon-cyan transition-colors duration-300">
                      <span className="text-sm font-medium">
                        Start Learning
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    {/* Skill Level Indicator */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className="w-2 h-2 bg-cyber-700 rounded-full"
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-neon rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-gradient p-6 rounded-2xl border border-neon-green/20 backdrop-blur-md text-center">
              <div className="w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow mx-auto mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Personalized Learning
              </h3>
              <p className="text-cyber-300 text-sm">
                AI adapts to your learning pace and style
              </p>
            </div>

            <div className="card-gradient p-6 rounded-2xl border border-neon-purple/20 backdrop-blur-md text-center">
              <div className="w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow mx-auto mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Progress Tracking
              </h3>
              <p className="text-cyber-300 text-sm">
                Monitor your improvement with detailed analytics
              </p>
            </div>

            <div className="card-gradient p-6 rounded-2xl border border-neon-cyan/20 backdrop-blur-md text-center">
              <div className="w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow mx-auto mb-4">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Smart Recommendations
              </h3>
              <p className="text-cyber-300 text-sm">
                Get AI-powered suggestions for next steps
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
