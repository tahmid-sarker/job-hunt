import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import ApplicationDetails from "./ApplicationDetails";
import Swal from "sweetalert2";
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
  },
});

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    // Fetch user's applications
    axios.get(`${import.meta.env.VITE_API_URL}/my-applications?email=${user.email}`, {
      withCredentials: true
    })
      .then(response => {
        setApplications(response.data);
      })
      .catch(error => {
        console.error("Error fetching applications:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch applications" });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = (id) => {
    if (!id) return;
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete your application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${import.meta.env.VITE_API_URL}/my-applications/${id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        })
          .then(response => {
            if (response.data.deletedCount) {
              Toast.fire({ icon: "success", title: "Application deleted!" });
              setApplications((prev) => prev.filter((app) => app._id !== id));
              setSelectedApp(null); // Close modal if deleted
            }
          })
          .catch(error => {
            console.error("Error deleting application:", error);
            Toast.fire({ icon: "error", title: "Failed to delete application" });
          });
      }
    });
  };

  if (!loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center text-neutral">My Applications</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-2xl transition duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <img src={app.company_logo} alt={app.company} className="w-16 h-16 object-contain" />
                <p className="text-gray-600 font-semibold text-sm">{app.company}</p>
                <p className="text-gray-500 text-sm">Applied At: {new Date(app.appliedAt).toLocaleDateString()}</p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => setSelectedApp(app)}
                  className="w-full text-center inline-block px-4 py-2 bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded-lg cursor-pointer transition">
                  View Details
                </button>
                <button onClick={() => handleDelete(app._id)}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedApp && (
          <ApplicationDetails application={selectedApp} onClose={() => setSelectedApp(null)} />
        )}
      </section>
    );
  }
};

export default MyApplications;