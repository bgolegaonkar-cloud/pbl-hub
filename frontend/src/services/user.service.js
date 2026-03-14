import api from "./api";

const getProfile = () => {
    return api.get("/users/me");
};

const updateProfile = (data) => {
    return api.put("/users/me", data);
};

const UserService = {
    getProfile,
    updateProfile,
};

export default UserService;
