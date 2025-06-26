# ProShop - eCommerce Platform

1.  ProShop is a full-featured eCommerce platform built with Node.js, Typescript, Golang, and React, with Redux for state management using Microservices architecture. This project provides a robust online shopping experience, allowing users to browse products, add items to a cart, manage user accounts, and process payments.

## Features

-   **Product Catalog**: Browse and search for products with details like price, description, and ratings.
-   **Shopping Cart**: Add, update, or remove items in the cart with real-time updates.
-   **User Authentication**: Secure user login and registration using JWT (JSON Web Tokens) and HTTP-only cookies.
-   **Product Reviews**: Users can leave reviews and ratings for products.
-   **Payment Integration**: Supports secure payments (e.g., Credit Card).
-   **Responsive Design**: Frontend built with React and Bootstrap for a mobile-friendly experience.
-   **State Management**: Uses Redux Toolkit for efficient global state management.

## Tech Stack

-   **Node.js**:
-   **Typescript**:
-   **Golang**:
-   **React**:
-   **Redux**:
-   **PostgreSQL**:
-   **Stripe**:
-   **Docker**:
-   **Kubernetes**:
-   **Nginx**:
-   **Prometheus**:
-   **Grafana**:

## Prerequisites

Before you begin, ensure you have the following installed:

-   Node.js (v16 or higher)
-   MongoDB (local or cloud instance, e.g., MongoDB Atlas)
-   npm or Yarn
-   Git

## Installation

1.  **Clone the Repository**:
    
    ```bash
    git clone https://github.com/hani221b/Proshop.git
    cd Proshop
    
    ```
    
2.  **Install Dependencies**:
    
    -   Install backend dependencies:
        
        ```bash
        npm install
        
        ```
        
    -   Navigate to the frontend directory and install frontend dependencies:
        
        ```bash
        cd frontend
        npm install
        
        ```
        
3.  **Set Up Environment Variables**:
    
    -   Create a `.env` file in the root directory by copying the example:
        
        ```bash
        cp .env.example .env
        
        ```
        
    -   Update the `.env` file with your configuration (see Environment Variables below).
        
4.  **Seed the Database** (optional):
    
    -   Import sample data (users and products):
        
        ```bash
        npm run data:import
        
        ```
        
    -   To clear the database:
        
        ```bash
        npm run data:destroy
        
        ```
        
5.  **Run the Application**:
    
    -   Start both the backend and frontend in development mode:
        
        ```bash
        npm run dev
        
        ```
        
    -   The backend server will run on `http://localhost:5000`, and the frontend will run on `http://localhost:3000`.
        

## Usage

-   **Access the Application**: Open `http://localhost:3000` in your browser to view the frontend.
-   **Admin Panel**: Log in with an admin account to access the admin dashboard at `/admin`.
-   **API Endpoints**: The backend provides RESTful APIs at `http://localhost:5000/api`. Key endpoints include:
    -   `GET /api/products`: List all products.
    -   `POST /api/users/login`: User login.
    -   `POST /api/orders`: Create an order.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend configuration
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id (if applicable)

# Frontend configuration (optional)
REACT_APP_API_URL=http://localhost:5000/api

```

-   `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
-   `JWT_SECRET`: A secure key for signing JWTs (e.g., a random string).
-   `PAYPAL_CLIENT_ID`: Your PayPal client ID for payment integration (if used).

## Project Structure

```
Proshop/
├── backend/
│   ├── config/        # Database configuration
│   ├── controllers/   # Route handlers
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routes
│   ├── middleware/    # Custom middleware (e.g., authentication)
│   └── server.js      # Entry point for the backend
├── frontend/
│   ├── src/           # React source code
│   │   ├── components/ # Reusable React components
│   │   ├── screens/   # Page-level components
│   │   ├── store/     # Redux store and slices
│   └── public/        # Static assets
├── .env              # Environment variables
├── .env.example      # Example environment variables
└── package.json      # Project metadata and scripts

```

## Deployment

To deploy the application:

1.  Build the frontend:
    
    ```bash
    npm run build
    
    ```
    
2.  Deploy to a platform like Heroku, Vercel, or Render:
    
    -   For Heroku, ensure a `Procfile` is set up and use the `postbuild` script.
    -   For Vercel, separate the frontend and backend into distinct repositories if needed.
3.  Set environment variables on the hosting platform.
    

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add your feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

-   Built following the "MERN eCommerce from Scratch" course by Brad Traversy.
-   Uses open-source libraries like React-Bootstrap, Redux Toolkit, and Mongoose.
