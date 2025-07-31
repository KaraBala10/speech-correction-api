import { Link, useNavigate, useParams } from "react-router-dom";
import quizes from "../../../../model/quizs.json";
import { useState, useEffect } from "react";
import { FaRedo, FaArrowLeft } from "react-icons/fa";
import { Check } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import {
  Brain,
  Target,
  Trophy,
  Star,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  BookOpen,
  Award,
} from "lucide-react";

export default function QuizPage() {
  const {skillName,lessonName} = useParams();
  const token=localStorage.getItem("token")
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quesNum, setQuesNum] = useState(0);
  const [result, setResult] = useState(0);
  const navigate = useNavigate();
  const filteredQuizzes = quizes.filter((q) => q.lessonName === lessonName);
  const quiz = filteredQuizzes[quesNum];

  const handleAnswer = (option) => {
    setSelectedOption(option);
    setIsCorrect(option === quiz.correct_answer);
    if (option === quiz.correct_answer) {
      setResult(result + 1);
    }
  };

  const handleNextQes = () => {
    if (!selectedOption) {
      return console.log("Nooooo");
    }
    setQuesNum(quesNum + 1);
    setIsCorrect(null);
    setSelectedOption(null);
  };

  const handleRestart = () => {
    navigate(`/QuizPage/${lessonName}`);
    window.location.reload();
  };

  if (!quiz) {
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

        <div className="card-gradient p-12 max-w-2xl w-full text-center animate-fade-in-up shadow-glass border border-neon-green/20 backdrop-blur-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow mx-auto mb-6">
              <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              🎉 Quiz Completed!
            </h2>
            <p className="text-2xl text-cyber-300">
              Your result is{" "}
              <span className="font-bold text-neon-green">{result}</span> out of{" "}
              <span className="font-bold text-neon-blue">
                {filteredQuizzes.length}
              </span>
            </p>
          </div>

          {/* Score Visualization */}
          <div className="mb-8">
            <div className="w-full bg-cyber-800 rounded-full h-4 overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-neon rounded-full transition-all duration-1000"
                style={{ width: `${(result / filteredQuizzes.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-cyber-300">
              {result === filteredQuizzes.length
                ? "Perfect Score! 🏆"
                : "Great Job! Keep Learning!"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleRestart}
              className="btn-primary inline-flex items-center gap-2 group"
            >
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              Restart Quiz
            </button>

            <Link
              to={`/${skillName}`}
              className="btn-outline inline-flex items-center gap-2 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Grammar
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <Brain className="w-4 h-4 animate-pulse" />
              AI-Powered Quiz
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Quiz:{" "}
              <span className="gradient-text" data-text={lessonName}>
                {lessonName}
              </span>
            </h1>
            <p className="text-cyber-300">
              Question {quesNum + 1} of {filteredQuizzes.length}
            </p>
          </div>

          <div className="card-gradient p-8 rounded-3xl shadow-glass border border-neon-blue/20 backdrop-blur-md animate-fade-in-up">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-cyber-300 text-sm">Progress</span>
                <span className="text-neon-blue font-semibold">
                  {quesNum + 1}/{filteredQuizzes.length}
                </span>
              </div>
              <div className="w-full bg-cyber-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-neon rounded-full transition-all duration-500"
                  style={{
                    width: `${((quesNum + 1) / filteredQuizzes.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">
                {quesNum + 1}. {quiz.question}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {quiz.options.map((option, idx) => {
                  let optionStyle = "card-gradient border-cyber-700/50";
                  let textColor = "text-white";

                  if (selectedOption) {
                    if (option === quiz.correct_answer) {
                      optionStyle = "bg-neon-green/20 border-neon-green/50";
                      textColor = "text-neon-green";
                    } else if (
                      option === selectedOption &&
                      option !== quiz.correct_answer
                    ) {
                      optionStyle = "bg-neon-red/20 border-neon-red/50";
                      textColor = "text-neon-red";
                    }
                  }

                  return (
                    <label
                      key={idx}
                      onClick={() => !selectedOption && handleAnswer(option)}
                      className={`flex items-center ${optionStyle} rounded-xl px-6 py-4 cursor-pointer transition-all duration-300 hover-lift border backdrop-blur-md ${
                        !selectedOption ? "hover:border-neon-blue/50" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="question"
                        value={option}
                        className="mr-4 accent-neon-blue"
                        checked={selectedOption === option}
                        readOnly
                      />
                      <span className={`text-lg ${textColor}`}>{option}</span>

                      {selectedOption && option === quiz.correct_answer && (
                        <CheckCircle className="w-6 h-6 text-neon-green ml-auto" />
                      )}
                      {selectedOption &&
                        option === selectedOption &&
                        option !== quiz.correct_answer && (
                          <XCircle className="w-6 h-6 text-neon-red ml-auto" />
                        )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Feedback */}
            {isCorrect !== null && (
              <div className="mb-8">
                <div
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? "bg-neon-green/10 border-neon-green/30"
                      : "bg-neon-red/10 border-neon-red/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-neon-green" />
                    ) : (
                      <XCircle className="w-6 h-6 text-neon-red" />
                    )}
                    <p
                      className={`text-lg font-medium ${
                        isCorrect ? "text-neon-green" : "text-neon-red"
                      }`}
                    >
                      {isCorrect ? "✅ Correct Answer!" : "❌ Wrong Answer"}
                    </p>
                  </div>
                  {!isCorrect && (
                    <p className="text-cyber-300 mt-2">
                      Correct answer:{" "}
                      <span className="text-neon-green font-semibold">
                        {quiz.correct_answer}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <div className="text-cyber-300">
                Score:{" "}
                <span className="text-neon-blue font-semibold">{result}</span>
              </div>

              <button
                className={`btn-primary inline-flex items-center gap-2 group ${
                  !selectedOption ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleNextQes}
                disabled={!selectedOption}
              >
                {quesNum + 1 === filteredQuizzes.length
                  ? "Finish Quiz"
                  : "Next Question"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
