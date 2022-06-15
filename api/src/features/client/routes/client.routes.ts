import express, { Router } from "express";
import AuthJwtMiddleware from "../middleware/auth.client.jwt.middleware";
import { DataSource } from "typeorm";
import ClientController from "../controller/client.controller";
import AuthMiddleware from "../interface/auth.client.middleware.interface";
import MqttServer from "features/mqtt/mqtt.server";


export default class ClientRoutes {
    public path : string = '/client';
    public router : Router = express.Router();
    private _controller;
    private _authMiddleware: AuthMiddleware = new AuthJwtMiddleware();;

    constructor(appDataSource: DataSource,mqttServer: MqttServer){
        this._controller = new ClientController(appDataSource,mqttServer);
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            this._authMiddleware.verifyAccessToken(),
            this._controller.getClient.bind(this._controller)
            );
    }

}