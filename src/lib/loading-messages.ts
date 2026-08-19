// Casual, lightly-Islamic loading copy — keeps the "sabar dulu" wait feeling
// warm instead of a bare spinner. Picked randomly per mount, not per data
// point, so it doesn't flicker while a request is in flight.
export const LOADING_MESSAGES = [
  "Sabar bro, ikhtiar dulu di balik layar...",
  "Tunggu bentar, lagi jemput data dari server 😄",
  "Proses dulu ya, sambil ngucap bismillah",
  "Malaikat pencatat lagi ngebut, bentar lagi kelar",
  "Ikhtiar itu emang butuh proses, sabar ya akhi/ukhti",
  "Bentar lagi, kayak nunggu azan — sebentar lagi kok",
  "Rezeki nggak akan ketuker, datamu juga nggak. Tunggu ya",
  "Bentar, lagi baca 'Rabbi yassir wa la tu'assir' dulu",
  "Proses berjalan... barakallahu fiikum atas sabarnya",
  "Server lagi usaha maksimal, kayak kita ngejar setoran hafalan",
  "Jangan buru-buru, kayak mau ke masjid pas iqomah aja santai",
  "Sat-set lagi diproses, insyaAllah nggak lama",
  "Lagi loading... anggap aja waktu buat istighfar sebentar",
  "Dikit lagi, sabar itu sebagian dari iman kan?",
  "Proses sat-set kayak wudhu sebelum sholat, nggak lama kok",
  "Bentar ya, lagi disortir tim malaikat kanan-kiri",
] as const

export function randomLoadingMessage() {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
}
