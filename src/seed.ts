import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './config/db';
import { User } from './models/User';
import { Manufacturer } from './models/Manufacturer';
import { Product } from './models/Product';
import { Enquiry } from './models/Enquiry';

export const seedDatabase = async () => {
  console.log('[Seed] Seeding initial industrial dataset matching UI designs...');

  // Drop collections to clear any stale indexes
  try {
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      for (const col of collections) {
        await mongoose.connection.db.dropCollection(col.name);
      }
    }
  } catch (e) {
    // ignore
  }

  // 1. Users
  const passwordHash = await bcrypt.hash('Admin@1234', 10);
  
  const adminUser = await User.create({
    email: 'admin@toolcraft.com',
    passwordHash,
    role: 'SUPER_ADMIN',
    firstName: 'Engineering',
    lastName: 'Director',
    companyName: 'ToolCraft Operations',
    phoneNumber: '+1-800-TOOL-CRAFT'
  });

  const mfrUser = await User.create({
    email: 'mfr@stuttgart-grinding.de',
    passwordHash,
    role: 'MANUFACTURER_ADMIN',
    firstName: 'Hans',
    lastName: 'Mueller',
    companyName: 'Stuttgart Grinding & Carbide Works',
    phoneNumber: '+49 711 555 0190'
  });

  // 2. Manufacturers
  const mfr1 = await Manufacturer.create({
    userId: mfrUser._id,
    name: 'Stuttgart Grinding & Carbide Works',
    slug: 'stuttgart-grinding-carbide-works',
    standards: ['DIN 6527', 'ISO 1832', 'DIN 6535 HA'],
    specialization: '5-Axis CNC Flute Grinding & AlTiN PVD Deposition',
    benchmarkMetric: 'Batch Runout ≤ 0.003 mm TIR verified on 100% optical laser presetter.',
    country: 'Germany',
    city: 'Stuttgart',
    address: 'Pragstraße 120, 70376 Stuttgart',
    taxId: 'DE814529103',
    isVerified: true,
    status: 'ACTIVE',
    capabilities: ['Sub-micron carbide grinding', 'PVD ARC evaporation', 'Laser edge preparation'],
    certifications: ['ISO 9001:2015', 'DIN EN ISO 14001'],
    contactEmail: 'engineering@stuttgart-grinding.de',
    contactPhone: '+49 711 555 0190'
  });

  const mfr2 = await Manufacturer.create({
    name: 'Osaka Metrology & Calibration Lab',
    slug: 'osaka-metrology-calibration-lab',
    standards: ['ISO/IEC 17025', 'DIN 863-1', 'ISO 3611'],
    specialization: 'Carbide-Lapped Micrometers & Internal Bore Comparators',
    benchmarkMetric: 'Zero-drift 20 °C ± 0.5 °C cleanroom calibration certificate per serial number.',
    country: 'Japan',
    city: 'Osaka',
    address: 'Chuo-ku, Osaka 541-0041',
    taxId: 'JP9010001054321',
    isVerified: true,
    status: 'ACTIVE',
    capabilities: ['Interferometric calibration', 'Carbide hand-lapping', 'Cleanroom packaging'],
    certifications: ['ISO/IEC 17025 JCSS accredited', 'JIS B 7502'],
    contactEmail: 'technical-desk@osaka-metrology.jp',
    contactPhone: '+81 6 6203 1111'
  });

  const mfr3 = await Manufacturer.create({
    name: 'Bavaria Heavy Kinematics GmbH',
    slug: 'bavaria-heavy-kinematics-gmbh',
    standards: ['ISO 10791-7', 'VDI/DGQ 3441', 'ISO 1940 G0.4'],
    specialization: 'Monoblock 5-Axis Centers & Hybrid Ceramic Electro-Spindles',
    benchmarkMetric: '72-hour continuous thermal load verification prior to plant dispatch.',
    country: 'Germany',
    city: 'Munich',
    address: 'Werner-Heisenberg-Allee 25, 80939 München',
    taxId: 'DE298124098',
    isVerified: true,
    status: 'ACTIVE',
    capabilities: ['Mineral-casting vibration damping', 'Direct torque-motor drives', 'Laser tool measurement'],
    certifications: ['ISO 9001:2015', 'CE Machinery Directive 2006/42/EC'],
    contactEmail: 'sales@bavaria-kinematics.de',
    contactPhone: '+49 89 321 9980'
  });

  // 3. Products
  await Product.create([
    {
      title: 'VRX-5F Sub-Micron Solid Carbide End Mill Series',
      slug: 'vrx-120-5f-altin',
      sku: 'SKU-VRX-120-5F',
      modelNumber: 'VRX-120-5F-ALTIN',
      series: '2026 Series K-900',
      standards: ['DIN 6527', 'DIN 6535 HA Cylindrical Shank', 'ISO 1832'],
      category: 'Carbide Tools',
      categorySlug: 'carbide-tools',
      description: 'Variable-helix 5-flute solid tungsten carbide end mill with 4.2 µm AlTiN-Si nano-composite PVD coating for high-feed trochoidal milling.',
      isNewRelease: true,
      status: 'PUBLISHED',
      manufacturerId: mfr1._id,
      manufacturerName: mfr1.name,
      previewSpecs: [
        { label: 'Shank Tolerance', value: 'h6 (+0 / -0.011 mm)' },
        { label: 'Coating', value: 'AlTiN-Si Nano (3,450 HV)' },
        { label: 'Runout TIR', value: '≤ 0.003 mm' }
      ],
      geometry: {
        cuttingDiameterD1: 12.00,
        diameterTolerance: 'h6 (+0 / -0.011) mm',
        shankDiameterD2: 12.00,
        fluteLengthL2: 26.0,
        overallLengthL1: 83.0,
        flutesZ: 5,
        helixAngle: '37° / 40° deg',
        cornerChamfer: '0.20 × 45° mm'
      },
      metallurgy: {
        carbideSubstrate: 'WC-10%Co (0.4 µm) / ISO K10/K20',
        coating: 'AlTiN-Si Nano (4.2 µm)',
        hardness: '3,450 HV 0.05',
        maxTemp: '1,100 °C'
      },
      cuttingParameters: {
        feedRate: '0.045 - 0.085 mm/tooth',
        cuttingSpeed: '140 - 210 m/min'
      },
      primaryImage: '/images/carbide-rotary-burrs.jpg',
      galleryImages: [
        '/images/carbide-rotary-burrs.jpg',
        '/images/die-grinder-burr-kit.jpg'
      ],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      specCount: 14,
      hasVideo: true,
      photoCount: 2
    },
    {
      title: 'KX-500 Simultaneous 5-Axis Micro-Machining Center',
      slug: 'kx-500-5x',
      sku: 'SKU-KX-500-5X',
      modelNumber: 'KX-500-5X',
      series: '2026 Machine Line',
      standards: ['ISO 10791-7', 'VDI/DGQ 3441', 'ISO 1940 G0.4'],
      category: 'Industrial Machinery',
      categorySlug: 'industrial-machinery',
      description: 'Monoblock mineral-cast 5-axis trunnion machining center engineered for sub-micron aerospace and precision medical components.',
      isNewRelease: true,
      status: 'PUBLISHED',
      manufacturerId: mfr3._id,
      manufacturerName: mfr3.name,
      previewSpecs: [
        { label: 'Positioning Repeatability', value: '±0.0015 mm' },
        { label: 'Spindle Speed', value: '28,000 RPM (HSK-A63)' },
        { label: 'Trunnion Tilt', value: '+115° / -115° Direct Drive' }
      ],
      geometry: {
        overallLengthL1: 2400,
        flutesZ: 5
      },
      metallurgy: {
        carbideSubstrate: 'Polymer mineral composite cast frame',
        coating: 'Dual thermal liquid recirculation',
        hardness: 'Rockwell C 62 Guideways',
        maxTemp: 'Active cooling to ±0.2 °C'
      },
      cuttingParameters: {
        feedRate: 'Rapid traverse 48 m/min',
        cuttingSpeed: '28,000 RPM continuous'
      },
      machineSpecs: {
        repeatability: '±0.0015 mm',
        spindleSpeed: '28,000 RPM (HSK-A63)',
        trunnionTilt: '+115° / -115° Direct Drive',
        controller: 'Heidenhain TNC7 / Siemens ONE 5-Axis RTCP'
      },
      primaryImage: '/images/precision-tooling-fixtures.jpg',
      galleryImages: [
        '/images/precision-tooling-fixtures.jpg',
        '/images/carbide-rotary-burrs.jpg'
      ],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      specCount: 13,
      hasVideo: true,
      photoCount: 2
    },
    {
      title: 'MB-351 Master Micrometer & Dial Bore Metrology Kit',
      slug: 'mb-351-511',
      sku: 'SKU-MB-351-511',
      modelNumber: 'MB-351-511',
      series: '2026 Precision Series',
      standards: ['ISO/IEC 17025', 'DIN 863-1', 'ISO 3611'],
      category: 'Precision Tools',
      categorySlug: 'precision-tools',
      description: 'Carbide-tipped external micrometer paired with a 18-35 mm self-centering dial bore gauge kit for cleanroom sub-micron inspection.',
      isNewRelease: true,
      status: 'PUBLISHED',
      manufacturerId: mfr2._id,
      manufacturerName: mfr2.name,
      previewSpecs: [
        { label: 'Micrometer Graduation', value: '0.001 mm' },
        { label: 'Bore Gauge Repeatability', value: '≤ 0.002 mm' },
        { label: 'Measuring Force', value: '5 - 10 N Ratchet' }
      ],
      geometry: {
        cuttingDiameterD1: 35.0,
        diameterTolerance: '±0.001 mm optical flatness',
        overallLengthL1: 185
      },
      metallurgy: {
        carbideSubstrate: 'Tungsten carbide optical contact anvils',
        coating: 'Hard satin chrome non-glare barrel',
        hardness: '≥ 90 HRA anvils',
        maxTemp: 'Reference calibrated at 20.0 °C'
      },
      cuttingParameters: {
        feedRate: '0.5 mm spindle pitch per revolution',
        cuttingSpeed: 'Ratchet stop constant force mechanism'
      },
      primaryImage: '/images/die-grinder-burr-kit.jpg',
      galleryImages: [
        '/images/die-grinder-burr-kit.jpg',
        '/images/carbide-rotary-burrs.jpg'
      ],
      specCount: 11,
      hasVideo: true,
      photoCount: 2
    },
    {
      title: 'AT-800 Calibrated Digital Torque & Angle System',
      slug: 'at-800-pow',
      sku: 'SKU-AT-800-POW',
      modelNumber: 'AT-800-POW',
      series: 'Automotive Powertrain Series',
      standards: ['ISO 6789-2:2017', 'ASME B107.300', 'VDI/VDE 2648'],
      category: 'Automotive',
      categorySlug: 'automotive',
      description: 'Calibrated digital torque-plus-angle wrench with live audit logging, engineered for high-criticality EV battery pack and powertrain assembly.',
      isNewRelease: true,
      status: 'PUBLISHED',
      manufacturerId: mfr1._id,
      manufacturerName: mfr1.name,
      previewSpecs: [
        { label: 'Torque Accuracy', value: '±1.5% CW / ±2% CCW' },
        { label: 'Angle Resolution', value: '0.1° High Precision' },
        { label: 'Working Range', value: '20 - 400 Nm (1/2" Drive)' }
      ],
      geometry: {
        overallLengthL1: 645,
        shankDiameterD2: 12.7
      },
      metallurgy: {
        carbideSubstrate: 'Forged 42CrMo4 chrome-moly alloy steel',
        coating: 'Industrial matte black phosphate & brushed steel',
        hardness: '48 - 52 HRC head mechanism',
        maxTemp: '-10 °C to +55 °C operating range'
      },
      cuttingParameters: {
        feedRate: 'Continuous 1000-sample/sec gyro logging',
        cuttingSpeed: 'Direct wireless MES/ERP telemetry'
      },
      primaryImage: '/images/hss-twist-drill-set.jpg',
      galleryImages: [
        '/images/hss-twist-drill-set.jpg',
        '/images/precision-tooling-fixtures.jpg'
      ],
      specCount: 12,
      hasVideo: true,
      photoCount: 2
    },
    {
      title: 'FX-90 High-Pressure Through-Coolant Indexable Drill',
      slug: 'fx-90-cool',
      sku: 'SKU-FX-90-COOL',
      modelNumber: 'FX-90-COOL',
      series: 'Deep Hole Drilling Series',
      standards: ['DIN 6535 HB Flatted Shank', 'ISO 13399'],
      category: 'Carbide Tools',
      categorySlug: 'carbide-tools',
      description: 'Helical fluted through-coolant deep hole drill rated up to 140 bar internal pressure for stainless steel and heat-resistant superalloys.',
      isNewRelease: false,
      status: 'PUBLISHED',
      manufacturerId: mfr1._id,
      manufacturerName: mfr1.name,
      previewSpecs: [
        { label: 'Drilling Depth', value: '5xD / 8xD Deep Ratio' },
        { label: 'Coolant Rating', value: 'Max 140 bar Pressure' },
        { label: 'Insert Geometry', value: 'Dual Trigonal Self-Centering' }
      ],
      geometry: {
        cuttingDiameterD1: 25.0,
        shankDiameterD2: 32.0,
        fluteLengthL2: 155.0,
        overallLengthL1: 230.0,
        flutesZ: 2
      },
      metallurgy: {
        carbideSubstrate: 'Micro-grain grade with AlTiN PVD coating',
        coating: 'Multilayer TiAlN + TiSiN',
        hardness: '3,200 HV insert tip',
        maxTemp: '900 °C'
      },
      cuttingParameters: {
        feedRate: '0.12 - 0.22 mm/rev',
        cuttingSpeed: '120 - 180 m/min'
      },
      primaryImage: '/images/single-flute-chamfer-mill.webp',
      galleryImages: [
        '/images/single-flute-chamfer-mill.webp',
        '/images/carbide-rotary-burrs.jpg'
      ],
      specCount: 10,
      hasVideo: false,
      photoCount: 2
    },
    {
      title: 'OP-200 Cleanroom Grade 00 Granite Metrology Bench',
      slug: 'op-200-iso',
      sku: 'SKU-OP-200-ISO',
      modelNumber: 'OP-200-ISO',
      series: 'Granite Reference Series',
      standards: ['DIN 876/00', 'ISO 8512-2', 'US Fed GGG-P-463c'],
      category: 'Precision Tools',
      categorySlug: 'precision-tools',
      description: 'Natural black Jinan granite precision comparator inspection plate with zero thermal conductivity hysteresis for sub-micron verification.',
      isNewRelease: false,
      status: 'PUBLISHED',
      manufacturerId: mfr2._id,
      manufacturerName: mfr2.name,
      previewSpecs: [
        { label: 'Surface Flatness', value: '0.0012 mm Overall TIR' },
        { label: 'Granite Density', value: '3,070 kg/m³ High Mass' },
        { label: 'Plate Dimensions', value: '1000 × 630 × 150 mm' }
      ],
      geometry: {
        overallLengthL1: 1000
      },
      metallurgy: {
        carbideSubstrate: 'Natural fine-grain black gabbro granite',
        coating: 'Diamond lapped micro-pore finish',
        hardness: 'Shore scleroscope hardness > 90',
        maxTemp: 'Thermal expansion coefficient 5.5 × 10⁻⁶ / °C'
      },
      cuttingParameters: {
        feedRate: 'Static metrology reference standard',
        cuttingSpeed: 'Air-cushion anti-vibration mount isolation'
      },
      primaryImage: '/images/precision-tooling-fixtures.jpg',
      galleryImages: [
        '/images/precision-tooling-fixtures.jpg',
        '/images/single-flute-chamfer-mill.webp'
      ],
      specCount: 11,
      hasVideo: false,
      photoCount: 1
    },
    {
      title: 'TX-400 Multi-Geometry CNC Indexable Carbide Inserts Collection',
      slug: 'tx-400-inserts',
      sku: 'SKU-TX-400-INSERTS',
      modelNumber: 'TX-400-MULTI-CVD',
      series: 'Heavy Turning & Milling Series',
      standards: ['ISO 1832', 'ANSI B212.4', 'DIN 4983'],
      category: 'Carbide Tools',
      categorySlug: 'carbide-tools',
      description: 'High-performance indexable carbide turning and milling insert assortment covering rhombic, triangular, and square geometries with dual-layer CVD/PVD coatings and molded chip breakers.',
      isNewRelease: true,
      status: 'PUBLISHED',
      manufacturerId: mfr1._id,
      manufacturerName: mfr1.name,
      previewSpecs: [
        { label: 'Insert Types', value: 'CNMG, DNMG, TNMG, SNMG' },
        { label: 'Coating Tech', value: 'Multi-Layer CVD Al2O3 + TiCN' },
        { label: 'Chipbreaker', value: 'Bi-Directional Wave Breaker' }
      ],
      primaryImage: '/images/indexable-carbide-inserts-assortment.jpg',
      galleryImages: [
        '/images/indexable-carbide-inserts-assortment.jpg',
        '/images/gold-trigon-carbide-inserts.jpg',
        '/images/rhombic-carbide-turning-insert.jpg'
      ],
      specCount: 18,
      hasVideo: true,
      photoCount: 3
    },
    {
      title: 'WN-80 Heavy-Duty Gold TiN Trigon Turning Inserts Pack',
      slug: 'wn-80-trigon',
      sku: 'SKU-WN-80-TRIGON',
      modelNumber: 'WNMG-080408-PM',
      series: 'High-Efficiency Turning Series',
      standards: ['ISO 1832', 'DIN 4984', 'ISO 513 P15-P30'],
      category: 'Carbide Tools',
      categorySlug: 'carbide-tools',
      description: '80° trigon 6-cutting-edge indexable turning inserts with micro-textured rake surface and gold TiN topcoat for vibration-free medium-to-heavy steel roughing.',
      isNewRelease: true,
      status: 'PUBLISHED',
      manufacturerId: mfr3._id,
      manufacturerName: mfr3.name,
      previewSpecs: [
        { label: 'Edge Count', value: '6 Double-Sided Cutting Edges' },
        { label: 'Coating', value: 'Ultra-Dense Gold TiN PVD' },
        { label: 'Workpiece Range', value: 'Carbon Steel, Alloy Steel (P Group)' }
      ],
      primaryImage: '/images/gold-trigon-carbide-inserts.jpg',
      galleryImages: [
        '/images/gold-trigon-carbide-inserts.jpg',
        '/images/indexable-carbide-inserts-assortment.jpg'
      ],
      specCount: 16,
      hasVideo: true,
      photoCount: 2
    },
    {
      title: 'VN-35 Precision 35° / 55° Rhombic CNC Finishing Insert',
      slug: 'vn-35-rhombic',
      sku: 'SKU-VN-35-RHOMBIC',
      modelNumber: 'VNMG-160404-SF',
      series: 'AeroProfile Finishing Series',
      standards: ['ISO 1832', 'DIN ISO 1832:2017', 'ASME B212.4'],
      category: 'Carbide Tools',
      categorySlug: 'carbide-tools',
      description: 'Narrow-profile rhombic finishing insert with specialized stepped chip breaker and calibrated nose radius for deep profile copying, undercut turning, and mirror surface finishing.',
      isNewRelease: true,
      status: 'PUBLISHED',
      manufacturerId: mfr2._id,
      manufacturerName: mfr2.name,
      previewSpecs: [
        { label: 'Profile Angle', value: '35° Acute Rhombic Profile' },
        { label: 'Nose Radius', value: '0.40 mm High-Precision Ground' },
        { label: 'Surface Finish', value: 'Ra ≤ 0.4 µm Capability' }
      ],
      primaryImage: '/images/rhombic-carbide-turning-insert.jpg',
      galleryImages: [
        '/images/rhombic-carbide-turning-insert.jpg',
        '/images/indexable-carbide-inserts-assortment.jpg'
      ],
      specCount: 17,
      hasVideo: true,
      photoCount: 2
    }
  ]);

  // 4. Sample Enquiry matching screenshot 3/5
  await Enquiry.create({
    enquiryCode: 'TC-RFQ-9021',
    productTitle: 'VRX-5F Sub-Micron Solid Carbide End Mill Series',
    productModel: 'VRX-120-5F-ALTIN',
    manufacturerName: 'Stuttgart Grinding & Carbide Works',
    fullName: 'Elena Vance',
    companyName: 'Apex Aero GmbH',
    email: 'engineering@company.cc',
    phone: '+49 711 555 0190',
    requiredQuantity: '25 units / 1 system',
    targetTimeline: 'Within 30 Days',
    requirements: 'Need custom h6 shank tolerance, AlTiN-Si coating, and batch inspection sheet for turbine impeller machining.',
    status: 'SUBMITTED'
  });

  console.log('[Seed] Database successfully seeded with 6 tools, 3 manufacturers, and sample RFQ!');
};

if (require.main === module) {
  connectDB().then(async () => {
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  });
}
