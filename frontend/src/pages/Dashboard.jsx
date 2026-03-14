import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import ProjectService from "../services/project.service";

const Dashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        if (currentUser) {
            ProjectService.getMySubmissions().then(
                (response) => {
                    setSubmissions(response.data || []);
                    setLoading(false);
                },
                (error) => {
                    console.log(error);
                    setLoading(false);
                    // Use dummy data for display if API fails (for demo purposes if backend isn't ready)
                    setSubmissions([
                        { id: 1, project: { title: 'E-Commerce Platform' }, status: 'APPROVED', createdAt: '2024-01-15', fileUrl: '#' },
                        { id: 2, project: { title: 'Portfolio Website' }, status: 'PENDING', createdAt: '2024-01-20', fileUrl: '#' }
                    ]);
                }
            );
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Please Log In</h2>
                <p className="text-gray-500 mb-6">You need to be logged in to view your dashboard.</p>
                <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome back, {currentUser.username || 'User'}!</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your projects today.</p>
                </div>
                {currentUser && currentUser.roles && currentUser.roles.includes("MENTOR") && (
                    <div className="flex space-x-3">
                        <Link to="/projects" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                            + New Project
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-gray-500 text-sm font-medium uppercase">Active Projects</span>
                    <span className="text-4xl font-bold text-blue-600 mt-2">3</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-gray-500 text-sm font-medium uppercase">Pending Tasks</span>
                    <span className="text-4xl font-bold text-yellow-500 mt-2">12</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-gray-500 text-sm font-medium uppercase">Completed</span>
                    <span className="text-4xl font-bold text-green-500 mt-2">8</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-gray-500 text-sm font-medium uppercase">Upcoming Deadlines</span>
                    <span className="text-4xl font-bold text-red-500 mt-2">2</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Submissions / Recent Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Recent Submissions</h2>
                            <Link to="/reports" className="text-blue-500 text-sm hover:underline">View All</Link>
                        </div>

                        {loading ? (
                            <div className="p-10 text-center text-gray-400">Loading activity...</div>
                        ) : submissions.length === 0 ? (
                            <div className="p-10 text-center">
                                <p className="text-gray-500 mb-4">No submissions found.</p>
                                <Link to="/projects" className="text-blue-600 hover:underline">Browse projects to get started</Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-semibold">Project</th>
                                            <th className="p-4 font-semibold">Submitted On</th>
                                            <th className="p-4 font-semibold">Status</th>
                                            <th className="p-4 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {submissions.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-gray-50 transition">
                                                <td className="p-4 font-medium text-gray-800">{sub.project ? sub.project.title : 'Untitled Project'}</td>
                                                <td className="p-4 text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                        sub.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium text-sm">View</a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Shortcuts & Calendar */}
                <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Access</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/kanban" className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition text-center group">
                                <div className="text-blue-600 text-2xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                                <div className="font-semibold text-gray-700">Task Board</div>
                            </Link>
                            <Link to="/calendar" className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition text-center group">
                                <div className="text-purple-600 text-2xl mb-2 group-hover:scale-110 transition-transform">📅</div>
                                <div className="font-semibold text-gray-700">Calendar</div>
                            </Link>
                            <Link to="/reports" className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition text-center group">
                                <div className="text-green-600 text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                                <div className="font-semibold text-gray-700">Reports</div>
                            </Link>
                            <Link to="/projects" className="p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition text-center group">
                                <div className="text-orange-600 text-2xl mb-2 group-hover:scale-110 transition-transform">🔍</div>
                                <div className="font-semibold text-gray-700">Find Projects</div>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
