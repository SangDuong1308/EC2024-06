const chalk = require('chalk');
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');

const { ROLES } = require('../constants');
const userModel = require('../models/user.model');

const { db: { host, name } } = require('../configs/config.mongodb');

const connectString = `${host}/${name}?retryWrites=true&w=majority`;

async function setupDB() {
  try {
    // Establish MongoDB connection
    await mongoose.connect(connectString);
    console.log(`${chalk.green('✓')} ${chalk.green('Connected to MongoDB successfully')}`);
  } catch (err) {
    console.error(`${chalk.red('x')} ${chalk.red('Error connecting to MongoDB:')}`, err);
    process.exit(1); // Exit the process with a failure code if connection fails
  }
}

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

const seedDB = async () => {
  try {
    console.log(`${chalk.blue('✓')} ${chalk.blue('seed db started')}`);

    if (!email || !password) throw new Error('missing arguments');

    const user = new userModel({
      email,
      password,
      name: 'admin',
      verify: true,
      role: ROLES.Admin
    });

    const existingUser = await userModel.findOne({ email: user.email });
    console.log('existingUser', existingUser);
    if (existingUser) throw new Error('user collection is seeded!');

    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;

    await user.save();

    console.log(`${chalk.green('✓')} ${chalk.green('seed db finished')}`);
  } catch (error) {
    console.log(
      `${chalk.red('x')} ${chalk.red('error while seeding database')}`
    );
    console.log(error);
    return null;
  } finally {
    await mongoose.connection.close();
    console.log(`${chalk.green('✓')} ${chalk.green('MongoDB connection closed')}`);
  }
};

(async () => {
  await setupDB().then(async () => {
    await seedDB();
  });
})();
