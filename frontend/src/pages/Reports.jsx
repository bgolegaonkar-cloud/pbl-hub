import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ProjectService from '../services/project.service';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ProjectService.getReportStats().then(
            (response) => {
                setStats(response.data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching report stats", error);
                setLoading(false);
            }
        );
    }, []);

    if (loading) return <div className="text-center py-20">Loading reports...</div>;
    if (!stats) return <div className="text-center py-20">Failed to load report data.</div>;

    const pieData = stats.taskDistribution ? Object.keys(stats.taskDistribution).map(key => ({
        name: key.replace('_', ' '),
        value: stats.taskDistribution[key]
    })) : [];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Project Reports & Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Project Completion Activity */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Project Activity</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.monthlyActivity}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="active" fill="#8884d8" name="Total (Incl. Active)" />
                                <Bar dataKey="completed" fill="#82ca9d" name="Created (Monthly)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Task Status Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Task Status Distribution</h2>
                    <div className="h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-3xl font-bold">{stats.totalProjects}</h3>
                    <p className="opacity-80">Total Projects</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-3xl font-bold">{stats.completedProjects}</h3>
                    <p className="opacity-80">Completed Tasks</p>
                </div>
                <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-3xl font-bold">{stats.inProgressProjects}</h3>
                    <p className="opacity-80">In Progress</p>
                </div>
                <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-3xl font-bold">{stats.overdueProjects}</h3>
                    <p className="opacity-80">Overdue</p>
                </div>
            </div>

        </div>
    );
};

export default Reports;
