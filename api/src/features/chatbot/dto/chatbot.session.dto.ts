import ChatbotMessageDTO from "./chatbot.message.dto";

export default class ChatbotSessionDTO {
    id?:  string;
    chatbotMessagesDTO?: ChatbotMessageDTO[];
}