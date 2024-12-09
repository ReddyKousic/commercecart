import { mysqlTable, serial, text, int, varchar, datetime, timestamp, json, decimal } from 'drizzle-orm/mysql-core';

export const products = mysqlTable('products', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull(),
	description: varchar('description', { length: 255 }),
	selling_status: varchar('selling_status', { length: 255 }).notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow(),
});

export const product_variations = mysqlTable('product_variations', {
	id: int('id').primaryKey().autoincrement(),
	product_id: int('product_id').notNull().references(() => products.id),
	color: varchar('color', { length: 255 }),
	length: int('length'),
	type: varchar('type', { length: 255 }),
	thickness: varchar('thickness', { length: 255 }), // Column for wire thickness
	price: int('price').notNull(),
	discount_percentage: decimal('discount_percentage', { precision: 5, scale: 2 }) // Column for discount percentage
		.default('0'), // Default discount to 0%
	created_at: timestamp('uploaded_on').notNull().defaultNow(),
});


export const customers = mysqlTable('customers', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }),
	phone: varchar('phone', { length: 255 }).notNull(),
	address: text('address'),
	password: varchar('password', { length: 255 }).notNull(),
	sessionId: varchar('sessionId', { length: 255 }),
	sessionEOL: datetime('sessionEOL'),
	created_at: timestamp('uploaded_on').notNull().defaultNow(),
});


export const orders = mysqlTable('orders', {
	id: int('id').primaryKey().autoincrement(),
	customer_id: int('customer_id').notNull().references(() => customers.id),
	orderData: json('orderData').notNull(),
	amount: int('amount').notNull(),
	co_phone: varchar('co_phone', { length: 255 }).notNull(),
	co_name: varchar('co_name', { length: 255 }).notNull(),
	co_address: text('co_address').notNull(),
	co_email: varchar('co_email', { length: 255 }),
	delivery_notes: text('delivery_notes'),
	delivery_date: datetime('delivery_date'),
	
	payment_type: varchar('payment_type', { length: 255 }).notNull(),
	order_status: varchar('order_status', { length: 255 }).notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow(),
});

export const store_managers = mysqlTable('store_managers', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }),
	phone: varchar('phone', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	sessionId: varchar('sessionId', { length: 255 }),
	sessionEOL: datetime('sessionEOL'),
	created_at: timestamp('uploaded_on').notNull().defaultNow(),
});