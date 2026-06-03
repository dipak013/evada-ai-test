"use client";
import { useState, useEffect } from "react";
import TimePicker from "./TimePicker";

interface ScheduleScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationName: string;
  applicationId: number;
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

export default function ScheduleScanModal({
  isOpen,
  onClose,
  applicationName,
  applicationId,
  onSchedule,
  existingSchedule,
}: ScheduleScanModalProps) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>("once");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("daily");
  const [recurringStartDate, setRecurringStartDate] = useState("");
  const [recurringTime, setRecurringTime] = useState("");
  const [selectedWeekday, setSelectedWeekday] = useState<Weekday>("monday");
  const [weekdayTime, setWeekdayTime] = useState("");

  // Load existing schedule data when editing
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
          date.setDate(start.getDate() + (i * 14));
          break;
        case "monthly":
          date.setMonth(start.getMonth() + i);
          break;
        case "quarterly":
          date.setMonth(start.getMonth() + (i * 3));
          break;
        case "half-yearly":
          date.setMonth(start.getMonth() + (i * 6));
          break;
        case "annually":
          date.setFullYear(start.getFullYear() + i);
          break;
      }
      
      dates.push(date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }));
    }
    
    return dates;
  };

  const handleSchedule = () => {
    let scheduleData: any = {
      applicationId,
      applicationName,
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
    // Reset form
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
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{existingSchedule ? "Edit" : "Schedule"} Scan</h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1">
              {existingSchedule ? "Update" : "Schedule"} security scan for <span className="font-semibold">{applicationName}</span>
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

        {/* Body */}
        <div className="p-4 sm:p-6">
          {/* Schedule Type Selector */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Schedule Type
            </label>
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

          {/* One-Time Schedule */}
          {scheduleType === "once" && (
            <div className="space-y-4 bg-purple-50/50 p-4 sm:p-5 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                <span className="font-semibold text-sm">Schedule a specific date and time</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <TimePicker
                    label="Select Time"
                    value={selectedTime}
                    onChange={setSelectedTime}
                    openDirection="down"
                  />
                </div>
              </div>
              {selectedDate && selectedTime && (
                <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-700">
                    <span className="font-semibold">Scheduled for:</span>{" "}
                    {new Date(selectedDate + "T" + selectedTime).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recurring Schedule */}
          {scheduleType === "recurring" && (
            <div className="space-y-4 bg-purple-50/50 p-5 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <span className="font-semibold text-sm">Schedule recurring scans</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value as RecurringFrequency)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  {frequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={recurringStartDate}
                  onChange={(e) => setRecurringStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
                />
                {recurringStartDate && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Upcoming Scan Dates:</p>
                    <div className="text-xs text-blue-600 italic space-y-0.5">
                      {calculateUpcomingDates(recurringStartDate, recurringFrequency).map((date, index) => (
                        <div key={index}>• {date}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <TimePicker
                  value={recurringTime}
                  onChange={setRecurringTime}
                  label="Time of Day"
                  openDirection="down"
                />
              </div>
              {recurringTime && recurringStartDate && (
                <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-700">
                    <span className="font-semibold">Recurrence:</span> {recurringFrequency} starting{" "}
                    {new Date(recurringStartDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date("2000-01-01T" + recurringTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Weekday Schedule */}
          {scheduleType === "weekday" && (
            <div className="space-y-4 bg-purple-50/50 p-5 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
                <span className="font-semibold text-sm">Schedule by day of the week</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Week
                </label>
                <select
                  value={selectedWeekday}
                  onChange={(e) => setSelectedWeekday(e.target.value as Weekday)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  {weekdays.map((day) => (
                    <option key={day.value} value={day.value}>
                      Every {day.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <TimePicker
                  value={weekdayTime}
                  onChange={setWeekdayTime}
                  label="Time of Day"
                  openDirection="down"
                />
              </div>
              {weekdayTime && (
                <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-700">
                    <span className="font-semibold">Scheduled:</span> Every{" "}
                    {selectedWeekday.charAt(0).toUpperCase() + selectedWeekday.slice(1)} at{" "}
                    {new Date("2000-01-01T" + weekdayTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Important Information</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Scheduled scans will run automatically at the specified time</li>
                <li>You will receive notifications when scans are completed</li>
                <li>You can view and manage scheduled scans from the dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded-b-2xl border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-md text-sm sm:text-base order-1 sm:order-2"
          >
            Schedule Scan
          </button>
        </div>
      </div>
    </div>
  );
}
