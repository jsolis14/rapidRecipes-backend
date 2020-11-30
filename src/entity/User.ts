import { Entity, PrimaryColumn, Column, BaseEntity, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn("uuid")
    id: string;

    @Column("varchar", { length: 30 })
    firstName: string;

    @Column("varchar", { length: 30 })
    lastName: string;

    @Column("varchar", { length: 200 })
    email: string;

    @Column("text")
    password: string

    @BeforeInsert()
    addId() {
        this.id = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    }
}
