import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from 'typeorm';
import bcrypt from 'bcrypt';

@Entity()
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10); // Number of rounds for hashing algorithm. Higher is more secure but slower
  }

  async verifyPassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  constructor() {
    super();
    this.id = 0;
    this.email = '';
    this.password = '';
    this.first_name = null!;
    this.last_name = null!;
  }
}
