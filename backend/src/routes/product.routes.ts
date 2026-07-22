import express, { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../models/Product';
import { AuthRequest, roleMiddleware } from '../middleware/auth';
import Joi from 'joi';

const router: Router = express.Router();
const productRepository = AppDataSource.getRepository(Product);

const productSchema = Joi.object({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  category: Joi.string().required(),
  unitPrice: Joi.number().positive().required(),
  currentStock: Joi.number().integer().min(0).optional(),
  minimumStockAlert: Joi.number().integer().min(0).required(),
  location: Joi.string().required(),
  imageUrl: Joi.string().optional()
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const category = req.query.category as string;

    let query = productRepository.createQueryBuilder('product');

    if (search) {
      query = query.where(
        'product.name ILIKE :search OR product.sku ILIKE :search',
        { search: `%${search}%` }
      );
    }

    if (category) {
      query = query.andWhere('product.category = :category', { category });
    }

    const [products, total] = await query
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    res.json({ products, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', roleMiddleware(['admin', 'warehouse']), async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingSku = await productRepository.findOne({ where: { sku: value.sku } });
    if (existingSku) {
      return res.status(400).json({ error: 'SKU already exists' });
    }

    const product = productRepository.create(value);
    await productRepository.save(product);

    res.status(201).json({ message: 'Product created', product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const product = await productRepository.findOne({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', roleMiddleware(['admin', 'warehouse']), async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const product = await productRepository.findOne({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    Object.assign(product, value);
    await productRepository.save(product);

    res.json({ message: 'Product updated', product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
