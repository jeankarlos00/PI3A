import { RequestHandler } from "express";

export default interface Auth{
    verifyAccessToken(): RequestHandler;
    verifyPasswordReset(): RequestHandler;
    verifyRefreshToken(): RequestHandler;
}