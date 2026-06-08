"use client";
import { useState, useEffect } from "react";
import TimePicker from "@/components/TimePicker";

interface SecurityConsoleScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextLabel: string;
  onSchedule: (scheduleData: any) => void;
  existingSchedule?: {
    scheduleType: "once" | "recurring" | "weekday";
    date?: string;
    time: string;
    frequency?: "daily" | "bi-weekly" | "monthly" | "quarterly" | "half-yearly" | "annually";
    startDate?: string;
    weekday?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  };
}

type ScheduleType = "once" | "recurring" | "weekday";
type RecurringFrequency = "daily" | "bi-weekly" | "monthly" | "quarterly" | "half-yearly" | "annually";
type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export default function SecurityConsoleScheduleModal({
  isOpen,
  onClose,
  contextLabel,
  onSchedule,
  existingSchedule,
}: SecurityConsoleScheduleModalProps) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>("once");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("daily");
  const [recurringStartDate, setRecurringStartDate] = useState("");
  const [recurringTime, setRecurringTime] = useState("");
  const [selectedWeekday, setSelectedWeekday] = useState<Weekday>("monday");
  const [weekdayTime, setWeekdayTime] = useState("");

  useEffect(() => {
    if (existingSchedule) {
      setScheduleType(existingSchedule.scheduleType);

      if (existingSchedule.scheduleType === "once") {
        setSelectedDate(existingSchedule.date || "");
        setSelectedTime(existingSchedule.time);
      } else if (existingSchedule.scheduleType === "recurring") {
        setRecurringFrequency(existingSchedule.frequency || "daily");
        setRecurringStartDate(existingSchedule.startDate || "");
        setRecurringTime(existingSchedule.time);
      } else if (existingSchedule.scheduleType === "weekday") {
        setSelectedWeekday(existingSchedule.weekday || "monday");
        setWeekdayTime(existingSchedule.time);
      }
    }
  }, [existingSchedule]);

  if (!isOpen) return null;

  const calculateUpcomingDates = (startDate: string, frequency: RecurringFrequency): string[] => {
    if (!startDate) return [];

    const dates: string[] = [];
    const start = new Date(startDate);

    for (let i = 0; i < 5; i++) {
      const date = new Date(start);

      switch (frequency) {
        case "daily":
          date.setDate(start.getDate() + i);
          break;
        case "bi-weekly":
          date.setDate(start.getDate() + i * 14);
          break;
        case "monthly":
          date.setMonth(start.getMonth() + i);
          break;
        case "quarterly":
          date.setMonth(start.getMonth() + i * 3);
          break;
        case "half-yearly":
          date.setMonth(start.getMonth() + i * 6);
          break;
        case "annually":
          date.setFullYear(start.getFullYear() + i);
          break;
      }

      dates.push(
        date.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
    }

    return dates;
  };

  const handleSchedule = () => {
    let scheduleData: any = {
      contextLabel,
      scheduleType,
    };

    if (scheduleType === "once") {
      if (!selectedDate || !selectedTime) {
        alert("Please select both date and time");
        return;
      }
      scheduleData.date = selectedDate;
      scheduleData.time = selectedTime;
    } else if (scheduleType === "recurring") {
      if (!recurringTime || !recurringStartDate) {
        alert("Please select start date and time");
        return;
      }
      scheduleData.frequency = recurringFrequency;
      scheduleData.startDate = recurringStartDate;
      scheduleData.time = recurringTime;
    } else if (scheduleType === "weekday") {
      if (!weekdayTime) {
        alert("Please select time");
        return;
      }
      scheduleData.weekday = selectedWeekday;
      scheduleData.time = weekdayTime;
    }

    onSchedule(scheduleData);
    onClose();
  };

  const handleClose = () => {
    setScheduleType("once");
    setSelectedDate("");
    setSelectedTime("");
    setRecurringFrequency("daily");
    setRecurringStartDate("");
    setRecurringTime("");
    setSelectedWeekday("monday");
    setWeekdayTime("");
    onClose();
  };

  const weekdays: { value: Weekday; label: string }[] = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const frequencies: { value: RecurringFrequency; label: string }[] = [
    { value: "daily", label: "Daily" },
    { value: "bi-weekly", label: "Bi-Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "half-yearly", label: "Half-Yearly" },
    { value: "annually", label: "Annually" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn mx-2 sm:mx-0">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{existingSchedule ? "Edit" : "Schedule"} Scan</h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1">
              {existingSchedule ? "Update" : "Schedule"} security scan for <span className="font-semibold">{contextLabel}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Schedule Type</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => setScheduleType("once")}
                className={`px-2 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                  scheduleType === "once"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                One-Time
              </button>
              <button
                onClick={() => setScheduleType("recurring")}
                className={`px-2 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                  scheduleType === "recurring"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Recurring
              </button>
              <button
                onClick={() => setScheduleType("weekday")}
                className={`px-2 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                  scheduleType === "weekday"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Weekly Day
              </button>
            </div>
          </div>

          {scheduleType === "once" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <TimePicker value={selectedTime} onChange={setSelectedTime} />
                </div>
              </div>
            </div>
          )}

          {scheduleType === "recurring" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {frequencies.map((freq) => (
                    <button
                      key={freq.value}
                      onClick={() => setRecurringFrequency(freq.value)}
                      className={`px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        recurringFrequency === freq.value
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={recurringStartDate}
                    onChange={(e) => setRecurringStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <TimePicker value={recurringTime} onChange={setRecurringTime} />
                </div>
              </div>

              {recurringStartDate && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Scans</h4>
                  <div className="space-y-2">
                    {calculateUpcomingDates(recurringStartDate, recurringFrequency).map((date, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        {date} at {recurringTime || "--:--"}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {scheduleType === "weekday" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Weekday</label>
                  <select
                    value={selectedWeekday}
                    onChange={(e) => setSelectedWeekday(e.target.value as Weekday)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {weekdays.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <TimePicker value={weekdayTime} onChange={setWeekdayTime} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            {existingSchedule ? "Update Schedule" : "Schedule Scan"}
          </button>
        </div>
      </div>
    </div>
  );
}
