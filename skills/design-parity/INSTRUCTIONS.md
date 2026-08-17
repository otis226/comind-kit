# design-parity

## Mục đích

Dùng khi một **exact design/reference đã được xác định là acceptance target** và implementation cần chứng minh fidelity.

Nếu task không có exact design acceptance, không dùng skill này làm fake gate; dùng `skills/ui-design-authority.md` + coherence/design-quality review.

`ui-review.md` giúp tìm gap; skill này quy định evidence để kết luận implementation đã đạt exact-reference scope hay chưa.

## 1. Source priority

Business/security/source priority vẫn theo `AGENTS.md` và project pack.

Exact design là visual/interaction authority cho đúng surface/state, không tự động là business truth. Prototype-only data/state/route không được copy thành production contract.

Nếu exact reference mâu thuẫn invariant mới hơn, production giữ invariant và document `intentional business-safe delta`.

## 2. Hai pass khi structural change lớn

### Pass A — Structural / visual port

- hierarchy;
- copy/label;
- grouping;
- proportion;
- spacing rhythm;
- visual states;
- action placement.

### Pass B — Production rewire

- real API/state;
- permission/domain gates;
- loading/error/empty;
- audit/integration capability;
- accessibility;
- production behavior.

Sau rewire phải visual-verify lại vì real data có thể làm layout drift.

## 3. Acceptance gates

Design conversion có 5 concern độc lập:

1. Visual.
2. Structure / semantics.
3. Interaction / state.
4. Business contract.
5. Regression.

Không concern nào thay thế concern khác.

## 4. Visual gate

```text
Visual
├─ Structural Visual
└─ Pixel Visual
   └─ requires Comparable State
```

### 4.1 Structural Visual

Đánh giá composition/hierarchy độc lập literal values:

- component/state variant;
- information hierarchy/order;
- row/column composition;
- proportion;
- spacing/alignment;
- wrapping/truncation;
- control placement;
- expanded/collapsed geometry;
- responsive/crop geometry của surface trong scope.

Literal data khác không biến structural defect thành dataset noise.

### 4.2 Comparable State

Pixel comparison chỉ actionable khi:

- cùng business/component state;
- cùng role/tab/expanded condition;
- cùng viewport;
- cùng focused surface/crop;
- data shape/cardinality đủ tương đương;
- intentional deltas đã predeclare.

Nếu chưa comparable:

```text
Structural Visual = vẫn PASS/FAIL/BLOCKED
Pixel Visual      = BLOCKED
Raw pixel diff    = diagnostic only
```

### 4.3 Pixel Visual

Khi comparable:

```text
REFERENCE screenshot
vs
PRODUCTION screenshot
→ focused diff
→ PASS / FAIL
```

Không dùng full-page pixel ratio như absolute truth. Ưu tiên focused surface và stable state.

Threshold phải calibrate từ known-good comparable fixture/runtime; một con số như 3% không phải universal truth.

Nếu residual pixel mismatch còn sau Structural PASS, dùng `skills/pixel-parity-calibration.md` để phân loại product defect, intentional delta, fixture/data, clock/state và capture noise trước khi sửa thêm product code hoặc đổi threshold.

### 4.4 Verdict composition

```text
Structural FAIL                  → Visual FAIL
Structural PASS + Pixel FAIL    → Visual FAIL
Structural PASS + Pixel BLOCKED → Visual BLOCKED
Structural PASS + Pixel PASS    → Visual PASS
Structural BLOCKED              → Visual BLOCKED
```

### 4.5 Capture normalization

Ổn định khi có thể:

- viewport;
- fonts;
- motion/animation;
- deterministic time/date;
- scroll/expanded state;
- focus state.

Không hide product element chỉ để giảm diff.

## 5. Structure / semantics

Dùng semantic evidence phù hợp: role/name assertions, ARIA snapshot, DOM contract hoặc equivalent.

Visual giống nhưng button/input/heading semantics sai vẫn FAIL.

Runtime/API/console error làm evidence không đáng tin phải FAIL/BLOCKED cho tới khi được xử lý hoặc chứng minh ngoài scope.

## 6. Interaction / state

Browser thật cho state quan trọng:

- click/open/close;
- select/expand;
- enabled/disabled;
- loading/error/empty;
- form validation;
- state transition;
- keyboard/focus khi relevant.

## 7. Business contract

Invariant quan trọng phải có targeted executable assertion/scenario khi practical, không chỉ ghi trong prompt.

Nếu prototype khác invariant, invariant thắng và delta được document.

## 8. Regression

Chạy targeted test/typecheck/lint/build/E2E phù hợp project/scope. Test pass không thay Visual; Visual pass không thay business/regression.

Nếu candidate đã từng PASS runtime/UAT rồi tiếp tục thay đổi, dùng `skills/runtime-regression.md` để quyết định evidence nào còn carry-forward được và journey nào phải rerun.

## 9. Done rule

Không report `aligned`, `matches design`, `PARITY READY` hoặc tương đương khi còn:

- required surface chưa verify;
- Structural Visual FAIL/BLOCKED;
- required Pixel Visual FAIL/BLOCKED;
- semantic/interaction/business/regression FAIL/BLOCKED;
- relevant runtime error chưa giải thích;
- intentional delta chưa document;
- evidence không reviewer-accessible khi workflow yêu cầu review độc lập.

Environment/data không cho chạy gate thì report `BLOCKED`/`NOT VERIFIED`, không đổi thành PASS.

`NOT_APPLICABLE` chỉ khi concern thật sự ngoài acceptance scope.

## 10. Exact-candidate evidence

Evidence chỉ chứng minh candidate/product state mà nó thực sự chạy.

```text
candidate A → PARITY READY
product changes → candidate B
→ evidence A không tự động cover B
```

Nếu B có change có thể ảnh hưởng acceptance scope, rerun affected surfaces/concerns trước khi claim B ready.

Không cần replay mọi historical check nếu impact tách biệt và có thể chứng minh; dùng impact-based rerun theo `skills/runtime-regression.md`.

Dirty/uncommitted WIP có thể dùng để diagnose nhưng không được gán PASS cho một committed SHA khác.

## 11. Completion và sign-off

```text
PARITY READY
= executable evidence chứng minh exact-reference acceptance scope

PRODUCT COMPLETE
= PARITY READY + user/PO acceptance trên final product state theo project workflow
```

AI parity review không tự thay user/product acceptance.

## 12. Evidence manifest

Tối thiểu:

```text
Product candidate: <branch/SHA>
Reference identity/ref:
Surface/state:
Viewport:
Structural Visual: PASS|FAIL|BLOCKED
Comparable State: PASS|FAIL|BLOCKED
Pixel Visual: PASS|FAIL|BLOCKED|N/A
Semantics: PASS|FAIL|BLOCKED
Interaction: PASS|FAIL|BLOCKED
Business: PASS|FAIL|BLOCKED
Regression: PASS|FAIL|BLOCKED
Intentional deltas:
Evidence:
```

Required surface có Pixel BLOCKED phải nói rõ comparable fixture/state nào còn thiếu, không chỉ ghi `data differs`.

## 13. Evidence và helper lifecycle

Binary evidence không cần sống vĩnh viễn trong product history. Dùng `skills/evidence-transport.md` để chọn living PR/review evidence hoặc temporary artifact mechanism.

Nguyên tắc:

```text
Evidence is disposable; reproducibility is durable.
Product repo should retain capabilities, not debugging sessions.
```

One-off capture/debug helper nên ở temporary/gitignored location khi practical. Trước cleanup áp dụng `promote-or-delete`:

- capability generic/reusable → promote vào harness/config/test có ownership rõ;
- session-specific helper → delete sau khi không còn cần.

Cleanup/finalization theo `skills/finalize-workstream.md`.

## 14. Fixture và threshold discipline

Parity fixture là verification infrastructure, không phải random UAT residue.

- ưu tiên deterministic fixture cho state quan trọng;
- không phá fixture có giá trị chỉ để manufacture screenshot;
- required scenario thiếu fixture → `BLOCKED` hoặc seed fixture ở đúng layer khi scope cho phép;
- không tăng threshold chỉ để green;
- không crop/mask defect mà không có documented scope reason;
- không gọi geometry/hierarchy defect là data noise chỉ vì literal content khác.

Nếu config/threshold/crop thay đổi, recapture/re-evaluate evidence bị ảnh hưởng.

## 15. Orchestration

Write slices có thể parallelize theo ownership, nhưng parity verdict phải chạy trên **combined candidate** do Final Integration owner chịu trách nhiệm.

Không cộng PASS cục bộ của từng subagent để suy ra toàn feature PASS.
