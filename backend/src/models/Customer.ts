import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CustomerFollowUp } from './CustomerFollowUp';

export enum CustomerType {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
  DISTRIBUTOR = 'distributor'
}

export enum CustomerStatus {
  LEAD = 'lead',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mobileNumber: string;

  @Column()
  email: string;

  @Column()
  businessName: string;

  @Column({ nullable: true })
  gstNumber: string;

  @Column({ type: 'enum', enum: CustomerType })
  type: CustomerType;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: CustomerStatus, default: CustomerStatus.LEAD })
  status: CustomerStatus;

  @Column({ nullable: true })
  followUpDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => CustomerFollowUp, (followUp) => followUp.customer)
  followUps: CustomerFollowUp[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
