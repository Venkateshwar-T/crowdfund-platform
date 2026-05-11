'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, setHours, setMinutes } from 'date-fns';

interface CustomDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDatePicker({ value, onChange, placeholder, className }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const popoverRef = useRef<HTMLDivElement>(null);

  // Time state
  const [hours, setHoursState] = useState(value ? format(value, 'hh') : '12');
  const [minutes, setMinutesState] = useState(value ? format(value, 'mm') : '00');
  const [ampm, setAmPm] = useState(value ? format(value, 'a') : 'PM');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const updateDateTime = (newDate: Date, h: string, m: string, p: string) => {
    let hour = parseInt(h);
    if (p === 'PM' && hour < 12) hour += 12;
    if (p === 'AM' && hour === 12) hour = 0;
    
    const finalDate = setMinutes(setHours(newDate, hour), parseInt(m));
    onChange(finalDate);
  };

  const selectDate = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    
    if (newDate < today) return;

    setViewDate(newDate);
    updateDateTime(newDate, hours, minutes, ampm);
  };

  const handleTimeChange = (type: 'h' | 'm' | 'p', val: string) => {
    let newH = hours;
    let newM = minutes;
    let newP = ampm;

    if (type === 'h') newH = val;
    if (type === 'm') newM = val;
    if (type === 'p') newP = val;

    setHoursState(newH);
    setMinutesState(newM);
    setAmPm(newP);

    if (value || viewDate) {
      updateDateTime(value || viewDate, newH, newM, newP);
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           viewDate.getMonth() === today.getMonth() && 
           viewDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return day === value.getDate() && 
           viewDate.getMonth() === value.getMonth() && 
           viewDate.getFullYear() === value.getFullYear();
  };

  const renderGrid = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateToCheck = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const isPast = dateToCheck < today;

      days.push(
        <button
          key={d}
          type="button"
          disabled={isPast}
          onClick={() => !isPast && selectDate(d)}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-all",
            isPast ? "opacity-20 cursor-not-allowed text-muted-foreground" : 
            isSelected(d) 
              ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20' 
              : isToday(d) 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'hover:bg-primary/10 hover:text-primary text-foreground'
          )}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const todayDate = new Date();
  const isCurrentMonth = viewDate.getMonth() === todayDate.getMonth() && 
                        viewDate.getFullYear() === todayDate.getFullYear();

  return (
    <div className={cn("relative w-full", className)} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-background border border-muted-foreground/20 rounded-xl px-4 py-2 md:px-5 md:py-3 h-10 md:h-12 shadow-sm hover:border-primary/50 transition-all text-sm md:text-base text-foreground",
          !value && "text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon size={16} className="text-primary md:w-[18px] md:h-[18px]" />
          <span className="font-medium">
            {value ? format(value, 'MMM d, yyyy hh:mm a') : (placeholder || 'Select date & time')}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-background rounded-2xl shadow-2xl border border-border p-5 z-[100] animate-in fade-in zoom-in duration-200 origin-top min-w-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm md:text-base text-foreground">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-1">
              <button 
                type="button" 
                onClick={() => changeMonth(-1)} 
                disabled={isCurrentMonth}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  isCurrentMonth 
                    ? "opacity-20 cursor-not-allowed text-muted-foreground" 
                    : "hover:bg-accent text-muted-foreground hover:text-primary"
                )}
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                type="button" 
                onClick={() => changeMonth(1)} 
                className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-[10px] font-bold text-muted-foreground/60 text-center uppercase py-1">{d}</div>
            ))}
            {renderGrid()}
          </div>

          <div className="pt-4 border-t border-border/50 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <Clock size={12} />
              Exact Time
            </div>
            <div className="flex items-center justify-center gap-2">
              <select 
                value={hours} 
                onChange={(e) => handleTimeChange('h', e.target.value)}
                className="bg-muted/50 border rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span className="font-bold">:</span>
              <select 
                value={minutes} 
                onChange={(e) => handleTimeChange('m', e.target.value)}
                className="bg-muted/50 border rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="flex bg-muted/50 border rounded-lg overflow-hidden">
                {['AM', 'PM'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleTimeChange('p', p)}
                    className={cn(
                      "px-2.5 py-1.5 text-[10px] font-black transition-all",
                      ampm === p ? "bg-primary text-white" : "hover:bg-primary/10 text-muted-foreground"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
