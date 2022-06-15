import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import DataStoreToken from "../interfaces/data.store.token.interface";
import RequestWithToken from "../interfaces/request.token.interface";
import validateEnv from "../../../utils/validateEnv";
import ChatbotAuth from "../interfaces/chatbot.auth.interface";

export default class ChatbotAuthMiddleware implements ChatbotAuth{
    public verifyAccessToken(): RequestHandler {
        return async(request: RequestWithToken,response,next) => {
          let message: string;
          var token: string;
            try {
              const header = request.header("Authorization");
              token = header == null ? token : header.replace("Bearer ", "");
              token = request.body.token == null ? token : request.body.token;
              token = request.params['token'] == null ? token : request.params['token'];
              if (token) {
                const secret = validateEnv.JWT_SECRET;
                const dataStoredInToken = jwt.verify(token,secret) as DataStoreToken;
                if (dataStoredInToken.typeId == "1") {
                  request.dataStoreToken = dataStoredInToken;
                  next();
                  return;
                }else{
                  message = "Invalid Type of Token!"
                }
              }
            } catch (error) {
              message = error.message;
            }
            if (message) {
              request.error = message;
            }else{
              request.error = "Token Not Found!"
            }
            next();
        }
      }
}