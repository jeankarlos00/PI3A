import DevicePreferencesDTO from "../device/dto/device.preferences.dto";
import client  from "../../configs/mqtt.config";
import Measure from "../../features/device/entities/measure.entity";
import Device from "../../features/device/entities/device.entity";
import TypeMeasure from "../../features/device/entities/type.measure.entity";
import Client from "../../features/client/entities/client.entity";
import { plainToInstance } from "class-transformer";
import { DataSource } from "typeorm";
import MqttDatabase from "./interfaces/mqtt.database.interface";
import MqttPostgresDatabase from "./database/mqtt.postgres.database";
import DeviceLocalization from "../../features/device/entities/device.localization.entity";

export default class MqttServer {
    private _mqqtClient = client;
    private _database: MqttDatabase;
    constructor(_appDataSource: DataSource){
        this._database = new MqttPostgresDatabase(_appDataSource);
        this.start();
        this.setup();
    }
    private async setup(){
        this._mqqtClient.on("connect",()=>{
            console.log("Mqtt Connected!");
        });
        this._mqqtClient.subscribe("device");
        this._mqqtClient.subscribe("localization");
        this._mqqtClient.subscribe("measure");    
    }
    private async start(){
        try {
            this._mqqtClient.on("message",async (topic,payload)=>{
                var message: any;
                try {
                    message = JSON.parse(payload.toString());
                } catch (error) {
                    console.log("MQTT WRONG JSON: "+error.message)
                }
                switch (topic) {
                    case "device":
                        this.saveDevice(message);
                    break;
                    case "measure":
                        this.addMeasure(message);
                    break;
                    case "localization":
                        this.saveLocalization(message);
                    break;
                    default:
                        
                        break;
                }
            }
        );
        } catch (error) {
            console.log("MQTT ERROR: "+error.message);
        }
    }
    private async saveLocalization(message: any){
        var localization: DeviceLocalization;
        if (message != null) {
            try {
                localization = this.plaintToDeviceLocalization(message["deviceLocalizationDTO"]);
                console.log(localization);
            } catch (error) {
                console.log("MQTT ERROR: ",error.message);
            }
            if (localization) {
                try {
                    const old_localization = await this._database.findDeviceLocalizationByDeviceId(localization.device.id);
                    if(old_localization){
                        localization.id = old_localization.id;
                        await this._database.updateDeviceLocalization(localization);
                    }else{
                        await this._database.insertDeviceLocalization(localization);
                    }
                } catch (error) {
                    console.log("MQTT DATABASE ERROR: ",error.message);
                }
            }else{
                console.log("MQTT MEASURE NULL!");
            }
        }
    }
    private async addMeasure(message: any){
        var measure: Measure;
        if (message != null) {
            try {
                measure = this.plainToMeasure(message["measureDTO"]);
                console.log(measure);
            } catch (error) {
                console.log("MQTT ERROR: ",error.message);
            }
            if (measure) {
                try {
                    await this._database.insertMeasure(measure);
                } catch (error) {
                    console.log("MQTT DATABASE ERROR: ",error.message);
                }
            }else{
                console.log("MQTT MEASURE NULL!");
            }
        }
    }
    private async saveDevice(message: any){
        var device: Device;
        if (message != null) {
            try {
                device = this.plainToDevice(message["deviceDTO"]);
                console.log(device);
            } catch (error) {
                console.log("MQTT ERROR: ",error.message);
            }
            if (device) {
                try {
                    await this._database.saveDevice(device);
                } catch (error) {
                    console.log("MQTT DATABASE ERROR: ",error.message);
                }
            }else{
                console.log("MQTT DEVICE NULL!");
            }
        }
    }
    private plaintToDeviceLocalization(message: any){
        const deviceLocalization = new DeviceLocalization();
        try {
            deviceLocalization.device = plainToInstance(Device,message["deviceDTO"]);
            deviceLocalization.latitude = message["latitude"];
            deviceLocalization.longitude = message["longitude"];
        } catch (error) {
            throw new Error("Wrong Type Of Message Recived!"+ error.message);
        }
        return deviceLocalization
    }
    private plainToDevice(message: any){
        const device = new Device();
        try {
            device.client = plainToInstance(Client,message["clientDTO"]);
            device.id = message["id"].toString();
            device.name = message["name"].toString();
            return device;
        } catch (error) {
            throw new Error("Wrong Type Of Message Recived!"+ error.message);
        }
    }
    public postDevicePreferences(deviceId: string ,devicePreferencesDTO: DevicePreferencesDTO) {
        this._mqqtClient.publish(`${deviceId}/settings`,JSON.stringify(devicePreferencesDTO));
    }
    private plainToMeasure(message: any): Measure {
        const measure = new Measure();
        const type = new TypeMeasure();
        const device = new Device();
        try {
            type.id = message["typeDTO"]["id"].toString();
            device.id = message["deviceDTO"]["id"].toString();
            measure.date = new Date(message["date"]);
            measure.value = message["value"].toString();
            measure.device = device;
            measure.type = type;
        } catch (error) {
            throw new Error("Wrong Type Of Message Recived!"+ error.message);
        }

        return measure;
    }
}