import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Client from './client.entity';

@Entity()
export default class Person{    
    @PrimaryGeneratedColumn("uuid")
    public id?: string;

    @Column({nullable:false})
    public name?: string;

    @Column({nullable:false})
    public lastName?: string;

    @OneToOne(() => Client, client => client.id, {nullable: false})
    public client?: Client;
}