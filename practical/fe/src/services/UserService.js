import client from "@/services/client";

export const UserService = {
    getUsers() {
        return client.get(`users/`).then(response=>response.data);
    },
    createUser(data) {
        return client.post(`users/`, data).then(response=>response.data);
    },

    deleteUser(id) {
        return client.delete(`/users/${id}/`);
    }
};
