const fs = require('fs');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const reviewModel = require('../models/review.model');

dotenv.config({path: '../.env'});

const {
    db: {host, name},
} = require('../configs/config.mongodb');

const connectString = `${host}/${name}?retryWrites=true&w=majority`;

mongoose
    .connect(connectString)
    .then((_) => {
        console.log(`Connected Mongodb Successfully`);
    })
    .catch((err) => console.log(`Error connect Mongodb: ${err}`));

// READ JSON FILE
const categories = JSON.parse(fs.readFileSync(`./category.json`, 'utf-8'));
const cakes = JSON.parse(fs.readFileSync(`./cake.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`./review.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await categoryModel.create(categories);
    await productModel.create(cakes);
    await reviewModel.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await categoryModel.deleteMany();
    await productModel.deleteMany();
    await reviewModel.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}