# Next Steps: UI Logging Standardization and Refresh Fixes

## Objectives
- Standardize debug logging with the prefix pattern `ST-NT-<module>` and gate by `settings.debugMode`.
- Ensure status/stats and Tracked Characters refresh reliably after processing and UI actions (minimal status, no progress bar).
- Align current modular UI behavior with legacy flows in archive/working-version.js, without reintroducing the legacy progress bar.

## Scope
- Modules: src/core/debug.js, src/modules/ui.js, src/modules/processing.js, src/modules/characters.js, src/modules/lorebook.js, src/modules/lorebook-debug.js.
- Reference legacy behavior: archive/working-version.js (UI refresh points and status updates).

## Plan
1) Shared logger
- Add or expose a helper in src/core/debug.js that emits `ST-NT-<module>` messages, gated by settings.debugMode.
- Minimize startup noise: avoid unconditional logging before settings load; defer to the gate as early as possible.

2) UI logging standardization
- In src/modules/ui.js, replace ad-hoc console.log tags (e.g., [NT-UI]) with the shared logger using prefix `ST-NT-ui`.
- Add concise debug logs at:
  - Character list render (updateCharacterList): entry, count of characters rendered, and exit.
  - Status display (updateStatusDisplay): entry, key status fields (tracked count, pending/processed counts), and exit.
  - Modal opens (merge, create, purge, prompt editor, character list modal).
  - Settings binds (bindSettingsHandlers) and menu init (initializeMenuButtons/addMenuButton).
- Keep messages short and low frequency; no per-row spam.

3) Status/stats and Tracked Characters refresh fixes
- Ensure processing paths call updateStatusDisplay and updateCharacterList after each analysis batch in src/modules/processing.js.
- Ensure UI actions (merge, ignore, create, purge, import/export) in src/modules/ui.js and src/modules/characters.js trigger these refreshes after state changes.
- Keep status minimal: tracked character count, pending/processed summary; optional last-updated timestamp if already available.

4) Processing-to-UI hooks
- In src/modules/processing.js, standardize batch-boundary logs to `ST-NT-processing` and ensure UI refresh hooks fire in success and failure paths.
- Avoid per-message logging; log only per-batch start/finish and queue events.

5) Characters module logging cleanup
- Remove or gate the hardcoded DEBUG_LOGGING flag in src/modules/characters.js; use the shared logger with prefix `ST-NT-characters` for match/merge highlights only (e.g., chosen match, merge applied, undo merge).
- Keep noisy similarity traces behind the debug gate; avoid emitting every candidate comparison.

6) Lorebook modules consolidation
- Review src/modules/lorebook.js vs. src/modules/lorebook-debug.js; decide on a single maintained module.
- If debug-only utilities are needed, fold them behind a guarded debug helper inside lorebook.js; otherwise remove redundant lorebook-debug.js.
- Align logging to `ST-NT-lorebook` using the shared logger; avoid duplicated logic and double initialization.

7) Legacy vs. production UI alignment
- Legacy (archive/working-version.js): UI updates were tied directly to global state mutations and a monolithic jQuery ready block; status/progress and character refresh were triggered after settings changes, merges/ignores, manual create, and processing. Logging was ad-hoc with [NT-Debug].
- Production (src/modules/ui.js): modular handlers (initializeUIHandlers, bindSettingsHandlers, initializeMenuButtons) plus centralized updateCharacterList and updateStatusDisplay; processing triggers in src/modules/processing.js call UI updates after analysis results.
- Action: mirror any missing refresh triggers from legacy (post-settings change, post-merge/ignore/create/purge) in the current modular handlers; do not reintroduce the progress bar—status stays minimal.

8) Acceptance criteria
- All UI-related logs use the shared helper and prefix `ST-NT-<module>`; no stray [NT-UI] or raw console.log debug noise remains in targeted modules.
- Status/stats and Tracked Characters update immediately after processing batches and after character actions (merge, ignore, create, purge, import/export).
- Logging volume is bounded: no per-row or per-message spam; logs appear at function entry/exit or batch boundaries only when debugMode is true.
- Legacy refresh behaviors that affect correctness are mirrored (refresh after state changes), while legacy progress bar is not reintroduced.
- Lorebook modules are consolidated: either debug utilities folded into lorebook.js under the debug gate, or lorebook-debug.js removed; logging uses `ST-NT-lorebook`.

9) Verification steps
- Toggle debugMode on: confirm prefixed logs appear for UI renders, status updates, and processing batch boundaries.
- Toggle debugMode off: confirm logs are silent (except real errors/warnings) and UI still updates.
- Run processing on a small chat: observe status/stats update and Tracked Characters refresh after batch completion.
- Perform UI actions (merge, ignore, create, purge, import): verify list and status refresh and prefixed debug logs (when debugMode on).
- Run validations and build:
  - node validate-interfaces.js
  - node tests/validate-async-await.js
  - node tests/validate-method-calls.js
  - npm run build
