import {
	mysqlTable,
	serial,
	text,
	int,
	varchar,
	datetime,
	timestamp,
	json,
	decimal,
	boolean
} from 'drizzle-orm/mysql-core';

export const products = mysqlTable('products', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull(),
	description: varchar('description', { length: 255 }),
	selling_status: varchar('selling_status', { length: 255 }).notNull(),
	is_isolated: boolean('is_isolated').notNull().default(false).notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow()
});

export const product_variations = mysqlTable('product_variations', {
	id: int('id').primaryKey().autoincrement(),
	product_id: int('product_id')
		.notNull()
		.references(() => products.id),
	// color: varchar('color', { length: 255 }),
	// length: int('length'),
	// type: varchar('type', { length: 255 }),
	thickness: varchar('thickness', { length: 255 }), // Column for wire thickness
	price: int('price').notNull(),
	discount_percentage: decimal('discount_percentage', { precision: 5, scale: 2 }) // Column for discount percentage
		.default('0'), // Default discount to 0%
	created_at: timestamp('uploaded_on').notNull().defaultNow()
});

export const customers = mysqlTable('customers', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }),
	email: varchar('email', { length: 255 }),
	phone: varchar('phone', { length: 255 }).notNull(),
	address: text('address'),
	gstin: text('gstin'),
	password: varchar('password', { length: 255 }),
	sessionId: varchar('sessionId', { length: 255 }),
	sessionEOL: datetime('sessionEOL'),
	created_at: timestamp('uploaded_on').notNull().defaultNow()
});

export const orders = mysqlTable('orders', {
	id: int('id').primaryKey().autoincrement(),
	customer_id: int('customer_id')
		.notNull()
		.references(() => customers.id),
	orderData: json('orderData').notNull(),
	amount: int('amount').notNull(),
	co_phone: varchar('co_phone', { length: 255 }).notNull(),
	co_name: varchar('co_name', { length: 255 }).notNull(),
	co_address: text('co_address').notNull(),
	co_email: varchar('co_email', { length: 255 }),
	co_gstin: text('co_gstin'),

	// delivery details
	delivery_address: text('delivery_address').notNull(),
	delivery_phone: varchar('delivery_phone', { length: 255 }).notNull(),
	partner_code: varchar('partner_code', { length: 255 }),
	pincode: int('pincode').notNull(),

	delivery_notes: text('delivery_notes'),
	delivery_date: datetime('delivery_date'),

	payment_type: varchar('payment_type', { length: 255 }).notNull(),
	payment_status: varchar('payment_status', { length: 255 }),

	razorpay_payment_id: varchar('razorpay_payment_id', { length: 255 }),

	razorpay_order_id: varchar('razorpay_order_id', { length: 255 }),

	razorpay_signature: varchar('razorpay_signature', { length: 255 }),

	order_status: varchar('order_status', { length: 255 }).notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow()
});

export const store_managers = mysqlTable('store_managers', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }),
	phone: varchar('phone', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	sessionId: varchar('sessionId', { length: 255 }),
	sessionEOL: datetime('sessionEOL'),
	created_at: timestamp('uploaded_on').notNull().defaultNow()
});

export const partners = mysqlTable('partners', {
	id: int('id').primaryKey().autoincrement(),
	partner_name: varchar('partner_name', { length: 255 }).notNull(),
	partner_phone: varchar('partner_phone', { length: 255 }).notNull(),
	partner_code: varchar('partner_code', { length: 255 }).notNull().unique(),
	overall_discount: decimal('overall_discount', { precision: 5, scale: 2 }).default('0'),
	created_at: timestamp('uploaded_on').notNull().defaultNow()
});

export const deliverable_pincodes = mysqlTable('deliverable_pincodes', {
	id: int('id').primaryKey().autoincrement(),
	pincode: int('pincode').notNull(),
	delivery_charge: decimal('delivery_charge', { precision: 5, scale: 2 }).notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow()
});

export const otps = mysqlTable('otps', {
	id: int('id').primaryKey().autoincrement(),

	customer: int('customer')
		.notNull()
		.references(() => customers.id),

	otp: varchar('otp', { length: 255 }).notNull(),
	created_at: timestamp('uploaded_on').notNull().defaultNow()
});
