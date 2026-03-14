import api from "./api";

const getAllProjects = () => {
    return api.get("/projects");
};

const getProjectById = (id) => {
    return api.get(`/projects/${id}`);
};

const createProject = (project) => {
    return api.post("/projects", project);
};

const submitProject = (projectId, fileUrl) => {
    return api.post("/submissions", { projectId, fileUrl });
};

const getSubmissionsByProject = (projectId) => {
    return api.get(`/submissions/project/${projectId}`);
};

const gradeSubmission = (submissionId, feedback) => {
    return api.post(`/submissions/${submissionId}/feedback`, feedback);
};

const getMySubmissions = () => {
    return api.get("/submissions/my");
};

const getTasksByProject = (projectId) => {
    return api.get(`/tasks/project/${projectId}`);
};

const createTask = (task) => {
    return api.post("/tasks", task);
};

const updateTaskStatus = (taskId, status) => {
    return api.put(`/tasks/${taskId}/status`, { status });
};

const getReportStats = () => {
    return api.get("/reports/stats");
};

const ProjectService = {
    getAllProjects,
    getProjectById,
    createProject,
    submitProject,
    getSubmissionsByProject,
    gradeSubmission,
    getTasksByProject,
    createTask,
    updateTaskStatus,
    getMySubmissions,
    getReportStats
};

export default ProjectService;
