import React, { useState } from "react";
import { Brain, Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-950 text-white font-raleway">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/3 rounded-full blur-[140px]" />
      </div>

      <div className="relative">
        {/* Hero */}
        <section className="pt-28 pb-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
              Let's{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                start a conversation
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Have questions about IntelliQuiz? Our team is here to help you elevate your learning experience.
            </p>
          </div>
        </section>

        {/* Info Cards */}
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Mail className="w-5 h-5" />,
                title: "Email Us",
                lines: ["support@intelliquiz.com", "info@intelliquiz.com"],
                color: "#06b6d4",
              },
              {
                icon: <Phone className="w-5 h-5" />,
                title: "Call Us",
                lines: ["+91 93229 16728", "Mon – Sat, 9 AM – 6 PM"],
                color: "#8b5cf6",
              },
              {
                icon: <MapPin className="w-5 h-5" />,
                title: "Visit Us",
                lines: ["123 Innovation Drive", "Tech Valley, India"],
                color: "#06b6d4",
              },
            ].map(({ icon, title, lines, color }) => (
              <div
                key={title}
                className="group bg-gray-900/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    color,
                    boxShadow: `0 0 20px ${color}10`,
                  }}
                >
                  {icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                {lines.map((l) => (
                  <p key={l} className="text-gray-400 text-sm">{l}</p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Main Form Panel */}
        <section className="px-4 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-white/8 rounded-3xl overflow-hidden">
              <div className="flex flex-wrap lg:flex-nowrap">
                {/* Left info panel */}
                <div
                  className="w-full lg:w-5/12 p-10 lg:p-12 relative overflow-hidden"
                  style={{ background: "linear-gradient(145deg, rgba(6,182,212,0.12), rgba(139,92,246,0.10))" }}
                >
                  {/* Panel glow orb */}
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute -bottom-20 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-purple-500" />
                      <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Support</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">We're always here for you</h3>
                    <p className="text-gray-400 text-sm mb-10">
                      Reach out through the form or directly — we'll get back to you as soon as possible.
                    </p>

                    <div className="space-y-7">
                      {[
                        {
                          icon: <MessageSquare className="w-5 h-5 text-cyan-400" />,
                          title: "Chat with Us",
                          sub: "Our friendly team is here to help.",
                          bg: "rgba(6,182,212,0.12)",
                          border: "rgba(6,182,212,0.25)",
                        },
                        {
                          icon: <Clock className="w-5 h-5 text-purple-400" />,
                          title: "24/7 Support",
                          sub: "Round the clock assistance.",
                          bg: "rgba(139,92,246,0.12)",
                          border: "rgba(139,92,246,0.25)",
                        },
                        {
                          icon: <Globe className="w-5 h-5 text-cyan-400" />,
                          title: "Global Reach",
                          sub: "Supporting learners worldwide.",
                          bg: "rgba(6,182,212,0.12)",
                          border: "rgba(6,182,212,0.25)",
                        },
                      ].map(({ icon, title, sub, bg, border }) => (
                        <div key={title} className="flex items-start gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: bg, border: `1px solid ${border}` }}
                          >
                            {icon}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{title}</p>
                            <p className="text-gray-400 text-sm">{sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right form */}
                <div className="w-full lg:w-7/12 p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-white/8">
                  {submitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}
                      >
                        <Send className="w-7 h-7 text-cyan-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                      <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Omkar Kathile"
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="How can we help?"
                          className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="Tell us what's on your mind..."
                          className="w-full px-4 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition duration-200 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                        style={{
                          background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                          boxShadow: "0 0 24px rgba(6,182,212,0.25), 0 4px 12px rgba(0,0,0,0.3)",
                        }}
                      >
                        Send Message <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/8 bg-gray-950/80 backdrop-blur-sm py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-cyan-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  IntelliQuiz
                </span>
              </div>
              <div className="flex gap-6 text-sm text-gray-400">
                {["Home", "Features", "About Us", "Contact"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="hover:text-cyan-400 transition-colors duration-200"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div className="border-t border-white/6 pt-6 text-sm text-gray-500 text-center">
              © 2025 IntelliQuiz. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Contact;
