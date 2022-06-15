import { transformAndValidate } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { NextFunction, RequestHandler, Response } from "express";
import RequestWithError from "../interfaces/request.error.interface";
import DeviceDTO from "../dto/device.dto";
import DeviceLocalizationDTO from "../dto/device.localization.dto";
import DevicePreferencesDTO from "../dto/device.preferences.dto";
import MeasureDTO from "../dto/measure.dto";
import MeasureQueryDTO from "../dto/measure.query.dto";
import TypeMeasureDTO from "../dto/type.measure.dto";
import DeviceValidation from "../interfaces/device.validation.interface";

export default class DeviceValidationMiddleware implements DeviceValidation {
    public localization():RequestHandler {
        return async (request: RequestWithError, response: Response, next: NextFunction) =>{
          let message: string;
          try {
            const localization: DeviceLocalizationDTO = request.body;
            await transformAndValidate(DeviceDTO,localization.deviceDTO);
            await transformAndValidate(DeviceLocalizationDTO,localization);
          } catch (err) {
            message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
          }
          if(message){
            request.error = message;
          }
          next();
        }
      }
      public preferences():RequestHandler {
        return async (request: RequestWithError, response: Response, next: NextFunction) =>{
          let message: string;
          try {
            const devicePreferencesDTO: DevicePreferencesDTO = request.body;
            await transformAndValidate(DeviceDTO,devicePreferencesDTO.deviceDTO);
            await transformAndValidate(DevicePreferencesDTO,devicePreferencesDTO);
          } catch (err) {
            message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
          }
          if(message){
            request.error = message;
          }
          next();
        }
      }
      public measureQuery(): RequestHandler {
        return async (request: RequestWithError, response: Response, next: NextFunction) =>{
          let message: string;
          try {
            const measure_query: MeasureQueryDTO = request.body;
            await transformAndValidate(MeasureQueryDTO,measure_query);
          } catch (err) {
            message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
          }
          if(message){
            request.error = message;
          }
          next();
        }
      }
    
    
      public device(): RequestHandler {
        return async (request: RequestWithError, response: Response, next: NextFunction) =>{
          let message: string;
          try {
            const deviceDTO: DeviceDTO = request.body;
            await transformAndValidate(DeviceDTO,deviceDTO);
          } catch (err) {
            message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
          }
          if(message){
            request.error = message;
          }
          next();
        }
      }
      public measure(): RequestHandler {
        return async (request: RequestWithError, response: Response, next: NextFunction) =>{
          let message: string;
          try {
            const measureDTO: MeasureDTO = request.body;
            await transformAndValidate(MeasureDTO,measureDTO);
            await transformAndValidate(DeviceDTO,measureDTO.deviceDTO);
            await transformAndValidate(TypeMeasureDTO,measureDTO.typeDTO);
          } catch (err) {
            message = err.map((err: ValidationError) => Object.values(err.constraints)).join(', ');
          }
          if(message){
            request.error = message;
          }
          next();
        }
      }
}