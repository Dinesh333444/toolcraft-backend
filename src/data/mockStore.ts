import bcrypt from 'bcryptjs';

export interface MockEnquiry {
  _id: string;
  enquiryCode: string;
  productId?: string;
  customerId?: string;
  productTitle: string;
  productModel: string;
  manufacturerName: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  requiredQuantity: string;
  targetTimeline: string;
  requirements: string;
  status: 'New' | 'Reviewed' | 'Quoted' | 'Archived' | 'SUBMITTED';
  quotation?: {
    unitPrice: number;
    currency: string;
    leadTimeWeeks: number;
    freightCharges: number;
    terms: string;
    validUntil: string;
    issuedAt: string;
  };
  createdAt: string;
}

export interface MockUser {
  _id: string;
  email: string;
  passwordHash: string;
  role: 'BUYER' | 'MANUFACTURER_ADMIN' | 'MANUFACTURER_STAFF' | 'MODERATOR' | 'SUPER_ADMIN';
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED';
  firstName: string;
  lastName: string;
  companyName: string;
  facilityLocation?: string;
  specialization?: string;
  standards?: string;
  phoneNumber?: string;
  taxId?: string;
  idProofDocument?: string;
  rejectionReason?: string;
  createdAt: string;
}

export const initialManufacturers = [
  {
    _id: 'mfr-001',
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
    contactPhone: '+49 711 555 0190',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mfr-002',
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
    contactPhone: '+81 6 6203 1111',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mfr-003',
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
    contactPhone: '+49 89 321 9980',
    createdAt: new Date().toISOString()
  }
];

export const initialProducts = [
  {
    _id: 'prod-001',
    title: 'VRX-5F Double-Cut Solid Carbide Rotary Burr Series',
    slug: 'vrx-120-5f-altin',
    sku: 'SKU-VRX-120-5F',
    modelNumber: 'VRX-120-5F-ALTIN',
    series: '2026 Series K-900',
    standards: ['DIN 6527', 'DIN 6535 HA Cylindrical Shank', 'ISO 1832'],
    category: 'Carbide Tools',
    categorySlug: 'carbide-tools',
    description: 'Precision tungsten carbide rotary burrs with diamond and double-cut flute geometry for high-feed deburring, contouring, and weld seam removal.',
    isNewRelease: true,
    status: 'PUBLISHED',
    manufacturerName: 'Stuttgart Grinding & Carbide Works',
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
    specCount: 20,
    hasVideo: true,
    photoCount: 2,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-002',
    title: 'KX-500 Precision Tooling & 5-Axis Fixture System',
    slug: 'kx-500-5x',
    sku: 'SKU-KX-500-5X',
    modelNumber: 'KX-500-5X',
    series: '2026 Machine Line',
    standards: ['ISO 10791-7', 'VDI/DGQ 3441', 'ISO 1940 G0.4'],
    category: 'Industrial Machinery',
    categorySlug: 'industrial-machinery',
    description: 'Heavy-duty precision lathe chuck, indexable carbide turning inserts, ground fixture sleeves, and solid carbide end mills engineered for simultaneous 5-axis machining.',
    isNewRelease: true,
    status: 'PUBLISHED',
    manufacturerName: 'Bavaria Heavy Kinematics GmbH',
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
    specCount: 19,
    hasVideo: true,
    photoCount: 2,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-003',
    title: 'RB-10X Tungsten Carbide Die Grinder Rotary Burr Assortment Kit',
    slug: 'mb-351-511',
    sku: 'SKU-MB-351-511',
    modelNumber: 'MB-351-511',
    series: '2026 Precision Series',
    standards: ['ISO/IEC 17025', 'DIN 863-1', 'ISO 3611'],
    category: 'Precision Tools',
    categorySlug: 'precision-tools',
    description: 'Comprehensive 10-piece industrial die grinder burr set featuring ball-nose, cylindrical, flame, inverted cone, and tree-pointed profiles for sub-micron contouring.',
    isNewRelease: true,
    status: 'PUBLISHED',
    manufacturerName: 'Osaka Metrology & Calibration Lab',
    previewSpecs: [
      { label: 'Profile Count', value: '10 Profile Geometries' },
      { label: 'Shank Diameter', value: '6.00 mm (h6 ground)' },
      { label: 'Carbide Grade', value: 'Micro-Grain WC 92 HRA' }
    ],
    geometry: {
      cuttingDiameterD1: 12.0,
      diameterTolerance: '±0.002 mm optical flatness',
      overallLengthL1: 65
    },
    metallurgy: {
      carbideSubstrate: 'Tungsten carbide optical contact anvils',
      coating: 'Diamond-cut double helix flutes',
      hardness: '≥ 92 HRA heads',
      maxTemp: 'Reference calibrated at 20.0 °C'
    },
    cuttingParameters: {
      feedRate: '0.5 mm spindle pitch per revolution',
      cuttingSpeed: '25,000 - 45,000 RPM'
    },
    primaryImage: '/images/die-grinder-burr-kit.jpg',
    galleryImages: [
      '/images/die-grinder-burr-kit.jpg',
      '/images/carbide-rotary-burrs.jpg'
    ],
    specCount: 17,
    hasVideo: true,
    photoCount: 2,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-004',
    title: 'TD-1200 High-Speed Solid Carbide Parabolic Twist Drill Bit Set',
    slug: 'atx-1425-pro',
    sku: 'SKU-ATX-1425-PRO',
    modelNumber: 'ATX-1425-PRO',
    series: 'Automotive Powertrain Series',
    standards: ['DIN 338', 'ISO 13399', 'ASME B94.11M'],
    category: 'Automotive',
    categorySlug: 'automotive',
    description: 'Graduated precision metric twist drill bit set with split-point geometry and parabolic flute design for high-penetration chip evacuation in alloy steels and superalloys.',
    isNewRelease: true,
    status: 'PUBLISHED',
    manufacturerName: 'Stuttgart Grinding & Carbide Works',
    previewSpecs: [
      { label: 'Point Angle', value: '135° Split Point Self-Centering' },
      { label: 'Range', value: '1.0 mm - 13.0 mm Graduated' },
      { label: 'Flute Helix', value: 'Fast Parabolic Spiral' }
    ],
    geometry: {
      overallLengthL1: 151,
      shankDiameterD2: 12.0
    },
    metallurgy: {
      carbideSubstrate: 'Ultra-pure HSS-Co8 / Solid Micrograin Carbide',
      coating: 'Vapor-degreased bright polished & TiN tip',
      hardness: '66 - 68 HRC cutting edges',
      maxTemp: '-10 °C to +650 °C operating range'
    },
    cuttingParameters: {
      feedRate: '0.12 - 0.35 mm/rev high feed',
      cuttingSpeed: 'Up to 90 m/min with coolant'
    },
    primaryImage: '/images/hss-twist-drill-set.jpg',
    galleryImages: [
      '/images/hss-twist-drill-set.jpg',
      '/images/precision-tooling-fixtures.jpg'
    ],
    specCount: 16,
    hasVideo: true,
    photoCount: 2,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-005',
    title: 'CM-60 Single-Flute Solid Carbide Engraving & Chamfer Mill',
    slug: 'cm-60-chamfer',
    sku: 'SKU-CM-60-CHAMFER',
    modelNumber: 'CM-60-90D-ALTIN',
    series: 'Precision Chamfering Series',
    standards: ['DIN 6535 HA', 'ISO 1832'],
    category: 'Carbide Tools',
    categorySlug: 'carbide-tools',
    description: 'Single-flute solid tungsten carbide chamfer and V-groove mill with polished flute rake for mirror-finish beveling, deburring, and optical-grade engraving.',
    isNewRelease: true,
    status: 'PUBLISHED',
    manufacturerName: 'Stuttgart Grinding & Carbide Works',
    previewSpecs: [
      { label: 'Tip Angle', value: '60° / 90° Optical Point' },
      { label: 'Shank Tolerance', value: 'h6 (±0.005 mm)' },
      { label: 'Flute Geometry', value: 'Single Polished Mirror Flute' }
    ],
    geometry: {
      cuttingDiameterD1: 6.00,
      diameterTolerance: 'h6 (±0.005) mm',
      shankDiameterD2: 6.00,
      fluteLengthL2: 16.0,
      overallLengthL1: 50.0,
      flutesZ: 1,
      helixAngle: '30° deg',
      cornerChamfer: 'Pointed'
    },
    metallurgy: {
      carbideSubstrate: 'Sub-micron 0.5 µm Tungsten Carbide',
      coating: 'AlTiN PVD Micro-Coating',
      hardness: '3,200 HV',
      maxTemp: '900 °C'
    },
    cuttingParameters: {
      feedRate: '0.03 - 0.06 mm/tooth',
      cuttingSpeed: '180 - 320 m/min'
    },
    primaryImage: '/images/single-flute-chamfer-mill.webp',
    galleryImages: [
      '/images/single-flute-chamfer-mill.webp',
      '/images/carbide-rotary-burrs.jpg'
    ],
    specCount: 15,
    hasVideo: true,
    photoCount: 2,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-006',
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
    manufacturerName: 'Stuttgart Grinding & Carbide Works',
    previewSpecs: [
      { label: 'Insert Types', value: 'CNMG, DNMG, TNMG, SNMG' },
      { label: 'Coating Tech', value: 'Multi-Layer CVD Al2O3 + TiCN' },
      { label: 'Chipbreaker', value: 'Bi-Directional Wave Breaker' }
    ],
    geometry: {
      cuttingDiameterD1: 16.00,
      diameterTolerance: 'ISO Class M (±0.013 mm)',
      shankDiameterD2: 16.00,
      overallLengthL1: 16.0,
      flutesZ: 4,
      cornerChamfer: 'R0.4 / R0.8 mm Nose Radius'
    },
    metallurgy: {
      carbideSubstrate: 'Functional Gradient Tungsten Carbide (FGC)',
      coating: 'CVD Black / TiN Gold / PVD Silver',
      hardness: '92.5 HRA Core',
      maxTemp: '1,200 °C'
    },
    cuttingParameters: {
      feedRate: '0.15 - 0.45 mm/rev',
      cuttingSpeed: '180 - 360 m/min'
    },
    primaryImage: '/images/indexable-carbide-inserts-assortment.jpg',
    galleryImages: [
      '/images/indexable-carbide-inserts-assortment.jpg',
      '/images/gold-trigon-carbide-inserts.jpg',
      '/images/rhombic-carbide-turning-insert.jpg'
    ],
    specCount: 18,
    hasVideo: true,
    photoCount: 3,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-007',
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
    manufacturerName: 'Bavaria Heavy Kinematics GmbH',
    previewSpecs: [
      { label: 'Edge Count', value: '6 Double-Sided Cutting Edges' },
      { label: 'Coating', value: 'Ultra-Dense Gold TiN PVD' },
      { label: 'Workpiece Range', value: 'Carbon Steel, Alloy Steel (P Group)' }
    ],
    geometry: {
      cuttingDiameterD1: 12.70,
      diameterTolerance: '±0.025 mm',
      fluteLengthL2: 8.0,
      overallLengthL1: 12.7,
      cornerChamfer: '0.80 mm Corner Radius'
    },
    metallurgy: {
      carbideSubstrate: 'Micro-Grain WC-Co (8% Cobalt)',
      coating: 'High-Luster TiN PVD Gold',
      hardness: '3,100 HV',
      maxTemp: '950 °C'
    },
    cuttingParameters: {
      feedRate: '0.20 - 0.50 mm/rev',
      cuttingSpeed: '160 - 280 m/min'
    },
    primaryImage: '/images/gold-trigon-carbide-inserts.jpg',
    galleryImages: [
      '/images/gold-trigon-carbide-inserts.jpg',
      '/images/indexable-carbide-inserts-assortment.jpg'
    ],
    specCount: 16,
    hasVideo: true,
    photoCount: 2,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-008',
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
    manufacturerName: 'Osaka Metrology & Calibration Lab',
    previewSpecs: [
      { label: 'Profile Angle', value: '35° Acute Rhombic Profile' },
      { label: 'Nose Radius', value: '0.40 mm High-Precision Ground' },
      { label: 'Surface Finish', value: 'Ra ≤ 0.4 µm Capability' }
    ],
    geometry: {
      cuttingDiameterD1: 9.52,
      diameterTolerance: 'Class G (±0.005 mm)',
      overallLengthL1: 16.6,
      cornerChamfer: '0.40 mm Ground Nose Radius'
    },
    metallurgy: {
      carbideSubstrate: 'Sub-Micron Tungsten Carbide (0.3 µm)',
      coating: 'AlTiN Charcoal PVD Wear Barrier',
      hardness: '3,600 HV 0.05',
      maxTemp: '1,100 °C'
    },
    cuttingParameters: {
      feedRate: '0.05 - 0.18 mm/rev',
      cuttingSpeed: '220 - 400 m/min'
    },
    primaryImage: '/images/rhombic-carbide-turning-insert.jpg',
    galleryImages: [
      '/images/rhombic-carbide-turning-insert.jpg',
      '/images/indexable-carbide-inserts-assortment.jpg'
    ],
    specCount: 17,
    hasVideo: true,
    photoCount: 2,
    createdAt: new Date().toISOString()
  }
];

// Seed enquiries matching Screenshot 1 exactly!
export const initialEnquiries: MockEnquiry[] = [
  {
    _id: 'enq-001',
    enquiryCode: 'ENQ-MWL6T13T-J7UG',
    productTitle: 'General Technical Desk Inquiry',
    productModel: 'TC-DESK',
    manufacturerName: 'ToolCraft Application Desk',
    fullName: 'Elena Rostova',
    companyName: 'Rostova Precision GmbH',
    email: 'elena.r@rostova-precision.de',
    phone: '+49 89 223 9011',
    requiredQuantity: 'General Inquiry',
    targetTimeline: 'Within 30 Days',
    requirements: 'Consultation requested on carbide tooling tolerances for Inconel 718 aerospace turbine casings.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'enq-002',
    enquiryCode: 'ENQ-MWL6IS44-X706',
    productTitle: 'General Technical Desk Inquiry',
    productModel: 'TC-DESK',
    manufacturerName: 'ToolCraft Application Desk',
    fullName: 'Marcus Weber',
    companyName: 'Weber Antriebstechnik',
    email: 'm.weber@weber-antrieb.de',
    phone: '+49 711 555 0190',
    requiredQuantity: 'General Inquiry',
    targetTimeline: 'Within 30 Days',
    requirements: 'Spindle integration specs needed for high-speed ceramic bearing retrofits.',
    status: 'New',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: 'enq-003',
    customerId: 'user-customer-demo',
    enquiryCode: 'ENQ-MWL65QPN-0G4W',
    productTitle: 'VRX-5F Sub-Micron Solid Carbide End Mill Series',
    productModel: 'VRX-120-5F-ALTIN',
    manufacturerName: 'Stuttgart Grinding & Carbide Works',
    fullName: 'Elena Vance',
    companyName: 'Apex Aero GmbH',
    email: 'elena.vance@apex-aero.com',
    phone: '+49 711 555 0190',
    requiredQuantity: '40 units',
    targetTimeline: 'Within 30 Days',
    requirements: 'Need custom h6 shank tolerance, AlTiN-Si coating, and batch inspection sheet for turbine impeller machining.',
    status: 'New',
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    _id: 'enq-004',
    customerId: 'user-customer-demo',
    enquiryCode: 'ENQ-MWL79AX2-4821',
    productTitle: 'KX-500 Simultaneous 5-Axis Micro-Machining Center',
    productModel: 'KX-500-5X',
    manufacturerName: 'Bavaria Heavy Kinematics GmbH',
    fullName: 'Elena Vance',
    companyName: 'Apex Aero GmbH',
    email: 'elena.vance@apex-aero.com',
    phone: '+49 711 555 0190',
    requiredQuantity: '1 complete system',
    targetTimeline: 'Within 60 Days',
    requirements: '5-axis machining center with HSK-E40 high-speed electro-spindle and Heidenhain TNC 640 controller.',
    status: 'Quoted',
    quotation: {
      unitPrice: 285000,
      currency: 'EUR',
      leadTimeWeeks: 6,
      freightCharges: 3200,
      terms: 'FOB Munich plant. Includes on-site laser metrology calibration and 24-month OEM warranty.',
      validUntil: new Date(Date.now() + 25 * 86400000).toISOString(),
      issuedAt: new Date(Date.now() - 86400000).toISOString()
    },
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const initialUsers: MockUser[] = [
  {
    _id: 'user-customer-demo',
    email: 'elena.vance@apex-aero.com',
    passwordHash: '$2a$10$w8u3ZgD4Qf8L.m.n0D2yC.m3M2yE5l1u9yH0v7O6k9s0z1x2c3v4',
    role: 'BUYER',
    status: 'ACTIVE',
    firstName: 'Elena',
    lastName: 'Vance',
    companyName: 'Apex Aero GmbH',
    phoneNumber: '+49 711 555 0190',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user-admin',
    email: 'admin@toolcraft.example',
    passwordHash: '$2a$10$w8u3ZgD4Qf8L.m.n0D2yC.m3M2yE5l1u9yH0v7O6k9s0z1x2c3v4',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    firstName: 'Platform',
    lastName: 'Admin',
    companyName: 'ToolCraft Operations',
    phoneNumber: '+1-800-TOOL-CRAFT',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user-admin-com',
    email: 'admin@toolcraft.com',
    passwordHash: '$2a$10$w8u3ZgD4Qf8L.m.n0D2yC.m3M2yE5l1u9yH0v7O6k9s0z1x2c3v4',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    firstName: 'Platform',
    lastName: 'Admin',
    companyName: 'ToolCraft Operations',
    phoneNumber: '+1-800-TOOL-CRAFT',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user-mfr-active',
    email: 'contact@stuttgart-grinding.example',
    passwordHash: '$2a$10$w8u3ZgD4Qf8L.m.n0D2yC.m3M2yE5l1u9yH0v7O6k9s0z1x2c3v4',
    role: 'MANUFACTURER_ADMIN',
    status: 'ACTIVE',
    firstName: 'Hans',
    lastName: 'Mueller',
    companyName: 'Stuttgart Grinding & Carbide Works',
    facilityLocation: 'Stuttgart, Germany',
    specialization: '5-Axis CNC Flute Grinding & AlTiN PVD Deposition',
    standards: 'DIN 6527, ISO 1832',
    phoneNumber: '+49 711 555 0190',
    taxId: 'DE147258369 (HRB 88201 Amtsgericht Stuttgart)',
    idProofDocument: 'Commercial_Register_Extract_Stuttgart_GmbH_2026.pdf',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: 'user-mfr-active-de',
    email: 'mfr@stuttgart-grinding.de',
    passwordHash: '$2a$10$w8u3ZgD4Qf8L.m.n0D2yC.m3M2yE5l1u9yH0v7O6k9s0z1x2c3v4',
    role: 'MANUFACTURER_ADMIN',
    status: 'ACTIVE',
    firstName: 'Hans',
    lastName: 'Mueller',
    companyName: 'Stuttgart Grinding & Carbide Works',
    facilityLocation: 'Stuttgart, Germany',
    specialization: '5-Axis CNC Flute Grinding & AlTiN PVD Deposition',
    standards: 'DIN 6527, ISO 1832',
    phoneNumber: '+49 711 555 0190',
    taxId: 'DE147258369 (HRB 88201 Amtsgericht Stuttgart)',
    idProofDocument: 'Commercial_Register_Extract_Stuttgart_GmbH_2026.pdf',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: 'user-mfr-active-generic',
    email: 'contact@manufacturer.com',
    passwordHash: '$2a$10$w8u3ZgD4Qf8L.m.n0D2yC.m3M2yE5l1u9yH0v7O6k9s0z1x2c3v4',
    role: 'MANUFACTURER_ADMIN',
    status: 'ACTIVE',
    firstName: 'Hans',
    lastName: 'Mueller',
    companyName: 'Stuttgart Grinding & Carbide Works',
    facilityLocation: 'Stuttgart, Germany',
    specialization: '5-Axis CNC Flute Grinding & AlTiN PVD Deposition',
    standards: 'DIN 6527, ISO 1832',
    phoneNumber: '+49 711 555 0190',
    taxId: 'DE147258369 (HRB 88201 Amtsgericht Stuttgart)',
    idProofDocument: 'Commercial_Register_Extract_Stuttgart_GmbH_2026.pdf',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: 'user-mfr-pending',
    email: 'audit@alpine-machining.example',
    passwordHash: '$2a$10$w8u3ZgD4Qf8L.m.n0D2yC.m3M2yE5l1u9yH0v7O6k9s0z1x2c3v4',
    role: 'MANUFACTURER_ADMIN',
    status: 'PENDING_APPROVAL',
    firstName: 'Stefan',
    lastName: 'Kronvik',
    companyName: 'Alpine High-Speed Machining GmbH',
    facilityLocation: 'Nuremberg, Germany',
    specialization: 'Precision Carbide Chamfer & Ball Nose Mills',
    standards: 'DIN 6535 HA, ISO 9001',
    phoneNumber: '+49 911 800 4422',
    taxId: 'DE314892019 (HRB 104928 Amtsgericht Nürnberg)',
    idProofDocument: 'Commercial_Register_Extract_Kronvik_GmbH_2026.pdf',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'user-mfr-pending-de',
    email: 'pending@kronvik-precision.de',
    passwordHash: '$2a$10$w8u3ZgD4Qf8L.m.n0D2yC.m3M2yE5l1u9yH0v7O6k9s0z1x2c3v4',
    role: 'MANUFACTURER_ADMIN',
    status: 'PENDING_APPROVAL',
    firstName: 'Stefan',
    lastName: 'Kronvik',
    companyName: 'Kronvik Precision Tooling GmbH',
    facilityLocation: 'Nuremberg, Germany',
    specialization: 'Precision Carbide Chamfer & Ball Nose Mills',
    standards: 'DIN 6535 HA, ISO 9001',
    phoneNumber: '+49 911 800 4422',
    taxId: 'DE314892019 (HRB 104928 Amtsgericht Nürnberg)',
    idProofDocument: 'Commercial_Register_Extract_Kronvik_GmbH_2026.pdf',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

class MemoryStore {
  manufacturers = [...initialManufacturers];
  products = [...initialProducts];
  enquiries: MockEnquiry[] = [...initialEnquiries];
  users: MockUser[] = [...initialUsers];

  getProducts(filter?: { category?: string; q?: string; newReleases?: boolean }) {
    let result = [...this.products];
    if (filter?.category && filter.category !== 'All Categories') {
      result = result.filter(p => p.category === filter.category);
    }
    if (filter?.newReleases) {
      result = result.filter(p => p.isNewRelease);
    }
    if (filter?.q) {
      const q = filter.q.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.modelNumber.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.manufacturerName.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getProduct(identifier: string) {
    return this.products.find(p => p.slug === identifier || p._id === identifier);
  }

  addProduct(productData: any) {
    const newProd = {
      _id: `prod-${Date.now()}`,
      slug: productData.slug || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: productData.sku || productData.modelNumber,
      isNewRelease: productData.isNewRelease ?? true,
      status: 'PUBLISHED',
      manufacturerName: productData.manufacturerName || 'Stuttgart Grinding & Carbide Works',
      photoCount: productData.galleryImages?.length || 1,
      hasVideo: !!productData.videoUrl,
      specCount: productData.specCount || (productData.specsTable?.length || 15),
      createdAt: new Date().toISOString(),
      ...productData
    };
    this.products.unshift(newProd);
    return newProd;
  }

  getManufacturers() {
    return this.manufacturers;
  }

  getEnquiries(statusFilter?: string) {
    if (!statusFilter || statusFilter === 'All') {
      return this.enquiries;
    }
    return this.enquiries.filter(e => e.status.toLowerCase() === statusFilter.toLowerCase());
  }

  getCustomerEnquiries(customerId?: string, email?: string) {
    return this.enquiries.filter(e => {
      if (customerId && e.customerId === customerId) return true;
      if (email && e.email && e.email.toLowerCase() === email.toLowerCase()) return true;
      return false;
    });
  }

  addEnquiry(data: any): MockEnquiry {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newEnq: MockEnquiry = {
      _id: `enq-${Date.now()}`,
      enquiryCode: `ENQ-${Date.now().toString(36).toUpperCase()}-${randomNum}`,
      ...data,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    this.enquiries.unshift(newEnq);
    return newEnq;
  }

  createCustomer(data: { email: string; passwordHash: string; firstName: string; lastName: string }): MockUser {
    const newUser: MockUser = {
      _id: `user-cust-${Date.now()}`,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: 'BUYER',
      status: 'ACTIVE',
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: `${data.firstName} Aerospace / Precision Tech`,
      createdAt: new Date().toISOString()
    };
    this.users.unshift(newUser);
    return newUser;
  }

  quoteEnquiry(id: string, quoteData: any) {
    const enq = this.enquiries.find(e => e._id === id);
    if (enq) {
      enq.status = 'Quoted';
      enq.quotation = {
        ...quoteData,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        issuedAt: new Date().toISOString()
      };
    }
    return enq;
  }

  findUserByEmail(email: string) {
    if (!email) return undefined;
    const clean = email.trim().toLowerCase();
    
    // Direct match
    const direct = this.users.find(u => u.email.toLowerCase() === clean);
    if (direct) return direct;

    // Admin alias fallback
    if (clean.includes('admin') || clean === 'admin@toolcraft.example' || clean === 'admin@toolcraft.com') {
      return this.users.find(u => u.role === 'SUPER_ADMIN');
    }

    // Approved OEM alias fallback
    if (clean.includes('stuttgart') || clean.includes('manufacturer') || clean === 'contact@stuttgart-grinding.example' || clean === 'mfr@stuttgart-grinding.de') {
      return this.users.find(u => u.role === 'MANUFACTURER_ADMIN' && u.status === 'ACTIVE');
    }

    // Pending OEM alias fallback
    if (clean.includes('alpine') || clean.includes('kronvik') || clean.includes('pending') || clean === 'audit@alpine-machining.example') {
      return this.users.find(u => u.role === 'MANUFACTURER_ADMIN' && u.status === 'PENDING_APPROVAL');
    }

    // Customer alias fallback
    if (clean.includes('elena') || clean.includes('customer') || clean.includes('vance')) {
      return this.users.find(u => u.role === 'BUYER');
    }

    return undefined;
  }

  findUserById(id: string) {
    return this.users.find(u => u._id === id);
  }

  registerManufacturer(data: {
    email: string;
    passwordHash: string;
    companyName: string;
    firstName: string;
    lastName: string;
    facilityLocation?: string;
    specialization?: string;
    standards?: string;
    phoneNumber?: string;
    taxId?: string;
    idProofDocument?: string;
  }): MockUser {
    const newUser: MockUser = {
      _id: `user-${Date.now()}`,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: 'MANUFACTURER_ADMIN',
      status: 'PENDING_APPROVAL', // Mandatory approval required!
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      facilityLocation: data.facilityLocation,
      specialization: data.specialization,
      standards: data.standards,
      phoneNumber: data.phoneNumber,
      taxId: data.taxId || `DE${Math.floor(100000000 + Math.random() * 900000000)} (Trade License Attached)`,
      idProofDocument: data.idProofDocument || 'Commercial_Register_Extract_Uploaded.pdf',
      createdAt: new Date().toISOString()
    };
    this.users.unshift(newUser);
    return newUser;
  }

  getPendingManufacturers() {
    return this.users.filter(u => u.role === 'MANUFACTURER_ADMIN' && u.status === 'PENDING_APPROVAL');
  }

  getAllManufacturerRequests(statusFilter?: string) {
    let list = this.users.filter(u => u.role === 'MANUFACTURER_ADMIN');
    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter(u => u.status.toUpperCase() === statusFilter.toUpperCase());
    }
    return list;
  }

  approveManufacturer(userId: string) {
    const user = this.users.find(u => u._id === userId);
    if (user) {
      user.status = 'ACTIVE';
      delete user.rejectionReason;
      // Also add or activate in manufacturers directory
      const exists = this.manufacturers.find(m => m.name.toLowerCase() === user.companyName.toLowerCase());
      if (!exists) {
        this.manufacturers.push({
          _id: `mfr-${Date.now()}`,
          name: user.companyName,
          slug: user.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          standards: user.standards ? user.standards.split(',').map(s => s.trim()) : ['ISO 9001:2015'],
          specialization: user.specialization || 'Precision Tooling & Manufacturing',
          benchmarkMetric: 'Verified OEM engineering facility certified on ToolCraft.',
          country: user.facilityLocation ? user.facilityLocation.split(',')[1]?.trim() || 'Germany' : 'Germany',
          city: user.facilityLocation ? user.facilityLocation.split(',')[0]?.trim() || 'Stuttgart' : 'Stuttgart',
          address: user.facilityLocation || 'Industrial Park',
          taxId: user.taxId || `DE${Math.floor(100000000 + Math.random() * 900000000)}`,
          isVerified: true,
          status: 'ACTIVE',
          capabilities: [user.specialization || 'Tooling'],
          certifications: ['ISO 9001:2015'],
          contactEmail: user.email,
          contactPhone: user.phoneNumber || '+49 711 000 000',
          createdAt: new Date().toISOString()
        });
      }
    }
    return user;
  }

  rejectManufacturer(userId: string, reason?: string) {
    const user = this.users.find(u => u._id === userId);
    if (user) {
      user.status = 'REJECTED';
      user.rejectionReason = reason || 'Documentation failed compliance with ISO/DIN accreditation standards.';
    }
    return user;
  }
}

export const mockStore = new MemoryStore();
