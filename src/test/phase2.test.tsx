import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { createInitialSampleState } from '../data/sampleData';
import { STORAGE_KEY } from '../types/travel';
import {
  INPUT_LIMITS,
  validateItineraryInput,
  validateNoticeInput,
} from '../utils/validation';

describe('Phase 2 신규 기능 및 입력값 보안 강화 자동화 QA', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('1. 현지어 택시 카드 모달 (Agent A)', () => {
    it('바우처 탭 상단 버튼으로 택시 카드 모달을 열고 일본어·영어 호텔 정보 표시 및 닫기(버튼/Escape)가 동작한다', () => {
      render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /바우처·SOS/i }));

      const openTaxiBtn = screen.getByRole('button', { name: /현지어 택시 카드 보기/i });
      expect(openTaxiBtn).toBeInTheDocument();
      fireEvent.click(openTaxiBtn);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');

      // 일본어 & 영어 호텔명/주소 및 기사님 안내 문구 확인
      expect(within(dialog).getByText('運転手さん、こちらのホテルまでお願いします。')).toBeInTheDocument();
      expect(within(dialog).getByText('ホテルグレイスリー新宿')).toBeInTheDocument();
      expect(within(dialog).getByText('Hotel Gracery Shinjuku')).toBeInTheDocument();
      expect(within(dialog).getByText(/〒160-8466/)).toBeInTheDocument();
      expect(within(dialog).getByText(/東京都新宿区歌舞伎町1-19-1/)).toBeInTheDocument();
      expect(
        within(dialog).getByText('1-19-1 Kabukicho, Shinjuku-ku, Tokyo 160-8466, Japan'),
      ).toBeInTheDocument();

      // 하단 닫기 버튼으로 닫기
      fireEvent.click(within(dialog).getByRole('button', { name: /확인 후 카드 닫기/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // 다시 열고 Escape 키로 닫기
      fireEvent.click(openTaxiBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('2. 긴급 SOS 모달 및 공식 연락처 검증 (Agent A)', () => {
    it('긴급 SOS 모달 열기/닫기, 공식 tel 링크 적용 및 샘플 가이드 발신 비활성화를 검증한다', () => {
      render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /바우처·SOS/i }));

      const openSosBtn = screen.getByRole('button', { name: /긴급 SOS/i });
      expect(openSosBtn).toBeInTheDocument();
      fireEvent.click(openSosBtn);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');

      // 샘플 가이드 번호는 표시되되, 실제 발신(tel 링크)은 금지되고 버튼이 비활성화되어야 함
      expect(within(dialog).getByText('샘플 번호')).toBeInTheDocument();
      expect(within(dialog).getByText('010-0000-0000')).toBeInTheDocument();
      const disabledGuideBtn = within(dialog).getByRole('button', {
        name: /가이드 전화 \(샘플 번호 · 발신 비활성화\)/i,
      });
      expect(disabledGuideBtn).toBeDisabled();
      expect(dialog.querySelector('a[href*="010-0000-0000"]')).toBeNull();

      // 공식 기관 전화번호 및 tel: 링크 검증
      const telLinks = Array.from(dialog.querySelectorAll('a[href^="tel:"]')).map((el) =>
        el.getAttribute('href'),
      );
      expect(telLinks).toContain('tel:110');
      expect(telLinks).toContain('tel:+81-3-3452-7611');
      expect(telLinks).toContain('tel:+81-3-3455-2601');
      expect(telLinks).toContain('tel:+81-70-2153-5454');
      expect(telLinks).toContain('tel:+82-2-3210-0404');

      expect(within(dialog).getByText('110')).toBeInTheDocument();
      expect(within(dialog).getByText('+81-3-3452-7611')).toBeInTheDocument();
      expect(within(dialog).getByText('+81-3-3455-2601')).toBeInTheDocument();
      expect(within(dialog).getByText('+81-70-2153-5454')).toBeInTheDocument();
      expect(within(dialog).getByText('+82-2-3210-0404')).toBeInTheDocument();

      // 하단 닫기 버튼으로 닫기 (상단 X 버튼과 하단 닫기 버튼 2개 존재 확인)
      const closeButtons = within(dialog).getAllByRole('button', { name: /^닫기$/i });
      expect(closeButtons).toHaveLength(2);
      fireEvent.click(closeButtons[1]);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // 다시 열고 Escape 키로 닫기
      fireEvent.click(openSosBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('3. 입력값 검증 — 공백 차단, trim, 최대 글자 수 제한 (Agent B)', () => {
    it('일정 입력 폼에서 필수 필드 공백 제출을 차단하고 오류 메시지를 표시한다', () => {
      render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /일정 추가/i }));
      fireEvent.change(screen.getByLabelText(/방문 장소/i), { target: { value: '    ' } });
      fireEvent.change(screen.getByLabelText(/주요 활동/i), { target: { value: '   \t  ' } });
      fireEvent.click(screen.getByRole('button', { name: '일정 등록' }));

      // 모달이 닫히지 않고 오류 메시지 출력
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText(/방문 장소를 입력해 주세요/i)).toBeInTheDocument();
      expect(within(dialog).getByText(/일정 제목\(주요 활동\)을 입력해 주세요/i)).toBeInTheDocument();
    });

    it('일정 입력 폼의 최대 글자 수 초과(제목 80자, 장소 100자, 메모 300자)를 차단하고 trim 저장을 수행한다', () => {
      render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /일정 추가/i }));
      fireEvent.change(screen.getByLabelText(/방문 장소/i), {
        target: { value: '장'.repeat(INPUT_LIMITS.ITINERARY_LOCATION_MAX + 1) },
      });
      fireEvent.change(screen.getByLabelText(/주요 활동/i), {
        target: { value: '활'.repeat(INPUT_LIMITS.ITINERARY_ACTIVITY_MAX + 1) },
      });
      fireEvent.change(screen.getByLabelText(/상세 메모/i), {
        target: { value: '메'.repeat(INPUT_LIMITS.ITINERARY_MEMO_MAX + 1) },
      });
      fireEvent.click(screen.getByRole('button', { name: '일정 등록' }));

      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText(/방문 장소는 100자 이하/i)).toBeInTheDocument();
      expect(within(dialog).getByText(/일정 제목은 80자 이하/i)).toBeInTheDocument();
      expect(within(dialog).getByText(/상세 메모는 300자 이하/i)).toBeInTheDocument();

      // 경계값 + 앞뒤 공백 포함 정상 입력 -> trim되어 저장 성공
      fireEvent.change(screen.getByLabelText(/방문 장소/i), {
        target: { value: '   도쿄 스카이트리   ' },
      });
      fireEvent.change(screen.getByLabelText(/주요 활동/i), {
        target: { value: '   전망대 관람   ' },
      });
      fireEvent.change(screen.getByLabelText(/상세 메모/i), {
        target: { value: '   일몰 30분 전 도착   ' },
      });
      fireEvent.click(screen.getByRole('button', { name: '일정 등록' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByText('도쿄 스카이트리')).toBeInTheDocument();
      expect(screen.getByText('전망대 관람')).toBeInTheDocument();
      expect(screen.getByText('일몰 30분 전 도착')).toBeInTheDocument();
    });

    it('공지 입력 폼에서 공백 제출 및 최대 글자 수 초과(제목 80자, 내용 500자)를 차단한다', () => {
      render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /공지·체크/i }));
      fireEvent.click(screen.getByRole('button', { name: /공지 수정/i }));

      fireEvent.change(screen.getByLabelText(/공지 제목/i), { target: { value: '   ' } });
      fireEvent.change(screen.getByLabelText(/공지 내용/i), { target: { value: '  \n  ' } });
      fireEvent.click(screen.getByRole('button', { name: /저장하기/i }));

      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText(/공지 제목을 입력해 주세요/i)).toBeInTheDocument();
      expect(within(dialog).getByText(/공지 내용을 입력해 주세요/i)).toBeInTheDocument();

      // 최대 글자 수 초과 테스트
      fireEvent.change(screen.getByLabelText(/공지 제목/i), {
        target: { value: '제'.repeat(INPUT_LIMITS.NOTICE_TITLE_MAX + 1) },
      });
      fireEvent.change(screen.getByLabelText(/공지 내용/i), {
        target: { value: '내'.repeat(INPUT_LIMITS.NOTICE_CONTENT_MAX + 1) },
      });
      fireEvent.click(screen.getByRole('button', { name: /저장하기/i }));

      expect(within(dialog).getByText(/공지 제목은 80자 이하/i)).toBeInTheDocument();
      expect(within(dialog).getByText(/공지 내용은 500자 이하/i)).toBeInTheDocument();

      // 단위 경계값(정확히 80자/100자/300자/500자) 허용 확인
      expect(
        validateItineraryInput({
          day: 1,
          time: '12:00',
          location: 'A'.repeat(100),
          activity: 'B'.repeat(80),
          memo: 'C'.repeat(300),
        }).valid,
      ).toBe(true);
      expect(
        validateNoticeInput({
          title: 'T'.repeat(80),
          content: 'N'.repeat(500),
        }).valid,
      ).toBe(true);
    });
  });

  describe('4. XSS 방어 및 이중 이스케이프 방지 검증 (Agent B)', () => {
    it('폼으로 입력한 XSS 문자열이 실행 가능한 HTML로 렌더링되지 않고 이중 이스케이프 없이 텍스트로 표시된다', () => {
      const xssLocation = '<script>alert("loc")</script>';
      const xssActivity = '<img src="x" onerror="alert(1)">';
      const xssMemo = '<b>메모 & "따옴표"</b>';

      const { container } = render(<App />);

      fireEvent.click(screen.getByRole('button', { name: /일정 추가/i }));
      fireEvent.change(screen.getByLabelText(/방문 장소/i), { target: { value: xssLocation } });
      fireEvent.change(screen.getByLabelText(/주요 활동/i), { target: { value: xssActivity } });
      fireEvent.change(screen.getByLabelText(/상세 메모/i), { target: { value: xssMemo } });
      fireEvent.click(screen.getByRole('button', { name: '일정 등록' }));

      // 실행 가능한 script 태그나 악성 img 태그가 DOM에 생성되지 않음
      expect(container.querySelector('script')).toBeNull();
      expect(container.querySelector('img[src="x"]')).toBeNull();

      // 이중 이스케이프(&lt;) 없이 순수 텍스트 노드로 안전 렌더링 확인
      expect(screen.getByText(xssLocation)).toBeInTheDocument();
      expect(screen.getByText(xssActivity)).toBeInTheDocument();
      expect(screen.getByText(xssMemo)).toBeInTheDocument();
      expect(screen.queryByText(/&lt;script&gt;/)).not.toBeInTheDocument();
    });

    it('LocalStorage에 직접 주입된 XSS 페이로드도 로드 시 안전하게 텍스트로 렌더링된다', () => {
      const state = createInitialSampleState();
      const xssNoticeTitle = '<svg onload="alert(1)">공지 & 체크</svg>';
      const xssNoticeContent = '<a href="javascript:alert(1)">악성링크</a>';
      state.notice.title = xssNoticeTitle;
      state.notice.content = xssNoticeContent;
      state.itinerary[0].imageUrl = 'javascript:alert(1)';

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

      const { container } = render(<App />);

      // 위험한 javascript: 이미지 URL 제거 확인
      expect(container.querySelector('img[src^="javascript:"]')).toBeNull();

      // 공지 탭 이동 후 XSS 문자열이 순수 텍스트로 렌더링됨 확인
      fireEvent.click(screen.getByRole('button', { name: /공지·체크/i }));
      expect(container.querySelector('svg[onload]')).toBeNull();
      expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
      expect(screen.getByText(xssNoticeTitle)).toBeInTheDocument();
      expect(screen.getByText(xssNoticeContent)).toBeInTheDocument();
      expect(screen.queryByText(/&lt;svg/)).not.toBeInTheDocument();
    });
  });
});
