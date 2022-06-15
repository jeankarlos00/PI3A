import { Column, Entity,ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import ChatbotTypeMessage from "./chatbot.type.message.entity";
import ChatbotSession from "./chatbot.session.entity";

@Entity()
export default class ChatbotMessage{
    @PrimaryGeneratedColumn('increment')
    public id?: string;

    @Column({nullable:false})
    public message?: string;

    @ManyToOne(() => ChatbotTypeMessage, (chatbotTypeMessage: ChatbotTypeMessage) => chatbotTypeMessage.chatbotMessages, {nullable: false})
    public type: ChatbotTypeMessage;

    @Column({type: "timestamptz" ,nullable: false})
    public date: Date;

    @ManyToOne(() => ChatbotSession, chatbotSession => chatbotSession.id, {nullable: false})
    public chatbotSession?: ChatbotSession;
}