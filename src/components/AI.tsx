import api from "../lib/api";

export async function AskAi(message:string) {
    const response = await api.post("/ai", {message});
    return response.data.reply;
}