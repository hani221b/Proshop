import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHanlder";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

type User = {
    id: number;
    email: string;
    password: string;
    name: string | null;
    isAdmin: boolean;
    createdAt: Date;
}


interface CustomRequest extends Request {
  user?: User // or any other type
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req: CustomRequest, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
const createdOrder = await prisma.order.create({
  data: {
    userId: req.user?.id as any, 
    shippingAddress: {
      create: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
    },
    paymentMethod,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: false,
    isDelivered: false,
    orderItems: {
      create: orderItems.map((item: any) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        product: {
          connect: { id: item.id }, // product must already exist
        },
      })),
    },
  },
});
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
  const orders = await prisma.order.findUnique({ where: {
    id: req.user!.id as any
  } });
  res.status(200).json(orders);
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req: CustomRequest, res: Response) => {
  const order = await prisma.order.findUnique({where: {
    id: req.params.id
  }});

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found!");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req: CustomRequest, res: Response) => {
  const order = await prisma.order.findUnique({where: {
    id: req.params.id
  }});

  //! THIS MUST BE UPDATED IN THE FUTURE
  if (order) {
    // order.isPaid = true;
    // order.paidAt = new Date();
    // order.paymentResult = {
    //   id: req.body.id,
    //   status: req.body.status,
    //   update_time: req.body.update_time,
    //   emailAddress: req.body.payer.email_address,
    // };

    // const updatedOrder = await order.save();
    // res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found!");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
  res.send("update order to delivered");
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req: Request, res: Response) => {
  res.send("get all orders");
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
