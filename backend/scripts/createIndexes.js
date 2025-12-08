const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI ;

async function fixIndexes() {
  try {
    console.log(' Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('sales');

    console.log('\n Current indexes:');
    const currentIndexes = await collection.indexes();
    currentIndexes.forEach(idx => {
      console.log(`  - ${idx.name}`);
    });

    console.log('\n Dropping old indexes...');
    
    try {
      await collection.dropIndex('customerName_text_phoneNumber_text');
      console.log(' Dropped: customerName_text_phoneNumber_text');
    } catch (e) {
      console.log(' (Index not found - might already be deleted)');
    }

    const oldIndexes = [
      'customerName_1',
      'phoneNumber_1',
      'customerRegion_1',
      'customerType_1',
      'productCategory_1',
      'paymentMethod_1',
      'quantity_1',
      'date_-1_quantity_-1',
      'customerRegion_1_gender_1_productCategory_1'
    ];

    for (const indexName of oldIndexes) {
      try {
        await collection.dropIndex(indexName);
        console.log(`✓ Dropped: ${indexName}`);
      } catch (e) {
      }
    }

    console.log('\n Creating new indexes with shortened field names...');

    await collection.createIndex(
      { cname: 'text', phone: 'text' },
      { name: 'cname_text_phone_text' }
    );
    console.log(' Created: cname_text_phone_text');
    await collection.createIndex({ cname: 1 }, { name: 'cname_1' });
    console.log(' Created: cname_1');

    await collection.createIndex({ phone: 1 }, { name: 'phone_1' });
    console.log(' Created: phone_1');

    await collection.createIndex({ region: 1 }, { name: 'region_1' });
    console.log(' Created: region_1');

    await collection.createIndex({ gender: 1 }, { name: 'gender_1' });
    console.log(' Created: gender_1');

    await collection.createIndex({ age: 1 }, { name: 'age_1' });
    console.log(' Created: age_1');

    await collection.createIndex({ category: 1 }, { name: 'category_1' });
    console.log(' Created: category_1');

    await collection.createIndex({ tags: 1 }, { name: 'tags_1' });
    console.log(' Created: tags_1');

    await collection.createIndex({ payment: 1 }, { name: 'payment_1' });
    console.log(' Created: payment_1');

    await collection.createIndex({ date: 1 }, { name: 'date_1' });
    console.log(' Created: date_1');

    await collection.createIndex({ qty: 1 }, { name: 'qty_1' });
    console.log(' Created: qty_1');

    await collection.createIndex({ tid: 1 }, { name: 'tid_1', unique: true });
    console.log(' Created: tid_1 (unique)');

    await collection.createIndex(
      { date: -1, qty: -1 },
      { name: 'date_-1_qty_-1' }
    );
    console.log(' Created: date_-1_qty_-1');

    await collection.createIndex(
      { region: 1, gender: 1, category: 1 },
      { name: 'region_1_gender_1_category_1' }
    );
    console.log(' Created: region_1_gender_1_category_1');

    console.log('\n New indexes:');
    const newIndexes = await collection.indexes();
    newIndexes.forEach(idx => {
      console.log(`  - ${idx.name}`);
    });

    console.log('\n All indexes updated successfully!');
    console.log(' Search should now be fast again!\n');

    await mongoose.connection.close();
    console.log(' Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error(' Error:', error);
    process.exit(1);
  }
}

fixIndexes();