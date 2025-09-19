"use client";

import { Plus } from "lucide-react";
import type React from "react";

interface AppointmentButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const AppointmentButton: React.FC<AppointmentButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className="btn-primary"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 20px",
        fontSize: "14px",
        fontWeight: "500",
      }}
    >
      <Plus size={16} />
      Novo Agendamento
    </button>
  );
};
