import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import ChatbotMessage from "./chatbot.message.entity";

@Entity()
export default class ChatbotTypeMessage{
    @PrimaryColumn()
    public id?: string;

    @Column({nullable: false})
    public type: string;

    @OneToMany(() => ChatbotMessage, chatbotMessage => chatbotMessage.type,{cascade: true})
    public chatbotMessages: ChatbotMessage[];
}