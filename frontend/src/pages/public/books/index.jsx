import { useEffect, useState } from "react";
import { getBooks } from "../../../_services/books";
import { getGenres } from "../../../_services/genres";
import { getAuthors } from "../../../_services/authors";
import { Link } from "react-router";
import { bookImageStorage } from "../../../_api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  const hoverColors = ['hover:bg-[#A3D1E4]', 'hover:bg-[#fb8b4b]', 'hover:bg-[#D1B3FF]', 'hover:bg-[#eef9f5]'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, genresData, authorsData] = await Promise.all([
          getBooks(),
          getGenres(),
          getAuthors()
        ]);
        setBooks(booksData.data);
        setGenres(genresData.data);
        setAuthors(authorsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === "" || book.genre_id?.toString() === selectedGenre;
    const matchesAuthor = selectedAuthor === "" || book.author_id?.toString() === selectedAuthor;
    return matchesSearch && matchesGenre && matchesAuthor;
  });

  return (
    <>
      <section className="bg-white pt-24 pb-12 antialiased md:pt-32 md:pb-20">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          
          {/* Search & Filter - Left & Right Alignment, No Background */}
          <div className="mb-10 flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search (Left) */}
            <div className="relative w-full md:max-w-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-black/30">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <input
                type="text"
                placeholder="Search for titles..."
                className="w-full bg-[#F5F5F5] border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-black/5 transition-all text-sm font-medium text-black px-4 py-3 rounded-2xl outline-black text-sm placeholder:text-black/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters (Right) */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <select 
                className="bg-[#F5F5F5] border-none rounded-2xl py-3 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 cursor-pointer flex-grow md:flex-grow-0"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Genre</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>

              <select 
                className="bg-[#F5F5F5] border-none rounded-2xl py-3 px-6 text-sm font-bold focus:ring-2 focus:ring-black/5 cursor-pointer flex-grow md:flex-grow-0"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
              >
                <option value="">Author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => (
                <div 
                  key={book.id} 
                  className={`bg-[#F5F5F5] rounded-[24px] md:rounded-[32px] p-4 md:p-6 transition-all duration-500 ${hoverColors[index % hoverColors.length]} hover:shadow-2xl hover:-translate-y-2 group cursor-pointer flex flex-col`}
                >
                  <div className="h-40 md:h-64 w-full mb-4 md:mb-6 overflow-hidden rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <img
                      className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-110"
                      src={`${bookImageStorage}/${book.cover_photo}`}
                      alt={book.title}
                    />
                  </div>
                  
                  <div className="pt-1 md:pt-2 flex flex-col flex-grow">
                    <Link
                      to={`/books/show/${book.id}`}
                      className="text-sm md:text-xl font-bold leading-snug text-black hover:underline line-clamp-2"
                      style={{ fontFamily: 'Aeonik, sans-serif' }}
                    >
                      {book.title}
                    </Link>

                    <ul className="mt-2 flex items-center gap-2 md:gap-4 flex-wrap hidden sm:flex">
                       <li className="flex items-center gap-1.5 md:gap-2">
                        <svg
                          className="h-3 w-3 md:h-4 md:w-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                          />
                        </svg>
                        <p className="text-[10px] md:text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          Fast Delivery
                        </p>
                       </li>

                       <li className="flex items-center gap-1.5 md:gap-2">
                        <svg
                          className="h-3 w-3 md:h-4 md:w-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                            d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                          />
                        </svg>
                        <p className="text-[10px] md:text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          Best Price
                        </p>
                       </li>
                    </ul>

                    <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-2 md:gap-4">
                      <p className="text-sm md:text-2xl font-black leading-tight text-black">
                        Rp. {Number(book.price).toLocaleString('id-ID')}
                      </p>

                      <Link
                        to={`/books/show/${book.id}`}
                        className="apple-btn apple-btn-primary px-3 py-1.5 text-xs"
                      >
                        View Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                 <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-black/50 font-small">Wait a minute...</p>
              </div>
            )}
          </div>

          {filteredBooks.length > 0 && (
            <div className="w-full text-center mt-8">
              <button
                type="button"
                className="apple-btn apple-btn-outline"
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
