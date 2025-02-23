import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/featured-jobs`, { withCredentials: true })
      .then(response => setJobs(response.data));
  }, []);

  const handleViewDetails = (job) => {
    if (!user) {
      navigate("/");
    } else {
      navigate(`/jobs/${job._id}`);
    }
  };

  return (
    <motion.section className="w-11/12 mx-auto mt-10" 
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-center text-neutral mb-5">
        Top <span className="text-primary">Jobs</span> Hiring Now
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {jobs.map((job, index) => (
          <motion.div key={index} className="bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden p-6 flex flex-col items-center transition-all duration-300 transform hover:scale-105"
            variants={cardVariant} transition={{ duration: 0.5, delay: index * 0.15 }}>
            
            <img src={job.company_logo} alt={job.company} className="w-20 h-20 object-contain mb-4 rounded-full border border-secondary p-2"/>
            <h3 className="text-xl font-semibold text-gray-700 mb-1 text-center">{job.title}</h3>
            <span className="text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2 border border-secondary">{job.category}</span>
            <p className="text-sm text-gray-500 mb-1 text-center">{job.location}</p>

            <button className="btn border-none bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white cursor-pointer rounded-full"
              onClick={() => handleViewDetails(job)}>
              {user ? "View Details" : "Login to View Details"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Toggle Button */}
      <div className="text-center mt-10">
        <button onClick={() => navigate("/jobs")} className="btn border-none bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">View All Jobs</button>
      </div>
    </motion.section>
  );
};

export default FeaturedJobs;