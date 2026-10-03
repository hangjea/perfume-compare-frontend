'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { comparePerfumes } from '@/lib/api';
import { Perfume } from '@/types/perfume';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (!ids) return;

    const load = async () => {
      try {
        const data = await comparePerfumes(ids.split(','));
         setPerfumes(data.perfumes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (perfumes.length < 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">비교할 향수가 없습니다.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const [p1, p2] = perfumes;

  const radarData = [
  { subject: '지속력', A: p1.longevity, B: p2.longevity },
  { subject: '발향', A: p1.sillage, B: p2.sillage },
  { subject: '가격(만원)', A: p1.price / 10000, B: p2.price / 10000 },
];
  const getNotes = (perfume: Perfume, type: 'top' | 'middle' | 'base') =>
    perfume.notes?.filter((n) => n.note_type === type) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← 목록으로
          </Link>
          <h1 className="text-xl font-bold">향수 비교</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* 기본 정보 비교 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {perfumes.map((perfume) => (
            <div key={perfume.id} className="bg-white rounded-lg shadow p-6 text-center">
              <div className="bg-gray-200 rounded-lg aspect-square w-40 mx-auto flex items-center justify-center mb-4">
                {perfume.image_url ? (
                  <img
                    src={perfume.image_url}
                    alt={perfume.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">{perfume.name}</span>
                )}
              </div>
              <p className="text-gray-500 text-sm">{perfume.brand}</p>
              <h2 className="text-xl font-bold mt-1">{perfume.name}</h2>
              <p className="text-blue-600 font-bold text-lg mt-2">
                ₩{perfume.price.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm mt-2">{perfume.description}</p>
            </div>
          ))}
        </div>

        {/* 레이더 차트 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 text-center">지속력 / 발향 비교</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name={p1.name} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Radar name={p2.name} dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 수치 비교 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">수치 비교</h3>
          <div className="space-y-4">
            {[
              { label: '지속력', key: 'longevity' },
              { label: '발향', key: 'sillage' },
            ].map(({ label, key }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-blue-600 font-semibold">
                    {p1.name}: {p1[key as keyof Perfume] as number}/10
                  </span>
                  <span className="font-bold">{label}</span>
                  <span className="text-purple-600 font-semibold">
                    {p2.name}: {p2[key as keyof Perfume] as number}/10
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 bg-gray-100 rounded-full h-3 flex justify-end">
                    <div
                      className="bg-blue-500 rounded-full h-3"
                      style={{ width: `${(p1[key as keyof Perfume] as number) * 10}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-purple-500 rounded-full h-3"
                      style={{ width: `${(p2[key as keyof Perfume] as number) * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 노트 비교 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">향수 노트 비교</h3>
          {(['top', 'middle', 'base'] as const).map((type) => {
            const labels: Record<string, string> = { top: '🌸 탑', middle: '🌹 미들', base: '🪵 베이스' };
            return (
              <div key={type} className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">{labels[type]} 노트</h4>
                <div className="grid grid-cols-2 gap-4">
                  {perfumes.map((perfume) => (
                    <div key={perfume.id} className="bg-gray-50 rounded p-3">
                      <p className="text-xs font-semibold text-gray-500 mb-1">{perfume.name}</p>
                      {getNotes(perfume, type).length > 0 ? (
                        getNotes(perfume, type).map((note) => (
                          <div key={note.id} className="flex justify-between text-sm py-0.5">
                            <span>{note.ingredient_name}</span>
                            <span className="text-gray-400">{note.percentage}%</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">-</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 구매처 비교 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">구매처 비교</h3>
          <div className="grid grid-cols-2 gap-6">
            {perfumes.map((perfume) => (
              <div key={perfume.id}>
                <p className="font-semibold text-gray-700 mb-2">{perfume.name}</p>
                {perfume.purchaseLinks?.length > 0 ? (
                  perfume.purchaseLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-3 rounded-lg border mb-2 transition-colors ${
                        link.is_available
                          ? 'border-blue-200 hover:border-blue-400 bg-white'
                          : 'border-gray-200 bg-gray-50 opacity-50'
                      }`}
                    >
                      <p className="font-semibold text-sm">{link.platform_name}</p>
                      <p className="text-blue-600 font-bold">₩{link.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{link.is_available ? '구매 가능' : '품절'}</p>
                    </a>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">구매처 정보 없음</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
