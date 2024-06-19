import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Index,
  
} from "typeorm";


@Entity({ name: "preRegistration" })
@Index(["id", "email"])
export class PreRegistration extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({
    nullable: false,
  })
  cedula!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  ip!: string;

  @Column({
    nullable: false,
    default: false
  })
  validOtp!: boolean;

  @Column({
    nullable: false,
    default: false
  })
  proccess!: boolean;

  @Column({
    nullable: false,
    default: false
  })
  registered!: boolean;

  @CreateDateColumn({type: "timestamptz"})
  creation_date!: Date;
}