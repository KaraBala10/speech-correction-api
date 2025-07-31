import React, { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  User,
  AtSign,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Send to backend if needed
    alert("Message sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="relative bg-gradient-dark text-white min-h-screen">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

      {/* Particle Effects */}
      <div className="fixed inset-0 particles z-[-1]"></div>

      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <MessageSquare className="w-4 h-4 animate-pulse" />
              Get in Touch
            </div>
            <h1 className="text-responsive-xl font-bold text-white mb-6">
              Contact{" "}
              <span className="gradient-text" data-text="Us">
                Us
              </span>
            </h1>
            <p className="text-lg text-cyber-300 max-w-2xl mx-auto">
              Ready to transform your speech therapy experience? Reach out to
              our AI-powered team and let's start your journey together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div className="card-gradient p-8 animate-fade-in-left">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-neon-blue" />
                  Let's Connect
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-neon-blue/20 rounded-xl flex items-center justify-center group-hover:bg-neon-blue/30 transition-all duration-300">
                      <Mail className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email</h3>
                      <p className="text-cyber-300 group-hover:text-neon-blue transition-colors duration-300">
                        info@Sayar.com
                      </p>
                      <p className="text-cyber-400 text-sm">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-neon-green/20 rounded-xl flex items-center justify-center group-hover:bg-neon-green/30 transition-all duration-300">
                      <Phone className="w-6 h-6 text-neon-green" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Phone</h3>
                      <p className="text-cyber-300 group-hover:text-neon-green transition-colors duration-300">
                        +1 (555) 123-4567
                      </p>
                      <p className="text-cyber-400 text-sm">
                        Mon-Fri 9AM-6PM EST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-neon-purple/20 rounded-xl flex items-center justify-center group-hover:bg-neon-purple/30 transition-all duration-300">
                      <MapPin className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Office</h3>
                      <p className="text-cyber-300 group-hover:text-neon-purple transition-colors duration-300">
                        123 Therapy Street
                      </p>
                      <p className="text-cyber-300">Speech City, SC 12345</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div
                className="card-gradient p-8 animate-fade-in-left"
                style={{ animationDelay: "200ms" }}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Why Choose Sayar?
                </h3>
                <ul className="space-y-3 text-cyber-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                    AI-Powered Speech Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    Personalized Learning Plans
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                    24/7 Support Available
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-pink rounded-full"></div>
                    Real-time Progress Tracking
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card-gradient p-8 animate-fade-in-right">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Send className="w-6 h-6 text-neon-green" />
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-cyber-200 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-neon-blue" />
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-enhanced"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cyber-200 mb-2 flex items-center gap-2">
                        <AtSign className="w-4 h-4 text-neon-green" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-enhanced"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyber-200 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-neon-purple" />
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      required
                      className="input-enhanced resize-none"
                      placeholder="Tell us about your speech therapy needs..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 group"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
