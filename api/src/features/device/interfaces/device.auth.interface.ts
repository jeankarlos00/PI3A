import { RequestHandler } from "express";

export default interface DeviceAuth{
    verifyAccessToken(): RequestHandler;
}