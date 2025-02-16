import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "motion/react";
import { asset } from "../utils/asset";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const ContactUs = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact-message`, data);
      Toast.fire({ icon: "success", title: "Message sent successfully!" });
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.fire({ icon: "error", title: "Failed to send message" });
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral mb-10">
        Get in <span className="text-primary">Touch</span> with Us
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Image */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src={asset("images/Form-Banner.svg")} alt="Contact Us" className="w-8/12 object-contain" />
        </motion.div>

        {/* Right Side - Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Send us a <span className="text-primary">Message</span>
          </h3>

          <div className="grid grid-cols-1 gap-6 text-neutral">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-hidden text-neutral"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-hidden text-neutral"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-hidden text-neutral"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              required
              className="textarea w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-hidden text-neutral"
            />
            <button
              type="submit"
              className="btn border-none bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded-full py-3 shadow-lg transition duration-300"
            >
              Send Message
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactUs;
