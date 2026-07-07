const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    const { data, error } = await supabase
        .from('orders')
        .insert({
            customer_name: "Test",
            customer_phone: "123",
            customer_address: "Test, City, Country",
            total_amount: 100,
            status: 'pending'
        })
        .select();

    console.log("Error:", JSON.stringify(error, null, 2));
    console.log("Data:", data);
}

testInsert();
