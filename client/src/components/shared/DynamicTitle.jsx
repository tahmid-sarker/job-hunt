import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";

const DynamicTitle = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const currentPath = location.pathname;
    let title = "Job Hunt";

    if (currentPath === "/") {
      title = "Home | Job Hunt";
    } else if (currentPath === "/about-us") {
      title = "About Us | Job Hunt";
    } else if (currentPath === "/contact-us") {
      title = "Contact Us | Job Hunt";
    } else if (currentPath === "/jobs") {
      title = "All Jobs | Job Hunt";
    } else if (currentPath === `/jobs/${id}`) {
      title = "Job Details | Job Hunt";
    } else if (currentPath === `/jobs/${id}/apply`) {
      title = "Apply for Job | Job Hunt";
    } else if (currentPath === "/dashboard") {
      title = "Dashboard | Job Hunt";
    } else if (currentPath === "/dashboard/saved-jobs") {
      title = "Saved Jobs | Job Hunt";
    } else if (currentPath === "/my-profile" && user?.displayName) {
      title = `${user.displayName}'s Profile | Job Hunt`;
    } else if (currentPath === "/dashboard/update-profile") {
      title = "Update Profile | Job Hunt";
    } else if (currentPath === "/dashboard/my-applications") {
      title = "My Applications | Job Hunt";
    } else if (currentPath === `/dashboard/application-details/${id}`) {
      title = "Application Details | Job Hunt";
    } else if (currentPath === `/dashboard/my-applications/edit/${id}`) {
      title = "Edit Application | Job Hunt";
    } else if (currentPath === "/dashboard/manage-users") {
      title = "Manage Users | Job Hunt";
    } else if (currentPath === "/dashboard/manage-applications") {
      title = "Manage Applications | Job Hunt";
    } else if (currentPath === "/dashboard/add-job") {
      title = "Add Job | Job Hunt";
    } else if (currentPath === "/dashboard/manage-jobs") {
      title = "Manage Jobs | Job Hunt";
    } else if (currentPath === `/dashboard/manage-jobs/edit/${id}`) {
      title = "Edit Job | Job Hunt";
    } else if (currentPath === "/dashboard/contact-messages") {
      title = "Contact Messages | Job Hunt";
    } else {
      title = "404 Not Found | Job Hunt";
    }

    document.title = title;
  }, [location.pathname, id, user]);

  return null;
};

export default DynamicTitle;