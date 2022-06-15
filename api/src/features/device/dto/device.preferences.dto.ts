import { MinLength, ValidateNested } from "class-validator";
import DeviceDTO from "./device.dto";

export default class DevicePreferencesDTO{
    @MinLength(1)
    public temperature?: string;
    @MinLength(1)
    public humidity?: string;
    @MinLength(1)
    public moisture?: string;
    @MinLength(1)
    public luminosity?: string;
    @ValidateNested()
    public deviceDTO: DeviceDTO;
}