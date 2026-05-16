import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-[#f0f0f0]">
      <div className="container-podia">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tighter text-black font-semibold mb-6 block">
              sabooka<span className="text-[#FB8B4B]">.</span>
            </Link>
          </div>
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#535862] mb-6">Shop</h4>
            <ul className="space-y-3 text-[15px] font-semibold text-[#202020]">
              <li><Link to="/books" className="hover:text-[#4b2aad]">Book Catalog</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Track Order</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Membership</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Special Offers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#535862] mb-6">Discover</h4>
            <ul className="space-y-3 text-[15px] font-semibold text-[#202020]">
              <li><Link to="#" className="hover:text-[#4b2aad]">Bestsellers</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Featured Authors</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Book Blog</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#535862] mb-6">Company</h4>
            <ul className="space-y-3 text-[15px] font-semibold text-[#202020]">
              <li><Link to="#" className="hover:text-[#4b2aad]">About Us</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Careers</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Partnerships</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#535862] mb-6">Support</h4>
            <ul className="space-y-3 text-[15px] font-semibold text-[#202020]">
              <li><Link to="#" className="hover:text-[#4b2aad]">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Help Center</Link></li>
              <li><Link to="#" className="hover:text-[#4b2aad]">Shopping Guide</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-[#f0f0f0] gap-6">
          <div className="flex items-center gap-6 text-[18px]">
            <Link to="#" className="hover:text-[#4b2aad]">𝕏</Link>
            <Link to="#" className="hover:text-[#4b2aad]">f</Link>
            <Link to="#" className="hover:text-[#4b2aad]">📸</Link>
            <Link to="#" className="hover:text-[#4b2aad]">▶</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[13px] font-medium text-[#535862]">
            <span>sabooka Inc. © 2026</span>
            <Link to="#" className="hover:text-black">Terms of Service</Link>
            <Link to="#" className="hover:text-black">Privacy Policy</Link>
            <Link to="#" className="hover:text-black">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}