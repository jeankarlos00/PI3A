import { Length, MaxLength, MinLength } from "class-validator";
export default class DeviceDTO {
    @MinLength(6)
    public id?: string;
    @MaxLength(23)
    public name?: string;
}