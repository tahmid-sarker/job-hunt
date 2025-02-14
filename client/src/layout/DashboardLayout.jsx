import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { FaTachometerAlt, FaClipboardList, FaHome, FaUserEdit, FaSignOutAlt, FaUsers, FaBriefcase, FaRegBookmark } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Swal from 'sweetalert2';
import DynamicTitle from "../components/shared/DynamicTitle";
import axios from "axios";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    closeButtonAriaLabel: "Close",
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users`, {
      withCredentials: true
    })
      .then(response => setUsers(response.data))
  }, []);

  const roledUser = users.find((u) => u.email === user?.email);
  const isAdmin = roledUser?.role === "admin";

    // Handle user logout
    const handleLogOut = () => {
        logoutUser()
            .then(() => {
                navigate("/");
                Toast.fire({
                    icon: "success",
                    title: "Logged out successfully!",
                });
            })
            .catch((error) => {
                Toast.fire({
                    icon: "error",
                    title: error.message,
                });
            });
    };

  const navItems = isAdmin
    ? [
        { to: "/dashboard", icon: <FaTachometerAlt />, label: "Admin Dashboard" },
        { to: "/dashboard/manage-users", icon: <FaUsers />, label: "Manage Users" },
        { to: "/dashboard/manage-jobs", icon: <FaUserEdit />, label: "Manage Jobs" },
        { to: "/dashboard/add-job", icon: <FaBriefcase />, label: "Add Job" },
        { to: "/dashboard/manage-applications", icon: <MdOutlinePendingActions />, label: "Manage Applications" },
        { to: "/dashboard/contact-messages", icon: <FaClipboardList />, label: "Contact Messages" },
      ]
    : [
        { to: "/dashboard", icon: <FaTachometerAlt />, label: "User Dashboard" },
        { to: "/dashboard/update-profile", icon: <FaUserEdit />, label: "Update Profile" },
        { to: "/dashboard/my-applications", icon: <FaClipboardList />, label: "My Applications" },
        { to: "/dashboard/saved-jobs", icon: <FaRegBookmark />, label: "Saved Jobs" },
      ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <DynamicTitle />
      {/* Top Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{isAdmin ? "Admin Dashboard" : `${roledUser?.name}'s Dashboard`}</h1>
          <p className="text-gray-500 text-sm">Welcome, {roledUser?.name}</p>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map(({ to, icon, label }) => (
            <Link key={to} to={to} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition ${location.pathname === to ? "bg-gray-200 font-semibold" : ""}`}>
              {icon} <span>{label}</span>
            </Link>))}

          {/* Home Button */}
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition">
            <FaHome /> Home
          </Link>

          {/* Logout Button */}
          <button onClick={handleLogOut}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">
            <FaSignOutAlt /> Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl p-2 rounded hover:bg-gray-100">
            <FaBars />
          </button>

          {menuOpen && (
            <div className="md:hidden bg-white shadow border-b absolute right-0 mt-3 w-52">
              <nav className="flex flex-col px-4 py-2 gap-2">
                {navItems.map(({ to, icon, label }) => (
                  <Link key={to} to={to} onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 py-2 text-sm font-medium hover:bg-gray-100 rounded ${location.pathname === to ? "bg-gray-100 font-semibold" : ""}`}>
                    {icon} {label}
                  </Link>
                ))}

                <Link to="/" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded">
                  <FaHome /> Home
                </Link>

                <button onClick={() => {
                    setMenuOpen(false);
                    handleLogOut();
                  }} className="flex items-center gap-2 py-2 text-sm text-red-700 bg-red-50 hover:bg-red-100 rounded">
                  <FaSignOutAlt /> Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {/* Dashboard Cards only on /dashboard */}
        {location.pathname === "/dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {navItems.map(({ to, icon, label }) => (
              <Link key={to} to={to} className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-white hover:bg-gray-50 border transition">
                <div className="text-[var(--color-primary)] text-xl">{icon}</div>
                <div className="font-medium text-gray-800">{label}</div>
              </Link>
            ))}

            {/* Home Button Card */}
            <Link to="/" className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-green-100 hover:bg-green-200 border transition">
              <div className="text-green-600"><FaHome size={24} /></div>
              <div className="font-medium text-green-800">Home</div>
            </Link>

            {/* Logout Button Card */}
            <button onClick={handleLogOut} className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-red-100 hover:bg-red-200 border cursor-pointer transition">
              <div className="text-red-600"><FaSignOutAlt size={24} /></div>
              <div className="font-medium text-red-800">Logout</div>
            </button>
          </div>
        )}

        {/* Outlet only on nested routes */}
        {location.pathname !== "/dashboard" && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;