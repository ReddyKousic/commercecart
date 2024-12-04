import { mysqlTable, serial, text, int, varchar, datetime, timestamp, json } from 'drizzle-orm/mysql-core';

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
	price: int('price').notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow(),
});

export const customers = mysqlTable('customers', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 255 }).notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow(),
});

export const generated_quotes = mysqlTable('generated_quotes', {
	id: int('id').primaryKey().autoincrement(),
	customer_id: int('customer_id').notNull().references(() => customers.id),
	quote: json('quote').notNull(),
	quantity: int('quantity').notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow(),
});

export const orders = mysqlTable('orders', {
	id: int('id').primaryKey().autoincrement(),
	customer_id: int('customer_id').notNull().references(() => customers.id),
	quote_id: int('quote_id').notNull().references(() => generated_quotes.id),
	amount: int('amount').notNull(),
	payment_type: varchar('payment_type', { length: 255 }).notNull(),
	order_status: varchar('order_status', { length: 255 }).notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow(),
});