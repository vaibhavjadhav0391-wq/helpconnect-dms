require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const Shelter = require('../models/Shelter');

const hospitals = [
  {
    name: 'KEM Hospital',
    address: 'Parel, Mumbai',
    district: 'Mumbai',
    phone: '+91 22-2410-7000',
    email: 'kem.mumbai@health.in',
    seats: 1200,
    description: '24x7 emergency care, trauma center.'
  },
  {
    name: 'Sassoon General Hospital',
    address: 'Pune',
    district: 'Pune',
    phone: '+91 20-2612-8000',
    email: 'sassoon.pune@health.in',
    seats: 900,
    description: 'Multi-specialty government hospital.'
  },
  {
    name: 'Civil Hospital',
    address: 'Nagpur',
    district: 'Nagpur',
    phone: '+91 712-256-5000',
    email: 'civil.nagpur@health.in',
    seats: 800,
    description: 'Emergency and outpatient services.'
  },
  {
    name: 'City Trauma Center',
    address: 'Andheri, Mumbai',
    district: 'Mumbai',
    phone: '+91 22-2877-4400',
    email: 'trauma.mumbai@health.in',
    seats: 450,
    description: 'Advanced trauma and ICU facilities.'
  },
  {
    name: 'Sunrise Hospital',
    address: 'Aundh, Pune',
    district: 'Pune',
    phone: '+91 20-2729-9000',
    email: 'sunrise.pune@health.in',
    seats: 320,
    description: 'Community healthcare and diagnostics.'
  }
];

const shelters = [
  {
    name: 'Nehru Stadium Shelter',
    address: 'Worli, Mumbai',
    district: 'Mumbai',
    phone: '+91 22-2493-7000',
    email: 'worli.shelter@support.in',
    seats: 350,
    description: 'Temporary shelter with food support.'
  },
  {
    name: 'Kothrud Community Shelter',
    address: 'Kothrud, Pune',
    district: 'Pune',
    phone: '+91 20-2539-4000',
    email: 'kothrud.shelter@support.in',
    seats: 220,
    description: 'Community hall converted into shelter.'
  },
  {
    name: 'Nagpur Relief Shelter',
    address: 'Sitabuldi, Nagpur',
    district: 'Nagpur',
    phone: '+91 712-254-1122',
    email: 'nagpur.shelter@support.in',
    seats: 180,
    description: 'Short-term shelter for displaced families.'
  },
  {
    name: 'Coastal Relief Camp',
    address: 'Panaji, Goa',
    district: 'Goa',
    phone: '+91 832-226-1000',
    email: 'goa.shelter@support.in',
    seats: 260,
    description: 'Cyclone relief camp with medical help.'
  },
  {
    name: 'Riverbank Shelter',
    address: 'Nashik',
    district: 'Nashik',
    phone: '+91 253-243-9090',
    email: 'nashik.shelter@support.in',
    seats: 140,
    description: 'Flood response shelter center.'
  }
];

const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Check server/.env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

  await Hospital.deleteMany({});
  await Shelter.deleteMany({});

  await Hospital.insertMany(hospitals);
  await Shelter.insertMany(shelters);

  await mongoose.disconnect();
  console.log('Facility demo reset complete: 5 hospitals and 5 shelters added.');
};

run().catch((error) => {
  console.error('Facility demo reset failed:', error);
  mongoose.disconnect();
});
