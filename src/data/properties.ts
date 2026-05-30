export interface Property {
  id: string;
  title: string;
  location: string;
  area: string;
  price: string;
  priceValue: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  type: 'casa' | 'departamento' | 'penthouse' | 'terreno';
  coordinates: { lat: number; lng: number };
  featured?: boolean;
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'Residencia Lomas',
    location: 'Ciudad de México',
    area: 'Lomas de Chapultepec',
    price: '$2.4M USD',
    priceValue: 2400000,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop',
    bedrooms: 5,
    bathrooms: 6,
    sqm: 650,
    type: 'casa',
    coordinates: { lat: 19.4284, lng: -99.2119 },
    featured: true,
  },
  {
    id: '2',
    title: 'Penthouse Reforma',
    location: 'Ciudad de México',
    area: 'Polanco',
    price: '$1.8M USD',
    priceValue: 1800000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
    bedrooms: 4,
    bathrooms: 4,
    sqm: 420,
    type: 'penthouse',
    coordinates: { lat: 19.4320, lng: -99.1937 },
    featured: true,
  },
  {
    id: '3',
    title: 'Finca Valle',
    location: 'Estado de México',
    area: 'Valle de Bravo',
    price: '$3.2M USD',
    priceValue: 3200000,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
    bedrooms: 6,
    bathrooms: 7,
    sqm: 1200,
    type: 'casa',
    coordinates: { lat: 19.1944, lng: -100.1333 },
    featured: true,
  },
  {
    id: '4',
    title: 'Departamento Santa Fe',
    location: 'Ciudad de México',
    area: 'Santa Fe',
    price: '$890K USD',
    priceValue: 890000,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop',
    bedrooms: 3,
    bathrooms: 3,
    sqm: 180,
    type: 'departamento',
    coordinates: { lat: 19.3590, lng: -99.2620 },
  },
  {
    id: '5',
    title: 'Casa Pedregal',
    location: 'Ciudad de México',
    area: 'Pedregal',
    price: '$1.5M USD',
    priceValue: 1500000,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    bedrooms: 4,
    bathrooms: 5,
    sqm: 380,
    type: 'casa',
    coordinates: { lat: 19.3100, lng: -99.2000 },
  },
  {
    id: '6',
    title: 'Loft Condesa',
    location: 'Ciudad de México',
    area: 'Condesa',
    price: '$650K USD',
    priceValue: 650000,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    sqm: 120,
    type: 'departamento',
    coordinates: { lat: 19.4120, lng: -99.1720 },
  },
];

export interface Agent {
  id: string;
  name: string;
  role: string;
  image: string;
  sales: number;
  experience: number;
}

export const agents: Agent[] = [
  {
    id: '1',
    name: 'María González',
    role: 'Directora de Ventas',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
    sales: 156,
    experience: 15,
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    role: 'Agente Senior',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop',
    sales: 89,
    experience: 10,
  },
  {
    id: '3',
    name: 'Ana Rodríguez',
    role: 'Especialista en Lujo',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop',
    sales: 72,
    experience: 8,
  },
];

export const achievements = [
  { value: '$500M+', label: 'En Propiedades Vendidas' },
  { value: '15+', label: 'Años de Experiencia' },
  { value: '98%', label: 'Precisión en Valuaciones' },
  { value: '15', label: 'Días Promedio de Venta' },
];
