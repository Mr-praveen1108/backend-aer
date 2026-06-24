require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectDB = require('../config/db');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Shipment = require('../models/Shipment');
const DeliveryUpdate = require('../models/DeliveryUpdate');
const generateTrackingNumber = require('../utils/generateTrackingNumber');

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Vehicle.deleteMany(),
      Driver.deleteMany(),
      Shipment.deleteMany(),
      DeliveryUpdate.deleteMany(),
    ]);

    console.log('Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@cargodelivery.com',
      password: 'admin123',
      role: 'admin',
    });

    const customer = await User.create({
      name: 'John Customer',
      email: 'customer@cargodelivery.com',
      password: 'customer123',
      role: 'customer',
    });

    const customer2 = await User.create({
      name: 'Sarah Wilson',
      email: 'sarah@cargodelivery.com',
      password: 'customer123',
      role: 'customer',
    });

    await User.create({
      name: 'Mike Driver',
      email: 'driver@cargodelivery.com',
      password: 'driver123',
      role: 'driver',
    });

    console.log('Creating vehicles...');
    const vehicles = await Vehicle.insertMany([
      { vehicle_number: 'TRK-001', vehicle_type: 'truck', capacity: 5000, status: 'available' },
      { vehicle_number: 'VAN-002', vehicle_type: 'van', capacity: 1500, status: 'available' },
      { vehicle_number: 'PKP-003', vehicle_type: 'pickup', capacity: 800, status: 'in_use' },
      { vehicle_number: 'TRL-004', vehicle_type: 'trailer', capacity: 10000, status: 'available' },
      { vehicle_number: 'CNT-005', vehicle_type: 'container', capacity: 20000, status: 'maintenance' },
    ]);

    console.log('Creating drivers...');
    const drivers = await Driver.insertMany([
      { name: 'James Anderson', phone: '+1-555-0101', license_number: 'DL-10001', vehicle_id: vehicles[0]._id },
      { name: 'Robert Taylor', phone: '+1-555-0102', license_number: 'DL-10002', vehicle_id: vehicles[1]._id },
      { name: 'David Martinez', phone: '+1-555-0103', license_number: 'DL-10003', vehicle_id: vehicles[2]._id },
      { name: 'Chris Johnson', phone: '+1-555-0104', license_number: 'DL-10004', vehicle_id: null },
    ]);

    console.log('Creating shipments...');
    const shipmentData = [
      {
        sender_name: 'Acme Corp',
        sender_phone: '+1-555-1001',
        receiver_name: 'Beta Industries',
        receiver_phone: '+1-555-2001',
        pickup_address: '123 Industrial Ave, New York, NY',
        delivery_address: '456 Commerce St, Boston, MA',
        cargo_type: 'Electronics',
        weight: 250,
        price: 1500,
        status: 'delivered',
        created_by: customer._id,
        driver_id: drivers[0]._id,
      },
      {
        sender_name: 'Global Traders',
        sender_phone: '+1-555-1002',
        receiver_name: 'Metro Retail',
        receiver_phone: '+1-555-2002',
        pickup_address: '789 Warehouse Blvd, Chicago, IL',
        delivery_address: '321 Market Rd, Detroit, MI',
        cargo_type: 'Furniture',
        weight: 800,
        price: 3200,
        status: 'in_transit',
        created_by: customer._id,
        driver_id: drivers[1]._id,
      },
      {
        sender_name: 'Fresh Foods Inc',
        sender_phone: '+1-555-1003',
        receiver_name: 'City Grocers',
        receiver_phone: '+1-555-2003',
        pickup_address: '555 Farm Lane, Austin, TX',
        delivery_address: '888 Store Front, Houston, TX',
        cargo_type: 'Perishable Goods',
        weight: 400,
        price: 980,
        status: 'pending',
        created_by: customer2._id,
        driver_id: null,
      },
      {
        sender_name: 'Tech Solutions',
        sender_phone: '+1-555-1004',
        receiver_name: 'Data Center LLC',
        receiver_phone: '+1-555-2004',
        pickup_address: '100 Silicon Valley, San Jose, CA',
        delivery_address: '200 Server Park, Seattle, WA',
        cargo_type: 'Server Equipment',
        weight: 1200,
        price: 5500,
        status: 'in_transit',
        created_by: customer2._id,
        driver_id: drivers[2]._id,
      },
      {
        sender_name: 'Fashion Hub',
        sender_phone: '+1-555-1005',
        receiver_name: 'Style Boutique',
        receiver_phone: '+1-555-2005',
        pickup_address: '777 Design District, Los Angeles, CA',
        delivery_address: '999 Fashion Ave, Miami, FL',
        cargo_type: 'Clothing',
        weight: 150,
        price: 750,
        status: 'delivered',
        created_by: customer._id,
        driver_id: drivers[0]._id,
      },
      {
        sender_name: 'Auto Parts Co',
        sender_phone: '+1-555-1006',
        receiver_name: 'Mechanic Shop',
        receiver_phone: '+1-555-2006',
        pickup_address: '444 Parts Way, Denver, CO',
        delivery_address: '666 Repair St, Phoenix, AZ',
        cargo_type: 'Auto Parts',
        weight: 600,
        price: 2100,
        status: 'pending',
        created_by: customer._id,
        driver_id: null,
      },
      {
        sender_name: 'Book Publishers',
        sender_phone: '+1-555-1007',
        receiver_name: 'University Library',
        receiver_phone: '+1-555-2007',
        pickup_address: '333 Print House, Portland, OR',
        delivery_address: '111 Campus Dr, San Francisco, CA',
        cargo_type: 'Books',
        weight: 300,
        price: 450,
        status: 'cancelled',
        created_by: customer2._id,
        driver_id: null,
      },
    ];

    for (const data of shipmentData) {
      const tracking_number = generateTrackingNumber();
      const shipment = await Shipment.create({ ...data, tracking_number });

      const updates = [
        { shipment_id: shipment._id, status: 'pending', location: data.pickup_address },
      ];

      if (data.status === 'in_transit' || data.status === 'delivered') {
        updates.push({
          shipment_id: shipment._id,
          driver_id: data.driver_id,
          status: 'in_transit',
          location: 'En route to destination',
        });
      }

      if (data.status === 'delivered') {
        updates.push({
          shipment_id: shipment._id,
          driver_id: data.driver_id,
          status: 'delivered',
          location: data.delivery_address,
        });
      }

      if (data.status === 'cancelled') {
        updates.push({
          shipment_id: shipment._id,
          status: 'cancelled',
          location: data.pickup_address,
        });
      }

      await DeliveryUpdate.insertMany(updates);
    }

    console.log('\n✅ Seed data created successfully!\n');
    console.log('Login credentials:');
    console.log('  Admin:    admin@cargodelivery.com / admin123');
    console.log('  Customer: customer@cargodelivery.com / customer123');
    console.log('  Driver:   driver@cargodelivery.com / driver123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
