import AuthJwt from "../features/jwt/auth/auth.jwt";
import Crypto from "crypto";
import TypeSession from "../features/auth/entities/type.session.entity";
import ChatbotTypeMessage from "../features/chatbot/entities/chatbot.type.message.entity";
import Email from "../features/email/interfaces/email.interface";
import NodeMail from "../features/email/node.email";
import AuthDatabase from "../features/auth/interfaces/auth.database.interface";
import AuthPostgresDatabase from "../features/auth/database/auth.postgres.database";
import { DataSource } from "typeorm";
import DeviceDatabase from "../features/device/interfaces/device.database.interface";
import ClientDatabase from "../features/client/interface/client.database.interface";
import DevicePostgresDatabase from "../features/device/database/device.postgres.database";
import ClientPostgresDatabase from "../features/client/database/client.postgres.database";
import ChatbotPostgresDatabase from "../features/chatbot/database/chatbot.postgres.database";
import ChatbotDatabase from "../features/chatbot/interfaces/chatbot.database.interface";
export default class Services {
    private _jwt = new AuthJwt();
    private _email: Email = new NodeMail();;
    _authDatabase: AuthDatabase;
    _deviceDatabase: DeviceDatabase;
    _clientDatabase: ClientDatabase;
    _chatbotDatabase: ChatbotDatabase
    constructor(appDataSource: DataSource){
        this._authDatabase = new AuthPostgresDatabase(appDataSource);
        this._deviceDatabase = new DevicePostgresDatabase(appDataSource);
        this._clientDatabase = new ClientPostgresDatabase(appDataSource);
        this._chatbotDatabase = new ChatbotPostgresDatabase(appDataSource);
    }

    public get jwt(){
        return this._jwt;
    }

    public get email(){
        return this._email;
    }
    public generateSessionId(): string{
        const buffer = Crypto.randomBytes(64);
        return buffer.toString('hex');
      }
    public getLoginTypesession(){
        const typeSession = new TypeSession();
        typeSession.id ='1';
        typeSession.type = 'LOGIN';
        return typeSession;
    }
    public getRefreshTokenTypesession(){
        const typeSession = new TypeSession();
        typeSession.id ='3';
        typeSession.type = 'REFRESH_TOKEN';
        return typeSession;
    }
    public getResetPasswordTypesession(){
        const typeSession = new TypeSession();
        typeSession.id ='2';
        typeSession.type = 'RESET_PASSWORD';
        return typeSession;
    }
    public getClientTypeMessage(){
        const typeSession = new ChatbotTypeMessage();
        typeSession.id ='1';
        typeSession.type = 'CLIENT_MESSAGE';
        return typeSession;
    }
    public getBotTypeMessage(){
        const typeSession = new ChatbotTypeMessage();
        typeSession.id ='2';
        typeSession.type = 'BOT_MESSAGE';
        return typeSession;
    }
}