# evidence-transport

## Mục đích

Dùng cùng các verification workflow khi coding agent cần đưa screenshot, diff, trace, report hoặc artifact khác lên reviewer-accessible location mà reviewer không truy cập được máy local.

Mục tiêu là giữ evidence reviewable nhưng không biến source history, release namespace hoặc tag namespace thành kho artifact tạm.

## 1. Nghĩa mặc định của artifact

Trong CoMind verification workflow, `artifact` mặc định là:

1. PR/CI workflow artifact có retention; hoặc
2. một temporary artifact mechanism reviewer truy cập được.

`artifact` không mặc định là GitHub Release.

## 2. Không dùng Release/tag chỉ để vận chuyển evidence

Không tự tạo chỉ để chứa verification evidence:

- GitHub Release/prerelease;
- Git tag;
- permanent binary/source commit chứa screenshot/diff/trace/report tạm.

Release/tag namespace dành cho product release/versioning hoặc yêu cầu explicit.

## 3. Transport priority

```text
1. Living PR/review comment attachment/embed
   ↓
2. PR/CI workflow artifact có retention
   ↓
3. Reviewer-accessible temporary mechanism khác
```

Living review location nên giữ current truth: candidate SHA, verdict, intentional delta và artifact link.

Không tạo một comment/release/tag mới theo từng iteration nếu living evidence location hiện tại có thể update/thay thế.

## 4. Local working evidence

Working evidence nên ở gitignored path như `.tmp-verify/`, `.playwright-mcp/` hoặc project-equivalent.

Không commit binary iterations vào product branch chỉ vì local file không accessible.

Text asset reproducible lâu dài như deterministic scenario/config/final report có thể được giữ ở đúng verification/tooling location khi thực sự reusable.

## 5. Nếu lỡ tạo evidence-only Release/tag

```text
migrate evidence
→ update living review location
→ verify reviewer access
→ delete evidence-only Release
→ delete evidence-only tag
```

Không xóa evidence duy nhất trước replacement. Nếu capability cleanup/transport thiếu, report `BLOCKED` và giữ evidence tạm.

## 6. Final evidence

Sau final candidate/sign-off:

- giữ exact candidate SHA, reference/config, intentional deltas và verdict khi có giá trị audit;
- raw screenshot/diff/trace có thể expire nếu deterministic/reproducible theo policy;
- không tạo Release chỉ để giữ parity evidence.

Nguyên tắc:

```text
Review evidence belongs to the review workflow.
Product releases belong to the release workflow.
Do not mix the two namespaces.
```
