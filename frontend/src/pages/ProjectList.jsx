

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectService from "../services/project.service";
import AuthService from "../services/auth.service";

export default function ProjectList() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [projects, setProjects] = useState([]);
    const [projectTitle, setProjectTitle] = useState("");
    const [description, setDescription] = useState("");
    const [objectives, setObjectives] = useState("");
    const [deliverables, setDeliverables] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        } else {
            navigate("/login");
        }

        loadProjects();
    }, [navigate]);

    const loadProjects = () => {
        ProjectService.getAllProjects().then(
            (response) => {
                setProjects(response.data);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const handleCreateProject = () => {
        if (!projectTitle.trim()) return;

        const newProject = {
            title: projectTitle,
            description,
            objectives,
            deliverables,
            startDate,
            endDate
        };

        ProjectService.createProject(newProject).then(
            () => {
                setMessage("Project created successfully!");
                setProjectTitle("");
                setDescription("");
                setObjectives("");
                setDeliverables("");
                setStartDate("");
                setEndDate("");
                loadProjects();
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
            }
        );
    };

    const isMentor = currentUser && currentUser.roles && currentUser.roles.includes("MENTOR");

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <div className="border-b bg-white">
                <div className="mx-auto max-w-5xl px-4 py-5">
                    <div className="text-lg font-semibold">Projects Workspace</div>
                    <div className="text-sm text-gray-500">
                        {isMentor ? "Create and manage projects" : "View and access projects"}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Create Project Section - Only for Mentor */}
                    {isMentor && (
                        <div className="lg:col-span-5">
                            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                                <div className="text-base font-semibold">Create Project</div>
                                <div className="text-sm text-gray-500 mt-1">
                                    Add a new project for students
                                </div>

                                {message && (
                                    <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                                        {message}
                                    </div>
                                )}

                                <div className="mt-5 space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Project Title</label>
                                        <input
                                            value={projectTitle}
                                            onChange={(e) => setProjectTitle(e.target.value)}
                                            className="w-full rounded-xl border px-3 py-2 text-sm mt-1"
                                            placeholder="Enter title"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full rounded-xl border px-3 py-2 text-sm mt-1"
                                            placeholder="Project description"
                                            rows="3"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Objectives</label>
                                        <textarea
                                            value={objectives}
                                            onChange={(e) => setObjectives(e.target.value)}
                                            className="w-full rounded-xl border px-3 py-2 text-sm mt-1"
                                            placeholder="Learning objectives"
                                            rows="2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Deliverables</label>
                                        <textarea
                                            value={deliverables}
                                            onChange={(e) => setDeliverables(e.target.value)}
                                            className="w-full rounded-xl border px-3 py-2 text-sm mt-1"
                                            placeholder="Expected deliverables"
                                            rows="2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-700">Start Date</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full rounded-xl border px-3 py-2 text-sm mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-700">End Date</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full rounded-xl border px-3 py-2 text-sm mt-1"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCreateProject}
                                        className="w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                                    >
                                        + Create Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Project List Section */}
                    <div className={isMentor ? "lg:col-span-7" : "lg:col-span-12"}>
                        <div className="rounded-2xl border bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-base font-semibold">Project List</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Available projects
                                    </div>
                                </div>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                                    {projects.length} Projects
                                </span>
                            </div>

                            <div className="mt-5 space-y-3">
                                {projects.length === 0 ? (
                                    <div className="rounded-xl border bg-gray-50 p-5 text-sm text-gray-500">
                                        No projects found.
                                    </div>
                                ) : (
                                    projects.map((p) => (
                                        <div key={p.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{p.title}</h3>
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        {p.startDate} {p.endDate ? `— ${p.endDate}` : ""}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/projects/${p.id}`)}
                                                    className="shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
