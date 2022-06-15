import Client from "../../../features/client/entities/client.entity";
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import ChatbotMessage from "./chatbot.message.entity";

@Entity()
export default class ChatbotSession{
    @PrimaryColumn()
    public id?: string;

    @OneToMany(() => ChatbotMessage, chatbotMessage => chatbotMessage.id, {cascade: true})
    public chatbotMessages?: ChatbotMessage[];

    @ManyToOne(() => Client, client => client.id, {nullable: false})
    public client?: Client;
}