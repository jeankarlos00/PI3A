import HomeController from "../controller/home.controller";
import express, { Router } from "express";
import { DataSource } from "typeorm";
import MqttServer from "../../../features/mqtt/mqtt.server";


export default class HomeRoutes {
    public path : string = '';
    public router : Router = express.Router();
    private _controller: HomeController;

    constructor(appDataSource: DataSource,mqttServer: MqttServer){
        this._controller = new HomeController(appDataSource,mqttServer);
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.get(this.path,this._controller.get.bind(this._controller));
    }

}