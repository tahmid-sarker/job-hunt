import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

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

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/contact-messages`, {
        withCredentials: true,
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch messages" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This message will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_API_URL}/contact-messages/${id}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.deletedCount) {
              Toast.fire({
                icon: "success",
                title: "Message deleted successfully",
              });
              setMessages((prev) => prev.filter((msg) => msg._id !== id));
            }
          })
          .catch((error) => {
            console.error("Error deleting message:", error);
            Toast.fire({ icon: "error", title: "Failed to delete message" });
          });
      }
    });
  };

  if (!loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Messages</h2>

        {/* Table for larger screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table-auto w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Message</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {!messages ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">No messages found.</td>
                </tr>
              ) : (
                messages.map((msg, idx) => (
                  <tr key={msg._id} className="text-center">
                    <td className="px-4 py-2 border">{idx + 1}</td>
                    <td className="px-4 py-2 border">{msg.name}</td>
                    <td className="px-4 py-2 border">{msg.email}</td>
                    <td className="px-4 py-2 border text-left">
                      <textarea value={msg.message} rows={2} readOnly className="w-full border border-gray-300 rounded-md text-sm text-gray-700" />
                    </td>
                    <td className="px-4 py-2 border">
                      <button onClick={() => handleDelete(msg._id)} className="px-3 py-1 bg-red-500 text-white cursor-pointer rounded hover:bg-red-600 transition flex items-center gap-2 mx-auto">
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Card layout for small screens */}
        <div className="md:hidden space-y-4">
          {!messages ? (
            <p className="text-center text-gray-400">No messages found.</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg._id} className="bg-white shadow-lg rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
                <p className="font-semibold text-gray-800">{idx + 1}. {msg.name}</p>
                <p className="text-gray-600 text-sm">{msg.email}</p>
                <textarea value={msg.message} rows={2} readOnly className="w-full border border-gray-300 rounded-md text-sm text-gray-700" />
                <div className="flex mt-2">
                  <button onClick={() => handleDelete(msg._id)} className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2 justify-center">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    );
  }
};

export default ContactMessages;
