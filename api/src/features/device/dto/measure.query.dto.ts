import { IsDate, IsDateString, isDateString, IS_DATE_STRING, MinLength } from "class-validator";

export default class MeasureQueryDTO{
    @MinLength(6)
    public deviceId?: string;
    @IsDateString()
    public start?: string;
    
    @IsDateString()
    public end?: string;
}