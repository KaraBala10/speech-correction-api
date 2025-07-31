import { useNavigate, useParams } from "react-router-dom";
import { GoCheckCircle } from "react-icons/go";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../navbar";
import {
  Target,
  Trophy,
  Star,
  ArrowRight,
  Brain,
  Sparkles,
  Lock,
  Unlock,
  Play,
  ArrowLeft,
} from "lucide-react";

export default function FiveLevelPage() {
  const { lan, letter } = useParams();
  const navigate = useNavigate();
  const [letterTasks, setLetterTasks] = useState([]);
  const [passedLevels, setPassedLevels] = useState([]);
  const token = localStorage.getItem("token");
  console.log(token);
  // const levelColors = [
  //   "neon-red",
  //   "neon-orange",
  //   "neon-purple",
  //   "neon-pink",
  //   "neon-green",
  // ];

  useEffect(() => {
    fetch(`http://localhost:9999/api/${lan}/levels/${letter}/`)
      .then((res) => res.json())
      .then((data) => {
        // No need to filter by letter since API now returns only levels for this letter
        setLetterTasks(data.levels || data); // Handle both array and object responses
      });
    const passed = JSON.parse(localStorage.getItem("passedLevels")) || [];
    setPassedLevels(passed);
  }, [lan, letter]);

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

      <Navbar isUser={token ? true : false} />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-800 to-cyber-700 text-cyber-300 hover:text-white rounded-lg border border-cyber-600 hover:border-neon-blue transition-all duration-300 hover:shadow-neon-blue/20"
            >
              <ArrowLeft className="w-4 h-4" />
              {lan === "en" ? "Back" : "رجوع"}
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <Target className="w-4 h-4 animate-pulse" />
              AI Learning Journey
            </div>
            <h1 className="text-responsive-xl font-bold text-white mb-4">
              Master{" "}
              <span className="gradient-text" data-text={letter}>
                {letter}
              </span>
            </h1>
            <p className="text-cyber-300 text-lg">
              Complete all five levels to unlock the next letter in your
              AI-powered learning journey
            </p>
          </div>

          {/* Letter Circle */}
          <div className="flex justify-center mb-16">
            <div className="relative">
              <div className="bg-gradient-neon w-56 h-56 flex justify-center items-center rounded-full shadow-neon-blue neon-glow animate-pulse">
                <h1 className="text-9xl text-cyber-950 font-extrabold">
                  {letter}
                </h1>
              </div>
              <div className="absolute inset-0 bg-gradient-neon rounded-full opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center mb-12">
            <div className="card-gradient p-6 rounded-2xl border border-neon-green/20 backdrop-blur-md animate-fade-in-up">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-3">
                <Trophy className="w-6 h-6 text-neon-green" />
                {lan === "en" ? "Complete Five Levels" : "أكمل خمسة مستويات"}
              </h2>
              <p className="text-cyber-300">
                {lan === "en"
                  ? "You have five levels to pass in order to move on to the next letter."
                  : "لديك خمسة مستويات يجب عليك اجتيازها حتى تتمكن من الانتقال إلى الحرف التالي"}
              </p>
            </div>
          </div>

          {/* Levels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {letterTasks.map((task, index) => {
              const isPassed = passedLevels.some(
                (p) => p.letter === task.letter && p.level === task.level
              );

              return (
                <button
                  onClick={() =>
                    navigate(`/levelPage/${lan}/${letter}/${task.level}`)
                  }
                  key={index}
                  className={`group relative card-gradient p-6 rounded-2xl shadow-glass border transition-all duration-300 hover-lift ${
                    isPassed ? "border-neon-green/30" : "border-cyber-700/50"
                  } backdrop-blur-md animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-20 ${
                      isPassed ? "bg-neon-green" : "bg-cyber-800"
                    }`}
                  ></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isPassed
                            ? "bg-gradient-neon text-cyber-950 neon-glow"
                            : "bg-cyber-800/50 text-cyber-400"
                        }`}
                      >
                        {isPassed ? (
                          <Play className="w-6 h-6" />
                        ) : (
                          <Lock className="w-6 h-6" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white">
                          {lan === "en" ? "Level" : "المرحلة"} {task.level}
                        </h3>
                        <p className="text-cyber-300 text-sm">
                          {isPassed
                            ? lan === "en"
                              ? "Completed"
                              : "مكتمل"
                            : lan === "en"
                            ? "Locked"
                            : "مغلق"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${
                        isPassed ? "text-neon-green" : "text-cyber-400"
                      }`}
                    >
                      {isPassed ? (
                        <>
                          <Check className="w-8 h-8 text-green-400" />
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  {isPassed && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mt-12 text-center">
            <div className="card-gradient p-6 rounded-2xl border border-neon-blue/20 backdrop-blur-md">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Star className="w-6 h-6 text-neon-yellow" />
                <span className="text-white font-semibold">
                  {lan === "en" ? "Progress" : "التقدم"}:{" "}
                  {passedLevels.filter((p) => p.letter === letter).length}/5
                </span>
              </div>
              <div className="w-full bg-cyber-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-neon rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (passedLevels.filter((p) => p.letter === letter).length /
                        5) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
