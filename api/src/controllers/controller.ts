import AuthService from "../features/auth/service/auth.service";
import HomeService from "../features/home/service/home.service";
import DeviceService from "../features/device/services/device.service";
import ChatbotService from "../features/chatbot/service/chatbot.service";
import { DataSource } from "typeorm";
import ClientService from "../features/client/service/client.service";
import MqttServer from "../features/mqtt/mqtt.server";

export default class Controller{
    homeService: HomeService;
    clientService: ClientService;
    authService: AuthService;
    deviceService: DeviceService;
    chatbotService: ChatbotService;
    constructor(appDataSource: DataSource,mqttServer: MqttServer){
        this.homeService = new HomeService(appDataSource);
        this.clientService = new ClientService(appDataSource);
        this.authService = new AuthService(appDataSource);
        this.deviceService = new DeviceService(appDataSource,mqttServer);
        this.chatbotService = new ChatbotService(appDataSource);
    }
}