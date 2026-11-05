import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { Printer, X, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrintablePrescriptionModal = ({ prescription, onClose }) => {
  const { storeInfo } = useApp();

  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-soft-lg border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-navy-900 text-white border-b border-navy-800">
          <div className="flex items-center gap-3">
            <span className="badge-gold">Ophthalmic Prescription</span>
            <span className="text-sm font-semibold tracking-wide">
              {prescription.prescriptionNo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Slip */}
        <div className="print-container p-8 sm:p-10 text-slate-800 bg-white">
          {/* Clinic Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-navy-900">
            <div>
              <div className="flex items-center gap-2">
                <img
                  src="/logo-navy.png"
                  alt="DAWARE OPTICIANS"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-xs font-semibold text-gold-700 tracking-wider uppercase mt-1">
                Refraction & Clinical Optometry Dept.
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {storeInfo.address}
              </p>
              <p className="text-xs text-slate-600">
                Tel: {storeInfo.phone} | Registration: {storeInfo.optometristLicense}
              </p>
            </div>

            <div className="text-left sm:text-right bg-slate-50 p-3.5 rounded-xl border border-slate-200 min-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Prescription Ref
              </span>
              <p className="text-base font-bold font-mono text-navy-900">
                {prescription.prescriptionNo}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Exam Date: <strong>{formatDate(prescription.date)}</strong>
              </p>
              <p className="text-xs text-slate-500">
                Status: <span className="text-emerald-700 font-semibold">{prescription.status || 'Active'}</span>
              </p>
            </div>
          </div>

          {/* Patient Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-xl bg-ivory-50 border border-ivory-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Patient Name
              </span>
              <p className="text-sm font-bold text-navy-900 mt-0.5">{prescription.customerName}</p>
              <p className="text-slate-600 mt-0.5 font-medium">Contact: {prescription.customerPhone}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Examining Optometrist
              </span>
              <p className="text-sm font-bold text-navy-900 mt-0.5">
                {prescription.optometristName || 'Shruti Daware'}
              </p>
              <p className="text-slate-600 mt-0.5">B.Optom, F.I.A.C.L.E (Clinical Refractionist)</p>
            </div>
          </div>

          {/* Optical Refraction Values Grid (OD / OS) */}
          <div className="my-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-gold-600" />
              <span>Ophthalmic Refractive Measurements</span>
            </h4>
            
            <div className="overflow-x-auto border-2 border-slate-900 rounded-lg">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-navy-950 text-white font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 text-left">Eye (Oculus)</th>
                    <th className="py-2.5 px-3">SPH (Sphere)</th>
                    <th className="py-2.5 px-3">CYL (Cylinder)</th>
                    <th className="py-2.5 px-3">Axis</th>
                    <th className="py-2.5 px-3">ADD (Near)</th>
                    <th className="py-2.5 px-3">V/A (Acuity)</th>
                    <th className="py-2.5 px-3">PD (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
                  {/* Right Eye (OD) */}
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-left font-bold text-navy-900 bg-slate-50">
                      OD (Right Eye)
                    </td>
                    <td className="py-3 px-3 font-mono text-sm font-bold">{prescription.od?.sph || '0.00'}</td>
                    <td className="py-3 px-3 font-mono text-sm">{prescription.od?.cyl || '0.00'}</td>
                    <td className="py-3 px-3 font-mono text-sm">{prescription.od?.axis ? `${prescription.od.axis}°` : '-'}</td>
                    <td className="py-3 px-3 font-mono text-sm font-bold text-navy-800">{prescription.od?.add || '0.00'}</td>
                    <td className="py-3 px-3 font-mono text-sm">{prescription.od?.va || '6/6'}</td>
                    <td className="py-3 px-3 font-mono text-sm">{prescription.od?.pd || '31.0'}</td>
                  </tr>
                  {/* Left Eye (OS) */}
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-left font-bold text-navy-900 bg-slate-50">
                      OS (Left Eye)
                    </td>
                    <td className="py-3 px-3 font-mono text-sm font-bold">{prescription.os?.sph || '0.00'}</td>
                    <td className="py-3 px-3 font-mono text-sm">{prescription.os?.cyl || '0.00'}</td>
                    <td className="py-3 px-3 font-mono text-sm">{prescription.os?.axis ? `${prescription.os.axis}°` : '-'}</td>
                    <td className="py-3 px-3 font-mono text-sm font-bold text-navy-800">{prescription.os?.add || '0.00'}</td>
                    <td className="py-3 px-3 font-mono text-sm">{prescription.os?.va || '6/6'}</td>
                    <td className="py-3 px-3 font-mono text-sm">{prescription.os?.pd || '31.0'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs px-2 text-slate-600">
              <span><strong>Binocular Pupillary Distance (Total PD):</strong> {prescription.totalPd || '62.0'} mm</span>
              <span>Trial Frame Subjective Acceptance Confirmed</span>
            </div>
          </div>

          {/* Clinical Advice & Recommended Lenses */}
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Prescribed Lens Type & Treatment
              </span>
              <p className="text-sm font-bold text-navy-900">
                {prescription.lensRecommendation || 'Digital Single Vision 1.60 Index Anti-Reflective'}
              </p>
            </div>

            {prescription.notes && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Clinical Remarks & Observations
                </span>
                <p className="text-slate-700 leading-relaxed italic">
                  "{prescription.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Signoff */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Periodic Vision Review Advised: Annual (12 Months)</p>
              <p className="text-[11px] text-slate-400">Prescription valid for optical dispensing at Daware Opticians.</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-slate-400 pb-1 font-serif italic text-navy-900 font-bold">
                {prescription.optometristName || 'Shruti Daware'}
              </div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                Authorized Optometrist Signature & Seal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

