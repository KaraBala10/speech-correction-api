import { Link, useParams } from "react-router-dom";
import ss from "../../../../model/lessons.json";
import { Check } from "lucide-react";
import {
  Brain,
  BookOpen,
  Target,
  ArrowRight,
  Sparkles,
  Trophy,
  Star,
  GraduationCap,
  Play,
  Lock,
} from "lucide-react";

export default function GrammarPage() {
  const { skillName } = useParams();
  const token=localStorage.getItem("token")
  const lessons = ss.filter((elem) => elem.lessonCateg === skillName);

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <BookOpen className="w-4 h-4 animate-pulse" />
              AI-Powered Learning
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Explore{" "}
              <span className="gradient-text" data-text={skillName}>
                {skillName}
              </span>{" "}
              Sections
            </h1>
            <p className="text-cyber-300 text-lg max-w-3xl leading-relaxed">
              {skillName} is made up of essential sections that help learners
              understand how language works. Each lesson below focuses on a
              specific rule or structure to enhance your writing and speaking
              skills with AI assistance.
            </p>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson, i) => (
              <Link
                to={`/${skillName}/${lesson.lessonName}`}
                key={i}
                className="group block"
              >
                <div
                  className="card-gradient p-8 rounded-2xl shadow-glass border border-cyber-700/50 backdrop-blur-md hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Lesson Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                      <Play className="w-6 h-6" />
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        lesson.lessonPassed
                          ? "bg-neon-green/20 text-neon-green"
                          : "bg-cyber-800/50 text-cyber-400"
                      }`}
                    >
                      {lesson.lessonPassed ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors duration-300">
                    {lesson.lessonName}
                  </h3>
                  <p className="text-cyber-300 text-sm mb-6 leading-relaxed">
                    {lesson.lessonDesc}
                  </p>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neon-blue group-hover:text-neon-cyan transition-colors duration-300">
                      <span className="text-sm font-medium">
                        {lesson.lessonPassed ? "Review Lesson" : "Start Lesson"}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    {/* Lesson Status */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lesson.lessonPassed
                          ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                          : "bg-cyber-800/50 text-cyber-400 border border-cyber-700/50"
                      }`}
                    >
                      {lesson.lessonPassed ? "Completed" : "Not Started"}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-neon rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="mt-16">
            <div className="card-gradient p-8 rounded-3xl border border-neon-green/20 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Learning Progress
                    </h3>
                    <p className="text-cyber-300">
                      Track your {skillName} mastery
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-neon-green">
                    {lessons.filter((l) => l.lessonPassed).length}/
                    {lessons.length}
                  </div>
                  <div className="text-cyber-300 text-sm">
                    Lessons Completed
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-cyber-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-neon rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      (lessons.filter((l) => l.lessonPassed).length /
                        lessons.length) *
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

//   json-server --watch letters.json --port 8000
