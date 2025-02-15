import { Link, NavLink } from 'react-router';
import { FaFacebook, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { asset } from '../utils/asset';

const Footer = () => {
    return (
        <footer className="bg-base-200">
            <div className='w-11/12 mx-auto flex flex-col md:flex-row justify-around p-4'>

                {/* Brand Info */}
                <div className='flex flex-col justify-center items-start gap-2'>
                    {/* Logo */}
                    <Link to="/" className="text-lg md:text-2xl font-bold flex items-center gap-2 whitespace-nowrap">
                        <img src={asset("icons/logo.png")} alt="Job Hunt Logo" className="w-8 h-8" />
                        <h1 className='bg-linear-to-r from-primary to-secondary text-transparent bg-clip-text'>Job Hunt</h1>
                    </Link>
                    <div>
                        <p className='text-neutral font-medium'>Sync Your Career with Opportunity</p>
                        <p className='text-neutral font-medium'>Email Us</p>
                        <a className="font-medium text-secondary hover:text-primary" href="mailto:contact.tahmid.sarker@gmail.com">contact.tahmid.sarker@gmail.com</a>
                    </div>
                </div>

                {/* Navigation Links */}
                <div>
                    <h3 className="text-xl text-neutral font-semibold mb-2">Explore</h3>
                    <ul className="space-y-1">
                        <li><NavLink to="/" className="text-neutral hover:text-primary">Home</NavLink></li>
                        <li><NavLink to="/my-profile" className="text-neutral hover:text-primary">My Profile</NavLink></li>
                        <li><NavLink to="/saved-jobs" className="text-neutral hover:text-primary">Saved Jobs</NavLink></li>
                    </ul>
                </div>

                {/* Contact / Social */}
                <div className="flex flex-col items-start gap-3">
                    <h3 className="text-xl text-neutral font-bold">Connect with Us</h3>
                    <div className="flex gap-3">
                        <NavLink to="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <div className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full text-white shadow-md transition">
                                <FaFacebook size={20} />
                            </div>
                        </NavLink>
                        <NavLink to="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <div className="bg-blue-800 hover:bg-blue-900 p-2 rounded-full text-white shadow-md transition">
                                <FaLinkedin size={20} />
                            </div>
                        </NavLink>
                        <NavLink to="https://www.github.com" target="_blank" rel="noopener noreferrer">
                            <div className="bg-gray-800 hover:bg-black p-2 rounded-full text-white shadow-md transition">
                                <FaGithub size={20} />
                            </div>
                        </NavLink>
                        <NavLink to="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <div className="bg-blue-400 hover:bg-blue-500 p-2 rounded-full text-white shadow-md transition">
                                <FaTwitter size={20} />
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>
            {/* Footer Bottom */}
            <div className="text-center text-sm text-natural">
                &copy; {new Date().getFullYear()} Job Hunt. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;