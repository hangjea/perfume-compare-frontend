'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchPerfumeById } from '@/lib/api';
import { Perfume } from '@/types/perfume';
import { useCompareStore } from '@/store/compareStore';

export default function PerfumeDetailPage() {
  const { id } = useParams();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedPerfumes, addPerfume, removePerfume } = useCompareStore();
  const isSelected = perfume ? selectedPerfumes.includes(perfume.id) : false;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPerfumeById(id as string);
        setPerfume(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">향수를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const topNotes = perfume.notes?.filter((n) => n.note_type === 'top') || [];
  const middleNotes = perfume.notes?.filter((n) => n.note_type === 'middle') || [];
  const baseNotes = perfume.notes?.filter((n) => n.note_type === 'base') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← 목록으로
          </Link>
          <h1 className="text-xl font-bold">{perfume.name}</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
            {perfume.image_url ? (
              <img
                src={perfume.image_url}
                alt={perfume.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400 text-lg">{perfume.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-gray-500 text-sm">{perfume.brand}</p>
              <h2 className="text-3xl font-bold mt-1">{perfume.name}</h2>
              <p className="text-2xl font-semibold text-blue-600 mt-2">
                ₩{perfume.price.toLocaleString()}
              </p>
            </div>

            <p className="text-gray-600">{perfume.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">지속력</p>
                <p className="text-3xl font-bold text-blue-600">{perfume.longevity}</p>
                <p className="text-xs text-gray-400">/ 10</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">발향</p>
                <p className="text-3xl font-bold text-purple-600">{perfume.sillage}</p>
                <p className="text-xs text-gray-400">/ 10</p>
              </div>
            </div>

            <button
              onClick={() =>
                isSelected ? removePerfume(perfume.id) : addPerfume(perfume.id)
              }
              disabled={!isSelected && selectedPerfumes.length >= 2}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                isSelected
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : selectedPerfumes.length >= 2
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isSelected ? '비교 취소' : '비교하기'}
            </button>

            {selectedPerfumes.length === 2 && (
              <Link
                href={`/compare?ids=${selectedPerfumes.join(',')}`}
                className="w-full py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white text-center transition-colors"
              >
                비교 페이지로 →
              </Link>
            )}
          </div>
        </div>

        {perfume.notes?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">향수 노트</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topNotes.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2">🌸 탑 노트</h4>
                  {topNotes.map((note) => (
                    <div key={note.id} className="flex justify-between text-sm py-1">
                      <span>{note.ingredient_name}</span>
                      <span className="text-gray-400">{note.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}
              {middleNotes.length > 0 && (
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-700 mb-2">🌹 미들 노트</h4>
                  {middleNotes.map((note) => (
                    <div key={note.id} className="flex justify-between text-sm py-1">
                      <span>{note.ingredient_name}</span>
                      <span className="text-gray-400">{note.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}
              {baseNotes.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-700 mb-2">🪵 베이스 노트</h4>
                  {baseNotes.map((note) => (
                    <div key={note.id} className="flex justify-between text-sm py-1">
                      <span>{note.ingredient_name}</span>
                      <span className="text-gray-400">{note.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {perfume.purchaseLinks?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">구매처</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {perfume.purchaseLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-4 rounded-lg border-2 transition-colors ${
                    link.is_available
                      ? 'border-blue-200 hover:border-blue-400 bg-white'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <p className="font-semibold">{link.platform_name}</p>
                  <p className="text-blue-600 font-bold mt-1">
                    ₩{link.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {link.is_available ? '구매 가능' : '품절'}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
