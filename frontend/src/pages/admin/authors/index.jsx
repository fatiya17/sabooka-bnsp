import { useEffect, useState } from "react";
import { getAuthors, deleteAuthor } from "../../../_services/authors";
import { Link } from "react-router-dom";
import { authorImageStorage } from "../../../_api";

export default function AdminAuthors() {
  const colors = ['bg-[#A3D1E4]', 'bg-[#FB8B4B]', 'bg-[#D1B3FF]'];
  const [authors, setAuthors] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const authorsData = await getAuthors();
      setAuthors(authorsData.data || []);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this author?");

    if (confirmDelete) {
      try {
        await deleteAuthor(id);
        setAuthors(authors.filter(author => author.id !== id));
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
              <Link to={"/admin/authors/create"} className="bg-[#A3D1E4] hover:bg-[#A3D1E4]/80 text-black px-6 py-2 rounded-full font-bold transition-all flex items-center justify-center text-sm">
                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add Author
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-black font-light uppercase bg-[#A3D1E4]/10 border-b border-[#A3D1E4]/20 tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">Photo</th>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Bio</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {authors.length > 0 ? (
                  authors.map((author, index) => (
                    <tr key={author.id} className="border-b border-black/5 hover:bg-[#A3D1E4]/5 transition-colors">
                      <td className="px-6 py-4">
                        {author.photo ? (
                          <img src={`${authorImageStorage}/${author.photo}`} alt={author.name} className={`w-12 h-12 rounded-2xl object-cover ${colors[index % colors.length]} shadow-sm shrink-0`} />
                        ) : (
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl ${colors[index % colors.length]} shadow-sm shrink-0`}>
                            {author.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {author.name}
                      </th>
                      <td className="px-4 py-3">{author.bio || "-"}</td>
                      <td className="px-4 py-3 flex items-center justify-end relative">
                        <button onClick={() => toggleDropdown(author.id)} className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                        {openDropdown === author.id && (
                        <div className="absolute right-0 mt-2 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" style={{top: "100%", right: "0"}}>
                          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                            <li>
                              <Link to={`/admin/authors/edit/${author.id}`} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</Link>
                            </li>
                          </ul>
                          <div className="py-1">
                            <button onClick={() => handleDelete(author.id)} className="w-full text-left block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</button>
                          </div>
                        </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-center text-gray-500">No authors found.</td>
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
