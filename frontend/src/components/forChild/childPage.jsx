import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaVolumeUp } from "react-icons/fa";
import { Check } from "lucide-react";
import Navbar from "../navbar";
import {
  Volume2,
  Brain,
  Target,
  Trophy,
  Star,
  Sparkles,
  ArrowRight,
  Play,
  BookOpen,
  Award,
} from "lucide-react";

export default function ChildPage() {
  const navigate = useNavigate();
  const {lan } = useParams();
  const token=localStorage.getItem("token");
  console.log(token)
  const [letters, setLetters] = useState([]);
  const [completedLetters, setCompletedLetters] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:9999/api/${lan}/letters/`)
      .then((res) => res.json())
      .then((data) => {
        setLetters(data.letters);
        const passed = JSON.parse(localStorage.getItem("passedLevels")) || [];
        const counts = passed.reduce((acc, { letter }) => {
          acc[letter] = (acc[letter] || 0) + 1;
          return acc;
        }, {});

        const completed = Object.keys(counts).filter(
          (letter) => counts[letter] === 5
        );
        setCompletedLetters(completed);
      });
  }, []);

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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <Brain className="w-4 h-4 animate-pulse" />
              AI Alphabet Learning
            </div>
            <h1 className="text-responsive-xl font-bold text-white mb-4">
              {lan === "en" ? "Learn the" : "تعلم"}{" "}
              <span className="gradient-text" data-text="Alphabet">
                Alphabet
              </span>
              !
            </h1>
            <p className="text-cyber-300 text-lg max-w-2xl mx-auto">
              {lan === "en"
                ? "Tap on a letter to start your AI-powered learning journey!"
                : "اضغط على حرف لبدء رحلة التعلم المدعومة بالذكاء الاصطناعي!"}
            </p>
          </div>

          {/* Progress Summary */}
          <div className="mb-12">
            <div className="card-gradient p-6 rounded-2xl border border-neon-green/20 backdrop-blur-md animate-fade-in-up">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Trophy className="w-6 h-6 text-neon-yellow" />
                <span className="text-white font-semibold">
                  {lan === "en" ? "Progress" : "التقدم"}:{" "}
                  {completedLetters.length}/{letters.length} Letters Completed
                </span>
              </div>
              <div className="w-full bg-cyber-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-neon rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (completedLetters.length / letters.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Letters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {letters.map((elem, index) => {
              const isCompleted = completedLetters.includes(elem.letter);

              return (
                <button
                  key={index}
                  onClick={() =>
                    navigate(`/FiveLevelPage/${lan}/${elem.letter}`)
                  }
                  className={`group relative card-gradient p-6 rounded-2xl shadow-glass border transition-all duration-300 hover-lift ${
                    isCompleted ? "border-neon-green/30" : "border-cyber-700/50"
                  } backdrop-blur-md animate-fade-in-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Background Glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-20 ${
                      isCompleted ? "bg-neon-green" : "bg-cyber-800"
                    }`}
                  ></div>

                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                      <Check className="w-16 h-16 text-green-500" />
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`text-5xl font-extrabold mb-4 ${
                        isCompleted ? "text-white" : "text-cyber-200"
                      }`}
                    >
                      {elem.letter}
                    </div>

                    <div
                      className={`flex items-center gap-2 ${
                        isCompleted ? "text-neon-green" : "text-cyber-400"
                      }`}
                    >
                      <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-medium">
                        {isCompleted
                          ? lan === "en"
                            ? "Completed"
                            : "مكتمل"
                          : lan === "en"
                          ? "Tap to Start"
                          : "اضغط للبدء"}
                      </span>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-4 h-4 text-neon-blue group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Achievement Section */}
          {completedLetters.length > 0 && (
            <div className="mt-16 text-center">
              <div className="card-gradient p-8 rounded-3xl border border-neon-yellow/20 backdrop-blur-md animate-fade-in-up">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Award className="w-8 h-8 text-neon-yellow" />
                  <h2 className="text-2xl font-bold text-white">
                    {lan === "en"
                      ? "Achievements Unlocked!"
                      : "إنجازات مفتوحة!"}
                  </h2>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {completedLetters.map((letter, index) => (
                    <div
                      key={index}
                      className="bg-neon-green/20 px-4 py-2 rounded-full border border-neon-green/30"
                    >
                      <span className="text-neon-green font-bold">
                        {letter}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
