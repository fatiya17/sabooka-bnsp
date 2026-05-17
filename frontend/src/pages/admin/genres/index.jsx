import { useEffect, useState } from "react";
import { getGenres, deleteGenre } from "../../../_services/genres";
import { Link } from "react-router";

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // admin: seseorang yang mengelola genre
      // 1. mengambil data kategori buku dari api
      const genresData = await getGenres();
      // 2. menyimpan data kategori ke dalam state
      setGenres(genresData.data || []);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    // 3. meminta konfirmasi sebelum menghapus kategori buku
    const confirmDelete = window.confirm("Are you sure you want to delete this genre?");

    if (confirmDelete) {
      try {
        // 4. mengirim permintaan hapus kategori buku ke api
        await deleteGenre(id);
        // 5. memperbarui state untuk menghapus kategori dari tampilan
        setGenres(genres.filter(genre => genre.id !== id));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  }

  return (
    <>
      <section className="p-0 sm:p-0">
        <div className="bg-white rounded-[24px] border border-[#A3D1E4]/20 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-6 border-b border-[#A3D1E4]/20">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input type="text" id="simple-search" className="bg-[#A3D1E4]/10 border-none text-black text-sm font-light rounded-full focus:ring-2 focus:ring-[#A3D1E4] block w-full pl-10 px-4 py-2 transition-all outline-none" placeholder="Search" />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <Link to={"/admin/genres/create"} className="bg-[#A3D1E4] hover:bg-[#A3D1E4]/80 text-black px-6 py-2 rounded-full font-bold transition-all flex items-center justify-center text-sm">
                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add Genre
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-black font-light uppercase bg-[#A3D1E4]/10 border-b border-[#A3D1E4]/20 tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Description</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {genres.length > 0 ? (
                  genres.map((genre) => (
                    <tr key={genre.id} className="border-b border-black/5 hover:bg-[#A3D1E4]/5 transition-colors">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {genre.name}
                      </th>
                      <td className="px-4 py-3">{genre.description || "-"}</td>
                      <td className="px-4 py-3 flex items-center justify-end relative">
                        <button onClick={() => toggleDropdown(genre.id)} className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                        {openDropdown === genre.id && (
                        <div className="absolute right-0 mt-2 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" style={{top: "100%", right: "0"}}>
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                            <li>
                              <Link to={`/admin/genres/edit/${genre.id}`} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</Link>
                            </li>
                          </ul>
                          <div className="py-1">
                            <button onClick={() => handleDelete(genre.id)} className="w-full text-left block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</button>
                          </div>
                        </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-center text-gray-500">No genres found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
