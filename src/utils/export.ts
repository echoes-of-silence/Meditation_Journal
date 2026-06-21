import Papa from 'papaparse'
import { jsPDF } from 'jspdf'
import type { ChakraId, Channel, MeditationSession } from '../types'
import { CHAKRA_BY_ID, STATE_LABELS } from '../data/chakraInfo'
import { formatDateTime } from './dateHelpers'

function download(filename: string, content: string | Blob, mime = 'application/octet-stream') {
  const blob = typeof content === 'string' ? new Blob([content], { type: mime }) : content
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportJSON(sessions: MeditationSession[]) {
  const content = JSON.stringify(sessions, null, 2)
  download(`sahaja-journal-export-${Date.now()}.json`, content, 'application/json')
}

const CHANNELS: Channel[] = ['left', 'central', 'right']

export function exportCSV(sessions: MeditationSession[]) {
  const chakraIds = Object.keys(CHAKRA_BY_ID) as ChakraId[]
  const rows = sessions.map((s) => {
    const row: Record<string, string | number> = {
      id: s.id,
      date: s.date,
      durationMinutes: s.durationMinutes,
      depth: s.depth,
      experience: s.notes.experience,
      insights: s.notes.insights,
      sensations: s.notes.sensations,
      dreams: s.notes.dreams,
    }
    for (const chakraId of chakraIds) {
      for (const channel of CHANNELS) {
        const reading = s.chakras[chakraId][channel]
        row[`${chakraId}_${channel}_state`] = STATE_LABELS[reading.state]
        row[`${chakraId}_${channel}_intensity`] = reading.intensity ?? ''
      }
    }
    return row
  })
  const csv = Papa.unparse(rows)
  download(`sahaja-journal-export-${Date.now()}.csv`, csv, 'text/csv')
}

export function exportPDF(sessions: MeditationSession[]) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const marginX = 40
  let y = 50
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - marginX * 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Sahaja Yoga Meditation Journal', marginX, y)
  y += 30

  const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  for (const s of sorted) {
    if (y > pageHeight - 120) {
      doc.addPage()
      y = 50
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(formatDateTime(s.date), marginX, y)
    y += 18

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Duration: ${s.durationMinutes} min  |  Thoughtless Awareness Depth: ${s.depth}/5`, marginX, y)
    y += 18

    const catches: string[] = []
    ;(Object.keys(CHAKRA_BY_ID) as ChakraId[]).forEach((chakraId) => {
      CHANNELS.forEach((channel) => {
        const state = s.chakras[chakraId][channel].state
        if (state !== 'cool_clear' && state !== 'balanced') {
          catches.push(`${CHAKRA_BY_ID[chakraId].name} (${channel})`)
        }
      })
    })
    if (catches.length > 0) {
      const text = doc.splitTextToSize(`Catches noted: ${catches.join(', ')}`, maxWidth)
      doc.text(text, marginX, y)
      y += text.length * 14 + 4
    }

    const noteFields: [string, string][] = [
      ['Experience', s.notes.experience],
      ['Insights', s.notes.insights],
      ['Sensations', s.notes.sensations],
      ['Dreams / Synchronicities', s.notes.dreams],
    ]
    for (const [label, value] of noteFields) {
      if (!value) continue
      if (y > pageHeight - 80) {
        doc.addPage()
        y = 50
      }
      doc.setFont('helvetica', 'bold')
      doc.text(`${label}:`, marginX, y)
      y += 14
      doc.setFont('helvetica', 'normal')
      const text = doc.splitTextToSize(value, maxWidth)
      doc.text(text, marginX, y)
      y += text.length * 14 + 4
    }

    y += 14
    doc.setDrawColor(220)
    doc.line(marginX, y - 8, pageWidth - marginX, y - 8)
  }

  doc.save(`sahaja-journal-export-${Date.now()}.pdf`)
}

export interface BackupFile {
  version: 1
  exportedAt: string
  sessions: MeditationSession[]
}

export function exportBackup(sessions: MeditationSession[]) {
  const backup: BackupFile = { version: 1, exportedAt: new Date().toISOString(), sessions }
  download(`sahaja-journal-backup-${Date.now()}.json`, JSON.stringify(backup, null, 2), 'application/json')
}

export function parseBackup(text: string): MeditationSession[] {
  const parsed = JSON.parse(text)
  if (Array.isArray(parsed)) return parsed as MeditationSession[]
  if (parsed && Array.isArray(parsed.sessions)) return parsed.sessions as MeditationSession[]
  throw new Error('Unrecognized backup file format.')
}
