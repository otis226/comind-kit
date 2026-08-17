# coding-agent-handoff

## Mục đích

Dùng khi viết prompt cho Cursor, Claude Code, Codex hoặc coding harness khác để triển khai một task từ yêu cầu đã review/chốt.

Skill này chuẩn hóa ba việc:

1. resolve đúng project/source trước khi code;
2. resolve design authority trước UI implementation;
3. orchestration main-agent → vertical subagents → Final Integration khi task đủ lớn.

Đây là workflow/tooling policy, không phải business rule của project cụ thể.

## Nguyên tắc cốt lõi

```text
PROJECT TRUTH BEFORE CODE
DESIGN AUTHORITY BEFORE UI CODE
OWNERSHIP BEFORE PARALLEL WRITES
VERTICAL SUBAGENTS, NOT LAYER SUBAGENTS
MAIN AGENT OWNS INTEGRATION
```

## 1. Phase 0A — Project/source resolution

Trước implementation, main coding agent phải:

1. đọc current project instructions;
2. xác định repository/surface/flow thật sự liên quan;
3. inspect current working tree/HEAD khi có local workspace;
4. resolve business/product/API/security source cần thiết;
5. không checkout/reset về historical snapshot chỉ vì review cũ từng dùng snapshot đó;
6. report blocker chỉ khi ambiguity không thể resolve từ source và materially thay đổi kết quả.

Prompt nên dùng repo name + relative path, tránh machine-specific absolute path nếu task cần portable.

## 2. Phase 0B — UI design authority

Nếu task có user-visible UI, đọc `skills/ui-design-authority.md` hoặc yêu cầu main agent áp dụng protocol tương đương.

Main agent phải classify:

```text
REFERENCE_BACKED
SYSTEM_BACKED
PRODUCT_DERIVED
GREENFIELD
```

### 2.1 REFERENCE_BACKED — exact source resolution

Nếu exact design/reference là acceptance target, resolve cụ thể:

- affected product surfaces;
- exact source/entrypoint cho từng surface;
- relevant imported source/style bundle khi entrypoint chỉ là wrapper;
- production route/component tương ứng;
- provenance/ref/local state khi cần.

Không handoff bằng câu mơ hồ như:

```text
inspect the current design
use the existing mockup
match the design folder
```

nếu coding agent có thể resolve exact source.

Nếu exact design chỉ tồn tại local, main coding agent tự discover trong workspace và trả `SOURCE MANIFEST`. Nếu nhiều candidate vẫn genuinely ambiguous sau inspect, report `BLOCKED` thay vì tự chọn.

### 2.2 SYSTEM_BACKED / PRODUCT_DERIVED / GREENFIELD

Không có exact design thì không dựng một fake parity target.

Main agent phải tạo/nhận `DESIGN MANIFEST` theo `skills/ui-design-authority.md`:

- authority mode;
- canonical inputs;
- inherited/derived conventions;
- new proposal;
- allowed freedom;
- do-not-deviate;
- review baseline.

Với `PRODUCT_DERIVED`, `GREENFIELD`, hoặc `SYSTEM_BACKED` có composition mới đáng kể, ưu tiên gọi design specialist read-only nếu runtime hỗ trợ.

## 3. Design không phải business rule

Design/reference là visual/interaction authority trong phạm vi đã xác định. Lifecycle, permission, API contract, security và business invariant vẫn theo source priority của đúng project.

Không copy seed data, fake IDs, mock routing hoặc prototype-only state thành production rule.

## 4. Main-agent orchestration

Với harness hỗ trợ subagents, dùng một main agent/orchestrator làm owner toàn task.

Main agent chịu trách nhiệm:

1. project/source resolution;
2. design authority nếu UI;
3. risk/scope understanding;
4. ownership/decomposition;
5. quyết định fan-out;
6. giao vertical slices;
7. giữ shared wiring/shared-file ownership;
8. nhận specialist reports;
9. Final Integration;
10. affected regression và verification cuối.

Không spawn write subagents trước khi source/surface/ownership đủ rõ.

## 5. Khi nào nên spawn subagents

Spawn khi có ít nhất hai vertical slices mà:

- mục tiêu chức năng độc lập tương đối;
- ownership tách được;
- mỗi slice có thể inspect → plan → implement → targeted test/verify;
- integration boundary mô tả được;
- parallelism giảm thời gian thật thay vì tăng conflict/context overhead.

Task nhỏ/tuyến tính/phụ thuộc chặt: main agent làm trực tiếp.

## 6. Vertical slice, không technical layer

Tốt:

```text
Slice A = Documents
Slice B = Activity
Slice C = Edit flow
```

Xấu:

```text
Agent A = React
Agent B = CSS
Agent C = Tests
```

Không để nhiều writer song song cùng sửa shared parent/CSS/API/state region nếu không có isolation/owner rõ.

## 7. Ownership map

Trước fan-out, main agent tạo map compact:

```text
Slice A — <goal>
Owns:
- <components/files/logic boundary>
Tests/verify:
- <targeted checks>
Shared dependencies:
- <read-only or integration-needed>

Main / Final Integration owns:
- shared parent
- shared API/state wiring
- shared design-system/token changes
- cross-slice regression
```

## 8. Subagent return contract

```text
SLICE: <name>
STATUS: COMPLETE | BLOCKED

Implemented:
- ...

Files changed:
- ...

Tests / targeted verification:
- <check> — PASS/FAIL

Shared integration needed:
- ... | NONE

Assumptions / blockers:
- ... | NONE
```

## 9. Final Integration

Sau fan-out:

```text
collect reports
→ inspect combined diff/current tree
→ resolve shared wiring/conflicts
→ verify source/design-authority coverage
→ run affected cross-slice regression
→ run required visual/runtime/business verification
→ fix integration defects
→ continue candidate/ship workflow
```

Individual slice PASS không bằng feature PASS.

## 10. Risk-sensitive orchestration

### FAST

Mặc định single-agent; chỉ fan-out investigation nếu lợi ích rõ.

### STANDARD

Phù hợp main orchestrator + vertical subagents khi ownership tách được.

### HIGH_RISK

Ưu tiên parallel investigation hơn parallel mutation. Security/permission/lifecycle/destructive/shared-contract logic phải có owner rõ.

## 11. Resource governor

Không chạy nhiều heavy/E2E suite song song chỉ vì có nhiều agent. Slice chạy targeted checks; Final Integration chạy concern cần ở combined candidate.

## 12. Prompt author contract

Mặc định prompt coding agent bằng English trừ khi người dùng yêu cầu khác.

Task non-trivial nên có các phần phù hợp:

```text
GOAL
CURRENT PRODUCT/BUSINESS GUARDRAILS
PHASE 0 — PROJECT/SOURCE RESOLUTION
UI DESIGN AUTHORITY (nếu có UI)
ORCHESTRATION
IMPLEMENTATION SCOPE
VERIFICATION / DONE CRITERIA
DO NOT / GUARDRAILS
```

Không micromanage implementation nếu agent có thể inspect source. Nhưng không dùng câu mơ hồ thay cho hard gate khi acceptance phụ thuộc exact source/design authority.

Nguyên tắc cuối:

```text
The main agent coordinates the work.
Resolve what is authoritative before generating new behavior or UI.
Each subagent owns a complete vertical slice.
Subagents report back; the main agent integrates.
Do not parallelize ownership conflicts.
```
