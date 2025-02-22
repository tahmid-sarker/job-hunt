import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router';
import axios from 'axios';

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

const UpdateProfile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const { name, photo } = Object.fromEntries(formData.entries());

        // Update Firebase profile
        await updateUser(name, photo)
            .then(() => {
                navigate('/my-profile');
                // Prepare data to update backend
                const updateInfo = { name, photo };
                // Axios request
                axios.patch(`${import.meta.env.VITE_API_URL}/dashboard/update-profile`, updateInfo, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                })
                    .then(response => {
                        if (response.data.modifiedCount) {
                            // Success
                            Toast.fire({
                                icon: "success",
                                title: "Profile Updated Successfully!",
                            });
                        }
                    })
                    .catch(error => {
                        Toast.fire({
                            icon: "error",
                            title: error.message || "Failed to update profile",
                        });
                    });
            })
    };

    return (
        <div className="flex justify-center my-15">
            <form onSubmit={handleUpdateProfile} className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-11/12 mx-auto md:w-full space-y-4">
                <img src={user?.photoURL} alt={user?.displayName} className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-primary" />
                <h2 className="text-2xl font-bold text-center text-gray-800">Update Profile</h2>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Display Name</label>
                    <input type="text" name='name' placeholder="Enter your name" className="w-full text-xs md:text-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary" required />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Photo URL</label>
                    <input type="url" name="photo" placeholder="Enter photo URL" className="w-full text-xs md:text-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary" required />
                </div>
                <button type="submit" className="w-full btn border-none bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">Update</button>
            </form>
        </div>
    );
};

export default UpdateProfile;