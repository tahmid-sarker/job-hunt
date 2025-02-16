import { MdVerified } from "react-icons/md";
import { motion } from "motion/react";
import { asset } from "../utils/asset";

const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.6 }
    })
};

const AboutUs = () => {
    const cardDetails = [
        {
            title: "Centralized Listings",
            description: "Easily browse jobs from various industries and companies all gathered in one streamlined platform."
        },
        {
            title: "Secure & Simple Login",
            description: "Sign in with Google for a fast, secure experience that keeps your data protected while syncing effortlessly."
        },
        {
            title: "Clean, Responsive Design",
            description: "Enjoy a smooth experience across all devices mobile, tablet, or desktop with our responsive interface."
        },
        {
            title: "Trusted Opportunities",
            description: "We carefully select listings from reliable, verified companies so you can apply with confidence."
        }
    ];

    return (
        <section className="w-11/12 md:min-h-screen mx-auto mt-5 md:mt-8">
            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-bold text-center text-neutral mb-5">
                Why Choose <span className="bg-linear-to-r from-primary to-secondary text-transparent bg-clip-text">Job Hunt</span>?
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-center gap-5">
                {/* Left - Banner */}
                <motion.div className="w-full md:w-1/2" 
                    initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <img src={asset("images/Why-Choose-Us-Banner.svg")} alt="Why Choose Us Banner" className="w-full h-auto object-contain" />
                </motion.div>

                {/* Right - Cards */}
                <div className="w-full md:w-1/2 space-y-4">
                    {cardDetails.map((card, index) => (
                        <motion.div key={index} className="bg-white shadow-xl p-5 rounded-xl"
                            custom={index} initial="hidden" animate="visible" variants={cardVariant}>
                            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-1">
                                <MdVerified className="text-blue-500" size={20} />
                                {card.title}
                            </div>
                            <p className="text-gray-600 text-sm">{card.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutUs;