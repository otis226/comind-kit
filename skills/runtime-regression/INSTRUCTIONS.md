# runtime-regression

## Mục đích

Dùng khi một workflow đã từng PASS bằng real browser/UAT nhưng product tiếp tục có commit mới trước final acceptance/merge.

Skill này quy định cách không carry-forward runtime evidence sai qua product SHA khác nhau. Nó dùng được độc lập; nếu task có exact design parity thì evidence cũng cấp cho Interaction/Business/Regression concerns của `skills/design-parity.md`.

## 1. Exact-SHA evidence rule

Một runtime/UAT PASS chỉ chứng minh product state đã chạy.

```text
candidate A
→ critical journey PASS

product changes → candidate B
→ PASS của A không tự động cover B
```

Rerun theo impact, không replay toàn bộ history sau mỗi commit.

- isolated visual change có thể chỉ cần targeted smoke;
- state/API/cache/shared component thay đổi thì rerun journey tương ứng;
- shared integration thay đổi nhiều surface thì rerun combined affected flow.

Nếu không chứng minh được change không ảnh hưởng journey cũ, ưu tiên rerun.

## 2. Current-candidate regression bridge

Khi có historical browser baseline nhưng candidate đã đi tiếp:

```text
historical functional PASS
→ subsequent changes
→ CURRENT-CANDIDATE REGRESSION
→ critical capabilities still PASS?
```

Nếu phát hiện regression thật:

- reopen root-cause investigation đúng scope;
- fix đúng layer;
- thêm/adjust test từ failure thật khi practical;
- rerun affected journey.

Nếu PASS, carry-forward concern không bị impact và tiếp tục acceptance workflow.

## 3. Final Candidate critical journey

Trước final readiness khi flow quan trọng:

- run real application + matching dependency contracts;
- real browser;
- critical mutation có network evidence khi relevant;
- reload/persistence cho state quan trọng;
- relevant page/console errors sạch;
- không dùng mock-only evidence thay runtime behavior thật.

Nếu code thay đổi sau final journey, rerun affected parts trước khi candidate mới kế thừa PASS.

## 4. Quan hệ với visual/design work

Runtime PASS không chứng minh visual fidelity. Visual PASS không chứng minh workflow runtime.

Nếu exact design parity áp dụng:

```text
Structural/Pixel Visual
+ Runtime Interaction/Business/Regression evidence
= independent concerns of one candidate
```

Nếu không có exact design, runtime regression vẫn dùng bình thường cùng coherence/design-quality visual review.

## 5. Multitask / orchestration

- read/search investigation có thể parallelize;
- independent journey có thể parallelize nếu fixture/state không collision;
- mutation-heavy journey cần fixture/ownership rõ;
- không cho nhiều writer sửa cùng shared region không isolation;
- Final Integration owner chịu combined result.

## 6. Evidence handoff

```text
Candidate: <exact SHA/state>
Historical runtime baseline: <SHA/evidence>
Changes since baseline: <impact summary>
Journeys rerun: <list>
Browser/page errors: NONE|details
Console errors: NONE|details
Critical API failures: NONE|details
Interaction: PASS|FAIL|BLOCKED
Business: PASS|FAIL|BLOCKED
Regression: PASS|FAIL|BLOCKED
Evidence: <reviewer-accessible location>
```

Journey chưa rerun nhưng change có thể ảnh hưởng nó thì không carry-forward PASS im lặng; ghi `NOT VERIFIED`/`BLOCKED` hoặc rerun.
