import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

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

const ApplicationDetails = ({ application, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users`, { withCredentials: true })
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Error fetching users:", error);
        Toast.fire({ icon: "error", title: "Failed to fetch users" });
      })
      .finally(() => setLoading(false));
  }, []);

  if (!application) return null;
  const roledUser = users.find((u) => u.email === user?.email);

  if (!loading) {
    return (
      <dialog open className="modal">
        <div className="modal-box relative max-w-lg w-full p-6 sm:p-8 rounded-2xl shadow-xl">
          {/* Close Button */}
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <RxCross1 className="w-5 h-5" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center sm:text-left">Application Details</h2>

          {/* Job Info */}
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-4">
              <img src={application.company_logo} alt={application.company} className="w-16 h-16 object-contain rounded" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{application.jobTitle}</h3>
                <p className="text-gray-600">{application.company}</p>
              </div>
            </div>

            <p className="flex gap-2"><span className="font-semibold">Full Name:</span><span>{application.name}</span></p>
            <p className="flex gap-2"><span className="font-semibold">Email:</span><span>{application.email}</span></p>
            <p className="flex gap-2 text-gray-500"><span className="font-semibold">Applied At:</span><span>{new Date(application.appliedAt).toLocaleDateString()}</span></p>
            <p className="flex gap-2"><span className="font-semibold">Resume Link:</span><a href={application.resumeLink} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-secondary">View Resume</a></p>

            <div>
              <span className="font-semibold">Cover Letter:</span>
              <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto text-gray-700 leading-relaxed whitespace-pre-line shadow-inner">{application.coverLetter}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            {roledUser?.role !== "admin" && (
              <button onClick={() => { navigate(`/dashboard/my-applications/edit/${application._id}`); onClose(); }} className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white hover:btn-secondary w-full sm:w-auto">Edit Application</button>
            )}
            <button onClick={onClose} className="btn btn-outline w-full sm:w-auto">Close</button>
          </div>
        </div>
      </dialog>
    );
  }
};

export default ApplicationDetails;