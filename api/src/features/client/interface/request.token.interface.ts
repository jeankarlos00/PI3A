import { Request } from "express";
import DataStoreToken from "./data.store.token.interface";

export default interface RequestWithToken extends Request{
    dataStoreToken: DataStoreToken
    error: string
}