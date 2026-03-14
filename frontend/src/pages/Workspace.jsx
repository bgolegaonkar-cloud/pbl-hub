import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import ProjectService from "../services/project.service";

const Workspace = () => {
    const { id } = useParams();
    const [fileUrl, setFileUrl] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        ProjectService.submitProject(id, fileUrl).then(
            (response) => {
                setMessage(response.data.message);
                setFileUrl("");
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message;
                setMessage(resMessage);
            }
        );
    };

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6 h-[85vh]">
            {/* Left Side: Editor/Submission Placeholder */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex-1">
                    <h2 className="text-2xl font-bold mb-4">Workspace & Submission</h2>
                    <p className="text-gray-600 mb-6">Use your preferred IDE (VS Code) to build the project. When ready, submit your GitHub repository link or file URL below.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Project URL / File Link</label>
                            <input
                                type="text"
                                className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://github.com/username/repo"
                                value={fileUrl}
                                onChange={(e) => setFileUrl(e.target.value)}
                                required
                            />
                        </div>
                        <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full font-bold">
                            Submit Project
                        </button>
                        {message && <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded text-center">{message}</div>}
                    </form>
                </div>
            </div>

            {/* Right Side: Chat & Collaboration */}
            <div className="w-full md:w-1/3">
                <ChatBox />
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2">Mentors Online</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Prof. Smith</li>
                        <li className="flex items-center"><span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span> Jane Doe (Offline)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Workspace;
