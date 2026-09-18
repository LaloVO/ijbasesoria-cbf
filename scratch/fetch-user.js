const BASE_URL = 'https://app.homepty.com/api/cbf';
const API_KEY = process.env.VITE_CBF_API_KEY;

if (!API_KEY) throw new Error('VITE_CBF_API_KEY is required');

async function main() {
  try {
    const res = await fetch(`${BASE_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', res.status, res.statusText);
    const json = await res.json();
    console.log('Result:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Failed:', err);
  }
}

main();
