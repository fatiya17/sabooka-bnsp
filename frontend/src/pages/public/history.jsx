import { useState, useEffect } from "react";
import { Link } from "react-router";
import { API, bookImageStorage } from "../../_api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCheckCircle, faTimesCircle, faReceipt, faArrowLeft, faExternalLinkAlt, faBoxOpen, faSync } from "@fortawesome/free-solid-svg-icons";

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(null);
  const [isChecking, setIsChecking] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  const fetchHistory = async () => {
    try {
      const response = await API.get("/transactions/history", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const handleConfirmReceipt = async (id) => {
    setIsConfirming(id);
    try {
      await API.post(`/transactions/confirm-receipt/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      fetchHistory();
    } catch (error) {
      alert("Gagal mengonfirmasi pesanan.");
    } finally {
      setIsConfirming(null);
    }
  };

  const handleCheckStatus = async (orderNumber) => {
    setIsChecking(orderNumber);
    try {
      await API.get(`/payment/status/${orderNumber}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      fetchHistory();
    } catch (error) {
      console.error("Failed to check status:", error);
    } finally {
      setIsChecking(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: faBoxOpen, label: 'Completed' };
      case 'PAID':
        return { bg: 'bg-green-50', text: 'text-green-600', icon: faCheckCircle, label: 'Paid' };
      case 'PENDING':
        return { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: faClock, label: 'Pending' };
      case 'EXPIRED':
        return { bg: 'bg-red-50', text: 'text-red-600', icon: faTimesCircle, label: 'Expired' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600', icon: faClock, label: status };
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  return (
    <section className="bg-white min-h-screen pt-20 md:pt-24 pb-16">
      <div className="container-podia px-4 md:px-0">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs md:text-sm" />
          </Link>
          <h1 className="text-xl md:text-3xl font-black text-black" style={{ fontFamily: 'Aeonik, sans-serif' }}>Order History</h1>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {transactions.map((trx) => {
              const status = getStatusStyle(trx.status);
              return (
                <div key={trx.id} className="bg-[#F5F5F5] rounded-[24px] md:rounded-[32px] p-4 md:p-8 border border-transparent hover:border-black/5 transition-all group">
                  <div className="flex flex-row gap-4 md:gap-8">
                    {/* Book Cover */}
                    <div className="w-16 h-24 md:w-24 md:h-32 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                      <img 
                        src={`${bookImageStorage}/${trx.book?.cover_photo}`} 
                        alt={trx.book?.title} 
                        className="max-h-full object-contain"
                      />
                    </div>

                    {/* Order Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4 mb-3 md:mb-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                            <span className="text-[8px] md:text-[10px] font-bold text-black/40 uppercase tracking-widest">{trx.order_number}</span>
                            <div className={`${status.bg} ${status.text} px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1 md:gap-1.5 whitespace-nowrap`}>
                              <FontAwesomeIcon icon={status.icon} className="text-[10px]" />
                              {status.label}
                            </div>
                          </div>
                          <h3 className="text-sm md:text-xl font-black text-black group-hover:text-[#4b2aad] transition-colors truncate">{trx.book?.title}</h3>
                          <p className="text-black/40 text-[10px] md:text-sm font-bold truncate mb-1">{trx.book?.author?.name}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="flex items-baseline gap-1.5 md:gap-2 justify-start md:justify-end">
                            <span className="text-[10px] md:text-sm font-bold text-black/30">{trx.quantity}x</span>
                            <p className="text-base md:text-2xl font-black text-black whitespace-nowrap">Rp. {Number(trx.amount).toLocaleString('id-ID')}</p>
                          </div>
                          <p className="text-[8px] md:text-[10px] font-bold text-black/30 uppercase tracking-widest">
                            {new Date(trx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <hr className="border-black/5 mb-3 md:mb-4" />

                      <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
                        <div className="flex items-center gap-4 md:gap-6">
                           <div className="flex flex-col">
                             <span className="text-[8px] md:text-[9px] font-bold text-black/30 uppercase tracking-widest">Method</span>
                             <span className="text-[10px] md:text-sm font-bold text-black">Xendit Payment</span>
                           </div>
                        </div>

                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {trx.status === 'PAID' && (
                            <button 
                              onClick={() => handleConfirmReceipt(trx.id)}
                              disabled={isConfirming === trx.id}
                              className="podia-btn podia-btn-black py-2 md:py-2.5 px-4 md:px-6 text-[10px] md:text-xs flex items-center gap-2 disabled:opacity-50"
                            >
                              {isConfirming === trx.id ? (
                                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                  <FontAwesomeIcon icon={faCheckCircle} />
                              )}
                              Confirm
                            </button>
                          )}

                          {trx.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleCheckStatus(trx.order_number)}
                                disabled={isChecking === trx.order_number}
                                className="bg-[#A3D1E4] text-black py-2 md:py-2.5 px-4 md:px-6 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold flex items-center gap-2 hover:bg-[#8bbbd0] transition-all disabled:opacity-50"
                              >
                                <FontAwesomeIcon icon={faSync} className={isChecking === trx.order_number ? 'animate-spin' : ''} />
                                Check
                              </button>
                              
                              {trx.payment_link && (
                                <a 
                                  href={trx.payment_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-white border-2 border-black text-black py-2 md:py-2 px-4 md:px-6 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-all"
                                >
                                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                                  Pay
                                </a >
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 md:py-20 text-center bg-[#F5F5F5] rounded-[32px] md:rounded-[40px]">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FontAwesomeIcon icon={faReceipt} className="text-xl md:text-2xl text-black/10" />
            </div>
            <h2 className="text-lg md:text-xl font-black text-black mb-2">No orders yet</h2>
            <p className="text-black/30 text-xs md:text-sm font-bold mb-8">Your reading journey will appear here.</p>
            <Link to="/books" className="podia-btn podia-btn-black px-8 py-3 text-xs md:text-sm">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
