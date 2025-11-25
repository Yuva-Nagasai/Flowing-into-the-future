import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SocialMediaBar from '../components/SocialMediaBar';

const ContactPage = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
      <Header />
      <main className="flex-1 pt-24 lg:pt-32 space-y-8">
        <div className="flex justify-center px-4 sm:px-6">
          <SocialMediaBar />
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;

