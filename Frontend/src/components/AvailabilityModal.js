import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch } from '@mui/material';

// Define the custom order mapping
const customDaysOrder = [
  { key: 0, day: 'Friday' },
  { key: 1, day: 'Saturday' },
  { key: 2, day: 'Sunday' },
  { key: 3, day: 'Monday' },
  { key: 4, day: 'Tuesday' },
  { key: 5, day: 'Wednesday' },
  { key: 6, day: 'Thursday' },
];

const AvailabilityModal = ({ open, onClose, onSave }) => {
  // Create an initial schedule using the custom order. Each key is a number.
  const initialSchedule = {};
  customDaysOrder.forEach(({ key, day }) => {
    initialSchedule[key] = {
      day, // store the day name for display purposes
      working: true,
      startTime: '09:00:00', // ensures seconds are appended from the start
      endTime: '17:00:00',
    };
  });

  const [schedule, setSchedule] = useState(initialSchedule);

  // Toggle the working status for a given day (by key)
  const handleToggle = (dayKey) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        working: !prev[dayKey].working,
      },
    }));
  };

  // Update the startTime or endTime for a given day (by key)
  // This handler ensures that the value stored in the schedule always ends with ':00'
  const handleTimeChange = (dayKey, field, value) => {
    // If value does not already end with ':00', append it.
    const formattedValue = value.endsWith(':00') ? value : `${value}:00`;
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: formattedValue,
      },
    }));
  };

  // Save handler: send the schedule object with times ending with ':00'
  const handleSave = () => {
    if (onSave) {
      onSave(schedule);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-xl font-bold">Set Your Availability</DialogTitle>
      <DialogContent dividers>
        {customDaysOrder.map(({ key, day }) => (
          <div
            key={key}
            className="flex flex-col md:flex-row items-center justify-between my-4 border-b pb-2"
          >
            {/* Show day name */}
            <div className="w-full md:w-1/4 mb-2 md:mb-0">
              <span className="font-medium">{day}</span>
            </div>
            <div className="flex items-center gap-4 w-full md:w-3/4">
              <Switch
                checked={schedule[key].working}
                onChange={() => handleToggle(key)}
                color="primary"
              />
              {schedule[key].working && (
                <div className="flex gap-4 w-full">
                  <div className="flex flex-col">
                    <label className="text-sm">Start Time</label>
                    <input
                      type="time"
                      value={schedule[key].startTime.slice(0, 5)}
                      onChange={(e) => handleTimeChange(key, 'startTime', e.target.value)}
                      className="border border-gray-300 rounded p-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm">End Time</label>
                    <input
                      type="time"
                      value={schedule[key].endTime.slice(0, 5)}
                      onChange={(e) => handleTimeChange(key, 'endTime', e.target.value)}
                      className="border border-gray-300 rounded p-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvailabilityModal;
