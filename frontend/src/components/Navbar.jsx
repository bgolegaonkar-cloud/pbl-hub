import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    PBL Hub
                </Link>
                <div className="space-x-6 flex items-center">
                    <Link to="/projects" className="hover:text-blue-200 transition">Projects</Link>

                    <Link to="/calendar" className="hover:text-blue-200 transition">Calendar</Link>
                    <Link to="/reports" className="hover:text-blue-200 transition">Reports</Link>

                    {currentUser ? (
                        <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-blue-400">
                            <span className="font-semibold">{currentUser.username}</span>
                            <Link to="/profile" className="hover:text-blue-200 transition">Profile</Link>
                            <button
                                onClick={logOut}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:text-blue-200 transition">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100 transition font-medium"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
