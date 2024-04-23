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
    nullable: true,
  })
  cedula!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  seedPhrase!: string;

  @Column({
    nullable: true,
  })
  name!: string;

  @Column({
    nullable: true,
  })
  walletname!: string;

  @Column({
    nullable: false,
    default: false
  })
  nickname!: boolean;

  @Column({
    default: false
  })
  nft!: boolean;

  @CreateDateColumn({type: "timestamptz"})
  creation_date!: Date;
}