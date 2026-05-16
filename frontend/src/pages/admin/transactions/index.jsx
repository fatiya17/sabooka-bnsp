import { useEffect, useState, useRef } from "react";
import { deleteTransaction, getTransactions } from "../../../_services/transactions";
import { getBooks } from "../../../_services/books";
import { getUsers } from "../../../_services/users";
import { Link } from "react-router-dom";
import { bookImageStorage } from "../../../_api";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Detail Modal
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "PAID", label: "Paid" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "COMPLETED", label: "Completed" },
    { value: "EXPIRED", label: "Expired" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [transData, booksData, usersData] = await Promise.all([
        getTransactions(), 
        getBooks(),
        getUsers()
      ]);
      setTransactions(transData.data);
      setBooks(booksData.data);
      setUsers(usersData.data);
    };

    fetchData();
  }, []);

  const getBookInfo = (id) => {
    return books.find((book) => book.id === id) || {};
  }

  const getUserInfo = (id) => {
    return users.find((user) => user.id === id) || { name: 'Unknown User', email: '' };
  }

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");

    if (confirmDelete) {
      try {
        await deleteTransaction(id);
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="px-3 py-1 bg-[#A3D1E4] text-black rounded-full text-xs font-light font-primary border border-black/5">Paid</span>;
      case 'PROCESSING':
        return <span className="px-3 py-1 bg-[#FB8B4B] text-white rounded-full text-xs font-light font-primary border border-black/5">Processing</span>;
      case 'SHIPPED':
        return <span className="px-3 py-1 bg-[#D1B3FF] text-black rounded-full text-xs font-light font-primary border border-black/5">Shipped</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-light font-primary">Completed</span>;
      case 'EXPIRED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-light font-primary border border-black/5">Expired</span>;
      case 'PENDING':
      default:
        return <span className="px-3 py-1 bg-[#A3D1E4]/20 text-black rounded-full text-xs font-light font-primary border border-black/5">Pending</span>;
    }
  };

  // Filter Logic
  const filteredTransactions = transactions.filter((t) => {
    const book = getBookInfo(t.book_id);
    const user = getUserInfo(t.customer_id);
    const dateMatches = dateFilter ? t.created_at.startsWith(dateFilter) : true;
    const statusMatches = statusFilter ? t.status === statusFilter : true;
    const searchMatches = 
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.order_number?.toLowerCase().includes(searchQuery.toLowerCase());
      
    return dateMatches && statusMatches && searchMatches;
  });

  return (
    <>
      <section className="p-0 sm:p-0">
        <div className="bg-white rounded-[24px] border border-[#A3D1E4]/20 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-6 border-b border-[#A3D1E4]/20">
            <h2 className="text-xl font-light text-black font-primary">Transactions Data</h2>
            <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
              {/* Filter Tanggal */}
              <div className="relative">
                <input 
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-[#A3D1E4]/10 border-none text-black text-sm font-light rounded-full focus:ring-2 focus:ring-[#A3D1E4] px-4 py-2 outline-none w-full cursor-pointer"
                />
              </div>
              
              {/* Custom Filter Status */}
              <div className="relative">
                <button 
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="bg-[#A3D1E4]/10 border-none text-black text-sm font-light rounded-full px-4 py-2 outline-none flex items-center justify-between min-w-[160px] w-full"
                >
                  <span>{statusOptions.find(o => o.value === statusFilter)?.label || "All Statuses"}</span>
                  <svg className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-20">
                    <ul className="py-2">
                      {statusOptions.map((opt) => (
                        <li key={opt.value}>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm font-light hover:bg-[#A3D1E4]/20 text-black transition-colors"
                            onClick={() => {
                              setStatusFilter(opt.value);
                              setIsStatusDropdownOpen(false);
                            }}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Pencarian */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg aria-hidden="true" className="w-4 h-4 text-black/40" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#A3D1E4]/10 border-none text-black text-sm font-light rounded-full focus:ring-2 focus:ring-[#A3D1E4] block w-full pl-10 px-4 py-2 transition-all outline-none"
                  placeholder="Search transactions..."
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-black/80">
              <thead className="text-xs text-black font-light uppercase bg-[#A3D1E4]/10 border-b border-[#A3D1E4]/20 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4 text-center">Cover</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Qty</th>
                  <th scope="col" className="px-6 py-4">Total Amount</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => {
                    const book = getBookInfo(t.book_id);
                    const user = getUserInfo(t.customer_id);
                    return (
                      <tr key={t.id} className="border-b border-black/5 hover:bg-[#A3D1E4]/5 transition-colors">
                        <td className="px-6 py-4 flex justify-center items-center">
                          <div className="w-12 h-16 rounded-lg bg-[#A3D1E4]/10 overflow-hidden shadow-sm">
                            {book.cover_photo && (
                              <img 
                                src={`${bookImageStorage}/${book.cover_photo}`} 
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={`https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=transparent`}
                              alt={user.name}
                              className="w-8 h-8 rounded-full bg-[#FB8B4B]/20 object-cover shrink-0"
                            />
                            <div>
                              <p className="font-light text-black">{user.name}</p>
                              <p className="text-xs font-light text-black/50">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-light text-black">{t.quantity}</td>
                        <td className="px-6 py-4 font-light text-black">Rp. {Number(t.amount).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">
                          {renderStatusBadge(t.status)}
                        </td>
                        <td className="px-6 py-4 flex items-center justify-end relative">
                          <button
                            onClick={() => toggleDropdown(t.id)}
                            className="inline-flex items-center p-2 text-sm font-medium text-center text-black/40 hover:bg-[#A3D1E4]/20 hover:text-black rounded-full focus:outline-none transition-all"
                            type="button"
                          >
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                          {openDropdown === t.id && (
                            <div className="absolute right-6 mt-2 z-20 w-40 bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden" style={{ top: "100%" }}>
                              <div className="py-2">
                                <button
                                  onClick={() => {
                                    setSelectedDetail(t);
                                    setOpenDropdown(null);
                                  }}
                                  className="block w-full text-left py-2 px-4 text-sm text-black hover:bg-[#A3D1E4]/20 font-light transition-colors"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(t.id);
                                    setOpenDropdown(null);
                                  }}
                                  className="block w-full text-left py-2 px-4 text-sm text-red-600 hover:bg-red-50 font-light transition-colors"
                                >
                                  Delete Order
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-black/40 font-light">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative shadow-2xl border border-black/5">
            <button 
              onClick={() => setSelectedDetail(null)} 
              className="absolute top-6 right-6 text-black/40 hover:text-black focus:outline-none transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black font-primary">Order Details</h3>
              <p className="text-black/50 text-sm font-light mt-1">{selectedDetail.order_number}</p>
            </div>
            
            {/* Book Info */}
            {(() => {
              const book = getBookInfo(selectedDetail.book_id);
              const user = getUserInfo(selectedDetail.customer_id);
              return (
                <div className="space-y-6">
                  <div className="flex gap-4 items-center p-4 bg-[#A3D1E4]/10 rounded-2xl">
                    <div className="w-16 h-20 rounded-lg bg-white overflow-hidden shadow-sm shrink-0">
                      {book.cover_photo && (
                        <img src={`${bookImageStorage}/${book.cover_photo}`} alt={book.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm md:text-base text-black font-primary line-clamp-2 leading-tight">{book.title}</p>
                      <p className="text-xs text-black/60 mt-1 font-light">Qty: {selectedDetail.quantity} items</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-sm font-light text-black/50">Customer</span>
                      <span className="text-sm font-semibold text-black">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-sm font-light text-black/50">Order Date</span>
                      <span className="text-sm font-semibold text-black">{new Date(selectedDetail.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-sm font-light text-black/50">Status</span>
                      {renderStatusBadge(selectedDetail.status)}
                    </div>
                    <div className="flex justify-between items-center py-2 pt-4">
                      <span className="text-sm font-light text-black/50">Total Payment</span>
                      <span className="text-sm md:text-lg font-bold text-[#FB8B4B]">Rp. {Number(selectedDetail.amount).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <button onClick={() => setSelectedDetail(null)} className="w-full mt-8 bg-black text-white font-bold py-3 rounded-full hover:bg-black/80 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
