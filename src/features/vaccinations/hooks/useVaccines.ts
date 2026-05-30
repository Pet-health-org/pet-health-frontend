import { useState, useCallback, useEffect } from "react";
import { VaccinationRecord, ALERT_DAYS_THRESHOLD } from "../types";
import { getVacunas, createVacuna } from "../../../services/vacuna.service";

export function useVaccines() {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVaccines = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getVacunas();
      const mappedRecords: VaccinationRecord[] = response.data.map(
        (item: any) => ({
          id: item.id,
          petId: item.historiaClinica?.mascotaId || "",
          vaccineName: item.nombre,
          applicationDate: item.fechaAplicacion,
          batchNumber: item.lote || "",
          lotNumber: item.lote || "",
          dose: item.dosis || "",
          expiryDate: item.inventario?.fechaVencimiento || "",
          nextBoosterDate: item.fechaProximoRefuerzo || "",
          vetId: item.historiaClinica?.veterinarioId || "",
          notes: item.historiaClinica?.observaciones || "",
        }),
      );
      setRecords(mappedRecords);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaccines();
  }, [fetchVaccines]);

  const addRecord = useCallback(
    async (data: Omit<VaccinationRecord, "id">) => {
      setIsLoading(true);
      try {
        await createVacuna(data);
        await fetchVaccines();
      } catch (error) {
        console.error("Error adding vaccine:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchVaccines],
  );

  const getUpcomingVaccines = useCallback(() => {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + ALERT_DAYS_THRESHOLD);

    return records.filter((r) => {
      const boosterDate = new Date(r.nextBoosterDate);
      return boosterDate >= today && boosterDate <= thresholdDate;
    });
  }, [records]);

  return {
    records,
    isLoading,
    addRecord,
    getUpcomingVaccines,
    refresh: fetchVaccines,
  };
}
