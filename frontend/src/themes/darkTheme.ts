export default {
  mode: "dark",
  classes: {
    // Backgrounds
    containerBg: "bg-dark-card",
    mesh: "gradient-mesh",
    cardBg: "bg-dark-card/95",
    headerBg: "bg-dark-card/80",
    
    // Text
    headingPrimary: "text-white",
    headingAccent: "text-electric-green",
    title: "text-electric-green",
    text: "text-gray-300",
    textMuted: "text-gray-400",
    
    // Cards
    card: "bg-dark-card/50 border border-electric-blue/20",
    cardHover: "hover:bg-dark-card/70 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]",
    
    // Buttons
    primaryButton: "bg-gradient-to-r from-electric-blue to-electric-green text-white shadow-[0_8px_16px_rgba(0,240,255,0.4)] hover:shadow-[0_8px_20px_rgba(0,240,255,0.6)]",
    primaryButtonHover: "hover:scale-[1.02]",
    primaryButtonDisabled: "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
    navButton: "bg-electric-blue text-black hover:bg-electric-blue/80 focus:ring-electric-blue/60",
    downloadBtn: "text-black bg-electric-green hover:bg-electric-green/90 hover:scale-105 shadow-[0_4px_12px_rgba(0,232,129,0.6)]",
    downloadBtnPressed: "scale-95 bg-electric-green/80 shadow-[0_4px_10px_rgba(0,232,129,0.6)]",
    
    // Form Elements
    input: "border-2 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/20",
    label: "text-white",
    checkbox: "h-4 w-4 rounded border border-slate-600 bg-slate-800 text-electric-blue focus:ring-2 focus:ring-electric-blue",
    
    // Error States
    errorBorder: "border-2 border-red-500/40",
    errorBg: "bg-red-500/15",
    errorText: "text-red-200",
    
    // Success States
    successBorder: "border-2 border-green-500/40",
    successBg: "bg-green-500/15",
    successText: "text-green-200",
    
    // Borders
    border: "border-electric-blue/20",
    borderHover: "hover:border-electric-blue",
    borderAccent: "border-electric-blue/30",
    
    // Shadows
    shadow: "shadow-[0_8px_16px_rgba(0,240,255,0.2)]",
    shadowHover: "hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]",
    
    // Theme Toggle
    themeToggleBg: "bg-dark-card/80",
    themeToggleBorder: "border-2 border-electric-blue/30",
    themeToggleHover: "hover:border-electric-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]",
    themeToggleIcon: "text-electric-green",
    
    // Links
    link: "text-electric-blue hover:text-electric-green",
    linkMuted: "text-gray-400 hover:text-electric-green",
    
    // Gradients
    primaryGradient: "from-electric-blue to-electric-green",
    reverseGradient: "from-electric-green to-electric-blue",
    iconGradient: "bg-gradient-to-br from-electric-blue to-electric-green",
    badgeGradient: "border border-electric-blue/30 bg-electric-blue/10 text-electric-blue",
    
    // Blur Effects
    blurPrimary: "bg-electric-blue/10",
    blurSecondary: "bg-electric-green/10",
    
    // Focus Rings
    focusRing: "focus-visible:ring-4 focus-visible:ring-electric-blue/50",
    
    // Dots
    dotActive: "bg-electric-green",
    dotInactive: "bg-gray-600",
    
    // Platform Selection Cards
    platformCardBorder: "border-2 border-electric-blue/30",
    platformCardHover: "hover:border-electric-blue",
    platformCardShadow: "shadow-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
  },
  colors: {
    darkCard: "#071021",
    electricBlue: "#00F0FF",
    electricGreen: "#00E881",
    accentRed: "#EB3232",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray600: "#4B5563"
  },
  toStyleVars() {
    return {
      "--dark-card": "#071021",
      "--electric-blue": "#00F0FF",
      "--electric-green": "#00E881",
      "--accent-red": "#EB3232",
      "--gray-300": "#D1D5DB",
      "--gray-400": "#9CA3AF",
      "--gray-600": "#4B5563"
    };
  }
};
