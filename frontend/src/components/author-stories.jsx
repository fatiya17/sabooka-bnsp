import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAuthors } from "../_services/authors";
import { authorImageStorage } from "../_api";

export default function AuthorStories() {
  const [authors, setAuthors] = useState([]);
  const colors = ['bg-[#fb8b4b]', 'bg-[#A3D1E4]', 'bg-[#D1B3FF]', 'bg-[#fb8b4b]'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAuthors();
        setAuthors(response.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="container-podia">
        <div className="text-center mb-20 relative px-4">
           {/* Decorative Elements */}
           <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D1B3FF] opacity-10 blur-3xl rounded-full"></div>
           
          <h2 className="md:text-[40px] text-[1.625rem] font-black mb-6 max-w-3xl mx-auto leading-tight" style={{ fontFamily: 'Aeonik, sans-serif' }}>
            Meet the Minds Behind Your Favorite Tales.
          </h2>
          <p className="text-[#535862] text-lg max-w-2xl mx-auto">
            Discover the brilliant authors who are shaping modern literature and weaving the narratives you love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-4 md:px-0">
          {authors.length > 0 ? (
            authors.map((author, index) => (
              <div 
                key={author.id} 
                className="flex flex-col group cursor-pointer bg-[#F5F5F5] rounded-[40px] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 h-full"
              >
                <div className={`aspect-square w-full ${colors[index % colors.length]} flex items-end justify-center overflow-hidden`}>
                  <img
                    className="h-full w-full object-cover transition-all duration-700 scale-100 group-hover:scale-110"
                    src={`${authorImageStorage}/${author.photo}`}
                    alt={author.name}
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#535862]">
                      Literary Voices
                    </span>
                  </div>
                  
                  <Link
                    to={`/authors/${author.id}`}
                    className="text-[24px] font-bold text-black hover:underline transition-all mb-4 flex items-center gap-2 group/link"
                    style={{ fontFamily: 'Aeonik, sans-serif' }}
                  >
                    {author.name} <span className="text-xl transform group-hover/link:translate-x-1 transition-transform">▶</span>
                  </Link>
                  
                  <p className="text-[15px] text-[#535862] leading-relaxed line-clamp-4">
                    {author.bio}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
               <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-black/50">Loading authors...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
