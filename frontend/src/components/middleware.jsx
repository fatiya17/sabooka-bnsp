import React from "react";
import { Navigate, Outlet } from "react-router";
import { useDecodeToken } from "../_services/auth";

/**
 * ProtectedRoute Component
 * Digunakan untuk membatasi akses rute berdasarkan status login dan role user.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const decodedToken = useDecodeToken(token);

  // 1. Cek apakah token ada dan masih valid
  if (!token || !decodedToken.success) {
    // Jika tidak ada token atau token expired, arahkan ke login
    return <Navigate to="/login" replace />;
  }

  // 2. Cek apakah role user diizinkan mengakses rute ini
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // Jika role tidak sesuai (misal user biasa coba akses admin), arahkan ke Home
    return <Navigate to="/" replace />;
  }

  // 3. Jika semua pengecekan lolos, tampilkan konten rute tersebut
  return <Outlet />;
};

export default ProtectedRoute;
