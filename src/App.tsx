import { useState, useRef } from 'react';
import { FSMSInput, RawMaterial, FinishedProduct, ProductionStep, TeamMember, HACCPPlan, VACCPPlan, TACCPPlan } from './types';
import { generateHACCPPlan, generateVACCPPlan, generateTACCPPlan } from './utils/planGenerator';

type TabType = 'input' | 'haccp' | 'vaccp' | 'taccp';
type InputStep = 1 | 2 | 3 | 4 | 5;

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('input');
  const [inputStep, setInputStep] = useState<InputStep>(1);
  const [generated, setGenerated] = useState(false);
  const [haccpPlan, setHaccpPlan] = useState<HACCPPlan | null>(null);
  const [vaccpPlan, setVaccpPlan] = useState<VACCPPlan | null>(null);
  const [taccpPlan, setTaccpPlan] = useState<TACCPPlan | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FSMSInput>({
    companyName: '',
    productCategory: '',
    rawMaterials: [],
    finishedProduct: {
      name: '', description: '', shelfLife: '', storageCondition: '',
      packaging: '', intendedUse: '', targetPopulation: '',
      distributionMethod: '', labelInstructions: ''
    },
    productionSteps: [],
    teamMembers: [],
  });

  const updateFinishedProduct = (field: keyof FinishedProduct, value: string) => {
    setFormData(prev => ({
      ...prev,
      finishedProduct: { ...prev.finishedProduct, [field]: value }
    }));
  };

  const addRawMaterial = () => {
    const newMaterial: RawMaterial = {
      id: Date.now().toString(),
      name: '', supplier: '', origin: '', storageCondition: '',
      shelfLife: '', certifications: '', knownHazards: ''
    };
    setFormData(prev => ({ ...prev, rawMaterials: [...prev.rawMaterials, newMaterial] }));
  };

  const updateRawMaterial = (id: string, field: keyof RawMaterial, value: string) => {
    setFormData(prev => ({
      ...prev,
      rawMaterials: prev.rawMaterials.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const removeRawMaterial = (id: string) => {
    setFormData(prev => ({ ...prev, rawMaterials: prev.rawMaterials.filter(m => m.id !== id) }));
  };

  const addProductionStep = () => {
    const newStep: ProductionStep = {
      id: Date.now().toString(),
      stepNumber: formData.productionSteps.length + 1,
      stepName: '', description: '', parameters: '', equipment: ''
    };
    setFormData(prev => ({ ...prev, productionSteps: [...prev.productionSteps, newStep] }));
  };

  const updateProductionStep = (id: string, field: keyof ProductionStep, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      productionSteps: prev.productionSteps.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeProductionStep = (id: string) => {
    setFormData(prev => ({ ...prev, productionSteps: prev.productionSteps.filter(s => s.id !== id) }));
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '', role: '', department: '', qualifications: ''
    };
    setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, newMember] }));
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const removeTeamMember = (id: string) => {
    setFormData(prev => ({ ...prev, teamMembers: prev.teamMembers.filter(m => m.id !== id) }));
  };

  const generatePlans = () => {
    const haccp = generateHACCPPlan(formData);
    const vaccp = generateVACCPPlan(formData);
    const taccp = generateTACCPPlan(formData);
    setHaccpPlan(haccp);
    setVaccpPlan(vaccp);
    setTaccpPlan(taccp);
    setGenerated(true);
    setActiveTab('haccp');
  };

  const loadSampleData = () => {
    setFormData({
      companyName: 'FreshFoods Processing Ltd.',
      productCategory: 'Meat - Ready-to-Eat Poultry Products',
      rawMaterials: [
        { id: '1', name: 'Fresh Chicken Breast', supplier: 'FarmFresh Poultry Co.', origin: 'National - Certified Farm', storageCondition: 'Chilled 0-4°C', shelfLife: '5 days at 0-4°C', certifications: 'ISO 22000, BRCGS, Halal', knownHazards: 'Salmonella, Campylobacter, antibiotic residues' },
        { id: '2', name: 'Marinade Mix (Spices & Herbs)', supplier: 'Global Spices Inc.', origin: 'Imported - Multiple origins', storageCondition: 'Ambient, dry storage', shelfLife: '12 months', certifications: 'FSSC 22000, Non-GMO', knownHazards: 'Aflatoxin, pesticide residues, undeclared allergens' },
        { id: '3', name: 'Modified Atmosphere Packaging Film', supplier: 'PackTech Solutions', origin: 'EU Manufactured', storageCondition: 'Ambient, clean dry area', shelfLife: '24 months', certifications: 'Food contact compliant, BRCGS', knownHazards: 'Migration of substances, physical contamination' },
        { id: '4', name: 'Soy Sauce (Low Sodium)', supplier: 'Asian Ingredients Ltd.', origin: 'Japan', storageCondition: 'Ambient', shelfLife: '18 months', certifications: 'ISO 22000, Kosher', knownHazards: 'Histamine, heavy metals, undeclared allergens (soy, wheat)' },
      ],
      finishedProduct: {
        name: 'Marinated Ready-to-Cook Chicken Breast',
        description: 'Fresh chicken breast marinated in a blend of herbs and spices, packed in MAP (Modified Atmosphere Packaging). Product requires thorough cooking before consumption.',
        shelfLife: '7 days at 0-4°C',
        storageCondition: 'Refrigerated 0-4°C',
        packaging: 'MAP tray (70% N2, 30% CO2) with absorbent pad, sealed with printed film',
        intendedUse: 'To be cooked thoroughly by consumer before consumption. Not ready-to-eat.',
        targetPopulation: 'General population (excluding those with allergies to declared ingredients). Not intended for immunocompromised individuals without medical advice.',
        distributionMethod: 'Refrigerated distribution via cold chain (0-4°C maintained throughout)',
        labelInstructions: 'KEEP REFRIGERATED 0-4°C. COOK THOROUGHLY. Ensure product reaches 75°C core temperature. Consume within 24 hours of opening. Use by date on pack.'
      },
      productionSteps: [
        { id: '1', stepNumber: 1, stepName: 'Raw Material Receiving', description: 'Inspection and acceptance of incoming raw materials', parameters: 'Temperature check: chicken ≤ 4°C; Visual inspection; CoA verification', equipment: 'Receiving dock, temperature probes, inspection tables' },
        { id: '2', stepNumber: 2, stepName: 'Cold Storage', description: 'Storage of raw materials under controlled conditions', parameters: 'Temperature: 0-4°C; Humidity: 80-85%; FIFO rotation', equipment: 'Cold rooms with data loggers' },
        { id: '3', stepNumber: 3, stepName: 'Preparation & Trimming', description: 'Removal of skin, fat, bones; portioning to specification', parameters: 'Room temperature: ≤ 12°C; Time limit: 30 minutes max', equipment: 'Stainless steel tables, trimming knives, portioning machines' },
        { id: '4', stepNumber: 4, stepName: 'Marinade Preparation', description: 'Weighing and mixing of marinade ingredients', parameters: 'Recipe accuracy: ±2%; Temperature: ≤ 10°C', equipment: 'Weighing scales, mixing vessels, refrigerated storage' },
        { id: '5', stepNumber: 5, stepName: 'Marination/Tumbling', description: 'Vacuum tumbling of chicken with marinade for even distribution', parameters: 'Vacuum: -0.8 bar; Time: 2 hours; Temperature: ≤ 6°C', equipment: 'Vacuum tumbler, temperature-controlled room' },
        { id: '6', stepNumber: 6, stepName: 'Weighing & Portioning', description: 'Portioning to target weight and placement in trays', parameters: 'Weight tolerance: ±5g; Metal detection post-portioning', equipment: 'Multi-head weigher, tray sealer, metal detector' },
        { id: '7', stepNumber: 7, stepName: 'MAP Packaging', description: 'Modified atmosphere packaging with gas flush', parameters: 'Gas mix: 70% N2, 30% CO2; Residual O2: <1%; Seal integrity', equipment: 'MAP tray sealer, gas mixer, seal integrity tester' },
        { id: '8', stepNumber: 8, stepName: 'Metal Detection', description: '100% metal detection of all packaged products', parameters: 'Sensitivity: Fe 1.5mm, Non-Fe 2.0mm, SS 2.5mm', equipment: 'Inline metal detector with auto-reject' },
        { id: '9', stepNumber: 9, stepName: 'Labeling & Coding', description: 'Application of date codes and label verification', parameters: 'Legible date code; Correct allergen info; Batch traceability', equipment: 'In-line coder, label verifier, camera inspection' },
        { id: '10', stepNumber: 10, stepName: 'Cold Storage (Finished Product)', description: 'Storage of finished product prior to dispatch', parameters: 'Temperature: 0-2°C; FIFO; Max storage 7 days', equipment: 'Finished product cold store with data loggers' },
        { id: '11', stepNumber: 11, stepName: 'Dispatch/Loading', description: 'Loading into refrigerated vehicles with temperature verification', parameters: 'Vehicle pre-cooled to ≤ 4°C; Temperature recorded at loading', equipment: 'Refrigerated vehicles, dock seals, temperature recorders' },
      ],
      teamMembers: [
        { id: '1', name: 'Dr. Sarah Chen', role: 'Team Leader / QA Manager', department: 'Quality Assurance', qualifications: 'PhD Food Microbiology, HACCP Lead Auditor, 10 years experience' },
        { id: '2', name: 'James Rodriguez', role: 'Production Manager', department: 'Production', qualifications: 'BSc Food Engineering, 8 years meat processing experience' },
        { id: '3', name: 'Dr. Aisha Patel', role: 'Microbiologist', department: 'Laboratory', qualifications: 'PhD Food Microbiology, ISO 17025 lead assessor' },
        { id: '4', name: 'Tom Williams', role: 'Maintenance Engineer', department: 'Engineering', qualifications: 'MSc Mechanical Engineering, food equipment specialist' },
        { id: '5', name: 'Maria Gonzalez', role: 'Food Technologist', department: 'R&D', qualifications: 'MSc Food Science, product development specialist' },
        { id: '6', name: 'David Kim', role: 'Regulatory Affairs', department: 'Regulatory', qualifications: 'LLB Food Law, regulatory compliance specialist' },
      ],
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg print:shadow-none">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">FSMS Plan Generator</h1>
                <p className="text-blue-200 text-xs">HACCP • VACCP • TACCP Integrated System</p>
              </div>
            </div>
            {generated && (
              <button onClick={handlePrint} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition print:hidden">
                <span>🖨️</span> Print/Export Plan
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition ${activeTab === 'input' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              📝 Product & Process Input
            </button>
            <button
              onClick={() => generated && setActiveTab('haccp')}
              disabled={!generated}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition ${activeTab === 'haccp' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-400'} ${!generated ? 'cursor-not-allowed' : 'hover:text-gray-700'}`}
            >
              📋 HACCP Plan {generated && '✓'}
            </button>
            <button
              onClick={() => generated && setActiveTab('vaccp')}
              disabled={!generated}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition ${activeTab === 'vaccp' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-400'} ${!generated ? 'cursor-not-allowed' : 'hover:text-gray-700'}`}
            >
              🔍 VACCP Plan {generated && '✓'}
            </button>
            <button
              onClick={() => generated && setActiveTab('taccp')}
              disabled={!generated}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition ${activeTab === 'taccp' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-400'} ${!generated ? 'cursor-not-allowed' : 'hover:text-gray-700'}`}
            >
              🔒 TACCP Plan {generated && '✓'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6" ref={printRef}>
        {activeTab === 'input' && (
          <InputSection
            formData={formData}
            inputStep={inputStep}
            setInputStep={setInputStep}
            updateFinishedProduct={updateFinishedProduct}
            addRawMaterial={addRawMaterial}
            updateRawMaterial={updateRawMaterial}
            removeRawMaterial={removeRawMaterial}
            addProductionStep={addProductionStep}
            updateProductionStep={updateProductionStep}
            removeProductionStep={removeProductionStep}
            addTeamMember={addTeamMember}
            updateTeamMember={updateTeamMember}
            removeTeamMember={removeTeamMember}
            setFormData={setFormData}
            generatePlans={generatePlans}
            loadSampleData={loadSampleData}
            generated={generated}
          />
        )}
        {activeTab === 'haccp' && haccpPlan && <HACCPPlanView plan={haccpPlan} company={formData.companyName} />}
        {activeTab === 'vaccp' && vaccpPlan && <VACCPPlanView plan={vaccpPlan} company={formData.companyName} />}
        {activeTab === 'taccp' && taccpPlan && <TACCPPlanView plan={taccpPlan} company={formData.companyName} />}
      </main>
    </div>
  );
}

// ==================== INPUT SECTION ====================
function InputSection({ formData, inputStep, setInputStep, updateFinishedProduct, addRawMaterial, updateRawMaterial, removeRawMaterial, addProductionStep, updateProductionStep, removeProductionStep, addTeamMember, updateTeamMember, removeTeamMember, setFormData, generatePlans, loadSampleData, generated }: any) {
  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm print:hidden">
        {[
          { num: 1, label: 'Company & Category' },
          { num: 2, label: 'Raw Materials' },
          { num: 3, label: 'Finished Product' },
          { num: 4, label: 'Process Steps' },
          { num: 5, label: 'Team Members' },
        ].map((step) => (
          <div key={step.num} className="flex items-center">
            <button
              onClick={() => setInputStep(step.num as InputStep)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${inputStep >= step.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {step.num}
            </button>
            <span className={`ml-2 text-xs hidden sm:block ${inputStep >= step.num ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{step.label}</span>
            {step.num < 5 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${inputStep > step.num ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Load Sample Data Button */}
      <div className="flex justify-end print:hidden">
        <button onClick={loadSampleData} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
          📦 Load Sample Data (Ready-to-Cook Chicken)
        </button>
      </div>

      {/* Step 1: Company & Category */}
      {inputStep === 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">🏢 Company Information & Product Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" value={formData.companyName} onChange={(e) => setFormData((p: FSMSInput) => ({ ...p, companyName: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., FreshFoods Processing Ltd." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
              <select value={formData.productCategory} onChange={(e) => setFormData((p: FSMSInput) => ({ ...p, productCategory: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select category...</option>
                <option value="Meat - Ready-to-Eat Poultry Products">Meat - Ready-to-Eat Poultry</option>
                <option value="Meat - Raw Beef Products">Meat - Raw Beef</option>
                <option value="Meat - Processed Meat Products">Meat - Processed Meat</option>
                <option value="Dairy - Pasteurized Milk">Dairy - Pasteurized Milk</option>
                <option value="Dairy - Cheese Products">Dairy - Cheese</option>
                <option value="Dairy - Yogurt/Fermented">Dairy - Yogurt/Fermented</option>
                <option value="Seafood - Fresh Fish">Seafood - Fresh Fish</option>
                <option value="Seafood - Shellfish">Seafood - Shellfish</option>
                <option value="Seafood - Processed Seafood">Seafood - Processed</option>
                <option value="Produce - Fresh Cut Fruits/Vegetables">Produce - Fresh Cut</option>
                <option value="Produce - Fresh Whole Produce">Produce - Fresh Whole</option>
                <option value="Grains - Bakery Products">Grains - Bakery</option>
                <option value="Grains - Cereal/Flour Products">Grains - Cereal/Flour</option>
                <option value="Beverages - Juices">Beverages - Juices</option>
                <option value="Beverages - Carbonated Drinks">Beverages - Carbonated</option>
                <option value="Ready Meals">Ready Meals</option>
                <option value="Frozen Foods">Frozen Foods</option>
                <option value="Canned Foods">Canned Foods</option>
                <option value="Other">Other (specify in product description)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => setInputStep(2)} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Next →</button>
          </div>
        </div>
      )}

      {/* Step 2: Raw Materials */}
      {inputStep === 2 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">🧪 Raw Materials</h2>
            <button onClick={addRawMaterial} className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition">+ Add Material</button>
          </div>
          {formData.rawMaterials.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No raw materials added yet. Click "Add Material" to begin.</p>
          )}
          {formData.rawMaterials.map((material: RawMaterial) => (
            <div key={material.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Material #{formData.rawMaterials.indexOf(material) + 1}</span>
                <button onClick={() => removeRawMaterial(material.id)} className="text-red-500 hover:text-red-700 text-sm">✕ Remove</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Material Name *</label>
                  <input type="text" value={material.name} onChange={(e) => updateRawMaterial(material.id, 'name', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., Fresh Chicken Breast" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Supplier</label>
                  <input type="text" value={material.supplier} onChange={(e) => updateRawMaterial(material.id, 'supplier', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Supplier name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Country of Origin</label>
                  <input type="text" value={material.origin} onChange={(e) => updateRawMaterial(material.id, 'origin', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Country/Region" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Storage Condition</label>
                  <input type="text" value={material.storageCondition} onChange={(e) => updateRawMaterial(material.id, 'storageCondition', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., Chilled 0-4°C" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Shelf Life</label>
                  <input type="text" value={material.shelfLife} onChange={(e) => updateRawMaterial(material.id, 'shelfLife', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., 5 days at 0-4°C" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Certifications</label>
                  <input type="text" value={material.certifications} onChange={(e) => updateRawMaterial(material.id, 'certifications', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., ISO 22000, BRCGS" />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Known Hazards / Historical Issues</label>
                  <input type="text" value={material.knownHazards} onChange={(e) => updateRawMaterial(material.id, 'knownHazards', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., Salmonella, antibiotic residues, aflatoxin" />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <button onClick={() => setInputStep(1)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">← Back</button>
            <button onClick={() => setInputStep(3)} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Next →</button>
          </div>
        </div>
      )}

      {/* Step 3: Finished Product */}
      {inputStep === 3 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">📦 Finished Product Description</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
              <input type="text" value={formData.finishedProduct.name} onChange={(e) => updateFinishedProduct('name', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Product name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Shelf Life</label>
              <input type="text" value={formData.finishedProduct.shelfLife} onChange={(e) => updateFinishedProduct('shelfLife', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g., 7 days at 0-4°C" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Storage Condition</label>
              <input type="text" value={formData.finishedProduct.storageCondition} onChange={(e) => updateFinishedProduct('storageCondition', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g., Refrigerated 0-4°C" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Packaging Type</label>
              <input type="text" value={formData.finishedProduct.packaging} onChange={(e) => updateFinishedProduct('packaging', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g., MAP tray, vacuum pack" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Distribution Method</label>
              <input type="text" value={formData.finishedProduct.distributionMethod} onChange={(e) => updateFinishedProduct('distributionMethod', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g., Refrigerated transport" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target Population</label>
              <input type="text" value={formData.finishedProduct.targetPopulation} onChange={(e) => updateFinishedProduct('targetPopulation', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g., General population" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Description</label>
              <textarea value={formData.finishedProduct.description} onChange={(e) => updateFinishedProduct('description', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} placeholder="Detailed product description" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Intended Use *</label>
              <textarea value={formData.finishedProduct.intendedUse} onChange={(e) => updateFinishedProduct('intendedUse', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} placeholder="How the product will be used by the consumer (e.g., cook before eating, ready-to-eat)" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Label Instructions</label>
              <textarea value={formData.finishedProduct.labelInstructions} onChange={(e) => updateFinishedProduct('labelInstructions', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} placeholder="Storage, preparation, and safety instructions on label" />
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setInputStep(2)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">← Back</button>
            <button onClick={() => setInputStep(4)} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Next →</button>
          </div>
        </div>
      )}

      {/* Step 4: Production Steps */}
      {inputStep === 4 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">🏭 Production Process Steps (Flow Diagram)</h2>
            <button onClick={addProductionStep} className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition">+ Add Step</button>
          </div>
          {formData.productionSteps.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No production steps added. Click "Add Step" to create your process flow.</p>
          )}
          {formData.productionSteps.map((step: ProductionStep, idx: number) => (
            <div key={step.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-blue-600">Step {idx + 1}</span>
                <button onClick={() => removeProductionStep(step.id)} className="text-red-500 hover:text-red-700 text-sm">✕ Remove</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Step Name *</label>
                  <input type="text" value={step.stepName} onChange={(e) => updateProductionStep(step.id, 'stepName', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., Cooking/Pasteurization" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Equipment Used</label>
                  <input type="text" value={step.equipment} onChange={(e) => updateProductionStep(step.id, 'equipment', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., Pasteurizer, oven" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <input type="text" value={step.description} onChange={(e) => updateProductionStep(step.id, 'description', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Brief description of the step" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Key Parameters / Controls</label>
                  <input type="text" value={step.parameters} onChange={(e) => updateProductionStep(step.id, 'parameters', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., Temperature: 72°C for 15 seconds" />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <button onClick={() => setInputStep(3)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">← Back</button>
            <button onClick={() => setInputStep(5)} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Next →</button>
          </div>
        </div>
      )}

      {/* Step 5: Team Members */}
      {inputStep === 5 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">👥 Multidisciplinary HACCP Team</h2>
            <button onClick={addTeamMember} className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition">+ Add Member</button>
          </div>
          <p className="text-sm text-gray-500">Note: If no team members are added, a default multidisciplinary team will be generated based on the product category.</p>
          {formData.teamMembers.map((member: TeamMember) => (
            <div key={member.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Team Member #{formData.teamMembers.indexOf(member) + 1}</span>
                <button onClick={() => removeTeamMember(member.id)} className="text-red-500 hover:text-red-700 text-sm">✕ Remove</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input type="text" value={member.name} onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Role in Team</label>
                  <input type="text" value={member.role} onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., QA Manager" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                  <input type="text" value={member.department} onChange={(e) => updateTeamMember(member.id, 'department', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., Quality Assurance" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Qualifications</label>
                  <input type="text" value={member.qualifications} onChange={(e) => updateTeamMember(member.id, 'qualifications', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="e.g., HACCP certified" />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <button onClick={() => setInputStep(4)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">← Back</button>
            <button onClick={generatePlans} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-lg">
              🚀 Generate HACCP / VACCP / TACCP Plans
            </button>
          </div>
          {generated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-medium">✅ Plans have been generated! Navigate to the tabs above to view them.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== HACCP PLAN VIEW ====================
function HACCPPlanView({ plan, company }: { plan: HACCPPlan; company: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">📋 HACCP Plan</h2>
        <p className="text-green-600 mt-1">Hazard Analysis and Critical Control Points - {company}</p>
        <p className="text-xs text-green-500 mt-2">Based on Codex Alimentarius CAC/RCP 1-1969 (Rev. 5, 2020) | EU Regulation 852/2004 | FDA 21 CFR Parts 110/120/123</p>
      </div>

      {/* 1. Multidisciplinary Team */}
      <Section title="1. Multidisciplinary HACCP Team" icon="👥">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">#</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Role</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Department</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Qualifications</th>
              </tr>
            </thead>
            <tbody>
              {plan.team.map((member, idx) => (
                <tr key={member.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium">{member.name}</td>
                  <td className="px-3 py-2">{member.role}</td>
                  <td className="px-3 py-2">{member.department}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{member.qualifications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 2. Product Description */}
      <Section title="2. Product Description" icon="📦">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <InfoRow label="Product Name" value={plan.productDescription.name} />
          <InfoRow label="Shelf Life" value={plan.productDescription.shelfLife} />
          <InfoRow label="Storage Condition" value={plan.productDescription.storageCondition} />
          <InfoRow label="Packaging" value={plan.productDescription.packaging} />
          <InfoRow label="Distribution" value={plan.productDescription.distributionMethod} />
          <InfoRow label="Target Population" value={plan.productDescription.targetPopulation} />
          <div className="md:col-span-2">
            <InfoRow label="Description" value={plan.productDescription.description} />
          </div>
          <div className="md:col-span-2">
            <InfoRow label="Intended Use" value={plan.productDescription.intendedUse} />
          </div>
          <div className="md:col-span-2">
            <InfoRow label="Label Instructions" value={plan.productDescription.labelInstructions} />
          </div>
        </div>
      </Section>

      {/* 3. Flow Diagram */}
      <Section title="3. Process Flow Diagram" icon="🔄">
        <div className="flex flex-wrap gap-2 items-center">
          {plan.flowDiagram.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs">
                <div className="font-bold text-blue-700">Step {step.stepNumber}</div>
                <div className="text-gray-700">{step.stepName}</div>
                {step.parameters && <div className="text-gray-500 text-[10px] mt-1">{step.parameters}</div>}
              </div>
              {idx < plan.flowDiagram.length - 1 && <span className="text-blue-400 text-lg">→</span>}
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Prerequisite Programs */}
      <Section title="4. Prerequisite Programs (PRPs)" icon="📋">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {plan.prerequisitePrograms.map((prp, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm bg-gray-50 rounded p-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>{prp}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Hazard Analysis */}
      <Section title="5. Hazard Analysis" icon="⚠️">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left">Process Step</th>
                <th className="px-2 py-2 text-left">Hazard Type</th>
                <th className="px-2 py-2 text-left">Hazard Description</th>
                <th className="px-2 py-2 text-center">Severity</th>
                <th className="px-2 py-2 text-center">Likelihood</th>
                <th className="px-2 py-2 text-center">Risk Level</th>
                <th className="px-2 py-2 text-center">CCP?</th>
                <th className="px-2 py-2 text-left">Control Measure</th>
                <th className="px-2 py-2 text-left">Justification</th>
              </tr>
            </thead>
            <tbody>
              {plan.hazardAnalysis.map((hazard, idx) => (
                <tr key={idx} className={`border-t border-gray-100 ${hazard.isCCP ? 'bg-red-50' : ''}`}>
                  <td className="px-2 py-2 font-medium">{hazard.step}</td>
                  <td className="px-2 py-2">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${hazard.hazardType === 'Biological' ? 'bg-purple-100 text-purple-700' : hazard.hazardType === 'Chemical' ? 'bg-yellow-100 text-yellow-700' : hazard.hazardType === 'Physical' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {hazard.hazardType}
                    </span>
                  </td>
                  <td className="px-2 py-2">{hazard.hazardDescription}</td>
                  <td className="px-2 py-2 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${hazard.severity === 'Critical' ? 'bg-red-200 text-red-800' : hazard.severity === 'High' ? 'bg-orange-200 text-orange-800' : hazard.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                      {hazard.severity}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center">{hazard.likelihood}</td>
                  <td className="px-2 py-2 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${hazard.riskLevel === 'Critical' ? 'bg-red-200 text-red-800' : hazard.riskLevel === 'High' ? 'bg-orange-200 text-orange-800' : hazard.riskLevel === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                      {hazard.riskLevel}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center font-bold">{hazard.isCCP ? '✅ YES' : 'No'}</td>
                  <td className="px-2 py-2 text-gray-600">{hazard.controlMeasure}</td>
                  <td className="px-2 py-2 text-gray-600">{hazard.justification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6. CCP Plan Table */}
      <Section title="6. Critical Control Points (CCP) Plan" icon="🎯">
        {plan.ccps.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No CCPs identified. All hazards are controlled through prerequisite programs.</p>
        ) : (
          <div className="space-y-4">
            {plan.ccps.map((ccp, idx) => (
              <div key={idx} className="border border-red-200 rounded-lg overflow-hidden">
                <div className="bg-red-50 px-4 py-2 font-bold text-red-800 text-sm">{ccp.ccpNumber}: {ccp.processStep}</div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium text-gray-700">Hazard:</span> <span className="text-gray-600">{ccp.hazard}</span></div>
                  <div><span className="font-medium text-gray-700">Critical Limit:</span> <span className="text-gray-600">{ccp.criticalLimit}</span></div>
                  <div className="md:col-span-2"><span className="font-medium text-gray-700">Reference/Standard:</span> <span className="text-gray-600">{ccp.reference}</span></div>
                  <div className="md:col-span-2"><span className="font-medium text-gray-700">Monitoring Procedure:</span> <span className="text-gray-600">{ccp.monitoringProcedure}</span></div>
                  <div><span className="font-medium text-gray-700">Frequency:</span> <span className="text-gray-600">{ccp.monitoringFrequency}</span></div>
                  <div><span className="font-medium text-gray-700">Responsible Person:</span> <span className="text-gray-600">{ccp.responsiblePerson}</span></div>
                  <div className="md:col-span-2"><span className="font-medium text-gray-700">Corrective Action:</span> <span className="text-gray-600">{ccp.correctiveAction}</span></div>
                  <div className="md:col-span-2"><span className="font-medium text-gray-700">Verification Procedure:</span> <span className="text-gray-600">{ccp.verificationProcedure}</span></div>
                  <div><span className="font-medium text-gray-700">Verification Frequency:</span> <span className="text-gray-600">{ccp.verificationFrequency}</span></div>
                  <div><span className="font-medium text-gray-700">Records:</span> <span className="text-gray-600">{ccp.records}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 7. Record-Keeping Format */}
      <Section title="7. Record-Keeping Formats" icon="📝">
        <div className="space-y-4">
          <RecordTable
            title="CCP Monitoring Record"
            headers={['Date', 'Time', 'CCP #', 'Parameter Measured', 'Actual Value', 'Critical Limit', 'Within Limit? (Y/N)', 'Initials', 'Corrective Action (if needed)']}
            rows={Array.from({ length: 3 }, () => ['', '', '', '', '', '', '', '', ''])}
          />
          <RecordTable
            title="Corrective Action Record"
            headers={['Date', 'CCP #', 'Deviation Description', 'Product Affected', 'Action Taken', 'Disposition', 'Responsible Person', 'Verified By', 'Date Closed']}
            rows={Array.from({ length: 2 }, () => ['', '', '', '', '', '', '', '', ''])}
          />
          <RecordTable
            title="Verification Record"
            headers={['Date', 'Activity Type', 'CCP/PRP', 'Method', 'Result', 'Conforms? (Y/N)', 'Corrective Action', 'Verified By', 'Next Due Date']}
            rows={Array.from({ length: 2 }, () => ['', '', '', '', '', '', '', '', ''])}
          />
        </div>
      </Section>
    </div>
  );
}

// ==================== VACCP PLAN VIEW ====================
function VACCPPlanView({ plan, company }: { plan: VACCPPlan; company: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-amber-800 flex items-center gap-2">🔍 VACCP Plan</h2>
        <p className="text-amber-600 mt-1">Vulnerability Assessment and Critical Control Points (Food Fraud Prevention) - {company}</p>
        <p className="text-xs text-amber-500 mt-2">Based on GFSI requirements | SSAFE framework | USP Food Fraud Database | BRCGS Issue 9 Section 5.4</p>
      </div>

      {/* 1. Team */}
      <Section title="1. VACCP Multidisciplinary Team" icon="👥">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">#</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Role</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Department</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Qualifications</th>
              </tr>
            </thead>
            <tbody>
              {plan.team.map((member, idx) => (
                <tr key={member.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium">{member.name}</td>
                  <td className="px-3 py-2">{member.role}</td>
                  <td className="px-3 py-2">{member.department}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{member.qualifications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 2. Vulnerability Assessment */}
      <Section title="2. Food Fraud Vulnerability Assessment" icon="🔎">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left">ID</th>
                <th className="px-2 py-2 text-left">Material</th>
                <th className="px-2 py-2 text-left">Fraud Type</th>
                <th className="px-2 py-2 text-left">Vulnerability Factors</th>
                <th className="px-2 py-2 text-center">Likelihood</th>
                <th className="px-2 py-2 text-center">Impact</th>
                <th className="px-2 py-2 text-center">Risk Score</th>
                <th className="px-2 py-2 text-left">Control Measures</th>
                <th className="px-2 py-2 text-left">Testing Method</th>
              </tr>
            </thead>
            <tbody>
              {plan.vulnerabilityAssessment.map((entry) => (
                <tr key={entry.id} className={`border-t border-gray-100 ${entry.riskScore === 'High' ? 'bg-red-50' : entry.riskScore === 'Medium' ? 'bg-yellow-50' : ''}`}>
                  <td className="px-2 py-2 font-medium">{entry.id}</td>
                  <td className="px-2 py-2 font-medium">{entry.material}</td>
                  <td className="px-2 py-2">{entry.fraudType}</td>
                  <td className="px-2 py-2 text-gray-600">{entry.vulnerability}</td>
                  <td className="px-2 py-2 text-center">{entry.likelihood}</td>
                  <td className="px-2 py-2 text-center">{entry.impact}</td>
                  <td className="px-2 py-2 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${entry.riskScore === 'High' ? 'bg-red-200 text-red-800' : entry.riskScore === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                      {entry.riskScore}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-gray-600">{entry.controlMeasure}</td>
                  <td className="px-2 py-2 text-gray-600">{entry.testingMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 3. Control Measures */}
      <Section title="3. Food Fraud Control Measures" icon="🛡️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {plan.controlMeasures.map((cm, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm bg-amber-50 rounded p-2 border border-amber-100">
              <span className="text-amber-600 mt-0.5 font-bold">{idx + 1}.</span>
              <span>{cm}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Monitoring */}
      <Section title="4. Monitoring Procedures" icon="👁️">
        <div className="space-y-2">
          {plan.monitoringProcedures.map((mp, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm bg-white rounded p-3 border border-gray-200">
              <span className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
              <span>{mp}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Verification */}
      <Section title="5. Verification Procedures" icon="✅">
        <div className="space-y-2">
          {plan.verificationProcedures.map((vp, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm bg-white rounded p-3 border border-gray-200">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
              <span>{vp}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Records */}
      <Section title="6. Record-Keeping" icon="📁">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {plan.records.map((record, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2">
              <span className="text-amber-500">📄</span>
              <span>{record}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ==================== TACCP PLAN VIEW ====================
function TACCPPlanView({ plan, company }: { plan: TACCPPlan; company: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2">🔒 TACCP Plan</h2>
        <p className="text-red-600 mt-1">Threat Assessment and Critical Control Points (Food Defense) - {company}</p>
        <p className="text-xs text-red-500 mt-2">Based on FDA Food Safety Modernization Act (FSMA) Intentional Adulteration Rule | CARVER+Shock | BRCGS Issue 9 Section 5.3 | GFSI requirements</p>
      </div>

      {/* 1. Team */}
      <Section title="1. Food Defense Team" icon="👥">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">#</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Role</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Department</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Qualifications</th>
              </tr>
            </thead>
            <tbody>
              {plan.team.map((member, idx) => (
                <tr key={member.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium">{member.name}</td>
                  <td className="px-3 py-2">{member.role}</td>
                  <td className="px-3 py-2">{member.department}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{member.qualifications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 2. Threat Assessment */}
      <Section title="2. Intentional Adulteration Threat Assessment" icon="⚔️">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left">ID</th>
                <th className="px-2 py-2 text-left">Process Step</th>
                <th className="px-2 py-2 text-left">Threat Type</th>
                <th className="px-2 py-2 text-left">Vulnerability Assessment</th>
                <th className="px-2 py-2 text-center">Likelihood</th>
                <th className="px-2 py-2 text-center">Impact</th>
                <th className="px-2 py-2 text-center">Risk Score</th>
                <th className="px-2 py-2 text-left">Mitigation Measures</th>
                <th className="px-2 py-2 text-left">Monitoring Frequency</th>
              </tr>
            </thead>
            <tbody>
              {plan.threatAssessment.map((entry) => (
                <tr key={entry.id} className={`border-t border-gray-100 ${entry.riskScore === 'High' ? 'bg-red-50' : entry.riskScore === 'Medium' ? 'bg-orange-50' : ''}`}>
                  <td className="px-2 py-2 font-medium">{entry.id}</td>
                  <td className="px-2 py-2 font-medium">{entry.processStep}</td>
                  <td className="px-2 py-2">{entry.threatType}</td>
                  <td className="px-2 py-2 text-gray-600">{entry.vulnerability}</td>
                  <td className="px-2 py-2 text-center">{entry.likelihood}</td>
                  <td className="px-2 py-2 text-center">{entry.impact}</td>
                  <td className="px-2 py-2 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${entry.riskScore === 'High' ? 'bg-red-200 text-red-800' : entry.riskScore === 'Medium' ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                      {entry.riskScore}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-gray-600">{entry.controlMeasure}</td>
                  <td className="px-2 py-2 text-gray-600">{entry.monitoringFrequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 3. Control Measures */}
      <Section title="3. Food Defense Mitigation Strategies" icon="🛡️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {plan.controlMeasures.map((cm, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm bg-red-50 rounded p-2 border border-red-100">
              <span className="text-red-600 mt-0.5 font-bold">{idx + 1}.</span>
              <span>{cm}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Monitoring */}
      <Section title="4. Monitoring Procedures" icon="👁️">
        <div className="space-y-2">
          {plan.monitoringProcedures.map((mp, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm bg-white rounded p-3 border border-gray-200">
              <span className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
              <span>{mp}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Verification */}
      <Section title="5. Verification Procedures" icon="✅">
        <div className="space-y-2">
          {plan.verificationProcedures.map((vp, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm bg-white rounded p-3 border border-gray-200">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
              <span>{vp}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Records */}
      <Section title="6. Record-Keeping" icon="📁">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {plan.records.map((record, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2">
              <span className="text-red-500">📄</span>
              <span>{record}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ==================== HELPER COMPONENTS ====================
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
      <p className="text-sm text-gray-800 mt-0.5">{value || '—'}</p>
    </div>
  );
}

function RecordTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-blue-50 px-3 py-2 text-sm font-bold text-blue-800">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-2 py-1.5 text-left font-medium text-gray-600 border-r border-gray-100 last:border-r-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-gray-100">
                {row.map((_, j) => (
                  <td key={j} className="px-2 py-3 border-r border-gray-100 last:border-r-0 text-gray-300">—</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
