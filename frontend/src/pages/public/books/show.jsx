import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { showBook } from "../../../_services/books";
import { bookImageStorage, authorImageStorage } from "../../../_api";
import { addToCart } from "../../../_services/cart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronRight, faTruck, faRotateLeft, faHeart, faTag, faUserPen, faCartPlus, faBolt } from "@fortawesome/free-solid-svg-icons";

export default function ShowBook() {  
  const { id } = useParams();
  const [book, setBook] = useState({});
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await showBook(id);
        setBook(booksData);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCartAction = async (redirect = false) => {
    // user: memeriksa apakah user sudah login sebelum melakukan add to cart buku
    if (!accessToken) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      // 1. mengirim request add to cart buku ke api backend
      await addToCart({
        book_id: book.id,
        quantity: 1
      });
      
      // 2. memicu event global update cart agar navbar memperbarui jumlah item
      window.dispatchEvent(new Event("cartUpdated"));
      
      // 3. mengarahkan user ke halaman cart jika tombol checkout ditekan, atau tampilkan alert
      if (redirect) {
        navigate("/cart");
      } else {
        alert(`${book.title} added to cart!`);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart.");
    }
  };

  if (!book.title) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  return (
    <section className="bg-white min-h-screen pt-20 md:pt-28 pb-16">
      <div className="container-podia">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-black/50 mb-8 md:mb-12 px-4 md:px-0">
          <Link to="/" className="hover:text-black transition-colors whitespace-nowrap">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[8px] md:text-[10px]" />
          <Link to="/books" className="hover:text-black transition-colors whitespace-nowrap">Catalog</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[8px] md:text-[10px]" />
          <span className="text-black font-medium line-clamp-1">{book.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 xl:gap-16">
          {/* Left: Image Section */}
          <div className="lg:col-span-5 flex flex-col px-4 md:px-0">
            <div className="bg-[#F5F5F5] rounded-[32px] md:rounded-[40px] p-8 md:p-12 flex items-center justify-center overflow-hidden min-h-[350px] md:min-h-[450px] shadow-sm">
              <img
                className="w-3/4 md:w-full h-auto object-contain rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-700"
                src={`${bookImageStorage}/${book.cover_photo}`}
                alt={book.title}
              />
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="lg:col-span-7 flex flex-col px-4 md:px-0">
            <h1 className="text-[24px] md:text-[32px] font-black text-black mb-3 md:mb-4 leading-tight" style={{ fontFamily: 'Aeonik, sans-serif' }}>
              {book.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="flex items-center text-yellow-400 gap-1 text-xs md:text-sm">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} className="text-black/10" />
              </div>
              <span className="text-xs md:text-sm text-black/40">(150 Reviews)</span>
              <div className="w-px h-4 bg-black/10 mx-1"></div>
              <span className={`text-xs md:text-sm font-bold ${book.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Genre & Author Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-[#F5F5F5] px-4 py-2 rounded-full border border-black/5 transition-all hover:border-black/10">
                <FontAwesomeIcon icon={faTag} className="text-black/30 text-xs" />
                <span className="text-xs font-bold text-black/60 uppercase tracking-widest">{book.genre?.name || 'General'}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-[#F5F5F5] px-3 py-1.5 rounded-full border border-black/5 transition-all hover:border-black/10">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white/50 border border-black/10">
                   {book.author?.photo ? (
                     <img src={`${authorImageStorage}/${book.author.photo}`} alt={book.author.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-[10px] text-black/20">
                        <FontAwesomeIcon icon={faUserPen} />
                     </div>
                   )}
                </div>
                <span className="text-xs font-bold text-black/80">{book.author?.name || 'Unknown Author'}</span>
              </div>
            </div>

            <div className="text-[22px] md:text-[28px] font-black text-black mb-6 md:mb-8">
              Rp. {Number(book.price).toLocaleString('id-ID')}
            </div>

            <p className="text-[#535862] leading-relaxed mb-8 md:mb-10 text-[14px] md:text-[16px]">
              {book.description || "Dive into an extraordinary reading adventure with our finest book selections. Guaranteed quality and inspiring content on every page."}
            </p>

            <hr className="border-black/5 mb-8 md:mb-10" />

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button
                onClick={() => handleAddToCartAction(true)}
                disabled={book.stock <= 0}
                className="flex-grow md:flex-none md:min-w-[200px] podia-btn podia-btn-black h-12 md:h-14 text-sm md:text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faBolt} />
                Buy Now
              </button>

              <button
                onClick={() => handleAddToCartAction(false)}
                disabled={book.stock <= 0}
                className="flex-grow md:flex-none md:min-w-[200px] bg-white border-2 border-black text-black h-12 md:h-14 rounded-2xl font-bold hover:bg-[#F5F5F5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faCartPlus} />
                Add to Cart
              </button>

              <button type="button" className="w-12 h-12 md:w-14 md:h-14 border-2 border-black/10 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all text-lg md:text-xl text-black/20">
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>

            <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="border-2 border-black/5 rounded-2xl md:rounded-3xl p-4 md:p-5 flex items-start gap-3 hover:border-black/10 transition-all">
                <div className="text-xl md:text-2xl text-black"><FontAwesomeIcon icon={faTruck} /></div>
                <div>
                  <h4 className="font-bold text-black text-sm md:text-base mb-1">Free Delivery</h4>
                  <p className="text-[10px] md:text-xs text-black/50 underline cursor-pointer">Check availability</p>
                </div>
              </div>
              <div className="border-2 border-black/5 rounded-2xl md:rounded-3xl p-4 md:p-5 flex items-start gap-3 hover:border-black/10 transition-all">
                <div className="text-xl md:text-2xl text-black"><FontAwesomeIcon icon={faRotateLeft} /></div>
                <div>
                  <h4 className="font-bold text-black text-sm md:text-base mb-1">Return Policy</h4>
                  <p className="text-[10px] md:text-xs text-black/50">Free 30 Days Returns. <span className="underline cursor-pointer">Details</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}