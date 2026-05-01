'use client';

import React, { useState } from 'react';
import { 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  UserMinus, 
  HelpCircle,
  Search,
  ArrowRightLeft,
  ChevronDown,
  X,
  FileText,
  Users,
  Sparkles,
  RotateCcw
} from 'lucide-react';

type SettlementStatus = '정상' | '확인 필요' | '미입금' | '미신청';

interface SettlementResult {
  id: string;
  name: string;
  phone: string;
  applied: boolean;
  depositAmount: number;
  depositDate: string;
  status: SettlementStatus;
}

interface OcrItem {
  name: string;
  count: number;
  price: number;
  isUnclear: boolean;
}

interface OcrResult {
  vendor: string;
  date: string;
  method: string;
  total: number;
  items: OcrItem[];
}

const initialData: SettlementResult[] = [
  { id: '1', name: '김철수', phone: '010-1234-5678', applied: true, depositAmount: 15000, depositDate: '2026-05-01', status: '정상' },
  { id: '2', name: '이영희', phone: '010-9876-5432', applied: true, depositAmount: 15000, depositDate: '2026-05-01', status: '정상' },
  { id: '3', name: '박지성', phone: '010-1111-2222', applied: true, depositAmount: 10000, depositDate: '2026-05-02', status: '확인 필요' },
  { id: '4', name: '손흥민', phone: '010-3333-4444', applied: true, depositAmount: 0, depositDate: '-', status: '미입금' },
  { id: '5', name: '홍길동', phone: '010-5555-6666', applied: false, depositAmount: 15000, depositDate: '2026-05-02', status: '미신청' },
  { id: '6', name: '김동우', phone: '010-7777-8888', applied: true, depositAmount: 15000, depositDate: '2026-05-03', status: '정상' },
];

export default function SettlementPage() {
  const [isCompared, setIsCompared] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'전체' | SettlementStatus>('전체');
  const [data, setData] = useState<SettlementResult[]>([]);
  const [files, setFiles] = useState({
    applicants: false,
    deposits: false,
    payers: false
  });

  const [selectedStudent, setSelectedStudent] = useState<SettlementResult | null>(null);
  
  // OCR State
  const [ocrData, setOcrData] = useState<OcrResult | null>(null);

  const handleFileUpload = (type: keyof typeof files) => {
    // Simulating file upload
    setFiles(prev => ({ ...prev, [type]: true }));
  };

  const handleOcrUpload = () => {
    // Simulating OCR analysis process
    const mockOcrResult: OcrResult = {
      vendor: '(주)맛있는식당',
      date: '2026-05-01 12:30:45',
      method: '국민카드 (9410)',
      total: 23000,
      items: [
        { name: '김치찌개', count: 2, price: 16000, isUnclear: false },
        { name: '공기밥', count: 2, price: 2000, isUnclear: false },
        { name: '판독불가_항목', count: 1, price: 5000, isUnclear: true },
      ]
    };
    setOcrData(mockOcrResult);
  };

  const startComparison = () => {
    // Simulating comparison process
    setIsCompared(true);
    setData(initialData);
  };

  const handleStatusChange = (id: string, newStatus: SettlementStatus) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const filteredData = activeFilter === '전체' 
    ? data 
    : data.filter(item => item.status === activeFilter);

  const statusCounts = {
    전체: data.length,
    정상: data.filter(i => i.status === '정상').length,
    '확인 필요': data.filter(i => i.status === '확인 필요').length,
    미입금: data.filter(i => i.status === '미입금').length,
    미신청: data.filter(i => i.status === '미신청').length,
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">회계 결산</h2>
        <p className="mt-2 text-gray-600">엑셀 데이터를 대조하여 입금 내역을 검증합니다.</p>
      </header>

      {/* File Upload Section */}
      {!isCompared && (
        <section className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileUp className="text-blue-600 w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">대조용 파일 업로드</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'applicants', label: '신청자 명단', desc: '행사 신청 폼 응답 데이터' },
              { id: 'deposits', label: '입금 내역', desc: '은행 거래 내역 엑셀' },
              { id: 'payers', label: '납부자 명단', desc: '학생회비 납부 여부 명단' }
            ].map((file) => (
              <div 
                key={file.id}
                onClick={() => handleFileUpload(file.id as keyof typeof files)}
                className={`p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                  files[file.id as keyof typeof files] 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                {files[file.id as keyof typeof files] ? (
                  <CheckCircle2 className="text-green-500 w-8 h-8 mb-3" />
                ) : (
                  <FileUp className="text-gray-300 w-8 h-8 mb-3" />
                )}
                <span className="font-bold text-gray-800 text-sm">{file.label}</span>
                <span className="text-xs text-gray-400 mt-1">{file.desc}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={startComparison}
              disabled={!files.applicants || !files.deposits || !files.payers}
              className={`flex items-center gap-2 px-10 py-3 rounded-xl font-bold transition-all ${
                files.applicants && files.deposits && files.payers
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ArrowRightLeft size={20} />
              대조 시작하기
            </button>
          </div>
        </section>
      )}

      {/* Results Section */}
      {isCompared && (
        <div className="space-y-6">
          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2">
            {(['전체', '정상', '확인 필요', '미입금', '미신청'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeFilter === filter 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeFilter === filter ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {statusCounts[filter]}
                </span>
              </button>
            ))}
          </div>

          {/* Result Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">이름</th>
                  <th className="px-6 py-4">연락처</th>
                  <th className="px-6 py-4">신청 현황</th>
                  <th className="px-6 py-4">입금액</th>
                  <th className="px-6 py-4">입금일</th>
                  <th className="px-6 py-4">상태 및 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-gray-500">{item.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        item.applied ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.applied ? '신청' : '미신청'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      ₩ {item.depositAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.depositDate}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div className="relative inline-block group">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as SettlementStatus)}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold cursor-pointer outline-none border transition-all ${
                            item.status === '정상' ? 'bg-green-50 border-green-200 text-green-700' :
                            item.status === '확인 필요' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            item.status === '미입금' ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          <option value="정상">정상</option>
                          <option value="확인 필요">확인 필요</option>
                          <option value="미입금">미입금</option>
                          <option value="미신청">미신청</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                      </div>
                      <button 
                        onClick={() => setSelectedStudent(item)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                      >
                        확인
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="py-20 text-center text-gray-400">
                <Search className="mx-auto w-10 h-10 opacity-20 mb-3" />
                해당하는 학생이 없습니다.
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => setIsCompared(false)}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
              다시 대조하기
            </button>
          </div>

          {/* AI OCR Receipt Section */}
          <section className="mt-16 pt-16 border-t border-gray-100 space-y-8 pb-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles className="text-blue-600 w-5 h-5" />
                  AI OCR 영수증 판독 및 자동 입력
                </h3>
                <p className="mt-1 text-sm text-gray-500">영수증 사진을 업로드하면 항목별로 판독하여 장부에 즉시 반영합니다.</p>
              </div>
              <button 
                onClick={() => setOcrData(null)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <RotateCcw size={14} />
                초기화
              </button>
            </div>

            {!ocrData ? (
              <div 
                onClick={handleOcrUpload}
                className="border-2 border-dashed border-gray-200 rounded-3xl py-20 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="text-blue-500" size={32} />
                </div>
                <span className="text-sm font-bold text-gray-600">영수증 사진 업로드 (JPG, PNG)</span>
                <span className="text-xs text-gray-400 mt-2">사진을 드래그하거나 클릭하여 판독을 시작하세요.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Left: Receipt Image Preview */}
                <div className="relative bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 aspect-[3/4] flex items-center justify-center group">
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <button className="bg-white text-gray-800 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                      <Search size={14} />
                      원본 크게 보기
                    </button>
                  </div>
                  {/* Simulated Receipt Image */}
                  <div className="w-64 h-80 bg-white shadow-xl p-6 text-[10px] font-mono leading-tight text-gray-600 relative overflow-hidden">
                    <div className="text-center font-bold text-sm mb-4 border-b border-dashed border-gray-300 pb-2">RECEIPT</div>
                    <div className="flex justify-between mb-1"><span>[업체명]</span> <span>(주)맛있는식당</span></div>
                    <div className="flex justify-between mb-4 text-gray-400"><span>[주소]</span> <span>서울시 강남구...</span></div>
                    <div className="space-y-1 border-b border-dashed border-gray-300 pb-2 mb-2">
                      <div className="flex justify-between"><span>김치찌개 x 2</span> <span>16,000</span></div>
                      <div className="flex justify-between"><span>공기밥 x 2</span> <span>2,000</span></div>
                      <div className="flex justify-between text-gray-300"><span>(판독불가항목)</span> <span>5,000</span></div>
                    </div>
                    <div className="flex justify-between font-bold text-sm"><span>TOTAL</span> <span>23,000</span></div>
                    <div className="mt-10 pt-4 border-t border-gray-300 flex flex-col items-center">
                      <div className="w-32 h-8 bg-gray-100 mb-2"></div>
                      <span>THANK YOU</span>
                    </div>
                    {/* OCR Scanning Line Animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-scan"></div>
                  </div>
                </div>

                {/* Right: Extracted Data View */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">업체명</label>
                        <input 
                          className="w-full text-sm font-bold text-gray-800 bg-gray-50 border-none rounded-lg px-3 py-2" 
                          value={ocrData.vendor} 
                          onChange={(e) => setOcrData({...ocrData, vendor: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">결제 수단</label>
                        <input 
                          className="w-full text-sm font-bold text-gray-800 bg-gray-50 border-none rounded-lg px-3 py-2" 
                          value={ocrData.method} 
                          onChange={(e) => setOcrData({...ocrData, method: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">결제일시</label>
                        <input 
                          className="w-full text-sm font-bold text-gray-800 bg-gray-50 border-none rounded-lg px-3 py-2" 
                          value={ocrData.date} 
                          onChange={(e) => setOcrData({...ocrData, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">합계 금액</label>
                        <div className="relative">
                          <input 
                            className="w-full text-sm font-black text-blue-600 bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2" 
                            value={`₩ ${ocrData.total.toLocaleString()}`} 
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">품목 상세 내역</label>
                      <div className="space-y-2">
                        {ocrData.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              item.isUnclear ? 'bg-amber-50 border-amber-200 animate-pulse' : 'bg-gray-50 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {item.isUnclear && <AlertCircle size={14} className="text-amber-500" />}
                              <input 
                                className={`text-xs font-bold bg-transparent border-none outline-none flex-1 ${item.isUnclear ? 'text-amber-800' : 'text-gray-700'}`}
                                value={item.name}
                                onChange={(e) => {
                                  const newItems = [...ocrData.items];
                                  newItems[idx].name = e.target.value;
                                  setOcrData({...ocrData, items: newItems});
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-400">x{item.count}</span>
                              <span className="text-xs font-bold text-gray-800">₩ {item.price.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {ocrData.items.some(i => i.isUnclear) && (
                        <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-2">
                          <AlertCircle size={12} />
                          일부 항목이 불분명하게 판독되었습니다. 확인 후 수정해 주세요.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2">
                      <RotateCcw size={16} />
                      재발급 요청
                    </button>
                    <button 
                      onClick={() => {
                        alert('장부에 반영되었습니다.');
                        setOcrData(null);
                      }}
                      className="py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      장부에 즉시 반영
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">{selectedStudent.name} 학생 상세 정보</h3>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-10 overflow-y-auto max-h-[70vh]">
              {/* 1. Applicant Excel Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-green-700 uppercase tracking-wider">
                    <FileText size={14} />
                    신청자 명단.xlsx (원본 대조)
                  </div>
                  <span className="text-[10px] text-gray-400">Sheet1</span>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden text-[11px] font-sans shadow-inner bg-[#f3f3f3]">
                  <div className="flex border-b border-gray-200">
                    <div className="w-10 bg-[#e6e6e6] border-r border-gray-300"></div>
                    {['A', 'B', 'C', 'D'].map(h => (
                      <div key={h} className="flex-1 py-1 px-2 border-r border-gray-300 text-center text-gray-500 font-medium">{h}</div>
                    ))}
                  </div>
                  <div className="flex border-b border-gray-200 bg-[#f9f9f9] font-bold text-gray-600">
                    <div className="w-10 py-1 text-center bg-[#e6e6e6] border-r border-gray-300">1</div>
                    <div className="flex-1 py-1 px-2 border-r border-gray-300">타임스탬프</div>
                    <div className="flex-1 py-1 px-2 border-r border-gray-300">이름</div>
                    <div className="flex-1 py-1 px-2 border-r border-gray-300">연락처</div>
                    <div className="flex-1 py-1 px-2">참가 행사</div>
                  </div>
                  {[2, 3, 4].map((row) => (
                    <div key={row} className={`flex border-b border-gray-200 bg-white ${row === 3 ? 'bg-blue-50' : ''}`}>
                      <div className="w-10 py-1 text-center bg-[#e6e6e6] border-r border-gray-300 text-gray-400">{row}</div>
                      <div className="flex-1 py-1 px-2 border-r border-gray-300 truncate">2026.05.01 10:20:{row}0</div>
                      <div className={`flex-1 py-1 px-2 border-r border-gray-300 ${row === 3 ? 'font-bold text-blue-600' : ''}`}>
                        {row === 3 ? selectedStudent.name : '김*수'}
                      </div>
                      <div className="flex-1 py-1 px-2 border-r border-gray-300">{row === 3 ? selectedStudent.phone : '010-****-****'}</div>
                      <div className="flex-1 py-1 px-2">봄 정기 MT</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Bank Deposit Excel Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <ArrowRightLeft size={14} />
                    기업은행_거래내역조회.xls (원본 대조)
                  </div>
                  <span className="text-[10px] text-gray-400">거래내역</span>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden text-[11px] font-sans shadow-inner bg-[#f3f3f3]">
                  <div className="flex border-b border-gray-200">
                    <div className="w-10 bg-[#e6e6e6] border-r border-gray-300"></div>
                    {['A', 'B', 'C', 'D'].map(h => (
                      <div key={h} className="flex-1 py-1 px-2 border-r border-gray-300 text-center text-gray-500 font-medium">{h}</div>
                    ))}
                  </div>
                  <div className="flex border-b border-gray-200 bg-[#f9f9f9] font-bold text-gray-600">
                    <div className="w-10 py-1 text-center bg-[#e6e6e6] border-r border-gray-300">1</div>
                    <div className="flex-1 py-1 px-2 border-r border-gray-300">거래일자</div>
                    <div className="flex-1 py-1 px-2 border-r border-gray-300">적요(입금자)</div>
                    <div className="flex-1 py-1 px-2 border-r border-gray-300">입금액</div>
                    <div className="flex-1 py-1 px-2">잔액</div>
                  </div>
                  {[12, 13, 14].map((row) => (
                    <div key={row} className={`flex border-b border-gray-200 bg-white ${row === 13 && selectedStudent.depositAmount > 0 ? 'bg-green-50' : ''}`}>
                      <div className="w-10 py-1 text-center bg-[#e6e6e6] border-r border-gray-300 text-gray-400">{row}</div>
                      <div className="flex-1 py-1 px-2 border-r border-gray-300">{selectedStudent.depositDate}</div>
                      <div className={`flex-1 py-1 px-2 border-r border-gray-300 ${row === 13 && selectedStudent.depositAmount > 0 ? 'font-bold text-green-600' : ''}`}>
                        {row === 13 && selectedStudent.depositAmount > 0 ? selectedStudent.name : '홍*동'}
                      </div>
                      <div className={`flex-1 py-1 px-2 border-r border-gray-300 text-right ${row === 13 && selectedStudent.depositAmount > 0 ? 'font-bold' : ''}`}>
                        {row === 13 && selectedStudent.depositAmount > 0 ? selectedStudent.depositAmount.toLocaleString() : '15,000'}
                      </div>
                      <div className="flex-1 py-1 px-2 text-right text-gray-400">1,240,000</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Note */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={24} />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">결산 시스템 정밀 진단</h4>
                  <p className="text-xs text-amber-800 mt-1.5 leading-relaxed font-medium">
                    {selectedStudent.status === '확인 필요' 
                      ? "엑셀 시트 B열(이름)은 일치하나, D열(입금액)이 신청 금액과 다릅니다. 원본 파일의 적요란을 다시 한 번 확인해 주세요."
                      : selectedStudent.status === '미입금'
                      ? "신청자 명단 3행에는 정보가 존재하나, 은행 거래 내역 엑셀 전체에서 해당 이름의 입금 기록을 찾을 수 없습니다."
                      : selectedStudent.status === '미신청'
                      ? "은행 거래 내역에는 입금 기록(13행)이 존재하지만, 신청자 명단 엑셀에는 해당 이름의 데이터가 누락되어 있습니다."
                      : "모든 엑셀 시트의 데이터(이름, 연락처, 금액)가 상호 교차 검증되었으며 이상이 없습니다."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
              >
                닫기
              </button>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
