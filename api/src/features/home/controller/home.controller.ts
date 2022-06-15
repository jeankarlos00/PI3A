import { Request, Response } from "express";
import HomeService from "../service/home.service"
import Controller from "../../../controllers/controller";

export default class HomeController extends Controller{
    
    public async get(request: Request, response: Response){
        response.send(this.homeService.getHome());
    } 
}