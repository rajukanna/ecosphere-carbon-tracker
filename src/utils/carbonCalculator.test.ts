import { describe, it, expect } from 'vitest';
import { 
  calculateCategoryEmissions, 
  DEFAULT_CARBON_DATA, 
  ECO_CHALLENGES, 
  OFFSET_PROJECTS,
  type CarbonData
} from './carbonCalculator';

describe('carbonCalculator', () => {
  describe('calculateCategoryEmissions', () => {
    it('calculates baseline emissions correctly with default data', () => {
      const emissions = calculateCategoryEmissions(DEFAULT_CARBON_DATA);
      expect(emissions).toBeDefined();
      expect(emissions.transport).toBeGreaterThan(0);
      expect(emissions.energy).toBeGreaterThan(0);
      expect(emissions.diet).toBeGreaterThan(0);
      expect(emissions.waste).toBeGreaterThan(0);
      const sum = emissions.transport + emissions.energy + emissions.diet + emissions.waste;
      expect(Math.abs(emissions.total - sum)).toBeLessThanOrEqual(2);
    });

    it('calculates lower transport footprint for electric vehicle (EV) than petrol', () => {
      const petrolData: CarbonData = {
        ...DEFAULT_CARBON_DATA,
        transport: { ...DEFAULT_CARBON_DATA.transport, carType: 'petrol', carDistance: 1000 }
      };
      const evData: CarbonData = {
        ...DEFAULT_CARBON_DATA,
        transport: { ...DEFAULT_CARBON_DATA.transport, carType: 'electric', carDistance: 1000 }
      };

      const petrolEmissions = calculateCategoryEmissions(petrolData);
      const evEmissions = calculateCategoryEmissions(evData);

      expect(evEmissions.transport).toBeLessThan(petrolEmissions.transport);
    });

    it('calculates lower diet footprint for vegan diet than heavy meat diet', () => {
      const heavyMeatData: CarbonData = {
        ...DEFAULT_CARBON_DATA,
        diet: { ...DEFAULT_CARBON_DATA.diet, dietType: 'heavy-meat' }
      };
      const veganData: CarbonData = {
        ...DEFAULT_CARBON_DATA,
        diet: { ...DEFAULT_CARBON_DATA.diet, dietType: 'vegan' }
      };

      const heavyMeatEmissions = calculateCategoryEmissions(heavyMeatData);
      const veganEmissions = calculateCategoryEmissions(veganData);

      expect(veganEmissions.diet).toBeLessThan(heavyMeatEmissions.diet);
    });

    it('calculates composting and recycling savings correctly', () => {
      const baseWasteData: CarbonData = {
        ...DEFAULT_CARBON_DATA,
        waste: { trashWeight: 20, recycleShare: 0, composting: false }
      };
      const ecoWasteData: CarbonData = {
        ...DEFAULT_CARBON_DATA,
        waste: { trashWeight: 20, recycleShare: 50, composting: true }
      };

      const baseEmissions = calculateCategoryEmissions(baseWasteData);
      const ecoEmissions = calculateCategoryEmissions(ecoWasteData);

      expect(ecoEmissions.waste).toBeLessThan(baseEmissions.waste);
    });

    it('applies clean energy tariff reductions to electricity emissions', () => {
      const standardGrid: CarbonData = {
        ...DEFAULT_CARBON_DATA,
        energy: { electricity: 500, gas: 0, cleanEnergyShare: 0 }
      };
      const cleanGrid: CarbonData = {
        ...DEFAULT_CARBON_DATA,
        energy: { electricity: 500, gas: 0, cleanEnergyShare: 100 }
      };

      const standardEmissions = calculateCategoryEmissions(standardGrid);
      const cleanEmissions = calculateCategoryEmissions(cleanGrid);

      expect(cleanEmissions.energy).toBe(0);
      expect(standardEmissions.energy).toBeGreaterThan(0);
    });
  });

  describe('Static Datasets', () => {
    it('contains standard challenge details', () => {
      expect(ECO_CHALLENGES.length).toBeGreaterThan(0);
      expect(ECO_CHALLENGES[0].id).toBeDefined();
      expect(ECO_CHALLENGES[0].co2Savings).toBeGreaterThan(0);
    });

    it('contains verified offset project listings', () => {
      expect(OFFSET_PROJECTS.length).toBeGreaterThan(0);
      expect(OFFSET_PROJECTS[0].id).toBeDefined();
      expect(OFFSET_PROJECTS[0].pricePerTon).toBeGreaterThan(0);
    });
  });
});
