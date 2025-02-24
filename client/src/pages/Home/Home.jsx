import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import FeaturedJobs from "./FeaturedJobs";
import Testimonials from "./Testimonials";

const Home = () => {
    return (
        <div>
            {/*Hero Section*/}
            <Hero></Hero>
            {/*How It Works Section*/}
            <HowItWorks></HowItWorks>
            {/*Jobs Section*/}
            <FeaturedJobs></FeaturedJobs>
            {/*Testimonials Section*/}
            <Testimonials></Testimonials>
        </div>
    );
};

export default Home;