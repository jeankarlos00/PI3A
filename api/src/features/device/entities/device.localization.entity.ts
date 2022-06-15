import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Device from "./device.entity";

@Entity()
export default class DeviceLocalization{
    @PrimaryGeneratedColumn("uuid")
    public id?: string;
    @Column({nullable: false})
    public latitude?: string;

    @Column({nullable: false})
    public longitude?: string;

    @OneToOne(() => Device, device => device, {nullable: false})
    @JoinColumn()
    public device?: Device;
}