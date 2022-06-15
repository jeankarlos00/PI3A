import { NextFunction,Response } from "express";
import Controller from "../../../controllers/controller";
import { validate } from "class-validator";
import HttpException from "../../../exceptions/http.exceptions";
import HttpData from "../interfaces/http.data.interface";
import SendEmailDTO from "../dto/send.email.dto";
import ResetPasswordDTO from "../dto/reset.password.dto";
import LoginDTO from "../dto/login.dto";
import { plainToInstance } from "class-transformer";
import Credentials from "../../../features/client/entities/credentials.entity";
import RegisterDTO from "../dto/register.dto";
import RequestWithToken from "../interfaces/request.token.interface";
import RequestWithError from "../interfaces/request.error.interface";

export default class AuthController extends Controller{

  public async getSessions(request: RequestWithToken, response: Response){
    if (request.error) {
      const httpData: HttpData = { ok: false, message: request.error};
      response.status(400).send(httpData);
    }else{
      try {
        const dataStoreToken = request.dataStoreToken;
        const sessionsDTO = await this.authService.getSessions(dataStoreToken.id);
        response.status(200).send({ok: true,sessionsDTO});
      } catch (error) {
        if(error instanceof(HttpException)){
          response.status(error.status).send(error.data);
        }else{
          const httpData: HttpData = { ok: false, message: error.message};
          response.status(500).send(httpData);
        }
      
      }
    }
  }

  public async register(request: RequestWithError, response: Response){
    if (request.error) {
      response.status(400).send({ ok: false, message: request.error});
    }else{
      try {
        const registerDTO: RegisterDTO = request.body;
        const result = await this.authService.register(registerDTO);
        response.status(200).send({ok: result});
      } catch (error) {
        if(error instanceof(HttpException)){
          response.status(error.status).send(error.data);
        }else{
          const httpData: HttpData = { ok: false, message: error.message};
          response.status(500).send(httpData);
        }
      
      }
    }
  }
  public async newRefreshToken(request: RequestWithToken, response: Response, next: NextFunction){
    if (request.error) {
      const httpData: HttpData = { ok: false, message: request.error};
      response.status(400).send(httpData);
    }else{
      try {
        const data = request.dataStoreToken;
        const tokenData = await this.authService.getNewRefreshToken(data);
        response.status(200).send({ok: true,tokenData});
      } catch (error) {
        if(error instanceof(HttpException)){
          response.status(error.status).send(error.data);
        }else{
          const httpData: HttpData = { ok: false, message: error.message};
          response.status(500).send(httpData);
        }
      }
    }
  }
  public async newAccessToken(request: RequestWithToken, response: Response, next: NextFunction){
    if (request.error) {
      const httpData: HttpData = { ok: false, message: request.error};
      response.status(400).send(httpData);
    }else{
      try {
        const data = request.dataStoreToken;
        const tokenData = await this.authService.getNewAccessToken(data.id);
        if (tokenData) {
          response.status(200).send({ok: true,tokenData});
        }else{
          const httpData: HttpData = { ok: false, message: "Not Found"};
          response.status(401).send(httpData);
        }
      } catch (error) {
        if(error instanceof(HttpException)){
          response.status(error.status).send(error.data);
        }else{
          const httpData: HttpData = { ok: false, message: error.message};
          response.status(500).send(httpData);
        }
      }
    }
  }

  public async login(request: RequestWithError, response: Response, next: NextFunction) {
    if (request.error) {
      response.status(400).send({ ok: false, message: request.error});
    }else{
      try {
        const loginDTO: LoginDTO = request.body;
        const tokenData = await this.authService.login(loginDTO);
        response.status(200).send({ok:true,tokenData});
      } catch (error) {
        if(error instanceof(HttpException)){
          response.status(error.status).send(error.data);
        }else{
          const httpData: HttpData = { ok: false, message: error.message};
          response.status(500).send(httpData);
        }
      }
    }
  }
  public async changePasswordPage(request: RequestWithToken, response: Response, next: NextFunction){
    let message: string;
    let token: string;
    let name: string = "User";
    let result: boolean = false;
    if (request.error) {
      response.render('pages/invalidLink',{message: request.error});
    }else{
      try {
        const resetPasswordDTO: ResetPasswordDTO = { password: request.body.pass };
        const dataStoreToken = request.dataStoreToken;
        const clientDTO = await this.clientService.getClientBySessionId(dataStoreToken.id);
        if (clientDTO) {
          name = clientDTO.personDTO.name;
          token = request.body.token;
          await this.authService.updateClientSessionsByClientId(clientDTO.id);
          const loginDTO = new LoginDTO();
          loginDTO.email = clientDTO.credentialsDTO.email;
          loginDTO.password = resetPasswordDTO.password;
          await validate(loginDTO);
          const credentials = plainToInstance(Credentials,loginDTO);
          result = await this.clientService.updateCredentials(credentials);
          try {
            const data = {
              ok: result,
              token: token,
              message: result ? "Password Changed" : message,
              name:name
            }
            response.render('pages/redefinePassword',{data});
          } catch (error) {
            response.status(500).send({ ok: false, message: error.message});
          }
        }else{
          response.render('pages/invalidLink');
        }
      } catch (error) {
        response.render('pages/invalidLink',{message: error.message});
      }
    }
  }
  public async resetPasswordPage(request: RequestWithToken, response: Response, next: NextFunction) {
    if (request.error) {
      response.render('pages/invalidLink',{message: request.error});
    }else{
      try {
        const dataStoreToken = request.dataStoreToken;
        const clientDTO = await this.clientService.getClientBySessionId(dataStoreToken.id);
        if(clientDTO){
          const data = {
            token: request.params.token,
            name: clientDTO.personDTO.name
          }
          response.render('pages/redefinePassword',{data});
        }
      } catch (error) {
        response.render('pages/invalidLink',{message: error.message});
      }
    }
  }
  public async resetPasswordSendEmail(request: RequestWithError, response: Response){
    if (request.error){
      const httpData: HttpData = { ok: false, message:request.error};
      response.status(400).send(httpData);
    }else{
      try {
        const body: SendEmailDTO = request.body;
        if (body) {
          await this.authService.sendEmail(body);
          response.status(200).send({ok:true});
        }
      } catch (error) {
        if(error instanceof(HttpException)){
          response.status(error.status).send(error.data);
        }else{
          const httpData: HttpData = { ok: false, message: error.message};
          response.status(500).send({ ok: false, message: httpData});
        }
      }
    }
  }
}