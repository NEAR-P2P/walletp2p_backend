import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Index,
  
} from "typeorm";


@Entity({ name: "walletbot" })
@Index(["id"])
export class WalletBot extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: true,
  })
  idtelegram!: string;

  @Column({
    unique: true, // Make walletname unique
    nullable: true,
  })
  walletname!: string;

  @CreateDateColumn({type: "timestamptz"})
  creation_date!: Date;
}