import Client from "../entities/client.entity";
import { DataSource, UpdateResult } from "typeorm";
import ClientDatabase from "../interface/client.database.interface";
import DatabaseHttpException from "../../../exceptions/database.http.exception";
import Session from "../../auth/entities/session.entity";
import Credentials from "../entities/credentials.entity";

export default class ClientPostgresDatabase implements ClientDatabase {
    private _appDataSource: DataSource;
    constructor(appDataSource: DataSource) {
        this._appDataSource = appDataSource;
    }
    public async findClientById(id: string): Promise<Client>{
        try {
            const client = await this._appDataSource.manager.findOne(
                Client,{where:{id: id}, relations: ['credentials', 'person']});
            return client;
        } catch (error) {
            throw (new DatabaseHttpException(error.message));

        }
    }
    public async findClientBySessionId(sessionId: string): Promise<Client>{
        var client: Client;
        try {
            const session = await this._appDataSource.manager.findOne(Session,{where:{id:sessionId}});
            if(session){
                client = await this._appDataSource.manager.findOne(Client,
                    {where:{sessions: session}, 
                    relations: ['credentials', 'person']});
            }
            return client;
            
        } catch (error) {
            throw (new DatabaseHttpException(error.message));
        }
    }
    public async findClientByEmail(email: string): Promise<Client>{
        var client: Client;
        try {
            const credentialsClient = await this._appDataSource.manager.findOne(Credentials,{where: {email}});
            if (credentialsClient) {
                client = await this._appDataSource.manager.findOne(
                Client,{where:{credentials: credentialsClient}, 
                relations: ['credentials', 'person']});
            }
        
            return client;
        } catch (error) {
            throw(new DatabaseHttpException(error.message));
        }
    }
    public async insertClient(client: Client): Promise<Client>{
        try {
            await this._appDataSource.manager.save(client.person);
            await this._appDataSource.manager.save(client.credentials);
            return await this._appDataSource.manager.save(client);
        } catch (error) {
            throw (new DatabaseHttpException(error.message));
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
}