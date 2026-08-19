export type Chapter = {
  id: number
  nameSimple: string
  nameArabic: string
  translatedName: string
  versesCount: number
}

export type Verse = {
  surahId: number
  surahName: string
  surahNameArabic: string
  ayahNumber: number
  verseKey: string
  arabicText: string
  translation: string
  transliteration: string | null
  audioUrl: string | null
}

export type JuzInfo = {
  juzNumber: number
  startSurahId: number
  startAyahNumber: number
}

export type SearchResult = {
  verseKey: string
  surahId: number
  ayahNumber: number
  arabicText: string
  translationSnippet: string
}

export type PageVerse = {
  verseKey: string
  surahId: number
  ayahNumber: number
  arabicText: string
  isSajdah: boolean
}

export type QuranPage = {
  pageNumber: number
  juzNumber: number
  surahNames: string[]
  verses: PageVerse[]
}
