import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCloud } from "@fortawesome/free-solid-svg-icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F5F5F5] pt-32 pb-40 text-center">
      {/* Decorative Gradient Shapes */}
      <div 
        className="shape w-32 h-32 top-20 left-[8%] animate-float-slow opacity-80" 
        style={{ 
          background: 'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' 
        }}
      ></div>
      <div 
        className="shape w-40 h-28 top-40 right-[10%] animate-float-slow delay-700 opacity-70" 
        style={{ 
          background: 'linear-gradient(225deg, #A8E6CF 0%, #DCEDC1 100%)',
          borderRadius: '50% 50% 30% 70% / 50% 50% 70% 30%' 
        }}
      ></div>
      <div 
        className="shape w-24 h-24 bottom-20 left-[12%] animate-float-slow delay-500 opacity-70" 
        style={{ 
          background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
        }}
      ></div>
      <div 
        className="shape w-16 h-32 top-[15%] left-[45%] animate-float-slow delay-1500 opacity-60" 
        style={{ 
          background: 'linear-gradient(to top, #96fbc4 0%, #f9f586 100%)',
          borderRadius: '50px'
        }}
      ></div>

      {/* Floating FontAwesome Icons - Responsive */}
      <div className="absolute top-[8%] md:top-[10%] left-[5%] md:left-[10%] text-[#c6beee] text-4xl md:text-8xl -rotate-12 animate-float-slow opacity-60">
        <FontAwesomeIcon icon={faStar} />
      </div>  
      <div className="absolute bottom-[45%] md:bottom-[52%] left-[2%] text-[#E39A4D] text-4xl md:text-8xl -rotate-6 animate-float-slow delay-1000 opacity-50">
        <FontAwesomeIcon icon={faCloud} />
      </div>
      <div className="absolute top-[15%] md:top-[20%] right-[5%] md:left-[86%] text-[#fb8b4b] text-3xl md:text-7xl rotate-45 animate-float-slow delay-1500 opacity-40">
        <FontAwesomeIcon icon={faCloud} />
      </div>
      <div className="absolute bottom-[40%] md:bottom-[55%] right-[2%] md:right-[15%] text-[#a5c8d8ff] text-4xl md:text-7xl -rotate-12 animate-float-slow delay-500 opacity-60">
        <FontAwesomeIcon icon={faStar} />
      </div>

      <div className="container-podia relative z-10">
        <h1 className="md:text-[3.3rem] text-[2rem] max-w-4xl mx-auto leading-[1.05] mt-20 mb-8 px-4" style={{ fontWeight: 600, fontFamily: 'Aeonik, sans-serif' }}>
          Your Next Favorite Book Awaits
        </h1>
        <p className="md:text-[1.2rem] text-[0.8rem] mb-12 text-black px-6">
          Join 150,000+ avid readers who use Sabooka <br /><span className="hidden md:inline">to discover new worlds, collect rare editions, and feed their imagination.</span> 
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 px-4">
          <button className="podia-btn podia-btn-black text-lg px-10 py-5 w-full sm:w-auto">
            Start your reading journey
          </button>
        </div>

        {/* Playful Cards Layout */}
        <div className="relative mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative z-10 px-4">
            {/* Card 1 */}
            <div className="bg-[#A3D1E4] p-8 md:p-10 rounded-[40px] shadow-sm transform md:-rotate-2 hover:rotate-0 transition-all duration-500 min-h-[350px] md:min-h-[380px] flex flex-col">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Endless Collections</h3>
              <p className="text-[#202020] opacity-80 mb-8 leading-relaxed text-sm md:text-base">Browse thousands of titles. Discover hidden gems and let the stories take you on an unforgettable journey.</p>
              <div className="mt-auto flex flex-col gap-3">
                <div className="bg-white/30 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/50"></div>
                  <span className="text-xs md:text-sm font-bold">Fiction Bestsellers</span>
                </div>
                <div className="bg-white/30 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/50"></div>
                  <span className="text-xs md:text-sm font-bold">Academic Textbooks</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#fb8b4b] p-8 md:p-10 rounded-[40px] shadow-sm transform md:translate-y-8 hover:translate-y-4 transition-all duration-500 min-h-[350px] md:min-h-[380px] flex flex-col">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Curated Lists</h3>
              <p className="text-[#202020] opacity-80 mb-8 leading-relaxed text-sm md:text-base">Find your next obsession in less than 10 minutes with our carefully curated and themed reading lists.</p>
              <div className="mt-auto bg-white/20 p-6 rounded-3xl h-32 border border-white/30 relative overflow-hidden">
                <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full"></div>
                <div className="absolute top-2 left-7 w-3 h-3 bg-white/40 rounded-full"></div>
                <div className="absolute top-2 left-12 w-3 h-3 bg-white/40 rounded-full"></div>
                <div className="mt-4 bg-white/40 h-4 w-3/4 rounded-full mb-2"></div>
                <div className="bg-white/40 h-12 w-full rounded-2xl"></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#D1B3FF] p-8 md:p-10 rounded-[40px] shadow-sm transform md:rotate-2 hover:rotate-0 transition-all duration-500 min-h-[350px] md:min-h-[380px] flex flex-col">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Reader's Digest</h3>
              <p className="text-[#202020] opacity-80 mb-8 leading-relaxed text-sm md:text-base">Monthly newsletters featuring exclusive author interviews, new releases, and personalized book recommendations.</p>
              <div className="mt-auto flex justify-center">
                 <div className="w-full h-32 bg-white/20 rounded-t-full border-t border-x border-white/30 relative overflow-hidden">
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-white/40 rounded-full"></div>
                    <div className="absolute -bottom-4 left-4 w-12 h-12 bg-white/40 rounded-full"></div>
                    <div className="absolute -bottom-4 right-4 w-12 h-12 bg-white/40 rounded-full"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Transition */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[80px] md:h-[150px] fill-white">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}