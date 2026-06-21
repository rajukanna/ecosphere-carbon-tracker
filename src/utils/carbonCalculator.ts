export interface CarbonData {
  transport: {
    carType: string; // petrol, diesel, hybrid, electric, none
    carDistance: number; // km per month
    publicTransit: number; // km per month
    flights: number; // hours per year
    motorbike: number; // km per month
  };
  energy: {
    electricity: number; // kWh per month
    gas: number; // kWh per month
    cleanEnergyShare: number; // percentage (0 - 100)
  };
  diet: {
    dietType: string; // heavy-meat, medium-meat, low-meat, vegetarian, vegan
    localFoodShare: number; // percentage (0 - 100)
    foodWaste: string; // low, medium, high
  };
  waste: {
    trashWeight: number; // kg per week
    recycleShare: number; // percentage (0 - 100)
    composting: boolean;
  };
}

export const DEFAULT_CARBON_DATA: CarbonData = {
  transport: {
    carType: 'petrol',
    carDistance: 500,
    publicTransit: 200,
    flights: 10,
    motorbike: 0,
  },
  energy: {
    electricity: 250,
    gas: 150,
    cleanEnergyShare: 20,
  },
  diet: {
    dietType: 'medium-meat',
    localFoodShare: 20,
    foodWaste: 'medium',
  },
  waste: {
    trashWeight: 10,
    recycleShare: 30,
    composting: false,
  },
};

// Calculations return values in kg CO2 per month
export function calculateCategoryEmissions(data: CarbonData) {
  // 1. Transportation
  let carFactor = 0.20; // Petrol
  if (data.transport.carType === 'diesel') carFactor = 0.18;
  else if (data.transport.carType === 'hybrid') carFactor = 0.10;
  else if (data.transport.carType === 'electric') carFactor = 0.04;
  else if (data.transport.carType === 'none') carFactor = 0.00;

  const carEmissions = data.transport.carDistance * carFactor;
  const transitEmissions = data.transport.publicTransit * 0.04; // 0.04 kg CO2 per km
  const flightEmissions = (data.transport.flights * 150) / 12; // 150 kg per flight hour, divided by 12 for monthly
  const motorbikeEmissions = data.transport.motorbike * 0.10; // 0.10 kg per km
  const transportTotal = carEmissions + transitEmissions + flightEmissions + motorbikeEmissions;

  // 2. Energy
  const electricityEmissions = data.energy.electricity * 0.38 * (1 - data.energy.cleanEnergyShare / 100); // 0.38 kg CO2 per kWh
  const gasEmissions = data.energy.gas * 0.185; // 0.185 kg CO2 per kWh
  const energyTotal = electricityEmissions + gasEmissions;

  // 3. Diet
  let dietBase = 142; // Medium-meat default: ~142 kg/month
  if (data.diet.dietType === 'heavy-meat') dietBase = 210;
  else if (data.diet.dietType === 'low-meat') dietBase = 105;
  else if (data.diet.dietType === 'vegetarian') dietBase = 80;
  else if (data.diet.dietType === 'vegan') dietBase = 40;

  // Local food reduction: max 15% off diet footprint if 100% local
  const localReduction = dietBase * (data.diet.localFoodShare / 100) * 0.15;
  
  // Food waste penalty
  let wastePenalty = 0;
  if (data.diet.foodWaste === 'high') wastePenalty = 25;
  else if (data.diet.foodWaste === 'medium') wastePenalty = 10;
  
  const dietTotal = Math.max(20, dietBase - localReduction + wastePenalty);

  // 4. Waste
  // 10 kg trash/week = 40kg/month. 1kg of landfill trash ~ 1.5kg CO2
  const baseTrashEmissions = data.waste.trashWeight * 4.3 * 1.5; 
  const recyclingCredit = baseTrashEmissions * (data.waste.recycleShare / 100) * 0.4; // up to 40% reduction for perfect recycling
  let wasteTotal = baseTrashEmissions - recyclingCredit;
  if (data.waste.composting) {
    wasteTotal = wasteTotal * 0.85; // 15% composting reduction
  }
  wasteTotal = Math.max(2, wasteTotal);

  return {
    transport: Math.round(transportTotal),
    energy: Math.round(energyTotal),
    diet: Math.round(dietTotal),
    waste: Math.round(wasteTotal),
    total: Math.round(transportTotal + energyTotal + dietTotal + wasteTotal),
  };
}

// Custom interfaces for Eco Challenges
export interface Challenge {
  id: string;
  title: string;
  category: string;
  co2Savings: number; // kg per month saved
  description: string;
  durationDays: number;
}

export const ECO_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Eco Commuter',
    category: 'transport',
    co2Savings: 45,
    description: 'Switch 3 drives per week to public transit, biking, or walking.',
    durationDays: 7
  },
  {
    id: 'ch-2',
    title: 'Plant-Powered Week',
    category: 'diet',
    co2Savings: 50,
    description: 'Eat 100% plant-based vegetarian or vegan meals for 7 full days.',
    durationDays: 7
  },
  {
    id: 'ch-3',
    title: 'Unplug Standby',
    category: 'energy',
    co2Savings: 15,
    description: 'Unplug power strips, laptops, TVs and other phantom chargers when sleeping.',
    durationDays: 14
  },
  {
    id: 'ch-4',
    title: 'Cold-Water Wash',
    category: 'energy',
    co2Savings: 12,
    description: 'Do all laundry loads with cold water instead of warm or hot.',
    durationDays: 30
  },
  {
    id: 'ch-5',
    title: 'Zero Single-Use Plastic',
    category: 'waste',
    co2Savings: 8,
    description: 'Refuse all single-use plastic bottles, utensils, bags, and cups.',
    durationDays: 7
  },
  {
    id: 'ch-6',
    title: 'Thermostat Adjustment',
    category: 'energy',
    co2Savings: 25,
    description: 'Lower thermostat by 2°C in winter or raise it by 2°C in summer.',
    durationDays: 30
  }
];

export interface OffsetProject {
  id: string;
  title: string;
  location: string;
  pricePerTon: number; // USD per metric ton CO2
  description: string;
  image: string;
  developer: string;
}

export const OFFSET_PROJECTS: OffsetProject[] = [
  {
    id: 'op-1',
    title: 'Amazon Basin Rainforest Protection',
    location: 'Acre, Brazil',
    pricePerTon: 15,
    description: 'Preserving over 100,000 hectares of pristine forest from illegal deforestation, protecting biodiversity and supporting local farming communities.',
    image: 'reforestation',
    developer: 'CarbonForest Ltd.'
  },
  {
    id: 'op-2',
    title: 'Blue Carbon Coastal Mangroves Restoration',
    location: 'Gazi Bay, Kenya',
    pricePerTon: 22,
    description: 'Restoring damaged mangrove ecosystems along coastal estuaries. Mangroves sequester carbon up to 4 times faster than tropical land forests.',
    image: 'mangroves',
    developer: 'SeaGrass Conservation Org'
  },
  {
    id: 'op-3',
    title: 'Community Wind Energy Generation',
    location: 'Rajasthan, India',
    pricePerTon: 12,
    description: 'Replacing fossil fuel electricity on the local grid with clean, renewable wind energy from newly installed high-capacity turbines.',
    image: 'wind_energy',
    developer: 'CleanGrid Power'
  },
  {
    id: 'op-4',
    title: 'Methane Gas Capture from Solid Waste Landfills',
    location: 'Santiago, Chile',
    pricePerTon: 10,
    description: 'Installing vacuum wells to capture methane gases emitted by decaying organic matter in landfills, converting it into heat and electricity.',
    image: 'methane_capture',
    developer: 'EcoWaste Tech'
  }
];
