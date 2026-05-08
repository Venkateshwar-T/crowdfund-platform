'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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

  const selectDate = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(newDate);
    setIsOpen(false);
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

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let d = 1; d <= totalDays; d++) {
      days.push(
        <button
          key={d}
          type="button"
          onClick={() => selectDate(d)}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-all",
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

  return (
    <div className={cn("relative w-full", className)} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-background border border-muted-foreground/20 rounded-xl px-5 py-3 h-12 shadow-sm hover:border-primary/50 transition-all text-foreground",
          !value && "text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon size={18} className="text-primary" />
          <span className="font-medium">
            {value ? format(value, 'MMMM d, yyyy') : (placeholder || 'Select date')}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-background rounded-2xl shadow-2xl border border-border p-5 z-[100] animate-in fade-in zoom-in duration-200 origin-top">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-1">
              <button 
                type="button" 
                onClick={() => changeMonth(-1)} 
                className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-primary transition-colors"
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

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-[10px] font-bold text-muted-foreground/60 text-center uppercase py-1">{d}</div>
            ))}
            {renderGrid()}
          </div>
          
          <button 
            type="button"
            onClick={() => {
              const now = new Date();
              setViewDate(now); 
              onChange(now); 
              setIsOpen(false);
            }}
            className="w-full mt-3 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors"
          >
            Reset to Today
          </button>
        </div>
      )}
    </div>
  );
}
