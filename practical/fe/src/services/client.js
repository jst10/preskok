import axios from "axios";

const client = axios.create({
    baseURL: "http://127.0.0.1:3000/",
    timeout: 8000,
    headers: {"Content-Type": "application/json"}
});

export default client;
