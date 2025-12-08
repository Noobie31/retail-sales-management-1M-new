const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const cliProgress = require('cli-progress');
const Sales = require('../src/models/Sales');

const MONGODB_URI = process.env.MONGODB_URI ;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

function parseDate(dateStr) {
  const formats = [
    () => new Date(dateStr),
    () => {
      const [year, month, day] = dateStr.split('-');
      return new Date(year, month - 1, day);
    }
  ];
  
  for (const format of formats) {
    try {
      const date = format();
      if (!isNaN(date.getTime())) return date;
    } catch (e) {}
  }
  
  return new Date();
}

function transformRow(row) {
  return {
    tid: row['Transaction ID'] || row['transaction_id'] || row['TransactionID'] || row.tid,
    
    cid: row['Customer ID'] || row['customer_id'] || row.cid,
    cname: row['Customer Name'] || row['customer_name'] || row.cname,
    phone: row['Phone Number'] || row['phone_number'] || row.phone,
    gender: row['Gender'] || row.gender,
    age: parseInt(row['Age'] || row.age) || 0,
    region: row['Customer Region'] || row['customer_region'] || row.region,
    ctype: row['Customer Type'] || row['customer_type'] || row.ctype,
    
    pid: row['Product ID'] || row['product_id'] || row.pid,
    pname: row['Product Name'] || row['product_name'] || row.pname,
    brand: row['Brand'] || row.brand,
    category: row['Product Category'] || row['product_category'] || row.category,
    tags: (row['Tags'] || row.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    
    qty: parseInt(row['Quantity'] || row.quantity || row.qty) || 1,
    price: parseFloat(row['Price per Unit'] || row['price_per_unit'] || row.price) || 0,
    discount: parseFloat(row['Discount Percentage'] || row['discount_percentage'] || row.discount) || 0,
    total: parseFloat(row['Total Amount'] || row['total_amount'] || row.total) || 0,
    final: parseFloat(row['Final Amount'] || row['final_amount'] || row.final) || 0,
    
    date: parseDate(row['Date'] || row.date),
    payment: row['Payment Method'] || row['payment_method'] || row.payment,
    status: row['Order Status'] || row['order_status'] || row.status,
    delivery: row['Delivery Type'] || row['delivery_type'] || row.delivery,
    sid: row['Store ID'] || row['store_id'] || row.sid,
    sloc: row['Store Location'] || row['store_location'] || row.sloc,
    spid: row['Salesperson ID'] || row['salesperson_id'] || row.spid,
    ename: row['Employee Name'] || row['employee_name'] || row.ename
  };
}

async function importCSV(filePath) {
  const batchSize = 10000;
  let batch = [];
  let totalCount = 0;
  let errorCount = 0;

  const progressBar = new cliProgress.SingleBar({
    format: 'Import Progress |{bar}| {percentage}% | {value}/{total} records | Errors: {errors}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });

  console.log('Analyzing CSV file...');
  const totalLines = await new Promise((resolve) => {
    let count = 0;
    fs.createReadStream(filePath)
      .on('data', (chunk) => {
        count += chunk.toString().split('\n').length;
      })
      .on('end', () => resolve(count - 1));
  });

  progressBar.start(totalLines, 0, { errors: 0 });

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const transformedData = transformRow(row);
          batch.push(transformedData);

          if (batch.length >= batchSize) {
            stream.pause();

            try {
              await Sales.insertMany(batch, { ordered: false });
              totalCount += batch.length;
              progressBar.update(totalCount, { errors: errorCount });
              batch = [];
              stream.resume();
            } catch (error) {
              if (error.writeErrors) {
                errorCount += error.writeErrors.length;
                totalCount += batch.length - error.writeErrors.length;
              } else {
                errorCount += batch.length;
              }
              progressBar.update(totalCount, { errors: errorCount });
              batch = [];
              stream.resume();
            }
          }
        } catch (error) {
          errorCount++;
          progressBar.update(totalCount, { errors: errorCount });
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          try {
            await Sales.insertMany(batch, { ordered: false });
            totalCount += batch.length;
          } catch (error) {
            if (error.writeErrors) {
              errorCount += error.writeErrors.length;
              totalCount += batch.length - error.writeErrors.length;
            }
          }
        }

        progressBar.update(totalCount, { errors: errorCount });
        progressBar.stop();

        console.log('\nImport completed!');
        console.log(`  Total records: ${totalCount}`);
        console.log(`  Errors: ${errorCount}`);
        
        console.log('Creating indexes...');
        await Sales.createIndexes();
        console.log('Indexes created');
        
        resolve({ totalCount, errorCount });
      })
      .on('error', (error) => {
        progressBar.stop();
        reject(error);
      });
  });
}

async function clearDatabase() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    readline.question('Clear existing data? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        await Sales.deleteMany({});
        console.log('Database cleared');
      }
      readline.close();
      resolve();
    });
  });
}

async function main() {
  const csvFilePath = process.argv[2] || './sales_data.csv';

  if (!fs.existsSync(csvFilePath)) {
    console.error(`File not found: ${csvFilePath}`);
    console.log('Usage: node importData.js <path-to-csv-file>');
    process.exit(1);
  }

  console.log('Starting CSV import...');
  console.log(`File: ${csvFilePath}\n`);

  await connectDB();
  await clearDatabase();
  
  const startTime = Date.now();
  const result = await importCSV(csvFilePath);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\nDuration: ${duration}s`);
  console.log(`Speed: ${Math.floor(result.totalCount / duration)} records/sec`);

  await mongoose.connection.close();
  console.log('Database connection closed');
  process.exit(0);
}

main().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});