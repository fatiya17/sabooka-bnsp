import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout, useDecodeToken } from "../_services/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function AdminLayout() {
  const token = localStorage.getItem("accessToken");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const decodedToken = useDecodeToken(token);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  useEffect(() => {
    if (!token || !decodedToken || !decodedToken.success) {
      return navigate("/login")
    }

    const role = userInfo?.role;
    if (role !== "admin" || !role) {
      return navigate("/");
    }
  }, [token, decodedToken, navigate, userInfo])

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      await logout();
      navigate("/login");
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isOverview = path === '/admin';
  const isBooks = path.startsWith('/admin/books');
  const isGenres = path.startsWith('/admin/genres');
  const isAuthors = path.startsWith('/admin/authors');
  const isTransactions = path.startsWith('/admin/transactions');
  const isUsers = path.startsWith('/admin/users');

  const textClass = isDesktopCollapsed ? "hidden md:hidden" : "";

  return (
    <div className="min-h-screen bg-[#A3D1E4]/5 flex">
      {/* Mobile-only Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white h-16 px-4 flex items-center justify-between border-b border-black/5">
        <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="text-black focus:outline-none hover:text-[#FB8B4B] transition-colors p-2">
              <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="text-xl" />
            </button>
            <Link to="/admin" className="text-xl font-black tracking-tighter text-black font-semibold">
              sabooka<span className="text-[#FB8B4B]">.</span>
            </Link>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 bg-white border-r border-black/5 z-50 transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${isDesktopCollapsed ? "md:w-20 w-64" : "w-64"}`}>
        {/* Logo Area */}
        <div className={`h-20 flex items-center px-6 border-b border-black/5 shrink-0 ${isDesktopCollapsed ? "justify-center" : "justify-between"}`}>
            {!isDesktopCollapsed && (
              <Link to="/admin" className="text-2xl font-semibold tracking-tighter text-black flex items-center gap-2">
                <span>sabooka<span className="text-[#FB8B4B]">.</span></span>
              </Link>
            )}
            <button onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)} className="hidden md:flex text-black/50 hover:text-black focus:outline-none p-2 shrink-0">
                <FontAwesomeIcon icon={faBars} />
            </button>
            <button onClick={closeSidebar} className="md:hidden ml-auto text-black/50 hover:text-black">
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>

        {/* Navigation Area */}
        <div className={`py-6 overflow-y-auto overflow-x-hidden flex-1 ${isDesktopCollapsed ? "px-3" : "px-6"}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4 font-secondary ml-2 ${textClass}`}>Menu Utama</p>
          <ul className="space-y-2">
            <li>
              <Link onClick={closeSidebar} to="/admin" title="Overview" className={`flex items-center gap-3 py-3 rounded-2xl transition-all group ${isDesktopCollapsed ? "px-0 justify-center" : "px-4"} ${isOverview ? 'bg-[#A3D1E4]  font-bold shadow-md shadow-[#A3D1E4]/30' : 'hover:bg-[#A3D1E4]/20 text-black'}`}>
                <svg className={`w-5 h-5 shrink-0 transition-colors ${isOverview ? 'text-black' : 'text-black/40 group-hover:text-[#A3D1E4]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                {!isDesktopCollapsed && <span className="font-light text-[15px] whitespace-nowrap">Overview</span>}
              </Link>
            </li>
            <li>
              <Link onClick={closeSidebar} to="/admin/books" title="Books" className={`flex items-center gap-3 py-3 rounded-2xl transition-all group ${isDesktopCollapsed ? "px-0 justify-center" : "px-4"} ${isBooks ? 'bg-[#FB8B4B] font-bold shadow-md shadow-[#FB8B4B]/30' : 'hover:bg-[#FB8B4B]/20 text-black'}`}>
                <svg className={`w-5 h-5 shrink-0 transition-colors ${isBooks ? 'text-black' : 'text-black/40 group-hover:text-[#FB8B4B]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                {!isDesktopCollapsed && <span className="font-light text-[15px] whitespace-nowrap">Books</span>}
              </Link>
            </li>
            <li>
              <Link onClick={closeSidebar} to="/admin/genres" title="Genres" className={`flex items-center gap-3 py-3 rounded-2xl transition-all group ${isDesktopCollapsed ? "px-0 justify-center" : "px-4"} ${isGenres ? 'bg-[#D1B3FF] font-bold shadow-md shadow-[#D1B3FF]/30' : 'hover:bg-[#D1B3FF]/20 text-black'}`}>
                <svg className={`w-5 h-5 shrink-0 transition-colors ${isGenres ? 'text-black' : 'text-black/40 group-hover:text-[#D1B3FF]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                {!isDesktopCollapsed && <span className="font-light text-[15px] whitespace-nowrap">Genres</span>}
              </Link>
            </li>
            <li>
              <Link onClick={closeSidebar} to="/admin/authors" title="Authors" className={`flex items-center gap-3 py-3 rounded-2xl transition-all group ${isDesktopCollapsed ? "px-0 justify-center" : "px-4"} ${isAuthors ? 'bg-[#A3D1E4] font-bold shadow-md shadow-[#A3D1E4]/30' : 'hover:bg-[#A3D1E4]/20 text-black'}`}>
                <svg className={`w-5 h-5 shrink-0 transition-colors ${isAuthors ? 'text-black' : 'text-black/40 group-hover:text-[#A3D1E4]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {!isDesktopCollapsed && <span className="font-light text-[15px] whitespace-nowrap">Authors</span>}
              </Link>
            </li>
          </ul>

          <p className={`text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4 mt-8 font-secondary ml-2 ${textClass}`}>Store</p>
          <ul className="space-y-2">
            <li>
              <Link onClick={closeSidebar} to="/admin/transactions" title="Transactions" className={`flex items-center gap-3 py-3 rounded-2xl transition-all group ${isDesktopCollapsed ? "px-0 justify-center" : "px-4"} ${isTransactions ? 'bg-[#FB8B4B] font-bold shadow-md shadow-[#FB8B4B]/30' : 'hover:bg-[#FB8B4B]/20 text-black'}`}>
                <svg className={`w-5 h-5 shrink-0 transition-colors ${isTransactions ? 'text-black' : 'text-black/40 group-hover:text-[#FB8B4B]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                {!isDesktopCollapsed && <span className="font-light text-[15px] whitespace-nowrap">Transactions</span>}
              </Link>
            </li>
            <li>
              <Link onClick={closeSidebar} to="/admin/users" title="Users" className={`flex items-center gap-3 py-3 rounded-2xl transition-all group ${isDesktopCollapsed ? "px-0 justify-center" : "px-4"} ${isUsers ? 'bg-[#D1B3FF] font-bold shadow-md shadow-[#D1B3FF]/30' : 'hover:bg-[#D1B3FF]/20 text-black'}`}>
                <svg className={`w-5 h-5 shrink-0 transition-colors ${isUsers ? 'text-black' : 'text-black/40 group-hover:text-[#D1B3FF]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                {!isDesktopCollapsed && <span className="font-light text-[15px] whitespace-nowrap">Users</span>}
              </Link>
            </li>
          </ul>
        </div>

        {/* User Profile Area */}
        <div className={`p-4 border-t border-black/5 mt-auto flex justify-center ${isDesktopCollapsed ? "items-center" : ""}`}>
            <button onClick={handleLogout} title="Logout" className={`w-full flex items-center p-3 hover:bg-[#F5F5F5] rounded-2xl transition-colors group ${isDesktopCollapsed ? "justify-center px-0" : "justify-between"}`}>
                <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(userInfo?.name || 'Admin')}&backgroundColor=transparent`} 
                      alt="avatar" 
                      className="w-10 h-10 rounded-full bg-[#FB8B4B]/10 shrink-0" 
                    />
                    {!isDesktopCollapsed && (
                      <div className="text-left">
                          <p className="font-bold text-sm text-black truncate w-24">{userInfo?.name}</p>
                          <p className="text-xs text-black/50">Logout</p>
                      </div>
                    )}
                </div>
                {!isDesktopCollapsed && (
                  <svg className="w-5 h-5 text-black/20 group-hover:text-[#FB8B4B] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                )}
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out pt-16 md:pt-0 min-h-screen ${isDesktopCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
