import React, { useContext, useState, useEffect } from 'react';
import { BuildContext } from './context/BuildContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Custom inline SVG icons for visual excellence
const CpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/>
    <line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/>
    <line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/>
    <line x1="20" y1="15" x2="23" y2="15"/>
    <line x1="1" y1="9" x2="4" y2="9"/>
    <line x1="1" y1="15" x2="4" y2="15"/>
  </svg>
);

const MotherboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
    <rect x="5" y="5" width="6" height="6"/>
    <rect x="14" y="5" width="5" height="10"/>
    <rect x="5" y="14" width="6" height="5"/>
    <rect x="14" y="17" width="5" height="2"/>
  </svg>
);

const RamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
    <line x1="6" y1="5" x2="6" y2="9"/>
    <line x1="10" y1="5" x2="10" y2="9"/>
    <line x1="14" y1="5" x2="14" y2="9"/>
    <line x1="18" y1="5" x2="18" y2="9"/>
    <circle cx="12" cy="14" r="2"/>
  </svg>
);

const GpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="2" y1="17" x2="22" y2="17"/>
    <line x1="6" y1="17" x2="6" y2="21"/>
    <line x1="18" y1="17" x2="18" y2="21"/>
    <circle cx="9" cy="10" r="3"/>
    <circle cx="15" cy="10" r="3"/>
  </svg>
);

const PsuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="3" x2="12" y2="7"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
    <line x1="3" y1="12" x2="7" y2="12"/>
    <line x1="17" y1="12" x2="21" y2="12"/>
  </svg>
);

const CaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="16" y2="10"/>
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className={className}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CrossIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const WarningIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function App() {
  const {
    catalog,
    loadingCatalog,
    savedBuilds,
    loadingBuilds,
    draftBuild,
    setDraftBuild,
    backendErrors,
    saveSuccess,
    selectPart,
    removePart,
    clearBuild,
    loadBuild,
    saveBuild,
    deleteBuild,
    compatibility,
    totalPrice,
    prebuilts,
    loadingPrebuilts,
    targetBudget,
    setTargetBudget,
    token,
    user,
    authError,
    authLoading,
    setAuthError,
    loginUser,
    registerUser,
    logoutUser,
    isPro,
    upgradeToPro,
    trackAffiliateClick,
    showcaseBuilds,
    loadingShowcase
  } = useContext(BuildContext);

  // Tab state
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' or 'showcase'

  // Authentication state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Pro Upgrade state
  const [proModalOpen, setProModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [payingPro, setPayingPro] = useState(false);

  // Price Trend and Alert states
  const [chartPart, setChartPart] = useState('gpu'); // 'cpu' or 'gpu'
  const [alertEmail, setAlertEmail] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  useEffect(() => {
    const selectedPart = chartPart === 'gpu' ? draftBuild.gpu : draftBuild.cpu;
    if (selectedPart) {
      setAlertPrice(Math.round(parseFloat(selectedPart.price) * 0.9));
    } else {
      setAlertPrice('');
    }
    setAlertSuccess(false);
  }, [draftBuild.gpu, draftBuild.cpu, chartPart]);

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Modal Advanced Filter States
  const [filterCpuBrand, setFilterCpuBrand] = useState('All');
  const [filterCpuCores, setFilterCpuCores] = useState('All');
  const [filterMoboSlots, setFilterMoboSlots] = useState('All');
  const [filterMoboFF, setFilterMoboFF] = useState('All');
  const [filterCaseColor, setFilterCaseColor] = useState('All');
  const [filterCasePanel, setFilterCasePanel] = useState('All');

  // Compare Rigs States
  const [compareRig1, setCompareRig1] = useState(null);
  const [compareRig2, setCompareRig2] = useState(null);
  const [compareRig3, setCompareRig3] = useState(null);

  const fetchAnalytics = async () => {
    const storedToken = localStorage.getItem('rig_token') || token;
    if (!storedToken) return;
    try {
      setLoadingAnalytics(true);
      const res = await fetch(`${API_BASE}/analytics/`, {
        headers: { 'Authorization': `Token ${storedToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Modal selector controls
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null); // 'cpu', 'motherboard', etc.
  const [searchQuery, setSearchQuery] = useState('');

  // Share controls
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const handleOpenSelector = (slot) => {
    setActiveSlot(slot);
    setSearchQuery('');
    setFilterCpuBrand('All');
    setFilterCpuCores('All');
    setFilterMoboSlots('All');
    setFilterMoboFF('All');
    setFilterCaseColor('All');
    setFilterCasePanel('All');
    setModalOpen(true);
  };

  const handleSelect = (part) => {
    selectPart(activeSlot, part);
    setModalOpen(false);
  };

  const getSlotCatalog = () => {
    switch (activeSlot) {
      case 'cpu': return catalog.cpus;
      case 'motherboard': return catalog.motherboards;
      case 'ram': return catalog.rams;
      case 'gpu': return catalog.gpus;
      case 'powersupply': return catalog.powersupplies;
      case 'case': return catalog.cases;
      default: return [];
    }
  };

  const getSlotLabel = (slot) => {
    switch (slot) {
      case 'cpu': return 'CPU';
      case 'motherboard': return 'Motherboard';
      case 'ram': return 'RAM';
      case 'gpu': return 'Graphics Card';
      case 'powersupply': return 'Power Supply';
      case 'case': return 'Chassis Case';
      default: return '';
    }
  };

  const filteredParts = getSlotCatalog().filter(part => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      part.name.toLowerCase().includes(query) ||
      (part.brand && part.brand.toLowerCase().includes(query)) ||
      (part.socket_type && part.socket_type.toLowerCase().includes(query)) ||
      (part.ram_type && part.ram_type.toLowerCase().includes(query)) ||
      (part.motherboard_support && part.motherboard_support.toLowerCase().includes(query));
      
    if (!matchesQuery) return false;
    
    if (activeSlot === 'cpu') {
      if (filterCpuBrand !== 'All' && part.brand !== filterCpuBrand) return false;
      if (filterCpuCores !== 'All') {
        const cores = part.core_count || 8;
        if (filterCpuCores === '12+') {
          if (cores < 12) return false;
        } else {
          if (cores !== parseInt(filterCpuCores)) return false;
        }
      }
    }
    
    if (activeSlot === 'motherboard') {
      if (filterMoboSlots !== 'All') {
        const slots = part.memory_slots || 4;
        if (slots !== parseInt(filterMoboSlots)) return false;
      }
      if (filterMoboFF !== 'All') {
        if (part.form_factor !== filterMoboFF) return false;
      }
    }
    
    if (activeSlot === 'case') {
      if (filterCaseColor !== 'All') {
        const pColor = (part.color || 'Black').toLowerCase();
        if (!pColor.includes(filterCaseColor.toLowerCase())) return false;
      }
      if (filterCasePanel !== 'All') {
        const pPanel = (part.side_panel || 'Tempered Glass').toLowerCase();
        if (filterCasePanel === 'Glass') {
          if (!pPanel.includes('glass')) return false;
        } else if (filterCasePanel === 'Solid') {
          if (pPanel.includes('glass')) return false;
        }
      }
    }
    
    return true;
  });

  const getCompStatusBadge = () => {
    const { isCompatible, checks } = compatibility;
    const hasIncompatible = Object.values(checks).some(c => c.status === 'incompatible');
    const hasWarnings = Object.values(checks).some(c => c.status === 'warning');

    if (hasIncompatible) {
      return <span className="comp-badge danger">❌ Warning Alerts</span>;
    }
    if (hasWarnings) {
      return <span className="comp-badge warning">⚠️ Incomplete Build</span>;
    }
    return <span className="comp-badge success">✓ Fully Compatible</span>;
  };

  const getRuleItemClass = (status) => {
    switch (status) {
      case 'compatible': return 'comp-rule-item compatible';
      case 'incompatible': return 'comp-rule-item incompatible';
      case 'warning': return 'comp-rule-item warning';
      default: return 'comp-rule-item empty';
    }
  };

  const getRuleIcon = (status) => {
    switch (status) {
      case 'compatible': return <CheckIcon className="rule-icon success" />;
      case 'incompatible': return <CrossIcon className="rule-icon danger" />;
      case 'warning': return <WarningIcon className="rule-icon warning" />;
      default: return <WarningIcon className="rule-icon empty" />;
    }
  };

  const getSlotClass = (slot) => {
    const { checks } = compatibility;
    if (!draftBuild[slot]) return 'slot-card';
    
    if (slot === 'cpu') {
      if (checks.socket.status === 'incompatible') return 'slot-card incompatible';
      if (checks.socket.status === 'compatible') return 'slot-card compatible';
    }
    if (slot === 'motherboard') {
      if (checks.socket.status === 'incompatible' || checks.ramType.status === 'incompatible') {
        return 'slot-card incompatible';
      }
      const hasCpu = !!draftBuild.cpu;
      const hasRam = !!draftBuild.ram;
      const socketComp = !hasCpu || checks.socket.status === 'compatible';
      const ramComp = !hasRam || checks.ramType.status === 'compatible';
      if ((hasCpu || hasRam) && socketComp && ramComp) {
        return 'slot-card compatible';
      }
    }
    if (slot === 'ram') {
      if (checks.ramType.status === 'incompatible') return 'slot-card incompatible';
      if (checks.ramType.status === 'compatible') return 'slot-card compatible';
    }
    if (slot === 'gpu') {
      return 'slot-card compatible';
    }
    if (slot === 'powersupply') {
      if (checks.wattage.status === 'incompatible') return 'slot-card incompatible';
      if (checks.wattage.status === 'compatible') return 'slot-card compatible';
    }
    if (slot === 'case') {
      if (checks.caseMobo.status === 'incompatible' || checks.caseGpu.status === 'incompatible') {
        return 'slot-card incompatible';
      }
      if (checks.caseMobo.status === 'compatible' && checks.caseGpu.status === 'compatible') {
        return 'slot-card compatible';
      }
    }
    return 'slot-card';
  };

  const loadPresetTemplate = (tier) => {
    let cpuQuery, moboQuery, ramQuery, gpuQuery, psuQuery, caseQuery;
    
    if (tier === 'budget') {
      cpuQuery = "10400f";
      moboQuery = "h510m";
      ramQuery = "ripjaws v 16gb";
      gpuQuery = "rx 6600";
      psuQuery = "450w";
      caseQuery = "4000d";
      setTargetBudget(650);
    } else if (tier === 'mid') {
      cpuQuery = "7600x";
      moboQuery = "b650e-f";
      ramQuery = "trident z5 rgb 32gb";
      gpuQuery = "rtx 4070 super";
      psuQuery = "rm750x";
      caseQuery = "h9 flow";
      setTargetBudget(1450);
    } else if (tier === 'high') {
      cpuQuery = "14900k";
      moboQuery = "z790-e";
      ramQuery = "vengeance rgb 64gb";
      gpuQuery = "rtx 4090";
      psuQuery = "thor ii 1200w";
      caseQuery = "o11 dynamic";
      setTargetBudget(3350);
    }

    const foundCpu = catalog.cpus.find(x => x.name.toLowerCase().includes(cpuQuery));
    const foundMobo = catalog.motherboards.find(x => x.name.toLowerCase().includes(moboQuery));
    const foundRam = catalog.rams.find(x => x.name.toLowerCase().includes(ramQuery));
    const foundGpu = catalog.gpus.find(x => x.name.toLowerCase().includes(gpuQuery));
    const foundPsu = catalog.powersupplies.find(x => x.name.toLowerCase().includes(psuQuery));
    const foundCase = catalog.cases.find(x => x.name.toLowerCase().includes(caseQuery));

    setDraftBuild({
      id: null,
      name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Preset Rig`,
      cpu: foundCpu || null,
      motherboard: foundMobo || null,
      ram: foundRam || null,
      gpu: foundGpu || null,
      powersupply: foundPsu || null,
      case: foundCase || null
    });
    setSaveSuccess(false);
    setBackendErrors({});
  };

  const getSmartSuggestions = () => {
    const suggestions = [];
    const remaining = targetBudget - totalPrice;
    
    // 1. Fill empty slots
    if (!draftBuild.cpu) {
      const mobo = draftBuild.motherboard;
      const filtered = catalog.cpus.filter(c => !mobo || c.socket_type === mobo.socket_type);
      const affordable = filtered.filter(c => parseFloat(c.price) <= remaining);
      const best = affordable.length > 0 
        ? affordable.reduce((prev, current) => (parseFloat(prev.price) > parseFloat(current.price)) ? prev : current)
        : filtered[filtered.length - 1];
      
      if (best) {
        suggestions.push({
          type: 'fill',
          message: `Add ${best.brand} ${best.name} CPU ($${best.price}) which fits your remaining budget.`,
          part: best,
          slot: 'cpu'
        });
      }
    }
    if (!draftBuild.motherboard) {
      const cpu = draftBuild.cpu;
      const ram = draftBuild.ram;
      const filtered = catalog.motherboards.filter(m => 
        (!cpu || m.socket_type === cpu.socket_type) && 
        (!ram || m.ram_type === ram.ram_type)
      );
      const affordable = filtered.filter(m => parseFloat(m.price) <= remaining);
      const best = affordable.length > 0 ? affordable[0] : filtered[0];
      if (best) {
        suggestions.push({
          type: 'fill',
          message: `Add ${best.name} Motherboard ($${best.price}) matching your specifications.`,
          part: best,
          slot: 'motherboard'
        });
      }
    }
    if (!draftBuild.ram) {
      const mobo = draftBuild.motherboard;
      const filtered = catalog.rams.filter(r => !mobo || r.ram_type === mobo.ram_type);
      const affordable = filtered.filter(r => parseFloat(r.price) <= remaining);
      const best = affordable.length > 0 ? affordable[0] : filtered[0];
      if (best) {
        suggestions.push({
          type: 'fill',
          message: `Add ${best.name} RAM ($${best.price}) to complete the system.`,
          part: best,
          slot: 'ram'
        });
      }
    }
    if (!draftBuild.gpu) {
      const affordable = catalog.gpus.filter(g => parseFloat(g.price) <= remaining);
      const best = affordable.length > 0 
        ? affordable.reduce((prev, current) => (parseFloat(prev.price) > parseFloat(current.price)) ? prev : current)
        : catalog.gpus[catalog.gpus.length - 1];
      if (best) {
        suggestions.push({
          type: 'fill',
          message: `Add ${best.name} Graphics Card ($${best.price}) to output video signals.`,
          part: best,
          slot: 'gpu'
        });
      }
    }
    if (!draftBuild.powersupply) {
      const cpuTdp = draftBuild.cpu ? draftBuild.cpu.tdp_wattage : 0;
      const gpuTdp = draftBuild.gpu ? draftBuild.gpu.tdp_wattage : 0;
      const minWattage = cpuTdp + gpuTdp + 100;
      const filtered = catalog.powersupplies.filter(p => p.wattage >= minWattage);
      const affordable = filtered.filter(p => parseFloat(p.price) <= remaining);
      const best = affordable.length > 0 ? affordable[0] : filtered[0];
      if (best) {
        suggestions.push({
          type: 'fill',
          message: `Add ${best.name} Power Supply ($${best.price}) supplying at least ${minWattage}W.`,
          part: best,
          slot: 'powersupply'
        });
      }
    }

    // 2. Upgrades (if under budget)
    if (remaining > 50) {
      if (draftBuild.cpu && draftBuild.cpu.name.includes("Ryzen 5 7600X")) {
        const upgrade = catalog.cpus.find(c => c.name.includes("Ryzen 7 7800X3D"));
        if (upgrade && remaining >= (parseFloat(upgrade.price) - parseFloat(draftBuild.cpu.price))) {
          suggestions.push({
            type: 'upgrade',
            message: `Upgrade CPU to Ryzen 7 7800X3D (adds $${(parseFloat(upgrade.price) - parseFloat(draftBuild.cpu.price)).toFixed(2)}) for massive gaming gains.`,
            part: upgrade,
            slot: 'cpu'
          });
        }
      }
      if (draftBuild.cpu && draftBuild.cpu.name.includes("Core i5-12400")) {
        const upgrade = catalog.cpus.find(c => c.name.includes("Core i5-13600K"));
        if (upgrade && remaining >= (parseFloat(upgrade.price) - parseFloat(draftBuild.cpu.price))) {
          suggestions.push({
            type: 'upgrade',
            message: `Upgrade CPU to Core i5-13600K (adds $${(parseFloat(upgrade.price) - parseFloat(draftBuild.cpu.price)).toFixed(2)}) for 14-core productivity.`,
            part: upgrade,
            slot: 'cpu'
          });
        }
      }

      if (draftBuild.gpu && draftBuild.gpu.name.includes("RTX 4070 SUPER")) {
        const upgrade = catalog.gpus.find(g => g.name.includes("RTX 4080 SUPER"));
        if (upgrade && remaining >= (parseFloat(upgrade.price) - parseFloat(draftBuild.gpu.price))) {
          suggestions.push({
            type: 'upgrade',
            message: `Upgrade GPU to RTX 4080 SUPER (adds $${(parseFloat(upgrade.price) - parseFloat(draftBuild.gpu.price)).toFixed(2)}) for flawless 4K gaming.`,
            part: upgrade,
            slot: 'gpu'
          });
        }
      }
      if (draftBuild.gpu && draftBuild.gpu.name.includes("RTX 3060")) {
        const upgrade = catalog.gpus.find(g => g.name.includes("RTX 4060 Ti"));
        if (upgrade && remaining >= (parseFloat(upgrade.price) - parseFloat(draftBuild.gpu.price))) {
          suggestions.push({
            type: 'upgrade',
            message: `Upgrade GPU to RTX 4060 Ti (adds $${(parseFloat(upgrade.price) - parseFloat(draftBuild.gpu.price)).toFixed(2)}) for DLSS 3 frame generation.`,
            part: upgrade,
            slot: 'gpu'
          });
        }
      }

      if (draftBuild.ram && draftBuild.ram.capacity_gb === 16) {
        const upgrade = catalog.rams.find(r => r.ram_type === draftBuild.ram.ram_type && r.capacity_gb === 32);
        if (upgrade && remaining >= (parseFloat(upgrade.price) - parseFloat(draftBuild.ram.price))) {
          suggestions.push({
            type: 'upgrade',
            message: `Upgrade RAM to 32GB kit (adds $${(parseFloat(upgrade.price) - parseFloat(draftBuild.ram.price)).toFixed(2)}) to prevent bottlenecks.`,
            part: upgrade,
            slot: 'ram'
          });
        }
      }
    }

    // 3. Downgrades (if over budget)
    if (remaining < 0) {
      if (draftBuild.gpu && draftBuild.gpu.name.includes("RTX 4090")) {
        const downgrade = catalog.gpus.find(g => g.name.includes("RTX 4080 SUPER"));
        if (downgrade) {
          suggestions.push({
            type: 'downgrade',
            message: `Downgrade GPU to RTX 4080 SUPER (saves $${(parseFloat(draftBuild.gpu.price) - parseFloat(downgrade.price)).toFixed(2)}) to reduce price.`,
            part: downgrade,
            slot: 'gpu'
          });
        }
      }
      if (draftBuild.gpu && draftBuild.gpu.name.includes("RTX 4080 SUPER")) {
        const downgrade = catalog.gpus.find(g => g.name.includes("RTX 4070 SUPER"));
        if (downgrade) {
          suggestions.push({
            type: 'downgrade',
            message: `Downgrade GPU to RTX 4070 SUPER (saves $${(parseFloat(draftBuild.gpu.price) - parseFloat(downgrade.price)).toFixed(2)}) to fit budget.`,
            part: downgrade,
            slot: 'gpu'
          });
        }
      }

      if (draftBuild.cpu && draftBuild.cpu.name.includes("14900K")) {
        const downgrade = catalog.cpus.find(c => c.name.includes("14700K"));
        if (downgrade) {
          suggestions.push({
            type: 'downgrade',
            message: `Downgrade CPU to Core i7-14700K (saves $${(parseFloat(draftBuild.cpu.price) - parseFloat(downgrade.price)).toFixed(2)}) with minimal speed loss.`,
            part: downgrade,
            slot: 'cpu'
          });
        }
      }
      
      if (draftBuild.powersupply && draftBuild.powersupply.wattage > 850) {
        const downgrade = catalog.powersupplies.find(p => p.wattage === 850);
        if (downgrade && parseFloat(downgrade.price) < parseFloat(draftBuild.powersupply.price)) {
          suggestions.push({
            type: 'downgrade',
            message: `Downgrade PSU to 850W (saves $${(parseFloat(draftBuild.powersupply.price) - parseFloat(downgrade.price)).toFixed(2)}) still sufficient.`,
            part: downgrade,
            slot: 'powersupply'
          });
        }
      }
    }

    return suggestions;
  };

  const getShareUrl = () => {
    if (!draftBuild.id) return '';
    return `${window.location.origin}?share=${draftBuild.id}`;
  };

  const getRedditMarkdown = () => {
    const { cpu, motherboard, ram, gpu, powersupply, case: casePart } = draftBuild;
    return `[PC Part Picker Part List](https://pcpartpicker.com)

Type|Item|Price
:----|:----|:----
**CPU** | ${cpu ? `[${cpu.brand} ${cpu.name}](${cpu.affiliate_url || '#'})` : 'Not Selected'} | ${cpu ? `$${cpu.price}` : '-'}
**Motherboard** | ${motherboard ? `[${motherboard.name}](${motherboard.affiliate_url || '#'})` : 'Not Selected'} | ${motherboard ? `$${motherboard.price}` : '-'}
**Memory** | ${ram ? `[${ram.name}](${ram.affiliate_url || '#'})` : 'Not Selected'} | ${ram ? `$${ram.price}` : '-'}
**Video Card** | ${gpu ? `[${gpu.name}](${gpu.affiliate_url || '#'})` : 'Not Selected'} | ${gpu ? `$${gpu.price}` : '-'}
**Power Supply** | ${powersupply ? `[${powersupply.name}](${powersupply.affiliate_url || '#'})` : 'Not Selected'} | ${powersupply ? `$${powersupply.price}` : '-'}
${casePart ? `**Case** | [${casePart.name}](${casePart.affiliate_url || '#'}) | $${casePart.price}\n` : ''}**Total** | **$${totalPrice.toFixed(2)}** |
*Generated by [Rigsmith](${window.location.origin})*`;
  };

  const getDiscordMarkdown = () => {
    const { cpu, motherboard, ram, gpu, powersupply, case: casePart } = draftBuild;
    return `>>> 🛠️ **${draftBuild.name || 'Custom Rig'}** 
* **CPU**: ${cpu ? `${cpu.brand} ${cpu.name} ($${cpu.price})` : '*Not Selected*'}
* **Motherboard**: ${motherboard ? `${motherboard.name} ($${motherboard.price})` : '*Not Selected*'}
* **RAM**: ${ram ? `${ram.name} ($${ram.price})` : '*Not Selected*'}
* **GPU**: ${gpu ? `${gpu.name} ($${gpu.price})` : '*Not Selected*'}
* **PSU**: ${powersupply ? `${powersupply.name} ($${powersupply.price})` : '*Not Selected*'}
${casePart ? `* **Case**: ${casePart.name} ($${casePart.price})\n` : ''}✨ **Total Estimated Cost**: **$${totalPrice.toFixed(2)}**
🔗 *View & Edit build at:* ${getShareUrl()}`;
  };

  const handleShareClick = async () => {
    if (!draftBuild.id) {
      const saved = await saveBuild();
      if (saved === "LIMIT_REACHED") {
        setProModalOpen(true);
        return;
      }
      if (!saved) {
        alert("Please enter a custom rig name to save and share your build!");
        return;
      }
    }
    setShareModalOpen(true);
  };

  const getFpsEstimate = (resolution) => {
    const gpu = draftBuild.gpu;
    if (!gpu) return 0;
    
    let base = 60;
    const name = gpu.name.toLowerCase();
    if (name.includes("4090")) {
      base = resolution === '1080p' ? 240 : resolution === '1440p' ? 210 : 125;
    } else if (name.includes("4080")) {
      base = resolution === '1080p' ? 210 : resolution === '1440p' ? 175 : 95;
    } else if (name.includes("4070")) {
      base = resolution === '1080p' ? 170 : resolution === '1440p' ? 130 : 65;
    } else if (name.includes("7900")) {
      base = resolution === '1080p' ? 220 : resolution === '1440p' ? 180 : 100;
    } else if (name.includes("7800")) {
      base = resolution === '1080p' ? 160 : resolution === '1440p' ? 120 : 55;
    } else if (name.includes("4060")) {
      base = resolution === '1080p' ? 115 : resolution === '1440p' ? 80 : 35;
    } else if (name.includes("3060")) {
      base = resolution === '1080p' ? 85 : resolution === '1440p' ? 60 : 25;
    } else if (name.includes("6600")) {
      base = resolution === '1080p' ? 75 : resolution === '1440p' ? 50 : 20;
    }

    let scale = 1.0;
    if (draftBuild.cpu) {
      const cpuName = draftBuild.cpu.name.toLowerCase();
      if (cpuName.includes("7950x") || cpuName.includes("14900k") || cpuName.includes("7800x3d")) {
        scale = 1.08;
      } else if (cpuName.includes("10400f") || cpuName.includes("11900k")) {
        scale = 0.88;
      }
    }
    return base * scale;
  };

  const getBottleneckAnalysis = () => {
    const cpu = draftBuild.cpu;
    const gpu = draftBuild.gpu;
    if (!cpu || !gpu) return { percentage: 0, type: 'Balanced', message: '' };

    let cpuPoints = 70;
    const cpuName = cpu.name.toLowerCase();
    if (cpuName.includes("7950x") || cpuName.includes("14900k")) cpuPoints = 100;
    else if (cpuName.includes("7800x3d") || cpuName.includes("14700k")) cpuPoints = 95;
    else if (cpuName.includes("7600x") || cpuName.includes("13600k")) cpuPoints = 85;
    else if (cpuName.includes("5900x") || cpuName.includes("5800x3d")) cpuPoints = 75;
    else if (cpuName.includes("5600x") || cpuName.includes("12400")) cpuPoints = 65;
    else if (cpuName.includes("10400f")) cpuPoints = 50;

    let gpuPoints = 50;
    const gpuName = gpu.name.toLowerCase();
    if (gpuName.includes("4090")) gpuPoints = 100;
    else if (gpuName.includes("4080") || gpuName.includes("7900")) gpuPoints = 85;
    else if (gpuName.includes("4070") || gpuName.includes("7800")) gpuPoints = 70;
    else if (gpuName.includes("4060") || gpuName.includes("3060")) gpuPoints = 50;
    else if (gpuName.includes("6600")) gpuPoints = 35;

    const diff = cpuPoints - gpuPoints;
    if (diff < -15) {
      const percentage = Math.min(35, Math.abs(diff) + 5);
      return {
        percentage,
        type: 'CPU Bottleneck',
        message: `Your CPU (${cpu.brand} ${cpu.name}) might bottleneck your GPU (${gpu.name}) in CPU-heavy games, causing lower frames at high refresh rates.`
      };
    } else if (diff > 25) {
      return {
        percentage: Math.min(10, diff - 20),
        type: 'GPU Bound',
        message: "Your graphics card is the primary limit. This is standard and ideal for playing games at max settings."
      };
    }
    
    return {
      percentage: Math.abs(diff) % 8 + 2,
      type: 'Balanced Build',
      message: "Great selection! Your CPU and GPU match each other's speeds perfectly with minimal bottleneck."
    };
  };

  const generatePricePoints = (price) => {
    const points = [];
    const basePrice = parseFloat(price || 150);
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      // fluctuate slightly
      const fluctuation = Math.sin(i * 0.4) * 0.03 + (Math.cos(i * 0.2) * 0.015) + ((i % 5) * 0.005) - 0.01;
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      points.push({
        date: dateStr,
        price: parseFloat((basePrice * (1 + fluctuation)).toFixed(2))
      });
    }
    return points;
  };

  const renderVisualBlueprint = () => {
    const { cpu, motherboard, ram, gpu, powersupply, case: casePart } = draftBuild;
    const checks = compatibility?.checks || {};

    // Determine Case color
    const caseColor = casePart?.color || 'Black';
    let caseStroke = '#64748b'; // default Slate gray
    let caseGlow = 'none';
    if (caseColor.toLowerCase() === 'white') {
      caseStroke = '#94a3b8';
    } else if (caseColor.toLowerCase() === 'silver' || caseColor.toLowerCase() === 'gray') {
      caseStroke = '#475569';
    }

    // Determine Motherboard size and positioning
    // Base coordinates
    const moboX = 55;
    const moboY = 55;
    let moboW = 280; // ATX default
    let moboH = 320;
    const moboFF = motherboard?.form_factor || 'ATX';
    if (moboFF.toUpperCase() === 'MINI-ITX' || moboFF.toUpperCase() === 'ITX') {
      moboW = 210;
      moboH = 210;
    } else if (moboFF.toUpperCase() === 'MICRO-ATX' || moboFF.toUpperCase() === 'MATX') {
      moboW = 250;
      moboH = 260;
    }

    const isMoboIncompatible = checks?.caseMobo?.status === 'incompatible';
    const moboStroke = isMoboIncompatible ? '#ef4444' : 'rgba(79, 70, 229, 0.45)';
    const moboGlow = isMoboIncompatible ? 'url(#glow-red)' : 'none';

    // CPU Socket Center (relative to motherboard)
    const socketX = moboX + 60;
    const socketY = moboY + 60;
    const socketSize = 55;

    // CPU Socket compatibility check
    const isCpuIncompatible = checks?.socket?.status === 'incompatible';
    const cpuStroke = isCpuIncompatible ? '#ef4444' : 'rgba(16, 185, 129, 0.6)';
    const cpuGlow = isCpuIncompatible ? 'url(#glow-red)' : 'none';

    // RAM Slots
    const ramSlotsCount = motherboard?.memory_slots || 4;
    const ramXStart = socketX + 70;
    const ramYStart = socketY - 10;
    const isRamIncompatible = checks?.ramType?.status === 'incompatible';

    // GPU Length and collision check
    const gpuLengthMM = gpu?.gpu_length_mm || 280;
    // Scale: 1mm = 1.05px
    const gpuWidthPx = Math.min(370, gpuLengthMM * 1.05); 
    const maxGpuLengthMM = casePart?.max_gpu_length_mm || 320;
    const isGpuCollision = gpuLengthMM > maxGpuLengthMM;
    const gpuStroke = isGpuCollision ? '#ef4444' : 'rgba(236, 72, 153, 0.7)'; // flat pink for GPU
    const gpuGlow = isGpuCollision ? 'url(#glow-red)' : 'none';

    // PSU
    const isPsuIncompatible = checks?.wattage?.status === 'incompatible';
    const psuStroke = isPsuIncompatible ? '#ef4444' : 'rgba(168, 85, 247, 0.7)'; // purple for PSU
    const psuGlow = isPsuIncompatible ? 'url(#glow-red)' : 'none';

    return (
      <div 
        className="glass-panel blueprint-card" 
        style={{
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '1.5rem',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          userSelect: 'none',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03), 0 10px 15px -3px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" style={{ color: 'var(--primary)' }}>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="1.5" />
              <path d="M12 16L12 8" strokeWidth="1.5" />
              <path d="M8 12L16 12" strokeWidth="1.5" />
            </svg>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>📐 Virtual Assembly Blueprint</h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--primary)', background: 'rgba(79, 70, 229, 0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
            Live Assembly
          </span>
        </div>

        <svg 
          viewBox="0 0 500 520" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            background: '#f8fafc', 
            borderRadius: '12px',
            border: '1px solid var(--panel-border)'
          }}
        >
          <defs>
            <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 70, 229, 0.04)" strokeWidth="0.8" />
            </pattern>
            
            <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="4" floodColor="#4f46e5" floodOpacity="0.25"/>
            </filter>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.25"/>
            </filter>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="4" floodColor="#10b981" floodOpacity="0.25"/>
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.45"/>
            </filter>
            <filter id="glow-pink" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="4" floodColor="#ec4899" floodOpacity="0.25"/>
            </filter>
            <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.25"/>
            </filter>
            <filter id="glow-white" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="4" floodColor="#64748b" floodOpacity="0.2"/>
            </filter>

            <linearGradient id="ram-rgb-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            <linearGradient id="glass-reflection" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" stopOpacity="0.25" />
              <stop offset="30%" stopColor="rgba(255, 255, 255, 0.05)" stopOpacity="0.05" />
              <stop offset="31%" stopColor="rgba(255, 255, 255, 0)" stopOpacity="0" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

          {/* 1. CASE CHASSIS FRAME */}
          <g 
            className={`blueprint-element ${hoveredSlot === 'case' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredSlot('case')}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => handleOpenSelector('case')}
            style={{ cursor: 'pointer' }}
          >
            {/* Chassis background card */}
            <rect 
              x="25" 
              y="25" 
              width="450" 
              height="470" 
              rx="16" 
              fill="#ffffff" 
              stroke={hoveredSlot === 'case' ? 'var(--primary)' : caseStroke}
              strokeWidth={hoveredSlot === 'case' ? '2.5' : '1.5'}
              style={{ transition: 'all 0.25s ease' }}
            />
            
            {/* Case brand label */}
            {casePart ? (
              <text x="38" y="45" fill="var(--text-secondary)" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                CASE: {casePart.brand?.toUpperCase()} {casePart.name?.toUpperCase()}
              </text>
            ) : (
              <text x="38" y="45" fill="var(--text-muted)" fontSize="9.5" fontFamily="monospace">
                NO CASE SELECTED (DEFAULT ATX CHASSIS)
              </text>
            )}
            
            {/* Case fans (rear fan) */}
            <circle cx="45" cy="110" r="22" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="45" cy="110" r="6" fill="#cbd5e1" />
            {/* Top fans */}
            <circle cx="160" cy="38" r="20" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
            <circle cx="280" cy="38" r="20" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
          </g>

          {/* 2. MOTHERBOARD */}
          <g 
            className={`blueprint-element ${hoveredSlot === 'motherboard' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredSlot('motherboard')}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => handleOpenSelector('motherboard')}
            style={{ cursor: 'pointer' }}
          >
            {/* PCB Base */}
            <rect 
              x={moboX} 
              y={moboY} 
              width={moboW} 
              height={moboH} 
              rx="8" 
              fill={motherboard ? '#f8fafc' : 'rgba(0, 0, 0, 0.01)'}
              stroke={hoveredSlot === 'motherboard' ? 'var(--primary)' : moboStroke}
              strokeWidth={hoveredSlot === 'motherboard' ? '2' : '1.2'}
              strokeDasharray={motherboard ? 'none' : '3 3'}
              style={{ transition: 'all 0.25s ease' }}
            />

            {/* Motherboard Details (Traces / Screws) */}
            {motherboard && (
              <>
                {/* Circuit Traces */}
                <path d={`M ${moboX+10} ${moboY+30} L ${moboX+80} ${moboY+30} L ${moboX+100} ${moboY+50}`} fill="none" stroke="rgba(79, 70, 229, 0.08)" strokeWidth="1" />
                <path d={`M ${moboX+20} ${moboY+200} L ${moboX+120} ${moboY+200} L ${moboX+140} ${moboY+220}`} fill="none" stroke="rgba(79, 70, 229, 0.08)" strokeWidth="1" />
                {/* Board corner screws */}
                <circle cx={moboX+10} cy={moboY+10} r="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                <circle cx={moboX+moboW-10} cy={moboY+10} r="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                <circle cx={moboX+10} cy={moboY+moboH-10} r="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                <circle cx={moboX+moboW-10} cy={moboY+moboH-10} r="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />

                {/* Form factor label */}
                <text x={moboX+12} y={moboY+moboH-15} fill="var(--text-secondary)" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {moboFF} PCB
                </text>
              </>
            )}

            {/* Motherboard size warning icon if incompatible */}
            {isMoboIncompatible && (
              <g transform={`translate(${moboX + moboW - 35}, ${moboY + 12})`}>
                <circle cx="12" cy="12" r="10" fill="#ef4444" />
                <text x="12" y="16" fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">!</text>
              </g>
            )}
          </g>

          {/* 3. CPU & COOLER */}
          <g 
            className={`blueprint-element ${hoveredSlot === 'cpu' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredSlot('cpu')}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => handleOpenSelector('cpu')}
            style={{ cursor: 'pointer' }}
          >
            {/* CPU Socket base */}
            <rect 
              x={socketX} 
              y={socketY} 
              width={socketSize} 
              height={socketSize} 
              rx="4" 
              fill="#f1f5f9" 
              stroke={hoveredSlot === 'cpu' ? 'var(--primary)' : cpuStroke}
              strokeWidth={hoveredSlot === 'cpu' ? '2' : '1.2'}
              style={{ transition: 'all 0.25s ease' }}
            />

            {/* Socket interior grids */}
            <path d={`M ${socketX+8} ${socketY} L ${socketX+8} ${socketY+socketSize}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            <path d={`M ${socketX+16} ${socketY} L ${socketX+16} ${socketY+socketSize}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            <path d={`M ${socketX+24} ${socketY} L ${socketX+24} ${socketY+socketSize}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            <path d={`M ${socketX+32} ${socketY} L ${socketX+32} ${socketY+socketSize}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            <path d={`M ${socketX+40} ${socketY} L ${socketX+40} ${socketY+socketSize}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            
            <path d={`M ${socketX} ${socketY+8} L ${socketX+socketSize} ${socketY+8}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            <path d={`M ${socketX} ${socketY+16} L ${socketX+socketSize} ${socketY+16}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            <path d={`M ${socketX} ${socketY+24} L ${socketX+socketSize} ${socketY+24}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            <path d={`M ${socketX} ${socketY+32} L ${socketX+socketSize} ${socketY+32}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            <path d={`M ${socketX} ${socketY+40} L ${socketX+socketSize} ${socketY+40}`} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />

            {cpu ? (
              <>
                {/* Silicon microchip details */}
                <rect 
                  x={socketX+8} 
                  y={socketY+8} 
                  width={socketSize-16} 
                  height={socketSize-16} 
                  rx="2" 
                  fill="#e2e8f0" 
                  stroke="#cbd5e1"
                  strokeWidth="1" 
                />
                {/* Die core */}
                <rect 
                  x={socketX+17} 
                  y={socketY+17} 
                  width="21" 
                  height="21" 
                  fill="#f8fafc" 
                  stroke={cpu.brand?.toLowerCase() === 'amd' ? '#f97316' : '#3b82f6'} 
                  strokeWidth="1.5"
                />
                
                {/* Manufacturer label */}
                <text x={socketX+socketSize/2} y={socketY+socketSize/2 + 3} fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                  {cpu.brand?.toUpperCase()}
                </text>

                {/* CPU Cooler Pump Block */}
                <circle 
                  cx={socketX + socketSize/2} 
                  cy={socketY + socketSize/2} 
                  r="35" 
                  fill="rgba(255, 255, 255, 0.95)" 
                  stroke={hoveredSlot === 'cpu' ? 'var(--primary)' : (isCpuIncompatible ? '#ef4444' : 'var(--success)')} 
                  strokeWidth="2"
                  style={{ transition: 'all 0.25s ease' }}
                />

                {/* Tubes for AIO Liquid Cooler */}
                <path d={`M ${socketX + socketSize/2 - 12} ${socketY + socketSize/2 - 20} Q ${socketX + socketSize/2 - 35} ${socketY - 30} 170 50`} fill="none" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" />
                <path d={`M ${socketX + socketSize/2 + 12} ${socketY + socketSize/2 - 20} Q ${socketX + socketSize/2 - 15} ${socketY - 35} 190 50`} fill="none" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" />
                <path d={`M ${socketX + socketSize/2 - 12} ${socketY + socketSize/2 - 20} Q ${socketX + socketSize/2 - 35} ${socketY - 30} 170 50`} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
                <path d={`M ${socketX + socketSize/2 + 12} ${socketY + socketSize/2 - 20} Q ${socketX + socketSize/2 - 15} ${socketY - 35} 190 50`} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />

                {/* CPU cooler design detail */}
                <circle cx={socketX + socketSize/2} cy={socketY + socketSize/2} r="16" fill="none" stroke="rgba(0,0,0,0.02)" strokeWidth="6" />
                <circle cx={socketX + socketSize/2} cy={socketY + socketSize/2} r="22" fill="none" stroke="rgba(79, 70, 229, 0.15)" strokeWidth="1" strokeDasharray="4 2" />
              </>
            ) : (
              <text x={socketX+socketSize/2} y={socketY+socketSize/2 + 3} fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontFamily="monospace">
                CPU
              </text>
            )}
          </g>

          {/* 4. RAM SLOTS */}
          <g 
            className={`blueprint-element ${hoveredSlot === 'ram' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredSlot('ram')}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => handleOpenSelector('ram')}
            style={{ cursor: 'pointer' }}
          >
            {/* Draw Memory Slots */}
            {Array.from({ length: ramSlotsCount }).map((_, idx) => {
              const xPos = ramXStart + idx * 8;
              const isSlotPopulated = !!ram;
              return (
                <g key={idx}>
                  {/* Empty Slot Track */}
                  <rect 
                    key={`track-${idx}`}
                    x={xPos} 
                    y={ramYStart} 
                    width="3" 
                    height="80" 
                    rx="1" 
                    fill="#e2e8f0" 
                    stroke={hoveredSlot === 'ram' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(0, 0, 0, 0.05)'}
                    strokeWidth="0.5"
                  />
                  {/* Populated RAM module */}
                  {isSlotPopulated && (
                    <rect 
                      key={`ram-${idx}`}
                      x={xPos - 1} 
                      y={ramYStart - 3} 
                      width="5" 
                      height="86" 
                      rx="2" 
                      fill="url(#ram-rgb-gradient)" 
                      stroke={hoveredSlot === 'ram' ? '#fff' : (isRamIncompatible ? '#ef4444' : 'rgba(79, 70, 229, 0.7)')}
                      strokeWidth="0.8"
                      style={{ transition: 'all 0.25s ease' }}
                    />
                  )}
                </g>
              );
            })}

            {/* RAM compatibility warning */}
            {isRamIncompatible && (
              <g transform={`translate(${ramXStart + ramSlotsCount * 8 + 4}, ${ramYStart + 28})`}>
                <circle cx="7" cy="7" r="7" fill="#ef4444" />
                <text x="7" y="10" fill="#fff" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">!</text>
              </g>
            )}
          </g>

          {/* 5. POWER SUPPLY (PSU) */}
          <g 
            className={`blueprint-element ${hoveredSlot === 'powersupply' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredSlot('powersupply')}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => handleOpenSelector('powersupply')}
            style={{ cursor: 'pointer' }}
          >
            {/* PSU Basement Case */}
            <rect 
              x="40" 
              y="415" 
              width="420" 
              height="65" 
              rx="6" 
              fill="#f1f5f9" 
              stroke={hoveredSlot === 'powersupply' ? 'var(--primary)' : psuStroke}
              strokeWidth={hoveredSlot === 'powersupply' ? '2' : '1.2'}
              style={{ transition: 'all 0.25s ease' }}
            />

            {/* Internal PSU Block */}
            {powersupply ? (
              <>
                <rect 
                  x="50" 
                  y="423" 
                  width="130" 
                  height="49" 
                  rx="4" 
                  fill="#ffffff" 
                  stroke="#cbd5e1" 
                  strokeWidth="1" 
                />
                {/* PSU Cooling Fan pattern inside the unit */}
                <circle cx="115" cy="448" r="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
                <path d="M 115 430 L 115 466 M 97 448 L 133 448 M 102 435 L 128 461 M 102 461 L 128 435" stroke="rgba(79, 70, 229, 0.15)" strokeWidth="1.5" />
                
                {/* PSU Text Label */}
                <text x="195" y="445" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  {powersupply.wattage}W PSU
                </text>
                <text x="195" y="457" fill="var(--text-secondary)" fontSize="7" fontFamily="monospace">
                  {powersupply.name?.substring(0, 25)}...
                </text>

                {/* Power Cable Routing Graphics */}
                {/* Cable 1: 24-Pin Main motherboard Cable */}
                <path 
                  d={`M 180 448 Q 380 448 ${moboX + moboW - 10} ${moboY + 160}`} 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeDasharray="5 3"
                  opacity="0.8"
                />
                
                {/* Cable 2: CPU 8-Pin Cable */}
                <path 
                  d={`M 150 423 Q 30 320 ${socketX - 15} ${socketY + 10}`} 
                  fill="none" 
                  stroke="#a855f7" 
                  strokeWidth="2.0" 
                  strokeLinecap="round" 
                  strokeDasharray="4 2"
                  opacity="0.8"
                />

                {/* Cable 3: GPU PCIe Power Cable (only if GPU is selected) */}
                {gpu && (
                  <path 
                    d={`M 180 435 Q 260 410 ${75 + gpuWidthPx * 0.5} 255`} 
                    fill="none" 
                    stroke="#ec4899" 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                    strokeDasharray="4 2"
                    opacity="0.8"
                  />
                )}
              </>
            ) : (
              <text x="250" y="453" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="monospace">
                POWER SUPPLY UNIT (PSU) BASEMENT
              </text>
            )}
          </g>

          {/* 6. GRAPHICS CARD (GPU) */}
          <g 
            className={`blueprint-element ${hoveredSlot === 'gpu' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredSlot('gpu')}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => handleOpenSelector('gpu')}
            style={{ cursor: 'pointer' }}
          >
            {/* PCIe slot track line */}
            {motherboard && (
              <rect 
                x={moboX + 10} 
                y="228" 
                width={moboW - 20} 
                height="4" 
                rx="1" 
                fill="rgba(79, 70, 229, 0.15)" 
                stroke="rgba(0,0,0,0.04)" 
                strokeWidth="0.5" 
              />
            )}

            {gpu ? (
              <>
                {/* GPU Card Bounding Box */}
                <rect 
                  x="75" 
                  y="202" 
                  width={gpuWidthPx} 
                  height="54" 
                  rx="6" 
                  fill="#ffffff" 
                  stroke={hoveredSlot === 'gpu' ? 'var(--primary)' : gpuStroke}
                  strokeWidth={hoveredSlot === 'gpu' ? '2' : '1.2'}
                  style={{ transition: 'all 0.25s ease' }}
                />

                {/* GPU cooling fans */}
                {gpuWidthPx > 120 ? (
                  <>
                    <circle cx={75 + gpuWidthPx * 0.25} cy="229" r="16" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
                    <circle cx={75 + gpuWidthPx * 0.25} cy="229" r="4" fill="#cbd5e1" />
                    {/* Fan blades indicator */}
                    <path d={`M ${75 + gpuWidthPx * 0.25} 216 L ${75 + gpuWidthPx * 0.25} 242 M ${75 + gpuWidthPx * 0.25 - 13} 229 L ${75 + gpuWidthPx * 0.25 + 13} 229`} stroke="rgba(0,0,0,0.03)" strokeWidth="1.5" />

                    <circle cx={75 + gpuWidthPx * 0.75} cy="229" r="16" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
                    <circle cx={75 + gpuWidthPx * 0.75} cy="229" r="4" fill="#cbd5e1" />
                    <path d={`M ${75 + gpuWidthPx * 0.75} 216 L ${75 + gpuWidthPx * 0.75} 242 M ${75 + gpuWidthPx * 0.75 - 13} 229 L ${75 + gpuWidthPx * 0.75 + 13} 229`} stroke="rgba(0,0,0,0.03)" strokeWidth="1.5" />
                  </>
                ) : (
                  <circle cx={75 + gpuWidthPx * 0.5} cy="229" r="16" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
                )}

                {/* GPU specs/model label text */}
                <text x="88" y="217" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">
                  {gpu.brand || 'GPU'}: {gpu.name?.substring(0, 18)}
                </text>
                
                <text x="88" y="247" fill="var(--text-secondary)" fontSize="7" fontFamily="monospace">
                  Length: {gpuLengthMM}mm / TDP: {gpu.tdp_wattage}W
                </text>

                {/* PCIe bracket graphic at the rear slot */}
                <rect x="68" y="208" width="7" height="42" rx="1.5" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.5" />

                {/* Collision warnings indicators */}
                {isGpuCollision && (
                  <>
                    {/* Blinking/Glowing border indicator at collision front */}
                    <line x1={75 + gpuWidthPx} y1="202" x2={75 + gpuWidthPx} y2="256" stroke="#ef4444" strokeWidth="3" filter="url(#glow-red)" />
                    
                    {/* Collision Text */}
                    <g transform={`translate(${75 + gpuWidthPx - 10}, 185)`} filter="url(#glow-red)">
                      <rect x="-85" y="-12" width="95" height="17" rx="3" fill="#ef4444" />
                      <text x="-37" y="0" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                        ⚠️ COLLISION!
                      </text>
                    </g>
                  </>
                )}
              </>
            ) : (
              // Empty GPU slot representation
              <g opacity="0.4">
                <rect 
                  x="75" 
                  y="202" 
                  width="200" 
                  height="54" 
                  rx="6" 
                  fill="none" 
                  stroke="rgba(0,0,0,0.15)" 
                  strokeWidth="1" 
                  strokeDasharray="3 3" 
                />
                <text x="175" y="234" fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  PCIe GRAPHICS CARD (GPU)
                </text>
              </g>
            )}
          </g>

          {/* 7. TEMPERED GLASS PANEL (OVERLAY) */}
          {casePart?.side_panel?.toLowerCase() === 'tempered glass' && (
            <g pointerEvents="none">
              {/* Glass sheen reflection */}
              <rect x="35" y="35" width="430" height="450" rx="12" fill="url(#glass-reflection)" />
              
              {/* Subtle blue dashed outline for glass pane */}
              <rect x="35" y="35" width="430" height="450" rx="12" fill="none" stroke="rgba(79, 70, 229, 0.15)" strokeWidth="1" strokeDasharray="3 6" />

              {/* Four metallic corner mounting screws */}
              <circle cx="45" cy="45" r="4.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
              <circle cx="455" cy="45" r="4.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
              <circle cx="45" cy="475" r="4.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
              <circle cx="455" cy="475" r="4.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
              
              <text x="445" y="465" fill="rgba(79, 70, 229, 0.25)" fontSize="7" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">
                TEMPERED GLASS PANEL
              </text>
            </g>
          )}
        </svg>

        {/* Blueprint legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', fontSize: '0.75rem', borderTop: '1px solid var(--panel-border)', paddingTop: '0.75rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }}></span> Case
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}></span> Mobo
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> CPU
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'linear-gradient(to right, #ec4899, #6366f1)' }}></span> RAM
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }}></span> GPU
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></span> PSU
          </span>
        </div>
      </div>
    );
  };

  const renderPriceChart = (points) => {
    if (!points || points.length === 0) return null;
    
    const width = 500;
    const height = 180;
    const paddingLeft = 45;
    const paddingRight = 15;
    const paddingTop = 25;
    const paddingBottom = 25;
    
    const prices = points.map(p => p.price);
    const minPrice = Math.min(...prices) * 0.98;
    const maxPrice = Math.max(...prices) * 1.02;
    const priceDiff = maxPrice - minPrice || 1;

    const getX = (index) => paddingLeft + (index / (points.length - 1)) * (width - paddingLeft - paddingRight);
    const getY = (price) => paddingTop + ((maxPrice - price) / priceDiff) * (height - paddingTop - paddingBottom);

    // Compute path points
    let pathD = `M ${getX(0)} ${getY(points[0].price)}`;
    let areaD = `M ${getX(0)} ${height - paddingBottom} L ${getX(0)} ${getY(points[0].price)}`;

    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${getX(i)} ${getY(points[i].price)}`;
      areaD += ` L ${getX(i)} ${getY(points[i].price)}`;
    }
    
    areaD += ` L ${getX(points.length - 1)} ${height - paddingBottom} Z`;

    // 3 Grid Lines (Y-Axis)
    const gridYValues = [minPrice, (minPrice + maxPrice) / 2, maxPrice];
    
    // X-Axis Labels (start, middle, end)
    const labelIndices = [0, Math.floor(points.length / 2), points.length - 1];

    const handleMouseMove = (e) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      
      // Map mouseX to the nearest point index
      const chartWidth = width - paddingLeft - paddingRight;
      const pct = (mouseX - paddingLeft) / chartWidth;
      let idx = Math.round(pct * (points.length - 1));
      idx = Math.max(0, Math.min(points.length - 1, idx));
      setHoveredPointIndex(idx);
    };

    const handleMouseLeave = () => {
      setHoveredPointIndex(null);
    };

    const activeHoveredPoint = hoveredPointIndex !== null ? points[hoveredPointIndex] : null;

    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          width="100%" 
          height="180" 
          style={{ overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
            </linearGradient>
            <filter id="neonShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Y-Axis Grid Lines & Labels */}
          {gridYValues.map((val, idx) => (
            <g key={idx}>
              <line 
                x1={paddingLeft} 
                y1={getY(val)} 
                x2={width - paddingRight} 
                y2={getY(val)} 
                stroke="rgba(0, 0, 0, 0.06)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={paddingLeft - 8} 
                y={getY(val) + 4} 
                fill="var(--text-muted)" 
                fontSize="9" 
                textAnchor="end"
                fontFamily="Inter, sans-serif"
              >
                ${val.toFixed(0)}
              </text>
            </g>
          ))}

          {/* X-Axis labels */}
          {labelIndices.map((idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 6}
              fill="var(--text-muted)"
              fontSize="9"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
            >
              {points[idx].date}
            </text>
          ))}

          {/* Glowing Area Fill */}
          <path d={areaD} fill="url(#chartGlow)" />

          {/* Main Price Trend Line */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="var(--accent)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Start and End boundary dots */}
          <circle cx={getX(0)} cy={getY(points[0].price)} r="3.5" fill="#fff" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx={getX(points.length - 1)} cy={getY(points[points.length - 1].price)} r="3.5" fill="#fff" stroke="var(--accent)" strokeWidth="1.5" />

          {/* Interactive Hover Elements */}
          {activeHoveredPoint && (
            <g>
              {/* Vertical Crosshair Line */}
              <line 
                x1={getX(hoveredPointIndex)} 
                y1={paddingTop} 
                x2={getX(hoveredPointIndex)} 
                y2={height - paddingBottom} 
                stroke="rgba(79, 70, 229, 0.4)" 
                strokeWidth="1.5" 
                strokeDasharray="3 3"
              />
              
              {/* Pulsing Outer Circle */}
              <circle 
                cx={getX(hoveredPointIndex)} 
                cy={getY(activeHoveredPoint.price)} 
                r="7" 
                fill="rgba(79, 70, 229, 0.25)" 
              />
              
              {/* Inner Circle */}
              <circle 
                cx={getX(hoveredPointIndex)} 
                cy={getY(activeHoveredPoint.price)} 
                r="4" 
                fill="#fff" 
                stroke="var(--accent)" 
                strokeWidth="2" 
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeHoveredPoint && (
          <div style={{
            position: 'absolute',
            top: `${getY(activeHoveredPoint.price) - 45}px`,
            left: `${Math.max(paddingLeft, Math.min(width - paddingRight - 85, getX(hoveredPointIndex) - 40))}px`,
            background: '#ffffff',
            border: '1px solid var(--panel-border)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            color: 'var(--text-primary)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontFamily: 'Inter, sans-serif'
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '9px', fontWeight: 600 }}>{activeHoveredPoint.date}</span>
            <span style={{ color: 'var(--success)', fontWeight: 700 }}>${activeHoveredPoint.price.toFixed(2)}</span>
          </div>
        )}
      </div>
    );
  };

  const renderAnalyticsDashboard = () => {
    if (loadingAnalytics) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 0', gap: '1rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading creator analytics...</span>
        </div>
      );
    }

    if (!analyticsData) {
      return (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>No Referral Data Available</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Share your custom system rigs! Once other users click on the Amazon affiliate links in your shared rigs, your earnings statistics will populate here.
          </p>
        </div>
      );
    }

    const { total_clicks, total_commission, conversion_rate, top_parts, earnings_chart_points } = analyticsData;

    const renderCommissionsChart = () => {
      if (!earnings_chart_points || earnings_chart_points.length === 0) return null;
      
      const width = 600;
      const height = 180;
      const paddingLeft = 45;
      const paddingRight = 15;
      const paddingTop = 25;
      const paddingBottom = 25;
      
      const earnings = earnings_chart_points.map(p => p.earnings);
      const minVal = 0;
      const maxVal = Math.max(...earnings) > 0 ? Math.max(...earnings) * 1.15 : 10;
      const diffVal = maxVal - minVal;

      const getX = (index) => paddingLeft + (index / (earnings_chart_points.length - 1)) * (width - paddingLeft - paddingRight);
      const getY = (val) => paddingTop + ((maxVal - val) / diffVal) * (height - paddingTop - paddingBottom);

      let pathD = `M ${getX(0)} ${getY(earnings_chart_points[0].earnings)}`;
      let areaD = `M ${getX(0)} ${height - paddingBottom} L ${getX(0)} ${getY(earnings_chart_points[0].earnings)}`;

      for (let i = 1; i < earnings_chart_points.length; i++) {
        pathD += ` L ${getX(i)} ${getY(earnings_chart_points[i].earnings)}`;
        areaD += ` L ${getX(i)} ${getY(earnings_chart_points[i].earnings)}`;
      }
      
      areaD += ` L ${getX(earnings_chart_points.length - 1)} ${height - paddingBottom} Z`;

      const gridYValues = [0, maxVal / 2, maxVal];
      const labelIndices = [0, Math.floor(earnings_chart_points.length / 2), earnings_chart_points.length - 1];

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="180" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="commGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <filter id="greenNeonShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {gridYValues.map((val, idx) => (
            <g key={idx}>
              <line 
                x1={paddingLeft} 
                y1={getY(val)} 
                x2={width - paddingRight} 
                y2={getY(val)} 
                stroke="rgba(0, 0, 0, 0.06)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={paddingLeft - 8} 
                y={getY(val) + 4} 
                fill="var(--text-muted)" 
                fontSize="9" 
                textAnchor="end"
                fontFamily="Inter, sans-serif"
              >
                ${val.toFixed(2)}
              </text>
            </g>
          ))}

          {/* X Labels */}
          {labelIndices.map((idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 6}
              fill="var(--text-muted)"
              fontSize="9"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
            >
              {earnings_chart_points[idx].date}
            </text>
          ))}

          <path d={areaD} fill="url(#commGlow)" />
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          
          <circle cx={getX(0)} cy={getY(earnings_chart_points[0].earnings)} r="3" fill="#fff" stroke="#10b981" strokeWidth="1.5" />
          <circle cx={getX(earnings_chart_points.length - 1)} cy={getY(earnings_chart_points[earnings_chart_points.length - 1].earnings)} r="3" fill="#fff" stroke="#10b981" strokeWidth="1.5" />
        </svg>
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Intro Banner */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              Rigsmith Creator Dashboard
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
              Monitor commission referrals generated from Amazon affiliate clicks on your custom configurations.
            </p>
          </div>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={fetchAnalytics}>
            🔄 Refresh Stats
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Commission Referred</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>${total_commission.toFixed(2)}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--success)' }}>💸 2% Fixed rate applied</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid var(--accent)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Referred Clicks</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{total_clicks}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Clicks across shared build links</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Est. Conversion Rate</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{conversion_rate.toFixed(1)}%</span>
            <span style={{ fontSize: '0.78rem', color: '#f59e0b' }}>Simulated target conversion</span>
          </div>
        </div>

        {/* Charts & Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>
              30-Day Referral Performance
            </h3>
            <div style={{ background: '#f8fafc', border: '1px solid var(--panel-border)', borderRadius: '12px', padding: '1.25rem 1rem 0.5rem 0.5rem', width: '100%' }}>
              {renderCommissionsChart()}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>
              Top Referral Components
            </h3>
            
            {top_parts.length === 0 ? (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No component referrals logged yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-muted)' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0.25rem', fontWeight: 600 }}>Component Name</th>
                    <th style={{ textAlign: 'center', padding: '0.5rem', fontWeight: 600 }}>Clicks</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0.25rem', fontWeight: 600 }}>Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {top_parts.map((part, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--panel-border)' }}>
                      <td style={{ padding: '0.75rem 0.25rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', marginRight: '6px' }}>{part.part_type}</span>
                        {part.part_name}
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--text-secondary)' }}>{part.click_count}</td>
                      <td style={{ textAlign: 'right', padding: '0.75rem 0.25rem', color: 'var(--success)', fontWeight: 600 }}>
                        ${part.earnings.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getBuildPrice = (build) => {
    if (!build) return 0;
    let total = 0;
    if (build.cpu) total += parseFloat(build.cpu.price || 0);
    if (build.motherboard) total += parseFloat(build.motherboard.price || 0);
    if (build.ram) total += parseFloat(build.ram.price || 0);
    if (build.gpu) total += parseFloat(build.gpu.price || 0);
    if (build.powersupply) total += parseFloat(build.powersupply.price || 0);
    if (build.case) total += parseFloat(build.case.price || 0);
    return parseFloat(total.toFixed(2));
  };

  const getBuildFpsEstimate = (build, resolution) => {
    const gpu = build?.gpu;
    if (!gpu) return 0;
    
    let base = 60;
    const name = gpu.name.toLowerCase();
    if (name.includes("4090")) {
      base = resolution === '1080p' ? 240 : resolution === '1440p' ? 210 : 125;
    } else if (name.includes("4080")) {
      base = resolution === '1080p' ? 210 : resolution === '1440p' ? 175 : 95;
    } else if (name.includes("4070")) {
      base = resolution === '1080p' ? 170 : resolution === '1440p' ? 130 : 65;
    } else if (name.includes("7900")) {
      base = resolution === '1080p' ? 220 : resolution === '1440p' ? 180 : 100;
    } else if (name.includes("7800")) {
      base = resolution === '1080p' ? 160 : resolution === '1440p' ? 120 : 55;
    } else if (name.includes("4060")) {
      base = resolution === '1080p' ? 115 : resolution === '1440p' ? 80 : 35;
    } else if (name.includes("3060")) {
      base = resolution === '1080p' ? 85 : resolution === '1440p' ? 60 : 25;
    } else if (name.includes("6600")) {
      base = resolution === '1080p' ? 75 : resolution === '1440p' ? 50 : 20;
    }

    let scale = 1.0;
    if (build.cpu) {
      const cpuName = build.cpu.name.toLowerCase();
      if (cpuName.includes("7950x") || cpuName.includes("14900k") || cpuName.includes("7800x3d") || cpuName.includes("9800x3d")) {
        scale = 1.08;
      } else if (cpuName.includes("10400f") || cpuName.includes("11900k")) {
        scale = 0.88;
      }
    }
    return Math.round(base * scale);
  };

  const checkBuildCompatibility = (build) => {
    if (!build) return true;
    const { cpu, motherboard, ram, gpu, powersupply, case: casePart } = build;
    
    // 1. Socket Check
    if (cpu && motherboard && cpu.socket_type !== motherboard.socket_type) return false;
    
    // 2. RAM Check
    if (ram && motherboard && ram.ram_type !== motherboard.ram_type) return false;
    
    // 3. Wattage Check
    if (powersupply) {
      const cpuTdp = cpu ? cpu.tdp_wattage : 0;
      const gpuTdp = gpu ? gpu.tdp_wattage : 0;
      const totalTdp = cpuTdp + gpuTdp + 100;
      if (totalTdp > powersupply.wattage) return false;
    }
    
    // 4. Case Mobo Size Check
    if (casePart && motherboard) {
      const supported = casePart.motherboard_support.split(',').map(s => s.trim().toLowerCase());
      if (!supported.includes(motherboard.form_factor.toLowerCase())) return false;
    }
    
    // 5. Case GPU Clearance Check
    if (casePart && gpu) {
      const gpuLen = gpu.gpu_length_mm || 280;
      if (gpuLen > casePart.max_gpu_length_mm) return false;
    }
    
    return true;
  };

  const renderCompareDashboard = () => {
    const allBuilds = [];
    const seenIds = new Set();
    [...savedBuilds, ...showcaseBuilds].forEach(b => {
      if (b && b.id && !seenIds.has(b.id)) {
        seenIds.add(b.id);
        allBuilds.push(b);
      }
    });

    const rigs = [compareRig1, compareRig2, compareRig3];
    const setRigs = [setCompareRig1, setCompareRig2, setCompareRig3];

    const validPrices = rigs
      .map((r, i) => r ? { price: getBuildPrice(r), index: i } : null)
      .filter(x => x !== null);
      
    let bestValueIndex = -1;
    if (validPrices.length > 1) {
      let minPrice = Infinity;
      validPrices.forEach(p => {
        if (p.price < minPrice) {
          minPrice = p.price;
          bestValueIndex = p.index;
        }
      });
    }

    return (
      <div className="compare-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Rig Comparison Board
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Select up to three saved or community configurations side-by-side to compare gaming performance, budget metrics, and component specs.
          </p>
        </div>

        <div className="compare-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {rigs.map((rig, colIdx) => {
            const setRig = setRigs[colIdx];
            const isBestValue = bestValueIndex === colIdx;

            return (
              <div 
                key={colIdx} 
                className="glass-panel compare-column" 
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.5rem',
                  border: isBestValue ? '2px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--panel-border)',
                  boxShadow: isBestValue ? '0 0 15px rgba(16, 185, 129, 0.15)' : 'none',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                {isBestValue && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                  }}>
                    🌟 Best Value
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Compare Rig #{colIdx + 1}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select 
                      className="modal-search" 
                      style={{ flexGrow: 1, padding: '0.55rem 0.75rem', margin: 0, fontSize: '0.88rem', background: '#f1f5f9', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                      value={rig ? rig.id : ''}
                      onChange={(e) => {
                        const selected = allBuilds.find(b => b.id === parseInt(e.target.value));
                        setRig(selected || null);
                      }}
                    >
                      <option value="">-- Select Config --</option>
                      {allBuilds.map(b => (
                        <option key={b.id} value={b.id}>{b.name} (${getBuildPrice(b)})</option>
                      ))}
                    </select>
                    {rig && (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', height: '35px', cursor: 'pointer' }}
                        onClick={() => setRig(null)}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {rig ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{rig.name}</h3>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
                        ${getBuildPrice(rig)}
                      </div>
                      {bestValueIndex !== -1 && !isBestValue && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          +${(getBuildPrice(rig) - getBuildPrice(rigs[bestValueIndex])).toFixed(2)} price difference
                        </div>
                      )}
                      {isBestValue && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: '0.25rem', fontWeight: 600 }}>
                          Save money with this configuration!
                        </div>
                      )}
                    </div>

                    <div style={{
                      background: checkBuildCompatibility(rig) ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: checkBuildCompatibility(rig) ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(239, 68, 68, 0.15)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: checkBuildCompatibility(rig) ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {checkBuildCompatibility(rig) ? '✓ System Fully Compatible' : '⚠️ Compatibility Warnings Found'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gaming FPS Performance</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>1080p Resolution</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{getBuildFpsEstimate(rig, '1080p')} FPS</span>
                        </div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (getBuildFpsEstimate(rig, '1080p') / 240) * 100)}%`, background: 'var(--accent)', borderRadius: '3px' }}></div>
                        </div>
                      </div>
 
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>1440p Resolution</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{getBuildFpsEstimate(rig, '1440p')} FPS</span>
                        </div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (getBuildFpsEstimate(rig, '1440p') / 240) * 100)}%`, background: 'var(--accent)', borderRadius: '3px' }}></div>
                        </div>
                      </div>
 
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>4K Ultra HD</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{getBuildFpsEstimate(rig, '4k')} FPS</span>
                        </div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (getBuildFpsEstimate(rig, '4k') / 240) * 100)}%`, background: 'var(--accent)', borderRadius: '3px' }}></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--panel-border)', paddingTop: '1rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Component Specifications</h4>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>CPU:</span>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '200px' }}>
                          {rig.cpu ? `${rig.cpu.brand} ${rig.cpu.name} (${rig.cpu.core_count || 8}C)` : 'Not selected'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Motherboard:</span>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '200px' }}>
                          {rig.motherboard ? `${rig.motherboard.name} (${rig.motherboard.form_factor}, ${rig.motherboard.memory_slots || 4} slots)` : 'Not selected'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Memory (RAM):</span>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>
                          {rig.ram ? `${rig.ram.capacity_gb}GB ${rig.ram.ram_type}` : 'Not selected'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Graphics (GPU):</span>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '200px' }}>
                          {rig.gpu ? rig.gpu.name : 'Not selected'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Power Supply:</span>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>
                          {rig.powersupply ? `${rig.powersupply.wattage}W` : 'Not selected'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Chassis Case:</span>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '200px' }}>
                          {rig.case ? `${rig.case.brand} ${rig.case.name} (${rig.case.color || 'Black'}, ${rig.case.side_panel || 'Tempered Glass'})` : 'Not selected'}
                        </span>
                      </div>
                    </div>

                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', marginTop: '0.5rem', cursor: 'pointer' }}
                      onClick={() => {
                        loadBuild(rig);
                        setActiveTab('builder');
                      }}
                    >
                      🖥️ Load into Builder Workstation
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                    <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚖️</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No config selected</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="logo-section">
            <h1>
            <span>RIGSMITH</span>
            <span className="badge-mvp">MVP</span>
          </h1>
          <p>Enforce strict physical & electrical rules for your custom PC build</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="user-welcome" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Hello, <strong style={{ color: 'var(--accent)' }}>{user.username}</strong>
                {isPro && (
                  <span style={{
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)',
                    color: '#000',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    PRO
                  </span>
                )}
              </span>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={logoutUser}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isPro && (
                <span style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)',
                  color: '#000',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  GUEST PRO
                </span>
              )}
              <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => { setAuthError(null); setAuthModalOpen(true); setAuthMode('login'); }}>
                Sign In / Register
              </button>
            </div>
          )}
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={clearBuild}>Reset Workstation</button>
        </div>
      </header>
 
      {/* Navigation Tabs */}
      <div className="nav-tabs-container">
        <button 
          className={`nav-tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('builder')}
        >
          PC Builder Workstation
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'showcase' ? 'active' : ''}`}
          onClick={() => setActiveTab('showcase')}
        >
          Community Showcase
          <span className="tab-badge">
            {showcaseBuilds.length}
          </span>
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          Compare Rigs
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => {
            if (!isPro) {
              setProModalOpen(true);
            } else {
              setActiveTab('analytics');
            }
          }}
        >
          Creator Analytics
          {!isPro && (
            <span className="tab-pro-badge">PRO</span>
          )}
        </button>
      </div>

      {/* Main Dashboard Layout */}
      {activeTab === 'builder' ? (
        <div className="dashboard-grid">
          {/* Left Workspace */}
          <div className="workspace-section">
            
            {/* Build Name & Action Bar */}
            <div className="glass-panel">
              <div className="build-actions-bar">
                <div className="build-name-input-wrapper">
                <input
                  type="text"
                  placeholder="Enter custom rig name..."
                  className="build-name-input"
                  value={draftBuild.name}
                  onChange={(e) => setDraftBuild({ ...draftBuild, name: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="total-price-badge">
                  <span className="price-label">EST. COST</span>
                  <span className="price-value">${totalPrice.toFixed(2)}</span>
                </div>
                {totalPrice > 0 && (
                  <button 
                    className="btn btn-gold"
                    style={{ padding: '0.85rem 1.25rem' }} 
                    onClick={() => {
                      const allPartsSelected = draftBuild.cpu && draftBuild.motherboard && draftBuild.ram && draftBuild.gpu && draftBuild.powersupply && draftBuild.case;
                      if (!allPartsSelected) {
                        alert("For the complete setup checkout, please select components for all 6 slots!");
                      } else {
                        const amazonUrls = [
                          draftBuild.cpu?.affiliate_url,
                          draftBuild.motherboard?.affiliate_url,
                          draftBuild.ram?.affiliate_url,
                          draftBuild.gpu?.affiliate_url,
                          draftBuild.powersupply?.affiliate_url,
                          draftBuild.case?.affiliate_url
                        ].filter(Boolean);
                        if (draftBuild.id) {
                          if (draftBuild.cpu) trackAffiliateClick(draftBuild.id, 'cpu', draftBuild.cpu.id);
                          if (draftBuild.motherboard) trackAffiliateClick(draftBuild.id, 'motherboard', draftBuild.motherboard.id);
                          if (draftBuild.ram) trackAffiliateClick(draftBuild.id, 'ram', draftBuild.ram.id);
                          if (draftBuild.gpu) trackAffiliateClick(draftBuild.id, 'gpu', draftBuild.gpu.id);
                          if (draftBuild.powersupply) trackAffiliateClick(draftBuild.id, 'powersupply', draftBuild.powersupply.id);
                          if (draftBuild.case) trackAffiliateClick(draftBuild.id, 'case', draftBuild.case.id);
                        }
                        alert(`Proceeding to buy all 6 parts on Amazon! (Simulating bundle checkout with ${amazonUrls.length} affiliate links)`);
                        window.open(amazonUrls[0], '_blank');
                      }
                    }}
                  >
                    Buy Bundle
                  </button>
                )}
                <button className="btn btn-primary" onClick={async () => {
                  const res = await saveBuild();
                  if (res === "LIMIT_REACHED") {
                    setProModalOpen(true);
                  }
                }}>
                  {draftBuild.id ? 'Update Build' : 'Save System Rig'}
                </button>
                <button className="btn btn-secondary" onClick={handleShareClick}>
                  Share Rig
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ background: 'rgba(0, 229, 255, 0.05)', borderColor: 'rgba(0, 229, 255, 0.15)' }}
                  onClick={() => {
                    if (!isPro) {
                      setProModalOpen(true);
                    } else {
                      window.print();
                    }
                  }}
                >
                  📄 Export PDF Spec Sheet
                </button>
              </div>
            </div>

            {/* Save Status / API Validation Errors */}
            {saveSuccess && (
              <div className="form-alert success">
                <CheckIcon /> Build saved successfully to catalog!
              </div>
            )}
            {Object.keys(backendErrors).length > 0 && (
              <div className="form-alert error">
                <CrossIcon /> 
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong>Failed to save:</strong>
                  {Object.entries(backendErrors).map(([field, msgs]) => (
                    <span key={field}>{`${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Smart Budget Assistant */}
          <div className="glass-panel budget-assistant-panel">
            <div className="budget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" style={{ color: 'var(--warning)' }}>
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Budget Assistant</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Target Budget:</span>
                <input 
                  type="number" 
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Math.max(0, parseInt(e.target.value) || 0))}
                  style={{
                    width: '90px',
                    padding: '0.35rem 0.5rem',
                    background: '#ffffff',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    fontWeight: 600
                  }}
                />
              </div>
            </div>

            {/* Budget Slider */}
            <div style={{ marginBottom: '1.25rem' }}>
              <input 
                type="range" 
                min="400" 
                max="4000" 
                step="50"
                value={targetBudget} 
                onChange={(e) => setTargetBudget(parseInt(e.target.value))}
                className="budget-slider"
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Budget Meter (Progress bar) */}
            {targetBudget > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current Cost: ${totalPrice.toFixed(2)}</span>
                  {totalPrice <= targetBudget ? (
                    <span style={{ color: 'var(--success)' }}>
                      💰 ${(targetBudget - totalPrice).toFixed(2)} remaining ({((totalPrice / targetBudget) * 100).toFixed(0)}% used)
                    </span>
                  ) : (
                    <span style={{ color: 'var(--error)', fontWeight: 600 }}>
                      🚨 Over budget by ${(totalPrice - targetBudget).toFixed(2)} ({((totalPrice / targetBudget) * 100).toFixed(0)}% used)
                    </span>
                  )}
                </div>
                <div style={{ width: '100%', height: '10px', background: '#e4e4e7', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
                  <div 
                    style={{
                      width: `${Math.min(100, (totalPrice / targetBudget) * 100)}%`,
                      height: '100%',
                      background: totalPrice <= targetBudget 
                        ? 'linear-gradient(90deg, #6366f1, #10b981)' 
                        : 'linear-gradient(90deg, #f59e0b, #f43f5e)',
                      borderRadius: '5px',
                      transition: 'width 0.3s ease-out',
                      boxShadow: totalPrice <= targetBudget
                        ? '0 0 10px rgba(16, 185, 129, 0.4)'
                        : '0 0 10px rgba(244, 63, 94, 0.4)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Quick Presets */}
            <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                Quick load rig templates
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flexGrow: 1 }}
                  onClick={() => loadPresetTemplate('budget')}
                >
                  Value Rig (~$500)
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flexGrow: 1 }}
                  onClick={() => loadPresetTemplate('mid')}
                >
                  Sweet Spot (~$1300)
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flexGrow: 1 }}
                  onClick={() => loadPresetTemplate('high')}
                >
                  Ultimate Beast (~$3200)
                </button>
              </div>
            </div>
          </div>

          {/* Smart Rig Optimizer */}
          {getSmartSuggestions().length > 0 && (
            <div className="glass-panel optimizer-panel" style={{ marginTop: '0rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" style={{ color: 'var(--primary)' }}>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Smart Rig Optimizer</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {getSmartSuggestions().map((sug, idx) => (
                  <div 
                    key={idx} 
                    className={`optimizer-card ${sug.type}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#f8fafc',
                      border: '1px solid var(--panel-border)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      borderLeft: sug.type === 'upgrade' 
                        ? '3px solid var(--primary)' 
                        : sug.type === 'downgrade' 
                        ? '3px solid var(--error)' 
                        : '3px solid var(--success)'
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)', flexGrow: 1, marginRight: '1rem', lineHeight: '1.3' }}>
                      {sug.message}
                    </span>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        selectPart(sug.slot, sug.part);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility Engine Summary */}
          <div className="glass-panel compatibility-panel">
            <div className="comp-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Rig Compatibility Analyzer</h3>
              {getCompStatusBadge()}
            </div>
            
            <div className="comp-rules-list">
              {/* Rule 1: Sockets */}
              <div className={getRuleItemClass(compatibility.checks.socket.status)}>
                {getRuleIcon(compatibility.checks.socket.status)}
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>CPU Socket Match</strong>
                  <span>{compatibility.checks.socket.message}</span>
                </div>
              </div>

              {/* Rule 2: RAM Type */}
              <div className={getRuleItemClass(compatibility.checks.ramType.status)}>
                {getRuleIcon(compatibility.checks.ramType.status)}
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>RAM Standard (DDR) Match</strong>
                  <span>{compatibility.checks.ramType.message}</span>
                </div>
              </div>

              {/* Rule 3: PSU Wattage */}
              <div className={getRuleItemClass(compatibility.checks.wattage.status)}>
                {getRuleIcon(compatibility.checks.wattage.status)}
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Wattage Overhead Capacity</strong>
                  <span>{compatibility.checks.wattage.message}</span>
                </div>
              </div>

              {/* Rule 4: Case Motherboard Fit */}
              <div className={getRuleItemClass(compatibility.checks.caseMobo.status)}>
                {getRuleIcon(compatibility.checks.caseMobo.status)}
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Case & Motherboard Form Factor</strong>
                  <span>{compatibility.checks.caseMobo.message}</span>
                </div>
              </div>

              {/* Rule 5: Case GPU Clearance */}
              <div className={getRuleItemClass(compatibility.checks.caseGpu.status)}>
                {getRuleIcon(compatibility.checks.caseGpu.status)}
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>GPU Clearance Space</strong>
                  <span>{compatibility.checks.caseGpu.message}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance & Benchmarks Panel */}
          {draftBuild.gpu && (
            <div className="glass-panel performance-panel" style={{ marginTop: '0rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" style={{ color: 'var(--primary)' }}>
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Performance & Benchmarks</h3>
              </div>

              {/* FPS Gauges */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1, background: '#ffffff', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>1080p Ultra</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success)' }}>
                    {Math.round(getFpsEstimate('1080p'))} FPS
                  </span>
                </div>
                <div style={{ flex: 1, background: '#ffffff', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>1440p Ultra</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#818cf8' }}>
                    {Math.round(getFpsEstimate('1440p'))} FPS
                  </span>
                </div>
                <div style={{ flex: 1, background: '#ffffff', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>4K Ultra</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--warning)' }}>
                    {Math.round(getFpsEstimate('4K'))} FPS
                  </span>
                </div>
              </div>

              {/* Bottleneck Analyzer */}
              {draftBuild.cpu && (
                <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Bottleneck Calculator</span>
                    <span style={{ 
                      fontWeight: 700, 
                      color: getBottleneckAnalysis().type === 'CPU Bottleneck' ? 'var(--error)' : 'var(--success)' 
                    }}>
                      {getBottleneckAnalysis().percentage}% {getBottleneckAnalysis().type}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {getBottleneckAnalysis().message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Price Analytics Panel */}
          {(draftBuild.gpu || draftBuild.cpu) && (
            <div className="glass-panel price-analytics-panel" style={{ marginTop: '0rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" style={{ color: 'var(--success)' }}>
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Interactive Price Analytics</h3>
                </div>
                
                {/* Part selector toggle */}
                {draftBuild.cpu && draftBuild.gpu && (
                  <div style={{ display: 'flex', gap: '0.25rem', background: '#f4f4f5', border: '1px solid var(--panel-border)', padding: '0.2rem', borderRadius: '6px' }}>
                    <button 
                      style={{
                        background: chartPart === 'cpu' ? 'var(--primary)' : 'transparent',
                        border: 'none',
                        color: chartPart === 'cpu' ? '#ffffff' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setChartPart('cpu')}
                    >
                      CPU
                    </button>
                    <button 
                      style={{
                        background: chartPart === 'gpu' ? 'var(--primary)' : 'transparent',
                        border: 'none',
                        color: chartPart === 'gpu' ? '#ffffff' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setChartPart('gpu')}
                    >
                      GPU
                    </button>
                  </div>
                )}
              </div>

              {/* Chart visualization */}
              {(() => {
                const activePart = (chartPart === 'cpu' && draftBuild.cpu) ? draftBuild.cpu : (draftBuild.gpu || draftBuild.cpu);
                if (!activePart) return null;
                const points = generatePricePoints(activePart.price);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      30-Day Trend for <strong>{activePart.brand || ''} {activePart.name}</strong> (Current: <strong style={{ color: 'var(--success)' }}>${activePart.price}</strong>)
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid var(--panel-border)', borderRadius: '12px', padding: '1rem', width: '100%' }}>
                      {renderPriceChart(points)}
                    </div>

                    {/* Price Alert Form */}
                    <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                        🔔 Set Price Drop Notification
                      </div>
                      
                      {alertSuccess ? (
                        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                          ✓ Price drop alert registered for <strong>{alertEmail}</strong> when cost drops below <strong>${alertPrice}</strong>!
                        </div>
                      ) : (
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          if (!isPro) {
                            setProModalOpen(true);
                          } else {
                            try {
                              const headers = { 'Content-Type': 'application/json' };
                              if (token) {
                                headers['Authorization'] = `Token ${token}`;
                              }
                              const partType = activePart === draftBuild.cpu ? 'cpu' : 'gpu';
                              const res = await fetch(`${API_BASE}/price-alerts/`, {
                                method: 'POST',
                                headers,
                                body: JSON.stringify({
                                  email: alertEmail,
                                  target_price: alertPrice,
                                  part_type: partType,
                                  part_id: activePart.id
                                })
                              });
                              if (res.ok) {
                                setAlertSuccess(true);
                              } else {
                                const errData = await res.json();
                                alert(errData.error || 'Failed to register price alert.');
                              }
                            } catch (err) {
                              console.error("Error setting price alert:", err);
                              alert('Connection failed to register price alert.');
                            }
                          }
                        }} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '110px' }}>
                            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Target Price ($)</label>
                            <input 
                              type="number" 
                              className="modal-search" 
                              style={{ width: '100%', padding: '0.55rem 0.75rem', margin: 0, fontSize: '0.85rem' }}
                              value={alertPrice}
                              onChange={(e) => setAlertPrice(e.target.value)}
                              placeholder="e.g. 350"
                              required
                            />
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 2, minWidth: '180px' }}>
                            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</label>
                            <input 
                              type="email" 
                              className="modal-search" 
                              style={{ width: '100%', padding: '0.55rem 0.75rem', margin: 0, fontSize: '0.85rem' }}
                              value={alertEmail}
                              onChange={(e) => setAlertEmail(e.target.value)}
                              placeholder="alert@example.com"
                              required
                            />
                          </div>

                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', height: '37px', display: 'flex', alignItems: 'center' }}
                          >
                            Set Alert
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Slots Cards Grid */}
          {/* Slots Cards Grid split with Visual Blueprint */}
          <div className="builder-workspace-split">
            <div className="builder-workspace-left">
              <div className="slots-grid">
                
                {/* CPU Slot */}
                <div 
                  className={`${getSlotClass('cpu')} ${hoveredSlot === 'cpu' ? 'highlighted' : ''} animate-fade-in-up delay-1`}
                  onMouseEnter={() => setHoveredSlot('cpu')}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {draftBuild.cpu && draftBuild.cpu.image_url ? (
                    <div className="slot-image-container">
                      <img src={draftBuild.cpu.image_url} alt={draftBuild.cpu.name} className="part-thumbnail" />
                    </div>
                  ) : (
                    <div className="slot-icon-container">
                      <CpuIcon />
                    </div>
                  )}
                  <div className="slot-info">
                    <span className="slot-label">CPU (Processor)</span>
                    {draftBuild.cpu ? (
                      <>
                        <span className="slot-part-name">{draftBuild.cpu.brand} {draftBuild.cpu.name}</span>
                        <div className="slot-specs">
                          <span className="spec-badge">Socket: {draftBuild.cpu.socket_type}</span>
                          {draftBuild.cpu.core_count && <span className="spec-badge">Cores: {draftBuild.cpu.core_count}</span>}
                          <span className="spec-badge">TDP: {draftBuild.cpu.tdp_wattage}W</span>
                          <span className="spec-badge price-badge">${draftBuild.cpu.price}</span>
                        </div>
                      </>
                    ) : (
                      <span className="slot-empty">No CPU Selected</span>
                    )}
                  </div>
                  <div className="slot-actions">
                    {draftBuild.cpu ? (
                      <>
                        {draftBuild.cpu.affiliate_url && (
                          <a href={draftBuild.cpu.affiliate_url} target="_blank" rel="noopener noreferrer" className="btn btn-affiliate" onClick={() => {
                            if (draftBuild.id) trackAffiliateClick(draftBuild.id, 'cpu', draftBuild.cpu.id);
                          }}>
                            Buy Part
                          </a>
                        )}
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleOpenSelector('cpu')}>Change</button>
                        <button className="btn-icon btn-icon-danger" onClick={() => removePart('cpu')}><TrashIcon /></button>
                      </>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => handleOpenSelector('cpu')}>+ Select CPU</button>
                    )}
                  </div>
                </div>

                {/* Motherboard Slot */}
                <div 
                  className={`${getSlotClass('motherboard')} ${hoveredSlot === 'motherboard' ? 'highlighted' : ''} animate-fade-in-up delay-2`}
                  onMouseEnter={() => setHoveredSlot('motherboard')}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {draftBuild.motherboard && draftBuild.motherboard.image_url ? (
                    <div className="slot-image-container">
                      <img src={draftBuild.motherboard.image_url} alt={draftBuild.motherboard.name} className="part-thumbnail" />
                    </div>
                  ) : (
                    <div className="slot-icon-container">
                      <MotherboardIcon />
                    </div>
                  )}
                  <div className="slot-info">
                    <span className="slot-label">Motherboard</span>
                    {draftBuild.motherboard ? (
                      <>
                        <span className="slot-part-name">{draftBuild.motherboard.name}</span>
                        <div className="slot-specs">
                          <span className="spec-badge">Socket: {draftBuild.motherboard.socket_type}</span>
                          <span className="spec-badge">RAM support: {draftBuild.motherboard.ram_type}</span>
                          {draftBuild.motherboard.memory_slots && <span className="spec-badge">Slots: {draftBuild.motherboard.memory_slots} Slots</span>}
                          <span className="spec-badge">Form Factor: {draftBuild.motherboard.form_factor}</span>
                          <span className="spec-badge price-badge">${draftBuild.motherboard.price}</span>
                        </div>
                      </>
                    ) : (
                      <span className="slot-empty">No Motherboard Selected</span>
                    )}
                  </div>
                  <div className="slot-actions">
                    {draftBuild.motherboard ? (
                      <>
                        {draftBuild.motherboard.affiliate_url && (
                          <a href={draftBuild.motherboard.affiliate_url} target="_blank" rel="noopener noreferrer" className="btn btn-affiliate" onClick={() => {
                            if (draftBuild.id) trackAffiliateClick(draftBuild.id, 'motherboard', draftBuild.motherboard.id);
                          }}>
                            Buy Part
                          </a>
                        )}
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleOpenSelector('motherboard')}>Change</button>
                        <button className="btn-icon btn-icon-danger" onClick={() => removePart('motherboard')}><TrashIcon /></button>
                      </>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => handleOpenSelector('motherboard')}>+ Select Motherboard</button>
                    )}
                  </div>
                </div>

                {/* RAM Slot */}
                <div 
                  className={`${getSlotClass('ram')} ${hoveredSlot === 'ram' ? 'highlighted' : ''} animate-fade-in-up delay-3`}
                  onMouseEnter={() => setHoveredSlot('ram')}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {draftBuild.ram && draftBuild.ram.image_url ? (
                    <div className="slot-image-container">
                      <img src={draftBuild.ram.image_url} alt={draftBuild.ram.name} className="part-thumbnail" />
                    </div>
                  ) : (
                    <div className="slot-icon-container">
                      <RamIcon />
                    </div>
                  )}
                  <div className="slot-info">
                    <span className="slot-label">RAM (Memory)</span>
                    {draftBuild.ram ? (
                      <>
                        <span className="slot-part-name">{draftBuild.ram.name}</span>
                        <div className="slot-specs">
                          <span className="spec-badge">RAM Type: {draftBuild.ram.ram_type}</span>
                          <span className="spec-badge">Capacity: {draftBuild.ram.capacity_gb} GB</span>
                          <span className="spec-badge price-badge">${draftBuild.ram.price}</span>
                        </div>
                      </>
                    ) : (
                      <span className="slot-empty">No RAM Selected</span>
                    )}
                  </div>
                  <div className="slot-actions">
                    {draftBuild.ram ? (
                      <>
                        {draftBuild.ram.affiliate_url && (
                          <a href={draftBuild.ram.affiliate_url} target="_blank" rel="noopener noreferrer" className="btn btn-affiliate" onClick={() => {
                            if (draftBuild.id) trackAffiliateClick(draftBuild.id, 'ram', draftBuild.ram.id);
                          }}>
                            Buy Part
                          </a>
                        )}
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleOpenSelector('ram')}>Change</button>
                        <button className="btn-icon btn-icon-danger" onClick={() => removePart('ram')}><TrashIcon /></button>
                      </>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => handleOpenSelector('ram')}>+ Select RAM</button>
                    )}
                  </div>
                </div>

                {/* GPU Slot */}
                <div 
                  className={`${getSlotClass('gpu')} ${hoveredSlot === 'gpu' ? 'highlighted' : ''} animate-fade-in-up delay-4`}
                  onMouseEnter={() => setHoveredSlot('gpu')}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {draftBuild.gpu && draftBuild.gpu.image_url ? (
                    <div className="slot-image-container">
                      <img src={draftBuild.gpu.image_url} alt={draftBuild.gpu.name} className="part-thumbnail" />
                    </div>
                  ) : (
                    <div className="slot-icon-container">
                      <GpuIcon />
                    </div>
                  )}
                  <div className="slot-info">
                    <span className="slot-label">Graphics Card (GPU)</span>
                    {draftBuild.gpu ? (
                      <>
                        <span className="slot-part-name">{draftBuild.gpu.name}</span>
                        <div className="slot-specs">
                          <span className="spec-badge">TDP: {draftBuild.gpu.tdp_wattage}W</span>
                          <span className="spec-badge">Recommended PSU: {draftBuild.gpu.recommended_psu_wattage}W</span>
                          <span className="spec-badge price-badge">${draftBuild.gpu.price}</span>
                        </div>
                      </>
                    ) : (
                      <span className="slot-empty">No GPU Selected</span>
                    )}
                  </div>
                  <div className="slot-actions">
                    {draftBuild.gpu ? (
                      <>
                        {draftBuild.gpu.affiliate_url && (
                          <a href={draftBuild.gpu.affiliate_url} target="_blank" rel="noopener noreferrer" className="btn btn-affiliate" onClick={() => {
                            if (draftBuild.id) trackAffiliateClick(draftBuild.id, 'gpu', draftBuild.gpu.id);
                          }}>
                            Buy Part
                          </a>
                        )}
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleOpenSelector('gpu')}>Change</button>
                        <button className="btn-icon btn-icon-danger" onClick={() => removePart('gpu')}><TrashIcon /></button>
                      </>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => handleOpenSelector('gpu')}>+ Select GPU</button>
                    )}
                  </div>
                </div>

                {/* PSU Slot */}
                <div 
                  className={`${getSlotClass('powersupply')} ${hoveredSlot === 'powersupply' ? 'highlighted' : ''} animate-fade-in-up delay-5`}
                  onMouseEnter={() => setHoveredSlot('powersupply')}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {draftBuild.powersupply && draftBuild.powersupply.image_url ? (
                    <div className="slot-image-container">
                      <img src={draftBuild.powersupply.image_url} alt={draftBuild.powersupply.name} className="part-thumbnail" />
                    </div>
                  ) : (
                    <div className="slot-icon-container">
                      <PsuIcon />
                    </div>
                  )}
                  <div className="slot-info">
                    <span className="slot-label">Power Supply Unit (PSU)</span>
                    {draftBuild.powersupply ? (
                      <>
                        <span className="slot-part-name">{draftBuild.powersupply.name}</span>
                        <div className="slot-specs">
                          <span className="spec-badge">Output: {draftBuild.powersupply.wattage}W</span>
                          <span className="spec-badge price-badge">${draftBuild.powersupply.price}</span>
                        </div>
                      </>
                    ) : (
                      <span className="slot-empty">No PSU Selected</span>
                    )}
                  </div>
                  <div className="slot-actions">
                    {draftBuild.powersupply ? (
                      <>
                        {draftBuild.powersupply.affiliate_url && (
                          <a href={draftBuild.powersupply.affiliate_url} target="_blank" rel="noopener noreferrer" className="btn btn-affiliate" onClick={() => {
                            if (draftBuild.id) trackAffiliateClick(draftBuild.id, 'powersupply', draftBuild.powersupply.id);
                          }}>
                            Buy Part
                          </a>
                        )}
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleOpenSelector('powersupply')}>Change</button>
                        <button className="btn-icon btn-icon-danger" onClick={() => removePart('powersupply')}><TrashIcon /></button>
                      </>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => handleOpenSelector('powersupply')}>+ Select PSU</button>
                    )}
                  </div>
                </div>

                {/* Case Slot */}
                <div 
                  className={`${getSlotClass('case')} ${hoveredSlot === 'case' ? 'highlighted' : ''} animate-fade-in-up delay-6`}
                  onMouseEnter={() => setHoveredSlot('case')}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {draftBuild.case && draftBuild.case.image_url ? (
                    <div className="slot-image-container">
                      <img src={draftBuild.case.image_url} alt={draftBuild.case.name} className="part-thumbnail" />
                    </div>
                  ) : (
                    <div className="slot-icon-container">
                      <CaseIcon />
                    </div>
                  )}
                  <div className="slot-info">
                    <span className="slot-label">Chassis Case</span>
                    {draftBuild.case ? (
                      <>
                        <span className="slot-part-name">{draftBuild.case.brand} {draftBuild.case.name}</span>
                        <div className="slot-specs">
                          <span className="spec-badge">Support: {draftBuild.case.motherboard_support}</span>
                          <span className="spec-badge">GPU Clearance: {draftBuild.case.max_gpu_length_mm}mm</span>
                          {draftBuild.case.color && <span className="spec-badge">Color: {draftBuild.case.color}</span>}
                          {draftBuild.case.side_panel && <span className="spec-badge">Panel: {draftBuild.case.side_panel}</span>}
                          <span className="spec-badge price-badge">${draftBuild.case.price}</span>
                        </div>
                      </>
                    ) : (
                      <span className="slot-empty">No Case Selected</span>
                    )}
                  </div>
                  <div className="slot-actions">
                    {draftBuild.case ? (
                      <>
                        {draftBuild.case.affiliate_url && (
                          <a href={draftBuild.case.affiliate_url} target="_blank" rel="noopener noreferrer" className="btn btn-affiliate" onClick={() => {
                            if (draftBuild.id) trackAffiliateClick(draftBuild.id, 'case', draftBuild.case.id);
                          }}>
                            Buy Part
                          </a>
                        )}
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleOpenSelector('case')}>Change</button>
                        <button className="btn-icon btn-icon-danger" onClick={() => removePart('case')}><TrashIcon /></button>
                      </>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => handleOpenSelector('case')}>+ Select Case</button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div className="builder-workspace-right">
              {renderVisualBlueprint()}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Container */}
        <div className="sidebar-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem' }}>
          
          {/* Saved System Rigs List */}
          <div className="glass-panel sidebar-panel" style={{ position: 'relative', top: '0', maxHeight: '380px' }}>
            <h2 className="sidebar-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" style={{ color: 'var(--primary)' }}>
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              Saved System Rigs
            </h2>
            
            {loadingBuilds ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading rigs...</p>
            ) : savedBuilds.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No builds saved yet.</p>
            ) : (
              <div className="builds-list">
                {savedBuilds.map((build) => {
                  const partsCount = [build.cpu, build.motherboard, build.ram, build.gpu, build.powersupply].filter(Boolean).length;
                  return (
                    <div key={build.id} className="build-list-item">
                      <div className="build-item-details">
                        <span className="build-item-name">{build.name}</span>
                        <span className="build-item-parts-count">{partsCount}/5 components selected</span>
                      </div>
                      <div className="build-item-actions">
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => loadBuild(build)}>
                          Load
                        </button>
                        <button className="btn-icon btn-icon-danger" onClick={() => deleteBuild(build.id)}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Prebuilt Systems Suggestion panel */}
          <div className="glass-panel prebuilt-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '480px', overflow: 'hidden' }}>
            <h2 className="sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem', marginBottom: '0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" style={{ color: 'var(--success)' }}>
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                <line x1="6" y1="6" x2="6.01" y2="6"/>
                <line x1="6" y1="18" x2="6.01" y2="18"/>
              </svg>
              Prebuilt Alternatives
            </h2>

            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Prefer a plug-and-play setup? These prebuilts fit your <strong>${targetBudget}</strong> target budget:
            </span>

            {loadingPrebuilts ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading prebuilts...</p>
            ) : (
              <div className="prebuilts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '350px', paddingRight: '0.2rem' }}>
                {prebuilts
                  .filter(pc => parseFloat(pc.price) <= targetBudget + 150)
                  .map(pc => (
                    <div 
                      key={pc.id} 
                      className="prebuilt-card"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--panel-border)',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>{pc.brand} {pc.name}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--success)' }}>${pc.price}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem', borderLeft: '2px solid rgba(255,255,255,0.05)', paddingLeft: '0.5rem' }}>
                        <span>🖥️ <strong>CPU:</strong> {pc.cpu_details}</span>
                        <span>🎮 <strong>GPU:</strong> {pc.gpu_details}</span>
                        <span>⚡ <strong>RAM:</strong> {pc.ram_details}</span>
                      </div>
                      {pc.affiliate_url && (
                        <a 
                          href={pc.affiliate_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-affiliate" 
                          style={{ width: '100%', padding: '0.45rem', fontSize: '0.82rem', marginTop: '0.25rem' }}
                        >
                          Buy Prebuilt PC
                        </a>
                      )}
                    </div>
                  ))
                }
                {prebuilts.filter(pc => parseFloat(pc.price) <= targetBudget + 150).length === 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '1rem' }}>
                    No prebuilts found within this budget.
                  </span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
      ) : activeTab === 'analytics' ? (
        <div className="analytics-dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.4s ease' }}>
          {renderAnalyticsDashboard()}
        </div>
      ) : activeTab === 'compare' ? (
        <div className="compare-dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.4s ease' }}>
          {renderCompareDashboard()}
        </div>
      ) : (
        <div className="community-showcase-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.4s ease' }}>
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              Community Rig Showcase
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Explore custom system configurations published by creators worldwide. Review their compatibility benchmarks, physical clearances, or load them to customize.
            </p>
          </div>

          {loadingShowcase ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', gap: '1rem' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Retrieving builds catalog...</span>
            </div>
          ) : showcaseBuilds.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px dashed var(--panel-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Showcase Feed is Empty</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                Be the first to publish a configuration! Switch to the PC Builder tab, design a custom PC build, and save it.
              </p>
              <button className="btn btn-primary" onClick={() => setActiveTab('builder')}>
                Design PC Rig
              </button>
            </div>
          ) : (
            <div className="showcase-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
              width: '100%'
            }}>
              {showcaseBuilds.map((build, index) => {
                // Calculate total price
                let buildTotal = 0;
                if (build.cpu) buildTotal += parseFloat(build.cpu.price || 0);
                if (build.motherboard) buildTotal += parseFloat(build.motherboard.price || 0);
                if (build.ram) buildTotal += parseFloat(build.ram.price || 0);
                if (build.gpu) buildTotal += parseFloat(build.gpu.price || 0);
                if (build.powersupply) buildTotal += parseFloat(build.powersupply.price || 0);
                if (build.case) buildTotal += parseFloat(build.case.price || 0);
                
                // Owner delete permission
                const isOwner = !build.user || (user && build.user === user.id);
 
                return (
                  <div key={build.id} className={`glass-panel showcase-card animate-fade-in-up delay-${(index % 8) + 1}`} style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    position: 'relative',
                    height: '100%',
                    background: '#ffffff',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflow: 'hidden' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {build.name}
                        </h3>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          👤 Creator: <strong style={{ color: 'var(--primary)' }}>{build.username || 'Guest'}</strong>
                        </span>
                      </div>
                      <div style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        background: 'var(--primary-glow)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(79, 70, 229, 0.15)'
                      }}>
                        ${buildTotal.toFixed(2)}
                      </div>
                    </div>
 
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      background: '#f8fafc',
                      padding: '0.85rem',
                      borderRadius: '10px',
                      border: '1px solid var(--panel-border)',
                      flexGrow: 1
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Processor:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {build.cpu ? `${build.cpu.brand} ${build.cpu.name}` : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Motherboard:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {build.motherboard ? build.motherboard.name : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Memory:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {build.ram ? `${build.ram.name} (${build.ram.capacity_gb}GB)` : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Graphics:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {build.gpu ? build.gpu.name : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Power Supply:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {build.powersupply ? `${build.powersupply.name} (${build.powersupply.wattage}W)` : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Chassis Case:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {build.case ? `${build.case.brand} ${build.case.name}` : '—'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                      <button 
                        className="btn btn-secondary"
                        style={{ flexGrow: 1, padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                        onClick={() => {
                          loadBuild(build);
                          setActiveTab('builder');
                        }}
                      >
                        ⚡ Load in Builder
                      </button>
                      
                      {isOwner && (
                        <button 
                          className="btn btn-secondary"
                          style={{
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                          }}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete build "${build.name}"?`)) {
                              deleteBuild(build.id);
                            }
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* RigSmith Pro Upgrade Modal */}
      {proModalOpen && (
        <div className="modal-overlay" onClick={() => setProModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', border: '1px solid #ffd700' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706' }}>
                ⭐ Upgrade to Rigsmith Pro
              </h3>
              <button className="btn-icon" onClick={() => setProModalOpen(false)}><CloseIcon /></button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem 0 0 0' }}>
              
              {/* Features Comparison */}
              <div style={{ background: 'rgba(255, 215, 0, 0.03)', border: '1px solid rgba(255, 215, 0, 0.1)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Unlock Premium Capabilities
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🚀</span> <strong>Unlimited Build Slots</strong> (Free tier limited to 3 saves)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🏆</span> <strong>Shining Golden PRO Badge</strong> next to your username
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⚡</span> <strong>Priority Compatibility Engine</strong> validation
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📈</span> <strong>Affiliate Sales Analytics</strong> & system pricing trackers
                  </div>
                </div>
              </div>

              {/* Pricing Tag */}
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ANNUAL MEMBERSHIP</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  $19.99<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}> / year</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 500 }}>
                  ✓ 7-Day Money-Back Guarantee
                </span>
              </div>

              {/* Simulated Credit Card Form */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                setPayingPro(true);
                
                // Simulate network latency for payment processor
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                upgradeToPro();
                setPayingPro(false);
                setProModalOpen(false);
                alert("Congratulations! You are now a Rigsmith Pro member! Unlimited build slots unlocked.");
              }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Cardholder Name</label>
                  <input 
                    type="text" 
                    className="modal-search" 
                    style={{ width: '100%', padding: '0.65rem 0.85rem', margin: 0 }}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Card Number</label>
                  <input 
                    type="text" 
                    className="modal-search" 
                    style={{ width: '100%', padding: '0.65rem 0.85rem', margin: 0 }}
                    value={cardNumber}
                    onChange={(e) => {
                      // format card number: groups of 4 digits
                      const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setCardNumber(formatted);
                    }}
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Expiration Date</label>
                    <input 
                      type="text" 
                      className="modal-search" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', margin: 0 }}
                      value={cardExpiry}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                        const formatted = val.length >= 3 ? `${val.substring(0, 2)}/${val.substring(2)}` : val;
                        setCardExpiry(formatted);
                      }}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>CVC / CVV</label>
                    <input 
                      type="password" 
                      className="modal-search" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', margin: 0 }}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn" 
                  disabled={payingPro}
                  style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)',
                    color: '#000',
                    fontWeight: 700,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {payingPro ? (
                    <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderColor: '#000 transparent transparent transparent' }}></div>
                  ) : (
                    '🚀 Activate Rigsmith Pro Account'
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      {authModalOpen && (
        <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{authMode === 'login' ? 'Sign In to Rigsmith' : 'Create an Account'}</h3>
              <button className="btn-icon" onClick={() => setAuthModalOpen(false)}><CloseIcon /></button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              let success = false;
              if (authMode === 'login') {
                success = await loginUser(authUsername, authPassword);
              } else {
                success = await registerUser(authUsername, authEmail, authPassword);
              }
              if (success) {
                setAuthModalOpen(false);
                setAuthUsername('');
                setAuthEmail('');
                setAuthPassword('');
              }
            }} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 0 0 0' }}>
              
              {authError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  {authError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Username</label>
                <input 
                  type="text" 
                  className="modal-search" 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', margin: 0 }}
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="Enter username..."
                  required
                />
              </div>

              {authMode === 'register' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</label>
                  <input 
                    type="email" 
                    className="modal-search" 
                    style={{ width: '100%', padding: '0.65rem 0.85rem', margin: 0 }}
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Enter email address..."
                  />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Password</label>
                <input 
                  type="password" 
                  className="modal-search" 
                  style={{ width: '100%', padding: '0.65rem 0.85rem', margin: 0 }}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter password..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={authLoading}
                style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.65rem' }}
              >
                {authLoading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button 
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'underline' }}
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthError(null);
                  }}
                >
                  {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Component Selector Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Select {getSlotLabel(activeSlot)}</h3>
              <button className="btn-icon" onClick={() => setModalOpen(false)}><CloseIcon /></button>
            </div>
            
            <div className="modal-search-wrapper">
              <input
                type="text"
                placeholder="Search specs, brand or name..."
                className="modal-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            
            {activeSlot === 'cpu' && (
              <div style={{ display: 'flex', gap: '1.25rem', padding: '0.25rem 1.5rem 0.85rem 1.5rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid var(--panel-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Brand:</span>
                  {['All', 'AMD', 'Intel'].map(brand => (
                    <button
                      key={brand}
                      type="button"
                      className={`btn ${filterCpuBrand === brand ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', height: 'auto', border: filterCpuBrand === brand ? '1px solid var(--accent)' : '1px solid var(--panel-border)', cursor: 'pointer' }}
                      onClick={() => setFilterCpuBrand(brand)}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Cores:</span>
                  {['All', '6', '8', '12+'].map(cores => (
                    <button
                      key={cores}
                      type="button"
                      className={`btn ${filterCpuCores === (cores === '12+' ? '12+' : cores) ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', height: 'auto', border: filterCpuCores === (cores === '12+' ? '12+' : cores) ? '1px solid var(--accent)' : '1px solid var(--panel-border)', cursor: 'pointer' }}
                      onClick={() => setFilterCpuCores(cores === '12+' ? '12+' : cores)}
                    >
                      {cores === 'All' ? 'All' : `${cores} Cores`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSlot === 'motherboard' && (
              <div style={{ display: 'flex', gap: '1.25rem', padding: '0.25rem 1.5rem 0.85rem 1.5rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid var(--panel-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>RAM Slots:</span>
                  {['All', '2', '4'].map(slots => (
                    <button
                      key={slots}
                      type="button"
                      className={`btn ${filterMoboSlots === slots ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', height: 'auto', border: filterMoboSlots === slots ? '1px solid var(--accent)' : '1px solid var(--panel-border)', cursor: 'pointer' }}
                      onClick={() => setFilterMoboSlots(slots)}
                    >
                      {slots === 'All' ? 'All' : `${slots} Slots`}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Size:</span>
                  {['All', 'ATX', 'Micro-ATX', 'Mini-ITX'].map(ff => (
                    <button
                      key={ff}
                      type="button"
                      className={`btn ${filterMoboFF === ff ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', height: 'auto', border: filterMoboFF === ff ? '1px solid var(--accent)' : '1px solid var(--panel-border)', cursor: 'pointer' }}
                      onClick={() => setFilterMoboFF(ff)}
                    >
                      {ff}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSlot === 'case' && (
              <div style={{ display: 'flex', gap: '1.25rem', padding: '0.25rem 1.5rem 0.85rem 1.5rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid var(--panel-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Color:</span>
                  {['All', 'Black', 'White', 'Silver'].map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`btn ${filterCaseColor === color ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', height: 'auto', border: filterCaseColor === color ? '1px solid var(--accent)' : '1px solid var(--panel-border)', cursor: 'pointer' }}
                      onClick={() => setFilterCaseColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Panel:</span>
                  {['All', 'Glass', 'Solid'].map(panel => (
                    <button
                      key={panel}
                      type="button"
                      className={`btn ${filterCasePanel === panel ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', height: 'auto', border: filterCasePanel === panel ? '1px solid var(--accent)' : '1px solid var(--panel-border)', cursor: 'pointer' }}
                      onClick={() => setFilterCasePanel(panel)}
                    >
                      {panel === 'Glass' ? 'Tempered Glass' : panel === 'Solid' ? 'Solid Panel' : 'All'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="modal-body">
              {loadingCatalog ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading components...</p>
              ) : filteredParts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No parts matching your search.</p>
              ) : (
                <div className="parts-list-container">
                  {filteredParts.map((part) => (
                    <div key={part.id} className="part-select-card" onClick={() => handleSelect(part)}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {part.image_url && (
                          <div className="part-select-image-container">
                            <img src={part.image_url} alt={part.name} className="part-thumbnail-small" />
                          </div>
                        )}
                        <div className="part-select-info">
                          <span className="part-select-name">
                            {part.brand ? `${part.brand} ` : ''}{part.name}
                          </span>
                          <div className="part-select-specs">
                            {part.socket_type && <span className="spec-badge">Socket: {part.socket_type}</span>}
                            {part.core_count && <span className="spec-badge">Cores: {part.core_count}</span>}
                            {part.memory_slots && <span className="spec-badge">Slots: {part.memory_slots} Slots</span>}
                            {part.color && <span className="spec-badge">Color: {part.color}</span>}
                            {part.side_panel && <span className="spec-badge">Panel: {part.side_panel}</span>}
                            {part.ram_type && <span className="spec-badge">Memory: {part.ram_type}</span>}
                            {part.capacity_gb && <span className="spec-badge">Capacity: {part.capacity_gb}GB</span>}
                            {part.tdp_wattage && <span className="spec-badge">TDP: {part.tdp_wattage}W</span>}
                            {part.recommended_psu_wattage && <span className="spec-badge">Rec PSU: {part.recommended_psu_wattage}W</span>}
                            {part.wattage && <span className="spec-badge">Power: {part.wattage}W</span>}
                            {part.form_factor && <span className="spec-badge">Form Factor: {part.form_factor}</span>}
                            <span className="spec-badge price-badge" style={{ borderColor: 'var(--success-border)', color: 'var(--success)', fontWeight: 600 }}>${part.price}</span>
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="modal-overlay" onClick={() => setShareModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Share Custom System Rig</h3>
              <button className="btn-icon" onClick={() => setShareModalOpen(false)}><CloseIcon /></button>
            </div>
            <div className="modal-body" style={{ gap: '1.25rem' }}>
              
              {/* Permalink */}
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Permalink URL
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    readOnly 
                    value={getShareUrl()} 
                    style={{ flexGrow: 1, padding: '0.6rem 0.85rem', background: '#f1f5f9', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                    onClick={() => {
                      navigator.clipboard.writeText(getShareUrl());
                      setCopiedText('link');
                      setTimeout(() => setCopiedText(''), 2000);
                    }}
                  >
                    {copiedText === 'link' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Reddit Table */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Reddit Markdown Exporter
                  </span>
                  <button 
                    className="btn-icon" 
                    style={{ fontSize: '0.8rem', color: copiedText === 'reddit' ? 'var(--success)' : 'var(--primary)', padding: '0.2rem 0.5rem', background: '#f1f5f9', border: '1px solid var(--panel-border)', borderRadius: '4px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(getRedditMarkdown());
                      setCopiedText('reddit');
                      setTimeout(() => setCopiedText(''), 2000);
                    }}
                  >
                    {copiedText === 'reddit' ? 'Copied Table!' : 'Copy Reddit Code'}
                  </button>
                </div>
                <textarea 
                  readOnly 
                  value={getRedditMarkdown()} 
                  rows="4" 
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: '#f1f5f9', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'monospace', resize: 'none' }}
                />
              </div>

              {/* Discord Text */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Discord Specs List
                  </span>
                  <button 
                    className="btn-icon" 
                    style={{ fontSize: '0.8rem', color: copiedText === 'discord' ? 'var(--success)' : 'var(--primary)', padding: '0.2rem 0.5rem', background: '#f1f5f9', border: '1px solid var(--panel-border)', borderRadius: '4px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(getDiscordMarkdown());
                      setCopiedText('discord');
                      setTimeout(() => setCopiedText(''), 2000);
                    }}
                  >
                    {copiedText === 'discord' ? 'Copied Text!' : 'Copy Discord Code'}
                  </button>
                </div>
                <textarea 
                  readOnly 
                  value={getDiscordMarkdown()} 
                  rows="4" 
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: '#f1f5f9', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'monospace', resize: 'none' }}
                />
              </div>

            </div>
          </div>
        </div>
      )}

    </div>

    {/* Hidden Print Spec Sheet */}
    <div id="printable-spec-sheet" className="print-only-layout">
      <div className="print-header">
        <div>
          <h1 className="print-title">RIGSMITH CUSTOM SPEC SHEET</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#555' }}>Professional PC Build Specification</p>
        </div>
        <div className="print-meta">
          <div><strong>Build Name:</strong> {draftBuild.name || 'Untitled Rig'}</div>
          <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
          <div><strong>Creator:</strong> {user ? user.username : 'Guest Builder'}</div>
        </div>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>Component Type</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Amazon Purchase Link</th>
          </tr>
        </thead>
        <tbody>
          {draftBuild.cpu && (
            <tr>
              <td>CPU</td>
              <td>{draftBuild.cpu.brand} {draftBuild.cpu.name}</td>
              <td>${parseFloat(draftBuild.cpu.price || 0).toFixed(2)}</td>
              <td style={{ wordBreak: 'break-all' }}>{draftBuild.cpu.affiliate_url || 'N/A'}</td>
            </tr>
          )}
          {draftBuild.motherboard && (
            <tr>
              <td>Motherboard</td>
              <td>{draftBuild.motherboard.brand} {draftBuild.motherboard.name}</td>
              <td>${parseFloat(draftBuild.motherboard.price || 0).toFixed(2)}</td>
              <td style={{ wordBreak: 'break-all' }}>{draftBuild.motherboard.affiliate_url || 'N/A'}</td>
            </tr>
          )}
          {draftBuild.ram && (
            <tr>
              <td>RAM</td>
              <td>{draftBuild.ram.brand} {draftBuild.ram.name}</td>
              <td>${parseFloat(draftBuild.ram.price || 0).toFixed(2)}</td>
              <td style={{ wordBreak: 'break-all' }}>{draftBuild.ram.affiliate_url || 'N/A'}</td>
            </tr>
          )}
          {draftBuild.gpu && (
            <tr>
              <td>GPU</td>
              <td>{draftBuild.gpu.brand} {draftBuild.gpu.name}</td>
              <td>${parseFloat(draftBuild.gpu.price || 0).toFixed(2)}</td>
              <td style={{ wordBreak: 'break-all' }}>{draftBuild.gpu.affiliate_url || 'N/A'}</td>
            </tr>
          )}
          {draftBuild.powersupply && (
            <tr>
              <td>Power Supply</td>
              <td>{draftBuild.powersupply.brand} {draftBuild.powersupply.name}</td>
              <td>${parseFloat(draftBuild.powersupply.price || 0).toFixed(2)}</td>
              <td style={{ wordBreak: 'break-all' }}>{draftBuild.powersupply.affiliate_url || 'N/A'}</td>
            </tr>
          )}
          {draftBuild.case && (
            <tr>
              <td>Case</td>
              <td>{draftBuild.case.brand} {draftBuild.case.name}</td>
              <td>${parseFloat(draftBuild.case.price || 0).toFixed(2)}</td>
              <td style={{ wordBreak: 'break-all' }}>{draftBuild.case.affiliate_url || 'N/A'}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="print-summary">
        <div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>Estimated Gaming Performance</h3>
          <table style={{ width: '300px', fontSize: '13px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: 'bold' }}>1080p Target:</td>
                <td style={{ padding: '4px 0', textAlign: 'right' }}>{Math.round(getFpsEstimate('1080p'))} FPS</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: 'bold' }}>1440p Target:</td>
                <td style={{ padding: '4px 0', textAlign: 'right' }}>{Math.round(getFpsEstimate('1440p'))} FPS</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: 'bold' }}>4K Target:</td>
                <td style={{ padding: '4px 0', textAlign: 'right' }}>{Math.round(getFpsEstimate('4K'))} FPS</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="print-total">
          TOTAL COST: ${totalPrice.toFixed(2)}
        </div>
      </div>

      <div className="print-footer">
        <p>Thank you for using RigSmith. This spec sheet serves as an estimate. Prices and availability on affiliate stores are subject to change.</p>
        <p style={{ marginTop: '5px' }}>RigSmith Inc. © {new Date().getFullYear()} - All rights reserved.</p>
      </div>
    </div>
  </>
  );
}

export default App;
