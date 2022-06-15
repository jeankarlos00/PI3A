import { Column, Entity,OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Session from "./session.entity";

@Entity()
export default class TypeSession{
    @PrimaryColumn()
    public id?: string;

    @Column({unique: true})
    public type?: string;

    @OneToMany(() => Session, session => session.type,{cascade: true})
    public sessions: Session[];
}