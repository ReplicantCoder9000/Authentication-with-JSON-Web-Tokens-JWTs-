import { Request, Response } from 'express';
import { Ticket } from '../models/ticket.js';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
  id: number;
}

// GET /tickets
export const getAllTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['username'],
        },
      ],
    });
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /tickets/:id
export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['username'],
        },
      ],
    });
    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /tickets
export const createTicket = async (req: Request, res: Response) => {
  const { name, status, description } = req.body;
  try {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify and decode the token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log('Decoded token in createTicket:', decoded); // Debug log

    // Verify that the user exists
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newTicket = await Ticket.create({
      name,
      status,
      description,
      assignedUserId: decoded.id
    });

    // Fetch the created ticket with user information
    const ticketWithUser = await Ticket.findByPk(newTicket.id, {
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['username'],
        },
      ],
    });

    res.status(201).json(ticketWithUser);
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    res.status(400).json({ message: error.message });
  }
};

// PUT /tickets/:id
export const updateTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status, description, assignedUserId } = req.body;
  try {
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      ticket.name = name;
      ticket.status = status;
      ticket.description = description;
      ticket.assignedUserId = assignedUserId;
      await ticket.save();
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /tickets/:id
export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      await ticket.destroy();
      res.json({ message: 'Ticket deleted' });
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
