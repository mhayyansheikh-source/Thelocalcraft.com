const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const { data, error } = await supabase.auth.signUp({
        email: 'muhammadnumanlatif@gmail.com',
        password: '998877',
        options: {
            data: {
                full_name: 'mnumanlatif'
            }
        }
    });

    if (error) {
        console.error("Error signing up:", error);
    } else {
        console.log("User signed up successfully:", data.user?.id);
    }
}

createAdmin();
