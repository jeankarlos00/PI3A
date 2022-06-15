import ChatbotMessage from "../entities/chatbot.message.entity";
import ChatbotSession from "../entities/chatbot.session.entity";

export default interface ChatbotDatabase{
    findChatbotSessionBySessionId(id: string): Promise<ChatbotSession>;
    findAllChatbotSessionByClientId(id: string): Promise<ChatbotSession[]>;
    findChatbotMessagesBySessionId(id: string): Promise<ChatbotMessage[]>;
    findChatbotSessionById(id: string): Promise<ChatbotSession>;

    insertChatbotSession(chatbotSession: ChatbotSession): Promise<ChatbotSession>;
    insertChatbotMessage(chatbotMessage: ChatbotMessage): Promise<ChatbotMessage>;

    deleteAllMessagesBySessionId(sessionId: string): Promise<boolean>;
}