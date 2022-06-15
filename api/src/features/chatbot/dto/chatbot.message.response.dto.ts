import { IsDateString, MinLength, ValidateNested } from "class-validator";
import ChatbotTypeMessageDTO from "./chatbot.type.message.dto";

export default class ChatbotMessageResponseDTO {
    public sessionId?: string;
    
    public text?: string;

    public date?: string;

    public type?: ChatbotTypeMessageDTO;

    public suggestions?: string[];
}