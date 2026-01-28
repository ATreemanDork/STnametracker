import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSettings,
  cloneAndApplyPreset,
  runRawCompletion
} from './extension.js';

const makeCtx = () => {
  const saved = {};
  return {
    extensionSettings: saved,
    saveSettingsDebounced: vi.fn(),
    chatMetadata: {},
    libs: {
      lodash: {
        structuredClone: (v) => JSON.parse(JSON.stringify(v))
      }
    },
    popup: vi.fn(),
    getPresetManager: () => ({
      getActivePreset: () => ({
        name: 'Default',
        response_tokens: 128,
        temperature: 0.8,
        top_p: 0.95,
        min_p: 0.1,
        model: 'model-default'
      }),
      setPreset: vi.fn()
    }),
    generateRaw: vi.fn(async (params) => ({ text: `echo: ${params.prompt}` }))
  };
};

describe('RawGen & Preset Demo', () => {
  beforeEach(() => {
    global.SillyTavern = { getContext: makeCtx };
  });

  it('initializes settings with defaults and saves debounced', () => {
    const ctx = SillyTavern.getContext();
    const settings = getSettings();
    expect(settings.response_tokens).toBe(256);
    expect(ctx.saveSettingsDebounced).toHaveBeenCalled();
  });

  it('clones active preset and applies overrides', async () => {
    const ctx = SillyTavern.getContext();
    const preset = await cloneAndApplyPreset({ temperature: 0.5 });
    expect(preset.temperature).toBe(0.5);
    expect(preset.response_tokens).toBe(256); // from defaults
    expect(ctx.getPresetManager().setPreset).toHaveBeenCalledWith(preset);
  });

  it('runs raw completion with explicit params', async () => {
    const ctx = SillyTavern.getContext();
    const result = await runRawCompletion({ prompt: 'test' });
    expect(ctx.generateRaw).toHaveBeenCalled();
    const call = ctx.generateRaw.mock.calls[0][0];
    expect(call.prompt).toBe('test');
    expect(call.response_tokens).toBe(256);
    expect(result.text).toContain('echo: test');
  });
});