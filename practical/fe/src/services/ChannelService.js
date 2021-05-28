import client from "@/services/client";

export const ChannelService = {
    getChannelForUser(userId) {
        return client.get(`channels/?userId=${userId}`).then(response => response.data);
    },
};
