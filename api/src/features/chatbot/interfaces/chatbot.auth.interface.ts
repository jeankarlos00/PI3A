import { RequestHandler } from "express";

export default interface ChatbotAuth{
    verifyAccessToken(): RequestHandler;
}