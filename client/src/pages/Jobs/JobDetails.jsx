import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "motion/react";

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

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [otherJobs, setOtherJobs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setIsSaved(false);
    setIsApplied(false);

    // Fetch current job
    axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}`, { withCredentials: true })
      .then(response => setJob(response.data))
      .catch(() => Toast.fire({ icon: "error", title: "Failed to fetch job" }))
      .finally(() => setLoading(false));

    // Fetch 3 other jobs
    axios.get(`${import.meta.env.VITE_API_URL}/jobs/other/${id}`, { withCredentials: true })
      .then(response => setOtherJobs(response.data))
      .catch(() => Toast.fire({ icon: "error", title: "Failed to fetch other jobs" }))
      .finally(() => setLoading(false));

    // Check if job is already saved
    axios.get(`${import.meta.env.VITE_API_URL}/saved-jobs/${id}/exists`, { withCredentials: true })
      .then(response => {
        if (response.data.exists) {
          setIsSaved(true);
        };
      })
      .catch(() => Toast.fire({ icon: "error", title: "Failed to check saved job" }));

    // Check if job is already applied
    if (user?.email) {
      axios.get(`${import.meta.env.VITE_API_URL}/applications/${id}/exists?email=${user.email}`, { withCredentials: true })
        .then(response => {
          if (response.data.exists) {
            setIsApplied(true);
          }
        })
        .catch(() => Toast.fire({ icon: "error", title: "Failed to check applied job" }));
    }
  }, [id, user]);

  const handleSaveJob = () => {
    const savedJob = { ...job, jobId: job._id, savedAt: new Date() };

    axios.post(`${import.meta.env.VITE_API_URL}/jobs/${job._id}/save`, savedJob, {
      headers: { "Content-Type": "application/json" }, withCredentials: true
    })
      .then(response => {
        if (response.data.exists) {
          Toast.fire({ icon: "info", title: "This job is already saved!" });
          setIsSaved(true);
        } else if (response.data.insertedId) {
          Toast.fire({ icon: "success", title: "Job Saved Successfully!" });
          setIsSaved(true);
        }
      })
      .catch(() => Toast.fire({ icon: "error", title: "Failed to save job" }));
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6 }
    })
  };
  
  if (!loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        {/* Job Main Card */}
        <motion.div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
          initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={cardVariant} custom={0}>
          {/* Company Info */}
          <div className="flex items-center gap-5 mb-8">
            <img src={job.company_logo} alt={job.company} className="w-24 h-24 object-contain rounded-full border border-primary p-2 bg-gray-50" />
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{job.title}</h2>
              <p className="text-gray-600 text-lg mt-1">{job.company}</p>
              <p className="text-gray-500 text-sm mt-0.5">{job.location}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => navigate(`/jobs/${job._id}/apply`)} disabled={isApplied}
              className={`px-8 py-3 text-lg rounded-full shadow-lg transition duration-300 text-white ${isApplied ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : "cursor-pointer bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary"}`}>
              {isApplied ? "Already Applied" : "Apply Now"}
            </button>

            <button onClick={handleSaveJob} disabled={isSaved}
              className={`px-8 py-3 text-lg rounded-full shadow-lg transition duration-300 text-white ${isSaved ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : "cursor-pointer bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary"}`}>
              {isSaved ? "Saved" : "Save Job"}
            </button>
          </div>

          {/* Job Details */}
          <div className="space-y-3 mb-6 text-gray-700">
            <p><span className="font-semibold text-gray-800">Category:</span>{job.category}</p>
            <p><span className="font-semibold text-gray-800">Type:</span>{job.jobType}</p>
            <p><span className="font-semibold text-gray-800">Salary:</span>{job.salaryRange?.min} - {job.salaryRange?.max} {job.salaryRange?.currency}</p>
            <p><span className="font-semibold text-gray-800">Deadline:</span>{job.applicationDeadline}</p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Job Description</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {job.requirements?.map((req, idx) => (<li key={idx}>{req}</li>))}
            </ul>
          </div>

          {/* Responsibilities */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Responsibilities</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {job.responsibilities?.map((res, idx) => (<li key={idx}>{res}</li>))}
            </ul>
          </div>

          {/* HR Contact */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">HR Contact</h3>
            <p className="text-gray-700">{job.hr_name}</p>
            <p className="text-secondary underline">{job.hr_email}</p>
          </div>
        </motion.div>

        {/* Other Jobs */}
        <div className="max-w-5xl mx-auto mt-16">
          <h3 className="text-3xl font-bold mb-8 text-neutral text-center">You Might Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherJobs.map((job, index) => (
              <motion.div key={job._id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
                initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={cardVariant} custom={index + 1}>
                <div>
                  <img src={job.company_logo} alt={job.company} className="w-20 h-20 object-contain rounded-full border border-primary p-2 mb-4 bg-gray-50" />
                  <h4 className="text-xl font-semibold text-gray-800">{job.title}</h4>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                </div>
                <Link to={`/jobs/${job._id}`} className="btn border-none bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary mt-4 text-white w-full rounded-full shadow-md transition duration-300">
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
};

export default JobDetails;