'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  BarChart3, 
  Sparkles, 
  Plus, 
  Trash2, 
  FileDown, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Edit2,
  X,
  FileText,
  Download
} from 'lucide-react';

type AuditStatus = '완료' | '검토 중' | '누락';

interface AuditItem {
  id: string;
  text: string;
  status: AuditStatus;
}

interface StandardForm {
  id: string;
  name: string;
  description: string;
  fileSize: string;
}

export default function AuditPage() {
  const auditDate = new Date('2026-05-20');
  const [noticeText, setNoticeText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<{
    deadline: string;
    docs: string[];
    location: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [checklist, setChecklist] = useState<AuditItem[]>([
    { id: '1', text: '1학기 정기 회계 장부 취합', status: '완료' },
    { id: '2', text: '통장 사본(잔액 증명 포함) 발급', status: '검토 중' },
  ]);

  const standardForms: StandardForm[] = [
    { id: 'sf1', name: '지출 결의서_표준양식.xlsx', description: '모든 지출에 필수 첨부', fileSize: '42KB' },
    { id: 'sf2', name: '행사 결과 보고서_템플릿.docx', description: '행사 종료 후 7일 이내 작성', fileSize: '128KB' },
    { id: 'sf3', name: '입금 확인서.pdf', description: '미확인 입금자 증빙용', fileSize: '85KB' },
    { id: 'sf4', name: '예산 집행 내역서_양식.xlsx', description: '총학 제출용 통합 양식', fileSize: '56KB' },
  ];

  // Stats Calculation
  const stats = useMemo(() => {
    const total = checklist.length;
    const completed = checklist.filter(i => i.status === '완료').length;
    const reviewing = checklist.filter(i => i.status === '검토 중').length;
    const missing = checklist.filter(i => i.status === '누락').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, reviewing, missing, percent };
  }, [checklist]);

  // AI Analysis Simulation
  const handleAiAnalysis = () => {
    if (!noticeText.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const mockResult = {
        deadline: '2026년 5월 20일 오후 5시까지',
        docs: ['2026-1학기 총 장부', '영수증 원본철', '행사별 결과 보고서'],
        location: '학생회관 302호 학생지원팀 방문 제출'
      };
      
      setAiAnalysis(mockResult);
      
      // Auto-populate checklist
      const newItems: AuditItem[] = mockResult.docs.map((doc, idx) => ({
        id: `ai-${Date.now()}-${idx}`,
        text: `[AI추천] ${doc}`,
        status: '누락'
      }));
      
      setChecklist(prev => [...prev, ...newItems]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const updateStatus = (id: string, newStatus: AuditStatus) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const deleteItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const addItem = () => {
    const newItem: AuditItem = {
      id: Date.now().toString(),
      text: '새로운 준비 항목',
      status: '누락'
    };
    setChecklist(prev => [newItem, ...prev]);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" />
            감사 준비
          </h2>
          <p className="mt-2 text-gray-600">AI 분석을 통해 감사 항목을 자동으로 생성하고 관리하세요.</p>
        </div>
        <div className="bg-red-50 border border-red-100 px-6 py-3 rounded-2xl text-center">
          <p className="text-xs font-bold text-red-400 uppercase tracking-wider">감사일까지</p>
          <p className="text-2xl font-black text-red-600">D-18</p>
        </div>
      </header>

      {/* Progress Overview */}
      <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col justify-center items-center border-r border-gray-100">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * stats.percent) / 100} className="text-blue-600 transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-800">{stats.percent}%</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Progress</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '전체 항목', value: stats.total, color: 'text-gray-800', bg: 'bg-gray-50' },
              { label: '완료됨', value: stats.completed, color: 'text-green-600', bg: 'bg-green-50' },
              { label: '누락/미완료', value: stats.missing, color: 'text-red-600', bg: 'bg-red-50' },
              { label: '검토 중', value: stats.reviewing, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((s, idx) => (
              <div key={idx} className={`${s.bg} p-6 rounded-2xl flex flex-col items-center justify-center`}>
                <span className="text-xs font-bold text-gray-500 mb-1">{s.label}</span>
                <span className={`text-2xl font-black ${s.color}`}>{s.value}개</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Notice Analyzer */}
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-blue-400 w-5 h-5" />
              <h3 className="text-lg font-bold">AI 감사 공지 분석</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              학교에서 공지된 감사 텍스트를 붙여넣으세요. 기한과 필요 서류를 분석하여 체크리스트를 자동 생성합니다.
            </p>
            <textarea 
              className="w-full h-40 bg-white/10 border border-white/20 rounded-xl p-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-400 transition-all mb-4 resize-none"
              placeholder="여기에 감사 공지사항 전문을 붙여넣으세요..."
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
            />
            <button 
              onClick={handleAiAnalysis}
              disabled={isAnalyzing || !noticeText.trim()}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isAnalyzing ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="animate-spin w-4 h-4" />
                  분석 중...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  분석 및 리스트 생성
                </>
              )}
            </button>
          </div>

          {aiAnalysis && (
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 animate-in slide-in-from-top duration-500">
              <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                <AlertCircle size={16} />
                AI 분석 요약 결과
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">최종 제출 기한</p>
                  <p className="text-sm font-bold text-gray-800">{aiAnalysis.deadline}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">분석된 필요 서류</p>
                  <ul className="space-y-1">
                    {aiAnalysis.docs.map((doc, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">제출처</p>
                  <p className="text-sm font-bold text-gray-800">{aiAnalysis.location}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Dynamic Checklist */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={20} />
              감사 준비 체크리스트
            </h3>
            <button 
              onClick={addItem}
              className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
            >
              <Plus size={14} />
              항목 직접 추가
            </button>
          </div>
          <div className="space-y-3">
            {checklist.map(item => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${
                    item.status === '완료' ? 'bg-green-100 text-green-600' :
                    item.status === '검토 중' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {item.status === '완료' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  <input 
                    className={`text-sm font-medium outline-none bg-transparent border-b border-transparent focus:border-blue-400 transition-all flex-1 ${
                      item.status === '완료' ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
                    value={item.text}
                    onChange={(e) => {
                      const newText = e.target.value;
                      setChecklist(prev => prev.map(i => i.id === item.id ? { ...i, text: newText } : i));
                    }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value as AuditStatus)}
                    className="text-xs font-bold border-none outline-none cursor-pointer bg-gray-50 rounded-lg px-2 py-1"
                  >
                    <option value="누락">누락</option>
                    <option value="검토 중">검토 중</option>
                    <option value="완료">완료</option>
                  </select>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Standard Forms & Downloads */}
      <section className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileDown className="text-blue-600" size={20} />
              표준 서식 및 일괄 다운로드
            </h3>
            <p className="text-xs text-gray-500 mt-1">플랫폼에 업로드된 정식 서식들을 관리하고 한 번에 내려받으세요.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-900 transition-all shadow-lg shadow-gray-200">
            <Download size={18} />
            선택 항목 일괄 다운로드 (.zip)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {standardForms.map(form => (
            <div key={form.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                  <FileText className="text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                </div>
                <h4 className="text-sm font-bold text-gray-800 truncate mb-1">{form.name}</h4>
                <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed mb-4">{form.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-300">{form.fileSize}</span>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px] font-bold">
                  <Download size={14} />
                  다운로드
                </button>
              </div>
            </div>
          ))}
          {/* External Files Upload placeholder */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-all cursor-pointer group">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-2 group-hover:bg-blue-50">
              <Plus className="text-gray-300 group-hover:text-blue-400" size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">추가 파일 업로드</span>
          </div>
        </div>
      </section>
    </div>
  );
}
