

export default function StackedCards() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800 flex items-center justify-center p-8">
      <div className="relative w-full max-w-md">
        {/* Card 3 - Background */}
        <div className="absolute inset-0 bg-blue-400 rounded-[2.5rem] transform translate-y-8 translate-x-4 opacity-60"></div>
        
        {/* Card 2 - Middle */}
        <div className="absolute inset-0 bg-blue-500 rounded-[2.5rem] transform translate-y-4 translate-x-2 opacity-80"></div>
        
        {/* Card 1 - Front */}
        <div className="relative bg-linear-to-b from-blue-400 to-blue-600 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="h-96 relative">
            {/* Contenu de la carte */}
            <div className="p-8 relative z-10">
              <h2 className="text-white text-3xl font-bold mb-2">Card Title</h2>
              <p className="text-blue-100">Your content here</p>
            </div>
            
            {/* Vague décorative en bas */}
            <div className="absolute bottom-0 left-0 right-0">
              {/* Vague noire supérieure */}
              <svg viewBox="0 0 1440 120" className="w-full">
                <path
                  fill="#2d3748"
                  d="M0,64 C240,100 480,100 720,64 C960,28 1200,28 1440,64 L1440,120 L0,120 Z"
                />
              </svg>
              
              {/* Vague bleue claire */}
              <div className="bg-gray-700 relative" style={{ marginTop: '-2px' }}>
                <svg viewBox="0 0 1440 60" className="w-full absolute top-0">
                  <path
                    fill="#60a5fa"
                    d="M0,32 C240,50 480,50 720,32 C960,14 1200,14 1440,32 L1440,0 L0,0 Z"
                  />
                </svg>
                <div className="h-16 bg-gray-700"></div>
              </div>
              
              {/* Base noire */}
              <div className="bg-black h-8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}