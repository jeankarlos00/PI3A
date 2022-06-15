import DatabaseHttpException from "../../../exceptions/database.http.exception";
import { DataSource } from "typeorm";
import MqttDatabase from "../interfaces/mqtt.database.interface";
import DeviceLocalization from "../../../features/device/entities/device.localization.entity";
import DevicePreferences from "../../../features/device/entities/device.preferences.entity";
import Measure from "../../../features/device/entities/measure.entity";
import Device from "../../../features/device/entities/device.entity";

export default class MqttPostgresDatabase implements MqttDatabase{
    private _appDataSource: DataSource;

    constructor(dataSource: DataSource){
        this._appDataSource = dataSource;
    }
    public async findDeviceLocalizationByDeviceId(deviceId: string): Promise<DeviceLocalization> {
        try {
            const device = new Device();
            device.id = deviceId;
            return await this._appDataSource.manager.findOne(DeviceLocalization,{where:{device}});
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        } 
    }
    public async insertDeviceLocalization(deviceLocalization: DeviceLocalization): Promise<DeviceLocalization> {
        try {
            return await this._appDataSource.manager.save(deviceLocalization);
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        } 
    }
    public async updateDeviceLocalization(deviceLocalization: DeviceLocalization): Promise<boolean> {
        try {
            await this._appDataSource.manager.update(DeviceLocalization,deviceLocalization.id,deviceLocalization);
            return true;
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        } 
    }
    public async saveDevicePreferences(devicePreferences: DevicePreferences): Promise<DevicePreferences> {
        try {
            return await this._appDataSource.manager.save(devicePreferences);
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        } 
    }
    public async insertMeasure(measure: Measure): Promise<Measure> {
        try {
            return await this._appDataSource.manager.save(measure);
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }
    public async saveDevice(device: Device): Promise<Device> {
        try {       
            return await this._appDataSource.manager.save(device);
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }   
}