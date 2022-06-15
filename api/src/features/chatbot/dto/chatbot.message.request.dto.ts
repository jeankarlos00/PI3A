import {IsDateString, MinLength } from "class-validator";

export default class ChatbotMessageRequestDTO {
    @MinLength(6)
    public sessionId?: string;
    
    @MinLength(1)
    public text?: string;

    @IsDateString()
    public date: string;
}