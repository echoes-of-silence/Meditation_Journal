import { useRef, useState } from 'react'
import { useSessions } from '../hooks/useEntries'
import { db } from '../db/database'
import { Card } from '../components/common/Card'
import { exportBackup, exportCSV, exportJSON, exportPDF, parseBackup } from '../utils/export'

export function Settings() {
  const sessions = useSessions()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleRestore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const restored = parseBackup(text)
      if (!confirm(`Import ${restored.length} session(s)? Existing sessions with the same ID will be overwritten.`)) {
        return
      }
      await db.sessions.bulkPut(restored)
      setMessage(`Successfully restored ${restored.length} session(s).`)
    } catch {
      setMessage('Could not read that backup file. Please check the file and try again.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleClearAll() {
    if (!confirm('This will permanently delete ALL meditation sessions from this device. This cannot be undone. Continue?')) {
      return
    }
    await db.sessions.clear()
    setMessage('All journal data has been cleared from this device.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-700">Settings &amp; Data</h2>
        <p className="text-ink-400 text-sm">Everything below stays on this device. Nothing is ever uploaded.</p>
      </div>

      {message && (
        <div className="rounded-xl bg-dawn-100 text-dawn-500 px-4 py-3 text-sm">{message}</div>
      )}

      <Card title="Export Journal" subtitle={`${sessions.length} session(s) recorded`}>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportJSON(sessions)}
            className="px-4 py-2 rounded-xl border border-ink-200 text-ink-600 hover:bg-ink-100/60 text-sm"
          >
            Export as JSON
          </button>
          <button
            onClick={() => exportCSV(sessions)}
            className="px-4 py-2 rounded-xl border border-ink-200 text-ink-600 hover:bg-ink-100/60 text-sm"
          >
            Export as CSV
          </button>
          <button
            onClick={() => exportPDF(sessions)}
            className="px-4 py-2 rounded-xl border border-ink-200 text-ink-600 hover:bg-ink-100/60 text-sm"
          >
            Export as PDF
          </button>
        </div>
      </Card>

      <Card title="Backup &amp; Restore" subtitle="Save a full backup file, or restore from a previous one">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportBackup(sessions)}
            className="px-4 py-2 rounded-xl bg-dawn-500 text-white hover:opacity-90 text-sm font-medium"
          >
            Download Backup
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl border border-ink-200 text-ink-600 hover:bg-ink-100/60 text-sm"
          >
            Restore from Backup
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleRestore} />
        </div>
      </Card>

      <Card title="Danger Zone" subtitle="Irreversible actions">
        <button
          onClick={handleClearAll}
          className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm"
        >
          Clear All Journal Data
        </button>
      </Card>

      <Card title="About Privacy" subtitle="How your data is handled">
        <p className="text-sm text-ink-500 leading-relaxed">
          Sahaja Journal stores every session entirely in your browser's local storage (IndexedDB) on this
          device. There is no server, no account, and no analytics — your meditation experiences, chakra
          notes, and personal reflections never leave your device unless you explicitly export or back them
          up yourself.
        </p>
      </Card>
    </div>
  )
}
