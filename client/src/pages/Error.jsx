import { useNavigate } from 'react-router';

const Error = () => {
    const navigate = useNavigate()

  return (
    <section className="h-screen flex items-center justify-center">  
      {/* Error Message */}
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg w-10/12 md:w-full">
        <h1 className="text-5xl font-bold text-red-600 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-800 mb-6"> Sorry, the page you're looking for doesn't exist.</p>
        <p className="text-sm text-gray-500 mb-8">Please check the URL or go back to the homepage.</p>
        <button className="btn btn-primary hover:btn-secondary text-white" onClick={() => navigate("/")}>
          Go to Homepage
        </button>
      </div>
    </section>
  );
};

export default Error;