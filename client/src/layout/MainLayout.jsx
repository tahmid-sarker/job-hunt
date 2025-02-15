import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import DynamicTitle from "../components/shared/DynamicTitle";

const MainLayout = () => {
    return (
        <main>
            <DynamicTitle />
            <Header />
            <Outlet />
            <Footer />
        </main>
    );
};

export default MainLayout;