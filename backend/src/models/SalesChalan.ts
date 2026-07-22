import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Customer } from './Customer';
import { User } from './User';
import { ChalanItem } from './ChalanItem';

export enum ChalanStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

@Entity('sales_challans')
export class SalesChalan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  challanNumber: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @Column({ type: 'int' })
  totalQuantity: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: ChalanStatus, default: ChalanStatus.DRAFT })
  status: ChalanStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;

  @Column()
  createdBy: string;

  @OneToMany(() => ChalanItem, (item) => item.challan, { cascade: true })
  items: ChalanItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
