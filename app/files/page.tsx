'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileUp, 
  Search, 
  Tag as TagIcon, 
  Download, 
  Trash2, 
  X, 
  FileText, 
  Filter,
  MoreVertical,
  Hash,
  FolderOpen
} from 'lucide-react';

interface FileData {
  id: string;
  name: string;
  tags: string[];
  uploadDate: string;
  size: string;
  type: string;
}

const initialFiles: FileData[] = [
  { id: '1', name: '2026_신입생환영회_예산안.xlsx', tags: ['2026', '행사', '예산'], uploadDate: '2026-03-10', size: '42KB', type: 'excel' },
  { id: '2', name: '영수증_식비_박동우.pdf', tags: ['영수증', '지출증빙', '2026'], uploadDate: '2026-03-15', size: '1.2MB', type: 'pdf' },
  { id: '3', name: '봄_정기MT_기획서.docx', tags: ['행사', '기획', 'MT'], uploadDate: '2026-04-02', size: '245KB', type: 'word' },
  { id: '4', name: '통장사본_1분기.jpg', tags: ['증빙', '회계결산', '2026'], uploadDate: '2026-04-10', size: '850KB', type: 'image' },
  { id: '5', name: '학생회비_납부자명단_최종.xlsx', tags: ['회계결산', '명단'], uploadDate: '2026-04-15', size: '64KB', type: 'excel' },
];

export default function FilesPage() {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // New file state
  const [newFile, setNewFile] = useState({
    name: '',
    tags: '',
  });

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    files.forEach(file => file.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [files]);

  // Filtering Logic
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => file.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [files, searchTerm, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile.name) return;

    const tagsArray = newFile.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const file: FileData = {
      id: Date.now().toString(),
      name: newFile.name,
      tags: tagsArray,
      uploadDate: new Date().toISOString().split('T')[0],
      size: '15KB', // Dummy size
      type: 'other'
    };

    setFiles([file, ...files]);
    setIsUploadModalOpen(false);
    setNewFile({ name: '', tags: '' });
  };

  const deleteFile = (id: string) => {
    if (confirm('정말로 이 파일을 삭제하시겠습니까?')) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FolderOpen className="text-blue-600" />
            파일 관리
          </h2>
          <p className="mt-2 text-gray-600">폴더가 아닌 태그로 스마트하게 파일을 관리하세요.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
        >
          <FileUp size={18} />
          파일 업로드
        </button>
      </header>

      {/* Search and Tag Filtering Area */}
      <section className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-blue-400 focus:shadow-md transition-all"
            placeholder="파일명으로 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 text-gray-400 mr-2">
            <TagIcon size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">인기 태그</span>
          </div>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              #{tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button 
              onClick={() => setSelectedTags([])}
              className="text-xs font-bold text-gray-400 hover:text-red-500 ml-2"
            >
              초기화
            </button>
          )}
        </div>
      </section>

      {/* File List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-52">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${
                  file.type === 'excel' ? 'bg-green-50 text-green-600' :
                  file.type === 'pdf' ? 'bg-red-50 text-red-600' :
                  file.type === 'word' ? 'bg-blue-50 text-blue-600' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  <FileText size={20} />
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                  <button 
                    onClick={() => deleteFile(file.id)}
                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h4 className="font-bold text-gray-800 text-sm line-clamp-1 mb-2" title={file.name}>
                {file.name}
              </h4>
              <div className="flex flex-wrap gap-1 mt-auto">
                {file.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <span className="text-[10px] font-bold text-gray-300 uppercase">{file.uploadDate}</span>
              <span className="text-[10px] font-bold text-gray-300">{file.size}</span>
            </div>
          </div>
        ))}
        
        {filteredFiles.length === 0 && (
          <div className="col-span-full py-32 text-center text-gray-400">
            <Search className="mx-auto w-12 h-12 opacity-10 mb-4" />
            <p className="text-sm font-medium">선택한 조건에 맞는 파일이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">새 파일 업로드</h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-5">
              <div className="border-2 border-dashed border-gray-100 rounded-3xl py-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group">
                <FileUp className="text-gray-300 group-hover:text-blue-500 mb-2 transition-colors" size={32} />
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">파일을 드래그하거나 클릭하여 선택</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">파일명</label>
                <input 
                  autoFocus
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                  placeholder="파일명이 자동으로 입력됩니다."
                  value={newFile.name}
                  onChange={(e) => setNewFile({...newFile, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">태그 (쉼표로 구분)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                    placeholder="2026, 영수증, 행사비"
                    value={newFile.tags}
                    onChange={(e) => setNewFile({...newFile, tags: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-4 border border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
                >
                  업로드 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
