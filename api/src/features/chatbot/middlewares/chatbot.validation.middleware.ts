import { transformAndValidate } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import ChatbotValidation from "../interfaces/chatbot.validation.interface";
import ChatbotMessageDTO from '../dto/chatbot.message.request.dto';
import { NextFunction, RequestHandler, Response } from "express";
import RequestWithError from "../interfaces/request.error.interface";

export default class ChatbotValidationMiddleware implements ChatbotValidation{

    public chatbotMessage(): RequestHandler {
        return async (request: RequestWithError, response: Response, next: NextFunction) => {
            let message: string;
            try {
                const chatbotMessage: ChatbotMessageDTO = request.body;
                await transformAndValidate(ChatbotMessageDTO,chatbotMessage);
            } catch (err) {
                message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
            }
            if(message){
                request.error = message;
            }
            next();
        }
    }
}