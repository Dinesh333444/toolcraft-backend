import { mockStore } from './src/data/mockStore';
import { extractNameFromEmail } from './src/routes/auth.routes';

async function testFlow() {
  console.log('=== 1. Test Name Extraction from Email ===');
  const test1 = extractNameFromEmail('elena.vance@apex-aero.com');
  console.log('elena.vance@apex-aero.com ->', test1);
  if (test1.firstName !== 'Elena' || test1.lastName !== 'Vance') {
    throw new Error('Name extraction failed');
  }

  const test2 = extractNameFromEmail('hans.peter.schmidt@siemens.de');
  console.log('hans.peter.schmidt@siemens.de ->', test2);

  const test3 = extractNameFromEmail('alexander99@volkswagen.com');
  console.log('alexander99@volkswagen.com ->', test3);

  console.log('\n=== 2. Test Customer Creation in Memory Store ===');
  const newCustomer = mockStore.createCustomer({
    email: 'marcus.aurelius@rome-mfg.it',
    firstName: 'Marcus',
    lastName: 'Aurelius',
    role: 'BUYER',
    passwordHash: 'dummy'
  });
  console.log('Created Customer:', newCustomer.id, newCustomer.firstName, newCustomer.lastName, newCustomer.role);

  console.log('\n=== 3. Test Customer Enquiry Association ===');
  const createdEnquiry = mockStore.addEnquiry({
    customerId: newCustomer.id,
    fullName: 'Marcus Aurelius',
    companyName: 'Rome Mfg IT',
    email: 'marcus.aurelius@rome-mfg.it',
    phone: '+39 06 123456',
    requiredQuantity: '10 units',
    targetTimeline: 'Within 30 Days',
    requirements: 'Custom carbide geometry with AlTiN coating.',
    productTitle: 'VRX-5F Sub-Micron Solid Carbide End Mill Series',
    productModel: 'VRX-120-5F-ALTIN',
    manufacturerName: 'Stuttgart Grinding & Carbide Works'
  });
  console.log('Created Enquiry Code:', createdEnquiry.enquiryCode, 'Customer ID:', createdEnquiry.customerId);

  console.log('\n=== 4. Test Customer Enquiry Retrieval ===');
  const customerEnquiries = mockStore.getCustomerEnquiries(newCustomer.id, newCustomer.email);
  console.log('Customer Enquiries Found:', customerEnquiries.length);
  if (customerEnquiries.length !== 1) {
    throw new Error('Customer enquiry retrieval failed');
  }

  console.log('\n=== 5. Test Demo Customer Enquiries ===');
  const demoEnquiries = mockStore.getCustomerEnquiries('user-customer-demo', 'elena.vance@apex-aero.com');
  console.log('Demo Customer Enquiries Found:', demoEnquiries.length);
  for (const enq of demoEnquiries) {
    console.log(` - Ref: ${enq.enquiryCode} | Status: ${enq.status} | Quoted: ${enq.quotedUnitPrice || 'Pending'}`);
  }

  console.log('\n=== ALL END-TO-END VERIFICATION CHECKS PASSED ===');
}

testFlow().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
