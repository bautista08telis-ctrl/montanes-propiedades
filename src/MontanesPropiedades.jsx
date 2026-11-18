import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Bath,
  BedDouble,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  Edit3,
  Eye,
  EyeOff,
  FileCheck2,
  Home,
  ImagePlus,
  KeyRound,
  Landmark,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'montanes_propiedades_catalog_v1';
const CUSTOM_HASH_KEY = 'montanes_owner_custom_hash_v1';
const AUTH_LOCK_KEY = 'montanes_auth_lock_v1';
const AUTH_SALT = 'montanes_salt_v1:';
const OWNER_DEFAULT_HASHES = [
  'df61c5fd7b8becc40f7e5a0ed82c7a8b8ed4200374e60349db477811cff77b13',
  'a8cb9a1fab2bdb590d0e29e88df5edce47ea6d1d235adf01178c46e4e46a7544',
  '2fdf3034e079364174e997e7836d7e029db9dfd749dd3d9680d4b8530ac24a6d',
];
const MAX_AUTH_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'];

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", Arial, sans-serif';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85';

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

const GLASS_LIGHT =
  'backdrop-blur-2xl bg-white/65 border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.75),0_8px_32px_rgba(0,0,0,0.08)]';

const GLASS_DARK =
  'backdrop-blur-2xl bg-black/55 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_12px_36px_rgba(0,0,0,0.32)]';

const GLASS_PILL =
  'backdrop-blur-xl bg-white/75 border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_4px_16px_rgba(0,0,0,0.08)]';

const OFFICE_INFO = {
  brand: 'Montañés Propiedades',
  since: 'Desde 1958',
  domain: 'montanes.uy',
  address: 'Sarandí 483 casi Burnett, Maldonado, Uruguay.',
  phone: '+(598) 4223 3626',
  phoneHref: 'tel:+59842233626',
  whatsappDisplay: '(+598) 94 440854',
  whatsappNumber: '59894440854',
  whatsappHref: 'https://wa.me/59894440854',
  email: 'info@montañes.uy',
  emailHref: 'mailto:info@montañes.uy',
};

const NAV_LINKS = [
  { label: 'Propiedades', id: 'propiedades' },
  { label: 'Servicios', id: 'servicios' },
  { label: 'Trayectoria', id: 'trayectoria' },
  { label: 'Contacto', id: 'contacto' },
];

const CATEGORIES = ['Todas', 'Casas', 'Apartamentos', 'Terrenos/Desarrollo'];

const ZONES = ['Todas', 'Centro Maldonado', 'La Loma', 'La Sonrisa', 'Barrio 4 H', 'Aiguá'];

const INITIAL_PROPERTIES = [
  {
    id: 'ref-10664',
    ref: '10664',
    title: 'Casa en venta en Maldonado - Propiedad Horizontal (PH)',
    operation: 'Venta',
    category: 'Casa',
    zone: 'Centro Maldonado',
    location: 'Maldonado',
    price: 105000,
    bedrooms: 2,
    bathrooms: 2,
    area: 55,
    customSpecs: '',
    description:
      'Excelente propiedad horizontal en Maldonado con 2 dormitorios, 2 baños completos y ambientes cómodos.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ref-10650',
    ref: '10650',
    title: 'Casa en Venta barrio La Sonrisa 3 dorm.',
    operation: 'Venta',
    category: 'Casa',
    zone: 'La Sonrisa',
    location: 'La Sonrisa, Maldonado',
    price: 169000,
    bedrooms: 3,
    bathrooms: 1,
    area: 70,
    customSpecs: '',
    description:
      'Ideal para quienes buscan comodidad, tranquilidad y buena ubicación en barrio La Sonrisa.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ref-10646',
    ref: '10646',
    title: 'Casa + 2 apartamentos en pleno Centro de Maldonado',
    operation: 'Venta',
    category: 'Casa',
    zone: 'Centro Maldonado',
    location: 'Centro Maldonado',
    price: 225000,
    bedrooms: 2,
    bathrooms: 1,
    area: 204,
    customSpecs: '',
    description:
      'Excelente propiedad en muy buen estado de conservación, ideal tanto para vivienda permanente como para generar rentas.',
    image:
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ref-10637',
    ref: '10637',
    title: '934 m² en Pleno Centro de Aiguá',
    operation: 'Venta',
    category: 'Casa',
    zone: 'Aiguá',
    location: 'Aiguá, Maldonado',
    price: 179000,
    bedrooms: 8,
    bathrooms: 5,
    area: 499,
    customSpecs: '',
    description:
      'Gran propiedad en venta con ubicación céntrica privilegiada sobre terreno de 934 m² y 499 m² edificados.',
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ref-10635',
    ref: '10635',
    title: 'Propiedad para refaccionar o desarrollar proyecto en el Centro',
    operation: 'Venta',
    category: 'Casa',
    isDevelopment: true,
    zone: 'Centro Maldonado',
    location: 'Centro Maldonado',
    price: 215000,
    bedrooms: null,
    bathrooms: null,
    area: null,
    customSpecs: 'Desarrollo / Renta',
    description:
      'Refaccioná, generá rentas o desarrollá tu próximo proyecto. Gran potencial de desarrollo en pleno Centro de Maldonado.',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ref-10606',
    ref: '10606',
    title: 'Apto. 2 dormitorios al frente con vista despejada y gran terraza',
    operation: 'Venta',
    category: 'Apartamento',
    zone: 'La Loma',
    location: 'La Loma, Maldonado',
    price: 187500,
    bedrooms: 2,
    bathrooms: 1,
    area: 87,
    customSpecs: '',
    description:
      'Unidad 302 en Av. Joaquín de Viana y Honduras. Frente con vista despejada y amplia terraza.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ref-10560',
    ref: '10560',
    title: 'Apartamento en Barrio 4 H - Excelente relación precio-producto',
    operation: 'Venta',
    category: 'Apartamento',
    zone: 'Barrio 4 H',
    location: 'Barrio 4 H, Maldonado',
    price: 70000,
    bedrooms: 2,
    bathrooms: 2,
    area: 25,
    customSpecs: '',
    description:
      'Excelente oportunidad de compra desde USD 70.000 en uno de los barrios con mayor crecimiento de Maldonado.',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ref-10173',
    ref: '10173',
    title: 'Edificio Volta - Apartamento 1 dormitorio contrafrente',
    operation: 'Venta',
    category: 'Apartamento',
    zone: 'La Loma',
    location: 'La Loma, Maldonado',
    price: 155000,
    bedrooms: 1,
    bathrooms: 1,
    area: 56,
    customSpecs: '',
    description:
      'Ubicado frente al Parque La Loma, en una zona estratégica entre Maldonado y Punta del Este.',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ref-10153',
    ref: '10153',
    title: 'Edificio Volta - Apartamento 2 dormitorios',
    operation: 'Venta',
    category: 'Apartamento',
    zone: 'La Loma',
    location: 'La Loma, Maldonado',
    price: 215000,
    bedrooms: 2,
    bathrooms: 1,
    area: 81,
    customSpecs: '',
    description:
      'Ubicado frente al Parque La Loma, en una zona estratégica entre Maldonado y Punta del Este.',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  },
];

const INSTITUTIONAL_BADGES = [
  {
    title: 'Miembro de CIPEM',
    detail: 'Cámara Inmobiliaria Punta del Este - Maldonado',
    icon: Landmark,
  },
  {
    title: 'Miembro de CIU',
    detail: 'Cámara Inmobiliaria Uruguaya',
    icon: Award,
  },
  {
    title: 'Inmobiliaria Habilitada',
    detail: 'Registro profesional vigente en Uruguay',
    icon: FileCheck2,
  },
  {
    title: 'Garantía FIDECIU',
    detail: 'Respaldo oficial en contratos de alquiler',
    icon: ShieldCheck,
  },
];

function formatUsd(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return 'Consultar';
  return `USD ${num.toLocaleString('es-UY')}`;
}

function buildWhatsAppUrl(message) {
  return `${OFFICE_INFO.whatsappHref}?text=${encodeURIComponent(message)}`;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function matchesCategoryFilter(item, filterCategory) {
  if (filterCategory === 'Todas') return true;
  if (filterCategory === 'Casas') return item.category === 'Casa';
  if (filterCategory === 'Apartamentos') return item.category === 'Apartamento';
  if (filterCategory === 'Terrenos/Desarrollo') {
    return item.category === 'Terrenos/Desarrollo' || Boolean(item.isDevelopment);
  }
  return item.category === filterCategory;
}

function sanitizeText(value, maxLen = 600) {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function sanitizeImageUrl(url) {
  const trimmed = String(url ?? '').trim();
  if (!trimmed) return DEFAULT_FALLBACK_IMAGE;
  if (/^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    // URL inválida
  }
  return DEFAULT_FALLBACK_IMAGE;
}

function sanitizePropertyRecord(item) {
  if (!item || typeof item !== 'object') return null;
  const price = Number(item.price);
  if (!Number.isFinite(price) || price <= 0) return null;

  const toNullablePositiveInt = (val) => {
    if (val === '' || val === null || val === undefined) return null;
    const n = Number(val);
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
  };

  const title = sanitizeText(item.title, 140);
  const ref = sanitizeText(item.ref, 24);
  if (!title || !ref) return null;

  const validOps = ['Venta', 'Alquiler'];
  const validCats = ['Casa', 'Apartamento', 'Terrenos/Desarrollo'];
  const validZones = ZONES.filter((z) => z !== 'Todas');

  return {
    id: sanitizeText(item.id, 64) || `ref-${ref}`,
    ref,
    title,
    operation: validOps.includes(item.operation) ? item.operation : 'Venta',
    category: validCats.includes(item.category) ? item.category : 'Casa',
    isDevelopment: Boolean(item.isDevelopment),
    zone: validZones.includes(item.zone) ? item.zone : 'Centro Maldonado',
    location: sanitizeText(item.location, 80) || 'Maldonado',
    price: Math.round(price),
    bedrooms: toNullablePositiveInt(item.bedrooms),
    bathrooms: toNullablePositiveInt(item.bathrooms),
    area: toNullablePositiveInt(item.area),
    customSpecs: sanitizeText(item.customSpecs, 48),
    description: sanitizeText(item.description, 600),
    image: sanitizeImageUrl(item.image),
  };
}

async function computeSaltedHash(secret) {
  const data = new TextEncoder().encode(AUTH_SALT + secret);
  if (window.crypto?.subtle?.digest) {
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return '';
}

function getLockState() {
  try {
    const raw = window.sessionStorage.getItem(AUTH_LOCK_KEY);
    if (!raw) return { attempts: 0, lockedUntil: 0 };
    const parsed = JSON.parse(raw);
    return {
      attempts: Number(parsed.attempts) || 0,
      lockedUntil: Number(parsed.lockedUntil) || 0,
    };
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function saveLockState(next) {
  try {
    window.sessionStorage.setItem(AUTH_LOCK_KEY, JSON.stringify(next));
  } catch {
    // noop
  }
}

function loadCatalogFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROPERTIES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_PROPERTIES;
    const sanitized = parsed.map(sanitizePropertyRecord).filter(Boolean);
    return sanitized.length > 0 ? sanitized : INITIAL_PROPERTIES;
  } catch {
    return INITIAL_PROPERTIES;
  }
}

function createEmptyDraft() {
  return {
    id: '',
    ref: '',
    title: '',
    operation: 'Venta',
    category: 'Casa',
    isDevelopment: false,
    zone: 'Centro Maldonado',
    location: 'Centro Maldonado',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    customSpecs: '',
    description: '',
    image: DEFAULT_FALLBACK_IMAGE,
  };
}

function validateContactForm(values) {
  const errors = {};
  if (!values.nombre.trim() || values.nombre.trim().length < 2) {
    errors.nombre = 'Ingresa tu nombre completo (al menos 2 caracteres).';
  }
  const contact = values.contacto.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const digits = contact.replace(/\D/g, '');
  if (!contact || (!isEmail && digits.length < 7)) {
    errors.contacto = 'Ingresa un correo electrónico o teléfono válido.';
  }
  if (!values.mensaje.trim() || values.mensaje.trim().length < 8) {
    errors.mensaje = 'Cuéntanos brevemente qué propiedad o servicio buscas.';
  }
  return errors;
}

export default function MontanesPropiedades() {
  const [properties, setProperties] = useState(loadCatalogFromStorage);
  const [ownerMode, setOwnerMode] = useState(false);

  // Filtros del buscador inteligente
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [zoneFilter, setZoneFilter] = useState('Todas');
  const [sortOrder, setSortOrder] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Navegación y modales
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [detailProperty, setDetailProperty] = useState(null);
  const [editorState, setEditorState] = useState(null); // { mode: 'create' | 'edit', draft }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Seguridad y autenticación del Área de Propietarios
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [lockInfo, setLockInfo] = useState(getLockState);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);

  // Cambio de clave del propietario
  const [changeKeyOpen, setChangeKeyOpen] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState('');
  const [confirmKeyInput, setConfirmKeyInput] = useState('');
  const [changeKeyError, setChangeKeyError] = useState('');

  // Formulario de contacto
  const [contactValues, setContactValues] = useState({
    nombre: '',
    contacto: '',
    referencia: '',
    mensaje: '',
  });
  const [contactTouched, setContactTouched] = useState({});
  const [contactSubmitAttempted, setContactSubmitAttempted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const fileInputRef = useRef(null);
  const nombreInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  // Persistencia en localStorage para la demo en vivo
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch {
      // Si la imagen subida excede la cuota de localStorage, evitamos romper la sesión
    }
  }, [properties]);

  // Cierre con Escape para los modales abiertos
  useEffect(() => {
    const hasModal = Boolean(
      detailProperty || editorState || deleteTarget || confirmResetOpen || authModalOpen || changeKeyOpen
    );
    if (!hasModal) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (deleteTarget) setDeleteTarget(null);
      else if (confirmResetOpen) setConfirmResetOpen(false);
      else if (changeKeyOpen) setChangeKeyOpen(false);
      else if (authModalOpen) setAuthModalOpen(false);
      else if (editorState) setEditorState(null);
      else if (detailProperty) setDetailProperty(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [detailProperty, editorState, deleteTarget, confirmResetOpen, authModalOpen, changeKeyOpen]);

  // Contador regresivo del bloqueo por intentos fallidos
  useEffect(() => {
    const updateRemaining = () => {
      const diff = Math.max(0, Math.ceil((lockInfo.lockedUntil - Date.now()) / 1000));
      setLockSecondsLeft(diff);
      if (diff === 0 && lockInfo.lockedUntil > 0) {
        const cleared = { attempts: 0, lockedUntil: 0 };
        setLockInfo(cleared);
        saveLockState(cleared);
      }
    };
    updateRemaining();
    if (lockInfo.lockedUntil <= Date.now()) return undefined;
    const id = window.setInterval(updateRemaining, 500);
    return () => window.clearInterval(id);
  }, [lockInfo]);

  // Cierre automático de sesión por inactividad (15 minutos)
  useEffect(() => {
    if (!ownerMode) return undefined;
    let timerId = null;

    const lockSession = () => {
      setOwnerMode(false);
      setEditorState(null);
      setDeleteTarget(null);
      setConfirmResetOpen(false);
      setChangeKeyOpen(false);
      showToast('Sesión de propietario bloqueada automáticamente por inactividad.');
    };

    const resetTimer = () => {
      if (timerId) window.clearTimeout(timerId);
      timerId = window.setTimeout(lockSession, INACTIVITY_TIMEOUT_MS);
    };

    const events = ['pointerdown', 'keydown', 'scroll'];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timerId) window.clearTimeout(timerId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [ownerMode]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(''), 3200);
  };

  const filteredProperties = useMemo(() => {
    const query = normalizeText(searchQuery.trim());
    const matches = properties.filter((item) => {
      const matchCat = matchesCategoryFilter(item, categoryFilter);
      const matchZone = zoneFilter === 'Todas' || item.zone === zoneFilter;
      if (!matchCat || !matchZone) return false;
      if (!query) return true;

      const haystack = normalizeText(
        `${item.ref} ${item.title} ${item.location} ${item.zone} ${item.category} ${item.description} ${item.customSpecs || ''}`
      );
      return haystack.includes(query);
    });

    if (sortOrder === 'price-asc') {
      return [...matches].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }
    if (sortOrder === 'price-desc') {
      return [...matches].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }
    return matches;
  }, [properties, searchQuery, categoryFilter, zoneFilter, sortOrder]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'Todas' ||
    zoneFilter !== 'Todas' ||
    sortOrder !== 'featured';

  const resetSearchFilters = () => {
    setSearchQuery('');
    setCategoryFilter('Todas');
    setZoneFilter('Todas');
    setSortOrder('featured');
  };

  // Acciones de seguridad y del Área de Propietarios
  const handleToggleOwnerArea = () => {
    if (ownerMode) {
      setOwnerMode(false);
      setEditorState(null);
      setDeleteTarget(null);
      setConfirmResetOpen(false);
      setChangeKeyOpen(false);
      showToast('Área de Propietarios bloqueada. Sesión cerrada.');
      return;
    }
    setAuthPassword('');
    setAuthError('');
    setShowAuthPassword(false);
    setAuthModalOpen(true);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (lockSecondsLeft > 0 || authBusy) return;
    const candidate = authPassword.trim();
    if (!candidate) {
      setAuthError('Ingresá la clave de propietario.');
      return;
    }

    setAuthBusy(true);
    try {
      const digest = await computeSaltedHash(candidate);
      let customHash = '';
      try {
        customHash = window.localStorage.getItem(CUSTOM_HASH_KEY) || '';
      } catch {
        customHash = '';
      }
      const allowedHashes = customHash ? [customHash] : OWNER_DEFAULT_HASHES;

      if (digest && allowedHashes.includes(digest)) {
        const reset = { attempts: 0, lockedUntil: 0 };
        setLockInfo(reset);
        saveLockState(reset);
        setAuthModalOpen(false);
        setAuthPassword('');
        setAuthError('');
        setOwnerMode(true);
        showToast('Acceso verificado. Área de Propietarios desbloqueada.');
      } else {
        const nextAttempts = lockInfo.attempts + 1;
        if (nextAttempts >= MAX_AUTH_ATTEMPTS) {
          const locked = { attempts: nextAttempts, lockedUntil: Date.now() + LOCKOUT_MS };
          setLockInfo(locked);
          saveLockState(locked);
          setAuthError('Demasiados intentos fallidos. Acceso bloqueado por 60 segundos.');
        } else {
          const next = { attempts: nextAttempts, lockedUntil: 0 };
          setLockInfo(next);
          saveLockState(next);
          setAuthError(
            `Clave incorrecta. Te quedan ${MAX_AUTH_ATTEMPTS - nextAttempts} intento(s).`
          );
        }
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSaveNewOwnerKey = async (e) => {
    e.preventDefault();
    if (!ownerMode) return;
    const nextKey = newKeyInput.trim();
    if (nextKey.length < 4) {
      setChangeKeyError('La nueva clave debe tener al menos 4 caracteres.');
      return;
    }
    if (nextKey !== confirmKeyInput.trim()) {
      setChangeKeyError('Las claves ingresadas no coinciden.');
      return;
    }
    const newHash = await computeSaltedHash(nextKey);
    if (!newHash) {
      setChangeKeyError('Tu navegador no soporta Web Crypto en este contexto.');
      return;
    }
    try {
      window.localStorage.setItem(CUSTOM_HASH_KEY, newHash);
      setChangeKeyOpen(false);
      setNewKeyInput('');
      setConfirmKeyInput('');
      setChangeKeyError('');
      showToast('Clave de propietario actualizada de forma segura.');
    } catch {
      setChangeKeyError('No se pudo guardar la nueva clave en este navegador.');
    }
  };

  const openCreateModal = () => {
    if (!ownerMode) return;
    const nextRef = String(10700 + properties.length + Math.floor(Math.random() * 90));
    setEditorState({
      mode: 'create',
      draft: {
        ...createEmptyDraft(),
        ref: nextRef,
      },
    });
  };

  const openEditModal = (property) => {
    if (!ownerMode) return;
    setDetailProperty(null);
    setEditorState({
      mode: 'edit',
      draft: {
        ...property,
        price: property.price ?? '',
        bedrooms: property.bedrooms ?? '',
        bathrooms: property.bathrooms ?? '',
        area: property.area ?? '',
        customSpecs: property.customSpecs ?? '',
        isDevelopment: Boolean(property.isDevelopment),
      },
    });
  };

  const updateDraft = (field, value) => {
    setEditorState((prev) => {
      if (!prev) return prev;
      const nextDraft = { ...prev.draft, [field]: value };
      if (field === 'zone' && (!prev.draft.location || prev.draft.location === prev.draft.zone)) {
        nextDraft.location = value === 'Centro Maldonado' ? 'Centro Maldonado' : `${value}, Maldonado`;
      }
      return { ...prev, draft: nextDraft };
    });
  };

  const handleImageFileUpload = (e) => {
    if (!ownerMode) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_MIME.includes(file.type)) {
      showToast('Solo se permiten imágenes JPG, PNG o WebP (SVG bloqueado por seguridad).');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      showToast('La imagen supera los 2.5 MB permitidos. Elegí una más liviana.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const safeImg = sanitizeImageUrl(reader.result);
        updateDraft('image', safeImg);
        showToast('Fotografía cargada en la vista previa.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProperty = (e) => {
    e.preventDefault();
    if (!ownerMode || !editorState) return;
    const { mode, draft } = editorState;

    const cleanTitle = sanitizeText(draft.title, 140);
    const cleanRef = sanitizeText(draft.ref, 24) || String(Date.now()).slice(-5);
    const parsedPrice = Number(String(draft.price).replace(/\D/g, ''));

    if (!cleanTitle || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      showToast('Completa el título y un precio válido en USD.');
      return;
    }

    const toNullableNum = (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const n = Number(val);
      return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
    };

    const normalizedProperty = sanitizePropertyRecord({
      id: mode === 'edit' && draft.id ? draft.id : `ref-${cleanRef}-${Date.now()}`,
      ref: cleanRef,
      title: cleanTitle,
      operation: draft.operation || 'Venta',
      category: draft.category || 'Casa',
      isDevelopment:
        draft.category === 'Terrenos/Desarrollo' ? true : Boolean(draft.isDevelopment),
      zone: draft.zone || 'Centro Maldonado',
      location: sanitizeText(draft.location, 80) || draft.zone || 'Maldonado',
      price: parsedPrice,
      bedrooms: toNullableNum(draft.bedrooms),
      bathrooms: toNullableNum(draft.bathrooms),
      area: toNullableNum(draft.area),
      customSpecs: sanitizeText(draft.customSpecs, 48),
      description:
        sanitizeText(draft.description, 600) ||
        'Propiedad seleccionada por Montañés Propiedades en Maldonado.',
      image: sanitizeImageUrl(draft.image),
    });

    if (!normalizedProperty) {
      showToast('Verificá los datos ingresados antes de guardar.');
      return;
    }

    if (mode === 'create') {
      setProperties((prev) => [normalizedProperty, ...prev]);
      showToast(`Propiedad Ref. ${normalizedProperty.ref} agregada al catálogo.`);
    } else {
      setProperties((prev) =>
        prev.map((item) => (item.id === normalizedProperty.id ? normalizedProperty : item))
      );
      showToast(`Cambios guardados en Ref. ${normalizedProperty.ref}.`);
    }
    setEditorState(null);
  };

  const confirmDeleteProperty = () => {
    if (!ownerMode || !deleteTarget) return;
    setProperties((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    if (detailProperty?.id === deleteTarget.id) setDetailProperty(null);
    showToast(`Propiedad Ref. ${deleteTarget.ref} eliminada del catálogo.`);
    setDeleteTarget(null);
  };

  const handleRestoreCatalog = () => {
    if (!ownerMode) return;
    setProperties(INITIAL_PROPERTIES);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
    setConfirmResetOpen(false);
    resetSearchFilters();
    showToast('Catálogo original de 9 propiedades restaurado.');
  };

  const contactErrors = useMemo(() => validateContactForm(contactValues), [contactValues]);

  const showContactError = (field) =>
    Boolean((contactTouched[field] || contactSubmitAttempted) && contactErrors[field]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitAttempted(true);
    setContactTouched({ nombre: true, contacto: true, mensaje: true });
    if (Object.keys(contactErrors).length > 0) return;
    setContactSubmitted(true);
    showToast('Consulta registrada. También podés enviarla directo por WhatsApp.');
  };

  const openContactForProperty = (property) => {
    setDetailProperty(null);
    setContactSubmitted(false);
    setContactValues((prev) => ({
      ...prev,
      referencia: `Ref. ${property.ref} - ${property.title}`,
      mensaje: `Hola Montañés Propiedades, me interesa consultar por la propiedad Ref. ${property.ref} (${property.title} · ${formatUsd(property.price)}).`,
    }));
    scrollToSection('contacto');
    window.setTimeout(() => nombreInputRef.current?.focus(), 350);
  };

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#FBFBFD] text-[#1D1D1F] antialiased selection:bg-[#0066CC]/15 selection:text-[#1D1D1F] pb-24 md:pb-0"
      style={{ fontFamily: FONT_STACK }}
    >
      {/* Destellos ambientales sutiles para que el efecto Liquid Glass refracte color y profundidad */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-36 left-[-8%] h-[420px] w-[420px] rounded-full bg-[#0066CC]/[0.09] blur-3xl" />
        <div className="absolute top-[22%] right-[-10%] h-[480px] w-[480px] rounded-full bg-[#5AC8FA]/[0.12] blur-3xl" />
        <div className="absolute bottom-[10%] left-[12%] h-[380px] w-[380px] rounded-full bg-[#D1D1D6]/[0.35] blur-3xl" />
      </div>

      {/* Toast flotante Liquid Glass */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-[13px] font-medium text-[#1D1D1F] md:bottom-6 ${GLASS_LIGHT}`}
        >
          <span className="flex items-center gap-2 whitespace-nowrap">
            <CheckCircle2 className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
            {toastMessage}
          </span>
        </div>
      )}

      {/* 1. Navegación Flotante Liquid Glass */}
      <div className="sticky top-3 z-40 px-3 sm:px-6">
        <header
          className={`mx-auto max-w-6xl rounded-full px-3.5 py-2 transition-all duration-300 sm:px-5 ${GLASS_LIGHT}`}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Marca */}
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('inicio');
              }}
              className="flex min-w-0 items-center gap-2.5 rounded-full py-0.5 pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D1D1F] text-white shadow-sm">
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[14px] font-semibold tracking-tight text-[#1D1D1F] sm:text-[15px]">
                  {OFFICE_INFO.brand}
                </span>
                <span className="block text-[11px] font-medium text-[#6E6E73]">
                  {OFFICE_INFO.since}
                </span>
              </span>
            </a>

            {/* Enlaces Desktop */}
            <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.id);
                  }}
                  className="rounded-full px-2 py-1 text-[13px] font-medium text-[#1D1D1F]/80 transition-colors hover:text-[#1D1D1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Controles Derecha: Área de Propietarios + WhatsApp */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleToggleOwnerArea}
                aria-pressed={ownerMode}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] sm:px-3.5 sm:text-[13px] ${
                  ownerMode
                    ? 'bg-[#0066CC] text-white shadow-[0_6px_20px_rgba(0,102,204,0.35)]'
                    : 'border border-white/60 bg-white/75 text-[#1D1D1F] shadow-sm hover:bg-white'
                }`}
              >
                {ownerMode ? (
                  <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">Área de Propietarios</span>
                <span className="sm:hidden">{ownerMode ? 'Bloquear' : 'Propietarios'}</span>
                <span
                  className={`hidden md:inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    ownerMode ? 'bg-white/20 text-white' : 'bg-[#1D1D1F]/5 text-[#6E6E73]'
                  }`}
                >
                  {ownerMode ? 'Activa' : 'Acceso'}
                </span>
              </button>

              <a
                href={OFFICE_INFO.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#1D1D1F] px-3.5 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-[#333336] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/70 text-[#1D1D1F] transition-colors hover:bg-white lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Menú desplegable móvil Liquid Glass */}
        {mobileMenuOpen && (
          <nav
            aria-label="Navegación móvil"
            className={`mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden ${GLASS_LIGHT}`}
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    scrollToSection(link.id);
                  }}
                  className="flex min-h-[44px] items-center justify-between rounded-2xl px-3.5 text-[15px] font-medium text-[#1D1D1F] transition-colors hover:bg-white/70"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-[#6E6E73]" aria-hidden="true" />
                </a>
              ))}
              <a
                href={OFFICE_INFO.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1D1D1F] px-4 text-[14px] font-medium text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>WhatsApp {OFFICE_INFO.whatsappDisplay}</span>
              </a>
            </div>
          </nav>
        )}

        {/* Barra Contextual del Área de Propietarios (Demo Live Edit) */}
        {ownerMode && (
          <div
            className={`mx-auto mt-2.5 flex max-w-6xl flex-col gap-2.5 rounded-3xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${GLASS_DARK} text-white`}
          >
            <div className="flex items-center gap-2.5 text-[13px]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0066CC] text-white">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <p className="leading-snug text-white/90">
                <strong className="font-semibold text-white">Modo Edición activo:</strong> editá
                precios, textos o fotos en vivo. Todo se guarda en este navegador.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#0066CC] px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-[#0077ED] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Nueva Propiedad</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangeKeyError('');
                  setNewKeyInput('');
                  setConfirmKeyInput('');
                  setChangeKeyOpen(true);
                }}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-white/20"
              >
                <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Cambiar clave</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-white/20"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Restaurar original</span>
              </button>
              <button
                type="button"
                onClick={handleToggleOwnerArea}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-red-400/40 bg-red-500/20 px-3.5 py-1.5 text-[13px] font-medium text-red-100 transition-colors hover:bg-red-500/35"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Bloquear</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <main>
        {/* 2. Hero Section de Alto Impacto */}
        <section id="inicio" className="px-4 pt-5 pb-12 sm:px-6 sm:pt-7 sm:pb-16">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#1D1D1F] shadow-[0_24px_64px_rgba(0,0,0,0.14)]">
            <img
              src={HERO_IMAGE}
              alt="Arquitectura contemporánea luminosa en Maldonado y Punta del Este"
              className="h-[520px] w-full object-cover object-center sm:h-[580px] lg:h-[620px]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/25"
              aria-hidden="true"
            />

            {/* Tarjeta Central Flotante en Liquid Glass */}
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
              <div
                className={`w-full max-w-3xl rounded-[28px] p-6 text-center sm:p-10 lg:p-12 ${GLASS_LIGHT}`}
              >
                <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1D1D1F] shadow-sm">
                  <Compass className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
                  <span>Maldonado · Punta del Este · Zonas Rurales</span>
                </div>

                <h1 className="text-[30px] font-semibold leading-[1.06] tracking-tight text-[#1D1D1F] sm:text-[46px] lg:text-[54px]">
                  Desde 1958 construyendo confianza en Maldonado.
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-[1.5] text-[#1D1D1F]/80 sm:text-[18px]">
                  Más de seis décadas en ventas, alquileres y administración de propiedades en
                  Maldonado, Punta del Este y zonas rurales.
                </p>

                <div className="mt-7 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-5">
                  <button
                    type="button"
                    onClick={() => scrollToSection('propiedades')}
                    className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#1D1D1F] px-7 py-3 text-[15px] font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#333336] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0066CC]/35 sm:w-auto"
                  >
                    Explorar catálogo
                  </button>

                  <a
                    href={buildWhatsAppUrl(
                      'Hola Montañés Propiedades, quisiera recibir asesoramiento sobre propiedades disponibles.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[44px] items-center justify-center gap-1 rounded-full px-4 py-2 text-[15px] font-semibold text-[#0066CC] transition-colors hover:text-[#004FA3] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0066CC]/30"
                  >
                    <span>Contactar por WhatsApp</span>
                    <ChevronRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Buscador Inteligente en Liquid Glass + 4. Catálogo de Propiedades */}
        <section id="propiedades" className="relative px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            {/* Encabezado de Sección */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0066CC]">
                  Vitrina de Propiedades
                </p>
                <h2 className="mt-1 text-[28px] font-semibold tracking-tight text-[#1D1D1F] sm:text-[38px]">
                  Propiedades Destacadas
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[13px] font-medium text-[#6E6E73]">
                  Mostrando <strong className="text-[#1D1D1F]">{filteredProperties.length}</strong> de{' '}
                  {properties.length} propiedades
                </span>
                {ownerMode && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#0066CC] px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-[#0055B3]"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>+ Nueva Propiedad</span>
                  </button>
                )}
              </div>
            </div>

            {/* Buscador Inteligente en Liquid Glass */}
            <div className={`mb-8 rounded-3xl p-3.5 sm:p-5 ${GLASS_LIGHT}`}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {/* Búsqueda por texto o Ref. */}
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E73]"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por texto o Ref. (ej. 10664, La Loma, Volta...)"
                    aria-label="Buscar por texto o referencia"
                    className="min-h-[46px] w-full rounded-2xl border border-white/60 bg-white/80 pl-11 pr-10 text-[14px] text-[#1D1D1F] placeholder-[#6E6E73] shadow-inner transition-colors focus:border-[#0066CC] focus:bg-white focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Limpiar búsqueda"
                      className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6E73] hover:bg-black/5 hover:text-[#1D1D1F]"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Botón filtros en móvil */}
                <div className="flex items-center justify-between gap-2 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen((prev) => !prev)}
                    aria-expanded={mobileFiltersOpen}
                    className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 text-[13px] font-semibold text-[#1D1D1F]"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                    <span>{mobileFiltersOpen ? 'Ocultar filtros' : 'Categoría, Zona y Orden'}</span>
                  </button>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetSearchFilters}
                      className="inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-white/60 bg-white/80 px-3.5 text-[13px] font-medium text-[#0066CC]"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Selectores Zona y Orden (desktop siempre visible, mobile colapsable) */}
                <div
                  className={`${
                    mobileFiltersOpen ? 'grid' : 'hidden'
                  } grid-cols-1 gap-2.5 sm:grid-cols-2 lg:flex lg:items-center`}
                >
                  <label className="flex flex-col gap-1 lg:w-48">
                    <span className="sr-only">Filtrar por zona</span>
                    <select
                      value={zoneFilter}
                      onChange={(e) => setZoneFilter(e.target.value)}
                      aria-label="Filtrar por zona"
                      className="min-h-[46px] w-full rounded-2xl border border-white/60 bg-white/80 px-3.5 text-[13px] font-medium text-[#1D1D1F] focus:border-[#0066CC] focus:bg-white focus:outline-none"
                    >
                      {ZONES.map((z) => (
                        <option key={z} value={z}>
                          {z === 'Todas' ? 'Zona: Todas' : z}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 lg:w-52">
                    <span className="sr-only">Ordenar por precio</span>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      aria-label="Ordenar por precio"
                      className="min-h-[46px] w-full rounded-2xl border border-white/60 bg-white/80 px-3.5 text-[13px] font-medium text-[#1D1D1F] focus:border-[#0066CC] focus:bg-white focus:outline-none"
                    >
                      <option value="featured">Orden: Destacadas</option>
                      <option value="price-asc">Precio: Menor a mayor</option>
                      <option value="price-desc">Precio: Mayor a menor</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Píldoras de Categoría (scroll horizontal cómodo en móvil) */}
              <div
                className={`${
                  mobileFiltersOpen ? 'flex' : 'hidden lg:flex'
                } mt-3 items-center justify-between gap-3 border-t border-black/[0.06] pt-3`}
              >
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {CATEGORIES.map((cat) => {
                    const active = categoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={`min-h-[36px] shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all ${
                          active
                            ? 'bg-[#1D1D1F] text-white shadow-sm'
                            : 'border border-white/70 bg-white/70 text-[#1D1D1F] hover:bg-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetSearchFilters}
                    className="hidden shrink-0 text-[13px] font-medium text-[#0066CC] hover:underline lg:inline-flex"
                  >
                    Restablecer filtros
                  </button>
                )}
              </div>
            </div>

            {/* Grilla de Propiedades */}
            {filteredProperties.length === 0 ? (
              <div className={`rounded-3xl p-10 text-center ${GLASS_LIGHT}`}>
                <Search className="mx-auto h-10 w-10 text-[#6E6E73]" aria-hidden="true" />
                <h3 className="mt-3 text-[18px] font-semibold text-[#1D1D1F]">
                  No encontramos propiedades con esos filtros
                </h3>
                <p className="mt-1 text-[14px] text-[#6E6E73]">
                  Probá limpiando los filtros o buscando por otro código de referencia.
                </p>
                <button
                  type="button"
                  onClick={resetSearchFilters}
                  className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#1D1D1F] px-6 text-[14px] font-medium text-white hover:bg-[#333336]"
                >
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((property) => (
                  <article
                    key={property.id}
                    className={`group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)] ${GLASS_LIGHT}`}
                  >
                    {/* Imagen protagonista clickable */}
                    <button
                      type="button"
                      onClick={() => setDetailProperty(property)}
                      className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8E8ED] text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0066CC]/40"
                    >
                      <img
                        src={property.image}
                        alt={property.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent"
                        aria-hidden="true"
                      />

                      {/* Píldora flotante arriba izquierda: Ref */}
                      <span
                        className={`absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-[#1D1D1F] ${GLASS_PILL}`}
                      >
                        Ref. {property.ref}
                      </span>

                      {/* Píldora flotante arriba derecha: Categoría */}
                      <span
                        className={`absolute right-3.5 top-3.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white ${GLASS_DARK}`}
                      >
                        {property.category}
                      </span>
                    </button>

                    {/* Contenido */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2 text-[12px] font-medium text-[#6E6E73]">
                        <span className="inline-flex items-center gap-1 truncate">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0066CC]" aria-hidden="true" />
                          <span className="truncate">{property.location}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-black/[0.05] px-2.5 py-0.5 text-[11px] font-semibold text-[#1D1D1F]">
                          {property.operation}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDetailProperty(property)}
                        className="mt-2 text-left focus:outline-none"
                      >
                        <h3 className="line-clamp-2 text-[18px] font-semibold leading-[1.25] tracking-tight text-[#1D1D1F] transition-colors group-hover:text-[#0066CC]">
                          {property.title}
                        </h3>
                      </button>

                      <p className="mt-2 line-clamp-2 text-[13px] leading-[1.5] text-[#6E6E73]">
                        {property.description}
                      </p>

                      {/* Especificaciones finas */}
                      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-black/[0.06] pt-3.5 text-[12px] font-medium text-[#424245]">
                        {property.customSpecs ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0066CC]/10 px-2.5 py-1 text-[12px] font-semibold text-[#0066CC]">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                            {property.customSpecs}
                          </span>
                        ) : (
                          <>
                            {property.bedrooms !== null && (
                              <span className="inline-flex items-center gap-1">
                                <BedDouble className="h-3.5 w-3.5 text-[#6E6E73]" aria-hidden="true" />
                                {property.bedrooms} Dorm.
                              </span>
                            )}
                            {property.bathrooms !== null && (
                              <span className="inline-flex items-center gap-1">
                                <Bath className="h-3.5 w-3.5 text-[#6E6E73]" aria-hidden="true" />
                                {property.bathrooms}{' '}
                                {property.bathrooms === 1 ? 'Baño' : 'Baños'}
                              </span>
                            )}
                            {property.area !== null && (
                              <span className="inline-flex items-center gap-1">
                                <Maximize2 className="h-3.5 w-3.5 text-[#6E6E73]" aria-hidden="true" />
                                {property.area} m²
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Precio USD + Ver Ficha */}
                      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E73]">
                            Precio
                          </p>
                          <p className="text-[22px] font-semibold tracking-tight text-[#1D1D1F]">
                            {formatUsd(property.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setDetailProperty(property)}
                          className="inline-flex min-h-[38px] items-center gap-1 rounded-full border border-black/10 bg-white/80 px-4 py-1.5 text-[13px] font-medium text-[#1D1D1F] shadow-sm transition-all hover:bg-[#1D1D1F] hover:text-white"
                        >
                          <span>Ver ficha</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Barra de Edición Rápida (Área de Propietarios) */}
                      {ownerMode && (
                        <div className="mt-4 flex items-center gap-2 border-t border-[#0066CC]/15 pt-3">
                          <button
                            type="button"
                            onClick={() => openEditModal(property)}
                            className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#0066CC] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0055B3]"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(property)}
                            aria-label={`Eliminar propiedad Ref. ${property.ref}`}
                            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-2xl border border-red-200 bg-red-50/80 px-3.5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. Bento Grid de Servicios y Trayectoria (Desde 1958) */}
        <section id="servicios" className="bg-[#F5F5F7] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0066CC]">
                Servicios Integrales
              </p>
              <h2 className="mt-1 text-[28px] font-semibold tracking-tight text-[#1D1D1F] sm:text-[40px]">
                Asesoramiento inmobiliario con historia y precisión.
              </h2>
            </div>

            {/* Bento Grid Asimétrico */}
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-6">
              {/* Bloque Claro Principal: Ventas */}
              <div className={`flex flex-col justify-between rounded-3xl p-6 sm:p-8 md:col-span-3 ${GLASS_LIGHT}`}>
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0066CC]/10 text-[#0066CC]">
                    <Home className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[24px] font-semibold tracking-tight text-[#1D1D1F]">
                    Ventas
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.55] text-[#6E6E73]">
                    Acompañamiento integral en cada etapa de la negociación: tasación realista,
                    estrategia comercial, documentación y cierre seguro en Maldonado, Punta del Este
                    y zonas rurales.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold text-[#0066CC]">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>Gestión personalizada de principio a fin</span>
                </div>
              </div>

              {/* Bloque Claro: Alquileres */}
              <div className={`flex flex-col justify-between rounded-3xl p-6 sm:p-8 md:col-span-3 ${GLASS_LIGHT}`}>
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1D1D1F]/5 text-[#1D1D1F]">
                    <KeyRound className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[24px] font-semibold tracking-tight text-[#1D1D1F]">
                    Alquileres
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.55] text-[#6E6E73]">
                    Especialistas en alquileres de larga duración con selección rigurosa de
                    inquilinos, contratos claros y respaldo oficial mediante{' '}
                    <strong className="font-semibold text-[#1D1D1F]">garantía FIDECIU</strong>.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold text-[#1D1D1F]">
                  <ShieldCheck className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                  <span>Especialistas en larga duración · Garantía FIDECIU</span>
                </div>
              </div>

              {/* Bloque Oscuro Contrastante (#000000): Administración desde 1958 */}
              <div
                id="trayectoria"
                className="relative overflow-hidden rounded-3xl bg-[#000000] p-7 text-white shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:p-9 md:col-span-4"
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#0066CC]/30 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5AC8FA]">
                      Trayectoria desde 1958
                    </span>
                    <h3 className="mt-4 text-[26px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[32px]">
                      Administración de Propiedades desde el año 1958.
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-white/75">
                      Más de seis décadas cuidando el patrimonio de propietarios en todo el
                      departamento de Maldonado. Cobranza transparente, mantenimiento preventivo y
                      rendición mensual ordenada para tu tranquilidad.
                    </p>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-[26px] font-semibold tracking-tight text-white">+65</p>
                      <p className="text-[12px] text-white/65">Años de trayectoria</p>
                    </div>
                    <div>
                      <p className="text-[26px] font-semibold tracking-tight text-white">1958</p>
                      <p className="text-[12px] text-white/65">Año de fundación</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[26px] font-semibold tracking-tight text-white">100%</p>
                      <p className="text-[12px] text-white/65">Respaldo institucional</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloque Claro Lateral: Respaldos Institucionales */}
              <div className={`flex flex-col justify-between rounded-3xl p-6 sm:p-7 md:col-span-2 ${GLASS_LIGHT}`}>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0066CC]">
                    Respaldo Oficial
                  </p>
                  <h3 className="mt-1 text-[20px] font-semibold tracking-tight text-[#1D1D1F]">
                    Acreditaciones
                  </h3>
                </div>

                <ul className="mt-4 space-y-3">
                  {INSTITUTIONAL_BADGES.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <li
                        key={badge.title}
                        className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/75 p-3 shadow-sm"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0066CC]/10 text-[#0066CC]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#1D1D1F]">{badge.title}</p>
                          <p className="text-[11px] leading-snug text-[#6E6E73]">{badge.detail}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Contacto Directo */}
        <section id="contacto" className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={`grid grid-cols-1 gap-8 rounded-[32px] p-6 sm:p-10 lg:grid-cols-12 ${GLASS_LIGHT}`}>
              {/* Datos oficiales */}
              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0066CC]">
                    Contacto Directo
                  </p>
                  <h2 className="mt-1.5 text-[28px] font-semibold leading-[1.12] tracking-tight text-[#1D1D1F] sm:text-[36px]">
                    Hablemos sobre tu próxima propiedad.
                  </h2>
                  <p className="mt-3 text-[15px] leading-[1.55] text-[#6E6E73]">
                    Visitá nuestra oficina en el corazón de Maldonado o escribinos directamente por
                    WhatsApp para coordinar una visita o tasación.
                  </p>

                  <div className="mt-7 space-y-3.5">
                    <div className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 p-3.5">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0066CC]" aria-hidden="true" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                          Dirección
                        </p>
                        <p className="text-[14px] font-medium text-[#1D1D1F]">
                          {OFFICE_INFO.address}
                        </p>
                      </div>
                    </div>

                    <a
                      href={OFFICE_INFO.phoneHref}
                      className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 p-3.5 transition-colors hover:bg-white"
                    >
                      <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#0066CC]" aria-hidden="true" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                          Teléfono fijo
                        </p>
                        <p className="text-[14px] font-medium text-[#1D1D1F]">
                          {OFFICE_INFO.phone}
                        </p>
                      </div>
                    </a>

                    <a
                      href={OFFICE_INFO.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 p-3.5 transition-colors hover:bg-white"
                    >
                      <MessageCircle
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#0066CC]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                          WhatsApp / Celular
                        </p>
                        <p className="text-[14px] font-semibold text-[#0066CC]">
                          {OFFICE_INFO.whatsappDisplay}
                        </p>
                      </div>
                    </a>

                    <a
                      href={OFFICE_INFO.emailHref}
                      className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 p-3.5 transition-colors hover:bg-white"
                    >
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#0066CC]" aria-hidden="true" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                          Email
                        </p>
                        <p className="text-[14px] font-medium text-[#1D1D1F]">
                          {OFFICE_INFO.email}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulario en Liquid Glass */}
              <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm sm:p-7 lg:col-span-7">
                {contactSubmitted ? (
                  <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0066CC]/10 text-[#0066CC]">
                      <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-[22px] font-semibold tracking-tight text-[#1D1D1F]">
                      ¡Gracias por tu consulta, {contactValues.nombre}!
                    </h3>
                    <p className="mt-2 max-w-md text-[14px] text-[#6E6E73]">
                      Un asesor de Montañés Propiedades se comunicará a{' '}
                      <strong className="text-[#1D1D1F]">{contactValues.contacto}</strong> a la
                      brevedad.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <a
                        href={buildWhatsAppUrl(
                          `Hola Montañés Propiedades, soy ${contactValues.nombre}. ${contactValues.mensaje}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#1D1D1F] px-6 text-[14px] font-medium text-white hover:bg-[#333336]"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        <span>Enviar también por WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setContactSubmitted(false);
                          setContactSubmitAttempted(false);
                          setContactTouched({});
                          setContactValues({ nombre: '', contacto: '', referencia: '', mensaje: '' });
                        }}
                        className="inline-flex min-h-[44px] items-center rounded-full border border-black/15 px-5 text-[14px] font-medium text-[#1D1D1F] hover:bg-black/5"
                      >
                        Nueva consulta
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-nombre"
                          className="mb-1.5 block text-[13px] font-medium text-[#1D1D1F]"
                        >
                          Nombre completo
                        </label>
                        <input
                          ref={nombreInputRef}
                          id="contact-nombre"
                          type="text"
                          value={contactValues.nombre}
                          onChange={(e) =>
                            setContactValues((prev) => ({ ...prev, nombre: e.target.value }))
                          }
                          onBlur={() => setContactTouched((prev) => ({ ...prev, nombre: true }))}
                          placeholder="Ej. María Rodríguez"
                          className="min-h-[46px] w-full rounded-2xl border border-black/10 bg-white px-4 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                        />
                        {showContactError('nombre') && (
                          <p className="mt-1 text-[12px] text-red-600">{contactErrors.nombre}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-contacto"
                          className="mb-1.5 block text-[13px] font-medium text-[#1D1D1F]"
                        >
                          Teléfono o Email
                        </label>
                        <input
                          id="contact-contacto"
                          type="text"
                          value={contactValues.contacto}
                          onChange={(e) =>
                            setContactValues((prev) => ({ ...prev, contacto: e.target.value }))
                          }
                          onBlur={() => setContactTouched((prev) => ({ ...prev, contacto: true }))}
                          placeholder="094 000 000 o correo@ejemplo.uy"
                          className="min-h-[46px] w-full rounded-2xl border border-black/10 bg-white px-4 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                        />
                        {showContactError('contacto') && (
                          <p className="mt-1 text-[12px] text-red-600">{contactErrors.contacto}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-referencia"
                        className="mb-1.5 block text-[13px] font-medium text-[#1D1D1F]"
                      >
                        Propiedad o referencia de interés (opcional)
                      </label>
                      <input
                        id="contact-referencia"
                        type="text"
                        value={contactValues.referencia}
                        onChange={(e) =>
                          setContactValues((prev) => ({ ...prev, referencia: e.target.value }))
                        }
                        placeholder="Ej. Ref. 10664 o tasación de propiedad"
                        className="min-h-[46px] w-full rounded-2xl border border-black/10 bg-white px-4 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-mensaje"
                        className="mb-1.5 block text-[13px] font-medium text-[#1D1D1F]"
                      >
                        Mensaje
                      </label>
                      <textarea
                        id="contact-mensaje"
                        rows={4}
                        value={contactValues.mensaje}
                        onChange={(e) =>
                          setContactValues((prev) => ({ ...prev, mensaje: e.target.value }))
                        }
                        onBlur={() => setContactTouched((prev) => ({ ...prev, mensaje: true }))}
                        placeholder="Contanos en qué podemos ayudarte..."
                        className="w-full rounded-2xl border border-black/10 bg-white p-4 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                      />
                      {showContactError('mensaje') && (
                        <p className="mt-1 text-[12px] text-red-600">{contactErrors.mensaje}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="submit"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#0066CC] px-7 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#0055B3] active:scale-[0.98]"
                      >
                        <span>Enviar consulta</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>

                      <a
                        href={buildWhatsAppUrl(
                          contactValues.mensaje.trim() ||
                            'Hola Montañés Propiedades, quiero consultar sobre una propiedad.'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-[13px] font-semibold text-[#1D1D1F] hover:bg-[#F5F5F7]"
                      >
                        <MessageCircle className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                        <span>Escribir directo por WhatsApp</span>
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-black/[0.06] bg-[#F5F5F7] px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-[#1D1D1F]">
              {OFFICE_INFO.brand} <span className="font-normal text-[#6E6E73]">· {OFFICE_INFO.since}</span>
            </p>
            <p className="mt-1 text-[13px] text-[#6E6E73]">{OFFICE_INFO.address}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#6E6E73]">
            <span>Miembro CIPEM</span>
            <span>Miembro CIU</span>
            <span>Garantía FIDECIU</span>
            <span className="font-medium text-[#1D1D1F]">
              © {new Date().getFullYear()} {OFFICE_INFO.domain}
            </span>
          </div>
        </div>
      </footer>

      {/* Barra inferior rápida táctil en móvil */}
      <div className="fixed inset-x-3 bottom-3 z-30 md:hidden">
        <div className={`flex items-center justify-between gap-2 rounded-full px-3 py-2 ${GLASS_LIGHT}`}>
          <button
            type="button"
            onClick={() => scrollToSection('propiedades')}
            className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full bg-white/80 px-3 text-[12px] font-semibold text-[#1D1D1F]"
          >
            <Search className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
            <span>Catálogo</span>
          </button>
          <button
            type="button"
            onClick={handleToggleOwnerArea}
            className={`inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-semibold ${
              ownerMode ? 'bg-[#0066CC] text-white' : 'bg-white/80 text-[#1D1D1F]'
            }`}
          >
            {ownerMode ? (
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{ownerMode ? 'Bloquear' : 'Propietarios'}</span>
          </button>
          <a
            href={OFFICE_INFO.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1D1D1F] px-3 text-[12px] font-semibold text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Modal 1: Vista Detallada de Propiedad (Liquid Glass) */}
      {detailProperty && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-md sm:items-center sm:p-6"
          onClick={() => setDetailProperty(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[32px] border border-white/50 bg-white/85 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:rounded-[32px]"
          >
            <div className="relative h-64 w-full overflow-hidden bg-[#E8E8ED] sm:h-80">
              <img
                src={detailProperty.image}
                alt={detailProperty.title}
                className="h-full w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30"
                aria-hidden="true"
              />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className={`rounded-full px-3.5 py-1 text-[12px] font-semibold text-[#1D1D1F] ${GLASS_PILL}`}>
                  Ref. {detailProperty.ref}
                </span>
                <span className={`rounded-full px-3.5 py-1 text-[12px] font-semibold text-white ${GLASS_DARK}`}>
                  {detailProperty.operation} · {detailProperty.category}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setDetailProperty(null)}
                aria-label="Cerrar detalle de propiedad"
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-[#1D1D1F] transition-transform hover:scale-105 ${GLASS_PILL}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6E6E73]">
                    <MapPin className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                    <span>{detailProperty.location}</span>
                  </p>
                  <h3
                    id="detail-modal-title"
                    className="mt-1 text-[22px] font-semibold leading-[1.15] tracking-tight text-[#1D1D1F] sm:text-[28px]"
                  >
                    {detailProperty.title}
                  </h3>
                </div>

                <div className="shrink-0 sm:text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                    Valor en {detailProperty.operation}
                  </p>
                  <p className="text-[26px] font-semibold tracking-tight text-[#1D1D1F]">
                    {formatUsd(detailProperty.price)}
                  </p>
                </div>
              </div>

              {/* Fichas técnicas */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {detailProperty.customSpecs ? (
                  <div className="col-span-2 rounded-2xl border border-white/60 bg-white/75 p-3.5 sm:col-span-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                      Enfoque de la propiedad
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-[#0066CC]">
                      {detailProperty.customSpecs}
                    </p>
                  </div>
                ) : (
                  <>
                    {detailProperty.bedrooms !== null && (
                      <div className="rounded-2xl border border-white/60 bg-white/75 p-3.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                          Dormitorios
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-[15px] font-semibold text-[#1D1D1F]">
                          <BedDouble className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                          {detailProperty.bedrooms}
                        </p>
                      </div>
                    )}
                    {detailProperty.bathrooms !== null && (
                      <div className="rounded-2xl border border-white/60 bg-white/75 p-3.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                          Baños
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-[15px] font-semibold text-[#1D1D1F]">
                          <Bath className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                          {detailProperty.bathrooms}
                        </p>
                      </div>
                    )}
                    {detailProperty.area !== null && (
                      <div className="rounded-2xl border border-white/60 bg-white/75 p-3.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                          Superficie
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-[15px] font-semibold text-[#1D1D1F]">
                          <Maximize2 className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                          {detailProperty.area} m²
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <p className="mt-5 text-[15px] leading-[1.6] text-[#424245]">
                {detailProperty.description}
              </p>

              <div className="mt-7 flex flex-col gap-3 border-t border-black/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {ownerMode && (
                    <button
                      type="button"
                      onClick={() => openEditModal(detailProperty)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-black/15 bg-white px-4 text-[13px] font-semibold text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7]"
                    >
                      <Pencil className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
                      <span>Editar esta ficha</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openContactForProperty(detailProperty)}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-black/15 bg-white px-4 text-[13px] font-semibold text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7]"
                  >
                    Consultar por formulario
                  </button>
                </div>

                <a
                  href={buildWhatsAppUrl(
                    `Hola Montañés Propiedades, quiero consultar por la propiedad Ref. ${detailProperty.ref}: "${detailProperty.title}" (${formatUsd(detailProperty.price)}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#0066CC] px-6 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#0055B3]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Consultar por WhatsApp (Ref. {detailProperty.ref})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Editor / Creador de Propiedad ("Área de Propietarios") */}
      {ownerMode && editorState && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-md sm:items-center sm:p-6"
          onClick={() => setEditorState(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:rounded-[32px] sm:p-8"
          >
            <div className="flex items-center justify-between gap-3 border-b border-black/[0.08] pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0066CC]">
                  Área de Propietarios
                </p>
                <h3
                  id="editor-modal-title"
                  className="text-[22px] font-semibold tracking-tight text-[#1D1D1F]"
                >
                  {editorState.mode === 'create'
                    ? 'Agregar nueva propiedad'
                    : `Editar propiedad · Ref. ${editorState.draft.ref}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditorState(null)}
                aria-label="Cerrar editor"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-[#1D1D1F] hover:bg-black/10"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="mt-5 space-y-4">
              {/* Vista previa y cambio de fotografía */}
              <div className="rounded-3xl border border-black/10 bg-[#F5F5F7]/80 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-[#E8E8ED] sm:w-40">
                    <img
                      src={editorState.draft.image || DEFAULT_FALLBACK_IMAGE}
                      alt="Vista previa de la propiedad"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <label
                      htmlFor="edit-image-url"
                      className="block text-[12px] font-semibold text-[#1D1D1F]"
                    >
                      Fotografía (URL o subir archivo desde PC / celular)
                    </label>
                    <input
                      id="edit-image-url"
                      type="text"
                      value={editorState.draft.image}
                      onChange={(e) => updateDraft('image', e.target.value)}
                      placeholder="https://... o foto subida desde el dispositivo"
                      className="min-h-[40px] w-full rounded-xl border border-black/10 bg-white px-3 text-[13px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageFileUpload}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#1D1D1F] px-4 text-[12px] font-semibold text-white hover:bg-[#333336]"
                      >
                        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Subir foto desde dispositivo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateDraft('image', DEFAULT_FALLBACK_IMAGE)}
                        className="inline-flex min-h-[38px] items-center gap-1 rounded-full border border-black/10 bg-white px-3 text-[12px] font-medium text-[#6E6E73] hover:text-[#1D1D1F]"
                      >
                        <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Foto por defecto</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Título y Ref */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-4">
                <div className="sm:col-span-3">
                  <label htmlFor="edit-title" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Título de la publicación
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    required
                    value={editorState.draft.title}
                    onChange={(e) => updateDraft('title', e.target.value)}
                    placeholder="Ej. Casa en venta en Maldonado..."
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="edit-ref" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Código Ref.
                  </label>
                  <input
                    id="edit-ref"
                    type="text"
                    required
                    value={editorState.draft.ref}
                    onChange={(e) => updateDraft('ref', e.target.value)}
                    placeholder="10664"
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  />
                </div>
              </div>

              {/* Operación, Categoría, Zona */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                <div>
                  <label htmlFor="edit-operation" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Operación
                  </label>
                  <select
                    id="edit-operation"
                    value={editorState.draft.operation}
                    onChange={(e) => updateDraft('operation', e.target.value)}
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  >
                    <option value="Venta">Venta</option>
                    <option value="Alquiler">Alquiler</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-category" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Categoría
                  </label>
                  <select
                    id="edit-category"
                    value={editorState.draft.category}
                    onChange={(e) => updateDraft('category', e.target.value)}
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Terrenos/Desarrollo">Terrenos/Desarrollo</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-zone" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Zona
                  </label>
                  <select
                    id="edit-zone"
                    value={editorState.draft.zone}
                    onChange={(e) => updateDraft('zone', e.target.value)}
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  >
                    {ZONES.filter((z) => z !== 'Todas').map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ubicación visible y Precio USD */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-location" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Ubicación visible en tarjeta
                  </label>
                  <input
                    id="edit-location"
                    type="text"
                    value={editorState.draft.location}
                    onChange={(e) => updateDraft('location', e.target.value)}
                    placeholder="Ej. La Loma, Maldonado"
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="edit-price" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Precio en USD
                  </label>
                  <input
                    id="edit-price"
                    type="number"
                    min="1"
                    required
                    value={editorState.draft.price}
                    onChange={(e) => updateDraft('price', e.target.value)}
                    placeholder="185000"
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  />
                </div>
              </div>

              {/* Dormitorios, Baños, m² */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="edit-bedrooms" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Dormitorios
                  </label>
                  <input
                    id="edit-bedrooms"
                    type="number"
                    min="0"
                    value={editorState.draft.bedrooms}
                    onChange={(e) => updateDraft('bedrooms', e.target.value)}
                    placeholder="2"
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="edit-bathrooms" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Baños
                  </label>
                  <input
                    id="edit-bathrooms"
                    type="number"
                    min="0"
                    value={editorState.draft.bathrooms}
                    onChange={(e) => updateDraft('bathrooms', e.target.value)}
                    placeholder="1"
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="edit-area" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                    Superficie (m²)
                  </label>
                  <input
                    id="edit-area"
                    type="number"
                    min="0"
                    value={editorState.draft.area}
                    onChange={(e) => updateDraft('area', e.target.value)}
                    placeholder="70"
                    className="min-h-[44px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-custom-specs" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                  Etiqueta especial opcional (ej. Desarrollo / Renta)
                </label>
                <input
                  id="edit-custom-specs"
                  type="text"
                  value={editorState.draft.customSpecs}
                  onChange={(e) => updateDraft('customSpecs', e.target.value)}
                  placeholder="Dejar vacío para mostrar Dormitorios / Baños / m²"
                  className="min-h-[42px] w-full rounded-2xl border border-black/10 bg-white px-3.5 text-[13px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]">
                  Descripción
                </label>
                <textarea
                  id="edit-description"
                  rows={3}
                  value={editorState.draft.description}
                  onChange={(e) => updateDraft('description', e.target.value)}
                  placeholder="Descripción breve y clara de la propiedad..."
                  className="w-full rounded-2xl border border-black/10 bg-white p-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse gap-2.5 border-t border-black/[0.08] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditorState(null)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-black/15 px-5 text-[14px] font-medium text-[#1D1D1F] hover:bg-black/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#0066CC] px-6 text-[14px] font-semibold text-white shadow-sm hover:bg-[#0055B3]"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {editorState.mode === 'create' ? 'Publicar propiedad' : 'Guardar cambios'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Confirmar eliminación */}
      {ownerMode && deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-6 text-center shadow-2xl backdrop-blur-2xl"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 id="delete-dialog-title" className="mt-4 text-[19px] font-semibold text-[#1D1D1F]">
              ¿Eliminar Ref. {deleteTarget.ref}?
            </h3>
            <p className="mt-1.5 text-[14px] text-[#6E6E73]">
              Vas a quitar &ldquo;{deleteTarget.title}&rdquo; del catálogo de la demo. Podés
              restaurar el listado original en cualquier momento.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="min-h-[44px] flex-1 rounded-full border border-black/15 text-[14px] font-medium text-[#1D1D1F] hover:bg-black/5"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteProperty}
                className="min-h-[44px] flex-1 rounded-full bg-red-600 text-[14px] font-semibold text-white hover:bg-red-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Confirmar restauración del catálogo original */}
      {ownerMode && confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setConfirmResetOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-6 text-center shadow-2xl backdrop-blur-2xl"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0066CC]/10 text-[#0066CC]">
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 id="reset-dialog-title" className="mt-4 text-[19px] font-semibold text-[#1D1D1F]">
              ¿Restaurar catálogo original?
            </h3>
            <p className="mt-1.5 text-[14px] text-[#6E6E73]">
              Se descartarán las ediciones locales y volverán las 9 propiedades iniciales de
              Montañés Propiedades.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="min-h-[44px] flex-1 rounded-full border border-black/15 text-[14px] font-medium text-[#1D1D1F] hover:bg-black/5"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRestoreCatalog}
                className="min-h-[44px] flex-1 rounded-full bg-[#1D1D1F] text-[14px] font-semibold text-white hover:bg-[#333336]"
              >
                Restaurar catálogo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Autenticación Segura del Área de Propietarios */}
      {authModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
          onClick={() => setAuthModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0066CC]/10 text-[#0066CC]">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0066CC]">
                    Acceso Protegido
                  </p>
                  <h3
                    id="auth-dialog-title"
                    className="text-[20px] font-semibold tracking-tight text-[#1D1D1F]"
                  >
                    Área de Propietarios
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                aria-label="Cerrar acceso de propietarios"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-[#1D1D1F] hover:bg-black/10"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-[#6E6E73]">
              Ingresá la clave de administración de Montañés Propiedades para habilitar la edición,
              carga o eliminación de fichas.
            </p>

            <form onSubmit={handleAuthSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="owner-auth-password"
                  className="mb-1.5 block text-[12px] font-semibold text-[#1D1D1F]"
                >
                  Clave de propietario
                </label>
                <div className="relative">
                  <input
                    id="owner-auth-password"
                    type={showAuthPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    autoFocus
                    disabled={lockSecondsLeft > 0 || authBusy}
                    value={authPassword}
                    onChange={(e) => {
                      setAuthPassword(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Ingresá tu clave..."
                    className="min-h-[46px] w-full rounded-2xl border border-black/15 bg-white pl-4 pr-11 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none disabled:bg-black/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword((prev) => !prev)}
                    aria-label={showAuthPassword ? 'Ocultar clave' : 'Mostrar clave'}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6E73] hover:bg-black/5 hover:text-[#1D1D1F]"
                  >
                    {showAuthPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {(authError || lockSecondsLeft > 0) && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50/90 p-3 text-[13px] text-red-700"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    {lockSecondsLeft > 0
                      ? `Acceso bloqueado temporalmente por seguridad. Reintentá en ${lockSecondsLeft}s.`
                      : authError}
                  </span>
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(false)}
                  className="min-h-[44px] flex-1 rounded-full border border-black/15 text-[14px] font-medium text-[#1D1D1F] hover:bg-black/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={lockSecondsLeft > 0 || authBusy}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0066CC] text-[14px] font-semibold text-white shadow-sm hover:bg-[#0055B3] disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <span>{authBusy ? 'Verificando...' : 'Desbloquear'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Cambiar Clave de Propietario */}
      {ownerMode && changeKeyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
          onClick={() => setChangeKeyOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-key-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0066CC]">
                  Seguridad
                </p>
                <h3
                  id="change-key-title"
                  className="text-[20px] font-semibold tracking-tight text-[#1D1D1F]"
                >
                  Cambiar clave de acceso
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setChangeKeyOpen(false)}
                aria-label="Cerrar cambio de clave"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-[#1D1D1F] hover:bg-black/10"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveNewOwnerKey} className="mt-4 space-y-3.5">
              <div>
                <label
                  htmlFor="new-owner-key"
                  className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]"
                >
                  Nueva clave (mínimo 4 caracteres)
                </label>
                <input
                  id="new-owner-key"
                  type="password"
                  autoComplete="new-password"
                  value={newKeyInput}
                  onChange={(e) => {
                    setNewKeyInput(e.target.value);
                    if (changeKeyError) setChangeKeyError('');
                  }}
                  className="min-h-[44px] w-full rounded-2xl border border-black/15 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-owner-key"
                  className="mb-1 block text-[12px] font-semibold text-[#1D1D1F]"
                >
                  Confirmar nueva clave
                </label>
                <input
                  id="confirm-owner-key"
                  type="password"
                  autoComplete="new-password"
                  value={confirmKeyInput}
                  onChange={(e) => {
                    setConfirmKeyInput(e.target.value);
                    if (changeKeyError) setChangeKeyError('');
                  }}
                  className="min-h-[44px] w-full rounded-2xl border border-black/15 bg-white px-3.5 text-[14px] text-[#1D1D1F] focus:border-[#0066CC] focus:outline-none"
                />
              </div>

              {changeKeyError && (
                <p role="alert" className="text-[12px] font-medium text-red-600">
                  {changeKeyError}
                </p>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setChangeKeyOpen(false)}
                  className="min-h-[44px] flex-1 rounded-full border border-black/15 text-[14px] font-medium text-[#1D1D1F] hover:bg-black/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 rounded-full bg-[#0066CC] text-[14px] font-semibold text-white hover:bg-[#0055B3]"
                >
                  Guardar clave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
