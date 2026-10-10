import { FSMSInput, HACCPPlan, VACCPPlan, TACCPPlan, HazardAnalysis, CCP, VACCPEntry, TACCPEntry, TeamMember, ProductionStep, RawMaterial } from '../types';

// Common hazards by food category
const biologicalHazards: Record<string, string[]> = {
  meat: ['Salmonella spp.', 'E. coli O157:H7', 'Listeria monocytogenes', 'Campylobacter jejuni', 'Clostridium perfringens', 'Staphylococcus aureus'],
  dairy: ['Listeria monocytogenes', 'Salmonella spp.', 'E. coli', 'Campylobacter', 'Brucella spp.', 'Mycobacterium bovis'],
  seafood: ['Vibrio parahaemolyticus', 'Vibrio vulnificus', 'Listeria monocytogenes', 'Clostridium botulinum', 'Anisakis spp.', 'Norovirus'],
  produce: ['E. coli O157:H7', 'Salmonella spp.', 'Listeria monocytogenes', 'Hepatitis A', 'Cyclospora cayetanensis', 'Norovirus'],
  grains: ['Bacillus cereus', 'Clostridium perfringens', 'Aspergillus flavus (aflatoxin)', 'Fusarium spp. (DON)', 'Ergot alkaloids'],
  general: ['Salmonella spp.', 'E. coli', 'Listeria monocytogenes', 'Staphylococcus aureus', 'Bacillus cereus', 'Clostridium perfringens'],
};

const chemicalHazards: Record<string, string[]> = {
  meat: ['Antibiotic residues', 'Hormone residues', 'Heavy metals (Pb, Cd)', 'Pesticide residues', 'Dioxins/PCBs'],
  dairy: ['Antibiotic residues', 'Aflatoxin M1', 'Melamine', 'Heavy metals', 'Cleaning chemical residues'],
  seafood: ['Heavy metals (Hg, Cd, Pb)', 'Histamine', 'Biotoxins (PSP, DSP, ASP)', 'PCB/dioxin contamination', 'Paralytic shellfish poison'],
  produce: ['Pesticide residues', 'Heavy metals', 'Mycotoxins', 'Cleaning chemical residues', 'Nitrate accumulation'],
  grains: ['Mycotoxins (Aflatoxin, DON, Ochratoxin)', 'Pesticide residues', 'Heavy metals', 'Acrylamide (processing)', 'Fumonisins'],
  general: ['Heavy metals', 'Pesticide residues', 'Mycotoxins', 'Cleaning chemical residues', 'Processing contaminants (acrylamide, PAH)'],
};

const physicalHazards: string[] = [
  'Metal fragments', 'Glass shards', 'Stone/rock particles', 'Wood splinters',
  'Plastic pieces', 'Bone fragments', 'Pest contamination (insects, rodent hair)',
  'Jewelry', 'Personal items'
];

const allergenicHazards: string[] = [
  'Milk', 'Eggs', 'Fish', 'Crustacean shellfish', 'Tree nuts', 'Peanuts',
  'Wheat', 'Soybeans', 'Sesame', 'Mustard', 'Celery', 'Sulphites'
];

function getCategory(input: FSMSInput): string {
  const category = input.productCategory.toLowerCase();
  if (category.includes('meat') || category.includes('poultry') || category.includes('beef') || category.includes('pork') || category.includes('chicken')) return 'meat';
  if (category.includes('dairy') || category.includes('milk') || category.includes('cheese') || category.includes('yogurt')) return 'dairy';
  if (category.includes('seafood') || category.includes('fish') || category.includes('shellfish') || category.includes('shrimp')) return 'seafood';
  if (category.includes('produce') || category.includes('fruit') || category.includes('vegetable') || category.includes('fresh')) return 'produce';
  if (category.includes('grain') || category.includes('cereal') || category.includes('bread') || category.includes('bakery') || category.includes('flour')) return 'grains';
  return 'general';
}

function generateTeamMembers(input: FSMSInput): TeamMember[] {
  if (input.teamMembers.length > 0) return input.teamMembers;
  
  return [
    { id: '1', name: 'Quality Assurance Manager', role: 'Team Leader', department: 'Quality Assurance', qualifications: 'Food Science degree, HACCP certified, 5+ years experience' },
    { id: '2', name: 'Production Manager', role: 'Process Expert', department: 'Production', qualifications: 'Engineering degree, production management experience' },
    { id: '3', name: 'Microbiologist', role: 'Microbiology Expert', department: 'Laboratory', qualifications: 'Microbiology degree, food microbiology specialization' },
    { id: '4', name: 'Maintenance Engineer', role: 'Equipment Expert', department: 'Maintenance', qualifications: 'Engineering degree, food equipment maintenance' },
    { id: '5', name: 'Food Technologist', role: 'Product Expert', department: 'R&D', qualifications: 'Food Technology degree, product development experience' },
    { id: '6', name: 'Sanitation Supervisor', role: 'Sanitation Expert', department: 'Sanitation', qualifications: 'Sanitation certification, chemical handling training' },
    { id: '7', name: 'Regulatory Affairs Specialist', role: 'Regulatory Expert', department: 'Regulatory', qualifications: 'Law/Regulatory degree, food law expertise' },
  ];
}

function generateHazardAnalysis(input: FSMSInput): HazardAnalysis[] {
  const category = getCategory(input);
  const hazards: HazardAnalysis[] = [];
  
  input.productionSteps.forEach((step) => {
    const stepName = step.stepName.toLowerCase();
    
    // Biological hazards
    const bioHazards = biologicalHazards[category] || biologicalHazards.general;
    const relevantBio = bioHazards.filter(h => {
      if (stepName.includes('cook') || stepName.includes('heat') || stepName.includes('pasteur') || stepName.includes('steriliz')) return true;
      if (stepName.includes('receiv') || stepName.includes('storage') || stepName.includes('store')) return true;
      if (stepName.includes('cool') || stepName.includes('chill') || stepName.includes('refrigerat')) return true;
      if (stepName.includes('cut') || stepName.includes('slice') || stepName.includes('process')) return true;
      return Math.random() > 0.7;
    }).slice(0, 2);

    relevantBio.forEach(hazard => {
      const severity = hazard.includes('Listeria') || hazard.includes('E. coli O157') || hazard.includes('botulinum') ? 'Critical' : 'High';
      const likelihood = stepName.includes('cook') || stepName.includes('heat') ? 'Low' : 'Medium';
      const riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = severity === 'Critical' ? 'Critical' : (likelihood as string) === 'High' ? 'High' : 'Medium';
      
      hazards.push({
        step: step.stepName,
        hazardType: 'Biological',
        hazardDescription: hazard,
        severity,
        likelihood,
        riskLevel,
        isCCP: riskLevel === 'Critical' || riskLevel === 'High',
        justification: `Pathogen can cause severe illness. ${stepName.includes('cook') || stepName.includes('heat') ? 'Controlled by thermal process.' : 'May survive/grow if not controlled.'}`,
        controlMeasure: stepName.includes('cook') || stepName.includes('heat') ? 
          `Thermal processing to achieve ${hazard.includes('Listeria') ? '72°C for 15 seconds' : 'minimum 70°C core temperature'}` :
          `Temperature control below 5°C, hygiene controls, prevent cross-contamination`
      });
    });

    // Chemical hazards
    const chemHazards = chemicalHazards[category] || chemicalHazards.general;
    if (stepName.includes('receiv') || stepName.includes('storage') || stepName.includes('add') || stepName.includes('mix')) {
      const relevantChem = chemHazards.slice(0, 2);
      relevantChem.forEach(hazard => {
        hazards.push({
          step: step.stepName,
          hazardType: 'Chemical',
          hazardDescription: hazard,
          severity: hazard.includes('Aflatoxin') || hazard.includes('dioxin') || hazard.includes('botulinum') ? 'Critical' : 'High',
          likelihood: 'Low',
          riskLevel: 'Medium',
          isCCP: false,
          justification: `Controlled through supplier approval and prerequisite programs.`,
          controlMeasure: `Supplier verification, Certificate of Analysis (CoA), incoming inspection`
        });
      });
    }

    // Physical hazards
    if (stepName.includes('receiv') || stepName.includes('process') || stepName.includes('pack') || stepName.includes('fill') || stepName.includes('mix')) {
      const relevantPhys = physicalHazards.slice(0, 2);
      relevantPhys.forEach(hazard => {
        hazards.push({
          step: step.stepName,
          hazardType: 'Physical',
          hazardDescription: hazard,
          severity: 'Medium',
          likelihood: stepName.includes('pack') ? 'Medium' : 'Low',
          riskLevel: stepName.includes('pack') ? 'Medium' : 'Low',
          isCCP: stepName.includes('metal') || stepName.includes('detect') || stepName.includes('x-ray'),
          justification: `Physical contamination risk during ${step.stepName}.`,
          controlMeasure: stepName.includes('metal') || stepName.includes('detect') ?
            'Metal detector/X-ray inspection with automatic rejection' :
            'Visual inspection, equipment maintenance, glass register, sieving/filtration'
        });
      });
    }

    // Allergenic hazards
    if (stepName.includes('add') || stepName.includes('mix') || stepName.includes('blend') || stepName.includes('receiv')) {
      const inputMaterials = input.rawMaterials.map(m => m.name.toLowerCase());
      const allergenMaterials = inputMaterials.filter(m => 
        allergenicHazards.some(a => m.includes(a.toLowerCase()))
      );
      
      if (allergenMaterials.length > 0 || Math.random() > 0.5) {
        hazards.push({
          step: step.stepName,
          hazardType: 'Allergenic',
          hazardDescription: 'Cross-contamination with undeclared allergens',
          severity: 'High',
          likelihood: 'Low',
          riskLevel: 'Medium',
          isCCP: false,
          justification: 'Allergen management through prerequisite programs and labeling controls.',
          controlMeasure: 'Allergen segregation, dedicated equipment/cleaning validation, label verification'
        });
      }
    }
  });

  return hazards;
}

function generateCCPs(hazardAnalysis: HazardAnalysis[], input: FSMSInput): CCP[] {
  const ccps: CCP[] = [];
  let ccpCount = 0;
  
  const ccpHazards = hazardAnalysis.filter(h => h.isCCP);
  
  ccpHazards.forEach((hazard, index) => {
    ccpCount++;
    const step = input.productionSteps.find(s => s.stepName === hazard.step);
    
    let criticalLimit = '';
    let reference = '';
    let monitoringProcedure = '';
    let monitoringFrequency = '';
    let correctiveAction = '';
    let verificationProcedure = '';
    let verificationFrequency = '';

    if (hazard.hazardType === 'Biological') {
      if (hazard.step.toLowerCase().includes('cook') || hazard.step.toLowerCase().includes('heat') || hazard.step.toLowerCase().includes('pasteur') || hazard.step.toLowerCase().includes('steriliz')) {
        criticalLimit = `Minimum internal temperature: ${hazard.hazardDescription.includes('Listeria') ? '72°C for 15 seconds' : '70°C for 2 minutes'}`;
        reference = 'Codex Alimentarius CXC 1-1969; FDA 21 CFR 113/114; EU Reg. 852/2004';
        monitoringProcedure = 'Continuous temperature monitoring with calibrated probe. Record time and temperature for each batch.';
        monitoringFrequency = 'Continuous monitoring; record every batch';
        correctiveAction = `If temperature not achieved: (1) Continue heating until target reached, (2) If product cannot be reprocessed, reject and dispose, (3) Investigate root cause, (4) Review equipment calibration`;
        verificationProcedure = 'Calibration of temperature probes weekly; microbiological testing of finished product monthly; review of records daily by QA';
        verificationFrequency = 'Daily record review; weekly calibration; monthly microbiological testing';
      } else {
        criticalLimit = 'Storage temperature ≤ 5°C; Water activity ≤ 0.85; pH ≤ 4.6';
        reference = 'Codex Alimentarius CXC 1-1969; EU Reg. 852/2004; FDA 21 CFR 110';
        monitoringProcedure = 'Temperature monitoring with data loggers. Visual inspection for signs of spoilage.';
        monitoringFrequency = 'Temperature: every 2 hours during storage; Visual: each batch';
        correctiveAction = `If temperature exceeds 5°C: (1) Assess product - if < 2 hours above, return to cold storage, (2) If > 2 hours, quarantine and evaluate, (3) Dispose if safety compromised, (4) Repair equipment, recalibrate`;
        verificationProcedure = 'Calibration of data loggers monthly; environmental monitoring for Listeria quarterly; review of temperature records weekly';
        verificationFrequency = 'Weekly record review; monthly calibration; quarterly environmental monitoring';
      }
    } else if (hazard.hazardType === 'Chemical') {
      criticalLimit = 'Contaminant levels below MRLs as per EU Reg. 396/2005 / FDA action levels';
      reference = 'EU Reg. 396/2005; FDA Action Levels; Codex STAN 193-1995';
      monitoringProcedure = 'Review of supplier Certificates of Analysis; periodic testing for contaminants';
      monitoringFrequency = 'Every delivery (CoA review); quarterly laboratory testing';
      correctiveAction = `If contaminant exceeds limits: (1) Reject and quarantine lot, (2) Notify supplier, (3) Increase testing frequency, (4) Consider supplier deapproval if recurring`;
      verificationProcedure = 'Annual supplier audit; comparison of CoA with own testing results; proficiency testing';
      verificationFrequency = 'Annual supplier audit; quarterly comparison; annual proficiency testing';
    } else if (hazard.hazardType === 'Physical') {
      criticalLimit = 'Detection sensitivity: Fe ≥ 1.5mm, Non-Fe ≥ 2.0mm, SS ≥ 2.5mm';
      reference = 'BRCGS Issue 9; IFS Food v7; Codex CXC 1-1969';
      monitoringProcedure = 'Product passes through metal detector/X-ray at defined sensitivity. Test pieces verified at start, every hour, and end of run.';
      monitoringFrequency = 'Test piece verification: start of shift, every hour, end of shift, after any stoppage';
      correctiveAction = `If detection fails: (1) Stop line, (2) Quarantine all product since last successful test, (3) Re-run through detector, (4) Repair/replace equipment, (5) Document incident`;
      verificationProcedure = 'Annual service and calibration of detection equipment; challenge testing with certified test pieces; review of rejection records';
      verificationFrequency = 'Annual calibration; daily challenge tests; weekly record review';
    }

    ccps.push({
      ccpNumber: `CCP-${ccpCount}`,
      processStep: hazard.step,
      hazard: `${hazard.hazardType}: ${hazard.hazardDescription}`,
      criticalLimit,
      reference,
      monitoringProcedure,
      monitoringFrequency,
      responsiblePerson: step?.equipment ? 'Production Operator' : 'QA Technician',
      correctiveAction,
      verificationProcedure,
      verificationFrequency,
      records: `CCP-${ccpCount} Monitoring Record; Calibration Records; Corrective Action Log; Verification Records`
    });
  });

  return ccps;
}

function generatePrerequisitePrograms(input: FSMSInput): string[] {
  const category = getCategory(input);
  const prps = [
    'Good Manufacturing Practices (GMP) - EU Reg. 852/2004 Annex II',
    'Good Hygiene Practices (GHP)',
    'Sanitation Standard Operating Procedures (SSOP)',
    'Pest Control Program',
    'Personnel Hygiene and Training Program',
    'Preventive Maintenance Program',
    'Supplier Approval and Monitoring Program',
    'Allergen Management Program',
    'Water Quality Management',
    'Waste Management Program',
    'Traceability and Recall Program',
    'Cleaning and Disinfection Program',
    'Personal Protective Equipment (PPE) Program',
    'Glass and Brittle Plastic Register',
    'Chemical Control Program',
    'Foreign Body Control Program',
  ];

  if (category === 'meat' || category === 'seafood') {
    prps.push('Temperature Control Program (Cold Chain Management)');
    prps.push('Thawing Control Program');
  }
  if (category === 'dairy') {
    prps.push('Pasteurization Validation Program');
    prps.push('Milk Quality Testing Program');
  }
  if (category === 'grains') {
    prps.push('Mycotoxin Monitoring Program');
    prps.push('Fumigation Control Program');
  }

  return prps;
}

export function generateHACCPPlan(input: FSMSInput): HACCPPlan {
  const team = generateTeamMembers(input);
  const hazardAnalysis = generateHazardAnalysis(input);
  const ccps = generateCCPs(hazardAnalysis, input);
  const prerequisitePrograms = generatePrerequisitePrograms(input);

  return {
    team,
    productDescription: input.finishedProduct,
    flowDiagram: input.productionSteps,
    hazardAnalysis,
    ccps,
    prerequisitePrograms,
  };
}

export function generateVACCPPlan(input: FSMSInput): VACCPPlan {
  const team = generateTeamMembers(input);
  const vulnerabilities: VACCPEntry[] = [];

  input.rawMaterials.forEach((material, index) => {
    const fraudTypes = [
      'Adulteration with cheaper substances',
      'Mislabeling of origin/species',
      'Dilution with undeclared substances',
      'Concealment of poor quality',
      'Theft and replacement (diversion)',
      'Unauthorized enhancement (e.g., melamine)',
      'Counterfeit products/packaging',
      'Over-declaration of grade/quality',
    ];

    const numFrauds = Math.min(2 + Math.floor(Math.random() * 2), fraudTypes.length);
    const selectedFrauds = fraudTypes.sort(() => Math.random() - 0.5).slice(0, numFrauds);

    selectedFrauds.forEach((fraud, fIndex) => {
      const likelihood: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
      const impact: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
      const l = likelihood[Math.floor(Math.random() * 2)]; // bias towards low-medium
      const i = impact[Math.floor(Math.random() * 2) + (material.knownHazards ? 1 : 0)];
      
      const score = (l === 'High' ? 3 : l === 'Medium' ? 2 : 1) * (i === 'High' ? 3 : i === 'Medium' ? 2 : 1);
      const riskScore = score >= 6 ? 'High' : score >= 3 ? 'Medium' : 'Low';

      vulnerabilities.push({
        id: `VACCP-${index + 1}-${fIndex + 1}`,
        material: material.name,
        fraudType: fraud,
        vulnerability: `Supply chain complexity: ${material.supplier ? 'Multiple suppliers' : 'Single source'}; Origin: ${material.origin}; Historical incidents: ${material.knownHazards ? 'Yes' : 'Limited'}`,
        likelihood: l,
        impact: i,
        riskScore,
        controlMeasure: riskScore === 'High' ? 
          `DNA testing/spectroscopy verification; unannounced supplier audits; mass balance verification; blockchain traceability` :
          `Certificate of Analysis (CoA) for each lot; periodic authenticity testing; supplier qualification audits`,
        testingMethod: riskScore === 'High' ?
          `Isotope ratio mass spectrometry (IRMS); DNA barcoding; NMR spectroscopy; quarterly unannounced testing` :
          `CoA verification; annual authenticity testing; supplier audit`
      });
    });
  });

  return {
    team,
    vulnerabilityAssessment: vulnerabilities,
    controlMeasures: [
      'Supplier approval and risk-based monitoring program',
      'Raw material authenticity testing program (risk-based frequency)',
      'Mass balance verification for high-risk materials',
      'Supply chain mapping and transparency requirements',
      'Market intelligence monitoring for emerging fraud trends',
      'Secure supply chain (tamper-evident seals, chain of custody)',
      'Specification management and verification',
      'Historical data analysis for anomaly detection',
    ],
    monitoringProcedures: [
      'Monthly review of supplier performance and compliance',
      'Quarterly authenticity testing of high-risk materials',
      'Annual comprehensive supply chain vulnerability reassessment',
      'Continuous monitoring of food fraud databases (e.g., USP, Decernis)',
      'Review of market prices for economic motivation indicators',
    ],
    verificationProcedures: [
      'Annual internal audit of VACCP system',
      'Annual unannounced supplier audits for high-risk materials',
      'Proficiency testing for laboratory methods',
      'Benchmarking against industry best practices (GFSI standards)',
      'Management review of VACCP effectiveness annually',
    ],
    records: [
      'VACCP Assessment Form (per raw material)',
      'Supplier Approval and Monitoring Records',
      'Authenticity Test Results',
      'Supply Chain Map Documentation',
      'Corrective Actions for Identified Vulnerabilities',
      'Management Review Minutes',
      'Market Intelligence Reports',
      'Mass Balance Records',
    ],
  };
}

export function generateTACCPPlan(input: FSMSInput): TACCPPlan {
  const team = generateTeamMembers(input);
  const threats: TACCPEntry[] = [];

  const processSteps = input.productionSteps;
  const threatTypes = [
    'Intentional contamination with toxic substances',
    'Sabotage of production equipment',
    'Insider threat - disgruntled employee',
    'Terrorism - ideologically motivated attack',
    'Product extortion/threat',
    'Unauthorized access to production areas',
    'Tampering with packaging/labeling',
    'Cyber attack on process control systems',
  ];

  const criticalSteps = processSteps.filter(s => {
    const name = s.stepName.toLowerCase();
    return name.includes('mix') || name.includes('add') || name.includes('blend') || 
           name.includes('fill') || name.includes('pack') || name.includes('storage') ||
           name.includes('receiv') || name.includes('process');
  });

  criticalSteps.forEach((step, index) => {
    const numThreats = Math.min(1 + Math.floor(Math.random() * 2), 2);
    const selectedThreats = threatTypes.sort(() => Math.random() - 0.5).slice(0, numThreats);

    selectedThreats.forEach((threat, tIndex) => {
      const likelihood: ('Low' | 'Medium' | 'High')[] = ['Low', 'Low', 'Medium'];
      const impact: ('Low' | 'Medium' | 'High')[] = ['High', 'High', 'Medium'];
      const l = likelihood[Math.floor(Math.random() * likelihood.length)];
      const i = impact[Math.floor(Math.random() * impact.length)];
      
      const score = (l === 'High' ? 3 : l === 'Medium' ? 2 : 1) * (i === 'High' ? 3 : i === 'Medium' ? 2 : 1);
      const riskScore = score >= 6 ? 'High' : score >= 3 ? 'Medium' : 'Low';

      threats.push({
        id: `TACCP-${index + 1}-${tIndex + 1}`,
        processStep: step.stepName,
        threatType: threat,
        vulnerability: `Access level: ${threat.includes('Insider') ? 'High - internal personnel' : 'Requires external/internal access'}; Detection difficulty: ${threat.includes('cyber') ? 'High' : 'Medium'}; Potential impact scale: ${i === 'High' ? 'Mass casualty/public health emergency' : 'Limited batch recall'}`,
        likelihood: l,
        impact: i,
        riskScore,
        controlMeasure: riskScore === 'High' ?
          `Restricted access (biometric/keycard); 24/7 CCTV surveillance; dual-person rule; tamper-evident seals; background checks; cybersecurity protocols (IEC 62443)` :
          `Access control (keycard); CCTV monitoring; visitor management; staff awareness training; seal integrity checks`,
        monitoringFrequency: riskScore === 'High' ?
          'Continuous CCTV; daily seal checks; weekly access log review; monthly security audit' :
          'Daily access log review; weekly CCTV spot checks; monthly security walk-through'
      });
    });
  });

  return {
    team: [
      ...team,
      { id: '8', name: 'Security Manager', role: 'Food Defense Lead', department: 'Security', qualifications: 'Security management certification, food defense training (FDA/TACCP)' },
      { id: '9', name: 'IT Security Specialist', role: 'Cybersecurity Expert', department: 'IT', qualifications: 'CISSP/CEH certification, ICS/SCADA security experience' },
    ],
    threatAssessment: threats,
    controlMeasures: [
      'Physical security: perimeter fencing, access control systems, visitor management',
      'Personnel security: background checks, security awareness training, insider threat program',
      'Information security: cybersecurity protocols, access control to process systems',
      'Tamper-evident packaging and seals throughout the supply chain',
      'Emergency response plan and crisis management procedures',
      'Dual-person rule for critical operations',
      'Mail and delivery screening procedures',
      'Water and utility protection measures',
      'Loading dock security and vehicle inspection',
      'IT/OT network segmentation and monitoring',
    ],
    monitoringProcedures: [
      'Daily review of CCTV footage (random sampling and incident-triggered)',
      'Daily verification of seal integrity on raw materials and WIP',
      'Weekly access log review and anomaly detection',
      'Monthly security walk-through and vulnerability assessment',
      'Quarterly food defense drill (tabletop or practical)',
      'Continuous monitoring of cyber threats and network anomalies',
    ],
    verificationProcedures: [
      'Annual comprehensive food defense assessment (CARVER+Shock or TACCP methodology)',
      'Annual unannounced security penetration testing',
      'Annual review and update of food defense plan',
      'Biennial third-party food defense audit',
      'Post-incident review and plan update after any security event',
      'Annual management review of food defense program effectiveness',
    ],
    records: [
      'TACCP Assessment Form (per process step)',
      'Access Control Logs',
      'CCTV Recording Retention (minimum 90 days)',
      'Visitor Management Records',
      'Background Check Documentation',
      'Security Incident Reports',
      'Food Defense Drill Records',
      'Seal Integrity Verification Logs',
      'Cybersecurity Incident Logs',
      'Management Review Minutes',
      'Training Records (food defense awareness)',
    ],
  };
}
