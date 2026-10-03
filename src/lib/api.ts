import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// 향수 목록 조회
export const fetchPerfumes = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
}) => {
  const response = await api.get('/api/perfumes', { params });
  return response.data;
};

// 향수 상세 조회
export const fetchPerfumeById = async (id: string) => {
  const response = await api.get(`/api/perfumes/${id}`);
  return response.data;
};

// 향수 비교
export const comparePerfumes = async (ids: string[]) => {
  const response = await api.get('/api/perfumes/compare', {
    params: { ids: ids.join(',') },
  });
  return response.data;
};