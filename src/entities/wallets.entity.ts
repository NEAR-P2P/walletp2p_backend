import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Index,
  
} from "typeorm";


@Entity({ name: "wallet" })
@Index(["id", "email"])
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  seedPhrase!: string;

  @Column({
    nullable: false,
    default: false
  })
  nickname!: boolean;

  @CreateDateColumn({type: "timestamptz"})
  creation_date!: Date;
}