const PageBackground = ({ children, className = "" }) => {
  return (
    <div
      className={`absolute w-full md:h-screen h-full overflow-hidden -z-10 ${className}`}
    >
      {/* SVG Background avec dégradé diagonal noir/teal */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#ffffff", stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#ffffff", stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#000000", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#51898E", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#bgGradient)" />
        {/* Bande noire diagonale */}
        <polygon points="0,900 1920,300 1920,600 0,1080" fill="#000000" />
      </svg>

      {/* Contenu */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PageBackground;
