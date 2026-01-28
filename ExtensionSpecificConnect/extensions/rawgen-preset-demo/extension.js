const EXT_KEY = 'rawgen-preset-demo';

function getSettings() {
  const ctx = SillyTavern.getContext();
  const defaults = {
    presetName: 'RawGen Demo Preset',
    response_tokens: 256,
    temperature: 0.7,
    top_p: 0.9,
    min_p: 0.05,
    model: null // null = keep current model
  };
  const settings = ctx.extensionSettings[EXT_KEY] || {};
  const merged = Object.assign({}, defaults, settings);
  ctx.extensionSettings[EXT_KEY] = merged;
  ctx.saveSettingsDebounced();
  return merged;
}

async function cloneAndApplyPreset(overrides = {}) {
  const ctx = SillyTavern.getContext();
  const pm = ctx.getPresetManager?.();
  if (!pm) throw new Error('Preset manager not available');
  const active = pm.getActivePreset?.();
  if (!active) throw new Error('No active preset to clone');

  const preset = ctx.libs?.lodash?.structuredClone
    ? ctx.libs.lodash.structuredClone(active)
    : JSON.parse(JSON.stringify(active));

  const settings = getSettings();
  preset.name = settings.presetName;
  if (settings.model) preset.model = settings.model;
  preset.response_tokens = overrides.response_tokens ?? settings.response_tokens;
  preset.temperature = overrides.temperature ?? settings.temperature;
  preset.top_p = overrides.top_p ?? settings.top_p;
  preset.min_p = overrides.min_p ?? settings.min_p;

  // Apply via manager (adjust to your API: setPreset / setActivePreset / writePresetExtensionField)
  if (pm.setPreset) pm.setPreset(preset);
  else if (pm.setActivePreset) pm.setActivePreset(preset);
  else throw new Error('Preset manager cannot apply preset');

  return preset;
}

async function runRawCompletion({ prompt }) {
  const ctx = SillyTavern.getContext();
  const settings = getSettings();
  if (!ctx.generateRaw) throw new Error('generateRaw not available');

  const params = {
    prompt,
    response_tokens: settings.response_tokens,
    temperature: settings.temperature,
    top_p: settings.top_p,
    min_p: settings.min_p,
    stop: [],
    // include model override if set:
    ...(settings.model ? { model: settings.model } : {})
  };

  try {
    const result = await ctx.generateRaw(params);
    return result;
  } catch (err) {
    console.error('[RawGen Demo] raw generation failed', err);
    ctx.popup?.(`Raw generation failed: ${err.message || err}`);
    throw err;
  }
}

function addUI() {
  const button = document.createElement('button');
  button.textContent = 'RawGen Demo: Clone Preset + Run';
  button.classList.add('menu_button');
  button.style.marginLeft = '8px';
  button.addEventListener('click', async () => {
    try {
      const preset = await cloneAndApplyPreset();
      const completion = await runRawCompletion({
        prompt: 'Say hello from RawGen demo.'
      });
      SillyTavern.getContext().popup?.(
        `Preset "${preset.name}" applied. Completion: ${completion?.text || '(no text)'}`
      );
    } catch (e) {
      // popup already shown; still log
      console.error(e);
    }
  });
  document.querySelector('#menu_bar')?.appendChild(button);
}

async function onAppInitialized() {
  getSettings();
  addUI();
}

if (window && window.addEventListener) {
  window.addEventListener('APP_INITIALIZED', onAppInitialized, { once: true });
}

export { getSettings, cloneAndApplyPreset, runRawCompletion, onAppInitialized };