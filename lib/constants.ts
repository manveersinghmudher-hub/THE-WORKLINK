import type { ServiceCategory } from './types';

export const SERVICES: ServiceCategory[] = [
  { id: 'electrical', label: 'Electrical', icon: 'Zap', description: 'Wiring, switches, appliance repair', startingPrice: 299 },
  { id: 'plumbing', label: 'Plumbing', icon: 'Wrench', description: 'Pipes, taps, drainage, leaks', startingPrice: 249 },
  { id: 'carpentry', label: 'Carpentry', icon: 'Hammer', description: 'Furniture, doors, woodwork', startingPrice: 349 },
  { id: 'painting', label: 'Painting', icon: 'Paintbrush', description: 'Walls, rooms, exterior', startingPrice: 199 },
  { id: 'moving', label: 'Moving', icon: 'Truck', description: 'Packing, transport, setup', startingPrice: 499 },
  { id: 'home-repair', label: 'Home Repair', icon: 'Home', description: 'General fixes and maintenance', startingPrice: 199 },
];

export const CITIES = ['Ludhiana', 'Chandigarh', 'Amritsar', 'Jalandhar', 'Patiala', 'Delhi', 'Mumbai'];

export const ISSUE_TAGS = ['Work Quality', 'Behaviour', 'Punctuality', 'Incomplete Work', 'Property Damage'];
