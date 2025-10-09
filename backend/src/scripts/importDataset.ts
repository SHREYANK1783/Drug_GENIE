import mongoose from 'mongoose';
import Medicine from '../models/medicineModel';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const importDataset = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    // Path to your dataset file (adjust as needed)
    const datasetPath = path.join(__dirname, '../../data/medicines.json');
    
    if (!fs.existsSync(datasetPath)) {
      console.log(`Dataset file not found at: ${datasetPath}`);
      console.log('Please place your dataset file at this location or update the path.');
      return;
    }

    // Read and parse the dataset
    const rawData = fs.readFileSync(datasetPath, 'utf8');
    const medicines = JSON.parse(rawData);

    console.log(`Found ${medicines.length} medicines to import`);

    // Clear existing data in libraryDataSet
    await Medicine.deleteMany({});
    console.log('Cleared existing data');

    // Import new data
    const result = await Medicine.insertMany(medicines);
    console.log(`Successfully imported ${result.length} medicines`);

    await mongoose.connection.close();
    console.log('Database connection closed');                 
  } catch (error) {
    console.error('Error importing dataset:', error);                          
    process.exit(1);
  }
};

// Run the script
importDataset();
