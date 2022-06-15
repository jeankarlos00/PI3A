import Services from "../../../services/services";
import bcrypt from "bcrypt"
import CredentialsDTO from "../../client/dto/credentials.dto";
import TokenData from "../../jwt/interfaces/token.data.interface";
import Session from "../entities/session.entity";
import EmailFoundHttpException from "../../../exceptions/email.found.http.exception";
import HashHttpException from "../../../exceptions/hash.http.exception";
import DatabaseHttpException from "../../../exceptions/database.http.exception";
import SessionHttpException from "../../../exceptions/session.http.exception";
import EmailNotSendHttpException from "../../../exceptions/email.not.send.exception";
import NotFoundHttpException from "../../../exceptions/not.found.http.exception";
import TypeSession from "../entities/type.session.entity";
import SessionsDTO from "../dto/sessions.dto";
import { plainToInstance } from "class-transformer";
import DataStoreToken from "../interfaces/data.store.token.interface";
import LoginDTO from "features/auth/dto/login.dto";
import RegisterDTO from "../dto/register.dto";
import Credentials from "../../../features/client/entities/credentials.entity";
import Client from "../../../features/client/entities/client.entity";
import Person from "../../../features/client/entities/person.entity";
import SendEmailDTO from "../dto/send.email.dto";
import ClientDTO from "../../../features/client/dto/client.dto";

export default class AuthService extends Services{

  private async _addSession(session: Session): Promise<Session>{
    try{
    if(session){
      return await this._authDatabase.insertClientSessions(session);
    }else{
      throw new SessionHttpException("INSERT","Session is null");
    }
    }catch (error) {
    throw new DatabaseHttpException(error.message);
    }
  }

  public async getSessions(id: string): Promise<SessionsDTO[]>{
    const client = await this._clientDatabase.findClientBySessionId(id);
    return await this._authDatabase.findSessionsByClient(client);
  }

  public async createSession(type: TypeSession,description: string = ' ', tokenData: TokenData,sessionId: string): Promise<Session>{
    const session = new Session();
    type.type = type.type.toUpperCase();
    if(await this._authDatabase.findTypeSession(type)){
      session.type = type;
    }else{
      throw new NotFoundHttpException("TYPE_SESSION");
    }
    session.description = description;
    session.expiresIn = tokenData.expiresIn;
    session.iat = tokenData.iat;
    session.id = sessionId;
    return session;
  }

  public async register(registerDTO: RegisterDTO): Promise<boolean>{
    const credentials = new Credentials();
    credentials.email = registerDTO.loginDTO.email.toLowerCase();
    credentials.password = registerDTO.loginDTO.password;
    
    if(await this._clientDatabase.findClientByEmail(credentials.email)){
      throw new EmailFoundHttpException(credentials.email);
    }
    try {
      credentials.password = await bcrypt.hash(credentials.password, 10); 
    } catch (error) {
      throw new HashHttpException(error.message);
    }
    const client = new Client();
    client.person = plainToInstance(Person,registerDTO.personDTO);
    client.credentials = credentials;
    const result = await this._clientDatabase.insertClient(client);
    if(result){
      return true;
    }
    return false;
  }
  public async getNewRefreshToken(dataStoreToken: DataStoreToken ): Promise<TokenData>{
    var client: Client;
    var session: Session;
    var refreshToken: TokenData;
      client = await this._clientDatabase.findClientBySessionId(dataStoreToken.id);

      if(client){
        await this.updateClientSessionsByClientId(client.id);

        const sessionId = this.generateSessionId();
        const sessionType = this.getRefreshTokenTypesession();
        try {
          refreshToken = this.jwt.createRefreshToken(client.id,sessionType.id);
        } catch (error) {
          throw new HashHttpException(error.message);
        }
        
        if(refreshToken){
          session = await this.createSession(sessionType," ",refreshToken,sessionId);
        }else{
          throw new SessionHttpException("CREATE","Refresh Token is Null!");
        }
        
        if(session){
          session.client = client;
          await this._addSession(session);
        }else{
          throw new SessionHttpException("CREATE","Failed to assign client to session");
        }
        return refreshToken;
      }
      throw new NotFoundHttpException("CLIENT");

  }
  public async getNewAccessToken(id: string ): Promise<TokenData> {
    var client: Client;
    var sessionId: string;
    var session: Session;
    var accessToken: TokenData;
      
    client = await this._clientDatabase.findClientById(id);
    if (client) {
      await this.updateClientSessionsByClientId(client.id);
    
      sessionId = this.generateSessionId();
      const sessionType = this.getLoginTypesession();
      try {
        accessToken = this.jwt.createAccessToken(sessionId,sessionType.id);
      } catch (error) {
        throw new HashHttpException(error.message);
      }
      
      try {
        if(accessToken){
          session = await this.createSession(sessionType," ",accessToken,sessionId);
        }
      } catch (error) {
        throw new SessionHttpException("CREATE", error.message);
      }
      if(session){
        session.client = client;
        await this._addSession(session);
      }else{
        throw new SessionHttpException("CREATE","Failed to assign client to session");
      }
      return accessToken;
    }
    throw new NotFoundHttpException("CLIENT");
  }
  
  public async updateClientSessionsByClientId(id: string){
    const sessions = await this._authDatabase.findSessionsByClientid(id);
    const time: number = Math.floor(Date.now() / 1000);
    sessions.forEach( async (session) => {
      if (session.expiresIn < time || session.type.id == "2") {
        try{
          await this._authDatabase.deleteClientSessions(session);
        } catch (error) {
          throw new DatabaseHttpException(error.message);
        }
      }
    });
  }

  public async login(loginDTO: LoginDTO): Promise<TokenData> {
    var client: Client;
    var isMatch = false;
    var accessToken: TokenData;
    var session: Session;
    loginDTO.email = loginDTO.email.toLowerCase();

    client = await this._clientDatabase.findClientByEmail(loginDTO.email);
    
    if(client){
      try {
        isMatch = await bcrypt.compare(
          loginDTO.password,
          client.credentials.password
        );
      } catch (error) {
        throw new HashHttpException(error.message);
      }
      if(isMatch){
        try{
          await this.updateClientSessionsByClientId(client.id);
        } catch (error) {
          throw new SessionHttpException("UPDATE",error.message);
        }
        
        try {
          const sessionId = this.generateSessionId();
          const sessionType = this.getLoginTypesession();
          accessToken = this.jwt.createAccessToken(sessionId,sessionType.id);
          session = await this.createSession(sessionType," ",accessToken,sessionId);
          session.client= client;
        } catch (error) {
          throw new HashHttpException(error.message);
        }

        await this._addSession(session);
        return accessToken;
      }
    }
    throw( new NotFoundHttpException("CLIENT"));
  }
   
  public async sendEmail(sendEmailDTO: SendEmailDTO){
    var sessionId: string;
    var session: Session;
    const credentials = new CredentialsDTO();
    credentials.email = sendEmailDTO.email;
    const client = await this._clientDatabase.findClientByEmail(credentials.email);
    if(client){
      await this.updateClientSessionsByClientId(client.id);
      
      
      try {
        sessionId = this.generateSessionId();
      } catch (error) {
        throw new SessionHttpException("GENERATE", error.message);
      }
      const sessionType = this.getResetPasswordTypesession();
      const accessToken: TokenData = this.jwt.createAccessToken(sessionId,sessionType.id);
      try {
        session = await this.createSession(sessionType," ",accessToken,sessionId);
      } catch (error) {
        throw new SessionHttpException("CREATE", error.message);
      }
      
      session.client = client;
      session = await this._addSession(session);
      
      const result = await this.email.sendResetPasswordEmail(client.person.name,client.credentials.email,accessToken.token);
      if(!result){
        throw new EmailNotSendHttpException("e-mail not send");
      }else{
        return true;
      }
    }else{
      throw new NotFoundHttpException("CLIENT");
    }
  }
}