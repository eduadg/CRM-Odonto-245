"use client";

import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { Appointment } from "../../types/appointment";
import "./AppointmentCalendar.css";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onDateSelect?: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  selectedDate?: Date;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onDateSelect,
  onAppointmentClick,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navegação do calendário
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    const days = direction === "prev" ? -7 : 7;
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // Obter dias do mês
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Adicionar dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Adicionar dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  };

  // Obter dias da semana
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }

    return days;
  };

  // Obter agendamentos para uma data específica
  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const dateString = date.toISOString().split("T")[0];
    return appointments.filter(
      (apt) => apt.appointmentDate.toISOString().split("T")[0] === dateString
    );
  };

  // Verificar se é hoje
  const isToday = (date: Date): boolean => {
    return date.toDateString() === today.toDateString();
  };

  // Verificar se é o dia selecionado
  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmado":
        return <CheckCircle size={12} className="status-confirmed" />;
      case "agendado":
        return <Clock size={12} className="status-pending" />;
      case "cancelado":
        return <AlertCircle size={12} className="status-cancelled" />;
      default:
        return <Clock size={12} />;
    }
  };

  // Renderizar vista mensal
  const renderMonthView = () => {
    const days = getDaysInMonth();
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return (
      <div className="calendar-month">
        <div className="calendar-weekdays">
          {weekDays.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="calendar-day empty" />;
            }

            const dayAppointments = getAppointmentsForDate(date);
            const isCurrentDay = isToday(date);
            const isSelectedDay = isSelected(date);

            return (
              <div
                key={index}
                className={`calendar-day ${isCurrentDay ? "today" : ""} ${
                  isSelectedDay ? "selected" : ""
                } ${dayAppointments.length > 0 ? "has-appointments" : ""}`}
                onClick={() => onDateSelect?.(date)}
              >
                <div className="day-number">{date.getDate()}</div>

                {dayAppointments.length > 0 && (
                  <div className="day-appointments">
                    {dayAppointments.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        className={`appointment-dot priority-${apt.priority}`}
                        title={`${apt.appointmentTime} - ${apt.patientName}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentClick?.(apt);
                        }}
                      >
                        {getStatusIcon(apt.status)}
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="appointment-more">
                        +{dayAppointments.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar vista semanal
  const renderWeekView = () => {
    const days = getWeekDays();
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return (
      <div className="calendar-week">
        <div className="week-header">
          {days.map((date, index) => {
            const dayAppointments = getAppointmentsForDate(date);
            const isCurrentDay = isToday(date);
            const isSelectedDay = isSelected(date);

            return (
              <div
                key={index}
                className={`week-day-header ${isCurrentDay ? "today" : ""} ${
                  isSelectedDay ? "selected" : ""
                }`}
                onClick={() => onDateSelect?.(date)}
              >
                <div className="week-day-name">{weekDays[index]}</div>
                <div className="week-day-number">{date.getDate()}</div>
                <div className="week-day-count">
                  {dayAppointments.length} agendamentos
                </div>
              </div>
            );
          })}
        </div>

        <div className="week-content">
          {days.map((date, index) => {
            const dayAppointments = getAppointmentsForDate(date);

            return (
              <div key={index} className="week-day-column">
                {dayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`week-appointment priority-${apt.priority} status-${apt.status}`}
                    onClick={() => onAppointmentClick?.(apt)}
                  >
                    <div className="appointment-time">
                      <Clock size={12} />
                      {apt.appointmentTime}
                    </div>
                    <div className="appointment-patient">
                      <User size={12} />
                      {apt.patientName}
                    </div>
                    <div className="appointment-service">{apt.service}</div>
                    <div className="appointment-status">
                      {getStatusIcon(apt.status)}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <div className="appointment-calendar">
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button
            className="nav-button"
            onClick={() =>
              viewMode === "month"
                ? navigateMonth("prev")
                : navigateWeek("prev")
            }
          >
            <ChevronLeft size={20} />
          </button>

          <div className="calendar-title">
            <CalendarIcon size={20} />
            <h3>
              {monthNames[currentMonth]} {currentYear}
            </h3>
          </div>

          <button
            className="nav-button"
            onClick={() =>
              viewMode === "month"
                ? navigateMonth("next")
                : navigateWeek("next")
            }
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="calendar-controls">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "month" ? "active" : ""}`}
              onClick={() => setViewMode("month")}
            >
              Mês
            </button>
            <button
              className={`view-btn ${viewMode === "week" ? "active" : ""}`}
              onClick={() => setViewMode("week")}
            >
              Semana
            </button>
          </div>

          <button
            className="today-btn"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoje
          </button>
        </div>
      </div>

      <div className="calendar-content">
        {viewMode === "month" ? renderMonthView() : renderWeekView()}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot priority-baixa"></div>
          <span>Baixa</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot priority-normal"></div>
          <span>Normal</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot priority-alta"></div>
          <span>Alta</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot priority-urgente"></div>
          <span>Urgente</span>
        </div>
      </div>
    </div>
  );
};
