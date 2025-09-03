// LevelPage.jsx
import React, { useEffect, useRef, useState, useMemo } from "react"; // Ensure useMemo is imported
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../navbar";
import VoicePopup from "../forChild/voicePopup"; // Import the updated VoicePopup
import goodSound from "../../assets/sound/goodresult-82807.mp3";
import failSound from "../../assets/sound/failed-295059.mp3";
import {
  Mic,
  ArrowRight,
  ArrowLeft,
  Target,
  Trophy,
  Star,
  Play,
  Pause,
} from "lucide-react";

export default function LevelPage() {
  const [currentLevel, setCurrentLevel] = useState({});
  const [nextLevel, setNextLevel] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState(null); // Keeps the final result for display
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const { lan, letter, level } = useParams();
  const token = localStorage.getItem("token");
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Memoized function to compare target_word with reference and highlight differences
  const compareWords = useMemo(() => {
    if (!result?.target_word || !result?.reference) {
      return null;
    }

    const target = result.target_word;
    const reference = result.reference;
    const maxLength = Math.max(target.length, reference.length);

    const resultArray = [];

    for (let i = 0; i < maxLength; i++) {
      const targetChar = target[i] || "";
      const referenceChar = reference[i] || "";

      if (targetChar === referenceChar) {
        // Correct character - green
        resultArray.push(
          <span key={i} style={{ color: "#10b981", fontWeight: "bold" }}>
            {targetChar}
          </span>
        );
      } else {
        // Incorrect character - red
        resultArray.push(
          <span key={i} style={{ color: "#ef4444", fontWeight: "bold" }}>
            {targetChar || "?"}
          </span>
        );
      }
    }

    return resultArray;
  }, [result?.target_word, result?.reference]);

  // Memoized function for highlighting (as provided previously)
  const highlightedWord = useMemo(() => {
    if (!currentLevel.test || !currentLevel.letter || result === null) {
      return currentLevel.test || "";
    }

    const word = currentLevel.test;
    const targetLetter = currentLevel.letter;

    if (result?.test_passed === false) {
      const escapedTargetLetter = targetLetter.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      const parts = word.split(new RegExp(`(${escapedTargetLetter})`, "g"));

      return parts.map((part, index) =>
        part === targetLetter ? (
          <span key={index} style={{ color: "red", fontWeight: "bold" }}>
            {part}
          </span>
        ) : (
          part
        )
      );
    } else {
      return word;
    }
  }, [currentLevel.test, currentLevel.letter, result]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();

        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(
      `http://localhost:9999/api/${lan}/levels/${letter}/?_t=${timestamp}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        // No need to filter by letter since API now returns only levels for this letter
        const allLevels = data.levels || data; // Handle both array and object responses

        const current = allLevels.find(
          (elem) => String(elem.level) === String(level)
        );

        const next = allLevels.find(
          (elem) => Number(elem.level) === Number(level) + 1
        );

        console.log("All levels:", allLevels);
        console.log("Looking for level:", level);
        console.log("Matched current:", current);
        console.log("Matched next:", next);

        setCurrentLevel(current || {});
        setNextLevel(next || null);
      })
      .catch((err) => {
        console.error("Failed to fetch levels:", err);
      });
  }, [lan, letter, level]);

  useEffect(() => {
    if (!audioRef.current) return;
    const baseUrl = "http://localhost:9999"; // عدّل إذا كان سيرفرك على بورت/دومين مختلف
    const src = currentLevel.media_url
      ? `${baseUrl}${currentLevel.media_url}`
      : `${baseUrl}/media/${lan}_${currentLevel.letter || letter}_${
          currentLevel.level || level
        }.wav`; // fallback لبناء اسم الملف من المسار
    audioRef.current.src = src;
  }, [currentLevel, lan, letter, level]);
  // Depend on currentLevel to update src

  useEffect(() => {
    if (result) {
      const audio = new Audio(result.test_passed ? goodSound : failSound);
      audio.play().catch((err) => console.warn("فشل تشغيل الصوت:", err));
    }
  }, [result]);

  const handleNextLevel = () => {
    setResult(null);
    const passed = JSON.parse(localStorage.getItem("passedLevels")) || [];
    const newPassed = {
      letter: currentLevel.letter,
      level: currentLevel.level,
    };
    const alreadyPassed = passed.some(
      (item) =>
        item.letter === newPassed.letter && item.level === newPassed.level
    );
    if (!alreadyPassed) {
      passed.push(newPassed);
      localStorage.setItem("passedLevels", JSON.stringify(passed));
    }
    if (!nextLevel) {
      navigate(`/ChildPage/${lan}`);
      return;
    }
    navigate(`/levelPage/${lan}/${nextLevel.letter}/${nextLevel.level}`);
  };

  const handlePopupResult = (popupResult) => {
    console.log("handlePopupResult called with:", popupResult);
    if (popupResult?.test_passed) {
      console.log("Test passed! Saving to localStorage...");
      setResult(popupResult); // تحديث حالة النتيجة في LevelPage فقط إذا نجحت

      // Save to localStorage when user passes the test
      const passed = JSON.parse(localStorage.getItem("passedLevels")) || [];
      const newPassed = {
        letter: currentLevel.letter,
        level: currentLevel.level,
      };
      console.log("New passed level to save:", newPassed);
      console.log("Current passed levels:", passed);

      const alreadyPassed = passed.some(
        (item) =>
          item.letter === newPassed.letter && item.level === newPassed.level
      );
      console.log("Already passed:", alreadyPassed);

      if (!alreadyPassed) {
        passed.push(newPassed);
        localStorage.setItem("passedLevels", JSON.stringify(passed));
        console.log("Level passed and saved to localStorage:", newPassed);
        console.log("Updated passed levels:", passed);
      } else {
        console.log("Level already in localStorage");
      }
    } else {
      console.log("Test failed or no test_passed property");
    }
    // إذا فشلت، VoicePopup يتعامل معها داخلياً ولا يرسلها هنا
  };

  // Check if current level is passed
  const isCurrentLevelPassed = () => {
    const passed = JSON.parse(localStorage.getItem("passedLevels")) || [];
    console.log("Checking if level passed:");
    console.log("Current level:", currentLevel.letter, currentLevel.level);
    console.log("Passed levels in localStorage:", passed);

    const isPassed = passed.some(
      (item) =>
        item.letter === currentLevel.letter && item.level === currentLevel.level
    );

    console.log("Is passed:", isPassed);
    return isPassed;
  };

  return (
    <div className="relative min-h-screen bg-gradient-dark text-white overflow-hidden">
      {/* AI Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse"></div>

      <Navbar isUser={!!token} />

      <div className="pt-28 pb-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(`/FiveLevelPage/${lan}/${letter}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-800 to-cyber-700 text-cyber-300 hover:text-white rounded-lg border border-cyber-600 hover:border-neon-blue transition-all duration-300 hover:shadow-neon-blue/20"
            >
              <ArrowLeft className="w-4 h-4" />
              {lan === "en" ? "Back" : "رجوع"}
            </button>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-hologram text-neon-blue px-8 py-4 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <Target className="w-4 h-4 animate-pulse" />
              AI Learning Level {level}
            </div>
            <h1 className="text-responsive-xl font-bold text-white mb-4">
              Master the{" "}
              <span className="gradient-text" data-text={letter}>
                Letter
              </span>
            </h1>
            <p className="text-cyber-300 text-lg">
              Practice pronunciation and recognition with AI-powered feedback
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 text-sm font-medium">
                AI-Powered Voice Analysis
              </span>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
          <div className="card-gradient p-10 rounded-3xl shadow-glass border border-neon-blue/20 backdrop-blur-md animate-fade-in-up relative overflow-hidden">
            {/* AI Processing Grid Background */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-12 gap-1 h-full">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-cyan-400 animate-pulse"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  ></div>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center w-full lg:space-x-10 relative z-10">
              <div className="flex flex-col items-center mb-8 lg:mb-0">
                <div className="relative">
                  <div className="bg-gradient-neon w-72 h-72 rounded-full flex justify-center items-center shadow-neon-blue neon-glow animate-pulse">
                    <h1 className="text-cyber-950 text-9xl font-extrabold">
                      {currentLevel.letter}
                    </h1>
                  </div>
                  <div className="absolute inset-0 bg-gradient-neon rounded-full opacity-30 animate-pulse"></div>
                  {/* AI Indicator */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-neon-yellow" />
                    <span className="text-white font-semibold">
                      Level {level}
                    </span>
                  </div>
                  <div className="w-32 h-2 bg-cyber-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-neon rounded-full animate-pulse"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                {/* Use the highlightedWord */}
                <h2 className="text-5xl font-bold text-white mb-6">
                  {highlightedWord}
                </h2>
                <div className="relative mb-8">
                  <img
                    src={currentLevel.wordImage}
                    alt={`Word image for ${currentLevel.test}`}
                    className="w-80 h-64 object-contain rounded-2xl shadow-neon-blue hover-scale border border-neon-blue/30"
                  />
                  <div className="absolute inset-0 bg-gradient-neon rounded-2xl opacity-10 animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-6">
                  <audio className="hidden" ref={audioRef} controls />
                  <button
                    onClick={handlePlay}
                    className="w-16 h-16 bg-gradient-neon hover:bg-neon-blue rounded-full shadow-neon-blue hover:shadow-neon-blue/50 transition-all duration-300 flex items-center justify-center group neon-glow"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-cyber-950" />
                    ) : (
                      <Play className="w-8 h-8 text-cyber-950" />
                    )}
                  </button>
                  {/* AI Voice Recording Button */}
                  <button
                    onClick={() => setShowPopup(true)}
                    className="w-16 h-16 bg-gradient-to-r from-neon-green to-cyan-500 rounded-full shadow-neon-green hover:shadow-neon-green/50 transition-all duration-300 flex items-center justify-center group animate-pulse relative overflow-hidden"
                  >
                    <Mic className="w-8 h-8 text-cyber-950 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-neon-green animate-pulse"></div>
                    {/* AI Indicator */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  </button>

                  {/* Next Level Button - Only show if current level is passed */}
                  {nextLevel && isCurrentLevelPassed() && (
                    <button
                      onClick={handleNextLevel}
                      className="w-16 h-16 bg-gradient-neon hover:bg-neon-purple rounded-full shadow-neon-blue hover:shadow-neon-purple/50 transition-all duration-300 flex items-center justify-center group neon-glow"
                    >
                      <ArrowRight className="w-8 h-8 text-cyber-950 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  )}
                </div>

                {/* AI Result Display */}
                {result && (
                  <div className="mt-6 text-center">
                    <div className="bg-gradient-to-r from-cyber-800 to-cyber-700 p-6 rounded-xl border border-cyan-500/20 mb-4">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            AI
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-cyan-400">
                          نتيجة تحليل الذكاء الاصطناعي:
                        </p>
                      </div>

                      <p
                        className={`text-lg font-semibold ${
                          result?.test_passed
                            ? "text-green-400"
                            : "text-red-300"
                        }`}
                      >
                        {result?.test_passed ? (
                          `✅تهانينا ! لقد لفظت الحرف المستهدف بشكل صحيح`
                        ) : (
                          <>
                            حاول مرة أخرى ❌، لم تقم بلفظ الحرف المستهدف{" "}
                            <span
                              className="font-bold text-2xl shadow-2xl"
                              style={{ color: "blue" }}
                            >
                              ( {letter} )
                            </span>{" "}
                            بشكل صحيح
                          </>
                        )}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <span className="text-cyber-200 text-sm">
                          نسبة التطابق:
                        </span>
                        <span className="text-cyan-400 font-bold">
                          {result.similarity_percentage}%
                        </span>
                        <span className="text-cyber-400 text-xs">
                          (AI Analysis)
                        </span>
                      </div>
                    </div>

                    {/* Display word comparison if available */}
                    {result.target_word && result.reference && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-cyber-800 to-cyber-700 rounded-xl border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                          <p className="text-sm text-cyber-300 font-medium">
                            تحليل الذكاء الاصطناعي:
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="bg-cyber-900 p-3 rounded-lg">
                            <span className="text-sm text-cyber-300">
                              ما قلته:{" "}
                            </span>
                            <span className="font-arabic text-xl">
                              {compareWords}
                            </span>
                          </div>
                          <div className="bg-cyber-900 p-3 rounded-lg">
                            <span className="text-sm text-cyber-300">
                              الكلمة الصحيحة:{" "}
                            </span>
                            <span className="font-arabic text-xl text-green-400">
                              {result.target_word}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-cyber-400">
                          <span>
                            <span style={{ color: "#10b981" }}>■</span> صحيح
                          </span>
                          <span>
                            <span style={{ color: "#ef4444" }}> ■</span> خطأ
                          </span>
                          <span className="text-cyan-400">AI Powered</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pass necessary props to VoicePopup */}
      {/* // LevelPage.jsx (داخل return, جزء عرض VoicePopup) */}
      {showPopup && (
        <VoicePopup
          targetWord={currentLevel.test} // تمرير الكلمة المستهدفة
          targetLetter={currentLevel.letter} // تمرير الحرف المستهدف
          onClose={() => {
            // هذه الدالة تُستدعى فقط عند الضغط على زر X أو عند الإغلاق التلقائي الناجح
            setShowPopup(false);
            // لا حاجة لإعادة تعيين result هنا، لأن VoicePopup يتعامل مع النتيجة داخلياً
            // وتُعاد تعيين result في LevelPage فقط عند النجاح عبر onResult
          }}
          onResult={(data) => {
            // هذه الدالة تُستدعى فقط من VoicePopup عندما تكون النتيجة صحيحة
            handlePopupResult(data); // تحديث حالة النتيجة في LevelPage
            setShowPopup(false); // التأكد من إغلاق البوب آب (رغم الإغلاق التلقائي)
          }}
        />
      )}
    </div>
  );
}
