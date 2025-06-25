// Step4Availability.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { Calendar, ChevronDown, X } from 'lucide-react-native';
import { BicycleForm } from '../types/BicycleTypes';

interface Step4AvailabilityProps {
  formData: BicycleForm;
  updateFormData: (field: keyof BicycleForm, value: any) => void;
}

interface TimeSlot {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface LocalTimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilityData {
  specificDates: string[];
  timeSlots: TimeSlot[];
  isAllDay: boolean;
}

const Step4Availability: React.FC<Step4AvailabilityProps> = ({
  formData,
  updateFormData,
}) => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData>({
    specificDates: [],
    timeSlots: [],
    isAllDay: false,
  });

  // Local state for UI display
  const [localTimeSlots, setLocalTimeSlots] = useState<LocalTimeSlot[]>([
    { startTime: '09:00', endTime: '18:00' }
  ]);

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<{ index: number, field: 'start' | 'end' } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [dateSelectionStart, setDateSelectionStart] = useState<string | null>(null);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  // Function to get all dates between two dates (inclusive)
  const getDatesBetween = (startDate: string, endDate: string): string[] => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure start is before end
    const actualStart = start <= end ? start : end;
    const actualEnd = start <= end ? end : start;
    
    const currentDate = new Date(actualStart);
    while (currentDate <= actualEnd) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  // Function to convert local time slots to proper format
  const convertToProperTimeSlots = (): TimeSlot[] => {
    if (availabilityData.specificDates.length > 0) {
      const timeSlots: TimeSlot[] = [];
      
      availabilityData.specificDates.forEach(date => {
        localTimeSlots.forEach(slot => {
          timeSlots.push({
            start_date: date,
            end_date: date,
            start_time: `${slot.startTime}:00`,
            end_time: `${slot.endTime}:00`,
            is_available: true
          });
        });
      });
      
      return timeSlots;
    }
    
    return [];
  };

  React.useEffect(() => {
    const properTimeSlots = convertToProperTimeSlots();
    const updatedAvailabilityData = {
      ...availabilityData,
      timeSlots: properTimeSlots
    };
    
    setAvailabilityData(prev => ({
      ...prev,
      timeSlots: properTimeSlots
    }));
    
    updateFormData('availability', updatedAvailabilityData);
  }, [availabilityData.specificDates, localTimeSlots, availabilityData.isAllDay]);

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

    // If this is the first date selection or we're starting a new selection
    if (!dateSelectionStart) {
      setDateSelectionStart(dateStr);
      setAvailabilityData(prev => ({
        ...prev,
        specificDates: [dateStr]
      }));
    } else {
      // This is the second date selection - create range
      const allDatesInRange = getDatesBetween(dateSelectionStart, dateStr);
      
      setAvailabilityData(prev => ({
        ...prev,
        specificDates: [...new Set([...prev.specificDates, ...allDatesInRange])]
      }));
      
      // Reset selection start for next range
      setDateSelectionStart(null);
    }
  };

  // Clear all selected dates
  const clearSelectedDates = () => {
    setAvailabilityData(prev => ({
      ...prev,
      specificDates: []
    }));
    setDateSelectionStart(null);
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
    setLocalTimeSlots(prev => [
      ...prev,
      { startTime: '09:00', endTime: '18:00' }
    ]);
  };

  const removeTimeSlot = (index: number) => {
    setLocalTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setLocalTimeSlots(prev => prev.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
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
                    const field = editingTimeSlot.field === 'start' ? 'startTime' : 'endTime';
                    updateTimeSlot(editingTimeSlot.index, field, time);
                    setShowTimeModal(false);
                    setEditingTimeSlot(null);
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
        <Text style={styles.stepTitle}>Bicycle Availability</Text>
        <Text style={styles.stepSubtitle}>
          Set when your bicycle is available for booking
        </Text>

        {/* Specific Dates Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Select Available Dates</Text>
              <Text style={styles.sectionSubtitle}>
                Tap a date to start, then tap another to create a date range
              </Text>
            </View>
          </View>
          
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

        {/* Time Slots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Time</Text>
            <TouchableOpacity
              style={styles.allDayToggle}
              onPress={() => {
                setAvailabilityData(prev => ({ ...prev, isAllDay: !prev.isAllDay }));
                if (!availabilityData.isAllDay) {
                  // If switching to all day, set 24-hour slots
                  setLocalTimeSlots([{ startTime: '00:00', endTime: '23:59' }]);
                } else {
                  // If switching from all day, set default business hours
                  setLocalTimeSlots([{ startTime: '09:00', endTime: '18:00' }]);
                }
              }}
            >
            </TouchableOpacity>
          </View>

          {!availabilityData.isAllDay && (
            <>
              {localTimeSlots.map((slot, index) => (
                <View key={index} style={styles.timeSlotContainer}>
                  <View style={styles.timeSlot}>
                    <View style={styles.timeInput}>
                      <Text style={styles.timeLabel}>From</Text>
                      <TouchableOpacity
                        style={styles.timeButton}
                        onPress={() => {
                          setEditingTimeSlot({ index, field: 'start' });
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
                          setEditingTimeSlot({ index, field: 'end' });
                          setShowTimeModal(true);
                        }}
                      >
                        <Text style={styles.timeButtonText}>{slot.endTime}</Text>
                        <ChevronDown size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>

                    {localTimeSlots.length > 1 && (
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
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
  allDayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

export default Step4Availability;