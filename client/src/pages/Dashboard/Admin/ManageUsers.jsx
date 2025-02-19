import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
  },
});

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users from the server
    axios.get(`${import.meta.env.VITE_API_URL}/users`, {
      withCredentials: true
    })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch users" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePromote = (id) => {
    axios.patch(`${import.meta.env.VITE_API_URL}/users/${id}/promote`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    })
      .then(response => {
        if (response.data.modifiedCount) {
          Toast.fire({ icon: "success", title: "User promoted to Admin!" });
          setUsers((prev) => prev.map(user => user._id === id ? { ...user, role: 'admin' } : user));
        }
      })
      .catch(error => {
        console.error("Error promoting user:", error);
        Toast.fire({ icon: "error", title: "Failed to promote user" });
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`)
          .then(response => {
            if (response.data.deletedCount) {
              Toast.fire({ icon: "success", title: "User deleted!" });
              setUsers((prev) => prev.filter((user) => user._id !== id));
            }
          })
          .catch(error => {
            console.error("Error deleting user:", error);
            Toast.fire({ icon: "error", title: "Failed to delete user" });
          });
      }
    });
  };

  if (!loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Users</h2>

        {/* Table for larger screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table-auto w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user._id} className="text-center">
                  <td className="px-4 py-2 border">{idx + 1}</td>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border capitalize">{user.role}</td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    {user.role !== "admin" && (
                      <button onClick={() => handlePromote(user._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
                        Promote
                      </button>
                    )}
                    <button onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card layout for small screens */}
        <div className="md:hidden space-y-4">
          {users.map((user, idx) => (
            <div key={user._id}
              className="bg-white shadow-lg rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
              <p className="font-semibold text-gray-800">{idx + 1}. {user.name}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="capitalize text-gray-500">{user.role}</p>
              <div className="flex gap-2 mt-2">
                {user.role !== "admin" && (
                  <button onClick={() => handlePromote(user._id)}
                    className="flex-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
                    Promote
                  </button>
                )}
                <button onClick={() => handleDelete(user._id)}
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
};

export default ManageUsers;