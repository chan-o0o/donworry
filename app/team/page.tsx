'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  UserCog, 
  User, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Send,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

type Role = '회장' | '부회장' | '단원';

interface Member {
  id: string;
  name: string;
  studentId: string;
  phone: string;
  role: Role;
}

const initialMembers: Member[] = [
  { id: '1', name: '김회장', studentId: '20210001', phone: '010-1111-1111', role: '회장' },
  { id: '2', name: '이부회', studentId: '20210002', phone: '010-2222-2222', role: '부회장' },
  { id: '3', name: '박단원', studentId: '20220001', phone: '010-3333-3333', role: '단원' },
  { id: '4', name: '최단원', studentId: '20220002', phone: '010-4444-4444', role: '단원' },
  { id: '5', name: '정단원', studentId: '20230001', phone: '010-5555-5555', role: '단원' },
];

export default function TeamPage() {
  const [currentUserRole, setCurrentUserRole] = useState<Role>('회장');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestContent, setRequestContent] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Role color configuration
  const roleStyles = {
    '회장': 'bg-purple-100 text-purple-700 border-purple-200',
    '부회장': 'bg-blue-100 text-blue-700 border-blue-200',
    '단원': 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequestModalOpen(false);
    setRequestContent('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('정말로 이 팀원을 삭제하시겠습니까?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const handleRoleChange = (id: string, newRole: Role) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Role Switcher for Simulation */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 text-amber-800">
          <AlertCircle size={20} />
          <span className="text-sm font-bold">MVP 시뮬레이션: 현재 접속 계정의 역할을 선택하세요.</span>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-amber-200 shadow-inner">
          {(['회장', '부회장', '단원'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentUserRole(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentUserRole === r 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" />
            팀원 관리
          </h2>
          <p className="mt-2 text-gray-600">팀원들의 권한을 관리하고 정보를 최신으로 유지하세요.</p>
        </div>
        {currentUserRole === '회장' && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
            <UserPlus size={18} />
            팀원 추가
          </button>
        )}
      </header>

      {/* Member Table */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-8 py-4">팀원명</th>
              <th className="px-8 py-4">학번</th>
              <th className="px-8 py-4">연락처</th>
              <th className="px-8 py-4">직책</th>
              <th className="px-8 py-4 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      member.role === '회장' ? 'bg-purple-50 text-purple-600' : 
                      member.role === '부회장' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {member.name[0]}
                    </div>
                    <span className="font-bold text-gray-800">{member.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-gray-500 font-medium">{member.studentId}</td>
                <td className="px-8 py-5 text-sm text-gray-500">{member.phone}</td>
                <td className="px-8 py-5">
                  {currentUserRole === '회장' ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as Role)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-all ${roleStyles[member.role]}`}
                    >
                      <option value="회장">회장</option>
                      <option value="부회장">부회장</option>
                      <option value="단원">단원</option>
                    </select>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${roleStyles[member.role]}`}>
                      {member.role}
                    </span>
                  )}
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    {currentUserRole === '회장' ? (
                      <>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="수정">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                          title="삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : currentUserRole === '부회장' ? (
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="수정">
                        <Edit size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="text-xs font-bold text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-1"
                      >
                        <Send size={14} />
                        수정 요청
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">관리자에게 수정 요청</h3>
              <button 
                onClick={() => setIsRequestModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  본인의 정보(연락처 등)가 잘못되었거나 업무상 정보 변경이 필요한 경우 사유를 작성해 주세요. 회장/부회장이 확인 후 승인합니다.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">요청 내용 및 사유</label>
                <textarea 
                  autoFocus
                  required
                  className="w-full h-32 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                  placeholder="예: 연락처가 010-1234-5678로 변경되었습니다. 수정 부탁드립니다."
                  value={requestContent}
                  onChange={(e) => setRequestContent(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  요청 전송
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 z-50">
          <div className="p-1 bg-green-500 rounded-full text-white">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-sm font-bold">수정 요청 완료</p>
            <p className="text-[10px] text-gray-400">관리자가 확인 후 정보를 수정할 예정입니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
