import { mockStore } from './src/data/mockStore';

async function testLogins() {
  const tests = [
    { email: 'admin@toolcraft.example', expectedRole: 'SUPER_ADMIN', expectedStatus: 'ACTIVE' },
    { email: 'admin@toolcraft.com', expectedRole: 'SUPER_ADMIN', expectedStatus: 'ACTIVE' },
    { email: 'contact@stuttgart-grinding.example', expectedRole: 'MANUFACTURER_ADMIN', expectedStatus: 'ACTIVE' },
    { email: 'mfr@stuttgart-grinding.de', expectedRole: 'MANUFACTURER_ADMIN', expectedStatus: 'ACTIVE' },
    { email: 'contact@manufacturer.com', expectedRole: 'MANUFACTURER_ADMIN', expectedStatus: 'ACTIVE' },
    { email: 'audit@alpine-machining.example', expectedRole: 'MANUFACTURER_ADMIN', expectedStatus: 'PENDING_APPROVAL' },
    { email: 'pending@kronvik-precision.de', expectedRole: 'MANUFACTURER_ADMIN', expectedStatus: 'PENDING_APPROVAL' },
    { email: 'elena.vance@apex-aero.com', expectedRole: 'BUYER', expectedStatus: 'ACTIVE' }
  ];

  console.log('--- Testing User Lookup and Credentials Resolution ---');
  for (const t of tests) {
    const user = mockStore.findUserByEmail(t.email);
    if (!user) {
      console.error(`FAILED: User not found for ${t.email}`);
      process.exit(1);
    }
    if (user.role !== t.expectedRole || user.status !== t.expectedStatus) {
      console.error(`FAILED: Unexpected role or status for ${t.email}:`, user.role, user.status);
      process.exit(1);
    }
    console.log(`PASSED: ${t.email} -> Found: [${user.role}] Status: [${user.status}] Name: [${user.firstName} ${user.lastName}]`);
  }

  console.log('\n--- ALL CREDENTIAL LOOKUPS SUCCEEDED ---');
}

testLogins().catch(e => {
  console.error(e);
  process.exit(1);
});
