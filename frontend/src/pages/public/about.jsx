import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faTags, faTruckFast } from "@fortawesome/free-solid-svg-icons";

export default function About() {
  // user: menginisialisasi data tim untuk ditampilkan detailnya di halaman about us
  const teamMembers = [
    { name: "Alex Johnson", role: "Founder & CEO", color: "bg-[#A3D1E4]" },
    { name: "Sarah Williams", role: "Head of Operations", color: "bg-[#FB8B4B]" },
    { name: "Michael Chen", role: "Lead Curator", color: "bg-[#D1B3FF]" },
    { name: "Emma Davis", role: "Customer Experience", color: "bg-[#A3D1E4]" },
  ];

  return (
    <div className="relative bg-[#F5F5F5] min-h-screen pt-28 pb-20 overflow-hidden">
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>
      {/* Gradient fade out for the grid */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#FAFAFA] pointer-events-none"></div>
      
      {/* Hero Section */}
      <section className="container-podia px-4 text-center mb-16 md:mb-24 relative z-10">
        <h1 className="text-3xl md:text-[45px] font-black text-black mb-10 tracking-tighter" style={{ fontFamily: 'Aeonik, sans-serif' }}>
          Discover the Story Behind <br className="hidden md:block" /><span className="text-[#FB8B4B] ">sabooka.</span>
        </h1>
        <p className="text-[15px] md:text-[18px] text-black font-normal max-w-3xl mx-auto leading-relaxed mb-20">
           <span className="font-bold text-black">2026</span>, sabooka was born from a simple passion: connecting people with the stories that matter. We are more than just a bookstore; we are a vibrant community of avid readers.
        </p>
      </section>

      {/* Mission & What We Offer */}
      <section className="container-podia px-4 mb-16 md:mb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Mission */}
          <div className="bg-[#A3D1E4] rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-sm transform hover:-translate-y-2 transition-all duration-500">
            <h2 className="text-2xl md:text-[28px] font-black mb-6 text-black tracking-tighter" style={{ fontFamily: 'Aeonik, sans-serif' }}>Our Mission</h2>
            <p className="text-black/80 text-[15px] md:text-[18px] leading-relaxed font-normal">
              To democratize access to knowledge and inspiration by offering an extensive, carefully curated selection of books at unbeatable prices. We believe that the right book at the right time can change a life.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-[#D1B3FF] rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-sm transform hover:-translate-y-2 transition-all duration-500">
            <h2 className="text-2xl md:text-[28px] font-black mb-6 text-black tracking-tighter" style={{ fontFamily: 'Aeonik, sans-serif' }}>What We Offer</h2>
            <ul className="space-y-5">
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/40 flex items-center justify-center text-black shadow-sm shrink-0 text-lg">
                  <FontAwesomeIcon icon={faBookOpen} />
                </div>
                <span className="text-black text-base md:text-lg leading-tight">Extensive catalog of diverse genres & authors</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/40 flex items-center justify-center text-black shadow-sm shrink-0 text-lg">
                  <FontAwesomeIcon icon={faTags} />
                </div>
                <span className="text-black text-base md:text-lg leading-tight">Unbeatable prices and exclusive daily discounts</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/40 flex items-center justify-center text-black shadow-sm shrink-0 text-lg">
                  <FontAwesomeIcon icon={faTruckFast} />
                </div>
                <span className="text-black text-base md:text-lg leading-tight">Fast and reliable nationwide shipping right to your door</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to Shop */}
      <section className="bg-transparent py-10 md:py-16 mb-16 md:mb-24 relative z-10">
        <div className="container-podia px-4 text-center">
          <h2 className="text-3xl md:text-[40px] font-black text-black mb-10 tracking-tighter" style={{ fontFamily: 'Aeonik, sans-serif' }}>How to Shop with Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-black/5 -translate-y-12"></div>

            {/* Step 1 */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm relative z-10 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#FB8B4B] text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg">1</div>
              <h3 className="text-xl font-bold mb-3 text-black">Browse & Discover</h3>
              <p className="text-black/60 text-sm md:text-base font-medium leading-relaxed">Explore our extensive catalog and find your next favorite book using our smart filters.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm relative z-10 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#A3D1E4] text-black rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg">2</div>
              <h3 className="text-xl font-bold mb-3 text-black">Add to Cart</h3>
              <p className="text-black/60 text-sm md:text-base font-medium leading-relaxed">Found what you love? Simply add it to your secure cart and proceed when you're ready.</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm relative z-10 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#D1B3FF] text-black rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg">3</div>
              <h3 className="text-xl font-bold mb-3 text-black">Fast Checkout</h3>
              <p className="text-black/60 text-sm md:text-base font-medium leading-relaxed">Complete your order. We will quickly process and ship your books right to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet The Team */}
      <section className="container-podia px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-[40px] font-black text-black mb-6 tracking-tighter" style={{ fontFamily: 'Aeonik, sans-serif' }}>Meet The Team</h2>
        <p className="text-[15px] md:text-[18px] text-black/60 font-normal mb-12 md:mb-16 max-w-2xl mx-auto">The passionate readers and hard workers behind the scenes ensuring you get the best experience possible.</p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer">
              <div className="relative mb-5">
                <div className={`absolute inset-0 bg-black/5 rounded-[40px] rotate-3 group-hover:rotate-6 transition-all duration-300`}></div>
                <img 
                  src={`https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=transparent`}
                  alt={member.name}
                  className={`relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-[40px] ${member.color} object-cover border-4 border-white shadow-sm transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500`}
                />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-black">{member.name}</h4>
              <p className="text-[12px] md:text-[12px]   text-black/50 font-bold tracking-wide mt-1 uppercase">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
