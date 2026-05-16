import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getBooks } from "../_services/books";
import { bookImageStorage } from "../_api";
import { addToCart } from "../_services/cart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const colors = ['bg-[#A3D1E4]', 'bg-[#fb8b4b]', 'bg-[#D1B3FF]', 'bg-[#eef9f5]'];
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const handleAddToCart = async (book) => {
    if (!accessToken) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      await addToCart({
        book_id: book.id,
        quantity: 1
      });
      
      window.dispatchEvent(new Event("cartUpdated"));
      alert(`${book.title} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const booksData = await getBooks();
      setBooks(booksData.data.slice(0, 4));
    };

    fetchData();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container-podia">
        <div className="text-center mb-12 md:mb-20 relative px-4">
           {/* Small Decorative Blob */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#A3D1E4] opacity-20 blur-2xl rounded-full"></div>
           
          <h2 className="md:text-[40px] text-[1.625rem] font-extrabold mb-4 md:mb-6 max-w-2xl mx-auto leading-tight" style={{ fontFamily: 'Aeonik, sans-serif' }}>
            This Week's Most Captivating Reads
          </h2>
          <p className="text-[#535862] text-base md:text-lg max-w-3xl mx-auto">
            Unearth the most popular masterpieces that have left thousands of our readers utterly spellbound.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
          {books.length > 0 ? (
            books.map((book, index) => (
              <div 
                key={book.id} 
                className={`flex flex-col group cursor-pointer ${colors[index % colors.length]} rounded-[32px] md:rounded-[40px] px-4 py-4 md:px-5 md:py-5 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 h-full`}
              >
                <div className="mb-6 overflow-hidden rounded-[20px] md:rounded-[24px] flex items-center justify-center bg-white/20">
                  <img
                    className="w-full h-auto object-contain transition-all duration-700 scale-100 group-hover:scale-105"
                    src={`${bookImageStorage}/${book.cover_photo}`}
                    alt={book.title}
                  />
                </div>
                
                <div className="flex flex-col flex-grow">
                  <div className="mb-4">
                    <span className="text-[11px] md:text-[12px] font-bold bg-white/40 px-2 md:px-3 py-1 rounded-full whitespace-nowrap">
                      Stock: {book.stock}
                    </span>
                  </div>
                  
                  <Link
                    to={`/books/show/${book.id}`}
                    className="text-[18px] md:text-[20px] font-bold text-black hover:underline transition-all mb-5 leading-tight"
                    style={{ fontFamily: 'Aeonik, sans-serif' }}
                  >
                    {book.title}
                  </Link>
                  
                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="text-[18px] md:text-[20px] font-black text-black">
                      Rp. {Number(book.price).toLocaleString('id-ID')}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(book)}
                      disabled={book.stock <= 0}
                      className="w-12 h-12 p-0 flex items-center justify-center rounded-xl shadow-lg flex-shrink-0 bg-black text-white border-2 border-black hover:bg-transparent hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon={faCartPlus} className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
               <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-black/50">Curating the library...</p>
            </div>
          )}
        </div>
      </div>
      
        <div className="w-full text-end mt-12 px-10">
              <Link
                to="/books"
                className="apple-btn apple-btn-outline font-bold text-black/40 text-md hover:bg-transparent hover:text-black underline transition-all w-fit mr-10"
              >
                Show more
              </Link>
            </div>
    </section>
  );
}
