import { MinLength } from "class-validator";
import DeviceDTO from "./device.dto";
import TypeMeasureDTO from "./type.measure.dto";

export default class MeasureDTO{
    public id?: string;

    public date?: Date;
    
    @MinLength(2)
    public value?: string;

    public deviceDTO?: DeviceDTO;

    public typeDTO?: TypeMeasureDTO; 
}