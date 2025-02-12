import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc";
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

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

const Register = ({ isOpen, onSwitch }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const location = useLocation()
    const from = location.state || "/";
    const navigate = useNavigate();
    const { user, createUser, updateUser, loginWithGoogle } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const { name, email, password, checkbox, photo, ...restFormData } = Object.fromEntries(formData.entries());
        setPasswordErrorMessage("");
        // Password Validate
        const passwordRex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRex.test(password)) {
            if (password.length < 8) {
                setPasswordErrorMessage("Password must be at least 8 characters long.");
            } else if (!/[a-z]/.test(password)) {
                setPasswordErrorMessage("Password must include at least one lowercase letter.");
            } else if (!/[A-Z]/.test(password)) {
                setPasswordErrorMessage("Password must include at least one uppercase letter.");
            } else if (!/\d/.test(password)) {
                setPasswordErrorMessage("Password must include at least one digit.");
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                setPasswordErrorMessage("Password must include at least one special character.");
            } else {
                setPasswordErrorMessage("Password must meet all required conditions.");
            }
            return;
        }

        // Checkbox Check
        if (!checkbox) {
            Toast.fire({
                icon: "error",
                title: "You Have to Accept our Terms and Conditions!",
            });
            return;
        }

        // Create A User:
        createUser(email, password)
            .then((result) => {
                navigate(from)

                // Update User Info
                updateUser(name, photo)
                    .then()
                    .catch((error) => {
                        //Error
                        Toast.fire({
                            icon: "error",
                            title: error.message,
                        });
                    })
                // Send Data to Database:
                // User Profile 
                const userInfo = {
                    name,
                    email,
                    photo,
                    role: "user",
                    premium: "false",
                    ...restFormData,
                    creationTime: result.user?.metadata?.creationTime,
                    lastSignInTime: result.user?.metadata?.lastSignInTime,
                }
                result.user.getIdToken().then((token) => {
                    axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        if (response.data.insertedId) {
                            // Success
                            Toast.fire({
                                icon: "success",
                                title: "Account Created Successfully!",
                            });
                        }
                    })
                    .catch((error) => {
                        // Error
                        Toast.fire({
                            icon: "error",
                            title: error.message,
                        });
                    })
                })
            })
            .catch((error) => {
                // Error
                Toast.fire({
                    icon: "error",
                    title: error.message,
                });
            });
    }

    const handleGoogleSignUp = () => {
        loginWithGoogle()
            .then(() => {
                navigate(location.state || "/");
                // Success
                Toast.fire({
                    icon: "success",
                    title: "Create Account Successfully!",
                });
            })
            .catch((error) => {
                // Error
                Toast.fire({
                    icon: "error",
                    title: error.message,
                });
            });
    };

    if (user) {
        navigate(from);
        return;
    } else {
        return (
            <dialog open={isOpen} className="modal">
                <div className='modal-box'>
                    <h2 className="text-2xl font-bold mb-4">Sign up to your account!</h2>
                    {/* Close Modal */}
                    <form method="dialog">
                        <button onClick={() => onSwitch(null)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><RxCross1 className="h-5 w-5" /></button>
                    </form>
                    {/* Register From */}
                    <form onSubmit={handleSubmit}>
                        <fieldset className="space-y-1.5">
                            {/* Name */}
                            <div>
                                <label className="label text-lg md:text-xl text-neutral">Name</label><br />
                                <input type="text" name="name" placeholder="Enter your Name"
                                    className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" required />
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="label text-lg md:text-xl text-neutral">Email Address</label><br />
                                <input type="email" name="email" placeholder="example@email.com"
                                    className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" required />
                            </div>

                            {/* Photo */}
                            <div>
                                <label className="label text-lg md:text-xl text-neutral">Photo URL</label><br />
                                <input type="url" name="photo" placeholder="Enter your Photo URL"
                                    className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" required />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <label className="label text-lg md:text-xl text-neutral">Password</label><br />
                                <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your Password"
                                    className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" required />
                                {/* Show/Hide Password Icon */}
                                <div onClick={() => setShowPassword(!showPassword)} className="absolute cursor-pointer right-4 top-10">
                                    {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                                </div>
                            </div>

                            {/* Password Error */}
                            <div className="text-sm md:text-lg text-center text-red-600">
                                {passwordErrorMessage}
                            </div>

                            {/* Terms */}
                            <div className="flex gap-2 text-sm md:text-lg text-gray-700 items-center">
                                <input type="checkbox" name="checkbox" className="accent-primary" />
                                <p>I agree to the <span className="text-primary">Terms of Service</span> and <span className="text-[var(--color-primary)]">Privacy Policy</span>.</p>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button type="submit" className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary w-full text-white text-base">Register your Account</button>
                            </div>

                            {/* OR */}
                            <div className="text-neutral text-center my-2">OR</div>

                            {/* Google Sign In */}
                            <div className="flex justify-center">
                                <button onClick={handleGoogleSignUp} className="w-full cursor-pointer flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded-lg border border-secondary text-primary bg-white hover:shadow-xl transition-shadow">
                                    <FcGoogle size={24} /> Register with Google
                                </button>
                            </div>

                            {/* Link to Login */}
                            <div className="mt-4 text-center">
                                <p className="text-base md:text-lg">Already have an account? <span onClick={() => onSwitch('login')} className="text-secondary cursor-pointer hover:no-underline">Login</span></p>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </dialog>
        );
    }
};

export default Register;