import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wozumoezoshumzcjegku.supabase.co';
const supabaseKey = 'sb_publishable_GMmV5sRZJENCAKPYFusVLg_WE3IY39F';


const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const testOrder = {
    customer_name: 'Test Name',
    phone: '01000000000',
    address: 'Test Address',
    notes: 'Some notes',
    quantity: 1,
    status: 'pending'
  };

  const { data, error } = await supabase.from('orders').insert([testOrder]);
  console.log('Result:', { data, error });
}

testInsert();
