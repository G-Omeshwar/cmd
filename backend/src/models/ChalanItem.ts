import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SalesChalan } from './SalesChalan';

@Entity('challan_items')
export class ChalanItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SalesChalan, (challan) => challan.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chalanId' })
  challan: SalesChalan;

  @Column()
  chalanId: string;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column()
  productSku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalPrice: number;
}
