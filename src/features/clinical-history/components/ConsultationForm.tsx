import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNotify } from "../../../context/NotificationContext";
import { X, AlertTriangle, Syringe, AlertCircle } from "lucide-react";
import { Consultation, VitalSigns } from "../types";
import { Pet, SPECIES_VITAL_RANGES } from "../../pets/types";
import { useVaccines } from "../../vaccinations/hooks/useVaccines";
import { useInventory } from "../../inventory/hooks/useInventory";
import { VACCINE_SCHEMES } from "../../vaccinations/types";

interface ConsultationFormProps {
  pet: Pet;
  onClose: () => void;
  onSubmit: (
    data: Omit<Consultation, "id" | "registrationDate"> & {
      vitalsJustification?: string;
    },
  ) => Promise<any> | any;
  isSubmitting?: boolean;
  onAfterSave?: () => Promise<void> | void;
}

export function ConsultationForm({
  pet,
  onClose,
  onSubmit,
  isSubmitting,
  onAfterSave,
}: ConsultationFormProps) {
  const { user } = useAuth();
  const { notify } = useNotify();
  const { addRecord } = useVaccines();
  const { items: inventoryItems } = useInventory();

  const [formData, setFormData] = useState({
    petId: pet.id,
    vetId: user?.id || "v1",
    vetName: user?.username || "Especialista",
    date: new Date().toISOString().split("T")[0],
    reason: "",
    anamnesis: "",
    physicalExam: "",
    vitals: {
      weight: pet.weight || "",
      temperature: "",
      heartRate: "",
      respiratoryRate: "",
    },
    vitalsJustification: "",
    diagnosis: "",
    treatment: "",
    observations: "",
  });

  const [vitalsStatus, setVitalsStatus] = useState<
    Record<string, "normal" | "warning" | "critical">
  >({});
  const ranges =
    SPECIES_VITAL_RANGES[pet.species as keyof typeof SPECIES_VITAL_RANGES] ||
    SPECIES_VITAL_RANGES["Otros"];
  const hasOutlierVitals = Object.values(vitalsStatus).some(
    (status) => status !== "normal",
  );

  // Vaccine state
  const [applyVaccine, setApplyVaccine] = useState(false);
  const scheme = VACCINE_SCHEMES.find((s) => s.species === pet.species);
  const [vaccineData, setVaccineData] = useState({
    inventarioId: "",
    vaccineName: "",
    batchNumber: "",
    expiryDate: "",
    applicationDate: new Date().toISOString().split("T")[0],
    nextBoosterDate: "",
    dose: "1/1",
    notes: "",
  });

  const vaccineInventoryItems = inventoryItems.filter(
    (item) => item.category === "Vacuna" && item.stock > 0,
  );
  const selectedInventoryItem = inventoryItems.find(
    (item) => item.id === vaccineData.inventarioId,
  );
  const [vaccineWarning, setVaccineWarning] = useState(false);
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const [backendAlerts, setBackendAlerts] = useState<any[]>([]);

  useEffect(() => {
    const evaluateVital = (value: any, min: number, max: number) => {
      if (value === "" || value === null || isNaN(value as number)) return "normal";
      const numValue = Number(value);
      if (numValue < min || numValue > max) {
        // Just checking if out of bounds. We can treat > 20% deviation as critical
        const dev = Math.max(min - numValue, numValue - max) / ((max + min) / 2);
        return dev > 0.2 ? "critical" : "warning";
      }
      return "normal";
    };

    setVitalsStatus({
      temperature: evaluateVital(
        formData.vitals.temperature,
        ranges.temperature.min,
        ranges.temperature.max,
      ),
      heartRate: evaluateVital(
        formData.vitals.heartRate,
        ranges.heartRate.min,
        ranges.heartRate.max,
      ),
      respiratoryRate: evaluateVital(
        formData.vitals.respiratoryRate,
        ranges.respiratoryRate.min,
        ranges.respiratoryRate.max,
      ),
    });
  }, [formData.vitals, ranges]);

  useEffect(() => {
    if (vaccineData.vaccineName && scheme) {
      const vaccineInfo = scheme.vaccines.find(
        (v) => v.name === vaccineData.vaccineName,
      );
      if (vaccineInfo) {
        const appDate = new Date(vaccineData.applicationDate);
        const boosterDate = new Date(
          appDate.setMonth(
            appDate.getMonth() + vaccineInfo.boosterIntervalMonths,
          ),
        );
        setVaccineData((prev) => ({
          ...prev,
          nextBoosterDate: boosterDate.toISOString().split("T")[0],
        }));
      }
    }
  }, [vaccineData.vaccineName, vaccineData.applicationDate, scheme]);

  useEffect(() => {
    if (vaccineData.expiryDate) {
      const exp = new Date(vaccineData.expiryDate);
      const now = new Date();
      const diffDays = Math.ceil(
        (exp.getTime() - now.getTime()) / (1000 * 3600 * 24),
      );
      setVaccineWarning(diffDays > 0 && diffDays <= 30);
    } else {
      setVaccineWarning(false);
    }
  }, [vaccineData.expiryDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((hasOutlierVitals || backendAlerts.length > 0) && !formData.vitalsJustification.trim()) {
      alert(
        "Por favor, justifique los valores anormales de las constantes vitales.",
      );
      return;
    }

    setLocalSubmitting(true);
    try {
      if (applyVaccine && !vaccineData.inventarioId) {
        alert("Debe seleccionar la vacuna del inventario.");
        return;
      }

      const payload = {
        ...formData,
        vitals: {
          weight: Number(formData.vitals.weight) || 0,
          temperature: Number(formData.vitals.temperature) || 0,
          heartRate: Number(formData.vitals.heartRate) || 0,
          respiratoryRate: Number(formData.vitals.respiratoryRate) || 0,
        }
      };
      const createdConsultation = await onSubmit(payload as any);

      if (applyVaccine && vaccineData.vaccineName) {
        const historiaClinicaId = createdConsultation?.id || createdConsultation?._id;
        if (!historiaClinicaId) {
          throw new Error("No se recibió el ID de la historia clínica creada.");
        }

        await addRecord({
          historiaClinicaId,
          inventarioId: vaccineData.inventarioId,
          nombre: vaccineData.vaccineName,
          fechaAplicacion: new Date(vaccineData.applicationDate).toISOString(),
          fechaProximoRefuerzo: vaccineData.nextBoosterDate
            ? new Date(vaccineData.nextBoosterDate).toISOString()
            : undefined,
          dosis: vaccineData.dose,
          lote: vaccineData.batchNumber,
        } as any);

        notify(
          "success",
          "Vacuna registrada",
          "La vacuna quedó asociada al historial clínico y el inventario fue descontado.",
        );
        await onAfterSave?.();
      }
      onClose();
    } catch (error: any) {
      console.error(error);
      
      const responseData = error.response?.data;
      if (responseData && responseData.alertas) {
        setBackendAlerts(responseData.alertas);
        notify("error", "Validación Fallida", responseData.message || "Valores fuera de rango. Requiere justificación.");
      } else {
        notify(
          "error",
          "Error",
          "No se pudo finalizar la consulta o registrar la vacuna.",
        );
      }
    } finally {
      setLocalSubmitting(false);
    }
  };

  const handleVitalChange = (name: keyof VitalSigns, value: string) => {
    setFormData({
      ...formData,
      vitals: { ...formData.vitals, [name]: value === "" ? "" : parseFloat(value) },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-[#0A2540]">Nueva Consulta</h2>
            <p className="text-xs text-slate-500">
              Paciente: <span className="font-bold">{pet.name}</span> (
              {pet.species})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto custom-scrollbar space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Info */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Motivo de Consulta *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Anamnesis *
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[100px]"
                  value={formData.anamnesis}
                  onChange={(e) =>
                    setFormData({ ...formData, anamnesis: e.target.value })
                  }
                  placeholder="Historia del problema actual..."
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Examen Físico *
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[100px]"
                  value={formData.physicalExam}
                  onChange={(e) =>
                    setFormData({ ...formData, physicalExam: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Vitals and Results */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-[#0A2540] mb-3 flex items-center gap-2">
                  Constantes Vitales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Temperatura (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className={`w-full px-3 py-1.5 border rounded-lg outline-none transition-all ${vitalsStatus.temperature === "critical" ? "border-red-400 bg-red-50 text-red-900" : vitalsStatus.temperature === "warning" ? "border-amber-400 bg-amber-50 text-amber-900" : "border-slate-300"}`}
                      value={formData.vitals.temperature}
                      onChange={(e) =>
                        handleVitalChange(
                          "temperature",
                          e.target.value
                        )
                      }
                    />
                    <div
                      className={`text-[10px] ${vitalsStatus.temperature !== "normal" ? "font-bold" : "text-slate-400"}`}
                    >
                      Rango normal: {ranges.temperature.min} -{" "}
                      {ranges.temperature.max}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Frec. Cardíaca (bpm)
                    </label>
                    <input
                      type="number"
                      className={`w-full px-3 py-1.5 border rounded-lg outline-none transition-all ${vitalsStatus.heartRate === "critical" ? "border-red-400 bg-red-50 text-red-900" : vitalsStatus.heartRate === "warning" ? "border-amber-400 bg-amber-50 text-amber-900" : "border-slate-300"}`}
                      value={formData.vitals.heartRate}
                      onChange={(e) =>
                        handleVitalChange(
                          "heartRate",
                          e.target.value
                        )
                      }
                    />
                    <div
                      className={`text-[10px] ${vitalsStatus.heartRate !== "normal" ? "font-bold" : "text-slate-400"}`}
                    >
                      Rango normal: {ranges.heartRate.min} -{" "}
                      {ranges.heartRate.max}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Frec. Respiratoria (rpm)
                    </label>
                    <input
                      type="number"
                      className={`w-full px-3 py-1.5 border rounded-lg outline-none transition-all ${vitalsStatus.respiratoryRate === "critical" ? "border-red-400 bg-red-50 text-red-900" : vitalsStatus.respiratoryRate === "warning" ? "border-amber-400 bg-amber-50 text-amber-900" : "border-slate-300"}`}
                      value={formData.vitals.respiratoryRate}
                      onChange={(e) =>
                        handleVitalChange(
                          "respiratoryRate",
                          e.target.value
                        )
                      }
                    />
                    <div
                      className={`text-[10px] ${vitalsStatus.respiratoryRate !== "normal" ? "font-bold" : "text-slate-400"}`}
                    >
                      Rango normal: {ranges.respiratoryRate.min} -{" "}
                      {ranges.respiratoryRate.max}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none"
                      value={formData.vitals.weight}
                      onChange={(e) =>
                        handleVitalChange("weight", e.target.value)
                      }
                    />
                  </div>
                </div>

                {(hasOutlierVitals || backendAlerts.length > 0) && (
                  <div className="mt-4 space-y-1 animate-in slide-in-from-top-2">
                    <label className="text-sm font-bold text-amber-700 flex items-center gap-1">
                      <AlertTriangle size={14} /> Justificación Constantes
                      Anormales *
                    </label>
                    {backendAlerts.length > 0 && (
                      <div className="text-xs text-amber-800 bg-amber-100 p-2 rounded mb-2">
                        {backendAlerts.map((a, i) => (
                          <div key={i}>• {a.constante}: {a.valorIngresado} {a.unidad} (Rango: {a.minimoEsperado}-{a.maximoEsperado})</div>
                        ))}
                      </div>
                    )}
                    <textarea
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none min-h-[60px] bg-amber-50"
                      value={formData.vitalsJustification}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vitalsJustification: e.target.value,
                        })
                      }
                      placeholder="Explique la causa de los valores fuera de rango..."
                      required
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Diagnóstico *
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[120px]"
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Tratamiento *
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[120px]"
                  value={formData.treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Vaccine Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={applyVaccine}
                onChange={(e) => setApplyVaccine(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-[#0A2540] focus:ring-[#0A2540]"
              />
              <span className="font-bold text-[#0A2540] flex items-center gap-2">
                <Syringe size={18} /> ¿Registrar aplicación de vacuna en esta
                consulta?
              </span>
            </label>

            {applyVaccine && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Producto de inventario *
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                    value={vaccineData.inventarioId}
                    onChange={(e) => {
                      const item = inventoryItems.find(
                        (i) => i.id === e.target.value,
                      );
                      setVaccineData({
                        ...vaccineData,
                        inventarioId: e.target.value,
                        vaccineName: item?.name || vaccineData.vaccineName,
                        expiryDate: item?.expiryDate
                          ? item.expiryDate.split("T")[0]
                          : vaccineData.expiryDate,
                      });
                    }}
                    required={applyVaccine}
                  >
                    <option value="">Seleccione vacuna disponible...</option>
                    {vaccineInventoryItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} • Stock: {item.stock} {item.unit || "u"}
                      </option>
                    ))}
                  </select>
                  {vaccineInventoryItems.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      No hay vacunas con stock disponible en inventario.
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Vacuna *
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                    value={vaccineData.vaccineName}
                    onChange={(e) =>
                      setVaccineData({
                        ...vaccineData,
                        vaccineName: e.target.value,
                      })
                    }
                    required={applyVaccine}
                  >
                    <option value="">Seleccione vacuna...</option>
                    {scheme?.vaccines.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.isMandatory ? "Obligatoria" : "Opcional"})
                      </option>
                    ))}
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Dosis *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                    value={vaccineData.dose}
                    onChange={(e) =>
                      setVaccineData({ ...vaccineData, dose: e.target.value })
                    }
                    required={applyVaccine}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Lote *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                    value={vaccineData.batchNumber}
                    onChange={(e) =>
                      setVaccineData({
                        ...vaccineData,
                        batchNumber: e.target.value,
                      })
                    }
                    required={applyVaccine}
                  />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-sm font-semibold text-slate-700">
                    Vencimiento Lote *
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-2 border rounded-lg outline-none ${vaccineWarning ? "border-amber-400 bg-amber-50" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
                    value={vaccineData.expiryDate}
                    onChange={(e) =>
                      setVaccineData({
                        ...vaccineData,
                        expiryDate: e.target.value,
                      })
                    }
                    required={applyVaccine}
                  />
                  {vaccineWarning && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-700 mt-1 font-bold">
                      <AlertCircle size={12} /> El lote vence en menos de 30
                      días
                    </div>
                  )}
                </div>
                {selectedInventoryItem && (
                  <div className="md:col-span-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
                    <p>
                      <strong>Inventario:</strong> {selectedInventoryItem.name}
                    </p>
                    <p>
                      <strong>Stock actual:</strong>{" "}
                      {selectedInventoryItem.stock}{" "}
                      {selectedInventoryItem.unit || "u"}
                    </p>
                    <p>
                      <strong>Vencimiento:</strong>{" "}
                      {selectedInventoryItem.expiryDate
                        ? new Date(
                            selectedInventoryItem.expiryDate,
                          ).toLocaleDateString()
                        : "Sin fecha"}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Próximo Refuerzo *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-blue-200 bg-blue-50/50 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    value={vaccineData.nextBoosterDate}
                    onChange={(e) =>
                      setVaccineData({
                        ...vaccineData,
                        nextBoosterDate: e.target.value,
                      })
                    }
                    required={applyVaccine}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || localSubmitting}
              className="px-6 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors shadow-lg shadow-[#0A2540]/20 flex items-center gap-2"
            >
              {isSubmitting || localSubmitting
                ? "Guardando..."
                : "Finalizar Consulta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
