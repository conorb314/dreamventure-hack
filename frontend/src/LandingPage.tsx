import { useState, useEffect } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["why", "audience", "proposed", "team"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(current || "");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200">
        <div className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <img src="https://i.imgur.com/Se12KXC.png" className="w-9 h-9" alt="Habitly Logo" />
              <span className="font-semibold text-lg">Habitly</span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-sm">
              <button onClick={() => scrollToSection("why")} className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Why Us
              </button>
              <button onClick={() => scrollToSection("audience")} className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Audience
              </button>
              <button onClick={() => scrollToSection("proposed")} className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Roadmap
              </button>
              <button onClick={() => scrollToSection("team")} className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Team
              </button>
              <button 
                onClick={onGetStarted}
                className="ml-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Try Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeUp">
            <h1 className="text-5xl font-semibold mb-6">
              Build Better Habits.<br />
              <span className="text-gray-500">Without Burnout.</span>
            </h1>
            <p className="text-gray-500 max-w-xl mb-8">
              Habitly helps people create consistent change by adapting habits to real life, not forcing perfection.
            </p>
            <button 
              onClick={onGetStarted}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Get Started Free
            </button>
          </div>

          <div className="flex justify-center md:justify-end">
            <img
              src="https://i.imgur.com/Se12KXC.png"
              alt="Habitly Logo"
              className="w-40 h-40 md:w-56 md:h-56 opacity-90 animate-float"
            />
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why" className="py-32 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-6">Why Habitly? What does it solve?</h2>
        <p className="text-gray-500 max-w-2xl text-lg">
          Habitly solves an everpresent problem for high achievers: taking the first step on long-term goals. 
          This is achieved through the use of analytics and habit tracking to break down larger goals into daily 
          steps to make them more approachable.
        </p>
      </section>

      {/* Audience Section */}
      <section id="audience" className="bg-gray-50 border-y border-gray-200 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-12">Who It's For</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "High Achieving Students",
              "Professionals",
              "Self-Motivated Learners",
              "New Years Resolution Writers",
              "CEOs",
              "Anyone Building Better Habits"
            ].map((audience, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-gray-700 font-medium">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proposed Features Section */}
      <section id="proposed" className="py-32 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-12">Proposed Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Community Features", desc: "Connect with others on similar journeys" },
            { title: "Offline Mode & Exports", desc: "Access your data anywhere, anytime" },
            { title: "Progress Tracking", desc: "Long-term insights and check-ins" }
          ].map((feature, idx) => (
            <div 
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="bg-gray-50 border-y border-gray-200 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-12">The Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Conor Byrne", role: "API and Node JS Backend" },
              { name: "Ben Vaccaro", role: "Front-End Dash and Design" },
              { name: "Devin Kruszewski", role: "Landing Page and Hook" },
              { name: "Sai Prabhala", role: "Presentation and Demo Polish" }
            ].map((member, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <p className="font-bold text-gray-900 mb-1">{member.name}</p>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Start Building Better Habits?</h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Join Habitly today and transform your goals into achievable daily actions.
        </p>
        <button 
          onClick={onGetStarted}
          className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
        >
          Get Started Now
        </button>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeUp {
          animation: fadeUp 0.7s ease forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}