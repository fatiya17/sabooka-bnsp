import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../../../_services/users";
import { Link } from "react-router";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await getUsers();
      setUsers(usersData.data);
    };

    fetchData();
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (confirmDelete) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <>
      <section className="p-0 sm:p-0">
        <div className="bg-white rounded-[24px] border border-[#A3D1E4]/20 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-6 border-b border-[#A3D1E4]/20">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-[#A3D1E4]/10 border-none text-black text-sm font-light rounded-full focus:ring-2 focus:ring-[#A3D1E4] block w-full pl-10 px-4 py-2 transition-all outline-none"
                    placeholder="Search"
                    required=""
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
               {/* No add user for now if not requested */}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-black font-light uppercase bg-[#A3D1E4]/10 border-b border-[#A3D1E4]/20 tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Username
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-black/5 hover:bg-[#A3D1E4]/5 transition-colors">
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-black whitespace-nowrap flex items-center gap-3"
                      >
                        <img 
                          src={`https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=transparent`}
                          alt={user.name}
                          className="w-8 h-8 rounded-full bg-[#D1B3FF]/20 object-cover shrink-0"
                        />
                        {user.name}
                      </th>
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-light font-primary border border-black/5 ${user.role === 'admin' ? 'bg-[#D1B3FF] text-black' : 'bg-[#A3D1E4]/20 text-black'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex items-center justify-end relative">
                        <button
                          onClick={() => toggleDropdown(user.id)}
                          className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                          type="button"
                        >
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                        {openDropdown === user.id && (
                          <div
                            className="absolute right-0 mt-2 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                            style={{ top: "100%", right: "0" }}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-3 text-center text-gray-500"
                    >
                      No users found.
                    </td>
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
