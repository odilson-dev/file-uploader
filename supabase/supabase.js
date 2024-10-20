// supabase.js
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL; // My Supabase URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // My Supabase API Key

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
