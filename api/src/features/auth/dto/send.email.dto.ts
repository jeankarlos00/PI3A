import { IsEmail} from "class-validator";
export default class SendEmailDTO {
    @IsEmail()
    public email?: string;
}