import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  Zap,
  Shield,
  Brain,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-dark text-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-neon-blue rounded-full blur-3xl animate-pulse-neon"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-neon-purple rounded-full blur-3xl animate-glow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-neon-green rounded-full blur-3xl animate-holographic"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-neon-cyan rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-5"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <span className="text-2xl font-bold gradient-text">Sayar</span>
              </div>
              <p className="text-cyber-300 mb-8 leading-relaxed max-w-md">
                Transforming speech therapy through AI-powered technology. We
                help children and adults improve their communication skills with
                personalized, accessible, and effective solutions.
              </p>
              <div className="flex space-x-4">
                {[
                  {
                    icon: Facebook,
                    href: "#",
                    label: "Facebook",
                    color: "neon-blue",
                  },
                  {
                    icon: Twitter,
                    href: "#",
                    label: "Twitter",
                    color: "neon-cyan",
                  },
                  {
                    icon: Instagram,
                    href: "#",
                    label: "Instagram",
                    color: "neon-pink",
                  },
                  {
                    icon: Linkedin,
                    href: "#",
                    label: "LinkedIn",
                    color: "neon-purple",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 bg-cyber-800/50 hover:bg-gradient-neon rounded-xl flex items-center justify-center transition-all duration-300 hover-scale group border border-cyber-700/50 backdrop-blur-md`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6 text-cyber-300 group-hover:text-cyber-950 transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-8 text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-blue" />
                Quick Links
              </h3>
              <ul className="space-y-4">
                {[
                  { name: "About Us", href: "/about" },
                  { name: "Our Services", href: "#services" },
                  { name: "How It Works", href: "#how-it-works" },
                  { name: "Success Stories", href: "#testimonials" },
                  { name: "Pricing", href: "#pricing" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-cyber-300 hover:text-neon-blue transition-all duration-300 hover:translate-x-2 inline-block group"
                    >
                      <span className="group-hover:text-neon-blue">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-8 text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-green" />
                Contact Us
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-3 group">
                  <Mail className="w-5 h-5 text-neon-blue mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="text-cyber-400 text-sm">Email</p>
                    <p className="text-white group-hover:text-neon-blue transition-colors duration-300">
                      info@Sayar.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <Phone className="w-5 h-5 text-neon-green mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="text-cyber-400 text-sm">Phone</p>
                    <p className="text-white group-hover:text-neon-green transition-colors duration-300">
                      +963 949 257 963
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <MapPin className="w-5 h-5 text-neon-purple mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="text-cyber-400 text-sm">Address</p>
                    <p className="text-white text-sm group-hover:text-neon-purple transition-colors duration-300">
                      123 Test Street
                      <br />
                      Speech City, SC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neon-blue/20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-cyber-400 text-sm">
                <span>© {new Date().getFullYear()} Sayar. Made with</span>
                <Heart className="w-4 h-4 text-neon-pink animate-pulse" />
                <span>by ABKG Team</span>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <Link
                  to="/privacy"
                  className="text-cyber-400 hover:text-neon-blue transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-cyber-400 hover:text-neon-blue transition-colors duration-300"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/cookies"
                  className="text-cyber-400 hover:text-neon-blue transition-colors duration-300"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-neon text-cyber-950 rounded-full shadow-neon-blue hover:shadow-neon-blue/50 transform hover:-translate-y-2 transition-all duration-300 z-50 flex items-center justify-center group neon-glow"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
      </button>

      {/* Floating AI Elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-neon-cyan rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-neon-pink rounded-full opacity-60 animate-glow"></div>
      <div className="absolute top-1/2 right-10 w-2 h-2 bg-neon-green rounded-full opacity-60 animate-pulse-neon"></div>
    </footer>
  );
}
