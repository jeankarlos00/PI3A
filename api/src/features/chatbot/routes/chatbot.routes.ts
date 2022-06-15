import express, { Router } from "express";
import ChatbotController from "../controller/chatbot.controller";
import ChatbotAuthMiddleware from "../middlewares/chatbot.auth.middleware";
import ChatbotAuth from "../interfaces/chatbot.auth.interface";
import ChatbotValidationMiddleware from "../middlewares/chatbot.validation.middleware";
import ChatbotValidation from "../interfaces/chatbot.validation.interface";
import { DataSource } from "typeorm";
import MqttServer from "../../../features/mqtt/mqtt.server";

export default class ChatbotRoutes {
    public path : string = '/chatbot';
    public router : Router = express.Router();
    private _controller: ChatbotController;
    private _chatbotAuthMiddleware: ChatbotAuth = new ChatbotAuthMiddleware();
    private _chatbotValidationMiddleware: ChatbotValidation = new ChatbotValidationMiddleware();

    constructor(appDataSource: DataSource,mqttServer:MqttServer){
        this._controller = new ChatbotController(appDataSource,mqttServer);
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.post(`${this.path}/send/text`,
            this._chatbotValidationMiddleware.chatbotMessage(),
            this._chatbotAuthMiddleware.verifyAccessToken(),
            this._controller.sendText.bind(this._controller));

        this.router.get(
            `${this.path}/:id`,
            this._chatbotAuthMiddleware.verifyAccessToken(),
            this._controller.getAllMessagesSession.bind(this._controller));

        this.router.delete(
            `${this.path}/:id`,
            this._chatbotAuthMiddleware.verifyAccessToken(),
            this._controller.deleteAllMessagesBySessionId.bind(this._controller));
        this.router.get(
                `${this.path}`,
                this._chatbotAuthMiddleware.verifyAccessToken(),
                this._controller.getAllChatbotSessions.bind(this._controller));
        
    }
}