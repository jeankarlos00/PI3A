import { RequestHandler } from "express";

export default interface AuthValidation{
    register(): RequestHandler;
    login(): RequestHandler;
    email(): RequestHandler;
    password(): RequestHandler;
}