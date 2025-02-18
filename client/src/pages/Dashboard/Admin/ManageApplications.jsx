import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ApplicationDetails from "../User/ApplicationDetails";
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

const ManageJobsApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    // Get job data
    axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
      withCredentials: true
    })
      .then(response => setJobs(response.data))
      .catch(error => {
        console.error("Error fetching jobs:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch jobs" });
      })
      .finally(() => setLoadingJobs(false));
  }, []);

  const fetchApplications = (job) => {
    // Get applications for the selected job
    axios.get(`${import.meta.env.VITE_API_URL}/applications`, {
      withCredentials: true
    })
      .then(response => {
        const filtered = response.data.filter(
          (app) =>
            app.jobTitle === job.title &&
            app.company === job.company &&
            app.location === job.location
        );
        setApplications(filtered);
      })
      .catch(error => {
        console.error("Error fetching applications:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch applications" });
      })
      .finally(() => setLoadingApps(false));
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    fetchApplications(job);
  };

  const handleDeleteApplication = (id) => {
    if (!id) return;
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        })
          .then(() => {
            Toast.fire({ icon: "success", title: "Application deleted!" });
            setApplications((prev) => prev.filter((app) => app._id !== id));
          })
          .catch((err) => {
            console.error(err);
            Toast.fire({ icon: "error", title: "Failed to delete application" });
          });
      }
    });
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Jobs & Applications</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Jobs List */}
        <div className="lg:w-1/3 bg-white shadow-lg rounded-xl p-4 overflow-auto max-h-[70vh]">
          <h3 className="text-xl font-semibold mb-4">Jobs</h3>
          {loadingJobs ? (<p>Loading jobs...</p>
            ) : !jobs ? (<p>No jobs found.</p>
            ) : (
            <ul className="space-y-3">
              {jobs.map((job) => (
                <li key={job._id} onClick={() => handleJobClick(job)} className={`p-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white transition 
                  ${selectedJob?._id === job._id ? "bg-primary text-white" : "bg-gray-50"}`}>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm">{job.company}</p>
                  <p className="text-xs">{job.location}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Applications Table */}
        <div className="lg:w-2/3 bg-white shadow-lg rounded-xl p-4 overflow-auto max-h-[70vh]">
          <h3 className="text-xl font-semibold mb-4">Applications {selectedJob && `for "${selectedJob.title}"`}</h3>
          {loadingApps ? (
            <p>Loading applications...</p>
          ) : !applications ? (
            <p>No applications found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border border-gray-200 min-w-[500px]">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Applied At</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{app.name}</td>
                      <td className="px-4 py-2">{app.email}</td>
                      <td className="px-4 py-2">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 flex flex-wrap gap-2">
                        <button onClick={() => setSelectedApp(app)}
                          className="px-2 py-1 bg-primary text-white cursor-pointer rounded hover:bg-secondary transition">
                          View
                        </button>
                        <button onClick={() => handleDeleteApplication(app._id)}
                          className="px-2 py-1 bg-red-500 text-white cursor-pointer rounded hover:bg-red-600 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedApp && (
        <ApplicationDetails application={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </section>
  );
};

export default ManageJobsApplications;