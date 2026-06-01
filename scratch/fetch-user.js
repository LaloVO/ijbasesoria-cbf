const BASE_URL = 'https://app.homepty.com/api/cbf';
const API_KEY = 'cbf_live_89fac2fb-ee78-4d40-8c73-5a75977c2dbe';

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
