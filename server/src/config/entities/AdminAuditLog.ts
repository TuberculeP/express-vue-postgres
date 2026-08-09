import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class AdminAuditLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  actor: User;

  @Column()
  action: string;

  // Kept as a plain string (not a FK) so the log survives target anonymization.
  @Column()
  targetUserId: string;

  @Column({ type: "text", nullable: true })
  details: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
