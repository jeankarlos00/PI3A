import Client from "../../../features/client/entities/client.entity";
import Credentials from "../../../features/client/entities/credentials.entity";
import Session from "../entities/session.entity";
import TypeSession from "../entities/type.session.entity";
import DatabaseHttpException from "../../../exceptions/database.http.exception";
import { DataSource, DeleteResult, UpdateResult } from "typeorm";
import AuthDatabase from "../interfaces/auth.database.interface";

export default class AuthPostgresDatabase implements AuthDatabase{
    private _appDataSource: DataSource;

    constructor(dataSource: DataSource){
        this._appDataSource = dataSource;
    }
    public async findSessionBySessionId(id: string): Promise<Session> {
        try {
            return await this._appDataSource.manager.findOne(
                Session,
                {where:{id: id}, 
                relations:['type']
            });
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }
    public async findSessionsByClientid(id: string): Promise<Session[]> {
        try {
            const client = new Client()
            client.id = id;
            return await this._appDataSource.manager.find(
                Session,
                {where:{client: client}, 
                relations:['type']
            });
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }
    public async findSessionsByClient(client: Client): Promise<Session[]> {
        try {
            return await this._appDataSource.manager.find(
                Session,
                {where:{client: client}, 
                relations:['type']
            });
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }
    
    public async insertTypeSession(typeSession: TypeSession): Promise<TypeSession> {
        try {
            return await this._appDataSource.manager.save(typeSession);
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }

    public async findTypeSession(typeSession: TypeSession): Promise<TypeSession> {
        try {
            return await this._appDataSource.manager.findOne(
                TypeSession,
                {where: {type: typeSession.type},relations: ['sessions']});
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }
    

    public async updateCredentials(credentials: Credentials): Promise<boolean>{
        try {
            const result: UpdateResult = await this._appDataSource.manager.update(Credentials,credentials.email,credentials);
            if(result.affected != null && result.affected>0){
                return true;
            }
            return false
        } catch (error) {
            throw( new DatabaseHttpException(error.message));
        }
    }

    public async deleteClientSessions(session: Session): Promise<boolean> {
        try {
            const result: DeleteResult = await this._appDataSource.manager.delete(Session,session.id);
            if(result.affected != null && result.affected>0) {
                return true;
            }
            return false;
        } catch (error) {
            throw (new DatabaseHttpException(error.message));
        }
    }
    public async insertClientSessions(session: Session): Promise<Session> {
        try {
            const result = await this._appDataSource.manager.save(session);
            return result;
        } catch (error) {
            throw (new DatabaseHttpException(error.message));
        }
    }
}