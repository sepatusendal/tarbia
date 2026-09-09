import "server-only"

// quran.com's own "Transliteration" resource (used elsewhere in this
// module for translations) is the English/academic romanization —
// e.g. "Bismi Allahi arrahmani arraheem" — not what an Indonesian reader
// expects. equran.id serves the Kemenag-convention Indonesian
// transliteration instead (e.g. "Bismillāhir-raḥmānir-raḥīm"), which is
// what every Indonesian mushaf app actually uses.
const EQURAN_BASE_URL = "https://equran.id/api/v2"

type EquranSurahResponse = {
  data: {
    ayat: { nomorAyat: number; teksLatin: string }[]
  }
}

async function fetchSurahLatinMap(surahId: number): Promise<Map<number, string>> {
  const res = await fetch(`${EQURAN_BASE_URL}/surat/${surahId}`, {
    next: { revalidate: 60 * 60 * 24 * 30 }, // transliteration text never changes
  })
  if (!res.ok) {
    throw new Error(`equran.id error ${res.status} for surah ${surahId}`)
  }
  const data: EquranSurahResponse = await res.json()
  return new Map(data.data.ayat.map((a) => [a.nomorAyat, a.teksLatin.trim()]))
}

// Indonesian transliteration for every ayah in a surah, keyed by ayah
// number. Falls back to an empty map (rather than throwing) so a hiccup
// on equran.id's side degrades to "no Latin line" instead of a crashed
// page — the Arabic and translation still come from quran.com either way.
export async function getSurahLatinMap(surahId: number): Promise<Map<number, string>> {
  try {
    return await fetchSurahLatinMap(surahId)
  } catch {
    return new Map()
  }
}

export async function getVerseLatin(surahId: number, ayahNumber: number): Promise<string | null> {
  const map = await getSurahLatinMap(surahId)
  return map.get(ayahNumber) ?? null
}
