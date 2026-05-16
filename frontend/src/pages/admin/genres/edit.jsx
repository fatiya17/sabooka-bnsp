import { useEffect, useState } from "react";
import { showGenre, updateGenre } from "../../../_services/genres";
import { useNavigate, useParams } from "react-router";

export default function GenreEdit() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreData = await showGenre(id);
        setFormData({
          name: genreData.name,
          description: genreData.description || "",
        });
      } catch (error) {
        console.error("Error fetching genre:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGenre(id, formData);
      navigate("/admin/genres");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error updating genre";
      console.log("Validation Errors:", error.response?.data);
      alert(errorMsg + ". Please check the console for details.");
    }
  };

  return (
    <>
      <section className="">
        <div className="apple-card w-full sm:max-w-md mx-auto p-6 sm:p-8 space-y-4 md:space-y-6 mt-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Update Genre
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Genre Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Genre Name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write a genre description here..."
                ></textarea>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button type="submit" className="podia-btn podia-btn-black w-full py-4 text-base font-bold shadow-lg">
                Update Genre
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
