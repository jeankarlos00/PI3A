import { IsEmail } from "class-validator";
export default class CredentialsChatbotDTO {
    @IsEmail()
    public email?: string;
}