import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { bookImageStorage, API } from "../../_api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faArrowLeft, faShoppingBag, faCreditCard, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { getCart, updateCartItem, removeCartItem } from "../../_services/cart";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = localStorage.getItem("accessToken");
  const paymentStatus = searchParams.get("status");

  const fetchCartData = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await getCart();
      setCartItems(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleUpdateQuantity = async (id, currentQty, delta) => {
    const newQty = Math.max(1, currentQty + delta);
    try {
      await updateCartItem(id, newQty);
      fetchCartData();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      alert("Gagal mengupdate kuantitas.");
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeCartItem(id);
      fetchCartData();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      alert("Gagal menghapus item.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    // user: melakukan pengecekan login user sebelum memulai transaksi pembayaran
    if (!accessToken) {
      alert("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. mengirim permintaan checkout pembayaran buku sebelum dikirim (via gateway xendit)
      const response = await API.post("/checkout", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      // 2. mengarahkan user ke halaman invoice xendit jika pembayaran berhasil dibuat
      if (response.data.invoice_url) {
        window.location.href = response.data.invoice_url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  return (
    <section className="bg-white min-h-screen pt-24 pb-16">
      <div className="container-podia px-4 md:px-0">
        
        {/* Payment Status Alerts */}
        {paymentStatus === "success" && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-3xl flex items-center gap-3 animate-bounce-in">
            <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
            <span className="font-bold text-sm">Payment Successful! Your order is being processed.</span>
          </div>
        )}
        {paymentStatus === "failure" && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-3xl flex items-center gap-3 animate-bounce-in">
            <FontAwesomeIcon icon={faTimesCircle} className="text-xl" />
            <span className="font-bold text-sm">Payment Failed. Please try again or contact support.</span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Link to="/books" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all text-xs md:text-sm">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h1 className="text-xl md:text-3xl font-black text-black" style={{ fontFamily: 'Aeonik, sans-serif' }}>Shopping Cart</h1>
        </div>

        {accessToken && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-[#F5F5F5] rounded-[24px] p-4 md:p-6 flex flex-row items-center gap-4 md:gap-6 border border-transparent hover:border-black/5 transition-all">
                  <div className="w-16 h-24 md:w-20 md:h-28 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <img 
                      src={`${bookImageStorage}/${item.book.cover_photo}`} 
                      alt={item.book.title} 
                      className="max-h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm md:text-lg font-bold text-black mb-0.5 line-clamp-1">{item.book.title}</h3>
                    <p className="text-black/40 text-[9px] md:text-[10px] font-bold mb-2 md:mb-3 uppercase tracking-widest">{item.book.author?.name || 'Author'}</p>
                    <p className="text-base md:text-xl font-black text-black">Rp. {Number(item.book.price).toLocaleString('id-ID')}</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                    <div className="flex items-center border border-black/10 rounded-lg md:rounded-xl overflow-hidden h-8 md:h-10 bg-white">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-black hover:text-white transition-all text-xs">-</button>
                      <div className="w-8 md:w-10 h-full flex items-center justify-center font-bold text-xs border-x border-black/10">{item.quantity}</div>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-black hover:text-white transition-all text-xs">+</button>
                    </div>

                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-xs"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-black text-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 sticky top-24 md:top-28 shadow-xl">
                <h2 className="text-lg md:text-xl font-black mb-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShoppingBag} className="text-white text-base" />
                  Ringkasan
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-white uppercase tracking-widest text-[9px] md:text-[10px]">
                    <span>Subtotal</span>
                    <span>Rp. {calculateTotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-white uppercase tracking-widest text-[9px] md:text-[10px]">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <hr className="border-white/5 my-4" />
                  <div className="flex justify-between text-lg md:text-xl font-black">
                    <span>Total</span>
                    <span>Rp. {calculateTotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-white text-black py-3.5 md:py-4 rounded-xl font-black text-sm md:text-base hover:bg-[#A3D1E4] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCreditCard} className="text-xs" />
                      Checkout
                    </>
                  )}
                </button>
                
                <p className="text-center text-white/60 text-[9px] mt-5 uppercase font-bold tracking-widest">
                  Secure Checkout via Xendit
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 md:py-16 text-center bg-[#F5F5F5] rounded-[24px] md:rounded-[32px]">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FontAwesomeIcon icon={faShoppingBag} className="text-xl md:text-2xl text-black/10" />
            </div>
            {!accessToken ? (
               <>
                 <h2 className="text-lg md:text-xl font-black text-black mb-2">Please log in</h2>
                 <p className="text-black/30 text-xs md:text-sm font-bold mb-6">Log in to view your shopping cart.</p>
                 <Link to="/login" className="podia-btn podia-btn-black px-8 py-3">Log In Now</Link>
               </>
            ) : (
              <>
                <h2 className="text-lg md:text-xl font-black text-black mb-2">Your cart is empty</h2>
                <p className="text-black/30 text-xs md:text-sm font-bold mb-6">Let's find your next favorite book!</p>
                <Link to="/books" className="podia-btn podia-btn-black px-6 py-3 text-xs md:text-sm">Start Shopping</Link>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
