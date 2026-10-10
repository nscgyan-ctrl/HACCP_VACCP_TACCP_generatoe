export interface RawMaterial {
  id: string;
  name: string;
  supplier: string;
  origin: string;
  storageCondition: string;
  shelfLife: string;
  certifications: string;
  knownHazards: string;
}

export interface FinishedProduct {
  name: string;
  description: string;
  shelfLife: string;
  storageCondition: string;
  packaging: string;
  intendedUse: string;
  targetPopulation: string;
  distributionMethod: string;
  labelInstructions: string;
}

export interface ProductionStep {
  id: string;
  stepNumber: number;
  stepName: string;
  description: string;
  parameters: string;
  equipment: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  qualifications: string;
}

export interface HazardAnalysis {
  step: string;
  hazardType: 'Biological' | 'Chemical' | 'Physical' | 'Allergenic';
  hazardDescription: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  likelihood: 'Low' | 'Medium' | 'High';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  isCCP: boolean;
  justification: string;
  controlMeasure: string;
}

export interface CCP {
  ccpNumber: string;
  processStep: string;
  hazard: string;
  criticalLimit: string;
  reference: string;
  monitoringProcedure: string;
  monitoringFrequency: string;
  responsiblePerson: string;
  correctiveAction: string;
  verificationProcedure: string;
  verificationFrequency: string;
  records: string;
}

export interface VACCPEntry {
  id: string;
  material: string;
  fraudType: string;
  vulnerability: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  riskScore: string;
  controlMeasure: string;
  testingMethod: string;
}

export interface TACCPEntry {
  id: string;
  processStep: string;
  threatType: string;
  vulnerability: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  riskScore: string;
  controlMeasure: string;
  monitoringFrequency: string;
}

export interface HACCPPlan {
  team: TeamMember[];
  productDescription: FinishedProduct;
  flowDiagram: ProductionStep[];
  hazardAnalysis: HazardAnalysis[];
  ccps: CCP[];
  prerequisitePrograms: string[];
}

export interface VACCPPlan {
  team: TeamMember[];
  vulnerabilityAssessment: VACCPEntry[];
  controlMeasures: string[];
  monitoringProcedures: string[];
  verificationProcedures: string[];
  records: string[];
}

export interface TACCPPlan {
  team: TeamMember[];
  threatAssessment: TACCPEntry[];
  controlMeasures: string[];
  monitoringProcedures: string[];
  verificationProcedures: string[];
  records: string[];
}

export interface FSMSInput {
  companyName: string;
  productCategory: string;
  rawMaterials: RawMaterial[];
  finishedProduct: FinishedProduct;
  productionSteps: ProductionStep[];
  teamMembers: TeamMember[];
}
