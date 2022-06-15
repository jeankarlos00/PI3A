import Credentials from "../../../features/client/entities/credentials.entity";
import Client from "../../../features/client/entities/client.entity";
import Session from "../entities/session.entity";
import TypeSession from "../entities/type.session.entity";

export default interface AuthDatabase {
    findTypeSession(typeSession: TypeSession): Promise<TypeSession>;
    findSessionsByClient(client: Client): Promise<Session[]>;
    findSessionsByClientid(id: string): Promise<Session[]>;
    findSessionBySessionId(id: string): Promise<Session>;

    insertClientSessions(session: Session): Promise<Session>;
    insertTypeSession(typeSession: TypeSession): Promise<TypeSession>;

    updateCredentials(credentiats: Credentials): Promise<boolean>;

    deleteClientSessions(session: Session): Promise<boolean>;
}