import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getGenres } from "../../../_services/genres";
import { getAuthors } from "../../../_services/authors";
import { showBook, updateBook } from "../../../_services/books";

export default function BookEdit() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    genre_id: "",
    author_id: "",
    cover_photo: null,
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
        const [genresData, authorsData, bookData] = await Promise.all([
          getGenres(),
          getAuthors(),
          showBook(id)
        ]);
        setGenres(genresData.data);
        setAuthors(authorsData.data);
        setFormData({
          title: bookData.title,
          price: bookData.price,
          stock: bookData.stock,
          genre_id: bookData.genre_id,
          author_id: bookData.author_id,
          cover_photo: bookData.cover_photo,
          description: bookData.description,
          _method: 'PUT',
        })
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const {name, value, files} = e.target;
    
    if (name === 'cover_photo') {
      setFormData({
        ...formData,
        cover_photo: files[0] 
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      
      for (const key in formData) {
        if (key === 'cover_photo' && typeof formData[key] === 'string') {
          continue; // Lewati cover_photo lama (string) agar tidak ditolak validasi Laravel (422)
        }
        payload.append(key, formData[key]);
      }

      await updateBook(id, payload);
      navigate('/admin/books');
    } catch (error) {
      let errorMsg = "Error updating book";
      if (error.response?.data?.message) {
        if (typeof error.response.data.message === "object") {
          errorMsg = Object.values(error.response.data.message).flat().join("\n");
        } else {
          errorMsg = error.response.data.message;
        }
      }
      console.log("Validation Errors:", error.response?.data);
      alert(errorMsg);
    }
  }

  return (
    <>
      <section className="">
        <div className="apple-card w-full sm:max-w-md mx-auto p-6 sm:p-8 space-y-4 md:space-y-6 mt-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Edit Book
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Book Title"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="e.g 1500000"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="stock"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="e.g 20"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="genre_id"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Genre
                </label>
                <select
                  id="genre_id"
                  value={formData.genre_id}
                  onChange={handleChange}
                  name="genre_id"
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                >
                  <option value="" disabled>--- Select Genre ---</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="author_id"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Author
                </label>
                <select
                  id="author_id"
                  value={formData.author_id}
                  onChange={handleChange}
                  name="author_id"
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                >
                  <option value="" disabled>--- Select Author ---</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="cover_photo"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cover Photo
                </label>
                <input
                  type="file"
                  name="cover_photo"
                  id="cover_photo"
                  onChange={handleChange}
                  accept="image/*"
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write a product description here..."
                  required
                ></textarea>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="podia-btn podia-btn-black w-full py-4 text-base font-bold shadow-lg"
              >
                Save Data
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}