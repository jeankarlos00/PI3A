import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Device from "./device.entity";

@Entity()
export default class DevicePreferences{
    @PrimaryGeneratedColumn("increment")
    public id?: string;
    @Column()
    public temperature?: string;

    @Column()
    public humidity?: string;

    @Column()
    public moisture?: string;

    @Column()
    public luminosity?: string;

    @OneToOne(() => Device, device => device, {nullable: false})
    @JoinColumn()
    public device?: Device;
}