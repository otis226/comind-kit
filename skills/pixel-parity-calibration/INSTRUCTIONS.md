# pixel-parity-calibration

## Mục đích

Dùng cùng `skills/design-parity.md` khi Structural Visual đã PASS nhưng Pixel Visual vẫn FAIL và residual mismatch có dấu hiệu đến từ intentional delta, fixture/data, deterministic clock hoặc capture/render noise thay vì product visual defect.

Skill này không thay Structural Visual. Nó giúp quyết định residual nào phải sửa product và residual nào phải normalize verification.

## 1. Exact product state

Acceptance evidence phải gắn với product state truy xuất được.

Nếu browser render committed SHA + dirty WIP, screenshot dùng diagnose nhưng không được carry thành PASS của committed SHA.

Trước acceptance:

1. commit các hunk đã được chứng minh; hoặc
2. bỏ có chủ đích hunk thử nghiệm không cần rồi recapture.

Không reset/xóa dirty worktree mù.

## 2. Residual classes

### A — Product visual defect

Layout/hierarchy/action/spacing/wrapping thật sự sai authority.

```text
fix product → targeted verify → commit → recapture
```

### B — Intentional product/design delta

Capability/product decision được chấp nhận nhưng exact reference không có.

- document delta;
- split stable comparable region khi cần;
- exclusion/mask phải tối thiểu, deterministic, predeclared;
- không mask Class A.

### C — Fixture/cardinality/literal-data mismatch

Normalize deterministic data shape; không sửa CSS chỉ để match dataset.

### D — Clock/state-derived text

Freeze time/state hoặc seed semantic-equivalent fixture; không sửa business calculation chỉ để match snapshot.

### E — Capture/render noise

Normalize crop, shared chrome, focus, motion, font/render variance trước khi đổi threshold.

## 3. Calibration sequence

```text
confirm exact clean candidate
→ classify A/B/C/D/E
→ eliminate A bằng product fix
→ normalize C/D/E
→ predeclare B
→ recapture
→ evaluate threshold
```

Không dùng mismatch ratio cũ sau khi product/fixture/crop thay đổi.

## 4. Sub-crop / exclusion

Chỉ hợp lệ khi:

- whole surface Structural PASS;
- excluded area là documented B hoặc non-owned E;
- không chứa known A;
- config deterministic/reviewer-accessible;
- report nói rõ exclude gì và vì sao;
- semantic/interaction/business concern vẫn cover product-owned area bị exclude.

## 5. Threshold

Threshold chỉ có ý nghĩa sau calibration trên comparable deterministic evidence.

Không tăng threshold chỉ vì current surface đang fail.

Recalibration cần:

- Structural PASS;
- Class A = NONE;
- C/D/E normalized hợp lý;
- B documented/split đúng;
- repeated known-good captures chứng minh baseline noise.

## 6. Handoff

```text
Candidate:
Working tree clean: YES|NO
Structural Visual: PASS
Pixel Visual:
Residual classes A/B/C/D/E:
Product fixes:
Fixture/clock/capture normalization:
Intentional exclusions/sub-crops:
Threshold/calibration:
Evidence:
```

Nếu working tree dirty, không claim evidence chứng minh PR HEAD.

Đây là reusable verification policy, không phải business/design rule của project cụ thể.
