import express, { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { StockMovement, MovementType } from '../models/StockMovement';
import { Product } from '../models/Product';
import { AuthRequest, roleMiddleware } from '../middleware/auth';
import Joi from 'joi';

const router: Router = express.Router();
const stockMovementRepository = AppDataSource.getRepository(StockMovement);
const productRepository = AppDataSource.getRepository(Product);

const adjustStockSchema = Joi.object({
  productId: Joi.string().required(),
  quantityChanged: Joi.number().integer().required(),
  movementType: Joi.string().valid('in', 'out').required(),
  reason: Joi.string().required(),
  reference: Joi.string().optional()
});

router.get('/stock-movements', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const productId = req.query.productId as string;

    let query = stockMovementRepository.createQueryBuilder('movement');

    if (productId) {
      query = query.where('movement.productId = :productId', { productId });
    }

    const [movements, total] = await query
      .orderBy('movement.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    res.json({ movements, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/adjust-stock', roleMiddleware(['admin', 'warehouse']), async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = adjustStockSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const product = await productRepository.findOne({ where: { id: value.productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update stock
    if (value.movementType === MovementType.IN) {
      product.currentStock += value.quantityChanged;
    } else {
      if (product.currentStock < value.quantityChanged) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      product.currentStock -= value.quantityChanged;
    }

    await productRepository.save(product);

    // Create stock movement log
    const movement = stockMovementRepository.create({
      productId: value.productId,
      quantityChanged: value.quantityChanged,
      movementType: value.movementType,
      reason: value.reason,
      reference: value.reference,
      createdBy: req.user?.id || 'system'
    });

    await stockMovementRepository.save(movement);

    res.status(201).json({ message: 'Stock adjusted', movement, product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/low-stock', async (req: AuthRequest, res: Response) => {
  try {
    const products = await productRepository
      .createQueryBuilder('product')
      .where('product.currentStock <= product.minimumStockAlert')
      .orderBy('product.currentStock', 'ASC')
      .getMany();

    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
