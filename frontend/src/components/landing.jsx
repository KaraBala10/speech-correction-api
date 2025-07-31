/* eslint-disable */
import React from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/footer";
import zz from "../assets/img/zz.png";
import yy from "../assets/img/yy.png";
import cover from "../assets/img/cover.png";
import Navbar from "./navbar";
import {
  Brain,
  Gamepad2,
  Users,
  BookOpen,
  Shield,
  Sparkles,
  Target,
  Zap,
  Heart,
  Globe,
  ArrowRight,
  Star,
  Trophy,
  Lock,
} from "lucide-react";

export default function Landing() {
  const token = localStorage.getItem("token");
  console.log(token);
  return (
    <div className="relative bg-gradient-dark text-white min-h-screen">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

      {/* Particle Effects */}
      <div className="fixed inset-0 particles z-[-1]"></div>

      <Navbar isUser={!!token} />

      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative flex items-center justify-center min-h-[90vh] overflow-hidden">
          {/* Enhanced Background */}
          <div className="absolute inset-0 bg-gradient-dark"></div>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url(${cover})`,
            }}
          ></div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-20 h-20 bg-neon-blue rounded-full opacity-30 animate-float"></div>
          <div
            className="absolute bottom-20 right-20 w-16 h-16 bg-neon-purple rounded-full opacity-30 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-10 w-12 h-12 bg-neon-green rounded-full opacity-30 animate-float"
            style={{ animationDelay: "4s" }}
          ></div>

          <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 border border-neon-blue/30 backdrop-blur-md">
              <Brain className="w-4 h-4 animate-pulse" />
              AI-Powered Learning Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Where{" "}
              <span className="gradient-text" data-text="Fun">
                Fun
              </span>{" "}
              Meets <span className="text-neon-cyan">AI Learning!</span>
            </h1>
            <p className="text-lg sm:text-xl text-cyber-200 font-medium mb-6 max-w-2xl mx-auto">
              A futuristic platform for kids, parents, and educators to explore,
              learn, and grow together with cutting-edge AI technology.
            </p>
            <p className="text-sm sm:text-base text-cyber-300 max-w-xl mx-auto">
              Discover engaging content, track progress with AI analytics, and
              enjoy a secure environment built for the future of learning.
            </p>
          </div>
        </div>

        {/* Explore Lessons Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-green px-4 py-2 rounded-full text-sm font-medium mb-4 border border-neon-green/30 backdrop-blur-md">
                <Gamepad2 className="w-4 h-4" />
                Choose Your Journey
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Explore{" "}
                <span className="gradient-text" data-text="Lessons">
                  Lessons
                </span>
              </h2>
              <p className="text-cyber-300 text-lg max-w-2xl mx-auto">
                Choose your journey below and dive into tailored AI-powered
                learning experiences designed for every age!
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Dino Card */}
              <Link to="/LanguagePage" className="group">
                <div className="card-gradient p-8 text-center h-full hover-lift border border-neon-blue/20 backdrop-blur-md">
                  <div className="relative mb-6">
                    <img
                      src={zz}
                      alt="Children"
                      className="mx-auto w-24 h-20 mb-4"
                    />
                    <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-xl"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                    <Brain className="w-5 h-5 text-neon-blue" />
                    Learn pronunciation with AI
                  </h3>
                  <p className="text-cyber-300 text-sm mb-4">
                    AI helps kids explore letters, shapes, and numbers with
                    AI-powered assistance!
                  </p>
                  <div className="inline-flex items-center gap-2 text-neon-blue group-hover:text-neon-cyan transition-colors duration-300">
                    <span className="text-sm font-medium">Start Learning</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              {/* Parents Card */}
              <Link to={`/AdultPage`} className="group">
                <div className="card-gradient p-8 text-center h-full hover-lift border border-neon-purple/20 backdrop-blur-md">
                  <div className="relative mb-6">
                    <img
                      src={yy}
                      alt="Adults"
                      className="mx-auto w-24 h-20 mb-4"
                    />
                    <div className="absolute inset-0 bg-neon-purple/20 rounded-full blur-xl"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                    <Users className="w-5 h-5 text-neon-purple" />
                    For Parents & Teachers
                  </h3>
                  <p className="text-cyber-300 text-sm mb-4">
                    Monitor progress with AI analytics, get helpful tips, and
                    stay engaged in your child's learning journey.
                  </p>
                  <div className="inline-flex items-center gap-2 text-neon-purple group-hover:text-neon-pink transition-colors duration-300">
                    <span className="text-sm font-medium">
                      Access Dashboard
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              {/* Explore Section */}
              <Link to={`/explore/${token}`} className="group">
                <div className="card-gradient p-8 text-center h-full hover-lift border border-neon-green/20 backdrop-blur-md">
                  <div className="relative mb-6">
                    <img
                      src="https://i.pinimg.com/736x/45/58/b2/4558b21281bb71a1b78fa88da213be11.jpg"
                      alt="Explore Mode"
                      className="mx-auto w-24 h-20 mb-4"
                    />
                    <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-xl"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-neon-green" />
                    Explore Lab 🧩
                  </h3>
                  <p className="text-cyber-300 text-sm mb-4">
                    Play AI-powered educational games, solve puzzles, and learn
                    languages in creative ways!
                  </p>
                  <div className="inline-flex items-center gap-2 text-neon-green group-hover:text-neon-cyan transition-colors duration-300">
                    <span className="text-sm font-medium">Start Exploring</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-pink px-4 py-2 rounded-full text-sm font-medium mb-4 border border-neon-pink/30 backdrop-blur-md">
                <Star className="w-4 h-4" />
                Why Choose Sayar?
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                The{" "}
                <span className="gradient-text" data-text="Future">
                  Future
                </span>{" "}
                of Learning
              </h2>
              <p className="text-cyber-300 text-lg max-w-2xl mx-auto">
                Discover why Sayar is loved by kids, trusted by parents, and
                recommended by educators worldwide!
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="card-gradient p-6 text-center hover-lift border border-neon-blue/20 backdrop-blur-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                  <Gamepad2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Interactive AI Lessons 🎮
                </h3>
                <p className="text-cyber-300 text-sm">
                  Make learning exciting with AI-powered animated stories,
                  interactive quizzes, and adaptive challenges.
                </p>
              </div>

              <div className="card-gradient p-6 text-center hover-lift border border-neon-green/20 backdrop-blur-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  AI Progress Tracking 📊
                </h3>
                <p className="text-cyber-300 text-sm">
                  Stay informed on your child's growth with real-time AI
                  analytics and personalized insights.
                </p>
              </div>

              <div className="card-gradient p-6 text-center hover-lift border border-neon-purple/20 backdrop-blur-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Inclusive AI Learning 🌍
                </h3>
                <p className="text-cyber-300 text-sm">
                  Everyone is welcome — with AI content that adapts to diverse
                  needs and learning styles.
                </p>
              </div>

              {/* Extra Features */}
              <div className="card-gradient p-6 text-center hover-lift border border-neon-cyan/20 backdrop-blur-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Safe & Secure 🛡️
                </h3>
                <p className="text-cyber-300 text-sm">
                  Built with advanced security — no ads, no distractions, just
                  AI-powered learning.
                </p>
              </div>

              <div className="card-gradient p-6 text-center hover-lift border border-neon-pink/20 backdrop-blur-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Built for Fun ✨
                </h3>
                <p className="text-cyber-300 text-sm">
                  Learning shouldn't be boring — that's why every AI lesson
                  feels like playtime.
                </p>
              </div>

              <div className="card-gradient p-6 text-center hover-lift border border-neon-orange/20 backdrop-blur-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Achievement System 🏆
                </h3>
                <p className="text-cyber-300 text-sm">
                  Celebrate milestones with AI-powered achievement tracking and
                  rewards.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
