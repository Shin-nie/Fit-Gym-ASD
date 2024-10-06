const express = require('express');
const router = express.Router();
const { Customer, Workout, Set, Exercise, PaymentCard } = require('../models');

// Fetch all customers with associated workouts, sets, and exercises
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: Workout,
          include: [
            {
              model: Set,
              include: [Exercise]
            }
          ]
        }
      ]
    });
    res.json(customers); // Send the data to the frontend
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Error retrieving customers' });
  }
});

// Fetch a single customer by ID with associated workouts, sets, and exercises
router.get('/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Workout,
          include: [
            {
              model: Set,
              include: [Exercise]
            }
          ]
        }
      ]
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer); // Send the customer data to the frontend
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json({ error: 'Error retrieving customer' });
  }
});

// Update an existing customer by ID
router.put('/customers/:id', async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email_address,
    phone_number,
    date_of_birth,
    gender,
    street_address,
    city,
    state,
    zip_code,
    country,
    username,
    password
  } = req.body;

  try {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Update customer details
    await customer.update({
      first_name,
      last_name,
      email_address,
      phone_number,
      date_of_birth,
      gender,
      street_address,
      city,
      state,
      zip_code,
      country,
      username,
      password
    });

    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Error updating customer' });
  }
});

// Creates a new customer and adds payment card details
router.post('/customers', async (req, res) => {
  const {
    first_name,
    last_name,
    email_address,
    phone_number,
    date_of_birth,
    gender,
    street_address,
    city,
    state,
    zip_code,
    country,
    username,
    password,
    name_on_card,
    card_number,
    cvv,
    expiration_date
  } = req.body;

  try {
    const newCustomer = await Customer.create({
      first_name,
      last_name,
      email_address,
      phone_number,
      date_of_birth,
      gender,
      street_address,
      city,
      state,
      zip_code,
      country,
      username,
      password
    });

    const newPaymentCard = await PaymentCard.create({
      name_on_card,
      card_number,
      cvv,
      expiration_date,
      customer_id: newCustomer.customer_id
    });

    res.status(201).json({ 
      message: 'Customer created successfully', 
      newCustomer, 
      newPaymentCard 
    });
    
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Error creating customer' });
  }
});


// Delete an existing customer by ID
router.delete('/customers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Delete the customer
    await customer.destroy();

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Error deleting customer' });
  }
});

  // Fetch all workouts and sets for a specific customer by customer_id
router.get('/customers/:customerId/workouts', async (req, res) => {
  const { customerId } = req.params; // Get customer ID from the route parameters
  
  try {
    const customerWorkouts = await Workout.findAll({
      where: { customer_id: customerId }, // Filter by customer_id
      include: [
        {
          model: Set,
          include: [Exercise], // Include associated sets and exercises
        },
      ],
    });

    if (!customerWorkouts.length) {
      return res.status(404).json({ message: 'No workouts found for this customer' });
    }

    res.json(customerWorkouts); // Send the data to the frontend
  } catch (error) {
    console.error('Error fetching workouts for customer:', error);
    res.status(500).json({ error: 'Error retrieving workouts' });
  }
});

module.exports = router;