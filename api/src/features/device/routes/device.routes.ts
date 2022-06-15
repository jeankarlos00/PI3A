import express, { Router } from "express";
import DeviceController from "../controller/device.controller";
import { DataSource } from "typeorm";
import DeviceAuth from "../interfaces/device.auth.interface";
import DeviceAuthMiddleware from "../middlewares/device.auth.middleware";
import DeviceValidation from "../interfaces/device.validation.interface";
import DeviceValidationMiddleware from "../middlewares/device.validation.middleware";
import MqttServer from "../../../features/mqtt/mqtt.server";


export default class DeviceRoutes {
    public path : string = '/device';
    public router : Router = express.Router();
    private _controller: DeviceController;
    private _validationMiddleware: DeviceValidation = new DeviceValidationMiddleware();
    private _authMiddleware: DeviceAuth = new DeviceAuthMiddleware();

    constructor(appDataSource: DataSource,mqttServer: MqttServer){
        this._controller = new DeviceController(appDataSource,mqttServer);
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            this._validationMiddleware.device(),
            this._authMiddleware.verifyAccessToken(),
            this._controller.addDevice.bind(this._controller)
            );
        this.router.get(
            `${this.path}`,
            this._authMiddleware.verifyAccessToken(),
            this._controller.getDevices.bind(this._controller)
            );
        this.router.post(
            `${this.path}/measure`,
            this._authMiddleware.verifyAccessToken(),
            this._validationMiddleware.measureQuery(),
            this._controller.getMeasures.bind(this._controller)
            );
        this.router.post(
            `${this.path}/preferences`,
            this._authMiddleware.verifyAccessToken(),
            this._validationMiddleware.preferences(),
            this._controller.addPreferences.bind(this._controller)
            );
        this.router.get(
            `${this.path}/preferences`,
            this._authMiddleware.verifyAccessToken(),
            this._validationMiddleware.device(),
            this._controller.getPreferences.bind(this._controller)
            );
        this.router.post(
            `${this.path}/localization`,
            this._authMiddleware.verifyAccessToken(),
            this._validationMiddleware.localization(),
            this._controller.addLocatization.bind(this._controller)
            );
        this.router.get(
            `${this.path}/localization`,
            this._authMiddleware.verifyAccessToken(),
            this._validationMiddleware.device(),
            this._controller.getLocalization.bind(this._controller)
            );
        this.router.get(
            `${this.path}/configs`,
            this._authMiddleware.verifyAccessToken(),
            this._controller.getConfigs.bind(this._controller)
            );
    }

}