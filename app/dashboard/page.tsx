'use client';

import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Receipt, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle,
  MoreVertical,
  Calendar
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface EventItem {
  id: string;
  name: string;
  progress: number;
  date: string;
}

export default function DashboardPage() {
  // Summary Stats
  const stats = [
    { label: '미입금자', value: '5명', icon: Users, color: 'text-red-600', bgColor: 'bg-red-50' },
    { label: '이번 달 지출', value: '₩ 120,000', icon: CreditCard, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: '미검토 영수증', value: '3건', icon: Receipt, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: '감사까지 남은 날짜', value: 'D-14', icon: Clock, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  // Ongoing Events Data
  const [events] = useState<EventItem[]>([
    { id: '1', name: '신입생 환영회', progress: 60, date: '2026-05-15' },
    { id: '2', name: '봄 정기 MT', progress: 20, date: '2026-05-28' },
  ]);

  // Audit Checklist State
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: '1분기 영수증 원본 취합', completed: true },
    { id: '2', text: '지출 결의서 회계 담당자 서명 확인', completed: false },
    { id: '3', text: '통장 사본 및 잔액 증명서 발급', completed: false },
  ]);
  const [newItemText, setNewItemText] = useState('');

  const toggleCheck = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
    };
    setChecklist([...checklist, newItem]);
    setNewItemText('');
  };

  const deleteItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">대시보드</h2>
        <p className="mt-2 text-gray-600">현재 회계 현황과 감사 준비 상태를 확인하세요.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={16} />
              </button>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ongoing Events */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              진행 중인 행사
            </h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">모두 보기</button>
          </div>
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-800">{event.name}</span>
                  <span className="text-xs text-gray-400">{event.date}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${event.progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span className="text-gray-500">예산 집행률</span>
                  <span className="font-medium text-blue-600">{event.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Audit Checklist */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              감사 준비 현황
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">
              {checklist.filter(i => i.completed).length} / {checklist.length} 완료
            </span>
          </div>

          {/* Add Item Form */}
          <form onSubmit={addItem} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="새로운 준비 항목 추가..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
            </button>
          </form>

          {/* Checklist Items */}
          <div className="space-y-2">
            {checklist.map(item => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  item.completed ? 'bg-gray-50 border-transparent opacity-60' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleCheck(item.id)}>
                  {item.completed ? (
                    <CheckCircle2 size={20} className="text-green-500 fill-green-50" />
                  ) : (
                    <Circle size={20} className="text-gray-300" />
                  )}
                  <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </div>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {checklist.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm text-gray-400">준비 항목이 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
