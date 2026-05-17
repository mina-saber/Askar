import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wozumoezoshumzcjegku.supabase.co',
  'sb_publishable_GMmV5sRZJENCAKPYFusVLg_WE3IY39F'
);

async function test() {
  // 1. Check if colors column exists by trying to update a product
  const { data: products } = await supabase.from('products').select('id, name, colors, is_visible').limit(3);
  console.log('--- Existing products (first 3) ---');
  console.log(JSON.stringify(products, null, 2));

  // 2. Try updating colors on the first product
  if (products && products.length > 0) {
    const firstId = products[0].id;
    console.log(`\n--- Trying to update colors on product ${firstId} ---`);
    const { data, error } = await supabase.from('products').update({ colors: ['Black', 'White'] }).eq('id', firstId).select();
    console.log('Update result:', JSON.stringify({ data, error }, null, 2));
  }

  // 3. Try inserting a test product
  console.log('\n--- Trying to insert a test product ---');
  const { data: insertData, error: insertError } = await supabase.from('products').insert({
    name: 'TEST PRODUCT DELETE ME',
    price: 100,
    colors: ['Red', 'Blue'],
    sizes: ['M', 'L'],
    stock_quantity: 5,
    is_new: false,
    is_sale: false,
    images: [],
  }).select();
  console.log('Insert result:', JSON.stringify({ data: insertData, error: insertError }, null, 2));

  // 4. Check categories
  const { data: cats } = await supabase.from('categories').select('*');
  console.log('\n--- Categories ---');
  console.log(JSON.stringify(cats, null, 2));
}

test();
