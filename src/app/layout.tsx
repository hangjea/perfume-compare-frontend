import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '향수 컬렉션',
  description: '나만의 향수를 찾아보세요',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}