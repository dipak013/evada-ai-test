"use client";

import { useState, useEffect, useRef } from "react";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  openDirection?: "up" | "down";
}

export default function TimePicker({ value, onChange, label, openDirection = "up" }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");
  
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      const hour24 = parseInt(h);
      const minute = parseInt(m);
      const isPM = hour24 >= 12;
      
      setSelectedPeriod(isPM ? "PM" : "AM");
      setSelectedMinute(minute);
      
      // Convert 24-hour to 12-hour format
      if (hour24 === 0) {
        setSelectedHour(12);
      } else if (hour24 > 12) {
        setSelectedHour(hour24 - 12);
      } else {
        setSelectedHour(hour24);
      }
    }
  }, [value]);

  // Generate options
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Scroll to selected values when picker opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (hourRef.current) {
          const hourElement = hourRef.current.querySelector(`[data-value="${selectedHour}"]`);
          if (hourElement) {
            hourElement.scrollIntoView({ block: "center", behavior: "smooth" });
          }
        }
        if (minuteRef.current) {
          const minuteElement = minuteRef.current.querySelector(`[data-value="${selectedMinute}"]`);
          if (minuteElement) {
            minuteElement.scrollIntoView({ block: "center", behavior: "smooth" });
          }
        }
      }, 100);
    }
  }, [isOpen, selectedHour, selectedMinute]);

  const handleOk = () => {
    // Convert to 24-hour format
    let hour24 = selectedHour;
    if (selectedPeriod === "PM" && selectedHour !== 12) {
      hour24 += 12;
    } else if (selectedPeriod === "AM" && selectedHour === 12) {
      hour24 = 0;
    }
    
    const formattedTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")}`;
    onChange(formattedTime);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset to current value
    if (value) {
      const [h, m] = value.split(":");
      const hour24 = parseInt(h);
      const minute = parseInt(m);
      const isPM = hour24 >= 12;
      
      setSelectedPeriod(isPM ? "PM" : "AM");
      setSelectedMinute(minute);
      
      if (hour24 === 0) {
        setSelectedHour(12);
      } else if (hour24 > 12) {
        setSelectedHour(hour24 - 12);
      } else {
        setSelectedHour(hour24);
      }
    }
    setIsOpen(false);
  };

  const getDisplayTime = () => {
    if (value) {
      return new Date(`2000-01-01T${value}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return "Select time";
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Time Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-left flex items-center justify-between hover:border-indigo-400 transition-colors"
      >
        <span className="text-gray-900">{getDisplayTime()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Time Picker Dropdown */}
      {isOpen && (
        <>
          {/* Invisible Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={handleCancel}
          />

          {/* Picker Modal */}
          <div className={`absolute ${openDirection === "down" ? "top-full mt-2" : "bottom-full mb-2"} left-0 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden w-64`}>
            {/* AM/PM Toggle */}
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setSelectedPeriod("AM")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  selectedPeriod === "AM"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod("PM")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  selectedPeriod === "PM"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                PM
              </button>
            </div>

            {/* Scrollable Time Columns */}
            <div className="flex h-48 relative">
              {/* Selection Highlight */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-indigo-50 border-y border-indigo-200 pointer-events-none z-10" />

              {/* Hour Column */}
              <div
                ref={hourRef}
                className="flex-1 overflow-y-auto scrollbar-hide relative"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="py-[88px]">
                  {hours.map((h) => (
                    <button
                      key={h}
                      type="button"
                      data-value={h}
                      onClick={() => setSelectedHour(h)}
                      className={`w-full h-10 flex items-center justify-center text-base transition-all relative z-20 ${
                        selectedHour === h
                          ? "text-indigo-600 font-bold"
                          : "text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="w-px bg-gray-200 relative z-20" />

              {/* Minute Column */}
              <div
                ref={minuteRef}
                className="flex-1 overflow-y-auto scrollbar-hide relative"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="py-[88px]">
                  {minutes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      data-value={m}
                      onClick={() => setSelectedMinute(m)}
                      className={`w-full h-10 flex items-center justify-center text-base transition-all relative z-20 ${
                        selectedMinute === m
                          ? "text-indigo-600 font-bold"
                          : "text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {m.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <div className="w-px bg-gray-200" />
              <button
                type="button"
                onClick={handleOk}
                className="flex-1 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                OK
              </button>
            </div>
          </div>

          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </>
      )}
    </div>
  );
}
