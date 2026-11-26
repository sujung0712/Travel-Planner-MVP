# Travel-Planner-MVP — Phase 2 (Step 06) 구현 및 QA 보고서

- **작성 일시**: 2026-11-26 (KST)
- **작업 브랜치**: `feat/taxi-card-sos`
- **참조 Stitch 프로젝트 ID**: `15535182799094676996`
  - 바우처 개선 화면: `42009ce0d0134b00a6d9258204319937`
  - 현지어 택시 카드 모달: `3b0f5bf754154603a28d6977ef7b43b6`
  - 긴급 SOS 모달: `4ec2f4cf913343519c39bbbdfcca2cfc`

---

## 1. 구현 기능 요약 (Multi-Agent 병렬 수행)

### 1.1 Agent A — 신규 UI 및 기능 구현 (`src/features/voucher-sos/`)
- **바우처 및 긴급정보 상단 2열 빠른 실행 버튼** (`VoucherSosPage.tsx`):
  - 좌측 딥 네이비(`#001038`) **현지어 택시 카드 보기** 버튼 및 우측 크림슨 레드(`#BA1A1A`) **긴급 SOS** 버튼을 오프라인 안내 바 하단에 추가
  - 기존 바우처 3건, QR 모달, 예약 상세 정보, 기본 비상연락처, 하단 3탭 내비게이션을 그대로 보존
- **현지어 택시 카드 모달** (`TaxiCardModal.tsx`):
  - 기존 신주쿠 그레이스리 호텔 데이터를 바탕으로 일본어 요청 문구(`運転手さん、こちらのホテルまでお願いします。`), 초대형 고대비 일본어 호텔명(`ホテルグレイスリー新宿`, `Noto Sans JP`), 영어 호텔명(`Hotel Gracery Shinjuku`), 일본어·영어 공식 주소 및 랜드마크 안내, 주소 복사 버튼(클립보드 폴백 포함), 야간 화면 밝기 팁 구현
  - `role="dialog"`, `aria-modal="true"`, `Escape` 키, 백드롭 클릭, 상단 `X` 및 하단 `확인 후 카드 닫기` 버튼, 포커스 이동·복원 및 바디 스크롤 잠금 지원
- **긴급 SOS 모달** (`EmergencySosModal.tsx`):
  - **샘플 가이드 번호(`010-0000-0000`)**: `샘플 번호` 배지 및 예시 안내 문구를 명시하고, 실제 발신이 불가능하도록 `tel:` 링크를 제거한 비활성 버튼(`<button type="button" disabled aria-disabled="true">`)으로 구현
  - **공식 기관 연락처**: 일본 경찰(`tel:110`), 주일본 대한민국 대사관 3개 공식 회선(`tel:+81-3-3452-7611`, `tel:+81-3-3455-2601`, `tel:+81-70-2153-5454`), 외교부 영사콜센터 24시간(`tel:+82-2-3210-0404`)에 실제 `tel:` 링크 적용
  - 키보드 접근성(`Escape` 닫기, 포커스 관리) 및 모바일·데스크톱 반응형 레이아웃 유지

### 1.2 Agent B — 입력값 검증 및 XSS 보안 강화
- **공통 검증·정규화 유틸리티** (`src/utils/validation.ts`):
  - 최대 글자 수 상수 정의 및 검증: **일정 제목 80자 / 장소 100자 / 메모 300자 / 공지 제목 80자 / 공지 내용 500자**
  - 필수 입력값의 빈 문자열 및 공백 전용(`"   "`, `"\t"`, `"\n"`) 입력 차단 및 `trim()` 정규화
  - 제어 문자 제거 + HTML 엔티티 사전 인코딩 배제(React JSX 자동 이스케이프 기반)로 **XSS 방어와 이중 이스케이프(`&lt;`) 방지를 동시 달성**
- **심층 방어 및 `LocalStorage` 안전 로드** (`src/utils/storage.ts`, `src/context/TravelPlannerProvider.tsx`):
  - `loadTravelState()` 로드 시 `sanitizeStoredState()`로 `LocalStorage` 직접 변조 데이터(초과 문자열, 제어 문자, `javascript:` 이미지 URL 등) 정규화
  - Context 액션(`addItineraryItem`, `updateItineraryItem`, `updateNotice`)에서도 동일 검증 적용
- **폼 UI 검증 피드백** (`ItineraryFormModal.tsx`, `NoticeEditModal.tsx`):
  - `<form noValidate>` + 필드별 `role="alert"` 인라인 오류 메시지, `aria-invalid`, `aria-describedby`, 실시간 글자 수 카운터 표시
  - 전체 소스코드(`src/`) 내 `dangerouslySetInnerHTML` 사용 **0건** 확인

---

## 2. 변경 및 신규 생성 파일 목록

| 구분 | 파일 경로 | 담당 / 역할 |
| :---: | :--- | :--- |
| **수정** | `index.html` | 일본어 택시 카드 가독성 향상을 위한 `Noto Sans JP` 폰트 링크 추가 |
| **수정** | `src/types/travel.ts` | `TaxiCardHotelInfo`, `SosDialLine`, `SosEmergencyData` 인터페이스 추가 |
| **수정** | `src/data/sampleData.ts` | 공식 출처 기반 `TAXI_CARD_HOTEL_INFO`, `SOS_EMERGENCY_DATA` 상수 추가 |
| **신규** | `src/features/voucher-sos/TaxiCardModal.tsx` | Agent A — 현지어 택시 카드 모달 |
| **신규** | `src/features/voucher-sos/EmergencySosModal.tsx` | Agent A — 긴급 SOS 모달 |
| **수정** | `src/features/voucher-sos/VoucherSosPage.tsx` | Agent A — 상단 택시 카드·긴급 SOS 빠른 실행 버튼 및 모달 연동 |
| **신규** | `src/utils/validation.ts` | Agent B — 입력값 검증·길이 제한·문자열 정규화·저장소 정제 유틸 |
| **수정** | `src/utils/storage.ts` | Agent B — `LocalStorage` 로드 시 `sanitizeStoredState` 적용 |
| **수정** | `src/context/TravelPlannerProvider.tsx` | Agent B — 일정/공지 업데이트 심층 방어 검증 적용 |
| **수정** | `src/features/itinerary/ItineraryFormModal.tsx` | Agent B — 일정 폼 공백 차단·길이 제한(80/100/300)·오류 메시지·글자 수 표시 |
| **수정** | `src/features/notice-checklist/NoticeEditModal.tsx` | Agent B — 공지 폼 공백 차단·길이 제한(80/500)·오류 메시지·글자 수 표시 |
| **신규** | `src/test/phase2.test.tsx` | QA Agent — Phase 2 신규 기능·입력 검증·XSS 방어 자동화 테스트 7건 |
| **신규** | `docs/PHASE2_QA_REPORT.md` | QA Agent — Phase 2 구현 및 검증 보고서 (본 문서) |

---

## 3. 자동화 QA 및 CLI 검증 결과

### 3.1 기능별 자동화 테스트 결과 (`PASS`: 12/12, `FAIL`: 0)

| 테스트 항목 | 테스트 파일 | 판정 | 검증 내용 |
| :--- | :--- | :---: | :--- |
| 택시 카드 모달 열기 및 닫기 | `src/test/phase2.test.tsx` | **PASS** | `현지어 택시 카드 보기` 클릭 열기, 하단 닫기 버튼 및 `Escape` 키 닫기 확인 |
| 일본어 및 영어 호텔 정보 표시 | `src/test/phase2.test.tsx` | **PASS** | `ホテルグレイスリー新宿`, `Hotel Gracery Shinjuku`, `〒160-8466`, `東京都新宿区歌舞伎町1-19-1`, 영문 주소, 기사님 안내 문구 확인 |
| 긴급 SOS 모달 열기 및 닫기 | `src/test/phase2.test.tsx` | **PASS** | `긴급 SOS` 클릭 열기, 하단 `닫기` 버튼 및 `Escape` 키 닫기 확인 |
| 전화번호 표시 및 `tel:` 링크 / 샘플 비활성화 | `src/test/phase2.test.tsx` | **PASS** | 5개 공식 `tel:` 링크 확인, 샘플 가이드(`010-0000-0000`) `disabled` 버튼 및 `tel:` 링크 미존재 확인 |
| 필수 필드 공백 제출 차단 & `trim` | `src/test/phase2.test.tsx` | **PASS** | 일정·공지 폼 빈 값/공백 전용 제출 차단 및 오류 메시지 표시, 앞뒤 공백 `trim` 저장 확인 |
| 최대 글자 수 초과 검증 | `src/test/phase2.test.tsx` | **PASS** | 81/101/301/81/501자 초과 차단 및 오류 메시지 표시, 경계값(80/100/300/80/500자) 통과 확인 |
| XSS 방어 및 이중 이스케이프 방지 | `src/test/phase2.test.tsx` | **PASS** | `<script>`, `<img onerror>`, `<svg onload>`, `javascript:` URL 입력 및 `LocalStorage` 직접 주입 시 실행 HTML 미생성 + `&lt;` 이중 이스케이프 미발생 확인 |
| 기존 일정 CRUD 및 `LocalStorage` 영속성 | `src/test/app.test.tsx` | **PASS** | Day 1~3 탭 전환, 일정 추가·수정·삭제, 리마운트 영속성, 샘플 초기화, 손상 JSON 폴백 확인 |
| 기존 공지 및 체크리스트 기능 | `src/test/app.test.tsx` | **PASS** | 공지 수정·배너 동기화, 체크리스트 5건 토글 및 실시간 진행률(`60%→80%→100%→80%`) 확인 |
| 기존 바우처 QR 모달 | `src/test/app.test.tsx` | **PASS** | 바우처 3건, QR 모달 열기/닫기(버튼·`Escape`), 기본 비상연락처 표시 확인 |

### 3.2 필수 CLI 명령어 실행 결과

| 명령어 | 종료 코드 | 실행 결과 요약 |
| :--- | :---: | :--- |
| `npm run test` | `0` | **PASS** — `Test Files 2 passed (2)`, `Tests 12 passed (12)` (`app.test.tsx` 5건 + `phase2.test.tsx` 7건) |
| `npm run lint` | `0` | **PASS** — `eslint .` 에러 0건, 경고 0건 |
| `npx tsc --noEmit -p tsconfig.app.json` | `0` | **PASS** — TypeScript 앱 설정 타입 체크 에러 0건 |
| `npm run build` | `0` | **PASS** — `dist/index.html` (0.93 kB), CSS (29.50 kB), JS (235.43 kB), 4.35s 빌드 성공 |

---

## 4. 미검증 항목 (`NOT TESTED`)

| 항목 | 상태 | 사유 및 안내 |
| :--- | :---: | :--- |
| 실제 브라우저 모바일(`375px`/`390px`/`430px`) 및 데스크톱 시각·레이아웃 검증 | **NOT TESTED** | 지침에 따라 자동화 테스트를 우선 수행했으며, 실제 브라우저 육안 검증(글씨 크기·명암비·모달 스크롤·Stitch 3개 신규 화면 비교)은 사용자가 직접 수행 예정 |
| 모바일 실기기 전화 다이얼러(`tel:` 프로토콜) 실제 발신 동작 | **NOT TESTED** | jsdom 환경에서는 `href="tel:..."` 속성 검증까지 수행하며 실제 OS 전화 앱 연동은 실기기에서 확인 필요 |

---

## 5. 공식 연락처 및 숙소 정보 출처

| 항목 | 적용 값 | 확인 출처 및 비고 |
| :--- | :--- | :--- |
| **숙소명 · 주소** | `ホテルグレイスリー新宿` / `Hotel Gracery Shinjuku`<br>`〒160-8466 東京都新宿区歌舞伎町1-19-1`<br>`1-19-1 Kabukicho, Shinjuku-ku, Tokyo 160-8466, Japan` | Hotel Gracery Shinjuku 공식 사이트(`gracery.com`) 확인 |
| **일본 현지 경찰** | `110` (`tel:110`) | 일본 경찰청(NPA) 공식 긴급신고 번호 |
| **주일본 대한민국 대사관 대표전화** | `+81-3-3452-7611` (`tel:+81-3-3452-7611`) | 대한민국 외교부 주일본 대한민국 대사관(`mofa.go.kr`) 공식 안내 |
| **주일본 대한민국 대사관 영사부** | `+81-3-3455-2601` (`tel:+81-3-3455-2601`) | 외교부 주일본 대한민국 대사관 공식 안내 (평일 09:00~12:00, 13:30~18:00) |
| **주일본 대한민국 대사관 사건·사고 긴급전화** | `+81-70-2153-5454` (`tel:+81-70-2153-5454`) | 외교부 주일본 대한민국 대사관 공식 안내 (평일 18:00 이후 야간 및 휴일 당직) |
| **외교부 영사콜센터 (24시간)** | `+82-2-3210-0404` (`tel:+82-2-3210-0404`) | 대한민국 외교부 영사콜센터 공식 안내 (연중무휴 24시간) |
| **담당 여행 가이드 전화** | `010-0000-0000` *(발신 비활성화)* | **샘플 번호** (`tel:` 링크 미적용, `disabled` 버튼 및 샘플 안내 표기) |

---

## 6. 보안 및 제약사항 준수 확인
- `dangerouslySetInnerHTML` 사용 여부: **0건**
- API Key / 토큰 / 인증정보 프로젝트 내 저장 여부: **0건**
- Git Commit, Push, Pull Request 생성 및 `main` 병합: **미수행** (로컬 `feat/taxi-card-sos` 브랜치 작업 상태 유지)
