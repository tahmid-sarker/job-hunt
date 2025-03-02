import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Error from "../pages/Error";
import Home from "../pages/Home/Home";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import PrivateRoutes from "./PrivateRoutes";
import MyProfile from "../pages/MyProfile";
import UpdateProfile from "../pages/Dashboard/User/UpdateProfile";
import Jobs from "../pages/Jobs/Jobs";
import JobDetails from "../pages/Jobs/JobDetails";
import Apply from "../pages/Jobs/Apply";
import SavedJobs from "../pages/Dashboard/User/SavedJobs";
import DashboardLayout from "../layout/DashboardLayout";
import AdminRoutes from "./AdminRoutes";
import MyApplications from "../pages/Dashboard/User/MyApplications";
import UserRoutes from "./UserRoutes";
import ApplicationDetails from "../pages/Dashboard/User/ApplicationDetails";
import EditApplication from "../pages/Dashboard/User/EditApplication";
import ManageApplications from "../pages/Dashboard/Admin/ManageApplications";
import ManageJobs from "../pages/Dashboard/Admin/ManageJobs";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import EditJob from "../pages/Dashboard/Admin/EditJob";
import AddJob from "../pages/Dashboard/Admin/AddJob";
import ContactMessages from "../pages/Dashboard/Admin/ContactMessages";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "/about-us", Component: AboutUs },
      { path: "/contact-us", Component: ContactUs },
      { path: "/jobs", Component: Jobs },
      { path: "/my-profile", element: <PrivateRoutes><MyProfile /></PrivateRoutes> },
      { path: "/jobs/:id", element: <PrivateRoutes><JobDetails /></PrivateRoutes> },
      { path: "/jobs/:id/apply", element: <PrivateRoutes><Apply /></PrivateRoutes> },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoutes><DashboardLayout /></PrivateRoutes>,
    children: [
      { path: "/dashboard/update-profile", element: <UserRoutes><UpdateProfile /></UserRoutes> },
      { path: "/dashboard/my-applications", element: <UserRoutes><MyApplications /></UserRoutes> },
      { path: "/dashboard/application-details/:id", element: <UserRoutes><ApplicationDetails /></UserRoutes> },
      { path: "/dashboard/my-applications/edit/:id", element: <UserRoutes><EditApplication /></UserRoutes> },
      { path: "/dashboard/saved-jobs", element: <UserRoutes><SavedJobs /></UserRoutes> },
      { path: "/dashboard/manage-users", element: <AdminRoutes><ManageUsers /></AdminRoutes> },
      { path: "/dashboard/manage-applications", element: <AdminRoutes><ManageApplications /></AdminRoutes> },
      { path: "/dashboard/add-job", element: <AdminRoutes><AddJob /></AdminRoutes> },
      { path: "/dashboard/manage-jobs", element: <AdminRoutes><ManageJobs /></AdminRoutes> },
      { path: "/dashboard/manage-jobs/edit/:id", element: <AdminRoutes><EditJob /></AdminRoutes> },
      { path: "/dashboard/contact-messages", element: <AdminRoutes><ContactMessages /></AdminRoutes> },
    ],
  },
  { path: "/*", Component: Error },
], { basename });