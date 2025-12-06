export default {
  mode: "light",
  classes: {
    // Backgrounds
    containerBg: "bg-white",
    mesh: "gradient-mesh-light",
    cardBg: "bg-white/95",
    headerBg: "bg-white/80",
    
    // Text
    headingPrimary: "text-black",
    headingAccent: "text-accent-red",
    title: "text-accent-red",
    text: "text-gray-800",
    textMuted: "text-gray-700",
    
    // Cards
    card: "bg-white/80 border border-gray-200",
    cardHover: "hover:bg-white/90 hover:shadow-[0_0_25px_rgba(235,50,50,0.4)]",
    
    // Buttons
    primaryButton: "bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-[0_8px_16px_rgba(235,50,50,0.4)] hover:shadow-[0_8px_20px_rgba(0,123,255,0.6)]",
    primaryButtonHover: "hover:scale-[1.02]",
    primaryButtonDisabled: "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
    navButton: "bg-accent-red text-white hover:bg-accent-red/80 focus:ring-accent-red/60",
    downloadBtn: "text-white bg-accent-red hover:bg-accent-red/90 hover:scale-105 shadow-[0_4px_12px_rgba(235,50,50,0.6)]",
    downloadBtnPressed: "scale-95 bg-accent-red/80 shadow-[0_4px_10px_rgba(235,50,50,0.6)]",
    
    // Form Elements
    input: "border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/20",
    label: "text-black",
    checkbox: "h-4 w-4 rounded border border-slate-300 text-accent-blue focus:ring-2 focus:ring-accent-blue",
    
    // Error States
    errorBorder: "border-2 border-red-200",
    errorBg: "bg-red-50",
    errorText: "text-red-700",
    
    // Success States
    successBorder: "border-2 border-green-200",
    successBg: "bg-green-50",
    successText: "text-green-700",
    
    // Borders
    border: "border-accent-blue/20",
    borderHover: "hover:border-accent-blue",
    borderAccent: "border-accent-blue/30",
    
    // Shadows
    shadow: "shadow-[0_8px_16px_rgba(0,123,255,0.1)]",
    shadowHover: "hover:shadow-[0_0_30px_rgba(0,123,255,0.3)]",
    
    // Theme Toggle
    themeToggleBg: "bg-white/80",
    themeToggleBorder: "border-2 border-accent-blue/30",
    themeToggleHover: "hover:border-accent-blue hover:shadow-[0_0_15px_rgba(0,123,255,0.3)]",
    themeToggleIcon: "text-accent-blue",
    
    // Links
    link: "text-accent-red hover:text-accent-blue",
    linkMuted: "text-slate-600 hover:text-accent-blue",
    
    // Gradients
    primaryGradient: "from-accent-red to-accent-blue",
    reverseGradient: "from-accent-blue to-accent-red",
    iconGradient: "bg-gradient-to-br from-accent-red to-accent-blue",
    badgeGradient: "border border-accent-red/30 bg-gradient-to-r from-accent-red/10 to-accent-blue/10 text-accent-red",
    
    // Blur Effects
    blurPrimary: "bg-accent-red/10",
    blurSecondary: "bg-accent-blue/10",
    
    // Focus Rings
    focusRing: "focus-visible:ring-4 focus-visible:ring-accent-blue/50",
    
    // Dots
    dotActive: "bg-accent-blue",
    dotInactive: "bg-gray-300",
    
    // Platform Selection Cards
    platformCardBorder: "border-2 border-accent-blue/30",
    platformCardHover: "hover:border-accent-blue",
    platformCardShadow: "shadow-xl hover:shadow-[0_0_30px_rgba(0,123,255,0.3)]"
  },
  colors: {
    white: "#FFFFFF",
    accentRed: "#EB3232",
    accentBlue: "#007BFF",
    gray800: "#1F2937",
    gray700: "#374151",
    gray300: "#D1D5DB"
  },
  toStyleVars() {
    return {
      "--white": "#FFFFFF",
      "--accent-red": "#EB3232",
      "--accent-blue": "#007BFF",
      "--gray-800": "#1F2937",
      "--gray-700": "#374151",
      "--gray-300": "#D1D5DB"
    };
  }
};
