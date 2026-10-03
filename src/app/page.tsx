'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import PerfumeCard from '@/components/PerfumeCard';
import { fetchPerfumes, fetchBrands } from '@/lib/api';
import { Perfume } from '@/types/perfume';
import { useCompareStore } from '@/store/compareStore';
import Link from 'next/link';

export default function Home() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sort, setSort] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const { ref, inView } = useInView();
  const { selectedPerfumes } = useCompareStore();

  const loadPerfumes = useCallback(async (
    pageNum: number,
    searchQuery: string,
    brand: string,
    sortOption: string
  ) => {
    setLoading(true);
    try {
      const data = await fetchPerfumes({
        page: pageNum,
        limit: 20,
        search: searchQuery,
        brand: brand || undefined,
        sort: sortOption || undefined,
      });
      if (pageNum === 1) {
        setPerfumes(data.data);
        setTotalCount(data.meta.total);
      } else {
        setPerfumes((prev) => [...prev, ...data.data]);
      }
      setHasMore(data.meta.page < data.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch perfumes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 브랜드 목록 로드
  useEffect(() => {
    fetchBrands().then(setBrands).catch(console.error);
  }, []);

  // 필터/검색 변경시 리셋
  useEffect(() => {
    setPage(1);
    loadPerfumes(1, search, selectedBrand, sort);
  }, [search, selectedBrand, sort]);

  // 무한스크롤
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPerfumes(nextPage, search, selectedBrand, sort);
    }
  }, [inView, hasMore, loading]);

  const handleSearch = () => setSearch(searchInput);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };
  const handleReset = () => {
    setSearchInput('');
    setSearch('');
    setSelectedBrand('');
    setSort('');
  };

  const isFiltered = search || selectedBrand || sort;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f5f2' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1a1a2e' }} className="text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">✨ 향수 컬렉션</h1>
              <p className="text-sm mt-1" style={{ color: '#a8a8c8' }}>
                {totalCount.toLocaleString()}개의 향수를 탐색해보세요
              </p>
            </div>
          </div>

          {/* 검색창 */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="향수 이름으로 검색..."
                className="w-full rounded-xl px-10 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(''); setSearch(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: '#7c3aed', color: 'white' }}
            >
              검색
            </button>
          </div>

          {/* 필터 바 */}
          <div className="flex gap-3 mt-3 flex-wrap">
            {/* 브랜드 필터 */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="rounded-xl px-4 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
              style={{ minWidth: '180px' }}
            >
              <option value="">모든 브랜드</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            {/* 정렬 */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl px-4 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
            >
              <option value="">기본 정렬</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
              <option value="name_asc">이름순</option>
              <option value="longevity_desc">지속력 높은순</option>
              <option value="sillage_desc">발향 높은순</option>
            </select>

            {/* 필터 초기화 */}
            {isFiltered && (
              <button
                onClick={handleReset}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#ef4444', color: 'white' }}
              >
                초기화 ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Compare Bar */}
      {selectedPerfumes.length > 0 && (
        <div className="py-3 sticky top-0 z-20 shadow-md" style={{ backgroundColor: '#7c3aed' }}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <span className="text-white font-semibold">
              💜 {selectedPerfumes.length}개 선택됨
            </span>
            {selectedPerfumes.length === 2 && (
              <Link
                href={`/compare?ids=${selectedPerfumes.join(',')}`}
                className="bg-white text-purple-700 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                비교하기 →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 결과 요약 */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        {isFiltered && (
          <p className="text-gray-500 text-sm">
            {search && <span>"{search}" </span>}
            {selectedBrand && <span className="font-semibold text-purple-600">{selectedBrand} </span>}
            검색 결과 <span className="font-bold text-gray-700">{totalCount.toLocaleString()}개</span>
          </p>
        )}
      </div>

      {/* Perfume Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {!loading && perfumes.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🕯️</p>
            <p className="text-xl font-semibold text-gray-600">검색 결과가 없습니다</p>
            <p className="text-sm mt-2">다른 검색어나 필터를 사용해보세요</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2 rounded-xl text-white font-semibold"
              style={{ backgroundColor: '#7c3aed' }}
            >
              전체 목록 보기
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {perfumes.map((perfume) => (
            <PerfumeCard key={perfume.id} perfume={perfume} />
          ))}
        </div>

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600"></div>
          </div>
        )}

        {hasMore && <div ref={ref} className="h-10" />}

        {!hasMore && perfumes.length > 0 && (
          <div className="text-center py-10 text-gray-400">
            <p>✨ 모든 향수를 확인했습니다</p>
          </div>
        )}
      </main>
    </div>
  );
}
