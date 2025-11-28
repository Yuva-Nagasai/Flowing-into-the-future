import { Link, useLocation } from 'react-router-dom';
import { Globe, GraduationCap, Cpu, LayoutGrid, ShoppingBag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const items = [
  { label: '1 Website', to: '/', icon: Globe, featured: true, type: 'main' as const },
  { label: '2 E-Learning', to: '/elearning', icon: GraduationCap },
  { label: '3 AI Tools', to: '/ai-tools', icon: Cpu },
  { label: '4 Shop', to: '/shop', icon: ShoppingBag },
  { label: '5 Digital Hub', to: '/contact', icon: LayoutGrid },
];

const TopFeatureNav = () => {
  const { theme } = useTheme();
  const location = useLocation();

  const baseStyles =
    'flex items-center justify-center rounded-2xl px-1.5 py-2.5 md:px-1 md:py-1.5 flex-1 md:flex-none md:w-[70px] lg:w-[78px] min-w-0 transition-all duration-200 border h-12 md:h-11 shadow-sm';

  const wrapperClasses =
    theme === 'dark'
      ? 'bg-[#030b1f] border-b border-electric-blue/20 shadow-[0_2px_12px_rgba(0,0,0,0.45)]'
      : 'bg-white border-b border-gray-200/80 shadow-[0_2px_12px_rgba(46,55,77,0.08)]';

  return (
    <div className={`${wrapperClasses} backdrop-blur-[2px]`}>
      <div className="container mx-auto px-4 lg:px-6">
        <div
          className="grid grid-cols-5 gap-2 py-3 sm:gap-3 md:flex md:flex-nowrap md:justify-between md:gap-3 lg:gap-4 md:overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: 'none' as const, msOverflowStyle: 'none' as const }}
        >
          {items.map(({ label, to, icon: Icon, type }) => {
            const pathname = location.pathname;
            const isMainSitePath = !(
              pathname.startsWith('/elearning') ||
              pathname.startsWith('/ai-tools') ||
              pathname.startsWith('/academy') ||
              pathname.startsWith('/shop')
            );

            const isActive =
              type === 'main'
                ? isMainSitePath
                : to === '/'
                  ? pathname === '/'
                  : pathname.startsWith(to);

            const activeClasses =
              theme === 'dark'
                ? 'bg-gradient-to-r from-electric-green to-electric-blue text-[#041226] border-transparent shadow-[0_8px_18px_rgba(0,240,255,0.25)]'
                : 'bg-gradient-to-r from-accent-red to-accent-blue text-white border-transparent shadow-[0_8px_18px_rgba(244,63,94,0.25)]';

            const inactiveClasses =
              theme === 'dark'
                ? 'bg-[#09142b] text-slate-100 border-electric-blue/30 hover:border-electric-green/60 hover:bg-[#0f1f3f]'
                : 'bg-gray-50 text-slate-800 border-gray-200 hover:border-accent-blue/60 hover:bg-white hover:text-accent-blue';

            return (
              <Link
                key={label}
                to={to}
                className={`${baseStyles} ${isActive ? activeClasses : inactiveClasses}`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopFeatureNav;

