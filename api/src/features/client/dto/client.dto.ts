import { ValidateNested } from 'class-validator';
import CredentialsDTO from './credentials.dto';
import PersonDTO from './person.dto';
export default class ClientDTO {

    public id?: string 

    @ValidateNested()  
    public personDTO?: PersonDTO;

    @ValidateNested()
    public credentialsDTO?: CredentialsDTO;
}