import Client from "../entities/client.entity";
import Credentials from "../entities/credentials.entity";

export default interface ClientDatabase {
    findClientById(id: string): Promise<Client>;
    findClientBySessionId(sessionId: string): Promise<Client>;
    findClientByEmail(email: string): Promise<Client>;

    insertClient(client: Client): Promise<Client>;

    updateCredentials(credentials: Credentials): Promise<boolean>;
}