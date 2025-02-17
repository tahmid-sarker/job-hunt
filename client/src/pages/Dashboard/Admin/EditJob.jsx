import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
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

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!job) return;
    const form = e.target;
    const formData = new FormData(form);
    const { title, company, location, jobType, category, applicationDeadline, salaryMin, salaryMax, description } = Object.fromEntries(formData.entries());
    const updatedJob = {
      title,
      company,
      location,
      jobType,
      category,
      applicationDeadline,
      salaryRange: {
        min: Number(salaryMin),
        max: Number(salaryMax),
      },
      description,
    };

    // Update job in the database
    axios.patch(`${import.meta.env.VITE_API_URL}/jobs/${id}`, updatedJob, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    })
      .then(() => {
        Toast.fire({ icon: "success", title: "Job updated successfully!" });
        navigate("/dashboard/manage-jobs");
      })
      .catch((error) => {
        console.error(error);
        Toast.fire({ icon: "error", title: "Failed to update job" });
      });
  };

  if (!loading) {
    return (
      <section className="container mx-auto px-4 py-10 max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Job</h2>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-lg rounded-2xl p-8">
          {/* Job Title */}
          <div>
            <label className="label text-lg text-gray-800">Job Title</label>
            <input type="text" name="title" defaultValue={job.title} required
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>

          {/* Company */}
          <div>
            <label className="label text-lg text-gray-800">Company</label>
            <input type="text" name="company" defaultValue={job.company} required
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>

          {/* Location */}
          <div>
            <label className="label text-lg text-gray-800">Location</label>
            <input type="text" name="location" defaultValue={job.location} required
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>

          {/* Job Type */}
          <div>
            <label className="label text-lg text-gray-800">Job Type</label>
            <input type="text" name="jobType" defaultValue={job.jobType} required
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>

          {/* Category */}
          <div>
            <label className="label text-lg text-gray-800">Category</label>
            <input type="text" name="category" defaultValue={job.category} required
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>

          {/* Application Deadline */}
          <div>
            <label className="label text-lg text-gray-800">Application Deadline</label>
            <input type="date" name="applicationDeadline" defaultValue={job.applicationDeadline} required
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>

          {/* Salary Range */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="label text-lg text-gray-800">Salary Min</label>
              <input type="number" name="salaryMin" defaultValue={job.salaryRange?.min}
                className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
            </div>
            <div className="flex-1">
              <label className="label text-lg text-gray-800">Salary Max</label>
              <input type="number" name="salaryMax" defaultValue={job.salaryRange?.max}
                className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label text-lg text-gray-800">Description</label>
            <textarea defaultValue={job.description} name="description" rows="3"
              className="whitespace-pre-line w-full p-2 border border-gray-300 focus:border-none focus:outline-hidden text-base focus:ring-1 focus:ring-secondary rounded" />
          </div>

          <button type="submit" className="w-full py-3 bg-primary cursor-pointer text-white rounded-lg hover:bg-secondary transition" >
            Update Job
          </button>
        </form>
      </section>
    );
  }
};

export default EditJob;