import { Shield, GraduationCap, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md' | 'lg';
}

const RoleBadge = ({ role, size = 'md' }: RoleBadgeProps) => {
  const { theme } = useTheme();

  const getRoleConfig = () => {
    const normalizedRole = role?.toLowerCase();
    
    switch (normalizedRole) {
      case 'admin':
        return {
          label: 'Admin',
          icon: Shield,
          gradient: theme === 'dark'
            ? 'from-electric-blue to-electric-green'
            : 'from-accent-red to-accent-blue',
          bgColor: theme === 'dark'
            ? 'bg-electric-blue/10'
            : 'bg-accent-red/10',
          borderColor: theme === 'dark'
            ? 'border-electric-blue/30'
            : 'border-accent-red/30',
          textColor: theme === 'dark'
            ? 'text-electric-blue'
            : 'text-accent-red'
        };
      case 'instructor':
        return {
          label: 'Instructor',
          icon: GraduationCap,
          gradient: theme === 'dark'
            ? 'from-electric-green to-electric-blue'
            : 'from-accent-red to-red-600',
          bgColor: theme === 'dark'
            ? 'bg-electric-green/10'
            : 'bg-accent-red/10',
          borderColor: theme === 'dark'
            ? 'border-electric-green/30'
            : 'border-accent-red/30',
          textColor: theme === 'dark'
            ? 'text-electric-green'
            : 'text-accent-red'
        };
      case 'user':
      case 'student':
      default:
        return {
          label: 'Student',
          icon: User,
          gradient: theme === 'dark'
            ? 'from-gray-400 to-gray-600'
            : 'from-gray-500 to-gray-700',
          bgColor: theme === 'dark'
            ? 'bg-gray-600/10'
            : 'bg-gray-500/10',
          borderColor: theme === 'dark'
            ? 'border-gray-600/30'
            : 'border-gray-500/30',
          textColor: theme === 'dark'
            ? 'text-gray-400'
            : 'text-gray-600'
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${config.borderColor} ${config.bgColor} ${sizeClasses[size]} font-semibold ${config.textColor}`}
    >
      <Icon size={iconSizes[size]} />
      <span>{config.label}</span>
    </div>
  );
};

export default RoleBadge;
