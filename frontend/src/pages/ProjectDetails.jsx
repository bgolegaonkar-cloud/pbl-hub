import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProjectService from "../services/project.service";

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        ProjectService.getProjectById(id).then(
            (response) => {
                setProject(response.data);
            },
            (error) => {
                console.log(error);
            }
        );
    }, [id]);

    if (!project) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg mt-8">
            <h1 className="text-4xl font-bold mb-4 text-blue-800">{project.title}</h1>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Description</h3>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Objectives</h3>
                    <p className="text-gray-600 whitespace-pre-line">{project.objectives || "Not specified"}</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Deliverables</h3>
                    <p className="text-gray-600 whitespace-pre-line">{project.deliverables || "Not specified"}</p>
                </div>
            </div>

            <div className="flex justify-end space-x-4 border-t pt-6">
                <Link to="/projects" className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    Back
                </Link>
                <Link to={`/taskboard/${project.id}`} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Go to TaskBoard
                </Link>
            </div>
        </div>
    );
};

export default ProjectDetails;
