require('dotenv/config');

console.log('🔍 Environment Variable Test');
console.log('==============================');

// Test Supabase credentials
console.log('\n📊 Supabase Configuration:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');

// Test Stripe credentials  
console.log('\n💳 Stripe Configuration:');
console.log('STRIPE_PUBLIC_KEY:', process.env.STRIPE_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');

// Test LLM credentials
console.log('\n🤖 LLM API Keys:');
console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '✅ Set' : '❌ Missing (placeholder expected)');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing (placeholder expected)');
console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing (placeholder expected)');

// Mock detection
console.log('\n🎯 Mock Detection:');
const isSupabaseMock = !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;
const isStripeMock = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('mock');

console.log('Supabase Mock Mode:', isSupabaseMock ? '❌ YES (should be NO)' : '✅ NO (real mode)');
console.log('Stripe Mock Mode:', isStripeMock ? '❌ YES (should be NO with real keys)' : '✅ NO (real mode)');

