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

const EditApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch application details
    axios.get(`${import.meta.env.VITE_API_URL}/my-applications-details/${id}`, {
      withCredentials: true
    })
      .then(response => {
        setApplication(response.data);
      })
      .catch(error => {
        console.error("Error fetching application:", error);
        Toast.fire({ icon: "error", title: "Failed to load application" });
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = Object.fromEntries(formData.entries());

    // Update application in the database
    axios.patch(`${import.meta.env.VITE_API_URL}/my-applications/${id}`, updates, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    })
      .then(response => {
        if (response.data.modifiedCount) {
          Toast.fire({ icon: "success", title: "Application updated!" });
          navigate("/dashboard/my-applications");
        }
      })
      .catch(error => {
        console.error("Error updating application:", error);
        Toast.fire({ icon: "error", title: "Failed to update application" });
      });
  };

  if (!loading) {
    return (
      <section className="container mx-auto px-4 py-8 max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Application</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input type="text" name="name" defaultValue={application.name} className="input w-full" required />
          </div>
          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input type="email" name="email" defaultValue={application.email} className="input w-full" required />
          </div>
          {/* Resume Link */}
          <div>
            <label className="block font-semibold mb-1">Resume Link</label>
            <input type="text" name="resumeLink" defaultValue={application.resumeLink} className="input w-full" required />
          </div>
          {/* Cover Letter */}
          <div>
            <label className="block font-semibold mb-1">Cover Letter</label>
            <textarea name="coverLetter" defaultValue={application.coverLetter} className="textarea w-full" rows={5} required />
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button type="submit" className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">Update</button>
            <button type="button" onClick={() => navigate("/dashboard/my-applications")} className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">Cancel</button>
          </div>
        </form>
      </section>
    );
  }
};

export default EditApplication;