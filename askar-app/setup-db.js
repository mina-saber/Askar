import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wozumoezoshumzcjegku.supabase.co',
  'sb_publishable_GMmV5sRZJENCAKPYFusVLg_WE3IY39F'
);

async function setup() {
  // 1. Add 'colors' column to products table via RPC (SQL)
  console.log('--- Adding colors column to products table ---');
  const { error: alterError } = await supabase.rpc('exec_sql', {
    query: `ALTER TABLE products ADD COLUMN IF NOT EXISTS colors jsonb DEFAULT '[]'::jsonb;`
  });
  
  if (alterError) {
    console.log('RPC exec_sql not available, will try direct approach:', alterError.message);
    console.log('NOTE: You need to run this SQL manually in Supabase Dashboard > SQL Editor:');
    console.log('  ALTER TABLE products ADD COLUMN IF NOT EXISTS colors jsonb DEFAULT \'[]\'::jsonb;');
  } else {
    console.log('Colors column added successfully!');
  }

  // 2. Add categories: T-Shirts and Pants
  console.log('\n--- Adding categories ---');
  const { data: catData, error: catError } = await supabase.from('categories').insert([
    { name: 'T-Shirts' },
    { name: 'Pants' },
  ]).select();
  
  if (catError) {
    console.log('Category insert error:', catError.message);
  } else {
    console.log('Categories added:', JSON.stringify(catData, null, 2));
  }

  // 3. Verify categories
  const { data: allCats } = await supabase.from('categories').select('*');
  console.log('\n--- All categories now ---');
  console.log(JSON.stringify(allCats, null, 2));
}

setup();
