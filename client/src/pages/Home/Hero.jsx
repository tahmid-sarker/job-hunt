import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { asset } from "../../utils/asset";

const Hero = () => {
    const navigate = useNavigate();
    return (
        <motion.section className="w-11/12 mx-auto md:min-h-screen flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-16 mt-10" 
            initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:0.6}} viewport={{amount:0.3}}>
        
        {/* Left - Title and Description */}
        <motion.div className="w-full md:w-1/2 text-center md:text-left space-y-4" 
            initial={{x:-80,opacity:0}} whileInView={{x:0,opacity:1}} transition={{duration:0.7,ease:"easeOut"}} viewport={{amount:0.3}}>
            <h1 className="text-3xl md:text-5xl font-bold text-neutral leading-snug">Find Your Next Big <span className="text-primary">Opportunity</span> with <span className="bg-linear-to-r from-primary to-secondary text-transparent bg-clip-text">Job Hunt</span></h1>
            <p className="text-base md:text-lg text-neutral/80">Discover a world of job opportunities across trusted companies all in one place. From remote roles to corporate careers, Job Hunt keeps your job search focused and frictionless.</p>
            <motion.button onClick={() => navigate("/jobs")} className="cursor-pointer bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-3 rounded-lg font-medium shadow-md transition" 
                whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Get Started</motion.button>
        </motion.div>

        {/* Right - Banner */}
        <motion.div className="w-full md:w-1/2" 
            initial={{x:80,opacity:0}} whileInView={{x:0,opacity:1}} transition={{duration:0.7,ease:"easeOut"}} viewport={{amount:0.3}}>
            <img src={asset("images/Hero-Banner.svg")} alt="Hero Banner" className="w-full max-h-[70vh] object-contain" />
        </motion.div>
        </motion.section>
    );
};

export default Hero;