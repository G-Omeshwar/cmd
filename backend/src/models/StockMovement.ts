import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';
import { User } from './User';

export enum MovementType {
  IN = 'in',
  OUT = 'out'
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  quantityChanged: number;

  @Column({ type: 'enum', enum: MovementType })
  movementType: MovementType;

  @Column()
  reason: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;

  @Column()
  createdBy: string;

  @Column({ type: 'text', nullable: true })
  reference: string; // Challan ID or other reference

  @CreateDateColumn()
  createdAt: Date;
}
