import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <h1 className="text-5xl font-bold mb-6 text-blue-700">Project-Based Learning Hub</h1>
            <p className="text-xl mb-8 max-w-2xl text-gray-600">
                Learn by building real-world projects. Collaborate with peers, get mentor feedback, and showcase your portfolio.
            </p>
            <div className="space-x-4">
                <Link to="/projects" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
                    Browse Projects
                </Link>
                <Link to="/register" className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition">
                    Get Started
                </Link>
            </div>
        </div>
    );
};

export default Home;
