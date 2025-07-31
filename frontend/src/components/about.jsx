import figure1 from "../assets/img/Figure.png";
import figure2 from "../assets/img/Figure (1).png";
import figure3 from "../assets/img/events-img-3.jpg.png";
import logo from "../assets/img/logo 1.png";
import games from "../assets/img/games.png";
import child1 from "../assets/img/child1.png";
import child2 from "../assets/img/child2.png";
import child3 from "../assets/img/child3.png";
import child4 from "../assets/img/child4.png";
import hand from "../assets/img/hand.png";
import boy from "../assets/img/boy.png";
import Footer from "./footer";
import Navbar from "./navbar";
import {
  Brain,
  Heart,
  Target,
  Users,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

export default function About() {
  return (
    <div className="relative bg-gradient-dark text-white min-h-screen">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

      {/* Particle Effects */}
      <div className="fixed inset-0 particles z-[-1]"></div>

      <Navbar />

      {/* Intro Section */}
      <section className="relative pt-28 pb-20">
        <div className="flex flex-col items-center text-center px-4">
          <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
            <Brain className="w-4 h-4 animate-pulse" />
            Welcome to Sayar AI Therapy
          </div>
          <h1 className="text-responsive-xl font-bold text-white mb-8 leading-tight">
            Tracing the{" "}
            <span className="gradient-text" data-text="Footsteps">
              Footsteps
            </span>{" "}
            of Our
            <br />
            AI-Powered Future
          </h1>
          <div className="relative w-full max-w-4xl mb-16">
            <img
              src={games}
              alt="Games"
              className="w-full rounded-3xl shadow-neon-blue"
            />
            <div className="absolute inset-0 bg-gradient-neon rounded-3xl opacity-20 animate-pulse"></div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 px-4 md:px-20">
          <div className="card-gradient p-8 animate-fade-in-left">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Target className="w-6 h-6 text-neon-blue" />
              Our AI Approach
            </h2>
            <div className="w-24 h-1 bg-gradient-neon mb-6 rounded-full"></div>
            <p className="text-cyber-300 leading-relaxed text-lg">
              At Sayar, we understand the busy schedules of modern families. Our
              AI-powered approach integrates flexibility, evidence-based
              techniques, and cutting-edge technology to ensure every child
              thrives in their learning journey.
            </p>
          </div>

          <div className="card-gradient p-8 animate-fade-in-right">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Heart className="w-6 h-6 text-neon-green" />
              Our Values
            </h2>
            <div className="w-24 h-1 bg-gradient-neon mb-6 rounded-full"></div>
            <p className="text-cyber-300 leading-relaxed text-lg">
              We are committed to delivering high-quality, AI-enhanced therapy
              in a nurturing and empowering environment for children and their
              families.
            </p>
            <div className="mt-8 space-y-4">
              {["Develop Parent Training", "Support Daily Growth"].map(
                (v, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-cyber-800/50 px-6 py-4 rounded-xl shadow-glass border border-cyber-700/50 backdrop-blur-md hover-lift"
                  >
                    <h3 className="text-md font-semibold text-white">{v}</h3>
                    <p className="text-sm text-neon-blue italic">
                      AI Empowerment
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Futuristic Divider */}
      <div className="relative my-20">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neon-blue/30"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-6 py-2 bg-cyber-950 text-neon-blue border border-neon-blue/30 rounded-full backdrop-blur-md">
            Our Services
          </span>
        </div>
      </div>

      {/* Concerns Section */}
      <section className="px-4 md:px-20 pt-8 flex flex-col lg:flex-row items-center justify-between mb-20">
        <div className="flex-1 py-12">
          <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-purple px-4 py-2 rounded-full text-sm font-medium mb-4 border border-neon-purple/30 backdrop-blur-md">
            <Users className="w-4 h-4" />
            What we serve you
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 max-w-xl leading-tight">
            Concerned about your child's{" "}
            <span className="gradient-text">development</span>?
          </h2>

          <div className="grid grid-cols-2 gap-6 max-w-xl">
            {[
              { img: child1, label: "Child Doesn't Speak", color: "neon-blue" },
              {
                img: child2,
                label: "Child Doesn't Listen",
                color: "neon-green",
              },
              {
                img: child3,
                label: "Child Doesn't Respond",
                color: "neon-purple",
              },
              { img: child4, label: "Child Doesn't Read", color: "neon-pink" },
            ].map(({ img, label, color }, i) => (
              <div
                key={i}
                className="card-gradient p-6 flex flex-col items-center shadow-glass hover-lift border border-cyber-700/50 backdrop-blur-md"
              >
                <div className="relative mb-4">
                  <img
                    className="w-24 h-24 rounded-xl object-cover shadow-neon-blue"
                    src={img}
                    alt={label}
                  />
                  <div
                    className={`absolute inset-0 bg-${color}/20 rounded-xl`}
                  ></div>
                </div>
                <h3 className="text-center text-lg font-semibold text-white">
                  {label}
                </h3>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 relative hidden lg:block">
          <div className="w-96 h-96 rounded-full bg-gradient-hologram relative neon-glow">
            <img
              className="absolute inset-0 m-auto w-80 h-80 rounded-full object-cover"
              src={hand}
              alt="hand"
            />
            <img className="absolute top-10 left-20 w-52" src={boy} alt="boy" />
            <div className="absolute inset-0 bg-gradient-neon rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Futuristic Divider */}
      <div className="relative my-20">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neon-blue/30"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-6 py-2 bg-cyber-950 text-neon-blue border border-neon-blue/30 rounded-full backdrop-blur-md">
            Our Events
          </span>
        </div>
      </div>

      {/* Events Section */}
      <section className="px-4 md:px-20 py-20 bg-gradient-hologram rounded-3xl mx-4 md:mx-20 mb-20 border border-neon-blue/20 backdrop-blur-md">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <img src={logo} alt="Logo" className="w-24 h-auto" />
            <div className="absolute inset-0 bg-gradient-neon rounded-full opacity-30 animate-pulse"></div>
          </div>
          <div className="inline-flex items-center gap-2 bg-cyber-800/50 text-neon-pink px-4 py-2 rounded-full text-sm font-medium mb-4 border border-neon-pink/30 backdrop-blur-md">
            <Calendar className="w-4 h-4" />
            Events of Sayar AI Therapy
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">
            Our <span className="gradient-text">Events</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[figure1, figure2, figure3].map((img, i) => (
              <div
                key={i}
                className="relative card-gradient overflow-hidden shadow-glass hover-lift border border-cyber-700/50 backdrop-blur-md"
              >
                <img
                  className="w-full h-56 object-cover"
                  src={img}
                  alt={`Event ${i + 1}`}
                />
                <div
                  className={`absolute top-4 left-4 w-16 h-16 flex flex-col items-center justify-center text-cyber-950 rounded-lg bg-gradient-neon neon-glow`}
                >
                  <span className="text-lg font-bold">Dec</span>
                  <span className="text-lg font-bold">18</span>
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Windsor Parent Support Group - Windsor Family Hub
                  </h3>
                  <div className="flex items-center gap-2 text-cyber-300 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>10:45 am - 11:30 am</span>
                  </div>
                  <div className="flex items-center gap-2 text-cyber-300 text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>Windsor Family Hub</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
