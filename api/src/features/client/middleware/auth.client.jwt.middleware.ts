import { RequestHandler } from "express";
import validateEnv from "../../../utils/validateEnv";
import RequestWithToken from "../interface/request.token.interface";
import jwt from "jsonwebtoken";
import DataStoreToken from "../interface/data.store.token.interface";
import AuthClientMiddleware from "../interface/auth.client.middleware.interface";

export default class AuthJwtClientMiddleware implements AuthClientMiddleware {
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