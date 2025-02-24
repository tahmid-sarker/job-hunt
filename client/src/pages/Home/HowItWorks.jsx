import { motion } from "motion/react"
import { TbSearch } from "react-icons/tb";
import { GrDocumentText } from "react-icons/gr";
import { IoSparklesOutline } from "react-icons/io5";
import { GoSync } from "react-icons/go";

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const cardDetails = [
  {
    icon: <TbSearch size={36} className="text-primary mx-auto mb-3" />,
    title: "Browse Companies",
    descriptions: "Discover a wide range of verified companies and view their job openings with essential details like location and industry."
  },
  {
    icon: <GrDocumentText size={36} className="text-primary mx-auto mb-3" />,
    title: "View Job Details",
    descriptions: "Check job descriptions, qualifications, and requirements to better understand the roles before applying."
  },
  {
    icon: <IoSparklesOutline size={36} className="text-primary mx-auto mb-3" />,
    title: "Apply with Ease",
    descriptions: "With one click, go directly to the company’s official site and submit your application without distractions."
  },
  {
    icon: <GoSync size={36} className="text-primary mx-auto mb-3" />,
    title: "Stay Synced",
    descriptions: "Create a profile to manage your job search, track applications, and keep everything in one secure place."
  }
];

const HowItWorks = () => {
  return (
    <section className="w-11/12 mx-auto mt-5">
      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-center text-neutral">
        How <span className="bg-linear-to-r from-primary to-secondary text-transparent bg-clip-text">Job Hunt</span> Works 
      </h1>

      {/* Cards */}
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mt-5">
        {cardDetails.map((card, index) => (
          <motion.div key={index} className="bg-white shadow-xl p-6 rounded-2xl hover:shadow-2xl transition duration-300"
            variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                {card.icon}
            <h3 className="text-lg md:text-xl text-center text-gray-700 font-bold mb-2">{card.title}</h3>
            <p className="text-gray-500">{card.descriptions}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;