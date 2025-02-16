import { useState } from "react";
import { useNavigate } from "react-router";
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

const AddJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const { title, company, location, jobType, category, applicationDeadline, salaryMin, salaryMax, description, company_logo, hrName, hrEmail } = Object.fromEntries(formData.entries());

    const newJob = {
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
      company_logo,
      hr_name: hrName,
      hr_email: hrEmail,
    };

    axios.post(`${import.meta.env.VITE_API_URL}/jobs`, newJob, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then(() => {
        Toast.fire({ icon: "success", title: "Job added successfully!" });
        navigate("/dashboard/manage-jobs");
      })
      .catch((err) => {
        console.error(err);
        Toast.fire({ icon: "error", title: "Failed to add job" });
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="container mx-auto px-4 py-10 max-w-3xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Job</h2>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-lg rounded-2xl p-8">
        {/* Job Title */}
        <div>
          <label className="label text-lg text-gray-800">Job Title</label>
          <input type="text" name="title" placeholder="Enter job title" required
            className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
        </div>

        {/* Company */}
        <div>
          <label className="label text-lg text-gray-800">Company</label>
          <input type="text" name="company" placeholder="Enter company name" required
            className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
        </div>

        {/* Location */}
        <div>
          <label className="label text-lg text-gray-800">Location</label>
          <input type="text" name="location" placeholder="Enter job location" required
            className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
        </div>

        {/* Job Type */}
        <div>
          <label className="label text-lg text-gray-800">Job Type</label>
          <input type="text" name="jobType" placeholder="Full-Time / Part-Time / Contract" required
            className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
        </div>

        {/* Category */}
        <div>
          <label className="label text-lg text-gray-800">Category</label>
          <input type="text" name="category" placeholder="Finance, IT, Marketing, etc." required
            className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary"/>
        </div>

        {/* Application Deadline */}
        <div>
          <label className="label text-lg text-gray-800">Application Deadline</label>
          <input type="date" name="applicationDeadline" placeholder="Select deadline" required
            className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
        </div>

        {/* Salary Range */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="label text-lg text-gray-800">Salary Min</label>
            <input type="number" name="salaryMin" placeholder="Minimum salary"
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>
          <div className="flex-1">
            <label className="label text-lg text-gray-800">Salary Max</label>
            <input type="number" name="salaryMax" placeholder="Maximum salary"
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label text-lg text-gray-800">Description</label>
          <textarea name="description" rows="3" placeholder="Enter full job description"
            className="w-full text-base md:text-lg p-3 border border-gray-300 focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary rounded resize-y" />
        </div>

        {/* Company Logo */}
        <div>
          <label className="label text-lg text-gray-800">Company Logo URL</label>
          <input type="url" name="company_logo" placeholder="Enter logo URL"
            className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
        </div>

        {/* HR Info */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="label text-lg text-gray-800">HR Name</label>
            <input type="text" name="hrName" placeholder="Enter HR name"
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>
          <div className="flex-1">
            <label className="label text-lg text-gray-800">HR Email</label>
            <input type="email" name="hrEmail" placeholder="Enter HR email"
              className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 cursor-pointer bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded-lg transition">
          {loading ? "Adding Job..." : "Add Job"}
        </button>
      </form>
    </section>
  );
};

export default AddJob;