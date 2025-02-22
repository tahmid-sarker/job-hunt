import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch saved jobs
    axios.get(`${import.meta.env.VITE_API_URL}/saved-jobs`, {
        withCredentials: true
    })
      .then(response => setSavedJobs(response.data))
      .catch(error => {
        console.error("Error fetching saved jobs:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch saved jobs" });
      });
  }, []);

  // Handle remove saved job
  const handleRemove = (id) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/saved-jobs/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
    })
      .then(response => {
        if (response.data.deletedCount) {
          setSavedJobs(savedJobs.filter((job) => job._id !== id));
          Toast.fire({
            icon: "success",
            title: "Job removed from saved list!",
          });
        }
      })
      .catch(error => {
        console.error("Error removing saved job:", error);
        Toast.fire({ icon: "error", title: "Failed to remove saved job" });
      });
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center text-neutral">Saved Jobs</h2>

      {!savedJobs ? (
        <p className="text-center text-gray-500 text-lg mt-10">You haven’t saved any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedJobs.map((job) => (
            <div key={job._id}
              className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 border border-gray-100 transition-all duration-300 flex flex-col justify-between">
              {/* Company Info */}
              <div className="text-center mb-4">
                <img src={job.company_logo} alt={job.company} className="w-24 h-24 object-contain rounded-full border border-primary p-2 mx-auto bg-gray-50 mb-4" />
                <h4 className="text-2xl font-semibold text-gray-800 mb-1">{job.title}</h4>
                <p className="text-gray-600 mb-1">{job.company}</p>
                <p className="text-gray-500 text-sm">{job.location}</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-3 mt-6">
                <button onClick={() => navigate(`/jobs/${job.jobId}`)}
                  className="flex-1 btn btn-primary hover:btn-secondary text-white rounded-full shadow-md py-2 text-center transition duration-300">
                  View Details
                </button>
                <button onClick={() => handleRemove(job._id)} className="flex-1 btn btn-error text-white rounded-full shadow-md py-2 transition duration-300">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SavedJobs;