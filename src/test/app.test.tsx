import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { calculateChecklistProgress } from '../features/notice-checklist';
import { STORAGE_KEY } from '../types/travel';
import { loadTravelState } from '../utils/storage';

describe('Travel-Planner-MVP 핵심 기능 통합 테스트', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('손상된 LocalStorage 데이터가 있어도 초기 샘플 데이터로 안전하게 폴백한다', () => {
    window.localStorage.setItem(STORAGE_KEY, '{broken-json');
    const state = loadTravelState();
    expect(state.tripMeta.title).toBe('도쿄 2박 3일 여행');
    expect(state.checklist).toHaveLength(5);
    expect(state.vouchers).toHaveLength(3);
  });

  it('체크리스트 진행률을 정확히 계산한다', () => {
    const progress = calculateChecklistProgress([
      { id: '1', label: 'A', completed: true },
      { id: '2', label: 'B', completed: true },
      { id: '3', label: 'C', completed: false },
      { id: '4', label: 'D', completed: false },
      { id: '5', label: 'E', completed: false },
    ]);
    expect(progress).toEqual({
      completedCount: 2,
      totalCount: 5,
      remainingCount: 3,
      percentage: 40,
    });
  });

  it('Day 1~3 탭 전환 및 일정 추가·수정·삭제와 LocalStorage 영속성이 동작한다', () => {
    const { unmount } = render(<App />);

    expect(screen.getByText('도쿄 2박 3일 여행')).toBeInTheDocument();
    expect(screen.getByText('나리타 국제공항')).toBeInTheDocument();

    // Day 2 및 Day 3 탭 전환
    fireEvent.click(screen.getByRole('tab', { name: /Day 2/i }));
    expect(screen.getByText('메이지 신궁 & 하라주쿠')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /Day 3/i }));
    expect(screen.getByText('츠키지 장외시장')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /Day 2/i }));
    expect(screen.getByText('메이지 신궁 & 하라주쿠')).toBeInTheDocument();

    // 일정 추가
    fireEvent.click(screen.getByRole('button', { name: /일정 추가/i }));
    fireEvent.change(screen.getByLabelText(/방문 장소/i), {
      target: { value: '아키하바라 전자상가' },
    });
    fireEvent.change(screen.getByLabelText(/주요 활동/i), {
      target: { value: '피규어 및 전자제품 구경' },
    });
    fireEvent.change(screen.getByLabelText(/상세 메모/i), {
      target: { value: '라디오회관 방문' },
    });
    fireEvent.click(screen.getByRole('button', { name: '일정 등록' }));

    expect(screen.getByText('아키하바라 전자상가')).toBeInTheDocument();

    // 일정 수정
    const editButtons = screen.getAllByRole('button', { name: '일정 수정' });
    fireEvent.click(editButtons[0]);
    fireEvent.change(screen.getByLabelText(/방문 장소/i), {
      target: { value: '메이지 신궁 (오전 산책)' },
    });
    fireEvent.click(screen.getByRole('button', { name: '수정 완료' }));
    expect(screen.getByText('메이지 신궁 (오전 산책)')).toBeInTheDocument();

    // 새로고침(언마운트 후 재마운트) 시 유지 확인
    unmount();
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /Day 2/i }));
    expect(screen.getByText('아키하바라 전자상가')).toBeInTheDocument();
    expect(screen.getByText('메이지 신궁 (오전 산책)')).toBeInTheDocument();

    // 일정 삭제
    const deleteButtons = screen.getAllByRole('button', { name: '일정 삭제' });
    const countBeforeDelete = deleteButtons.length;
    fireEvent.click(deleteButtons[0]);
    expect(screen.getAllByRole('button', { name: '일정 삭제' })).toHaveLength(
      countBeforeDelete - 1,
    );

    // 샘플 데이터 초기화
    fireEvent.click(screen.getByRole('button', { name: '샘플 데이터 초기화' }));
    const resetDialog = screen.getByRole('dialog');
    fireEvent.click(within(resetDialog).getByRole('button', { name: /초기화/i }));
    expect(screen.queryByText('아키하바라 전자상가')).not.toBeInTheDocument();
    expect(screen.getByText('메이지 신궁 & 하라주쿠')).toBeInTheDocument();
  });

  it('공지사항 수정 및 체크리스트 토글 시 완료 진행률이 실시간 반영된다', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /공지·체크/i }));
    expect(screen.getByText('총 5개 중 3개 완료')).toBeInTheDocument();

    // 체크리스트 4번째, 5번째 항목 토글 (3/5 60% -> 4/5 80% -> 5/5 100%)
    const checkbox4 = screen.getByRole('checkbox', {
      name: /110V 변환 어댑터/i,
    });
    fireEvent.click(checkbox4);
    expect(screen.getByText('총 5개 중 4개 완료')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '80');

    const checkbox5 = screen.getByRole('checkbox', {
      name: /Visit Japan Web/i,
    });
    fireEvent.click(checkbox5);
    expect(screen.getByText('총 5개 중 5개 완료')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    // 1번째 항목 체크 해제 (5/5 100% -> 4/5 80%)
    const checkbox1 = screen.getByRole('checkbox', {
      name: /여권 및 항공권/i,
    });
    fireEvent.click(checkbox1);
    expect(screen.getByText('총 5개 중 4개 완료')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '80');

    // 공지 수정 및 일정 탭 상단 배너 연동 확인
    fireEvent.click(screen.getByRole('button', { name: /공지 수정/i }));
    const titleInput = screen.getByLabelText(/공지 제목/i);
    const contentInput = screen.getByLabelText(/공지 내용/i);
    fireEvent.change(titleInput, { target: { value: '출국 전 필독 공지' } });
    fireEvent.change(contentInput, { target: { value: '여권과 바우처 QR을 꼭 확인하세요.' } });
    fireEvent.click(screen.getByRole('button', { name: /저장하기/i }));
    expect(screen.getByText('출국 전 필독 공지')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^일정$/i }));
    expect(screen.getByText('여권과 바우처 QR을 꼭 확인하세요.')).toBeInTheDocument();
  });

  it('바우처 3건 조회, QR 모달 열기/닫기 및 기본 비상연락처가 표시된다', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /바우처·SOS/i }));
    expect(screen.getByText('인천(ICN) → 도쿄 나리타(NRT) 왕복 항공권')).toBeInTheDocument();
    expect(screen.getByText('신주쿠 그레이스리 호텔 (2박)')).toBeInTheDocument();
    expect(screen.getByText('시부야 스카이 전망대 입장권')).toBeInTheDocument();

    // 기본 비상연락처
    expect(screen.getByText('일본 경찰 신고')).toBeInTheDocument();
    expect(screen.getByText('110')).toBeInTheDocument();
    expect(screen.getByText('119')).toBeInTheDocument();
    expect(screen.getByText('주일 대한민국 대사관')).toBeInTheDocument();

    // QR 모달 열기 & 닫기 (버튼 및 Escape 키)
    const qrButtons = screen.getAllByRole('button', { name: /QR 코드 확인/i });
    expect(qrButtons).toHaveLength(3);
    fireEvent.click(qrButtons[0]);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/KE703-8821/i)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: /^닫기$/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(qrButtons[1]);
    expect(within(screen.getByRole('dialog')).getByText(/HTL-2026-4419/i)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
