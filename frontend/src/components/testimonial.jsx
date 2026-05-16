export default function Testimonial() {
  return (
    <section className="section-padding bg-[#eef9f5]">
      <div className="container-podia">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-[25px] md:text-[35px] font-extrabold mb-6 leading-tight">
              Every Story You Crave, All in One Place.
            </h2>
            <p className="text-[14px] md:text-[18px] text-[#202020] font-medium leading-relaxed mb-8">
              "Instead of hunting across different stores, I can find all the latest fiction and academic collections at Sabooka. It truly is a reader's paradise."
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[#535862]">— Valeria Hernández, Avid Reader</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-12">
            {[
              "Vast Catalog", "Real-time Stock", "Secure Checkout", "Swift Delivery", 
              "Exclusive Perks", "Reader Reviews", "Smart Suggestions", "24/7 Support"
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-[15px] font-semibold">
                <div className="w-5 h-5 rounded-full bg-[#4b2aad] flex items-center justify-center text-white">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
