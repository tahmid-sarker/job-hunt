import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import Swal from "sweetalert2";

// Sweet Alert
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  draggable: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/jobs`)
      .then((response) => setJobs(response.data))
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch jobs" });
      })
      .finally(() => setLoading(false));
  }, []);

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  if (!loading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-neutral mb-5">
          Available <span className="text-primary">Jobs</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div key={job._id} className="card bg-white shadow-xl hover:shadow-2xl transition"
              custom={index} variants={cardVariant} initial="hidden" animate="visible">
              <div className="card-body">
                <img src={job.company_logo} alt={job.company} className="w-20 h-20 object-contain mb-4 rounded-full border border-secondary p-2" />
                <h3 className="card-title text-gray-800">{job.title}</h3>
                <p className="text-gray-800">{job.company}</p>
                <p className="text-sm text-gray-800">Location: {job.location}</p>
                <p className="text-sm text-gray-800">Salary: {job.salaryRange?.min} - {job.salaryRange?.max}{" "}{job.salaryRange?.currency}</p>
                <div className="card-actions justify-end mt-4">
                  <Link to={`/jobs/${job._id}`}
                    className="btn border-none bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }
};

export default Jobs;