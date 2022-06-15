import DataStoreToken from "../interfaces/data.store.token.interface";
import TokenData from "../interfaces/token.data.interface";
import validateEnv from "../../../utils/validateEnv";
import jwt from "jsonwebtoken";
import Auth from "../../auth/interfaces/auth.interface";

export default class AuthJwt{
    private _secret: string = validateEnv.JWT_SECRET;
    private _expiresInRefresh: number = 60*60*24*30;
    private _expiresInAccess: number = 60*60;

    public createAccessToken(sessionId: string,typeId: string): TokenData {
      const iat: number = Math.floor(Date.now() / 1000);
        const dataStoredInToken: DataStoreToken = {
          id: sessionId,
          typeId: typeId, 
          iat: iat,
          expiresIn: this._expiresInAccess + iat
        };
        return {
            token: jwt.sign(dataStoredInToken, this._secret, {expiresIn:this._expiresInAccess} ),
            expiresIn: this._expiresInAccess + iat,
            type: typeId,
            iat: iat
          };
    
      }
    
    public createRefreshToken(id: string,typeId: string): TokenData {
      const iat: number = Math.floor(Date.now() / 1000);
        const dataStoredInToken: DataStoreToken = {
          id: id,
          typeId: typeId,
          iat: iat,
          expiresIn: iat + this._expiresInRefresh
        };
        return {
          token: jwt.sign(dataStoredInToken, this._secret, {expiresIn:this._expiresInRefresh} ),
          expiresIn: this._expiresInRefresh + iat,
          type: typeId,
          iat: iat
        };
      }
    
    
}