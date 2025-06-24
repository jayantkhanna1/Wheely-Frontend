// Step5Availability.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { Calendar, Clock, ChevronDown, X } from 'lucide-react-native';
import { VehicleForm } from '../types/VehicleTypes';

interface Step5AvailabilityProps {
  formData: VehicleForm;
  updateFormData: (field: keyof VehicleForm, value: any) => void;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilityData {
  availabilityType: 'specific-dates' | 'recurring-days';
  specificDates: string[];
  recurringDays: string[];
  timeSlots: TimeSlot[];
  isAllDay: boolean;
}

const Step5Availability: React.FC<Step5AvailabilityProps> = ({
  formData,
  updateFormData,
}) => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData>({
    availabilityType: 'specific-dates',
    specificDates: [],
    recurringDays: [],
    timeSlots: [{ startTime: '09:00', endTime: '18:00' }],
    isAllDay: false,
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  React.useEffect(() => {
    updateFormData('availability', availabilityData);
  }, [availabilityData]);

  const toggleAvailabilityType = (type: 'specific-dates' | 'recurring-days') => {
    setAvailabilityData(prev => ({
      ...prev,
      availabilityType: type,
      specificDates: type === 'specific-dates' ? prev.specificDates : [],
      recurringDays: type === 'recurring-days' ? prev.recurringDays : [],
    }));
  };

  const toggleRecurringDay = (day: string) => {
    setAvailabilityData(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day],
    }));
  };

  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const toggleSpecificDate = (day: number) => {
    const dateStr = formatDate(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const today = new Date();
    const selectedDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    
    // Don't allow selection of past dates
    if (selectedDate < today) return;

    setAvailabilityData(prev => ({
      ...prev,
      specificDates: prev.specificDates.includes(dateStr)
        ? prev.specificDates.filter(d => d !== dateStr)
        : [...prev.specificDates, dateStr],
    }));
  };

  const isDateSelected = (day: number) => {
    const dateStr = formatDate(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    return availabilityData.specificDates.includes(dateStr);
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    const selectedDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    return selectedDate < today;
  };

  const addTimeSlot = () => {
    setAvailabilityData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: '09:00', endTime: '18:00' }],
    }));
  };

  const removeTimeSlot = (index: number) => {
    setAvailabilityData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailabilityData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendar = () => {
    const days = generateCalendarDays();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <View style={styles.calendar}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth('prev')}>
            <Text style={styles.navButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth('next')}>
            <Text style={styles.navButton}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Days of week header */}
        <View style={styles.weekHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <View key={day} style={styles.weekDay}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
            // Create style array with proper conditional logic
            const dayStyles = [styles.calendarDay];
            if (day && isDateSelected(day)) {
              dayStyles.push(styles.selectedDay);
            }
            if (day && isPastDate(day)) {
              dayStyles.push(styles.pastDay);
            }

            // Create text style array with proper conditional logic
            const textStyles = [styles.calendarDayText];
            if (day && isDateSelected(day)) {
              textStyles.push(styles.selectedDayText);
            }
            if (day && isPastDate(day)) {
              textStyles.push(styles.pastDayText);
            }

            return (
              <TouchableOpacity
                key={index}
                style={dayStyles}
                onPress={() => day && !isPastDate(day) && toggleSpecificDate(day)}
                disabled={!day || isPastDate(day)}
              >
                {day && (
                  <Text style={textStyles}>
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderTimeModal = () => (
    <Modal
      visible={showTimeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTimeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.timeModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <TouchableOpacity onPress={() => setShowTimeModal(false)}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.timeList}>
            {timeOptions.map(time => (
              <TouchableOpacity
                key={time}
                style={styles.timeOption}
                onPress={() => {
                  if (editingTimeSlot !== null) {
                    // Handle time selection logic here
                    setShowTimeModal(false);
                  }
                }}
              >
                <Text style={styles.timeOptionText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Vehicle Availability</Text>
        <Text style={styles.stepSubtitle}>
          Set when your vehicle is available for booking
        </Text>

        {/* Availability Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                availabilityData.availabilityType === 'specific-dates' && styles.typeButtonActive
              ]}
              onPress={() => toggleAvailabilityType('specific-dates')}
            >
              <Calendar size={20} color={availabilityData.availabilityType === 'specific-dates' ? '#FFFFFF' : '#6B7280'} />
              <Text style={[
                styles.typeButtonText,
                availabilityData.availabilityType === 'specific-dates' && styles.typeButtonTextActive
              ]}>
                Specific Dates
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                availabilityData.availabilityType === 'recurring-days' && styles.typeButtonActive
              ]}
              onPress={() => toggleAvailabilityType('recurring-days')}
            >
              <Clock size={20} color={availabilityData.availabilityType === 'recurring-days' ? '#FFFFFF' : '#6B7280'} />
              <Text style={[
                styles.typeButtonText,
                availabilityData.availabilityType === 'recurring-days' && styles.typeButtonTextActive
              ]}>
                Recurring Days
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Specific Dates Selection */}
        {availabilityData.availabilityType === 'specific-dates' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Available Dates</Text>
            <Text style={styles.sectionSubtitle}>
              Choose specific dates when your vehicle will be available
            </Text>
            {renderCalendar()}
            {availabilityData.specificDates.length > 0 && (
              <View style={styles.selectedDatesContainer}>
                <Text style={styles.selectedDatesTitle}>
                  Selected Dates ({availabilityData.specificDates.length})
                </Text>
                <View style={styles.selectedDatesList}>
                  {availabilityData.specificDates.slice(0, 3).map(date => (
                    <Text key={date} style={styles.selectedDate}>
                      {new Date(date).toLocaleDateString()}
                    </Text>
                  ))}
                  {availabilityData.specificDates.length > 3 && (
                    <Text style={styles.moreDates}>
                      +{availabilityData.specificDates.length - 3} more
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Recurring Days Selection */}
        {availabilityData.availabilityType === 'recurring-days' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Days of Week</Text>
            <Text style={styles.sectionSubtitle}>
              Choose which days of the week your vehicle will be available
            </Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map(day => (
                <TouchableOpacity
                  key={day.key}
                  style={[
                    styles.dayButton,
                    availabilityData.recurringDays.includes(day.key) && styles.dayButtonActive
                  ]}
                  onPress={() => toggleRecurringDay(day.key)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    availabilityData.recurringDays.includes(day.key) && styles.dayButtonTextActive
                  ]}>
                    {day.label.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Time Slots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Time</Text>
            <TouchableOpacity
              style={styles.allDayToggle}
              onPress={() => setAvailabilityData(prev => ({ ...prev, isAllDay: !prev.isAllDay }))}
            >
              
            </TouchableOpacity>
          </View>

          {!availabilityData.isAllDay && (
            <>
              {availabilityData.timeSlots.map((slot, index) => (
                <View key={index} style={styles.timeSlotContainer}>
                  <View style={styles.timeSlot}>
                    <View style={styles.timeInput}>
                      <Text style={styles.timeLabel}>From</Text>
                      <TouchableOpacity
                        style={styles.timeButton}
                        onPress={() => {
                          setEditingTimeSlot(index);
                          setShowTimeModal(true);
                        }}
                      >
                        <Text style={styles.timeButtonText}>{slot.startTime}</Text>
                        <ChevronDown size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.timeInput}>
                      <Text style={styles.timeLabel}>To</Text>
                      <TouchableOpacity
                        style={styles.timeButton}
                        onPress={() => {
                          setEditingTimeSlot(index);
                          setShowTimeModal(true);
                        }}
                      >
                        <Text style={styles.timeButtonText}>{slot.endTime}</Text>
                        <ChevronDown size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>

                    {availabilityData.timeSlots.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeSlotButton}
                        onPress={() => removeTimeSlot(index)}
                      >
                        <X size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.addTimeSlotButton} onPress={addTimeSlot}>
                <Text style={styles.addTimeSlotText}>+ Add Time Slot</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {renderTimeModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContent: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  calendar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  navButton: {
    fontSize: 24,
    color: '#059669',
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderRadius: 6,
  },
  selectedDay: {
    backgroundColor: '#059669',
  },
  pastDay: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#111827',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pastDayText: {
    color: '#9CA3AF',
  },
  selectedDatesContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  selectedDatesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
    marginBottom: 8,
  },
  selectedDatesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedDate: {
    fontSize: 12,
    color: '#065F46',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  moreDates: {
    fontSize: 12,
    color: '#059669',
    fontStyle: 'italic',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  allDayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#059669',
    alignItems: 'flex-end',
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  allDayText: {
    fontSize: 14,
    color: '#374151',
  },
  timeSlotContainer: {
    marginBottom: 12,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  timeButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  removeSlotButton: {
    padding: 8,
  },
  addTimeSlotButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#059669',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addTimeSlotText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  timeModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  timeList: {
    maxHeight: 300,
  },
  timeOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#111827',
  },
});

export default Step5Availability;