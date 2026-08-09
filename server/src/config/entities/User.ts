import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Upload } from "./Upload";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: "varchar", nullable: true })
  password: string | null;

  @Column({ type: "varchar", nullable: true, unique: true })
  googleId: string | null;

  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: "ROLE_USER" })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Upload, (upload) => upload.user)
  uploads: Upload[];
}
