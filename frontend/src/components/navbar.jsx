import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { getCart } from "../_services/cart";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const updateCartCount = async () => {
    if (!accessToken) {
      setCartCount(0);
      return;
    }
    try {
      const response = await getCart();
      const count = response.data.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error("Failed to update cart count:", error);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, [accessToken]);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      setCartCount(0);
      navigate("/login");
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavLinks = () => (
    <>
      <Link to="/" className="text-[15px] font-semibold text-black hover:underline" onClick={() => setIsOpen(false)}>Home</Link>
      <Link to="/books" className="text-[15px] font-semibold text-black hover:underline" onClick={() => setIsOpen(false)}>Product</Link>
      <Link to="/about" className="text-[15px] font-semibold text-black hover:underline" onClick={() => setIsOpen(false)}>About</Link>
      <Link to="/contact" className="text-[15px] font-semibold text-black hover:underline" onClick={() => setIsOpen(false)}>Help</Link>
      {accessToken && userInfo?.role === "admin" && (
        <Link to="/admin" className="text-[15px] font-semibold text-black hover:underline" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
      )}
    </>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F5F5]">
        <nav className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-2xl font-black tracking-tighter text-black font-semibold">
              sabooka<span className="text-[#FB8B4B]">.</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              <NavLinks />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* History Link */}
            {accessToken && (
               <Link to="/history" className="flex items-center gap-2 p-2 text-black hover:text-[#4b2aad] transition-colors" title="Riwayat Pesanan">
                 <span className="hidden xl:inline text-[15px] font-semibold text-black hover:underline">Order History</span>
               </Link>
            )}

            {/* Cart Icon */}
            {accessToken && (
              <Link to="/cart" className="relative p-2 text-black hover:text-[#4b2aad] transition-colors">
                <FontAwesomeIcon icon={faShoppingBag} className="text-xl md:text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#F5F5F5]">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-6 border-l border-black/5 pl-6">
              {accessToken ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center focus:outline-none transition-transform hover:scale-105"
                  >
                    <img 
                      src={`https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(userInfo?.name || 'User')}&backgroundColor=transparent`}
                      alt={userInfo?.name}
                      className="w-10 h-10 rounded-full bg-[#FB8B4B]/10 object-cover border border-black/5"
                    />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-50">
                        <div className="p-4 border-b border-black/5 bg-[#A3D1E4]/5">
                          <p className="text-sm font-bold text-black truncate">{userInfo?.name}</p>
                          <p className="text-xs text-black/50 truncate mt-0.5">{userInfo?.email}</p>
                        </div>
                        <div className="p-2">
                          <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#FB8B4B] bg-[#FB8B4B]/10 hover:bg-[#FB8B4B]/20 rounded-xl transition-colors font-medium flex items-center gap-3"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-[15px] font-semibold text-black hover:underline">
                    Sign In
                  </Link>
                  <Link to="/register" className="podia-btn podia-btn-black py-2 px-6 h-10 text-[14px]">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden p-2 text-black text-2xl focus:outline-none"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden absolute top-16 left-0 right-0 bg-[#F5F5F5] border-b border-black/10 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col p-6 gap-6 shadow-xl text-center">
            <NavLinks />
            {accessToken && (
              <Link to="/history" className="flex items-center justify-center gap-2 text-[15px] font-semibold text-black hover:underline" onClick={() => setIsOpen(false)}>
                Order History
              </Link>
            )}
            <hr className="border-black/5" />
            <div className="flex flex-col gap-4">
              {accessToken ? (
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="flex flex-col items-center justify-center">
                    <img 
                      src={`https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(userInfo?.name || 'User')}&backgroundColor=transparent`}
                      alt={userInfo?.name}
                      className="w-16 h-16 rounded-full bg-[#FB8B4B]/10 object-cover border border-black/5 mb-3"
                    />
                    <p className="text-[16px] font-bold text-black">{userInfo?.name}</p>
                    <p className="text-[13px] text-black/50">{userInfo?.email}</p>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-[#FB8B4B] text-white font-bold py-3 px-6 rounded-2xl shadow-md shadow-[#FB8B4B]/30 hover:bg-[#FB8B4B]/90 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-[15px] font-semibold text-black py-2" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="podia-btn podia-btn-black py-3 px-6 text-[14px] w-full" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}