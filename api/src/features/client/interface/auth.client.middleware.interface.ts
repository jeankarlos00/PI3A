import { RequestHandler } from "express";

export default interface AuthClientMiddleware {
    verifyAccessToken(): RequestHandler
}