import { db, Product } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	// TODO
	await db.insert(Product).values([
		{ name: 'Producto 1', body: 'Base cama 1.00' },
		{ name: 'Yepa', body: 'Finlo!'},
	  ])
}

