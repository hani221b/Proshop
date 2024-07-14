import asyncHandler from "../middleware/asyncHanlder.js";
import Order from "../models/OrderModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  private
const addOrderItems = asyncHandler(async (req, res) => {
    // res.send("add order items");
    const { 
        orderItems,
        shippingAddress,
        paymentMethod,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
     } = req.body;

     if(orderItems && orderItems.length === 0){
        res.status(400);
        throw new Error("No Order Items");
     } else {
        const order = new Order({
            orderItems: orderItems.map(item => ({
                ...item, 
                product: item._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        }); 

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
     }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id});
    res.status(200).json(orders);
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user","name email");
    if(order){
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error("Order not found!");
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404)
        throw new Error("Order not found!");
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    res.send("uodate order to delivered");
});

// @desc    get all orders
// @route   GET /api/orders
// @access  private/Admin
const getOrders = asyncHandler(async (req, res) => {
    res.send("get all orders");
});


export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
}