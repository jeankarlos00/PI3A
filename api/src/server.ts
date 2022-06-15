import App from "./app";
import validateEnv from "./utils/validateEnv";
import HomeRoutes from "./features/home/routes/home.routes";
import AuthRoutes from "./features/auth/routes/auth.routes";
import 'reflect-metadata';
import 'es6-shim';
import ChatbotRoutes from "./features/chatbot/routes/chatbot.routes";
import { DataSource } from "typeorm";
import PostgresDataSource from "./configs/data.source.postgres";
import ClientRoutes from "./features/client/routes/client.routes";
import DeviceRoutes from "./features/device/routes/device.routes";
import MqttServer from "./features/mqtt/mqtt.server";


const _appDataSource: DataSource = new PostgresDataSource()._appDataSource;
const _mqttServer: MqttServer = new MqttServer(_appDataSource);


const app = new App(
    validateEnv.PORT,
    [
        new HomeRoutes(_appDataSource,_mqttServer),
        new AuthRoutes(_appDataSource,_mqttServer),
        new ClientRoutes(_appDataSource,_mqttServer),
        new DeviceRoutes(_appDataSource,_mqttServer),
        new ChatbotRoutes(_appDataSource,_mqttServer)
    ]
    );
    
app.listen();

