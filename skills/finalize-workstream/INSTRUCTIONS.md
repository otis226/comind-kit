# finalize-workstream

## Mục đích

Dùng khi một workstream/feature đã đạt acceptance cần thiết và người dùng yêu cầu merge/finalize/cleanup.

Workflow:

```text
accepted candidate
→ freeze candidate
→ resolve project ship gate
→ merge safety
→ merge
→ lightweight integrity check
→ cleanup
→ knowledge sync
→ COMPLETE / MERGED
```

Đây là reusable workflow. Project-specific ship/deploy rule phải lấy từ current project instructions/project pack/source canonical, không hard-code vào core.

## 1. Merge authority

Không tự merge chỉ vì agent/reviewer PASS.

Merge cần chỉ thị rõ từ người dùng hoặc authority mà project đã xác định.

Nếu project yêu cầu exact-SHA sign-off, freeze SHA đó. Nếu project không yêu cầu explicit exact-SHA UAT cho loại change hiện tại, vẫn phải record candidate đang merge và evidence applicable.

Người dùng có thể explicit override một missing/non-critical gate hoặc chấp nhận known delta. Khi đó:

- ghi rõ override/risk acceptance;
- không giả vờ gate đã PASS;
- không override safety/security blocker không thể được user instruction hợp thức hóa;
- tiếp tục từ checkpoint hợp lệ thay vì restart toàn workflow.

## 2. Freeze candidate

Trước merge:

- đọc current PR/branch metadata;
- verify HEAD/candidate expected;
- verify dependent candidate khi multi-repo;
- inspect relevant dirty/untracked state nếu local workspace;
- không reset/xóa user work mù.

Nếu exact signed-off candidate đã đổi và không có explicit acceptance:

```text
MERGE BLOCKED — ACCEPTED CANDIDATE CHANGED
```

Nếu user explicit accept delta mới, record original accepted state + delta + actual merge state và targeted-verify theo impact khi cần.

## 3. Resolve pre-merge ship gate

Không có một universal command list cho mọi project.

Resolve theo thứ tự:

1. project instructions / project pack;
2. repository-specific ship/release skill;
3. required CI/check configuration;
4. build/test/lint/type/security commands canonical của repository nếu chưa có orchestrator riêng.

Không copy command từ project A sang project B.

Ship gate phải gắn với candidate đang merge khi project policy yêu cầu exact-state evidence.

Các tín hiệu sau không tự thay ship gate:

- `mergeable=true`;
- visual review PASS;
- browser smoke PASS;
- “CI sẽ chạy sau merge”.

Nếu mandatory gate fail:

```text
MERGE BLOCKED — SHIP GATE RED
```

Nếu mandatory gate không thể verify:

```text
MERGE BLOCKED — SHIP GATE NOT VERIFIED
```

trừ khi user/project authority explicit chấp nhận proceed với known missing gate. Khi override, report `OVERRIDDEN / NOT VERIFIED`, không `PASS`.

## 4. Base drift và CI

Nếu target branch tiến lên:

- inspect delta;
- xác định overlap với candidate contract/scope;
- irrelevant drift có thể tiếp tục;
- relevant overlap/conflict cần targeted integration verify.

Không resolve conflict/rebase rồi tự coi acceptance cũ cover code mới.

Required CI fail vì candidate → block trừ explicit accepted override phù hợp policy.

Infrastructure/historical noise phải được phân biệt product failure.

## 5. Dependency-aware merge

Multi-repo/PR merge theo dependency order.

Ví dụ generic:

```text
provider/API dependency
→ verify target contains accepted dependency
→ consumer
```

Ghi:

- PR/candidate;
- accepted delta nếu có;
- ship-gate evidence/override;
- merge method;
- merge/target SHA.

Platform-generated squash/merge commit không tự yêu cầu replay toàn UAT nếu content accepted và không có conflict-resolution behavior change.

## 6. Post-merge integrity

Lightweight check đủ chứng minh:

- target chứa intended change;
- merge không rơi file/commit quan trọng;
- conflict resolution không âm thầm đổi behavior.

Post-merge CI/deploy có phải synchronous closure gate hay operational signal phụ thuộc project policy.

Nếu project không định nghĩa phải chờ post-merge pipeline terminal state, không tự poll vô hạn chỉ để đóng workstream. Nếu có failure cụ thể, mở targeted recovery scope.

## 7. Cleanup classification

Sau merge/integrity, classify:

```text
A. TRANSIENT → delete when safe
B. REUSABLE VERIFICATION INFRASTRUCTURE → keep/promote
C. PRODUCT SOURCE / TEST / FIXTURE → keep
D. FINAL AUDIT / SIGN-OFF EVIDENCE → keep
E. UNKNOWN / OWNERSHIP UNCERTAIN → keep and report
```

Không dùng broad `git clean -fdx`, `git reset --hard`, `rm -rf` thay classification.

Untracked không đồng nghĩa rác.

## 8. Transient residue

Candidate delete khi ownership rõ và workstream không còn cần:

- temp screenshots/diffs/HAR/trace/video;
- generated local report/ZIP;
- debug response dump/log;
- one-off helper không có giá trị reusable;
- generated test/build output không tracked.

`promote-or-delete` helper reusable thay vì giữ scratch vô chủ.

## 9. Evidence cleanup

Dùng installed `evidence-transport` skill.

Giữ final review/audit metadata cần thiết; transient binary có thể expire nếu reproducible.

Không tạo Release/tag chỉ để archive verification evidence.

## 10. Worktree/process/branch cleanup

Trước remove worktree:

- verify không có unique/uncommitted user work;
- verify intended commits reachable từ target;
- stop process riêng của workstream;
- dùng normal worktree removal workflow.

Không kill shared infrastructure.

Feature branch chỉ xóa khi merge xong, không có unique commit/worktree và repository convention cho phép.

## 11. Knowledge sync

Sau finalize, persist durable knowledge qua documentation/knowledge workflow được current project cho phép, nếu có.

Chỉ sync những gì có giá trị xuyên phiên:

- relevant final review/provenance nếu đáng lưu;
- accepted product/business decision mới;
- reusable workflow lesson;
- project-specific rule thay đổi.

Không biến merge fact/live CI state thành business rule. Operational status có thể truy vấn live trừ khi cần historical evidence.

## 12. Anti-loop stop rule

Khi `COMPLETE / MERGED`, không tự mở general review mới chỉ vì còn khả năng kiểm tra thêm.

Reopen khi có material trigger:

- reproducible regression;
- requirement/decision mới;
- candidate/integration change ảnh hưởng acceptance;
- failed required gate/delivery signal cụ thể;
- evidence P0/P1 hoặc acceptance-affecting issue.

Không reopen chỉ vì speculative risk, optional refactor, P3 polish hoặc test improvement không chứng minh defect hiện tại.

## 13. Final report

```text
CANDIDATE
Primary SHA/state:
Dependencies:
Accepted delta/override:

PRE-MERGE
PR HEAD verified:
Base drift:
Required CI:
Ship gate source:
Ship gate result: PASS | FAIL | NOT VERIFIED | OVERRIDDEN
Evidence:

MERGE
PR(s):
Merge method:
Merge/target SHA(s):

POST-MERGE
Integrity:
Post-merge pipeline if relevant:

CLEANUP
Transient removed:
Unknown kept:
Reusable infra/tests kept:
Worktrees/branches/processes:

KNOWLEDGE SYNC
Files changed:
Knowledge destination/state:

FINAL STATUS:
COMPLETE / MERGED | BLOCKED
```

Nguyên tắc:

```text
Resolve the project's actual ship policy.
Freeze what is accepted.
Do not pretend an override is a PASS.
Merge preserves the accepted state.
Cleanup removes the session, not the capability.
Done means stop unless something materially changes.
```
