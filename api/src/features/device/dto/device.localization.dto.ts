import { MinLength, ValidateNested } from "class-validator";
import DeviceDTO from "./device.dto";

export default class DeviceLocalizationDTO{
    @MinLength(4)
    public latitude?: string;
    @MinLength(4)
    public longitude?: string;
    @ValidateNested()
    public deviceDTO: DeviceDTO;
}