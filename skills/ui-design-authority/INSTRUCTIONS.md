# ui-design-authority

## Mục đích

Dùng trước implementation cho UI task khi cần xác định **AI được phép tự quyết design tới đâu**.

Skill này giải quyết hai lỗi đối lập:

1. có exact design nhưng coding agent tự redesign;
2. không có exact design nên coding agent coi đó là quyền tự do tạo một visual language mới.

Nguyên tắc:

```text
ABSENT SCREEN DESIGN != ABSENT DESIGN AUTHORITY
DESIGN FREEDOM MUST BE RESOLVED, NOT ASSUMED
INHERIT BEFORE DERIVE
DERIVE BEFORE INVENT
```

Đây là workflow/design-governance policy, không phải design system của một project cụ thể.

## 1. Khi nào phải resolve

Resolve design authority khi task user-visible có một trong các yếu tố:

- screen/surface mới;
- layout/composition mới;
- component/pattern tương tác mới;
- visual language mới hoặc thay đổi đáng kể;
- form/table/detail/dashboard/navigation mới;
- không có exact design nhưng agent phải quyết định UI;
- reference/design system hiện có mâu thuẫn hoặc không đủ rõ.

Một patch nhỏ thuần copy, icon replacement hoặc token-aligned tweak có thể dùng authority đã rõ của surface mà không cần tạo manifest dài.

## 2. Evidence hierarchy

Tìm evidence theo project/source priority. Các loại evidence có thể gồm:

- exact accepted design/prototype/spec cho đúng state;
- formal design system, token, component library, `DESIGN.md`, Storybook hoặc equivalent;
- current product screens cùng loại;
- shared application chrome/pattern;
- CSS/theme variables và reusable primitives;
- product/design decisions đã xác nhận;
- current implementation chỉ như evidence, không tự động là canonical design.

Không lấy framework default, template gallery hoặc taste của model làm authority khi evidence project đã tồn tại.

## 3. Bốn design modes

### A. REFERENCE_BACKED

Dùng khi có exact accepted design/reference cho surface/state.

Việc một screenshot/Figma/export tồn tại **không tự động** làm nó thành acceptance target. Chỉ dùng `REFERENCE_BACKED` khi source đó thực sự được xác nhận hoặc có provenance đủ rõ là target cho đúng surface/state.

Coding freedom:

- implement structure/visual/interaction theo reference;
- dùng production-safe equivalents khi reference chỉ là prototype;
- giữ business/security/accessibility/integration contract của production.

Không được:

- redesign vì model thấy hướng khác “đẹp hơn”;
- copy mock data/prototype lifecycle thành business rule;
- xóa production capability chỉ vì reference không render nó.

Acceptance:

- `skills/design-parity.md` khi visual fidelity là deliverable.

### B. SYSTEM_BACKED

Dùng khi không có exact screen design nhưng có established design system hoặc product conventions đủ mạnh.

Agent được quyết định:

- information hierarchy;
- composition/layout;
- grouping;
- placement;
- empty/loading/error presentation;
- chọn pattern phù hợp từ system.

Agent không được tự ý thay:

- typography system;
- palette/semantic color grammar;
- radius/elevation language;
- control/form/table language;
- icon family;
- interaction convention đã established;
- component primitive khi shared primitive hiện có đáp ứng đúng nhu cầu.

Mục tiêu: **new solution, same product language**.

### C. PRODUCT_DERIVED

Dùng khi không có formal system đủ tin cậy nhưng product đã có đủ UI để suy ra convention.

Quy trình:

1. Chọn một tập nhỏ representative screens cùng product và gần intent nhất.
2. Inspect recurring typography, spacing, control, surfaces, navigation, state feedback và density.
3. Phân biệt recurring pattern với one-off implementation accident.
4. Tạo `DERIVED DESIGN CONTRACT` ngắn.
5. Gắn confidence cho convention quan trọng khi cần.

Ví dụ output:

```text
Inherited/high confidence:
- compact table density
- blue primary action
- left navigation

Derived/medium confidence:
- ~8px spacing rhythm
- medium-radius surfaces

New proposal:
- long edit flow uses a side panel because no equivalent form exists
```

`DERIVED` không đồng nghĩa `CANONICAL`.

Current implementation chỉ là evidence. Một convention chỉ đáng derive khi có recurring evidence từ representative surfaces hoặc project source đáng tin cậy; không biến một one-off screen thành design system chỉ vì nó đang tồn tại.

Không tạo project-wide token/component/system rule chỉ vì một màn mới cần giải quyết layout. Chỉ formalize khi pattern đã lặp lại và reuse thực sự có giá trị.

### D. GREENFIELD

Dùng khi chưa có exact reference, formal system hoặc existing UI đủ tin cậy.

Không đi thẳng từ requirement sang production styling tùy hứng.

Tạo **Minimal Design Contract** trước:

- product character/tone;
- density;
- typography strategy;
- color/semantic strategy;
- spacing rhythm;
- radius/elevation strategy;
- surface hierarchy;
- primary controls;
- form/navigation conventions;
- feedback/state behavior;
- accessibility/responsive baseline.

Contract phải đủ nhỏ để project bắt đầu nhanh. Không xây một enterprise design system trước khi có nhu cầu thật.

Sau first surface, review bằng `DESIGN_QUALITY`, rồi chỉ formalize thêm khi pattern bắt đầu lặp lại.

## 4. Progressive design maturity

Project có thể trưởng thành theo hướng:

```text
NONE
→ PROVISIONAL CONTRACT
→ RECURRING PRODUCT PATTERNS
→ DERIVED SYSTEM
→ ESTABLISHED TOKENS/COMPONENTS
→ FORMAL DESIGN SYSTEM
```

Không ép project nhỏ phải có token library, Figma hay Storybook chỉ để được phép code.

Mục tiêu là đủ governance để tránh inconsistency, không phải tạo ceremony.

## 5. DESIGN MANIFEST

Với UI task không trivial, main agent hoặc `ui-design-architect` trả manifest compact trước implementation:

```text
DESIGN AUTHORITY
Mode: REFERENCE_BACKED | SYSTEM_BACKED | PRODUCT_DERIVED | GREENFIELD

Canonical inputs:
- ...

Representative product surfaces:
- ... | N/A

Inherited conventions:
- ... | NONE

Derived conventions:
- ... | NONE

New design decisions/proposals:
- ... | NONE

Allowed freedom:
- ...

Do-not-deviate:
- ...

Intentional deltas:
- ... | NONE

Review baseline:
- exact reference | product system/sibling screens | minimal contract

Open ambiguity:
- ... | NONE
```

Manifest không phải spec pixel-by-pixel. Nó xác định **authority boundary** để implementer biết chỗ nào được quyết định và reviewer biết lấy gì làm baseline.

## 6. Khi nào gọi ui-design-architect

Không cần gọi specialist cho mọi thay đổi UI.

Nên gọi khi:

- mode là `PRODUCT_DERIVED` hoặc `GREENFIELD` và task không trivial;
- `SYSTEM_BACKED` nhưng cần composition/pattern mới đáng kể;
- nhiều nguồn design mâu thuẫn;
- design decision có thể ảnh hưởng nhiều screen;
- implementer có nguy cơ vừa invent vừa self-certify.

Có thể không gọi khi:

- `REFERENCE_BACKED` và exact source đã rõ;
- patch nhỏ dùng pattern/component established rõ ràng;
- task thuần visual fix với baseline hiện có không mơ hồ.

## 7. Anti-slop guardrails

Không dùng checklist thẩm mỹ cứng kiểu “không bao giờ gradient/card/Inter”. Thay vào đó áp dụng các rule sau:

- Không introduce visual vocabulary mới khi vocabulary hiện có diễn đạt được task.
- Không tạo primitive mới khi shared primitive hiện có đáp ứng semantics/interaction.
- Không dùng arbitrary color/radius/shadow/spacing khi project có token/convention.
- Không wrap mọi group thành card chỉ để tạo cảm giác “designed”.
- Không duplicate cùng một fact qua header/summary/body/sidebar nếu không có workflow reason rõ ràng.
- Không dùng color như decoration khi màu đó ngầm truyền semantic state/consequence.
- Không dùng decorative metric/badge/gradient khi chúng không giúp action/decision.
- Không biến mọi product thành generic dashboard/SaaS template.
- Không ưu tiên novelty hơn workflow clarity.
- Không invent field/state/permission/lifecycle để làm layout thuận tiện hơn.
- Không dùng framework component default như design decision nếu product đã có wrapper/pattern riêng.
- Không copy một project khác trong CoMind làm visual baseline nếu project hiện tại không xác nhận quan hệ đó.

## 8. Review routing

Sau implementation:

```text
REFERENCE_BACKED
→ ui-visual-reviewer mode PARITY

SYSTEM_BACKED / PRODUCT_DERIVED
→ ui-visual-reviewer mode COHERENCE

GREENFIELD
→ ui-visual-reviewer mode DESIGN_QUALITY
```

Runtime/interaction vẫn do runtime reviewer hoặc project verification workflow cover.

## 9. Block hay proceed

Không block chỉ vì thiếu exact mockup.

Chỉ `BLOCKED` khi unresolved decision thực sự làm agent không thể chọn design direction có trách nhiệm, ví dụ:

- authoritative references/product owners mâu thuẫn và không resolve được từ source;
- target platform/viewport chưa biết nhưng materially làm thay đổi surface;
- business/workflow choice chưa chốt và nó quyết định information architecture;
- task yêu cầu thay đổi global design system nhưng chưa có authority cho thay đổi đó.

Nếu không có blocker loại này, derive/propose **smallest reasonable contract**, đánh dấu uncertainty/proposal và tiếp tục. Không chuyển thiếu design thành preference questionnaire không cần thiết.

## 10. Human acceptance

AI design review có thể chứng minh consistency/quality nhưng không thay product acceptance của người dùng.

Với greenfield hoặc proposal lớn, final handoff phải nói rõ đâu là design decision mới để người dùng có thể chấp nhận/chỉnh hướng mà không nhầm đó là rule đã tồn tại.
