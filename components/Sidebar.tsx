'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Calculator, 
  ShieldCheck, 
  Users, 
  FileText,
  Pencil
} from 'lucide-react';

const menuItems = [
  { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { name: '행사 관리', href: '/events', icon: Calendar },
  { name: '회계 결산', href: '/settlement', icon: Calculator },
  { name: '감사 준비', href: '/audit', icon: ShieldCheck },
  { name: '팀원 관리', href: '/team', icon: Users },
  { name: '파일 관리', href: '/files', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [ledgerName, setLedgerName] = useState('우리 동아리 회계');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col w-64 h-screen bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">회계 장부</h1>
        <div className="mt-4 flex items-center gap-2 group">
          {isEditing ? (
            <input
              autoFocus
              className="text-sm bg-white border border-blue-500 rounded px-2 py-1 w-full outline-none"
              value={ledgerName}
              onChange={(e) => setLedgerName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            />
          ) : (
            <>
              <span className="text-sm text-gray-600 font-medium truncate">{ledgerName}</span>
              <button 
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
              >
                <Pencil size={14} className="text-gray-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer (Optional) */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Vercel 배포 준비 완료</span>
        </div>
      </div>
    </div>
  );
}
