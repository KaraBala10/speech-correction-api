// VoicePopup.jsx
import React, { useEffect, useRef, useState, useMemo } from "react"; // تأكد من استيراد useMemo
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import { X } from "lucide-react";
import goodSound from "../../assets/sound/goodresult-82807.mp3";
import failSound from "../../assets/sound/failed-295059.mp3";

export default function VoicePopup({
  targetWord,
  targetLetter,
  onClose,
  onResult,
}) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localResult, setLocalResult] = useState(null); // حالة جديدة للنتيجة داخل البوب آب

  // Memoized function to compare target_word with reference and highlight differences
  const compareWords = useMemo(() => {
    if (!localResult?.target_word || !localResult?.reference) {
      return null;
    }

    const userSaid = localResult.reference; // What user actually pronounced
    const correctWord = localResult.target_word; // Correct word
    const maxLength = Math.max(userSaid.length, correctWord.length);

    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const userChar = userSaid[i] || "";
      const correctChar = correctWord[i] || "";

      if (userChar === correctChar) {
        // Correct character - green
        result.push(
          <span key={i} style={{ color: "#10b981", fontWeight: "bold" }}>
            {userChar}
          </span>
        );
      } else {
        // Incorrect character - red
        result.push(
          <span key={i} style={{ color: "#ef4444", fontWeight: "bold" }}>
            {userChar || "?"}
          </span>
        );
      }
    }

    return result;
  }, [localResult?.target_word, localResult?.reference]);

  // Memoized function to highlight the target letter in the word if the test failed
  const highlightedTargetWord = useMemo(() => {
    // تحقق من توفر البيانات
    if (!targetWord || !targetLetter || !localResult) {
      return targetWord || ""; // عرض الكلمة العادية إذا لم تتوفر البيانات
    }

    // نفذ البروسيس فقط إذا كانت النتيجة خاطئة
    if (localResult?.test_passed === false) {
      const word = targetWord;
      const letter = targetLetter;

      // تجهيز الحرف للبحث (تجاهل الأحرف الخاصة في الـ Regex)
      const escapedLetter = letter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // تقسيم الكلمة إلى أجزاء بناءً على الحرف المستهدف
      // الاقواس () في الـ Regex تضمن إبقاء الحرف نفسه في المصفوفة
      const parts = word.split(new RegExp(`(${escapedLetter})`, "g"));

      // تعيين أجزاء الكلمة مع تلوين الحرف المستهدف
      return parts.map((part, index) =>
        part === letter ? (
          // إذا كان الجزء هو الحرف المستهدف، نلونه بالأحمر
          <span key={index} style={{ color: "red", fontWeight: "bold" }}>
            {part}
          </span>
        ) : (
          // إذا لم يكن، نعرضه بشكل طبيعي
          part
        )
      );
    } else {
      // إذا كانت النتيجة صحيحة أو لم تُحسب بعد، نعرض الكلمة العادية
      return targetWord;
    }
  }, [targetWord, targetLetter, localResult]); // أعد الحساب فقط إذا تغيرت هذه القيم

  useEffect(() => {
    if (isListening && waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#0ff",
        interact: false,
        cursorWidth: 0,
        height: 100,
        plugins: [MicrophonePlugin.create()],
      });

      wavesurfer.current.on("error", (e) => {
        console.error("WaveSurfer error:", e);
      });

      wavesurfer.current.microphone.on("deviceReady", () => {
        console.log("🎙️ Microphone ready");
      });

      wavesurfer.current.microphone.on("deviceError", (err) => {
        console.error("🎤 Microphone error:", err);
      });

      wavesurfer.current.microphone.start();
    }

    return () => {
      // تأكد من إيقاف وإزالة WaveSurfer بشكل نظيف
      if (wavesurfer.current) {
        // إيقاف المايكروفون أولاً إذا كان قيد التشغيل
        if (wavesurfer.current.microphone && isListening) {
          try {
            wavesurfer.current.microphone.stop();
          } catch (e) {
            console.log("خطأ طفيف أثناء إيقاف المايكروفون في Cleanup:", e);
          }
        }
        try {
          wavesurfer.current.destroy();
        } catch (e) {
          console.log("خطأ طفيف أثناء تدمير WaveSurfer:", e);
        }
        wavesurfer.current = null;
      }
    };
  }, [isListening]); // أضف isListening كـ dependency

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setAudioChunks([]);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((prev) => [...prev, e.data]);
        }
      };
      recorder.start();
      setIsListening(true);
      setMediaRecorder(recorder);
      setLocalResult(null); // إعادة تعيين النتيجة السابقة عند بدء تسجيل جديد
    } catch (err) {
      console.error("فشل الوصول للمايكروفون:", err);
      // يمكنك هنا عرض رسالة خطأ للمستخدم داخل البوب آب إذا أردت
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.onstop = async () => {
        setIsListening(false);
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recorded_audio.webm");
        formData.append("target_word", targetWord); // استخدام الـ prop
        formData.append("target_char", targetLetter); // استخدام الـ prop

        try {
          setIsProcessing(true);
          const response = await fetch(
            "http://localhost:9999/api/transcribe/",
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();

          setLocalResult(data); // عرض النتيجة داخل البوب آب فوراً

          // تشغيل الصوت بناءً على النتيجة
          const audio = new Audio(data.test_passed ? goodSound : failSound);
          audio
            .play()
            .catch((err) => console.warn("فشل تشغيل الصوت في البوب اب:", err));

          // Remove auto-close functionality - let user close manually
          // if (data.test_passed && onResult) {
          //   setTimeout(() => {
          //     onResult(data); // إرسال النتيجة لـ LevelPage
          //     if (onClose) onClose(); // إغلاق البوب آب
          //   }, 2000); // إغلاق تلقائي بعد ثانيتين مثلاً
          // }
        } catch (err) {
          console.error("❌ فشل إرسال الصوت:", err);
          setLocalResult({ error: "فشل في معالجة الصوت" }); // عرض خطأ في البوب آب
        } finally {
          setIsProcessing(false);
        }
      };
      mediaRecorder.stop();
    } else {
      setIsListening(false);
      console.log("⚠️ ما في تسجيل نشط ليتوقف.");
    }
  };

  // دالة لإعادة المحاولة (إعادة تعيين النتيجة وبدء التسجيل)
  const handleRetry = () => {
    setLocalResult(null);
    startRecording(); // بدء التسجيل الجديد مباشرة
  };

  // Toggle recording state
  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50"
      onClick={(e) => {
        // Close popup when clicking outside
        if (e.target === e.currentTarget) {
          if (onClose) {
            onClose();
          }
        }
      }}
    >
      <div className="bg-cyber-900 p-6 rounded-2xl shadow-xl border border-neon-green/40 min-w-[400px] max-w-lg relative overflow-hidden">
        {/* AI Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse"></div>

        {/* AI Processing Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 gap-1 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="bg-cyan-400 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* زر الإغلاق المحدث */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            console.log("X button clicked");
            // تأكد من إيقاف التسجيل إن كان قيد التشغيل
            if (mediaRecorder && mediaRecorder.state === "recording") {
              try {
                mediaRecorder.stop();
                console.log("Stopped media recorder");
              } catch (e) {
                console.log("خطأ طفيف أثناء إيقاف التسجيل من زر X:", e);
              }
            }
            // أوقف WaveSurfer إن كان يعمل
            if (wavesurfer.current) {
              try {
                if (wavesurfer.current.microphone && isListening) {
                  wavesurfer.current.microphone.stop();
                  console.log("Stopped microphone");
                }
                wavesurfer.current.destroy();
                console.log("Destroyed wavesurfer");
              } catch (e) {
                console.log("خطأ طفيف أثناء إيقاف WaveSurfer من زر X:", e);
              }
            }
            // أعد تعيين الحالات
            setIsListening(false);
            setMediaRecorder(null);
            setAudioChunks([]);
            setIsProcessing(false);
            setLocalResult(null);
            console.log("Reset all states");
            // أغلق البوب آب
            if (onClose) {
              console.log("Calling onClose function");
              onClose();
            } else {
              console.log("onClose function is not provided");
            }
          }}
          className="absolute top-4 right-4 text-neon-green hover:text-white transition z-10 hover:scale-110 cursor-pointer bg-cyber-800 hover:bg-cyber-700 rounded-full p-1"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          {/* AI Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <h2 className="text-2xl font-bold text-white">🎤 تسجيل صوتك</h2>
            </div>
            <p className="text-cyber-300 text-sm">
              سيتم تحليل صوتك باستخدام الذكاء الاصطناعي
            </p>
          </div>

          <div
            ref={waveformRef}
            className="w-full h-[100px] bg-cyber-800 rounded-xl overflow-hidden mb-4 border border-cyan-500/30"
          />

          {/* AI Processing Indicator */}
          {isProcessing && !localResult && (
            <div className="text-center mt-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
                <div
                  className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <p className="text-neon-blue animate-pulse font-medium">
                🔎 جارٍ تحليل الصوت بالذكاء الاصطناعي...
              </p>
              <p className="text-cyber-400 text-xs mt-1">
                AI is analyzing your pronunciation
              </p>
            </div>
          )}

          {localResult && (
            <div className="text-center mt-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <h3 className="text-xl font-semibold text-neon-green">
                  نتيجة التحليل:
                </h3>
              </div>

              {localResult.error ? (
                <p className="text-red-400 text-lg">{localResult.error}</p>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-cyber-800 to-cyber-700 p-4 rounded-xl border border-cyan-500/20 mb-4">
                    <p
                      className={`text-lg ${
                        localResult.test_passed
                          ? "text-green-400"
                          : "text-red-300"
                      }`}
                    >
                      {localResult.test_passed
                        ? "✅ تهانينا! لقد لفظت الحرف المستهدف بشكل صحيح"
                        : `❌ حاول مرة أخرى، لم تلفظ الحرف "${targetLetter}" بشكل صحيح.`}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-cyber-200 text-sm">
                        نسبة التطابق:
                      </span>
                      <span className="text-cyan-400 font-bold">
                        {localResult.similarity_percentage}%
                      </span>
                      <span className="text-cyber-400 text-xs">
                        (AI Analysis)
                      </span>
                    </div>
                  </div>

                  {/* Display word comparison if available */}
                  {localResult.target_word && localResult.reference && (
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
                            {localResult.target_word}
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

                  {/* عرض الكلمة المستهدفة مع الحرف المُحاط بالأحمر إذا كانت النتيجة خاطئة */}
                  {!localResult.test_passed && targetWord && targetLetter && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-cyber-800 to-cyber-700 rounded-xl border border-pink-500/20">
                      <p className="text-lg font-medium text-cyber-200 mb-2">
                        الكلمة المستهدفة:
                      </p>
                      <span className="font-arabic text-2xl">
                        {highlightedTargetWord}
                      </span>
                      <p className="text-sm text-cyber-400 mt-2">
                        حاول التركيز على الحرف الملون بالأحمر.
                      </p>
                    </div>
                  )}

                  {/* زر إعادة المحاولة يظهر فقط إذا فشلت المحاولة */}
                  {!localResult.test_passed && (
                    <button
                      onClick={handleRetry}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-neon-green to-cyan-500 text-cyber-950 rounded-full font-bold hover:from-cyan-500 hover:to-neon-green transition-all duration-300 shadow-lg"
                    >
                      إعادة المحاولة
                    </button>
                  )}

                  {/* زر الإغلاق يظهر إذا نجحت المحاولة */}
                  {localResult.test_passed && (
                    <button
                      onClick={() => {
                        if (onResult) {
                          onResult(localResult); // إرسال النتيجة لـ LevelPage
                        }
                        if (onClose) {
                          onClose(); // إغلاق البوب آب
                        }
                      }}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold hover:from-emerald-500 hover:to-green-500 transition-all duration-300 shadow-lg"
                    >
                      ✅ إغلاق والاستمرار
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* زر التحكم في التسجيل داخل البوب آب */}
          <div className="flex justify-center mt-6">
            <button
              onClick={toggleRecording}
              disabled={isProcessing}
              className={`px-8 py-4 rounded-full font-bold transition-all duration-300 relative overflow-hidden ${
                isProcessing
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : isListening
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg animate-pulse"
                  : "bg-gradient-to-r from-neon-green to-cyan-500 text-cyber-950 shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              {isListening ? (
                <>
                  <span className="relative z-10">⏹️ إيقاف التسجيل</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                </>
              ) : (
                <>
                  <span className="relative z-10">⏺️ بدء التسجيل</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-neon-green animate-pulse"></div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
