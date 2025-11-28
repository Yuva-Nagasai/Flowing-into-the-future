import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Contact = () => {
  const { theme } = useTheme();

  const location = {
    title:
      'TF-301, 1-152, Sapthagiri Nagar, Revenue Ward-70, Near Chinamushidiwada, Visakhapatnam - 530051',
    mapLink: 'https://maps.app.goo.gl/vzoeyseTBKvJNWZR6',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'nanoflowsvizag@gmail.com',
      link: 'mailto:nanoflowsvizag@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 8019358855',
      link: 'tel:+91 8019358855',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: location.title,
      link: location.mapLink,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setShowMap(true);
      },
    },
  ];

  return (
    <section
      id="contact"
      className={`relative pt-4 md:pt-6 pb-20 overflow-hidden scroll-mt-24 lg:scroll-mt-32 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}
    >
      <div className={`absolute inset-0 ${theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'}`} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-orbitron font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}
          >
            Get In{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>Touch</span>
          </h2>
          <p
            className={`text-lg font-exo max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            }`}
          >
            Ready to transform your digital presence? Let's start a conversation about your project.
          </p>
        </div>

        {/* Contact + Form Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3
                className={`text-2xl font-orbitron font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                Let's Talk About Your Project
              </h3>
              <p
                className={`text-base font-exo leading-relaxed mb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                Whether you're looking to build a new product, scale your existing platform, or explore AI-powered solutions, our team is here to help bring your vision to life.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <a
                    key={index}
                    href={info.link}
                    onClick={info.onClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-dark-bg/50 border border-electric-blue/20 hover:border-electric-blue/50 hover:glow-blue'
                        : 'bg-gray-50/80 shadow-md hover:shadow-xl hover:glow-red'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-electric-blue/20 text-electric-blue'
                          : 'bg-accent-red/20 text-accent-red'
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4
                        className={`font-orbitron font-bold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}
                      >
                        {info.title}
                      </h4>
                      <p
                        className={`font-exo ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                        }`}
                      >
                        {info.content}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Business Hours */}
            <div
              className={`p-6 rounded-xl ${
                theme === 'dark'
                  ? 'bg-electric-blue/10 border border-electric-blue/30'
                  : 'bg-accent-red/10 border border-accent-red/30'
              }`}
            >
              <h4
                className={`font-orbitron font-bold mb-2 ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`}
              >
                Business Hours
              </h4>
              <p
                className={`font-exo text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                Monday - Saturday: 9:30 AM - 6:30 PM
                <br />
                Weekend: Emergency support available
              </p>
            </div>
          </div>

          {/* Form */}
          <div
            className={`rounded-2xl p-8 ${
              theme === 'dark'
                ? 'bg-dark-bg/50 border border-electric-blue/20'
                : 'bg-gray-50/80 shadow-xl'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className={`block font-exo font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg font-exo focus:outline-none transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-dark-lighter text-white border border-electric-blue/20 focus:border-electric-blue'
                      : 'bg-white text-black border border-gray-300 focus:border-accent-red'
                  }`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={`block font-exo font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg font-exo focus:outline-none transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-dark-lighter text-white border border-electric-blue/20 focus:border-electric-blue'
                      : 'bg-white text-black border border-gray-300 focus:border-accent-red'
                  }`}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className={`block font-exo font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg font-exo focus:outline-none transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-dark-lighter text-white border border-electric-blue/20 focus:border-electric-blue'
                      : 'bg-white text-black border border-gray-300 focus:border-accent-red'
                  }`}
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className={`block font-exo font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg font-exo focus:outline-none transition-all duration-300 resize-none ${
                    theme === 'dark'
                      ? 'bg-dark-lighter text-white border border-electric-blue/20 focus:border-electric-blue'
                      : 'bg-white text-black border border-gray-300 focus:border-accent-red'
                  }`}
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full py-4 rounded-lg font-exo font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isSubmitted
                    ? 'bg-green-500 text-white'
                    : theme === 'dark'
                    ? 'bg-electric-green text-black hover:glow-green hover:scale-105'
                    : 'bg-accent-red text-white hover:glow-red hover:scale-105'
                } ${(isSubmitting || isSubmitted) && 'opacity-75 cursor-not-allowed'}`}
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : isSubmitted ? (
                  <span>Message Sent!</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Modal (using iframe) */}
      {showMap && (
        <div
          onClick={() => setShowMap(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm cursor-pointer"
          aria-label="Close map"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-11/12 max-w-3xl h-[450px] rounded-xl overflow-hidden border-4 ${
              theme === 'dark' ? 'border-electric-blue bg-dark-card' : 'border-accent-red bg-white'
            } shadow-2xl`}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.7308590340035!2d83.20767237517455!3d17.80434178315571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39678013ee404f%3A0x184b35589f4bb765!2sNanoflows%20AI%20Software%20Technologies%20Private%20Limited!5e0!3m2!1sen!2sin!4v1762760607244!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <button
              onClick={() => setShowMap(false)}
              className={`absolute top-2 right-2 text-2xl font-bold rounded-full p-1 ${
                theme === 'dark' ? 'text-white bg-electric-blue/80' : 'text-black bg-accent-red/80'
              } hover:opacity-90 transition-opacity focus:outline-none`}
              aria-label="Close map"
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
