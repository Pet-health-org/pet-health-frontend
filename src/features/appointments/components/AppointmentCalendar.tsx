import React, { useState, useMemo } from "react";
import {
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Filter,
} from "lucide-react";
import { Appointment } from "../types";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedVetId: string;
  veterinarians: any[];
  onAddClick: (data: any) => void;
  onVetChange: (id: string) => void;
  canCreate?: boolean;
  isVeterinario?: boolean;
}

type ViewMode = "day" | "week";

export function AppointmentCalendar({
  appointments,
  selectedDate,
  onDateChange,
  selectedVetId,
  onVetChange,
  veterinarians,
  onAddClick,
  canCreate = true,
  isVeterinario = false,
}: AppointmentCalendarProps) {
  const [view, setView] = useState<ViewMode>("week");

  const timeSlots = generateTimeSlots("08:00", "18:00", 60); // Hourly slots for better grid layout

  // Mock blocked slots for demonstration as requested in the HU
  const blockedSlots = useMemo(
    () => [
      { day: 1, time: "12:00", reason: "Almuerzo" },
      { day: 2, time: "12:00", reason: "Almuerzo" },
      { day: 3, time: "12:00", reason: "Almuerzo" },
      { day: 4, time: "12:00", reason: "Almuerzo" },
      { day: 5, time: "12:00", reason: "Almuerzo" },
      { day: 3, time: "15:00", reason: "Bloqueado" },
    ],
    [],
  );

  const weekDays = useMemo(() => {
    const baseDate = new Date(selectedDate + "T00:00:00");
    const day = baseDate.getDay(); // 0 is Sunday
    const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday

    const monday = new Date(baseDate.setDate(diff));
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().split("T")[0];
    });
  }, [selectedDate]);

  const getStatus = (date: string, time: string) => {
    const app = appointments.find(
      (a) =>
        a.date === date &&
        (selectedVetId === "all" || a.vetId === selectedVetId) &&
        a.time.startsWith(time.split(":")[0]), // Match hour
    );
    if (app) return { type: "occupied", data: app };

    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    const blocked = blockedSlots.find(
      (b) => b.day === dayOfWeek && b.time === time,
    );
    if (blocked) return { type: "blocked", data: blocked };

    return { type: "available" };
  };

  const navigateDate = (days: number) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + days);
    onDateChange(d.toISOString().split("T")[0]);
  };

  const goToToday = () => {
    onDateChange(new Date().toISOString().split("T")[0]);
  };

  const formatDayName = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Calendar Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setView("day")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === "day" ? "bg-[#0A2540] text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              Día
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === "week" ? "bg-[#0A2540] text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              Semana
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateDate(view === "day" ? -1 : -7)}
              className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-full text-slate-600 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-semibold text-[#0A2540] hover:bg-white rounded-md transition-all border border-transparent hover:border-slate-200"
            >
              Hoy
            </button>
            <button
              onClick={() => navigateDate(view === "day" ? 1 : 7)}
              className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-full text-slate-600 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-slate-800 ml-2 capitalize">
            {new Intl.DateTimeFormat("es-ES", {
              month: "long",
              year: "numeric",
            }).format(new Date(selectedDate + "T00:00:00"))}
          </h3>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {!isVeterinario && (
            <div className="relative flex-1 lg:flex-none">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                className="pl-10 pr-4 py-2 w-full bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#A8DADC] outline-none shadow-sm transition-all appearance-none cursor-pointer"
                value={selectedVetId}
                onChange={(e) => onVetChange(e.target.value)}
              >
                <option value="all">Todos los Veterinarios</option>
                {veterinarians.map((v: any) => (
                  <option key={v.id} value={v.id}>
                    Dr/a. {v.username || v.firstName || v.nombreCompleto || 'Veterinario'}
                  </option>
                ))}
              </select>
            </div>
          )}
          <input
            type="date"
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#A8DADC] outline-none shadow-sm transition-all"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-white border-b border-slate-50 flex gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-50 border border-slate-200 rounded-sm"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
          <span className="text-blue-600">Cita Activa</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-sm shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
          <span className="text-amber-600">Bloqueado</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-auto max-h-[600px]">
        <div
          className={`grid ${view === "week" ? "grid-cols-[80px_repeat(6,1fr)]" : "grid-cols-[80px_1fr]"} min-w-[800px] lg:min-w-0`}
        >
          {/* Header Row */}
          <div className="h-12 bg-slate-50/80 border-b border-r border-slate-100 flex items-center justify-center sticky top-0 z-10 backdrop-blur-sm">
            <Clock size={16} className="text-slate-400" />
          </div>
          {view === "week" ? (
            weekDays.map((date) => (
              <div
                key={date}
                className={`h-12 border-b border-r border-slate-100 bg-slate-50/80 flex flex-col items-center justify-center sticky top-0 z-10 backdrop-blur-sm ${date === new Date().toISOString().split("T")[0] ? "bg-blue-50/50" : ""}`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {formatDayName(date).split(" ")[0]}
                </span>
                <span
                  className={`text-sm font-bold ${date === new Date().toISOString().split("T")[0] ? "text-blue-600" : "text-slate-700"}`}
                >
                  {formatDayName(date).split(" ")[1]}
                </span>
              </div>
            ))
          ) : (
            <div className="h-12 border-b border-slate-100 bg-slate-50/80 flex flex-col items-center justify-center sticky top-0 z-10 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {formatDayName(selectedDate).split(" ")[0]}
              </span>
              <span className="text-lg font-black text-[#0A2540] -mt-1">
                {formatDayName(selectedDate).split(" ")[1]}
              </span>
            </div>
          )}

          {/* Time Rows */}
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="h-24 border-b border-r border-slate-100 flex items-start justify-center pt-2">
                <span className="text-xs font-bold text-slate-400">{time}</span>
              </div>

              {view === "week" ? (
                weekDays.map((date) => {
                  const status = getStatus(date, time);
                  return (
                    <CalendarCell
                      key={`${date}-${time}`}
                      status={status}
                      onClick={() =>
                        status.type === "available" && canCreate &&
                        onAddClick({
                          date,
                          time,
                          vetId: selectedVetId !== "all" ? selectedVetId : "",
                        })
                      }
                      canCreate={canCreate}
                    />
                  );
                })
              ) : (
                <CalendarCell
                  status={getStatus(selectedDate, time)}
                  isDayView
                  onClick={() =>
                    getStatus(selectedDate, time).type === "available" && canCreate &&
                    onAddClick({
                      date: selectedDate,
                      time,
                      vetId: selectedVetId !== "all" ? selectedVetId : "",
                    })
                  }
                  canCreate={canCreate}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendarCell({
  status,
  onClick,
  isDayView,
  canCreate = true,
}: {
  status: any;
  onClick: () => void;
  isDayView?: boolean;
  canCreate?: boolean;
}) {
  if (status.type === "occupied") {
    return (
      <div className="h-24 border-b border-r border-slate-100 p-1">
        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 text-white shadow-lg shadow-blue-500/20 flex flex-col justify-between group transition-all hover:scale-[1.02] cursor-default overflow-hidden">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">
                Cita Médica
              </span>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs font-bold mt-1 line-clamp-1">
              {status.data.reason}
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1 border-t border-white/20 pt-1">
            <User size={10} className="opacity-70" />
            <span className="text-[9px] font-medium opacity-90 truncate">
              Ref: {status.data.petId.split("-")[0]}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (status.type === "blocked") {
    return (
      <div className="h-24 border-b border-r border-slate-100 p-1 bg-slate-50/30">
        <div className="h-full w-full bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg p-2 text-white shadow-lg shadow-amber-500/20 flex flex-col justify-center items-center text-center opacity-90">
          <Clock size={16} className="mb-1 opacity-80" />
          <span className="text-[10px] font-bold uppercase">
            {status.data.reason}
          </span>
          <span className="text-[8px] opacity-70">No disponible</span>
        </div>
      </div>
    );
  }

  if (!canCreate) {
    return <div className="h-24 border-b border-r border-slate-100 bg-slate-50/10"></div>;
  }

  return (
    <button
      onClick={onClick}
      className="h-24 border-b border-r border-slate-100 group relative hover:bg-blue-50/30 transition-colors"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-[#0A2540] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
          <CalendarIcon size={10} />
          Agendar
        </div>
      </div>
    </button>
  );
}

function generateTimeSlots(
  start: string,
  end: string,
  stepMinutes: number,
): string[] {
  const slots: string[] = [];
  let current = start;
  while (current <= end) {
    slots.push(current);
    const [h, m] = current.split(":").map(Number);
    const total = h * 60 + m + stepMinutes;
    const nextH = Math.floor(total / 60);
    const nextM = total % 60;
    current = `${nextH.toString().padStart(2, "0")}:${nextM.toString().padStart(2, "0")}`;
  }
  return slots;
}
// Note: In the final version, I'd resolve pet/vet names properly
