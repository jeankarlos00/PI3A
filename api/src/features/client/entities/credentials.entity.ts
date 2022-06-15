import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import Client from "./client.entity";

@Entity()
export default class Credentials{
    @PrimaryColumn()
    public email?: string;

    @Column({nullable:false})
    public password?: string;

    @OneToOne(() => Client, client => client.id)
    public client?: Client;
}