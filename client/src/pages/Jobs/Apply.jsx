import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";

const Apply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toast config
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  // Fetch job details
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
      withCredentials: true
    })
      .then(response => {
        setJob(response.data);
      })
      .catch(error => {
        console.error("Error fetching job:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch job" });
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    // Application data
    const applicationData = {
      ...userData,
      jobId: job._id,
      jobTitle: job.title,
      company: job.company,
      hr_name: job.hr_name,
      hr_email: job.hr_email,
      company_logo: job.company_logo,
      location: job.location,
      salaryRange: job.salaryRange,
      applicationDeadline: job.applicationDeadline,
      appliedAt: new Date(),
    };

    axios.post(`${import.meta.env.VITE_API_URL}/jobs/${id}/apply`, applicationData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    })
      .then(response => {
        if (response.data.insertedId) {
          Toast.fire({
            icon: "success",
            title: "Applied Successfully!",
          });
          form.reset();
          navigate("/jobs");
        }
      })
      .catch(error => {
        console.error("Error applying for job:", error);
        Toast.fire({ icon: "error", title: "Failed to apply for job" });
      });
  };

  if (!loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Job Preview */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <img src={job.company_logo} alt={job.company} className="w-16 h-16 rounded-xl object-contain border border-primary" />
            <div>
              <h2 className="text-2xl text-gray-800 font-bold">{job.title}</h2>
              <p className="text-gray-600">{job.company} • {job.location}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{job.jobType}</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">{job.category}</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">Deadline: {job.applicationDeadline}</span>
          </div>
          <p className="mt-4 text-gray-700 line-clamp-3">{job.description}</p>
        </div>

        {/* Application Form */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Apply for this Job</h3>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Name */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium">Full Name</label>
              <input type="text" name="name" placeholder="Enter your full name" required
                className="w-full border border-none text-gray-800 rounded-lg p-2 ring-2 ring-primary focus:outline-hidden" />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium">Email Address</label>
              <input type="email" name="email" placeholder="Enter your email" required
                className="w-full border border-none text-gray-800 rounded-lg p-2 ring-2 ring-primary focus:outline-hidden" />
            </div>

            {/* Resume Link */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium">Resume Link</label>
              <input type="url" name="resumeLink" placeholder="https://drive.google.com/your-resume-link/view" required
                className="w-full border border-none text-gray-800 rounded-lg p-2 ring-2 ring-primary focus:outline-hidden" />
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block mb-1 text-gray-800 font-medium">Cover Letter</label>
              <textarea name="coverLetter" placeholder="Write your cover letter here..." rows="5" required
                className="w-full border border-none text-gray-800 rounded-lg p-2 ring-2 ring-primary focus:outline-hidden" />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button type="submit"
                className="px-6 py-2 bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold cursor-pointer rounded-lg shadow transition">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default Apply;