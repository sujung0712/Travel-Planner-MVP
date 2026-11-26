# Travel-Planner-MVP

도쿄 2박 3일 여행 일정을 간편하게 관리할 수 있는 모바일 퍼스트 반응형 웹 애플리케이션입니다.  
대학 AI 빅데이터학과 13주차 **Multi-Agentic CI/CD 실습 과제**의 일환으로 기획·설계되었습니다.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
| :--- | :--- |
| **프로젝트명** | `Travel-Planner-MVP` |
| **개발 목적** | 도쿄 2박 3일 여행 일정, 공지/체크리스트, 바우처 및 기본 비상연락처를 한곳에서 관리하는 클라이언트 전용 웹앱 개발 |
| **타깃 환경** | 모바일 뷰포트(`375px ~ 430px`) 최적화 + 데스크톱 반응형 레이아웃 지원 |
| **저장 방식** | 브라우저 `LocalStorage` 기반 영속성 관리 (별도 백엔드·DB 미사용) |
| **실행 및 배포 호환** | Node.js 20 빌드 환경, GitHub Actions CI, Vercel 정적 배포 호환 |

---

## 2. 기술 스택 및 제약사항

- **Frontend**: React, TypeScript, Vite
- **Persistence**: Web Storage API (`window.localStorage`) — 외부 서버 및 데이터베이스 사용 금지
- **Build & CI/CD**:
  - Node.js 20 환경에서 안정적으로 빌드되도록 의존성 버전 구성 (`engines.node: ">=20.0.0"`)
  - GitHub Actions 기반 자동 린트·타입체크·빌드(CI) 파이프라인 호환
  - Vercel 정적 배포(`vite build` → `dist/`) 호환
- **Responsive UX**:
  - 모바일 기준 화면 폭 `375px ~ 430px`에서 가로 스크롤 없이 조작 가능한 터치 친화적 UI
  - 태블릿 및 데스크톱 화면에서는 중앙 정렬 컨테이너 또는 확장형 그리드 레이아웃으로 자연스럽게 대응

---

## 3. 기능 요구사항 (Functional Requirements)

### 3.1 일정 관리 (Itinerary)
| ID | 요구사항 | 상세 설명 |
| :--- | :--- | :--- |
| **FR-ITN-01** | 일자별 조회 | `Day 1`, `Day 2`, `Day 3` 탭/필터를 통해 일자별 일정을 구분하여 조회 |
| **FR-ITN-02** | 일정 항목 표시 | 각 일정 카드에 **시간, 장소, 활동, 메모** 정보를 명확히 표시 (시간순 정렬) |
| **FR-ITN-03** | 일정 추가 (Create) | 선택된 일자(Day 1~3)에 시간, 장소, 활동, 메모를 입력해 새 일정 등록 |
| **FR-ITN-04** | 일정 수정 (Update) | 기존 일정의 일자, 시간, 장소, 활동, 메모 수정 |
| **FR-ITN-05** | 일정 삭제 (Delete) | 특정 일정 항목을 목록에서 삭제 |
| **FR-ITN-06** | 도쿄 2박 3일 샘플 데이터 | 최초 접속 또는 초기화 시 도쿄 2박 3일 대표 코스 샘플 일정 자동 로드 |

### 3.2 공지 및 체크리스트 (Notice / Checklist)
| ID | 요구사항 | 상세 설명 |
| :--- | :--- | :--- |
| **FR-NTC-01** | 공지사항 조회 | 여행 대표 공지사항 1건(제목, 내용, 수정 시각)을 상단에 표시 |
| **FR-NTC-02** | 공지사항 수정 | 공지사항 내용을 인라인 또는 편집 모드로 수정 및 즉시 저장 |
| **FR-CHK-01** | 체크리스트 제공 | 여행 필수 준비물/확인 항목 5건의 샘플 체크리스트 제공 |
| **FR-CHK-02** | 체크박스 토글 | 각 체크리스트 항목의 완료/미완료 상태를 클릭 한 번으로 토글 |
| **FR-CHK-03** | 실시간 완료 진행률 | 완료 개수 / 전체 개수 및 백분율(`0% ~ 100%`) 프로그레스 바를 실시간 반영 |

### 3.3 바우처 및 긴급정보 (Voucher / SOS)
| ID | 요구사항 | 상세 설명 |
| :--- | :--- | :--- |
| **FR-VCH-01** | 샘플 바우처 목록 | 항공·숙소·교통/입장권 등 샘플 바우처 3건 표시 |
| **FR-VCH-02** | 바우처 QR 모달 | 바우처 선택 시 예약 코드와 QR 코드를 크게 표시하는 모달 열기/닫기 지원 |
| **FR-SOS-01** | 기본 비상연락처 | 일본 경찰(110), 구급/소방(119), 주일 대한민국 대사관, 영사콜센터 등 기본 비상연락처 목록 제공 |
| **FR-RSV-01** | 예약 정보 표시 | 항공편, 숙소 체크인/아웃 정보, 예약 번호 등 핵심 예약 요약 정보 표시 |

### 3.4 공통 기능 (Common)
| ID | 요구사항 | 상세 설명 |
| :--- | :--- | :--- |
| **FR-CMN-01** | `LocalStorage` 영속성 | 모든 변경사항(일정 CRUD, 공지 수정, 체크리스트 토글)을 즉시 `LocalStorage`에 저장하고 새로고침 시 복원 |
| **FR-CMN-02** | 샘플 데이터 초기화 | 초기화 버튼 및 확인 절차를 통해 저장된 데이터를 도쿄 2박 3일 기본 샘플 상태로 복구 |
| **FR-CMN-03** | 일관된 디자인 시스템 | 통일된 컬러 팔레트, 타이포그래피, 카드·모달·버튼 컴포넌트 및 직관적인 내비게이션 제공 |

---

## 4. 범위 제외 및 추후 Feature 브랜치 예정 기능

> 아래 기능은 **현재 초기 MVP 단계에서는 구현하지 않으며**, 추후 별도의 `feature/*` 브랜치에서 단계적으로 개발할 예정입니다.

- 현지어 택시 카드 모달
- 신규 긴급 SOS 모달
- 공백 입력 차단 로직
- 최대 글자 수 제한 및 XSS 입력 검증 강화

---

## 5. 모듈별 데이터 스키마 설계

모든 클라이언트 데이터는 버전 관리를 지원하는 단일 `LocalStorage` 키(`travel-planner-mvp:v1`) 아래 JSON 직렬화 형태로 저장합니다.  
파싱 실패 또는 데이터 손상 시 초기 샘플 데이터로 안전하게 폴백합니다.

### 5.1 루트 저장소 스키마 (`TravelPlannerState`)

```ts
export const STORAGE_KEY = 'travel-planner-mvp:v1';

export type TripDay = 1 | 2 | 3;

export interface TripMeta {
  title: string;          // 예: "도쿄 2박 3일 여행"
  destination: string;    // 예: "Tokyo, Japan"
  durationLabel: string;  // 예: "2박 3일"
  startDate: string;      // YYYY-MM-DD
  endDate: string;        // YYYY-MM-DD
}

export interface TravelPlannerState {
  schemaVersion: number;                  // 현재 버전: 1
  tripMeta: TripMeta;
  itinerary: ItineraryItem[];             // 일정 관리 모듈
  notice: NoticeItem;                     // 공지사항 (1건)
  checklist: ChecklistItem[];             // 체크리스트 (기본 5건)
  vouchers: VoucherItem[];                // 바우처 (샘플 3건)
  reservations: ReservationInfo[];        // 예약 정보 요약
  emergencyContacts: EmergencyContact[];  // 기본 비상연락처
}
```

### 5.2 일정 관리 모듈 (`Itinerary`)

```ts
export interface ItineraryItem {
  id: string;        // 고유 식별자 (예: "itn-1")
  day: TripDay;      // 1 | 2 | 3
  time: string;      // "HH:mm" 형식 (예: "09:30")
  location: string;  // 방문 장소 (예: "센소지(아사쿠사)")
  activity: string;  // 주요 활동 (예: "가미나리몬 관람 및 나카미세 거리 산책")
  memo: string;      // 상세 메모 (예: "오전 방문 시 혼잡도 낮음")
}
```

### 5.3 공지 및 체크리스트 모듈 (`Notice / Checklist`)

```ts
export interface NoticeItem {
  id: string;        // 고유 식별자 (예: "notice-main")
  title: string;     // 공지 제목
  content: string;   // 공지 본문
  updatedAt: string; // ISO 8601 수정 시각 (예: "2026-11-26T09:00:00.000Z")
}

export interface ChecklistItem {
  id: string;        // 고유 식별자 (예: "chk-1")
  label: string;     // 준비물 / 확인 항목명
  completed: boolean;// 체크 여부
  category?: string; // 선택 분류 (예: "필수서류", "통신", "환전")
}

// 파생 상태 (Derived State - 저장하지 않고 실시간 계산)
export interface ChecklistProgress {
  completedCount: number; // 완료 항목 수
  totalCount: number;     // 전체 항목 수
  percentage: number;     // 0 ~ 100 정수 백분율
}
```

### 5.4 바우처 및 긴급정보 모듈 (`Voucher / SOS`)

```ts
export type VoucherCategory = 'FLIGHT' | 'HOTEL' | 'TRANSPORT' | 'TICKET';

export interface VoucherItem {
  id: string;                // 고유 식별자 (예: "vch-1")
  title: string;             // 바우처명 (예: "나리타 익스프레스(N'EX) 왕복권")
  provider: string;          // 발급/예약처 (예: "JR East")
  category: VoucherCategory; // 바우처 유형
  reservationCode: string;   // 예약 번호/코드 (예: "NEX-2026-8472")
  validDate: string;         // 이용 일자 또는 유효 기간
  location: string;          // 사용처/교환처
  qrPayload: string;         // QR 모달에 렌더링할 코드 문자열
  notes?: string;            // 유의사항
}

export type ReservationType = 'FLIGHT' | 'ACCOMMODATION' | 'OTHER';

export interface ReservationInfo {
  id: string;                // 고유 식별자 (예: "rsv-1")
  type: ReservationType;     // 예약 유형
  title: string;             // 항목명 (예: "숙소 - 신주쿠 그레이스리 호텔")
  reservationNumber: string; // 예약 번호
  schedule: string;          // 일시 (예: "체크인 15:00 / 체크아웃 11:00")
  detail: string;            // 주소 또는 항공편 상세
}

export type EmergencyCategory = 'POLICE' | 'MEDICAL' | 'EMBASSY' | 'SUPPORT';

export interface EmergencyContact {
  id: string;                  // 고유 식별자 (예: "sos-1")
  name: string;                // 기관명 (예: "일본 경찰 신고")
  phone: string;               // 연락처 (예: "110")
  description: string;         // 안내 문구
  category: EmergencyCategory; // 분류
}
```

---

## 6. 실행 및 빌드 방법

### 6.1 사전 요구사항
- **Node.js**: `>= 20.0.0` (Node.js 20 LTS 및 현재 로컬 Node.js 환경 호환, `.nvmrc`에 `20` 명시)
- **패키지 매니저**: `npm`

### 6.2 로컬 실행
```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행 (http://localhost:5173)
npm run dev
```

### 6.3 검증 및 프로덕션 빌드
```bash
# TypeScript 타입 체크
npm run typecheck

# ESLint 정적 분석
npm run lint

# 단위 및 통합 테스트 (Vitest)
npm run test

# 프로덕션 빌드 (dist/ 출력)
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 7. 단계별 진행 현황

- [x] **Stage 01**: 요구사항 분석, 데이터 스키마 설계 및 `README.md` 작성
- [x] **Stage 02**: Stitch MCP(`15535182799094676996`) 기반 모바일 3개 화면 UI 프로토타입 생성
- [x] **Stage 03**: Multi-Agent 개발 전략 수립 (`docs/AGENT_PLAN.md`)
- [x] **Stage 04**: Multi-Agent(Agent A·B·C) 병렬 구현, 통합 및 로컬 빌드·린트 검증
- [ ] **Stage 05 이후**: GitHub Actions CI/CD, Vercel 배포 및 Feature 브랜치 확장 (예정)
