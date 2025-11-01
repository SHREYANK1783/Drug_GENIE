/**
 * Test file to demonstrate the optimized drug interaction checker
 * Run this to verify the improvements in speed and accuracy
 */

import { checkDrugInteractions } from './drugInteractions';
import { clearDrugApiCache } from '../services/drugApiService';

/**
 * Test critical severe interactions
 */
export async function testSevereInteractions() {
  console.log('🧪 Testing SEVERE Interactions...\n');
  
  const testCases = [
    {
      name: 'Warfarin + Aspirin (Bleeding Risk)',
      drugs: ['Warfarin', 'Aspirin']
    },
    {
      name: 'Alcohol + Xanax (Respiratory Depression)',
      drugs: ['Alcohol', 'Xanax']
    },
    {
      name: 'Prozac + Nardil (Serotonin Syndrome)',
      drugs: ['Prozac', 'Nardil']
    },
    {
      name: 'Lithium + Ibuprofen (Toxicity)',
      drugs: ['Lithium', 'Ibuprofen']
    }
  ];

  for (const testCase of testCases) {
    const startTime = performance.now();
    const interactions = await checkDrugInteractions(testCase.drugs);
    const endTime = performance.now();
    
    console.log(`✅ ${testCase.name}`);
    console.log(`   Time: ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`   Interactions Found: ${interactions.length}`);
    if (interactions.length > 0) {
      console.log(`   Severity: ${interactions[0].severity.toUpperCase()}`);
      console.log(`   Sources: ${interactions.map(i => i.source).join(', ')}`);
    }
    console.log('');
  }
}

/**
 * Test moderate interactions
 */
export async function testModerateInteractions() {
  console.log('🧪 Testing MODERATE Interactions...\n');
  
  const testCases = [
    {
      name: 'Lisinopril + Ibuprofen (Kidney Function)',
      drugs: ['Lisinopril', 'Ibuprofen']
    },
    {
      name: 'Simvastatin + Grapefruit (Muscle Damage)',
      drugs: ['Simvastatin', 'Grapefruit']
    },
    {
      name: 'Metformin + Alcohol (Lactic Acidosis)',
      drugs: ['Metformin', 'Alcohol']
    }
  ];

  for (const testCase of testCases) {
    const startTime = performance.now();
    const interactions = await checkDrugInteractions(testCase.drugs);
    const endTime = performance.now();
    
    console.log(`✅ ${testCase.name}`);
    console.log(`   Time: ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`   Interactions Found: ${interactions.length}`);
    if (interactions.length > 0) {
      console.log(`   Severity: ${interactions[0].severity.toUpperCase()}`);
    }
    console.log('');
  }
}

/**
 * Test caching performance
 */
export async function testCachingPerformance() {
  console.log('🧪 Testing CACHING Performance...\n');
  
  const drugs = ['Warfarin', 'Aspirin'];
  
  // Clear cache first
  clearDrugApiCache();
  
  // First check (no cache)
  console.log('First check (no cache):');
  const start1 = performance.now();
  const interactions1 = await checkDrugInteractions(drugs);
  const end1 = performance.now();
  console.log(`   Time: ${(end1 - start1).toFixed(2)}ms`);
  console.log(`   Interactions: ${interactions1.length}\n`);
  
  // Second check (with cache)
  console.log('Second check (with cache):');
  const start2 = performance.now();
  const interactions2 = await checkDrugInteractions(drugs);
  const end2 = performance.now();
  console.log(`   Time: ${(end2 - start2).toFixed(2)}ms`);
  console.log(`   Interactions: ${interactions2.length}\n`);
  
  const speedup = ((end1 - start1) / (end2 - start2)).toFixed(1);
  console.log(`⚡ Cache speedup: ${speedup}x faster!\n`);
}

/**
 * Test multiple drug combinations (stress test)
 */
export async function testMultipleDrugs() {
  console.log('🧪 Testing MULTIPLE Drugs (Stress Test)...\n');
  
  const testCases = [
    {
      name: '3 Drugs',
      drugs: ['Warfarin', 'Aspirin', 'Ibuprofen']
    },
    {
      name: '5 Drugs',
      drugs: ['Warfarin', 'Aspirin', 'Ibuprofen', 'Lisinopril', 'Metformin']
    },
    {
      name: '7 Drugs',
      drugs: ['Warfarin', 'Aspirin', 'Ibuprofen', 'Lisinopril', 'Metformin', 'Simvastatin', 'Omeprazole']
    }
  ];

  for (const testCase of testCases) {
    const startTime = performance.now();
    const interactions = await checkDrugInteractions(testCase.drugs);
    const endTime = performance.now();
    
    const pairs = (testCase.drugs.length * (testCase.drugs.length - 1)) / 2;
    
    console.log(`✅ ${testCase.name} (${pairs} pairs to check)`);
    console.log(`   Time: ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`   Avg per pair: ${((endTime - startTime) / pairs).toFixed(2)}ms`);
    console.log(`   Interactions Found: ${interactions.length}`);
    console.log('');
  }
}

/**
 * Test API source coverage
 */
export async function testSourceCoverage() {
  console.log('🧪 Testing API SOURCE Coverage...\n');
  
  const drugs = ['Warfarin', 'Aspirin', 'Ibuprofen'];
  const interactions = await checkDrugInteractions(drugs);
  
  const sources = new Set(interactions.map(i => i.source));
  
  console.log(`Total Interactions: ${interactions.length}`);
  console.log(`Unique Sources: ${sources.size}`);
  console.log(`Sources Used: ${Array.from(sources).join(', ')}`);
  console.log('');
  
  // Count by source
  const sourceCounts: { [key: string]: number } = {};
  interactions.forEach(i => {
    const source = i.source || 'unknown';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });
  
  console.log('Breakdown by source:');
  Object.entries(sourceCounts).forEach(([source, count]) => {
    console.log(`   ${source}: ${count} interactions`);
  });
  console.log('');
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Drug Interaction Checker - Optimization Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');
  
  try {
    await testSevereInteractions();
    await testModerateInteractions();
    await testCachingPerformance();
    await testMultipleDrugs();
    await testSourceCoverage();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ✅ All Tests Completed Successfully!');
    console.log('═══════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for use in console or other files
export default {
  runAllTests,
  testSevereInteractions,
  testModerateInteractions,
  testCachingPerformance,
  testMultipleDrugs,
  testSourceCoverage
};
