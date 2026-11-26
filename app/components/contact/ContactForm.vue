<script setup lang="ts">
import { TRADES } from '~~/shared/jobs'

const props = defineProps<{ endpoint: string; email: string; success: string; phone?: string | null }>()

type State = 'idle' | 'sending' | 'success' | 'error'
const state = ref<State>('idle')
const form = reactive({
  name: '', company: '', email: '', phone: '', trades: [] as string[],
  projectType: '', deadline: '', drawingsLink: '', message: '', _gotcha: '',
})
const errors = reactive<Record<string, string>>({})
const emailEl = ref<HTMLElement | null>(null)
const copyLabel = ref('Copy')

const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1)

function validate(): boolean {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!form.email.trim()) errors.email = 'Enter your email so John can reply.'
  else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Enter a valid email address, like name@company.com.'
  if (!form.message.trim()) errors.message = 'Tell John what you need priced.'
  if (form.drawingsLink.trim()) {
    let ok = false
    try { ok = ['http:', 'https:'].includes(new URL(form.drawingsLink.trim()).protocol) } catch { /* not a URL */ }
    if (!ok) errors.drawingsLink = 'Paste a full link starting with https://, from Dropbox, Google Drive or WeTransfer.'
  }
  return Object.keys(errors).length === 0
}

async function submit() {
  if (state.value === 'sending' || !validate()) {
    if (Object.keys(errors).length) await nextTick(() => (document.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus())
    return
  }
  if (!props.endpoint) { state.value = 'error'; return }
  state.value = 'sending'
  try {
    const res = await fetch(props.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...form, trades: [...form.trades] }),
    })
    state.value = res.ok ? 'success' : 'error'
  } catch {
    state.value = 'error'
  }
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.email)
    copyLabel.value = 'Copied'
  } catch {
    const el = emailEl.value
    if (el) {
      const r = document.createRange()
      r.selectNodeContents(el)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(r)
    }
    copyLabel.value = 'Selected'
  }
  setTimeout(() => (copyLabel.value = 'Copy'), 2500)
}

const d = (k: string) => (errors[k] ? `err-${k}` : undefined)
</script>

<template>
  <div class="cf">
    <div class="direct">
      <small>Or email directly</small>
      <div class="row">
        <span ref="emailEl" class="addr">{{ email }}</span>
        <button type="button" class="copy" @click="copy">{{ copyLabel }}</button>
        <span class="sr" aria-live="polite">{{ copyLabel === 'Copy' ? '' : copyLabel === 'Copied' ? 'Email copied' : 'Email selected, press copy shortcut' }}</span>
      </div>
      <div v-if="phone" class="phone"><b>Phone</b> {{ phone }}</div>
    </div>

    <p v-if="state === 'success'" class="ok" role="status" tabindex="-1">{{ success }}</p>

    <form v-else novalidate @submit.prevent="submit">
      <div class="grid">
        <div class="f">
          <label for="f-name">Name <i>required</i></label>
          <input id="f-name" v-model="form.name" name="name" autocomplete="name" :aria-invalid="!!errors.name" :aria-describedby="d('name')" />
          <p v-if="errors.name" id="err-name" class="err">{{ errors.name }}</p>
        </div>
        <div class="f">
          <label for="f-company">Company</label>
          <input id="f-company" v-model="form.company" name="company" autocomplete="organization" />
        </div>
        <div class="f">
          <label for="f-email">Email <i>required</i></label>
          <input id="f-email" v-model="form.email" name="email" type="email" autocomplete="email" :aria-invalid="!!errors.email" :aria-describedby="d('email')" />
          <p v-if="errors.email" id="err-email" class="err">{{ errors.email }}</p>
        </div>
        <div class="f">
          <label for="f-phone">Phone</label>
          <input id="f-phone" v-model="form.phone" name="phone" type="tel" autocomplete="tel" />
        </div>
      </div>

      <fieldset class="f">
        <legend>Trades needed</legend>
        <div class="checks">
          <label v-for="t in TRADES" :key="t" class="chk">
            <input v-model="form.trades" type="checkbox" name="trades" :value="t" />{{ cap(t) }}
          </label>
        </div>
      </fieldset>

      <div class="grid">
        <div class="f">
          <label for="f-type">Project type</label>
          <input id="f-type" v-model="form.projectType" name="projectType" list="project-types" placeholder="Fit-out, new build or refurbishment" />
          <datalist id="project-types"><option value="Fit-out" /><option value="New build" /><option value="Refurbishment" /></datalist>
        </div>
        <div class="f">
          <label for="f-deadline">Deadline</label>
          <input id="f-deadline" v-model="form.deadline" name="deadline" placeholder="e.g. tender closes 12 Dec" />
        </div>
      </div>

      <div class="f">
        <label for="f-link">Link to drawings</label>
        <input id="f-link" v-model="form.drawingsLink" name="drawingsLink" type="url" inputmode="url" placeholder="https://" :aria-invalid="!!errors.drawingsLink" :aria-describedby="d('drawingsLink')" />
        <p v-if="errors.drawingsLink" id="err-drawingsLink" class="err">{{ errors.drawingsLink }}</p>
        <p class="hint">Dropbox, Google Drive or WeTransfer. Drawing sets are too large to attach here.</p>
      </div>

      <div class="f">
        <label for="f-msg">Message <i>required</i></label>
        <textarea id="f-msg" v-model="form.message" name="message" rows="5" :aria-invalid="!!errors.message" :aria-describedby="d('message')" />
        <p v-if="errors.message" id="err-message" class="err">{{ errors.message }}</p>
      </div>

      <div class="hp" aria-hidden="true">
        <label>Leave this empty <input v-model="form._gotcha" name="_gotcha" tabindex="-1" autocomplete="off" /></label>
      </div>

      <p v-if="state === 'error'" class="fail" role="alert">
        That didn't send. Please email John directly at <b>{{ email }}</b> and attach or link your drawings.
      </p>

      <button type="submit" class="send" :disabled="state === 'sending'">{{ state === 'sending' ? 'Sending…' : 'Send →' }}</button>
    </form>
  </div>
</template>

<style scoped>
.cf { max-width: 880px; }
.direct { border-top: 1px solid var(--ink); border-bottom: 1px solid var(--line); padding: 22px 0; margin-bottom: 6vh; }
small { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--mute); }
.row { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px 20px; margin-top: 10px; }
.addr { font-size: clamp(20px, 3vw, 34px); font-weight: 300; letter-spacing: -.02em; overflow-wrap: anywhere; user-select: all; }
.copy { font: inherit; font-size: 13px; background: none; border: 0; border-bottom: 1px solid var(--ink); padding: 2px 0; cursor: pointer; color: var(--ink); }
.copy:hover { color: var(--accent); border-color: var(--accent); }
.phone { margin-top: 12px; font-size: 14px; }
.phone b { font-weight: 400; color: var(--mute); margin-right: 8px; }
.sr, .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 4vw; }
.f { border: 0; padding: 0; margin: 0 0 30px; min-width: 0; }
label, legend { display: block; font-size: 13px; color: var(--mute); margin-bottom: 6px; padding: 0; }
label i { font-style: normal; font-size: 11px; margin-left: 6px; color: var(--accent); }
input:not([type='checkbox']), textarea {
  width: 100%; font: inherit; font-size: 20px; font-weight: 300; color: var(--ink);
  background: transparent; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; padding: 8px 0; outline: none;
}
textarea { resize: vertical; }
input:not([type='checkbox']):focus, textarea:focus { border-bottom-color: var(--ink); box-shadow: 0 1px 0 var(--ink); }
[aria-invalid='true'] { border-bottom-color: var(--accent) !important; }
.checks { display: flex; flex-wrap: wrap; gap: 10px 28px; }
.chk { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 16px; color: var(--ink); cursor: pointer; }
.chk input { width: 18px; height: 18px; accent-color: var(--accent); margin: 0; }
.err { color: var(--accent); font-size: 13px; margin: 6px 0 0; font-weight: 400; }
.hint { color: var(--mute); font-size: 12px; margin: 6px 0 0; }
.fail { border-top: 1px solid var(--accent); padding-top: 14px; font-size: 15px; line-height: 1.5; margin: 0 0 24px; overflow-wrap: anywhere; }
.fail b { font-weight: 500; }
.send {
  font: inherit; font-size: clamp(28px, 4vw, 52px); font-weight: 200; letter-spacing: -.04em;
  background: none; border: 0; border-bottom: 3px solid var(--accent); padding: 0 0 6px; color: var(--ink); cursor: pointer;
}
.send:hover:not(:disabled), .send:focus-visible { color: var(--accent); }
.send:disabled { color: var(--mute); border-color: var(--line); cursor: default; }
.ok { font-size: clamp(28px, 4vw, 56px); font-weight: 200; letter-spacing: -.04em; line-height: 1.05; margin: 0; }
.ok:focus { outline: none; }
@media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }
</style>
