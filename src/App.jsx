import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { Toast } from './components/common/Toast';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { SalesBillingPage } from './pages/SalesBillingPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { RepairsPage } from './pages/RepairsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals
import { AddProductModal } from './components/modals/AddProductModal';
import { AddCustomerModal } from './components/modals/AddCustomerModal';
import { AddPrescriptionModal } from './components/modals/AddPrescriptionModal';
import { AddSaleModal } from './components/modals/AddSaleModal';
import { PrintableInvoiceModal } from './components/modals/PrintableInvoiceModal';
import { PrintablePrescriptionModal } from './components/modals/PrintablePrescriptionModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { AddRepairModal } from './components/modals/AddRepairModal';
import { BookAppointmentModal } from './components/modals/BookAppointmentModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';

const DashboardContent = () => {
  const {
    isAuthenticated,
    activeTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    modalState,
    setModalState,
    isSearchOpen,
    setIsSearchOpen
  } = useApp();

  // If user is not logged in, show the secure Login Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'inventory':
        return <InventoryPage />;
      case 'customers':
        return <CustomersPage />;
      case 'prescriptions':
        return <PrescriptionsPage />;
      case 'sales':
        return <SalesBillingPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'suppliers':
        return <SuppliersPage />;
      case 'repairs':
        return <RepairsPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-softwhite-100 text-graphite-900 flex flex-col">
      {/* Permanent Full-Width Top Bar with Brand Logo at Top-Left */}
      <TopNavbar />

      <div className="flex flex-1">
        {/* Sleek Collapsible Sidebar beneath Top Bar */}
        <Sidebar />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full ${
            sidebarCollapsed ? 'ml-[96px]' : 'ml-64'
          }`}
        >
          {renderActivePage()}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <AddProductModal
        isOpen={modalState.addProduct || !!modalState.editProduct}
        editProduct={modalState.editProduct}
        onClose={() => setModalState(prev => ({ ...prev, addProduct: false, editProduct: null }))}
      />

      <AddCustomerModal
        isOpen={modalState.addCustomer || !!modalState.editCustomer}
        editCustomer={modalState.editCustomer}
        onClose={() => setModalState(prev => ({ ...prev, addCustomer: false, editCustomer: null }))}
      />

      <AddPrescriptionModal
        isOpen={modalState.addPrescription}
        onClose={() => setModalState(prev => ({ ...prev, addPrescription: false }))}
      />

      <AddSaleModal
        isOpen={modalState.newSale}
        onClose={() => setModalState(prev => ({ ...prev, newSale: false }))}
        onSaleCreated={(newSale) => {
          setModalState(prev => ({ ...prev, viewInvoice: newSale }));
        }}
      />

      <PrintableInvoiceModal
        invoice={modalState.viewInvoice}
        onClose={() => setModalState(prev => ({ ...prev, viewInvoice: null }))}
      />

      <PrintablePrescriptionModal
        prescription={modalState.viewPrescription}
        onClose={() => setModalState(prev => ({ ...prev, viewPrescription: null }))}
      />

      <RecordPaymentModal
        isOpen={!!modalState.recordPayment}
        invoice={typeof modalState.recordPayment === 'object' ? modalState.recordPayment : null}
        onClose={() => setModalState(prev => ({ ...prev, recordPayment: null }))}
      />

      <AddRepairModal
        isOpen={modalState.addRepair}
        onClose={() => setModalState(prev => ({ ...prev, addRepair: false }))}
      />

      <BookAppointmentModal
        isOpen={modalState.bookAppointment}
        onClose={() => setModalState(prev => ({ ...prev, bookAppointment: false }))}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Global Toast Feedbacks */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
