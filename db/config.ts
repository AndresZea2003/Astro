import { defineDb, defineTable, column } from 'astro:db';

const Product = defineTable({
  columns: {
    name: column.text(),
    price: column.number(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: { Product },
});
