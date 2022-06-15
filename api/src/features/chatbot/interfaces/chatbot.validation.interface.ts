import { RequestHandler } from "express";

export default interface ChatbotValidation{
    chatbotMessage(): RequestHandler;
}