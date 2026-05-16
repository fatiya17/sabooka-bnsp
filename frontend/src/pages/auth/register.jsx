import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../../_services/auth";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const validate = ({ name, username, email, password }) => {
    if (!name || !username || !email || !password) return "All fields are required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Invalid email format";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate(formData);
    if (v) return setError(v);
    setLoading(true);
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-[calc(100vh-64px)] lg:py-0">
          <div className="apple-card w-full md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              {error && <div className="text-red-500">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="form-floating">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange}
                    className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Full name" required />
                </div>

                <div className="form-floating">
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                  <input type="text" name="username" id="username" value={formData.username} onChange={handleChange}
                    className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="username" required />
                </div>

                <div className="form-floating">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
                    className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com" required />
                </div>

                <div className="form-floating">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}
                    placeholder="••••••••"
                    className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the{" "}
                      <a className="font-medium text-indigo-600 hover:underline dark:text-indigo-500" href="#">Terms and Conditions</a>
                    </label>
                  </div>
                </div>

                <button type="submit" className="podia-btn podia-btn-black w-full py-4 text-base font-bold shadow-lg">{loading ? "Creating..." : "Create an account"}</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">Already have an account?{" "}
                  <Link to={"/login"} className="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Login here</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
