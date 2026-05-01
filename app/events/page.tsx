'use client';

import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isWithinInterval,
  parseISO,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Filter,
  Circle
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
}

const COLORS = [
  { name: 'Blue', value: 'bg-blue-500', border: 'border-blue-600', text: 'text-blue-700', bgLight: 'bg-blue-50' },
  { name: 'Green', value: 'bg-green-500', border: 'border-green-600', text: 'text-green-700', bgLight: 'bg-green-50' },
  { name: 'Red', value: 'bg-red-500', border: 'border-red-600', text: 'text-red-700', bgLight: 'bg-red-50' },
  { name: 'Yellow', value: 'bg-yellow-500', border: 'border-yellow-600', text: 'text-yellow-700', bgLight: 'bg-yellow-50' },
  { name: 'Purple', value: 'bg-purple-500', border: 'border-purple-600', text: 'text-purple-700', bgLight: 'bg-purple-50' },
];

export default function EventsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: '신입생 환영회', startDate: '2026-05-10', endDate: '2026-05-12', color: 'bg-blue-500' },
    { id: '2', title: '중간고사 감사 준비', startDate: '2026-05-20', endDate: '2026-05-25', color: 'bg-purple-500' },
    { id: '3', title: '봄 정기 MT', startDate: '2026-05-28', endDate: '2026-05-30', color: 'bg-green-500' },
    { id: '4', title: '과거 행사 예시', startDate: '2026-04-15', endDate: '2026-04-16', color: 'bg-gray-500' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    color: COLORS[0].value
  });

  // Calendar Logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getEventStatus = (event: Event) => {
    const today = startOfDay(new Date());
    const start = startOfDay(parseISO(event.startDate));
    const end = endOfDay(parseISO(event.endDate));

    if (isBefore(today, start)) return '준비중';
    if (isAfter(today, end)) return '종료됨';
    return '진행중';
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    
    setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
    setIsModalOpen(false);
    setNewEvent({
      title: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      color: COLORS[0].value
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">행사 관리</h2>
          <p className="mt-1 text-gray-600">행사 일정을 캘린더로 관리하고 진행 상황을 확인하세요.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          행사 추가
        </button>
      </header>

      {/* Calendar Header */}
      <div className="bg-white border border-gray-200 rounded-t-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-gray-800">
            {format(currentMonth, 'yyyy년 MM월', { locale: ko })}
          </h3>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-50 border-r border-gray-200">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-50">
              <ChevronRight size={18} />
            </button>
          </div>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="text-xs font-medium text-gray-500 hover:text-gray-800 border border-gray-200 px-2 py-1 rounded"
          >
            오늘
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl overflow-hidden mb-10">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="py-2 text-center text-xs font-bold text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayEvents = events.filter(event => 
              isWithinInterval(day, {
                start: startOfDay(parseISO(event.startDate)),
                end: endOfDay(parseISO(event.endDate))
              })
            );

            return (
              <div 
                key={idx} 
                className={`min-h-[100px] p-2 border-r border-b border-gray-100 last:border-r-0 ${
                  !isSameMonth(day, monthStart) ? 'bg-gray-50/50' : ''
                }`}
              >
                <span className={`text-xs font-medium ${
                  isSameDay(day, new Date()) 
                    ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full mx-auto mb-1' 
                    : 'text-gray-400 block text-center mb-1'
                }`}>
                  {format(day, 'd')}
                </span>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`text-[10px] truncate px-1.5 py-0.5 rounded text-white ${event.color}`}
                    >
                      {isSameDay(day, parseISO(event.startDate)) ? event.title : '\u00A0'}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Filter size={18} className="text-blue-600" />
            행사 리스트
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events
            .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime())
            .map(event => {
              const status = getEventStatus(event);
              const colorConfig = COLORS.find(c => c.value === event.color) || COLORS[0];
              
              return (
                <div key={event.id} className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-12 rounded-full ${event.color}`} />
                    <div>
                      <h4 className="font-bold text-gray-800">{event.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.startDate} ~ {event.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      status === '진행중' ? 'bg-green-100 text-green-700' :
                      status === '준비중' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Simple Add Event Modal (Simplified for MVP) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">새 행사 추가</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">행사명</label>
                <input 
                  autoFocus
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="행사 이름을 입력하세요"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">시작일</label>
                  <input 
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">종료일</label>
                  <input 
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">구분 색상</label>
                <div className="flex gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewEvent({...newEvent, color: color.value})}
                      className={`w-8 h-8 rounded-full ${color.value} border-2 transition-all ${
                        newEvent.color === color.value ? 'border-gray-800 scale-110' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
