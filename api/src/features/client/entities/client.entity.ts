import Session from "../../../features/auth/entities/session.entity";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Credentials from './credentials.entity';
import Person from "./person.entity"
import Device from "../../../features/device/entities/device.entity";
import ChatbotSession from "../../../features/chatbot/entities/chatbot.session.entity";

@Entity()
export default class Client{    
    @PrimaryGeneratedColumn("uuid")
    public id?: string;

    @OneToOne(() => Person, (person: Person) => person.client, {nullable: false})
    @JoinColumn()
    public person?: Person;

    @OneToOne(() => Credentials, (credentials: Credentials) => credentials.client, {nullable: false})
    @JoinColumn()
    public credentials?: Credentials;

    @OneToMany(() => Session, session => session.client, {cascade: true})
    public sessions?: Session[];

    @OneToMany(() => Device, device => device.client, {cascade: true})
    public devices?: Device[];

    @OneToMany(()=> ChatbotSession, chatbotSession => chatbotSession.client)
    public chatbotSessions?: ChatbotSession[];
}