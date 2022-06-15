import { transformAndValidate } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import SendEmailDTO from "../dto/send.email.dto";
import { RequestHandler, Response } from "express";
import AuthValidation from "../interfaces/auth.validation.interface";
import RequestWithError from "../interfaces/request.error.interface";
import ResetPasswordDTO from "../dto/reset.password.dto";
import LoginDTO from "../dto/login.dto";
import PersonDTO from "../dto/person.dto";
import RegisterDTO from "../dto/register.dto";

export default class AuthValidationMiddleware implements AuthValidation{
    public email(): RequestHandler {
        return async (request: RequestWithError, response: Response, next) =>{
          let message: string;
          try {
            const email = request.body;
            await transformAndValidate(SendEmailDTO,email);
          } catch (err) {
            message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
          }
          if(message){
            request.error = message;
          }
          next();
    
        }
      }
      public password(): RequestHandler{
        return async (request: RequestWithError, response: Response, next) =>{
          let message: string;
          try {
            const resetPasswordDTO: ResetPasswordDTO = {password:  request.body.pass }
            await transformAndValidate(ResetPasswordDTO,resetPasswordDTO);
          } catch (err) {
            message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
          }
          if(message){
            request.error = message;
          }
          next();
        }
      }
      public register(): RequestHandler{
        return async (request: RequestWithError, response: Response, next) => {
            let message: string;
          try {
              const aux: RegisterDTO = request.body;
              const loginDTO = aux.loginDTO;
              const personDTO = aux.personDTO;
              await transformAndValidate(LoginDTO,loginDTO);
              await transformAndValidate(PersonDTO,personDTO);
            } catch (err) {
              if(Array.isArray(err)){
                message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
              }else{
                message = err.message;
              }
            }
            if(message){
              request.error = message;
            }
            next();
      
        };
      }
      public login(): RequestHandler {
        return async (request: RequestWithError, response: Response, next)  => {
            let message: string
          try {
              const aux = request.body;
              const loginDTO = new LoginDTO();
              loginDTO.email = aux.email;
              loginDTO.password = aux.password;
              await transformAndValidate(LoginDTO, loginDTO);
            } catch (err) {
              message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
            }
            if(message){
              request.error = message;
            }
            next();
      
        };
      }
}