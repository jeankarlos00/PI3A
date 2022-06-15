import { RequestHandler } from "express";

export default interface DeviceValidation{
    device(): RequestHandler;
    measureQuery(): RequestHandler;
    preferences():  RequestHandler;
    localization():  RequestHandler;
    measureQuery(): RequestHandler;
}