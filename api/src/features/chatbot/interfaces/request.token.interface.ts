import DataStoreToken from "../interfaces/data.store.token.interface";
import RequestWithError from "./request.error.interface";

export default interface RequestWithToken extends RequestWithError {
    dataStoreToken: DataStoreToken;
}