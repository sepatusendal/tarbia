import "server-only"

import type { Chapter, JuzInfo, SearchResult, Verse } from "@/types/quran"

const BASE_URL = "https://api.quran.com/api/v4"

// Indonesian Islamic Affairs Ministry (Kemenag) translation, and the
// "Transliteration" resource — both are served through the same
// translations param.
const TRANSLATION_ID = 33
const TRANSLITERATION_ID = 57
const DEFAULT_RECITER_ID = 7 // Mishari Al-Afasy

// The Kemenag translation embeds footnote markers as raw HTML
// (`<sup foot_note=...>1</sup>`) — strip the whole footnote (tag *and*
// its content), then any other stray tags, since we render plain text.
function stripHtml(text: string) {
  return text
    .replace(/<sup[^>]*>.*?<\/sup>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim()
}

async function questApi<T>(path: string, revalidateSeconds: number): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: revalidateSeconds },
  })
  if (!res.ok) {
    throw new Error(`Quran API error ${res.status} for ${path}`)
  }
  return res.json()
}

type ChaptersResponse = {
  chapters: {
    id: number
    name_simple: string
    name_arabic: string
    verses_count: number
    translated_name: { name: string }
  }[]
}

export async function getChapters(): Promise<Chapter[]> {
  const data = await questApi<ChaptersResponse>(
    "/chapters?language=id",
    60 * 60 * 24 * 7 // chapter list never changes — cache a week
  )
  return data.chapters.map((c) => ({
    id: c.id,
    nameSimple: c.name_simple,
    nameArabic: c.name_arabic,
    translatedName: c.translated_name.name,
    versesCount: c.verses_count,
  }))
}

type JuzsResponse = {
  juzs: {
    juz_number: number
    verse_mapping: Record<string, string>
  }[]
}

export async function getJuzList(): Promise<JuzInfo[]> {
  const data = await questApi<JuzsResponse>(
    "/juzs",
    60 * 60 * 24 * 30 // juz boundaries are fixed and never change
  )

  const seen = new Set<number>()
  const juzs: JuzInfo[] = []

  for (const j of data.juzs) {
    if (seen.has(j.juz_number)) continue
    seen.add(j.juz_number)

    const chapterIds = Object.keys(j.verse_mapping).map(Number).sort((a, b) => a - b)
    const startSurahId = chapterIds[0]
    const range = j.verse_mapping[String(startSurahId)]
    const startAyahNumber = Number(range.split("-")[0])

    juzs.push({ juzNumber: j.juz_number, startSurahId, startAyahNumber })
  }

  return juzs.sort((a, b) => a.juzNumber - b.juzNumber)
}

async function getChapterName(surahId: number): Promise<{ simple: string; arabic: string }> {
  const chapters = await getChapters()
  const chapter = chapters.find((c) => c.id === surahId)
  return { simple: chapter?.nameSimple ?? `Surah ${surahId}`, arabic: chapter?.nameArabic ?? "" }
}

type VerseByKeyResponse = {
  verse: {
    verse_key: string
    verse_number: number
    text_uthmani: string
    translations: { resource_id: number; text: string }[]
  }
}

export async function getVerseByKey(verseKey: string): Promise<Verse> {
  const [surahIdStr, ayahStr] = verseKey.split(":")
  const surahId = Number(surahIdStr)
  const ayahNumber = Number(ayahStr)

  const [data, name, audio] = await Promise.all([
    questApi<VerseByKeyResponse>(
      `/verses/by_key/${verseKey}?translations=${TRANSLATION_ID},${TRANSLITERATION_ID}&fields=text_uthmani`,
      60 * 60 * 24
    ),
    getChapterName(surahId),
    getChapterAudioUrl(surahId).catch(() => null),
  ])

  const translationRaw = data.verse.translations.find(
    (t) => t.resource_id === TRANSLATION_ID
  )?.text
  const transliterationRaw = data.verse.translations.find(
    (t) => t.resource_id === TRANSLITERATION_ID
  )?.text

  const translation = translationRaw ? stripHtml(translationRaw) : ""
  const transliteration = transliterationRaw ? stripHtml(transliterationRaw) : null

  return {
    surahId,
    surahName: name.simple,
    surahNameArabic: name.arabic,
    ayahNumber,
    verseKey: data.verse.verse_key,
    arabicText: data.verse.text_uthmani,
    translation,
    transliteration,
    audioUrl: audio,
  }
}

type ChapterAudioResponse = {
  audio_file: { audio_url: string }
}

export async function getChapterAudioUrl(surahId: number): Promise<string | null> {
  try {
    const data = await questApi<ChapterAudioResponse>(
      `/chapter_recitations/${DEFAULT_RECITER_ID}/${surahId}`,
      60 * 60 * 24 * 7
    )
    return data.audio_file.audio_url
  } catch {
    return null
  }
}

// Deterministic "verse of the day" — same for everyone, changes once per
// day, no server-side scheduling needed. Cycles through a curated pool of
// well-known short verses so the daily pick is always meaningful rather
// than a random obscure fragment.
const DAILY_VERSE_POOL = [
  "94:6", // Indeed, with hardship comes ease
  "2:286", // Allah does not burden a soul beyond what it can bear
  "3:159", // consultation and gentleness
  "13:28", // hearts find rest in remembrance of Allah
  "16:97", // good deeds and good life
  "17:23", // honoring parents
  "20:114", // "my Lord, increase me in knowledge"
  "39:53", // do not despair of Allah's mercy
  "49:13", // mutual acquaintance among people
  "58:11", // Allah raises those who have knowledge
  "65:3", // whoever relies on Allah, He is sufficient for him
  "94:5", // hardship and ease (pair verse)
  "103:1", // by time, mankind is in loss except...
]

export async function getDailyVerse(): Promise<Verse> {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  )
  const key = DAILY_VERSE_POOL[dayOfYear % DAILY_VERSE_POOL.length]
  return getVerseByKey(key)
}

type SearchApiResponse = {
  search: {
    results: {
      verse_key: string
      text: string
      translations: { text: string }[]
    }[]
  }
}

export async function searchQuran(query: string, size = 10): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const data = await questApi<SearchApiResponse>(
    `/search?q=${encodeURIComponent(query)}&size=${size}&language=id`,
    60 * 60
  )

  return data.search.results.map((r) => {
    const [surahIdStr, ayahStr] = r.verse_key.split(":")
    return {
      verseKey: r.verse_key,
      surahId: Number(surahIdStr),
      ayahNumber: Number(ayahStr),
      arabicText: r.text,
      translationSnippet: r.translations[0]?.text ? stripHtml(r.translations[0].text) : "",
    }
  })
}
