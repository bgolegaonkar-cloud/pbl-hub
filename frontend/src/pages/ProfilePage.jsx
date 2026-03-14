import { useState, useEffect } from "react";
import UserService from "../services/user.service";
import ProjectService from "../services/project.service";
import ContributionGraph from "../components/ContributionGraph";

const ProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [githubLink, setGithubLink] = useState("");
    const [submissions, setSubmissions] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        UserService.getProfile().then(
            (response) => {
                setProfile(response.data);
                setGithubLink(response.data.githubProfileLink || "");
            },
            (error) => {
                console.error("Error fetching profile", error);
            }
        );

        ProjectService.getMySubmissions().then(
            (response) => {
                setSubmissions(response.data);
            },
            (error) => {
                console.error("Error fetching submissions", error);
            }
        );
    }, []);

    const handleSave = () => {
        UserService.updateProfile({ ...profile, githubProfileLink: githubLink }).then(
            () => {
                setMessage("Profile updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            },
            (error) => {
                console.error("Error updating profile", error);
                setMessage("Error updating profile.");
            }
        );
    };

    const renderStars = (rating) => {
        if (!rating) return "No rating";
        return "⭐".repeat(rating);
    };

    return (
        <div className="container mx-auto mt-8 max-w-4xl px-4 pb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h2>

            {/* Profile Info Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">Name</label>
                        <p className="text-lg font-semibold">{profile.name}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">Email</label>
                        <p className="text-lg font-semibold">{profile.email}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">Role</label>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {profile.role}
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">GitHub Profile Link</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            className="flex-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://github.com/username"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                        />
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                    </div>
                    {message && <p className="mt-2 text-green-600 font-medium">{message}</p>}
                </div>
            </div>

            {/* Contribution Heatmap */}
            <ContributionGraph submissions={submissions} />

            {/* Detailed Submission History Section */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Detailed Submission History</h3>
                    <div className="text-sm text-gray-500">
                        Showing {submissions.length} total entries
                    </div>
                </div>

                {submissions.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-dashed">
                        <p className="text-gray-400">No submissions found in your history.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-5 font-semibold text-xs uppercase tracking-wider text-gray-500">Project & Date</th>
                                        <th className="p-5 font-semibold text-xs uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="p-5 font-semibold text-xs uppercase tracking-wider text-gray-500">Evaluation</th>
                                        <th className="p-5 font-semibold text-xs uppercase tracking-wider text-gray-500">Mentor Feedback</th>
                                        <th className="p-5 font-semibold text-xs uppercase tracking-wider text-gray-500">Submission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((submission) => (
                                        <tr key={submission.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors align-top">
                                            <td className="p-5">
                                                <div className="font-bold text-gray-800 mb-1">
                                                    {submission.project ? submission.project.title : "Untitled Project"}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(submission.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-4 tracking-tight uppercase ${submission.status === "APPROVED" || submission.status === "ACCEPTED"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : submission.status === "REJECTED"
                                                            ? "bg-rose-100 text-rose-800"
                                                            : "bg-amber-100 text-amber-800"
                                                        }`}
                                                >
                                                    {submission.status}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="text-amber-500 text-sm tracking-widest">
                                                    {renderStars(submission.feedback?.rating)}
                                                </div>
                                                {submission.feedback?.rating && (
                                                    <div className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                                                        Rating: {submission.feedback.rating}/5
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-5 min-w-[200px]">
                                                {submission.feedback ? (
                                                    <div className="max-w-xs">
                                                        <p className="text-sm text-gray-600 leading-relaxed italic">
                                                            "{submission.feedback.comments}"
                                                        </p>
                                                        <div className="flex items-center mt-3 gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                                {(submission.feedback.mentor?.name || "M")[0]}
                                                            </div>
                                                            <span className="text-xs text-gray-500 font-medium">
                                                                {submission.feedback.mentor?.name || "Mentor"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-300">
                                                        <span className="text-xs italic">Review in progress...</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-5">
                                                <a
                                                    href={submission.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold text-xs transition-colors"
                                                >
                                                    View Source
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
