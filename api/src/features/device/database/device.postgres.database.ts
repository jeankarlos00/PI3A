import Device from "../entities/device.entity";
import DeviceLocalization from "../entities/device.localization.entity";
import devicePreferencesEntity from "../entities/device.preferences.entity";
import DevicePreferences from "../entities/device.preferences.entity";
import Measure from "../entities/measure.entity";
import Session from "../../../features/auth/entities/session.entity";
import DatabaseHttpException from "../../../exceptions/database.http.exception";
import { Between, DataSource } from "typeorm";
import DeviceDatabase from "../interfaces/device.database.interface";
import Client from "../../../features/client/entities/client.entity";

export default class DevicePostgresDatabase implements DeviceDatabase{
    private _appDataSource: DataSource;

    constructor(dataSource: DataSource){
        this._appDataSource = dataSource;
    }

    public async findDeviceLocalizationByDevice(device: Device): Promise<DeviceLocalization> {
        try {
            return await this._appDataSource.manager.findOne(
                DeviceLocalization,
                {where: {
                    device: device 
                }
            });
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }
    public async findDevicePreferencesByDevice(device: Device): Promise<DevicePreferences> {
        try {
            return await this._appDataSource.manager.findOne(
                DevicePreferences,
                {where: {
                    device: device 
                }
            });
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }
    public async findMeasuresByDevice(device: Device, start: Date, end: Date): Promise<Measure[]> {
        try {
            return await this._appDataSource.manager.find(
                Measure,
                {where: {
                    device: device,
                    date: Between(end,start) 
                },
                relations: ['type'],
                order: {
                    date: "ASC"
                }
            });
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }

    public async findDevicesBySessionId(sessionId: string): Promise<Device[]> {
        try {
            const session = new Session();
            session.id = sessionId;
            const client = await this._appDataSource.manager.findOne(
                Client, {where: {sessions: session}, 
                relations: ["devices"]});
            if (client) {
                return client.devices; 
            }
            return null;
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }
    public async findDevicesByClient(client: Client): Promise<Device[]> {
        try {
            const devices = await this._appDataSource.manager.find(
                Device,{where:{client: client}});
            return devices; 
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }
    public async findDeviceById(id: string): Promise<Device> {
        try {
            const device = await this._appDataSource.manager.findOne(
                Device,{where:{id: id}});
            return device; 
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
    public async insertDevicePreferences(devicePreferences: devicePreferencesEntity): Promise<devicePreferencesEntity> {
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
    public async insertDevice(device: Device): Promise<Device> {
        try {       
            return await this._appDataSource.manager.save(device);
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }   
}