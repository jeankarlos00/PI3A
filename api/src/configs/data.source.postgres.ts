import { DataSource } from "typeorm";
import validateEnv from "../utils/validateEnv";
import Device from "../features/device/entities/device.entity";
import Measure from "../features/device/entities/measure.entity";
import TypeMeasure from "../features/device/entities/type.measure.entity";
import DeviceLocalization from "../features/device/entities/device.localization.entity";
import DevicePreferences from "../features/device/entities/device.preferences.entity";
import ChatbotSession from "../features/chatbot/entities/chatbot.session.entity";
import ChatbotMessage from "../features/chatbot/entities/chatbot.message.entity";
import ChatbotTypeMessage from "../features/chatbot/entities/chatbot.type.message.entity";
import Credentials from "../features/client/entities/credentials.entity";
import Client from "../features/client/entities/client.entity";
import Person from "../features/client/entities/person.entity";
import Session from "../features/auth/entities/session.entity";
import TypeSession from "../features/auth/entities/type.session.entity";

export default class PostgresDataSource{
    _appDataSource: DataSource;
    constructor() {
        this.initialize();
        this.initializeDatabase();
    }
    private initialize(){
        this._appDataSource= new DataSource({
            type: "postgres",
            url: validateEnv.DATABASE_URL,
            synchronize: true,
            logging: ["query"],
            entities: [
                Credentials,Client,Person,Session,
                Device,Measure,TypeMeasure,TypeSession,
                DeviceLocalization, DevicePreferences,
                ChatbotSession,ChatbotMessage, ChatbotTypeMessage
              ],
            subscribers: [],
            extra: {
                ssl: {
                  rejectUnauthorized: false
                }
            }
        });
    }
    private async initializeDatabase(){
        await this._appDataSource.initialize();
    }
}