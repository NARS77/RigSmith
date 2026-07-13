import React, { createContext, useState, useEffect } from 'react';

export const BuildContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const BuildProvider = ({ children }) => {
  // Parts catalog from API
  const [catalog, setCatalog] = useState({
    cpus: [],
    motherboards: [],
    rams: [],
    gpus: [],
    powersupplies: [],
    cases: []
  });

  // Loading and error states
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [loadingBuilds, setLoadingBuilds] = useState(true);
  const [showcaseBuilds, setShowcaseBuilds] = useState([]);
  const [loadingShowcase, setLoadingShowcase] = useState(true);

  // Active draft build state
  const [draftBuild, setDraftBuild] = useState({
    id: null,
    name: '',
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    powersupply: null,
    case: null
  });

  // Backend validation errors during save/update
  const [backendErrors, setBackendErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Prebuilt PCs and Target Budget
  const [prebuilts, setPrebuilts] = useState([]);
  const [loadingPrebuilts, setLoadingPrebuilts] = useState(true);
  const [targetBudget, setTargetBudget] = useState(1500);

  // Authentication states
  const [token, setToken] = useState(localStorage.getItem('rig_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('rig_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Pro status state
  const [isPro, setIsPro] = useState(() => {
    const storedUser = localStorage.getItem('rig_user');
    const currentUsername = storedUser ? JSON.parse(storedUser)?.username : null;
    if (currentUsername) {
      return localStorage.getItem(`rig_is_pro_${currentUsername}`) === 'true';
    }
    return localStorage.getItem('rig_is_pro_guest') === 'true';
  });

  const upgradeToPro = async () => {
    setIsPro(true);
    const storedUser = localStorage.getItem('rig_user');
    const currentUsername = storedUser ? JSON.parse(storedUser)?.username : null;
    if (currentUsername) {
      localStorage.setItem(`rig_is_pro_${currentUsername}`, 'true');
    } else {
      localStorage.setItem('rig_is_pro_guest', 'true');
    }

    // Persist to backend database if user is logged in
    const storedToken = localStorage.getItem('rig_token') || token;
    if (storedToken) {
      try {
        await fetch(`${API_BASE}/upgrade/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${storedToken}`
          }
        });
      } catch (err) {
        console.error("Failed to sync Pro status to backend database:", err);
      }
    }
  };

  const loginUser = async (username, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('rig_token', data.token);
        localStorage.setItem('rig_user', JSON.stringify(data.user));
        
        // Sync user-specific Pro status from backend database
        const userIsPro = data.user.is_pro || false;
        setIsPro(userIsPro);
        localStorage.setItem(`rig_is_pro_${data.user.username}`, userIsPro ? 'true' : 'false');

        setAuthLoading(false);
        return true;
      } else {
        setAuthError(data.error || 'Invalid credentials');
        setAuthLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuthError('Connection failed.');
      setAuthLoading(false);
      return false;
    }
  };

  const registerUser = async (username, email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('rig_token', data.token);
        localStorage.setItem('rig_user', JSON.stringify(data.user));
        
        // Sync user-specific Pro status from backend database
        const userIsPro = data.user.is_pro || false;
        setIsPro(userIsPro);
        localStorage.setItem(`rig_is_pro_${data.user.username}`, userIsPro ? 'true' : 'false');

        setAuthLoading(false);
        return true;
      } else {
        setAuthError(data.error || 'Registration failed');
        setAuthLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Registration error:", err);
      setAuthError('Connection failed.');
      setAuthLoading(false);
      return false;
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    setIsPro(false);
    setSavedBuilds([]);
    clearBuild();
    localStorage.removeItem('rig_token');
    localStorage.removeItem('rig_user');
    fetchShowcaseBuilds();
  };

  // Fetch parts catalog
  const fetchCatalog = async () => {
    try {
      setLoadingCatalog(true);
      const [cpusRes, mobosRes, ramsRes, gpusRes, psusRes, casesRes] = await Promise.all([
        fetch(`${API_BASE}/cpus/`),
        fetch(`${API_BASE}/motherboards/`),
        fetch(`${API_BASE}/rams/`),
        fetch(`${API_BASE}/gpus/`),
        fetch(`${API_BASE}/powersupplies/`),
        fetch(`${API_BASE}/cases/`)
      ]);

      const [cpus, motherboards, rams, gpus, powersupplies, cases] = await Promise.all([
        cpusRes.json(),
        mobosRes.json(),
        ramsRes.json(),
        gpusRes.json(),
        psusRes.json(),
        casesRes.json()
      ]);

      setCatalog({ cpus, motherboards, rams, gpus, powersupplies, cases });
    } catch (err) {
      console.error("Error fetching components catalog:", err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  // Fetch saved builds
  const fetchSavedBuilds = async () => {
    try {
      setLoadingBuilds(true);
      const headers = {};
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      const res = await fetch(`${API_BASE}/builds/`, { headers });
      if (res.ok) {
        const data = await res.json();
        setSavedBuilds(data);
      }
    } catch (err) {
      console.error("Error fetching saved builds:", err);
    } finally {
      setLoadingBuilds(false);
    }
  };

  // Fetch prebuilt systems catalog
  const fetchPrebuilts = async () => {
    try {
      setLoadingPrebuilts(true);
      const res = await fetch(`${API_BASE}/prebuilts/`);
      if (res.ok) {
        const data = await res.json();
        setPrebuilts(data);
      }
    } catch (err) {
      console.error("Error fetching prebuilts:", err);
    } finally {
      setLoadingPrebuilts(false);
    }
  };

  // Fetch showcase builds
  const fetchShowcaseBuilds = async () => {
    try {
      setLoadingShowcase(true);
      const res = await fetch(`${API_BASE}/builds/?public=true`);
      if (res.ok) {
        const data = await res.json();
        setShowcaseBuilds(data);
      }
    } catch (err) {
      console.error("Error fetching showcase builds:", err);
    } finally {
      setLoadingShowcase(false);
    }
  };

  const loadSharedBuild = async (buildId) => {
    try {
      const res = await fetch(`${API_BASE}/builds/${buildId}/`);
      if (res.ok) {
        const data = await res.json();
        setDraftBuild({
          id: null,
          name: `${data.name} (Shared)`,
          cpu: data.cpu,
          motherboard: data.motherboard,
          ram: data.ram,
          gpu: data.gpu,
          powersupply: data.powersupply,
          case: data.case
        });
      }
    } catch (err) {
      console.error("Error loading shared build:", err);
    }
  };

  useEffect(() => {
    fetchSavedBuilds();
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    
    fetchCatalog();
    fetchPrebuilts();
    fetchShowcaseBuilds();

    if (shareId) {
      loadSharedBuild(shareId);
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, []);

  // Set selected part in build draft
  const selectPart = (category, part) => {
    setDraftBuild(prev => ({
      ...prev,
      [category]: part
    }));
    // Reset backend errors when editing draft
    setBackendErrors(prev => ({ ...prev, [category]: null }));
    setSaveSuccess(false);
  };

  // Remove a part from the draft build
  const removePart = (category) => {
    setDraftBuild(prev => ({
      ...prev,
      [category]: null
    }));
    setBackendErrors(prev => ({ ...prev, [category]: null }));
    setSaveSuccess(false);
  };

  // Clear draft build
  const clearBuild = () => {
    setDraftBuild({
      id: null,
      name: '',
      cpu: null,
      motherboard: null,
      ram: null,
      gpu: null,
      powersupply: null,
      case: null
    });
    setBackendErrors({});
    setSaveSuccess(false);
  };

  // Load a saved build into draft
  const loadBuild = (build) => {
    setDraftBuild({
      id: build.id,
      name: build.name,
      cpu: build.cpu,
      motherboard: build.motherboard,
      ram: build.ram,
      gpu: build.gpu,
      powersupply: build.powersupply,
      case: build.case
    });
    setBackendErrors({});
    setSaveSuccess(false);
  };

  // Save or update draft build in backend
  const saveBuild = async () => {
    if (!draftBuild.name.trim()) {
      setBackendErrors({ name: ["Build name is required."] });
      return false;
    }

    // Freemium Limit Check
    if (!isPro && !draftBuild.id && savedBuilds.length >= 3) {
      setBackendErrors({ non_field_errors: ["Freemium limit reached. You can save up to 3 builds. Upgrade to Pro to save unlimited rigs!"] });
      return "LIMIT_REACHED";
    }

    const payload = {
      name: draftBuild.name,
      cpu: draftBuild.cpu ? draftBuild.cpu.id : null,
      motherboard: draftBuild.motherboard ? draftBuild.motherboard.id : null,
      ram: draftBuild.ram ? draftBuild.ram.id : null,
      gpu: draftBuild.gpu ? draftBuild.gpu.id : null,
      powersupply: draftBuild.powersupply ? draftBuild.powersupply.id : null,
      case: draftBuild.case ? draftBuild.case.id : null
    };

    const url = draftBuild.id 
      ? `${API_BASE}/builds/${draftBuild.id}/` 
      : `${API_BASE}/builds/`;
    const method = draftBuild.id ? 'PUT' : 'POST';

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setSaveSuccess(true);
        setBackendErrors({});
        // Reload draft with database instance (updates ID and resolves names)
        loadBuild(data);
        fetchSavedBuilds();
        fetchShowcaseBuilds();
        return true;
      } else {
        setBackendErrors(data);
        setSaveSuccess(false);
        return false;
      }
    } catch (err) {
      console.error("Error saving build:", err);
      setBackendErrors({ non_field_errors: ["Failed to connect to the server."] });
      setSaveSuccess(false);
      return false;
    }
  };

  // Delete a saved build
  const deleteBuild = async (buildId) => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      const res = await fetch(`${API_BASE}/builds/${buildId}/`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        if (draftBuild.id === buildId) {
          clearBuild();
        }
        fetchSavedBuilds();
        fetchShowcaseBuilds();
        return true;
      }
    } catch (err) {
      console.error("Error deleting build:", err);
    }
    return false;
  };

  // Real-time client side evaluation logic
  const evaluateCompatibility = () => {
    const { cpu, motherboard, ram, gpu, powersupply, case: casePart } = draftBuild;
    const checks = {
      socket: { status: 'empty', message: 'Select CPU and Motherboard to verify socket compatibility.' },
      ramType: { status: 'empty', message: 'Select Motherboard and RAM to verify memory compatibility.' },
      wattage: { status: 'empty', message: 'Select Power Supply to verify wattage capacity.' },
      caseMobo: { status: 'empty', message: 'Select Case and Motherboard to verify form factor compatibility.' },
      caseGpu: { status: 'empty', message: 'Select Case and GPU to verify clearance clearance limits.' }
    };

    // 1. Socket Check
    if (cpu && motherboard) {
      if (cpu.socket_type === motherboard.socket_type) {
        checks.socket = {
          status: 'compatible',
          message: `Compatible: Both use ${cpu.socket_type} socket.`
        };
      } else {
        checks.socket = {
          status: 'incompatible',
          message: `Incompatible Socket! CPU uses ${cpu.socket_type}, but Motherboard uses ${motherboard.socket_type}.`
        };
      }
    } else if (cpu) {
      checks.socket = { status: 'warning', message: `CPU requires an ${cpu.socket_type} motherboard.` };
    } else if (motherboard) {
      checks.socket = { status: 'warning', message: `Motherboard requires a ${motherboard.socket_type} CPU.` };
    }

    // 2. RAM Check
    if (ram && motherboard) {
      if (ram.ram_type === motherboard.ram_type) {
        checks.ramType = {
          status: 'compatible',
          message: `Compatible: Both support ${ram.ram_type} memory.`
        };
      } else {
        checks.ramType = {
          status: 'incompatible',
          message: `Incompatible Memory! RAM is ${ram.ram_type}, but Motherboard supports ${motherboard.ram_type}.`
        };
      }
    } else if (ram) {
      checks.ramType = { status: 'warning', message: `RAM requires a motherboard supporting ${ram.ram_type}.` };
    } else if (motherboard) {
      checks.ramType = { status: 'warning', message: `Motherboard requires ${motherboard.ram_type} RAM.` };
    }

    // 3. Wattage Check
    if (powersupply) {
      const cpuTdp = cpu ? cpu.tdp_wattage : 0;
      const gpuTdp = gpu ? gpu.tdp_wattage : 0;
      const overhead = 100;
      const totalTdp = cpuTdp + gpuTdp + overhead;

      if (totalTdp <= powersupply.wattage) {
        checks.wattage = {
          status: 'compatible',
          message: `Compatible: PSU capacity (${powersupply.wattage}W) is sufficient for estimated load (${totalTdp}W).`
        };
      } else {
        checks.wattage = {
          status: 'incompatible',
          message: `Power Supply Insufficient! Combined draw is ${totalTdp}W (CPU: ${cpuTdp}W + GPU: ${gpuTdp}W + 100W overhead), which exceeds PSU capacity (${powersupply.wattage}W).`
        };
      }
    } else if (cpu || gpu) {
      const cpuTdp = cpu ? cpu.tdp_wattage : 0;
      const gpuTdp = gpu ? gpu.tdp_wattage : 0;
      const overhead = 100;
      const totalTdp = cpuTdp + gpuTdp + overhead;
      checks.wattage = {
        status: 'warning',
        message: `Estimated draw: ${totalTdp}W. Select a PSU with at least ${totalTdp}W capacity.`
      };
    }

    // 4. Case Motherboard Size Check
    if (casePart && motherboard) {
      const supported = casePart.motherboard_support.split(',').map(s => s.trim().toLowerCase());
      if (supported.includes(motherboard.form_factor.toLowerCase())) {
        checks.caseMobo = {
          status: 'compatible',
          message: `Compatible: Case (${casePart.name}) supports ${motherboard.form_factor} motherboard.`
        };
      } else {
        checks.caseMobo = {
          status: 'incompatible',
          message: `Incompatible Size! Case only supports [${casePart.motherboard_support}], but Motherboard is ${motherboard.form_factor}.`
        };
      }
    } else if (casePart) {
      checks.caseMobo = { status: 'warning', message: `Case supports form factors: ${casePart.motherboard_support}.` };
    } else if (motherboard) {
      checks.caseMobo = { status: 'warning', message: `Select a Case supporting ${motherboard.form_factor} size.` };
    }

    // 5. Case GPU Clearance Check
    if (casePart && gpu) {
      const gpuLen = gpu.gpu_length_mm || 280;
      if (gpuLen <= casePart.max_gpu_length_mm) {
        checks.caseGpu = {
          status: 'compatible',
          message: `Compatible: Case GPU clearance (${casePart.max_gpu_length_mm}mm) fits GPU length (${gpuLen}mm).`
        };
      } else {
        checks.caseGpu = {
          status: 'incompatible',
          message: `GPU Too Long! GPU length is ${gpuLen}mm, which exceeds Case max clearance of ${casePart.max_gpu_length_mm}mm.`
        };
      }
    } else if (casePart) {
      checks.caseGpu = { status: 'warning', message: `Case max GPU clearance: ${casePart.max_gpu_length_mm}mm.` };
    } else if (gpu) {
      const gpuLen = gpu.gpu_length_mm || 280;
      checks.caseGpu = { status: 'warning', message: `Select a Case with at least ${gpuLen}mm GPU clearance.` };
    }

    const isCompatible = 
      checks.socket.status !== 'incompatible' && 
      checks.ramType.status !== 'incompatible' && 
      checks.wattage.status !== 'incompatible' &&
      checks.caseMobo.status !== 'incompatible' &&
      checks.caseGpu.status !== 'incompatible';

    return { checks, isCompatible };
  };

  const trackAffiliateClick = async (buildId, partCategory, partId) => {
    if (!buildId || !partCategory || !partId) return;
    try {
      await fetch(`${API_BASE}/clicks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          build_id: buildId,
          part_type: partCategory,
          part_id: partId
        })
      });
    } catch (err) {
      console.error("Error tracking affiliate click:", err);
    }
  };

  const compatibility = evaluateCompatibility();

  const calculateTotalPrice = () => {
    const { cpu, motherboard, ram, gpu, powersupply, case: casePart } = draftBuild;
    let total = 0;
    if (cpu) total += parseFloat(cpu.price || 0);
    if (motherboard) total += parseFloat(motherboard.price || 0);
    if (ram) total += parseFloat(ram.price || 0);
    if (gpu) total += parseFloat(gpu.price || 0);
    if (powersupply) total += parseFloat(powersupply.price || 0);
    if (casePart) total += parseFloat(casePart.price || 0);
    return parseFloat(total.toFixed(2));
  };

  const totalPrice = calculateTotalPrice();

  return (
    <BuildContext.Provider value={{
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
      loadingShowcase,
      fetchShowcaseBuilds
    }}>
      {children}
    </BuildContext.Provider>
  );
};
