import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectService from "../services/project.service";
import AuthService from "../services/auth.service";

const TASK_STATUS = ["TODO", "IN_PROGRESS", "DONE"];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function statusBadge(status) {
  const map = {
    "TODO": "bg-gray-100 text-gray-800",
    "IN_PROGRESS": "bg-blue-100 text-blue-700 border border-blue-200",
    "DONE": "bg-green-100 text-green-700 border border-green-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        map[status] || "bg-gray-100 text-gray-800"
      )}
    >
      {status}
    </span>
  );
}

function AddTaskDialog({ open, onClose, onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-base font-semibold">Add New Task</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700">Task Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm mt-1"
              placeholder="Enter task title"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm mt-1"
              placeholder="Task description"
              rows="3"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm">Cancel</button>
            <button
              onClick={() => {
                if (!title.trim()) return;
                onAddTask({ title, description, status: "TODO" });
                setTitle("");
                setDescription("");
                onClose();
              }}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadDialog({ open, onClose, projectId, onUpload }) {
  const [fileUrl, setFileUrl] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-base font-semibold">Submit Project Work</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700">File URL / Link</label>
            <input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm mt-1"
              placeholder="e.g. GitHub link or Drive link"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm">Cancel</button>
            <button
              onClick={() => {
                if (!fileUrl.trim()) return;
                onUpload(fileUrl);
                setFileUrl("");
                onClose();
              }}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewPanel({ submission, onClose, onGrade }) {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState("APPROVED");

  if (!submission) return null;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <h3 className="text-base font-semibold">Submission Review</h3>
        <button onClick={onClose} className="text-sm">Close</button>
      </div>
      <div className="mt-4 text-sm">
        <p><strong>Student:</strong> {submission.student?.name} ({submission.student?.email})</p>
        <p><strong>Link:</strong> <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">{submission.fileUrl}</a></p>
        <p><strong>Status:</strong> {submission.status}</p>
      </div>

      <div className="mt-5 border-t pt-4 space-y-3">
        <div>
          <label className="text-xs font-medium">Status Update</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded p-2 text-sm">
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium">Rating (1-5)</label>
          <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full border rounded p-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium">Comments</label>
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} className="w-full border rounded p-2 text-sm" rows="3" />
        </div>
        <button
          onClick={() => onGrade(submission.id, { status, rating, comments })}
          className="w-full bg-blue-600 text-white rounded p-2 text-sm"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}


export default function TaskBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // For Mentor: Submissions
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      navigate("/login");
    }

    loadTasks();
    if (user && user.roles.includes("MENTOR")) {
      loadSubmissions();
    }
  }, [projectId, navigate]);

  const loadTasks = () => {
    ProjectService.getTasksByProject(projectId).then(
      (response) => setTasks(response.data),
      (error) => console.error(error)
    );
  };

  const loadSubmissions = () => {
    ProjectService.getSubmissionsByProject(projectId).then(
      (response) => setSubmissions(response.data),
      (error) => console.error(error)
    );
  };

  const handleAddTask = (task) => {
    ProjectService.createTask({ ...task, projectId }).then(
      () => {
        loadTasks();
        setOpenAddTask(false);
      },
      (error) => alert("Failed to add task")
    );
  };

  const handleUpdateStatus = (taskId, status) => {
    ProjectService.updateTaskStatus(taskId, status).then(
      () => loadTasks(),
      (error) => alert("Failed to update status")
    );
  };

  const handleUpload = (fileUrl) => {
    ProjectService.submitProject(projectId, fileUrl).then(
      (response) => {
        alert(response.data.message);
        setOpenUpload(false);
      },
      (error) => {
        alert("Submission failed: " + (error.response?.data?.message || error.message));
      }
    );
  };

  const handleGrade = (submissionId, feedback) => {
    ProjectService.gradeSubmission(submissionId, feedback).then(
      (response) => {
        alert("Feedback submitted");
        loadSubmissions();
        setSelectedSubmission(null);
      },
      (error) => alert("Failed to submit feedback")
    );
  };

  const isMentor = currentUser && currentUser.roles && currentUser.roles.includes("MENTOR");

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6">
          <div>
            <h1 className="text-xl font-bold">Project Board</h1>
            <p className="text-sm text-gray-500">Project ID: {projectId}</p>
          </div>
          <div className="flex gap-3">
            {isMentor && (
              <button onClick={() => setOpenAddTask(true)} className="bg-black text-white px-4 py-2 rounded-lg text-sm">
                + Add Task
              </button>
            )}
            {!isMentor && (
              <button onClick={() => setOpenUpload(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                Submit Work
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg">Tasks</h2>
            {tasks.length === 0 ? <p className="text-gray-500">No tasks yet.</p> : tasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                  {statusBadge(task.status)}
                </div>
                {isMentor && (
                  <div className="mt-3 flex gap-2 text-xs">
                    <button onClick={() => handleUpdateStatus(task.id, 'TODO')} className="px-2 py-1 border rounded hover:bg-gray-50">ToDo</button>
                    <button onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')} className="px-2 py-1 border rounded hover:bg-gray-50">In Progress</button>
                    <button onClick={() => handleUpdateStatus(task.id, 'DONE')} className="px-2 py-1 border rounded hover:bg-gray-50">Done</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isMentor && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Submissions</h2>
              <div className="space-y-3">
                {submissions.length === 0 ? <p className="text-gray-500 text-sm">No submissions.</p> : submissions.map(sub => (
                  <div key={sub.id} className="bg-white p-3 rounded-xl border cursor-pointer hover:shadow-md" onClick={() => setSelectedSubmission(sub)}>
                    <div className="text-sm font-medium">{sub.student?.name}</div>
                    <div className="text-xs text-gray-500">{sub.status} • {new Date(sub.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>

              {selectedSubmission && (
                <div className="mt-6">
                  <ReviewPanel submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} onGrade={handleGrade} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AddTaskDialog open={openAddTask} onClose={() => setOpenAddTask(false)} onAddTask={handleAddTask} />
      <UploadDialog open={openUpload} onClose={() => setOpenUpload(false)} projectId={projectId} onUpload={handleUpload} />
    </div>
  );
}
