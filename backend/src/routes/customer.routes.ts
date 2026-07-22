import express, { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Customer, CustomerStatus, CustomerType } from '../models/Customer';
import { CustomerFollowUp } from '../models/CustomerFollowUp';
import { AuthRequest } from '../middleware/auth';
import Joi from 'joi';

const router: Router = express.Router();
const customerRepository = AppDataSource.getRepository(Customer);
const followUpRepository = AppDataSource.getRepository(CustomerFollowUp);

const customerSchema = Joi.object({
  name: Joi.string().required(),
  mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email().required(),
  businessName: Joi.string().required(),
  gstNumber: Joi.string().optional(),
  type: Joi.string().valid('retail', 'wholesale', 'distributor').required(),
  address: Joi.string().required(),
  status: Joi.string().valid('lead', 'active', 'inactive').optional(),
  followUpDate: Joi.date().optional(),
  notes: Joi.string().optional()
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    let query = customerRepository.createQueryBuilder('customer');

    if (search) {
      query = query.where(
        'customer.name ILIKE :search OR customer.email ILIKE :search OR customer.mobileNumber ILIKE :search',
        { search: `%${search}%` }
      );
    }

    const [customers, total] = await query
      .orderBy('customer.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    res.json({ customers, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const customer = customerRepository.create({
      ...value,
      status: value.status || CustomerStatus.LEAD
    });

    await customerRepository.save(customer);
    res.status(201).json({ message: 'Customer created', customer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerRepository.findOne({
      where: { id: req.params.id },
      relations: ['followUps']
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const customer = await customerRepository.findOne({ where: { id: req.params.id } });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    Object.assign(customer, value);
    await customerRepository.save(customer);

    res.json({ message: 'Customer updated', customer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/follow-ups', async (req: AuthRequest, res: Response) => {
  try {
    const { notes, followUpDate } = req.body;

    if (!notes) {
      return res.status(400).json({ error: 'Notes are required' });
    }

    const customer = await customerRepository.findOne({ where: { id: req.params.id } });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const followUp = followUpRepository.create({
      customer,
      customerId: req.params.id,
      notes,
      followUpDate,
      createdBy: req.user?.id || 'system'
    });

    await followUpRepository.save(followUp);
    res.status(201).json({ message: 'Follow-up added', followUp });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/follow-ups', async (req: AuthRequest, res: Response) => {
  try {
    const followUps = await followUpRepository.find({
      where: { customerId: req.params.id },
      order: { createdAt: 'DESC' }
    });

    res.json({ followUps });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
