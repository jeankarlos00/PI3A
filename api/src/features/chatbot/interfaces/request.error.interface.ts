import { Request } from "express";

export default interface RequestWithError extends Request{
    error: string;
}