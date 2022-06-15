import { ValidateNested } from 'class-validator';
import CredentialsChatbotDTO from './credentials.chatbot.dto';
export default class ClientChatbotDTO {

    public id?: string 

    @ValidateNested()
    public credentialsDTO?: CredentialsChatbotDTO;
}