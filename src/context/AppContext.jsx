import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import {
  initialStoreInfo,
  initialProducts,
  initialCustomers,
  initialPrescriptions,
  initialSales,
  initialPayments,
  initialSuppliers,
  initialRepairs,
  initialAppointments,
  initialActivities
} from '../data/initialData';

const AppContext = createContext();

// Helper mappers from backend MySQL format to frontend format
const mapCustomer = (c) => ({
  id: c.Customer_id,
  Customer_id: c.Customer_id,
  name: c.full_name,
  full_name: c.full_name,
  phone: c.phone || '',
  email: c.email || '',
  address: c.address || '',
  registrationDate: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  created_at: c.created_at,
  totalPurchases: c.totalPurchases || 0,
  totalSpent: c.totalSpent || 0,
  pendingBalance: c.pendingBalance || 0,
  tag: 'Regular'
});

const mapProduct = (p) => {
  const stock = Number(p.stock_quantity) || 0;
  const status = stock <= 0 ? 'out_of_stock' : stock <= 5 ? 'low_stock' : 'in_stock';
  return {
    id: p.product_id,
    product_id: p.product_id,
    name: p.product_name,
    product_name: p.product_name,
    brand: p.brand || '',
    model: p.model_number || '',
    model_number: p.model_number || '',
    sku: `SKU-${p.product_id.toString().padStart(4, '0')}`,
    category: p.category_name || 'Frames',
    category_id: p.category_id,
    sellingPrice: Number(p.selling_price) || 0,
    costPrice: Math.round(Number(p.selling_price) * 0.6) || 0,
    stock,
    stock_quantity: stock,
    status,
    description: p.description || '',
    created_at: p.created_at
  };
};

const mapPrescription = (rx) => {
  const rSph = rx.right_sph !== null && rx.right_sph !== undefined ? (rx.right_sph > 0 ? `+${rx.right_sph}` : `${rx.right_sph}`) : '0.00';
  const rCyl = rx.right_cyl !== null && rx.right_cyl !== undefined ? (rx.right_cyl > 0 ? `+${rx.right_cyl}` : `${rx.right_cyl}`) : '0.00';
  const rAxis = rx.right_axis ? `${rx.right_axis}` : '0';
  const lSph = rx.left_sph !== null && rx.left_sph !== undefined ? (rx.left_sph > 0 ? `+${rx.left_sph}` : `${rx.left_sph}`) : '0.00';
  const lCyl = rx.left_cyl !== null && rx.left_cyl !== undefined ? (rx.left_cyl > 0 ? `+${rx.left_cyl}` : `${rx.left_cyl}`) : '0.00';
  const lAxis = rx.left_axis ? `${rx.left_axis}` : '0';
  const addVal = rx.add_power ? `+${rx.add_power}` : '+0.00';
  const pdVal = rx.pupillary_distance ? `${rx.pupillary_distance}` : '62.0';
  const halfPd = (parseFloat(pdVal) / 2 || 31.0).toFixed(1);

  return {
    id: rx.prescription_id,
    prescription_id: rx.prescription_id,
    prescriptionNo: `RX-${rx.prescription_id.toString().padStart(4, '0')}`,
    customerId: rx.customer_id,
    customer_id: rx.customer_id,
    customerName: rx.customer_name || 'Patient',
    customerPhone: rx.customer_phone || '',
    date: rx.prescription_date || (rx.created_at ? rx.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
    prescription_date: rx.prescription_date,
    optometrist: rx.optometrist_name || 'Shruti Daware',
    optometrist_name: rx.optometrist_name || 'Shruti Daware',
    optometristName: rx.optometrist_name || 'Shruti Daware',
    od: { sph: rSph, cyl: rCyl, axis: rAxis, add: addVal, va: '6/6', pd: halfPd },
    os: { sph: lSph, cyl: lCyl, axis: lAxis, add: addVal, va: '6/6', pd: halfPd },
    rightEye: { sph: rSph, cyl: rCyl, axis: `${rAxis}°` },
    leftEye: { sph: lSph, cyl: lCyl, axis: `${lAxis}°` },
    add: addVal,
    pd: `${pdVal} mm`,
    totalPd: pdVal,
    lensRecommendation: rx.notes || 'Anti-Glare Single Vision',
    notes: rx.notes || '',
    status: 'Active'
  };
};

const mapSale = (s) => ({
  id: s.sale_id,
  sale_id: s.sale_id,
  invoiceNo: s.invoiceNo || `INV-${s.sale_id.toString().padStart(4, '0')}`,
  customerId: s.customer_id,
  customer_id: s.customer_id,
  customerName: s.customerName || 'Customer',
  customerPhone: s.customerPhone || '',
  date: s.date ? s.date.split('T')[0] : new Date().toISOString().split('T')[0],
  time: s.date && s.date.includes('T') ? s.date.split('T')[1].slice(0, 5) : '12:00',
  subtotal: Number(s.subtotal) || 0,
  discount: Number(s.discount) || 0,
  tax: Number(s.tax) || 0,
  grandTotal: Number(s.grandTotal || s.total_amount) || 0,
  total_amount: Number(s.grandTotal || s.total_amount) || 0,
  amountPaid: Number(s.amountPaid) || 0,
  balanceDue: Number(s.balanceDue) || 0,
  paymentStatus: s.paymentStatus || 'Pending',
  orderStatus: 'Completed',
  items: (s.items || []).map(i => ({
    name: i.name,
    quantity: i.quantity,
    unitPrice: i.unit_price,
    subtotal: i.subtotal
  }))
});

const mapPayment = (p) => ({
  id: p.payment_id,
  payment_id: p.payment_id,
  receiptNo: `REC-${p.payment_id.toString().padStart(4, '0')}`,
  invoiceNo: p.invoiceNo || `INV-${p.sale_id?.toString().padStart(4, '0')}`,
  sale_id: p.sale_id,
  customerName: p.customerName || 'Customer',
  amountPaid: Number(p.amount_paid || p.amount) || 0,
  amount: Number(p.amount_paid || p.amount) || 0,
  paymentMethod: p.payment_method || p.method || 'CASH',
  referenceNo: p.transaction_reference || p.reference || `TXN-${p.payment_id}`,
  date: p.date ? p.date.split('T')[0] : (p.payment_date ? p.payment_date.split('T')[0] : new Date().toISOString().split('T')[0]),
  status: 'Completed',
  receivedBy: 'Shruti Daware'
});

const mapSupplier = (sup) => ({
  id: sup.supplier_id,
  supplier_id: sup.supplier_id,
  companyName: sup.supplier_name,
  supplier_name: sup.supplier_name,
  contactPerson: sup.contact_person || '',
  contact_person: sup.contact_person || '',
  phone: sup.phone || '',
  email: sup.email || '',
  address: sup.address || '',
  city: sup.city || '',
  brands: 'Eyewear & Optical Brands',
  gstin: '27AABCS1429B1Z2',
  totalPurchases: 0,
  outstandingPayable: 0,
  status: 'Active'
});

const mapRepair = (r) => ({
  id: r.repair_id,
  repair_id: r.repair_id,
  jobNo: `REP-${r.repair_id.toString().padStart(4, '0')}`,
  customerId: r.customer_id,
  customer_id: r.customer_id,
  customerName: r.customerName || 'Customer',
  customerPhone: r.customerPhone || '',
  itemDetails: r.itemDetails || 'Spectacles / Frame',
  serviceType: 'Frame & Lens Service',
  issue: r.repair_description || r.issue || 'Frame repair and adjustment',
  serviceCharge: Number(r.repair_cost || r.cost) || 0,
  cost: Number(r.repair_cost || r.cost) || 0,
  advancePaid: 0,
  balance: Number(r.repair_cost || r.cost) || 0,
  receivedDate: r.received_date || (r.receivedDate ? r.receivedDate.split('T')[0] : new Date().toISOString().split('T')[0]),
  expectedDelivery: r.expected_delivery_date || r.expectedDelivery || '',
  status: r.status || (r.repair_status === 'COMPLETED' ? 'Ready for Pickup' : r.repair_status === 'IN_PROGRESS' ? 'In Progress' : 'Received'),
  technician: 'Workshop Team'
});

export const AppProvider = ({ children }) => {
  // Store info
  const [storeInfo, setStoreInfo] = useState(initialStoreInfo);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('daware_auth') === 'true' || sessionStorage.getItem('daware_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('daware_user') || sessionStorage.getItem('daware_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Live database data states
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activities, setActivities] = useState(initialActivities);

  // Status & UI
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(() => {
    const saved = localStorage.getItem('daware_sidebar_collapsed');
    return saved !== null ? saved === 'true' : true;
  });

  const setSidebarCollapsed = (val) => {
    setSidebarCollapsedState(prev => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('daware_sidebar_collapsed', String(nextVal));
      return nextVal;
    });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals state
  const [modalState, setModalState] = useState({
    addProduct: false,
    editProduct: null,
    viewProduct: null,
    addCustomer: false,
    editCustomer: null,
    viewCustomer: null,
    addPrescription: false,
    viewPrescription: null,
    newSale: false,
    viewInvoice: null,
    recordPayment: null,
    addSupplier: false,
    editSupplier: null,
    addRepair: false,
    editRepair: null,
    bookAppointment: false,
    editAppointment: null,
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const login = async (username, password, remember = true) => {
    const cleanUser = (username || '').trim();
    try {
      // 1. Authenticate with Python FastAPI backend
      const res = await api.login(cleanUser, password);
      if (res && res.success) {
        const userData = res.user || { username: 'shrutidaware06', name: 'Shruti Daware', role: 'Store Owner' };
        setIsAuthenticated(true);
        setCurrentUser(userData);
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('daware_auth', 'true');
        storage.setItem('daware_user', JSON.stringify(userData));
        showToast(`Welcome back, ${userData.name}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('invalid username')) {
        return { success: false, error: err.message };
      }
      // Fallback if backend is momentarily unreachable
      if (cleanUser === 'shrutidaware06' && password === 'dbmsproj') {
        const userData = { username: 'shrutidaware06', name: 'Shruti Daware', role: 'Store Owner & Optometrist' };
        setIsAuthenticated(true);
        setCurrentUser(userData);
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('daware_auth', 'true');
        storage.setItem('daware_user', JSON.stringify(userData));
        showToast('Welcome back, Shruti Daware!', 'success');
        return { success: true };
      }
      return {
        success: false,
        error: err.message || 'Invalid username or password. Access is restricted to store owner.'
      };
    }

    if (cleanUser === 'shrutidaware06' && password === 'dbmsproj') {
      const userData = { username: 'shrutidaware06', name: 'Shruti Daware', role: 'Store Owner & Optometrist' };
      setIsAuthenticated(true);
      setCurrentUser(userData);
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('daware_auth', 'true');
      storage.setItem('daware_user', JSON.stringify(userData));
      showToast('Welcome back, Shruti Daware!', 'success');
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid username or password. Access is strictly authorized for Shruti Daware only.'
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('daware_auth');
    localStorage.removeItem('daware_user');
    sessionStorage.removeItem('daware_auth');
    sessionStorage.removeItem('daware_user');
    showToast('Signed out successfully', 'info');
  };

  const addActivity = (action, details, type = 'general') => {
    const newAct = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      user: 'Shruti Daware',
      action,
      type,
      details
    };
    setActivities(prev => [newAct, ...prev.slice(0, 19)]);
  };

  // Primary Data Fetcher from FastAPI Backend
  const loadDatabaseData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        custData,
        prodData,
        catData,
        rxData,
        salesData,
        payData,
        supData,
        repData
      ] = await Promise.all([
        api.getCustomers().catch(() => null),
        api.getProducts().catch(() => null),
        api.getCategories().catch(() => null),
        api.getPrescriptions().catch(() => null),
        api.getSales().catch(() => null),
        api.getPayments().catch(() => null),
        api.getSuppliers().catch(() => null),
        api.getRepairs().catch(() => null)
      ]);

      if (custData) {
        setCustomers(custData.map(mapCustomer));
        setIsBackendConnected(true);
      } else {
        setCustomers(initialCustomers);
      }

      if (prodData) {
        setProducts(prodData.map(mapProduct));
      } else {
        setProducts(initialProducts);
      }

      if (catData) setCategories(catData);
      if (rxData) setPrescriptions(rxData.map(mapPrescription));
      else setPrescriptions(initialPrescriptions);

      if (salesData) setSales(salesData.map(mapSale));
      else setSales(initialSales);

      if (payData) setPayments(payData.map(mapPayment));
      else setPayments(initialPayments);

      if (supData) setSuppliers(supData.map(mapSupplier));
      else setSuppliers(initialSuppliers);

      if (repData) setRepairs(repData.map(mapRepair));
      else setRepairs(initialRepairs);

    } catch (err) {
      console.warn('Backend not responding yet, falling back to local state:', err);
      setIsBackendConnected(false);
      setCustomers(initialCustomers);
      setProducts(initialProducts);
      setPrescriptions(initialPrescriptions);
      setSales(initialSales);
      setPayments(initialPayments);
      setSuppliers(initialSuppliers);
      setRepairs(initialRepairs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch live MySQL data on initial load
  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  // Actions: Customers
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const refreshCustomers = useCallback(async (search = '') => {
    setLoadingCustomers(true);
    try {
      const data = await api.getCustomers(search);
      setCustomers(data.map(mapCustomer));
      return data;
    } catch (err) {
      showToast(`Failed to load customers from MySQL: ${err.message}`, 'danger');
      throw err;
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  const addCustomer = async (custData) => {
    try {
      const payload = {
        full_name: (custData.name || custData.full_name || '').trim(),
        phone: (custData.phone || '').trim() || null,
        email: (custData.email || '').trim() || null,
        address: (custData.address || '').trim() || null
      };
      const created = await api.createCustomer(payload);
      const mapped = mapCustomer(created);
      await refreshCustomers();
      addActivity('Customer Registered', `${mapped.name} registered in MySQL (+91 ${mapped.phone})`, 'customer');
      showToast(`Customer "${mapped.name}" registered and saved in MySQL.`);
      return mapped;
    } catch (err) {
      showToast(`Error saving customer: ${err.message}`, 'danger');
      throw err;
    }
  };

  const updateCustomer = async (id, updatedFields) => {
    try {
      const payload = {
        full_name: updatedFields.name || updatedFields.full_name ? (updatedFields.name || updatedFields.full_name).trim() : undefined,
        phone: updatedFields.phone !== undefined ? (updatedFields.phone ? updatedFields.phone.trim() : null) : undefined,
        email: updatedFields.email !== undefined ? (updatedFields.email ? updatedFields.email.trim() : null) : undefined,
        address: updatedFields.address !== undefined ? (updatedFields.address ? updatedFields.address.trim() : null) : undefined
      };
      const updated = await api.updateCustomer(id, payload);
      const mapped = mapCustomer(updated);
      await refreshCustomers();
      addActivity('Customer Updated', `${mapped.name} updated in MySQL`, 'customer');
      showToast(`Customer "${mapped.name}" updated successfully.`);
      return mapped;
    } catch (err) {
      showToast(`Error updating customer: ${err.message}`, 'danger');
      throw err;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const res = await api.deleteCustomer(id);
      await refreshCustomers();
      showToast(res.message || 'Customer deleted successfully from MySQL.');
      return true;
    } catch (err) {
      showToast(err.message || 'Cannot delete customer.', 'danger');
      throw err;
    }
  };

  // Actions: Products
  const addProduct = async (prodData) => {
    try {
      const payload = {
        product_name: prodData.name || prodData.product_name,
        brand: prodData.brand || null,
        category_id: prodData.category_id || 1,
        model_number: prodData.model || prodData.model_number || null,
        selling_price: Number(prodData.sellingPrice) || 0,
        stock_quantity: Number(prodData.stock) || 0,
        description: prodData.description || null
      };
      const created = await api.createProduct(payload);
      const mapped = mapProduct(created);
      setProducts(prev => [mapped, ...prev]);
      addActivity('Product Added', `${mapped.name} (${mapped.brand}) added to MySQL with stock ${mapped.stock}`, 'inventory');
      showToast(`Product "${mapped.name}" added to catalog.`);
    } catch (err) {
      const fallback = {
        ...prodData,
        id: `prod-${Date.now()}`,
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        stock: Number(prodData.stock) || 0,
        sellingPrice: Number(prodData.sellingPrice) || 0,
        status: Number(prodData.stock) <= 0 ? 'out_of_stock' : Number(prodData.stock) <= 5 ? 'low_stock' : 'in_stock'
      };
      setProducts(prev => [fallback, ...prev]);
      showToast(`Product "${fallback.name}" saved locally.`, 'warning');
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const payload = {
        product_name: updatedFields.name || updatedFields.product_name,
        brand: updatedFields.brand,
        model_number: updatedFields.model || updatedFields.model_number,
        selling_price: updatedFields.sellingPrice !== undefined ? Number(updatedFields.sellingPrice) : undefined,
        stock_quantity: updatedFields.stock !== undefined ? Number(updatedFields.stock) : undefined,
        description: updatedFields.description
      };
      await api.updateProduct(id, payload);
      setProducts(prev => prev.map(p => {
        if (p.id === id) {
          const stock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock;
          const status = stock <= 0 ? 'out_of_stock' : stock <= 5 ? 'low_stock' : 'in_stock';
          return { ...p, ...updatedFields, stock, status };
        }
        return p;
      }));
      showToast('Product updated in database.');
    } catch (err) {
      setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));
      showToast('Product updated locally.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product deleted from database.', 'warning');
    } catch (err) {
      showToast(err.message || 'Cannot delete product.', 'danger');
    }
  };

  // Actions: Prescriptions
  const addPrescription = async (rxData) => {
    try {
      // Find numeric customer_id
      const cust = customers.find(c => c.name === rxData.customerName || c.id === rxData.customerId);
      const custId = cust ? (cust.Customer_id || cust.id) : (customers[0]?.id || 1);

      const payload = {
        customer_id: typeof custId === 'number' ? custId : 1,
        right_sph: parseFloat(rxData.rightEye?.sph) || 0.0,
        right_cyl: parseFloat(rxData.rightEye?.cyl) || 0.0,
        right_axis: parseInt(rxData.rightEye?.axis) || 0,
        left_sph: parseFloat(rxData.leftEye?.sph) || 0.0,
        left_cyl: parseFloat(rxData.leftEye?.cyl) || 0.0,
        left_axis: parseInt(rxData.leftEye?.axis) || 0,
        add_power: parseFloat(rxData.add) || 0.0,
        pupillary_distance: parseFloat(rxData.pd) || 62.0,
        optometrist_name: rxData.optometrist || 'Shruti Daware',
        prescription_date: rxData.date || new Date().toISOString().split('T')[0],
        notes: rxData.notes || rxData.lensRecommendation || null
      };

      const created = await api.createPrescription(payload);
      const mapped = mapPrescription(created);
      setPrescriptions(prev => [mapped, ...prev]);
      addActivity('Prescription Recorded', `${mapped.prescriptionNo} for ${mapped.customerName} in MySQL`, 'prescription');
      showToast(`Prescription ${mapped.prescriptionNo} saved to database.`);
      return mapped;
    } catch (err) {
      const fallback = {
        ...rxData,
        id: `rx-${Date.now()}`,
        prescriptionNo: `RX-${Date.now().toString().slice(-4)}`,
        date: rxData.date || new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      setPrescriptions(prev => [fallback, ...prev]);
      showToast(`Prescription saved locally.`, 'warning');
      return fallback;
    }
  };

  // Actions: Sales / Billing
  const addSale = async (saleData) => {
    try {
      const cust = customers.find(c => c.name === saleData.customerName || c.id === saleData.customerId);
      const custId = cust ? (cust.Customer_id || cust.id) : (customers[0]?.id || 1);

      const itemsPayload = (saleData.items || []).map(it => {
        const prod = products.find(p => p.name === it.name || p.id === it.productId);
        return {
          product_id: prod && typeof prod.id === 'number' ? prod.id : 1,
          quantity: it.quantity || 1,
          unit_price: Number(it.unitPrice) || 0
        };
      });

      const payload = {
        customer_id: typeof custId === 'number' ? custId : 1,
        items: itemsPayload.length > 0 ? itemsPayload : [{ product_id: 1, quantity: 1, unit_price: saleData.grandTotal }],
        discount: Number(saleData.discount) || 0,
        tax: Number(saleData.tax) || 0,
        initial_payment: Number(saleData.amountPaid) || 0,
        payment_method: (saleData.paymentMethod || 'CASH').toUpperCase()
      };

      const created = await api.createSale(payload);
      const mapped = mapSale(created);
      setSales(prev => [mapped, ...prev]);

      // Refresh inventory & payments after successful sale
      const [newProds, newPays] = await Promise.all([
        api.getProducts().catch(() => null),
        api.getPayments().catch(() => null)
      ]);
      if (newProds) setProducts(newProds.map(mapProduct));
      if (newPays) setPayments(newPays.map(mapPayment));

      addActivity('New Sale Billed', `${mapped.invoiceNo} billed in MySQL (₹${mapped.grandTotal})`, 'billing');
      showToast(`Invoice ${mapped.invoiceNo} generated & saved to database.`);
      return mapped;
    } catch (err) {
      console.warn('Backend sale creation error, falling back locally:', err);
      const invNo = `INV-${Date.now().toString().slice(-4)}`;
      const fallback = {
        ...saleData,
        id: `sale-${Date.now()}`,
        invoiceNo: invNo,
        date: new Date().toISOString().split('T')[0],
        time: '12:00'
      };
      setSales(prev => [fallback, ...prev]);
      showToast(`Invoice ${invNo} saved locally.`, 'warning');
      return fallback;
    }
  };

  const updateSaleStatus = (id, orderStatus, paymentStatus = null) => {
    setSales(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          orderStatus,
          ...(paymentStatus ? { paymentStatus } : {})
        };
      }
      return s;
    }));
    showToast(`Order status updated to ${orderStatus}.`);
  };

  const updateSale = async (id, updatedFields) => {
    try {
      const numericId = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10) || 1;
      const payload = {
        payment_status: updatedFields.paymentStatus ? updatedFields.paymentStatus.toUpperCase() : undefined,
        discount: updatedFields.discount !== undefined ? Number(updatedFields.discount) : undefined,
        tax: updatedFields.tax !== undefined ? Number(updatedFields.tax) : undefined,
        total_amount: updatedFields.grandTotal !== undefined ? Number(updatedFields.grandTotal) : undefined,
        add_payment_amount: updatedFields.addPaymentAmount ? Number(updatedFields.addPaymentAmount) : undefined,
        payment_method: updatedFields.paymentMethod || 'UPI',
        notes: updatedFields.notes || ''
      };

      const updated = await api.updateSale(numericId, payload);
      const mapped = mapSale(updated);

      setSales(prev => prev.map(s => (s.id === id || s.sale_id === numericId ? mapped : s)));
      addActivity('Bill Updated', `Invoice ${mapped.invoiceNo} status updated to ${mapped.paymentStatus}`, 'billing');
      showToast(`Bill ${mapped.invoiceNo} updated successfully in database.`);
      return mapped;
    } catch (err) {
      console.warn('API bill update fallback:', err);
      setSales(prev => prev.map(s => {
        if (s.id === id || s.sale_id === id) {
          const discount = updatedFields.discount !== undefined ? Number(updatedFields.discount) : (s.discount || 0);
          const grandTotal = updatedFields.grandTotal !== undefined ? Number(updatedFields.grandTotal) : (s.subtotal - discount);
          const paymentStatus = updatedFields.paymentStatus || s.paymentStatus;
          return {
            ...s,
            discount,
            grandTotal,
            paymentStatus,
            amountPaid: paymentStatus === 'Paid' ? grandTotal : s.amountPaid,
            balanceDue: paymentStatus === 'Paid' ? 0 : Math.max(0, grandTotal - (s.amountPaid || 0)),
            ...(updatedFields.notes ? { notes: updatedFields.notes } : {})
          };
        }
        return s;
      }));
      showToast('Bill updated successfully.');
    }
  };

  // Actions: Payments
  const recordPayment = async (invoiceNo, amountPaid, paymentMethod, referenceNo = '') => {
    const sale = sales.find(s => s.invoiceNo === invoiceNo);
    const saleId = sale && typeof sale.id === 'number' ? sale.id : 1;

    try {
      const payload = {
        sale_id: saleId,
        amount_paid: Number(amountPaid),
        payment_method: (paymentMethod || 'CASH').toUpperCase(),
        transaction_reference: referenceNo || null,
        payment_notes: `Payment for ${invoiceNo}`
      };
      const created = await api.recordPayment(payload);
      const mapped = mapPayment(created);
      setPayments(prev => [mapped, ...prev]);

      // Refresh sales to update balance and payment_status
      const freshSales = await api.getSales().catch(() => null);
      if (freshSales) setSales(freshSales.map(mapSale));

      addActivity('Payment Recorded', `Received ₹${Number(amountPaid).toLocaleString()} for ${invoiceNo} in MySQL`, 'payment');
      showToast(`Payment of ₹${Number(amountPaid).toLocaleString()} recorded in database.`);
    } catch (err) {
      console.warn('Backend payment recording error:', err);
      // Local fallback
      const fallback = {
        id: `pay-${Date.now()}`,
        receiptNo: `REC-${Date.now().toString().slice(-4)}`,
        invoiceNo,
        customerName: sale?.customerName || 'Customer',
        date: new Date().toISOString().split('T')[0],
        amountPaid: Number(amountPaid),
        paymentMethod,
        referenceNo,
        status: 'Completed'
      };
      setPayments(prev => [fallback, ...prev]);
      showToast(`Payment logged locally.`, 'warning');
    }
  };

  // Actions: Repairs
  const addRepair = async (repData) => {
    try {
      const cust = customers.find(c => c.name === repData.customerName);
      const custId = cust && typeof cust.id === 'number' ? cust.id : 1;

      const payload = {
        customer_id: custId,
        repair_description: repData.issue || repData.repair_description || 'Frame and lens service',
        repair_cost: Number(repData.serviceCharge || repData.cost) || 0.0,
        received_date: repData.receivedDate || new Date().toISOString().split('T')[0],
        expected_delivery_date: repData.expectedDelivery || null,
        repair_status: 'RECEIVED',
        notes: repData.itemDetails || null
      };

      const created = await api.createRepair(payload);
      const mapped = mapRepair(created);
      setRepairs(prev => [mapped, ...prev]);
      addActivity('Repair Order Created', `${mapped.jobNo} saved to MySQL (${mapped.itemDetails})`, 'repair');
      showToast(`Repair job ${mapped.jobNo} saved to database.`);
    } catch (err) {
      const fallback = {
        ...repData,
        id: `rep-${Date.now()}`,
        jobNo: `REP-${Date.now().toString().slice(-4)}`,
        receivedDate: repData.receivedDate || new Date().toISOString().split('T')[0],
        serviceCharge: Number(repData.serviceCharge) || 0,
        status: 'Received'
      };
      setRepairs(prev => [fallback, ...prev]);
      showToast(`Repair job logged locally.`, 'warning');
    }
  };

  const updateRepairStatus = async (id, newStatus) => {
    try {
      const statusMap = {
        'Received': 'RECEIVED',
        'In Progress': 'IN_PROGRESS',
        'Ready for Pickup': 'COMPLETED',
        'Delivered': 'DELIVERED',
        'Cancelled': 'CANCELLED'
      };
      const backendStatus = statusMap[newStatus] || newStatus.toUpperCase();
      if (typeof id === 'number') {
        await api.updateRepair(id, { repair_status: backendStatus });
      }
      setRepairs(prev => prev.map(r => (r.id === id ? { ...r, status: newStatus } : r)));
      showToast(`Repair status updated to ${newStatus}.`);
    } catch (err) {
      setRepairs(prev => prev.map(r => (r.id === id ? { ...r, status: newStatus } : r)));
      showToast(`Status updated locally.`);
    }
  };

  // Actions: Suppliers
  const addSupplier = async (supData) => {
    try {
      const payload = {
        supplier_name: supData.companyName || supData.supplier_name,
        contact_person: supData.contactPerson || supData.contact_person || null,
        phone: supData.phone || null,
        email: supData.email || null,
        address: supData.address || null,
        city: supData.city || 'Mumbai'
      };
      const created = await api.createSupplier(payload);
      const mapped = mapSupplier(created);
      setSuppliers(prev => [mapped, ...prev]);
      showToast(`Supplier ${mapped.companyName} saved to database.`);
    } catch (err) {
      const fallback = {
        ...supData,
        id: `sup-${Date.now()}`,
        status: 'Active'
      };
      setSuppliers(prev => [fallback, ...prev]);
      showToast(`Supplier saved locally.`, 'warning');
    }
  };

  // Actions: Appointments
  const addAppointment = (aptData) => {
    const aptNo = `APT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newApt = {
      ...aptData,
      id: `apt-${Date.now()}`,
      appointmentNo: aptNo,
      status: 'Confirmed'
    };
    setAppointments(prev => [newApt, ...prev]);
    addActivity('Appointment Scheduled', `${newApt.customerName} on ${newApt.date} at ${newApt.time}`, 'appointment');
    showToast(`Appointment ${aptNo} scheduled.`);
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status: newStatus } : a)));
    showToast(`Appointment marked as ${newStatus}.`);
  };

  // Live Metrics
  const totalProductsCount = products.length;
  const inStockProductsCount = products.filter(p => p.status === 'in_stock').length;
  const lowStockCount = products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length;

  const totalCustomersCount = customers.length;
  const vipCustomersCount = customers.filter(c => c.tag === 'VIP').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySalesList = sales.filter(s => s.date === todayStr);
  const todaySalesRevenue = todaySalesList.reduce((acc, s) => acc + (s.grandTotal || s.total_amount || 0), 0);

  const monthlyRevenue = sales.reduce((acc, s) => acc + (s.grandTotal || s.total_amount || 0), 0);
  const pendingPaymentsAmount = sales.reduce((acc, s) => acc + (s.balanceDue || 0), 0);
  const pendingPaymentsCount = sales.filter(s => s.balanceDue > 0).length;

  const pendingAppointmentsCount = appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length;
  const ongoingRepairsCount = repairs.filter(r => r.status === 'Received' || r.status === 'In Progress').length;

  return (
    <AppContext.Provider
      value={{
        storeInfo,
        setStoreInfo,
        isAuthenticated,
        currentUser,
        login,
        logout,
        isBackendConnected,
        isLoading,
        loadDatabaseData,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        customers,
        loadingCustomers,
        refreshCustomers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        categories,
        prescriptions,
        addPrescription,
        sales,
        addSale,
        updateSale,
        updateSaleStatus,
        payments,
        recordPayment,
        suppliers,
        addSupplier,
        repairs,
        addRepair,
        updateRepairStatus,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        activities,
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        modalState,
        setModalState,
        toast,
        showToast,
        // Computed metrics from real data
        metrics: {
          totalProducts: totalProductsCount,
          inStockProducts: inStockProductsCount,
          lowStockCount,
          totalCustomers: totalCustomersCount,
          vipCustomers: vipCustomersCount,
          todaySales: todaySalesRevenue,
          todaySalesCount: todaySalesList.length,
          monthlyRevenue,
          pendingPaymentsAmount,
          pendingPaymentsCount,
          pendingAppointmentsCount,
          ongoingRepairsCount
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
