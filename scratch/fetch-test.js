const BASE_URL = 'https://homepty-cbf-tite-testing-chi.vercel.app/api/cbf';
const API_KEY = 'cbf_live_89fac2fb-ee78-4d40-8c73-5a75977c2dbe';

async function main() {
  try {
    const res = await fetch(`${BASE_URL}/properties?limit=100`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      console.error('Error fetching properties:', res.status, res.statusText);
      return;
    }
    
    const json = await res.json();
    const props = json.data || [];
    
    console.log(`Loaded ${props.length} properties.`);
    
    props.forEach(p => {
      console.log(`- ID: ${p.id} | Name: ${p.nombre} | Action Type: ${p.id_tipo_accion} | Type: ${p.tipo} | Price: ${p.precio}`);
    });
  } catch (err) {
    console.error('Failed:', err);
  }
}

main();
