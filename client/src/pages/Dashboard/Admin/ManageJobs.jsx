import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router";
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

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/jobs`)
      .then(response => setJobs(response.data))
      .catch(error => {
        console.error("Error fetching jobs:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch jobs" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the job.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        })
          .then(() => {
            Toast.fire({ icon: "success", title: "Job deleted!" });
            setJobs((prev) => prev.filter((job) => job._id !== id));
          })
          .catch((err) => {
            console.error(err);
            Toast.fire({ icon: "error", title: "Failed to delete job" });
          });
      }
    });
  };

  if (!loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Jobs</h2>

        {/* Table for larger screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table-auto w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, idx) => (
                <tr key={job._id} className="text-center">
                  <td className="px-4 py-2 border">{idx + 1}</td>
                  <td className="px-4 py-2 border">{job.title}</td>
                  <td className="px-4 py-2 border">{job.company}</td>
                  <td className="px-4 py-2 border">{job.location}</td>
                  <td className="px-4 py-2 border">{job.jobType}</td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link to={`/dashboard/manage-jobs/edit/${job._id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(job._id)}  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer transition">
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
          {jobs.map((job, idx) => (
            <div key={job._id} className="bg-white shadow-lg rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
              <p className="font-semibold text-gray-800">{idx + 1}. {job.title}</p>
              <p className="text-gray-600 text-sm">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.location}</p>
              <p className="text-gray-500 text-sm">{job.jobType}</p>
              <div className="flex gap-2 mt-2">
                <Link to={`/dashboard/manage-jobs/edit/${job._id}`} className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-center">
                  Edit
                </Link>
                <button onClick={() => handleDelete(job._id)} className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
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

export default ManageJobs;