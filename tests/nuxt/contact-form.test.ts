import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ContactForm from '~/components/contact/ContactForm.vue'

const email = 'john@example.com'
const props = { endpoint: 'https://formspree.io/f/abc', email, success: 'Thanks — John will reply within one working day.' }

afterEach(() => vi.unstubAllGlobals())

async function fill(w: Awaited<ReturnType<typeof mountSuspended>>, vals: Record<string, string>) {
  for (const [k, v] of Object.entries(vals)) await w.find(`[name="${k}"]`).setValue(v)
}
const ok = { name: 'Sam', email: 'sam@build.com', message: 'Please price plastering.' }

describe('ContactForm', () => {
  it('blocks submit without required fields', async () => {
    const f = vi.fn(); vi.stubGlobal('fetch', f)
    const w = await mountSuspended(ContactForm, { props })
    await w.find('form').trigger('submit')
    expect(f).not.toHaveBeenCalled()
    expect(w.findAll('.err')).toHaveLength(3)
    expect(w.find('[name="name"]').attributes('aria-describedby')).toBe('err-name')
    expect(w.find('[name="name"]').attributes('aria-invalid')).toBe('true')
  })
  it('rejects a non-URL drawings link', async () => {
    const f = vi.fn(); vi.stubGlobal('fetch', f)
    const w = await mountSuspended(ContactForm, { props })
    await fill(w, { ...ok, drawingsLink: 'dropbox' })
    await w.find('form').trigger('submit')
    expect(f).not.toHaveBeenCalled()
    expect(w.find('#err-drawingsLink').exists()).toBe(true)
  })
  it('posts JSON and shows success', async () => {
    const f = vi.fn().mockResolvedValue({ ok: true }); vi.stubGlobal('fetch', f)
    const w = await mountSuspended(ContactForm, { props })
    await fill(w, { ...ok, drawingsLink: 'https://dropbox.com/x' })
    await w.findAll('input[type="checkbox"]')[0]!.setValue(true)
    await w.find('form').trigger('submit')
    await vi.waitFor(() => expect(w.text()).toContain(props.success))
    expect(f).toHaveBeenCalledTimes(1)
    const [url, init] = f.mock.calls[0]!
    expect(url).toBe(props.endpoint)
    const body = JSON.parse(init.body)
    expect(body.email).toBe('sam@build.com')
    expect(body.trades).toEqual(['plastering'])
    expect(body).toHaveProperty('_gotcha')
  })
  it('shows the email fallback on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const w = await mountSuspended(ContactForm, { props })
    await fill(w, ok)
    await w.find('form').trigger('submit')
    await vi.waitFor(() => expect(w.find('[role="alert"]').text()).toContain(email))
  })
  it('does not post when the endpoint is empty and shows the fallback', async () => {
    const f = vi.fn(); vi.stubGlobal('fetch', f)
    const w = await mountSuspended(ContactForm, { props: { ...props, endpoint: '' } })
    await fill(w, ok)
    await w.find('form').trigger('submit')
    await vi.waitFor(() => expect(w.find('[role="alert"]').text()).toContain(email))
    expect(f).not.toHaveBeenCalled()
  })
  it('copies the email and shows feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = await mountSuspended(ContactForm, { props })
    await w.find('button.copy').trigger('click')
    await vi.waitFor(() => expect(w.find('button.copy').text()).toBe('Copied'))
    expect(writeText).toHaveBeenCalledWith(email)
  })
  it('falls back to selecting the text on a clipboard rejection', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('no')) } })
    const w = await mountSuspended(ContactForm, { props })
    await w.find('button.copy').trigger('click')
    await vi.waitFor(() => expect(w.find('button.copy').text()).toBe('Selected'))
  })
  it('renders the phone row only when given', async () => {
    const w = await mountSuspended(ContactForm, { props })
    expect(w.text()).not.toMatch(/Phone number/i)
    const w2 = await mountSuspended(ContactForm, { props: { ...props, phone: '+61 400 000 000' } })
    expect(w2.text()).toContain('+61 400 000 000')
  })
})
