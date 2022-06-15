import { IsEmail, Matches } from "class-validator";
export default class CredentialsDTO {
    @IsEmail()
    public email?: string;
}