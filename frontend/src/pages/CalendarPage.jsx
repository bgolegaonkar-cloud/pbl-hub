import React, { useMemo, useState, useEffect } from "react";
import CalendarService from "../services/calendar.service";
import AuthService from "../services/auth.service";

const TASK_STATUS = [
    "Not Started",
    "In Progress",
    "Submitted",
    "Needs Revision",
    "Approved",
];

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function makeId(prefix) {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function statusBadge(status) {
    const map = {
        "Not Started": "bg-gray-100 text-gray-800",
        "In Progress": "bg-blue-100 text-blue-700 border border-blue-200",
        Submitted: "bg-purple-100 text-purple-700 border border-purple-200",
        "Needs Revision": "bg-yellow-100 text-yellow-800 border border-yellow-200",
        Approved: "bg-green-100 text-green-700 border border-green-200",
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

/* ---------------- Progress Pill ---------------- */
function ProgressPill({ pct }) {
    const clamped = clamp(pct, 0, 100);
    return (
        <div className="flex items-center gap-2">
            <div className="h-2 w-24 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-gray-900" style={{ width: `${clamped}%` }} />
            </div>
            <span className="text-xs text-gray-500 tabular-nums">{clamped}%</span>
        </div>
    );
}

/* ---------------- Upload Summary ---------------- */
function TaskUploadSummary({ task }) {
    const uploadCount = task.uploads?.length || 0;
    const last = uploadCount ? task.uploads[0]?.uploadedAt : "No uploads";

    return (
        <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium">{uploadCount}</span>
            <span>file{uploadCount === 1 ? "" : "s"}</span>
            <span className="text-gray-300">•</span>
            <span>{last}</span>
        </div>
    );
}

/* ---------------- Timeline (Gantt) Component (FIXED) ---------------- */
function Timeline({ tasks, selectedTaskId, onSelectTask }) {
    const totalDays = 30;

    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-base font-semibold">Timeline</div>
                    <div className="text-sm text-gray-500 mt-1">
                        30-day project schedule (Gantt)
                    </div>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    {tasks.length} Tasks
                </span>
            </div>

            {/* Day scale */}
            <div className="mt-4 flex justify-between text-xs text-gray-500">
                <span>Day 1</span>
                <span>Day 10</span>
                <span>Day 20</span>
                <span>Day 30</span>
            </div>

            {/* Timeline rows */}
            <div className="mt-4 space-y-3">
                {tasks.map((task) => {
                    let start = Number(task.startDay ?? 1);
                    let end = Number(task.endDay ?? start);

                    // fix invalid ranges
                    if (start < 1) start = 1;
                    if (end < start) end = start;
                    if (end > totalDays) end = totalDays;

                    const leftPct = ((start - 1) / totalDays) * 100;
                    const widthPct = ((end - start + 1) / totalDays) * 100;

                    return (
                        <button
                            key={task.id}
                            onClick={() => onSelectTask(task.id)}
                            className={cn(
                                "w-full rounded-xl border p-3 text-left hover:bg-gray-50 transition",
                                selectedTaskId === task.id ? "border-gray-500 bg-gray-50" : ""
                            )}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-sm font-semibold truncate">{task.title}</div>
                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                    {start} → {end}
                                </div>
                            </div>

                            <div className="mt-2 h-3 w-full rounded-full bg-gray-200 relative overflow-hidden">
                                <div
                                    className="absolute top-0 h-3 rounded-full bg-black"
                                    style={{
                                        left: `${leftPct}%`,
                                        width: `${widthPct}%`,
                                    }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ---------------- Upload Dialog ---------------- */
function UploadDialog({ open, onClose, task, onAddMockUpload }) {
    const [fileName, setFileName] = useState("Design_Notes.pdf");
    const [uploadedBy, setUploadedBy] = useState("Student");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">Upload documentation</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                    {task ? (
                        <>
                            Task: <span className="font-medium">{task.title}</span>
                        </>
                    ) : (
                        "Select a task first."
                    )}
                </div>

                {task && (
                    <div className="mt-4 space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">
                                File name (mock)
                            </label>
                            <input
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                className="w-full rounded-xl border px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">
                                Uploaded by
                            </label>
                            <input
                                value={uploadedBy}
                                onChange={(e) => setUploadedBy(e.target.value)}
                                className="w-full rounded-xl border px-3 py-2 text-sm"
                            />
                        </div>

                        <button
                            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                            onClick={() => {
                                const ext = (fileName.split(".").pop() || "").toLowerCase();

                                const type =
                                    ext === "pdf"
                                        ? "pdf"
                                        : ext === "doc" || ext === "docx"
                                            ? "doc"
                                            : ext === "zip"
                                                ? "zip"
                                                : ext === "png" || ext === "jpg" || ext === "jpeg"
                                                    ? "image"
                                                    : "other";

                                onAddMockUpload(task.id, {
                                    id: makeId("upload"),
                                    name: fileName.trim() || "Untitled_File",
                                    type,
                                    size: "—",
                                    uploadedBy: uploadedBy.trim() || "Student",
                                    uploadedAt: "Just now",
                                });
                            }}
                        >
                            + Add Upload
                        </button>

                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------------- Create Task Dialog ---------------- */
function CreateTaskDialog({ open, onClose, onCreate }) {
    const [title, setTitle] = useState("");
    const [assignee, setAssignee] = useState("Student");
    const [startDay, setStartDay] = useState(1);
    const [endDay, setEndDay] = useState(5);

    if (!open) return null;

    const handleSubmit = () => {
        if (!title.trim()) {
            alert("Please enter a task title");
            return;
        }
        onCreate({
            title,
            assignee,
            startDay: Number(startDay),
            endDay: Number(endDay),
            status: "Not Started",
            progressPct: 0,
            mentorComment: "",
            lastUpdatedAt: "Just now"
        });
        // Reset form
        setTitle("");
        setStartDay(1);
        setEndDay(5);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                <h2 className="text-lg font-semibold mb-4">Create New Task</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                        <input
                            className="w-full rounded-xl border px-3 py-2 text-sm"
                            placeholder="e.g. Research Phase 1"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                        <input
                            className="w-full rounded-xl border px-3 py-2 text-sm"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Day</label>
                            <input
                                type="number"
                                min="1" max="30"
                                className="w-full rounded-xl border px-3 py-2 text-sm"
                                value={startDay}
                                onChange={(e) => setStartDay(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Day</label>
                            <input
                                type="number"
                                min="1" max="30"
                                className="w-full rounded-xl border px-3 py-2 text-sm"
                                value={endDay}
                                onChange={(e) => setEndDay(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Mentor Review Panel ---------------- */
function ReviewPanel({ task, onClose, onUpdateTask, onOpenUpload }) {
    const [comment, setComment] = useState(task.mentorComment || "");

    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-base font-semibold">Mentor Review</div>
                    <div className="mt-1 text-sm text-gray-500">
                        {task.title} • {task.assignee}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="rounded-xl px-3 py-1 text-sm hover:bg-gray-100"
                >
                    Close
                </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                {statusBadge(task.status)}
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    Updated: {task.lastUpdatedAt}
                </span>
            </div>

            <div className="mt-4 space-y-2">
                <div className="text-xs font-medium text-gray-700">Update status</div>
                <select
                    value={task.status}
                    onChange={(e) => onUpdateTask(task.id, { status: e.target.value })}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                >
                    {TASK_STATUS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4 space-y-2">
                <div className="text-xs font-medium text-gray-700">Mentor comment</div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full min-h-[120px] rounded-xl border px-3 py-2 text-sm"
                    placeholder="Write feedback for the student..."
                />

                <div className="flex flex-wrap gap-2">
                    <button
                        className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                        onClick={() =>
                            onUpdateTask(task.id, {
                                mentorComment: comment,
                                lastUpdatedAt: "Just now",
                            })
                        }
                    >
                        Save Comment
                    </button>

                    <button
                        className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={() =>
                            onUpdateTask(task.id, {
                                status: "Needs Revision",
                                mentorComment: comment || "Please revise and re-submit.",
                                lastUpdatedAt: "Just now",
                            })
                        }
                    >
                        Request Changes
                    </button>

                    <button
                        className="rounded-xl bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
                        onClick={() =>
                            onUpdateTask(task.id, {
                                status: "Approved",
                                progressPct: 100,
                                lastUpdatedAt: "Just now",
                            })
                        }
                    >
                        Approve
                    </button>

                    <button
                        className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={onOpenUpload}
                    >
                        Upload file
                    </button>
                </div>
            </div>

            <div className="mt-5 border-t pt-4">
                <div className="text-sm font-semibold">Uploads</div>

                {task.uploads.length === 0 ? (
                    <div className="mt-2 text-sm text-gray-500">No files uploaded yet.</div>
                ) : (
                    <div className="mt-3 space-y-2">
                        {task.uploads.map((f) => (
                            <div
                                key={f.id}
                                className="flex items-center justify-between gap-3 rounded-xl border p-3"
                            >
                                <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">{f.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {f.size} • {f.uploadedBy} • {f.uploadedAt}
                                    </div>
                                </div>

                                <button className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50">
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------------- Task Row ---------------- */
function TaskRow({ task, isSelected, onSelect, onOpenUpload }) {
    return (
        <div
            onClick={onSelect}
            className={cn(
                "rounded-2xl border bg-white p-4 transition cursor-pointer",
                isSelected ? "border-gray-300 shadow-sm" : "hover:bg-gray-50"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{task.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        Assignee: <span className="font-medium">{task.assignee}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        {statusBadge(task.status)}
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                            Updated: {task.lastUpdatedAt}
                        </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                        <TaskUploadSummary task={task} />
                        <ProgressPill pct={task.progressPct} />
                    </div>
                </div>

                <button
                    type="button"
                    className="shrink-0 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenUpload();
                    }}
                >
                    Upload
                </button>
            </div>
        </div>
    );
}

/* ---------------- Seed Data (Removed) ---------------- */
const seedTasks = [];

/* ---------------- Main Page ---------------- */
export default function CalendarPage() {
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [tasks, setTasks] = useState([]);

    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [openUpload, setOpenUpload] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    // Auth state
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        loadTasks();
    }, []);

    const loadTasks = () => {
        CalendarService.getAllCalendarTasks()
            .then((response) => {
                // Ensure uploads array exists for the UI to work, even if not in DB
                const data = response.data.map(t => ({ ...t, uploads: t.uploads || [] }));
                setTasks(data);
                if (data.length > 0 && !selectedTaskId) {
                    setSelectedTaskId(data[0].id);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const isMentor = currentUser && currentUser.roles && currentUser.roles.includes("MENTOR");

    const selectedTask = useMemo(
        () => tasks.find((t) => t.id === selectedTaskId) || null,
        [tasks, selectedTaskId]
    );

    const filteredTasks = useMemo(() => {
        return tasks
            .filter((t) =>
                filterStatus === "All" ? true : t.status === filterStatus
            )
            .filter((t) => {
                const q = search.trim().toLowerCase();
                if (!q) return true;
                return (
                    t.title.toLowerCase().includes(q) ||
                    t.assignee.toLowerCase().includes(q)
                );
            });
    }, [tasks, filterStatus, search]);

    const updateTask = (taskId, patch) => {
        // Optimistic update
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
        );

        // Call API
        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (taskToUpdate) {
            CalendarService.updateCalendarTask(taskId, { ...taskToUpdate, ...patch })
                .then(response => {
                    // Optional: reload or sync state
                })
                .catch(e => console.error(e));
        }
    };

    const handleCreateTask = (newTaskData) => {
        CalendarService.createCalendarTask(newTaskData)
            .then((response) => {
                const created = { ...response.data, uploads: [] };
                setTasks([...tasks, created]);
                setSelectedTaskId(created.id);
                setOpenCreate(false);
            })
            .catch(e => {
                console.error(e);
                alert("Failed to create task. Please ensure the backend is running.");
            });
    };

    // Mock upload stays local for now as DB doesn't support it yet
    const addMockUpload = (taskId, file) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        uploads: [file, ...t.uploads],
                        status: t.status === "Not Started" ? "In Progress" : t.status,
                        lastUpdatedAt: "Just now",
                    }
                    : t
            )
        );
    };

    return (
        <div className="min-h-screen w-full bg-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="text-lg font-semibold leading-tight">
                                Calendar Timeline Page
                            </div>
                            <div className="text-sm text-gray-500">
                                Task Timeline (Gantt) • Uploads • Mentor Review
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {isMentor && (
                                <button
                                    onClick={() => setOpenCreate(true)}
                                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                                >
                                    + New Task
                                </button>
                            )}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="rounded-xl border px-3 py-2 text-sm"
                            >
                                <option value="All">All Tasks</option>
                                {TASK_STATUS.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full md:max-w-md rounded-xl border px-3 py-2 text-sm"
                        />

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            Showing{" "}
                            <span className="font-medium text-gray-900">
                                {filteredTasks.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-gray-900">{tasks.length}</span>{" "}
                            tasks
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto max-w-6xl px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Task list */}
                    <div className="lg:col-span-4 space-y-3">
                        {filteredTasks.map((t) => (
                            <TaskRow
                                key={t.id}
                                task={t}
                                isSelected={t.id === selectedTaskId}
                                onSelect={() => setSelectedTaskId(t.id)}
                                onOpenUpload={() => {
                                    setSelectedTaskId(t.id);
                                    setOpenUpload(true);
                                }}
                            />
                        ))}
                    </div>

                    {/* Timeline */}
                    <div className="lg:col-span-4">
                        <Timeline
                            tasks={filteredTasks}
                            selectedTaskId={selectedTaskId}
                            onSelectTask={(id) => setSelectedTaskId(id)}
                        />
                    </div>

                    {/* Mentor Review */}
                    <div className="lg:col-span-4">
                        {selectedTask ? (
                            <ReviewPanel
                                task={selectedTask}
                                onClose={() => setSelectedTaskId("")}
                                onUpdateTask={updateTask}
                                onOpenUpload={() => setOpenUpload(true)}
                            />
                        ) : (
                            <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
                                Select a task to review uploads and give mentor feedback.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload dialog */}
            <UploadDialog
                open={openUpload}
                onClose={() => setOpenUpload(false)}
                task={selectedTask}
                onAddMockUpload={addMockUpload}
            />

            {/* Create Task Dialog (conditionally rendered or just hidden by trigger access) */}
            {isMentor && (
                <CreateTaskDialog
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    onCreate={handleCreateTask}
                />
            )}
        </div>
    );
}
