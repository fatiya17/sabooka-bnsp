import { useEffect, useState } from "react";
import { showAuthor, updateAuthor } from "../../../_services/authors";
import { useNavigate, useParams } from "react-router";

export default function AuthorEdit() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    photo: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorData = await showAuthor(id);
        setFormData({
          name: authorData.name,
          bio: authorData.bio || "",
          photo: authorData.photo || null,
        });
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData({
        ...formData,
        photo: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === 'photo' && typeof formData[key] === 'string') {
          continue; // Lewati foto lama (string URL) agar tidak ditolak validasi Laravel
        }
        if (formData[key] !== null && formData[key] !== "") {
          payload.append(key, formData[key]);
        }
      }
      payload.append('_method', 'PUT');

      await updateAuthor(id, payload);
      navigate("/admin/authors");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error updating author";
      console.log("Validation Errors:", error.response?.data);
      alert(errorMsg + ". Please check the console for details.");
    }
  };

  return (
    <>
      <section className="">
        <div className="apple-card w-full sm:max-w-md mx-auto p-6 sm:p-8 space-y-4 md:space-y-6 mt-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Update Author
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Author Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Author Name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="photo" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  onChange={handleChange}
                  accept="image/*"
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bio" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="6"
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write a short bio here..."
                ></textarea>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button type="submit" className="podia-btn podia-btn-black w-full py-4 text-base font-bold shadow-lg">
                Update Author
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
