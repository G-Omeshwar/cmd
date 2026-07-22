import express, { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { SalesChalan, ChalanStatus } from '../models/SalesChalan';
import { ChalanItem } from '../models/ChalanItem';
import { Product } from '../models/Product';
import { StockMovement, MovementType } from '../models/StockMovement';
import { Customer } from '../models/Customer';
import { AuthRequest, roleMiddleware } from '../middleware/auth';
import Joi from 'joi';

const router: Router = express.Router();
const chalanRepository = AppDataSource.getRepository(SalesChalan);
const chalanItemRepository = AppDataSource.getRepository(ChalanItem);
const productRepository = AppDataSource.getRepository(Product);
const customerRepository = AppDataSource.getRepository(Customer);
const stockMovementRepository = AppDataSource.getRepository(StockMovement);

const chalanSchema = Joi.object({
  customerId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required()
    })
  ).min(1).required()
});

const generateChalanNumber = async (): Promise<string> => {
  const count = await chalanRepository.count();
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `CH-${dateStr}-${String(count + 1).padStart(5, '0')}`;
};

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    let query = chalanRepository.createQueryBuilder('challan')
      .leftJoinAndSelect('challan.customer', 'customer')
      .leftJoinAndSelect('challan.items', 'items');

    if (status) {
      query = query.where('challan.status = :status', { status });
    }

    const [challans, total] = await query
      .orderBy('challan.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    res.json({ challans, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', roleMiddleware(['sales', 'admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = chalanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const customer = await customerRepository.findOne({ where: { id: value.customerId } });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const challanNumber = await generateChalanNumber();
    let totalQuantity = 0;
    let totalAmount = 0;
    const items: ChalanItem[] = [];

    for (const item of value.items) {
      const product = await productRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      const itemTotal = product.unitPrice * item.quantity;
      totalQuantity += item.quantity;
      totalAmount += itemTotal;

      const chalanItem = chalanItemRepository.create({
        productId: item.productId,
        productName: product.name,
        productSku: product.sku,
        unitPrice: product.unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal
      });

      items.push(chalanItem);
    }

    const challan = chalanRepository.create({
      challanNumber,
      customerId: value.customerId,
      customer,
      totalQuantity,
      totalAmount,
      status: ChalanStatus.DRAFT,
      createdBy: req.user?.id || 'system',
      items
    });

    await chalanRepository.save(challan);

    res.status(201).json({ message: 'Challan created', challan });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const challan = await chalanRepository.findOne({
      where: { id: req.params.id },
      relations: ['customer', 'items', 'createdByUser']
    });

    if (!challan) {
      return res.status(404).json({ error: 'Challan not found' });
    }

    res.json({ challan });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/confirm', roleMiddleware(['sales', 'admin']), async (req: AuthRequest, res: Response) => {
  try {
    const challan = await chalanRepository.findOne({
      where: { id: req.params.id },
      relations: ['items']
    });

    if (!challan) {
      return res.status(404).json({ error: 'Challan not found' });
    }

    if (challan.status !== ChalanStatus.DRAFT) {
      return res.status(400).json({ error: 'Only draft challans can be confirmed' });
    }

    // Check and deduct stock
    for (const item of challan.items) {
      const product = await productRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      if (product.currentStock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product ${product.name}. Available: ${product.currentStock}, Required: ${item.quantity}`
        });
      }

      // Deduct stock
      product.currentStock -= item.quantity;
      await productRepository.save(product);

      // Create stock movement log
      const movement = stockMovementRepository.create({
        productId: item.productId,
        quantityChanged: item.quantity,
        movementType: MovementType.OUT,
        reason: 'Sales Challan',
        reference: challan.id,
        createdBy: req.user?.id || 'system'
      });
      await stockMovementRepository.save(movement);
    }

    // Update challan status
    challan.status = ChalanStatus.CONFIRMED;
    await chalanRepository.save(challan);

    res.json({ message: 'Challan confirmed and stock deducted', challan });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/cancel', roleMiddleware(['sales', 'admin']), async (req: AuthRequest, res: Response) => {
  try {
    const challan = await chalanRepository.findOne({ where: { id: req.params.id } });

    if (!challan) {
      return res.status(404).json({ error: 'Challan not found' });
    }

    if (challan.status !== ChalanStatus.DRAFT) {
      return res.status(400).json({ error: 'Only draft challans can be cancelled' });
    }

    challan.status = ChalanStatus.CANCELLED;
    await chalanRepository.save(challan);

    res.json({ message: 'Challan cancelled', challan });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
