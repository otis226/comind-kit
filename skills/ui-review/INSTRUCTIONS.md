# ui-review

## Mục đích

Dùng để review UI/UX khi có một hoặc nhiều nguồn sau:

- exact design/reference;
- implementation hiện tại;
- established design system/product patterns;
- derived product conventions;
- greenfield design proposal.

Mục tiêu là tìm đúng gap, hiểu intent và phân biệt **business correctness**, **design authority** và **implementation detail**.

Nếu task có exact design acceptance, visual fidelity là deliverable. Nếu không có exact design, không dựng pixel parity giả; review consistency/quality theo authority thực tế của project.

Khi review screenshot, mockup hoặc existing product UI, dùng `skills/product-ui-critique.md` như critique lens. Skill đó không thay source priority/design authority/review mode; nó chuẩn hóa cách nhận diện vấn đề, preservation/KEEP và anti-redesign discipline.

## 1. Resolve authority trước review

Đọc source priority của project và `skills/ui-design-authority.md` khi design authority chưa rõ.

Review mode:

```text
REFERENCE_BACKED → PARITY REVIEW
SYSTEM_BACKED / PRODUCT_DERIVED → COHERENCE REVIEW
GREENFIELD → DESIGN QUALITY REVIEW
```

Implementation hiện tại là evidence, không tự động là source of truth.

## 2. Source priority

Mặc định:

1. xác nhận mới nhất của người dùng/người có thẩm quyền;
2. current canonical product/design source đúng project;
3. confirmed project decisions;
4. established/derived product patterns;
5. current implementation.

Nếu exact design mâu thuẫn business/security invariant mới hơn, invariant thắng và visual delta phải được ghi rõ.

## 3. Local-first và portable handoff

Khi coding/runtime environment có local repositories:

- inspect current HEAD + dirty state;
- ưu tiên current working tree khi đó rõ ràng là source mới nhất cho đúng surface;
- không reset về historical commit chỉ vì review cũ dùng commit đó;
- dùng relative path/repo name trong handoff;
- historical SHA dùng cho provenance/fallback, không phải target bắt buộc.

## 4. Exact reference handling

Reference có thể là Figma/export/HTML/source/screenshot/spec hoặc equivalent.

Nếu matching source có thể render, ưu tiên source + screenshot thực tế hơn chỉ suy đoán từ screenshot tĩnh.

Không copy mù:

- mock data;
- fake routing;
- prototype-only state;
- inline styling trái design system production;
- lifecycle/permission/API không có contract.

Không xóa production capability hữu ích chỉ vì reference không thể hiện nó; classify intentional delta/out-of-scope trước.

## 5. Chốt visual scope

Xác định:

- screen-owned content;
- shared app/project chrome;
- state/role/tab/viewport đang review;
- data differences cần ignore;
- intentional product delta.

Shared chrome có thể ảnh hưởng width/layout nhưng không mặc định là target của screen-specific conversion.

## 6. Screenshot-first cho PARITY

Khi exact reference render được:

```text
render reference ở state/viewport đúng
→ capture focused surface
→ render production cùng điều kiện
→ capture equivalent surface
→ nhìn 3–5 gap lớn nhất
→ inspect DOM/CSS/token của đúng gap
→ fix
→ recapture
```

Screenshot để phát hiện **cái gì sai**; DOM/CSS/metric để tìm **vì sao sai**.

Không bắt đầu bằng hàng loạt px/metric nếu chưa biết visual gap chính.

## 7. COHERENCE REVIEW

Khi không có exact design nhưng có system/product language, review candidate theo:

- token/component reuse;
- typography hierarchy;
- spacing rhythm/density;
- surface/card/control grammar;
- interaction conventions;
- semantic colors/states;
- icon family;
- sibling-screen consistency;
- responsive behavior;
- information architecture theo workflow.

Câu hỏi chính:

> Nếu bỏ URL/tên feature, surface này có rõ ràng thuộc cùng product không, và nó có dùng đúng pattern cho công việc này không?

Không yêu cầu screen mới giống pixel một sibling screen nếu intent khác.

## 8. DESIGN QUALITY REVIEW

Với greenfield/provisional contract, review:

- hierarchy và scanability;
- task clarity;
- primary/secondary action;
- information density;
- feedback/state handling;
- accessibility baseline;
- responsive baseline;
- consistency với Minimal Design Contract;
- dấu hiệu generic/template-driven không phục vụ intent.

Mục tiêu không phải “độc đáo bằng mọi giá”. Mục tiêu là intentional, usable và coherent.

## 9. Thứ tự soi

Review từ lớn xuống nhỏ. Dùng `skills/product-ui-critique.md` như critique lens trong từng lớp, nhưng không để visual taste vượt lên trên workflow/IA/system authority.

### 9.1 Behavior / State

- default/selected/expanded;
- enabled/disabled;
- loading/empty/error;
- role/action visibility;
- feedback sau action.

### 9.2 Information Architecture

- grouping;
- primary/secondary/supporting information;
- fact/action ownership;
- workflow order;
- duplicate information.

### 9.3 Layout / Proportion

- grid/column/container;
- alignment;
- whitespace distribution;
- width/height constraints;
- wrapping/truncation;
- responsive behavior.

### 9.4 Visual Hierarchy

- title/context/action weight;
- status/badge emphasis;
- section separation;
- muted hierarchy.

### 9.5 Density / Spacing

Mô tả gap trước, px sau. Ví dụ: card quá dày, header quá thấp, metadata quá sát, whitespace mất cân bằng.

Đừng mặc định tăng whitespace. Với product UI vận hành, density có thể là lợi thế nếu hỗ trợ scan/comparison/speed.

### 9.6 Visual Polish

- typography;
- icon;
- border/radius/shadow;
- color/surface;
- control variants;
- minor alignment.

### 9.7 Critique discipline

Với existing design/screenshot:

- diagnose before redesign;
- finding phải spatially specific khi evidence cho phép;
- phân biệt observed fact với inference;
- recommendation phải vượt qua change threshold trong `skills/product-ui-critique.md`;
- ưu tiên smallest effective change;
- không tạo issue chỉ để review có vẻ “đủ nhiều”.

## 10. Gap taxonomy

- `Visual/Layout` — presentation/composition.
- `Interaction/State` — behavior/state.
- `Functional/Business` — workflow/capability/invariant.
- `System coherence` — lệch design system/product grammar.
- `Design quality` — greenfield/provisional design problem.
- `Data difference` — literal data khác, thường ignore.
- `Intentional current feature` — capability cần giữ.
- `Shared chrome / Out of scope`.
- `Unknown` — authority chưa đủ rõ.

## 11. Priority

- `P0` — sai workflow/state/invariant quan trọng hoặc usability blocker.
- `P1` — IA/layout/hierarchy/system coherence lệch rõ, ảnh hưởng scan/action hoặc làm surface như product khác.
- `P2` — density/spacing/polish/accessibility refinement không chặn flow chính.
- `Ignore` — data/shared chrome/intentional delta ngoài scope.
- `KEEP` — preservation marker cho phần đang đúng; **không phải severity**.

Không tạo thêm taxonomy `Critical/Major/Minor` song song nếu project không yêu cầu.

## 12. Gap format

Với review implementation/handoff:

```text
[P0/P1/P2] <gap>

Current:
...

Expected / authority:
...

Assessment:
<taxonomy>

Recommendation:
...

Coding agent should inspect:
...
```

Với screenshot/existing-design critique, có thể dùng format giàu evidence hơn:

```text
[P0/P1/P2] <finding>

Observed:
...

Impact:
...

Authority:
...

Recommendation:
...

Confidence:
HIGH | MEDIUM | LOW
```

## 12.1 Preservation output

Một review meaningful nên ghi rõ phần đang tốt khi có thứ thực sự đáng giữ:

```text
KEEP — Do not change
- ...
```

Mục đích là ngăn vòng fix sau phá hỏng hierarchy, density, component choice hoặc workflow đã đúng.

Không bịa KEEP item để lấp template.

## 13. Handoff rule

Reviewer nói **kết quả cần đạt** và evidence/authority, không viết hộ toàn bộ implementation nếu coding agent có source/runtime context tốt hơn.

Không kết luận `aligned` khi exact-design acceptance chưa có evidence theo `skills/design-parity.md`.

Khi review chỉ ra ít hoặc không có gap material, được phép kết luận rằng không cần structural redesign; review không đồng nghĩa phải tìm thứ để sửa.
