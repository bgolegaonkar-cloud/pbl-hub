import api from "./api";

const getAllCalendarTasks = () => {
    return api.get("/calendar");
};

const createCalendarTask = (task) => {
    return api.post("/calendar", task);
};

const updateCalendarTask = (id, task) => {
    return api.put(`/calendar/${id}`, task);
};

const deleteCalendarTask = (id) => {
    return api.delete(`/calendar/${id}`);
};

const CalendarService = {
    getAllCalendarTasks,
    createCalendarTask,
    updateCalendarTask,
    deleteCalendarTask
};

export default CalendarService;
