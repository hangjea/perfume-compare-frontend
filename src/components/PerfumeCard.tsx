'use client';

import Link from 'next/link';
import { Perfume } from '@/types/perfume';
import { useCompareStore } from '@/store/compareStore';

interface PerfumeCardProps {
  perfume: Perfume;
}

export default function PerfumeCard({ perfume }: PerfumeCardProps) {
  const { selectedPerfumes, addPerfume, removePerfume } = useCompareStore();
  const isSelected = selectedPerfumes.includes(perfume.id);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSelected) {
      removePerfume(perfume.id);
    } else {
      addPerfume(perfume.id);
    }
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-100' : 'shadow-md'
      }`}
      style={{ backgroundColor: 'white' }}
    >
      <Link href={`/perfumes/${perfume.id}`}>
        <div className="aspect-[3/4] relative overflow-hidden" style={{ backgroundColor: '#f3f0ff' }}>
          {perfume.image_url && perfume.image_url.startsWith('http') ? (
            <img
              src={perfume.image_url}
              alt={perfume.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-5xl">🌸</span>
              <span className="text-xs text-gray-400 px-2 text-center">{perfume.name}</span>
            </div>
          )}
          {/* 선택됨 배지 */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              선택됨
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/perfumes/${perfume.id}`}>
          <h3 className="font-bold text-sm leading-tight mb-0.5 hover:text-purple-600 transition-colors line-clamp-2">
            {perfume.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-xs mb-2">{perfume.brand}</p>
        <p className="text-base font-bold mb-2" style={{ color: '#7c3aed' }}>
          ₩{perfume.price?.toLocaleString() ?? '-'}
        </p>

        <div className="flex gap-1 text-xs mb-3">
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            지속 {perfume.longevity}/10
          </span>
          <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
            발향 {perfume.sillage}/10
          </span>
        </div>

        <button
          onClick={handleCompareToggle}
          disabled={!isSelected && selectedPerfumes.length >= 2}
          className={`w-full py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            isSelected
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : selectedPerfumes.length >= 2
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'text-white hover:opacity-90'
          }`}
          style={
            !isSelected && selectedPerfumes.length < 2
              ? { backgroundColor: '#7c3aed' }
              : {}
          }
        >
          {isSelected ? '비교 취소' : '비교하기'}
        </button>
      </div>
    </div>
  );
}
