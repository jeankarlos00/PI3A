import Controller from "../../../controllers/controller";
import HttpException from "../../../exceptions/http.exceptions";
import { Response } from "express";
import RequestWithToken from "../interfaces/request.token.interface";
import ChatbotMessageDTO from "../dto/chatbot.message.request.dto";
import HttpData from "../interfaces/http.data.interface";

export default class ChatbotController extends Controller{

    public async sendText(request: RequestWithToken, response: Response){
        if (request.error){
            const httpData: HttpData = { ok: false, message: request.error};
            response.status(400).send(httpData);
        } else {
            try {
                const text: ChatbotMessageDTO = request.body;
                const clientDTO = await this.clientService.getClientBySessionId(request.dataStoreToken.id);
                const chatbotMessageDTO = await this.chatbotService.sendText(text, clientDTO);
                response.status(200).send({ok: true, chatbotMessageDTO});                
            } catch (error) {
                if(error instanceof(HttpException)){
                    response.status(error.status).send(error.data);
                  }else{
                    const httpData: HttpData = { ok: false, message: error.message};
                    response.status(500).send(httpData);
                  }
            }
        }
    }
    public async getAllChatbotSessions(request: RequestWithToken, response: Response){
      if (request.error) {
        const httpData: HttpData = { ok: false, message: request.error};
        response.status(400).send(httpData);
      }else{
        try {
          const dataStoreToken = request.dataStoreToken;
          const clientDTO = await this.clientService.getClientBySessionId(dataStoreToken.id);
          const chatbotSessionsDTO = await this.chatbotService.getAllSessions(clientDTO);
          response.status(200).send({ok: true,chatbotSessionsDTO});
        } catch (error) {
          if(error instanceof(HttpException)){
            response.status(error.status).send(error.data);
          }else{
            const httpData: HttpData = { ok: false, message: error.message};
            response.status(500).send(httpData);
          }
        
        }
      }
    }
    public async getAllMessagesSession(request: RequestWithToken, response: Response){
        if (request.error) {
          const httpData: HttpData = { ok: false, message: request.error};
          response.status(400).send(httpData);
        }else{
          try {
            const dataStoreToken = request.dataStoreToken;
            const clientDTO = await this.clientService.getClientBySessionId(dataStoreToken.id);
            const chatbotMessage = await this.chatbotService.getAllMessagesSession(clientDTO, request.params.id);
            response.status(200).send({ok: true,chatbotMessage});
          } catch (error) {
            if(error instanceof(HttpException)){
              response.status(error.status).send(error.data);
            }else{
              const httpData: HttpData = { ok: false, message: error.message};
              response.status(500).send(httpData);
            }
          
          }
        }
      }

      public async deleteAllMessagesBySessionId(request: RequestWithToken, response: Response){
        if (request.error) {
          const httpData: HttpData = { ok: false, message: request.error};
          response.status(400).send(httpData);
        }else{
          try {
            const dataStoreToken = request.dataStoreToken;
            const clientDTO = await this.clientService.getClientBySessionId(dataStoreToken.id);
            const result = await this.chatbotService.deleteAllMessagesBySessionId(clientDTO, request.params.id);
            response.status(200).send({ok: result});
          } catch (error) {
            if(error instanceof(HttpException)){
              response.status(error.status).send(error.data);
            }else{
              const httpData: HttpData = { ok: false, message: error.message};
              response.status(500).send(httpData);
            }
          
          }
        }
      }
}