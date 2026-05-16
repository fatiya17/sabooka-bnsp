import React from "react"; 
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/public";
import PublicLayout from "./layouts/public";
import Books from "./pages/public/books";
import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin";
import AdminBooks from "./pages/admin/books";
import AdminBooksCreate from "./pages/admin/books/create";
import AdminBooksEdit from "./pages/admin/books/edit";
import AdminGenres from "./pages/admin/genres";
import AdminGenresCreate from "./pages/admin/genres/create";
import AdminGenresEdit from "./pages/admin/genres/edit";
import AdminAuthors from "./pages/admin/authors";
import AdminAuthorsCreate from "./pages/admin/authors/create";
import AdminAuthorsEdit from "./pages/admin/authors/edit";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ShowBook from "./pages/public/books/show";
import Cart from "./pages/public/cart";
import History from "./pages/public/history";
import Contact from "./pages/public/contact";
import AdminUsers from "./pages/admin/users";
import AdminTransactions from "./pages/admin/transactions";
import ProtectedRoute from "./components/middleware";
import About from "./pages/public/about";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="books" element={<Books />} />
            <Route path="books/show/:id" element={<ShowBook />} />
            <Route path="cart" element={<Cart />} />
            <Route path="history" element={<History />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Auth Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />

              <Route path="books">
                <Route index element={<AdminBooks />} />
                <Route path="create" element={<AdminBooksCreate />} />
                <Route path="edit/:id" element={<AdminBooksEdit />} />
              </Route>
              <Route path="genres">
                <Route index element={<AdminGenres />} />
                <Route path="create" element={<AdminGenresCreate />} />
                <Route path="edit/:id" element={<AdminGenresEdit />} />
              </Route>
              <Route path="authors">
                <Route index element={<AdminAuthors />} />
                <Route path="create" element={<AdminAuthorsCreate />} />
                <Route path="edit/:id" element={<AdminAuthorsEdit />} />
              </Route>
              <Route path="users">
                <Route index element={<AdminUsers />} />
              </Route>
              <Route path="transactions">
                <Route index element={<AdminTransactions />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
