# UPA - HUB 🕌 (a.k.a. TARBIA, a.k.a. "the app that finally makes liqo stop being chaos incarnate")

Yo, behold. **TARBIA** exists because somebody — probably the treasurer, bless their poor soul — got tired of tracking cash flow through a Notes app that mysteriously self-destructs every time they switch phones. RIP to the kas records of 2023, we hardly knew ye. This is your one-stop shop for schedules, attendance, cash, study materials, and members. Basically the entire liqo bureaucracy, digitized, so nobody ever has to scream **"SIAPA YANG PEGANG KAS?!"** into the group chat at 11PM ever again.

> **TL;DR:** A Next.js app that stops your liqo group from collapsing into spreadsheet anarchy, voice-note chaos, and passive-aggressive "gpp kok santai aja" replies about missing money.

---

## 🧠 What Even Is This Thing

A liqo/UPA management platform where:

- 📅 **Schedule** gets organized (with real officer assignments, so "siapa MC minggu ini" stops being a weekly identity crisis nobody wants to claim)
- ✅ **Attendance** gets logged (no more "lah kan gue udah dateng" gaslighting when the notulen's records clearly beg to differ)
- 💰 **Cash/Treasury** gets tracked (rest in peace, treasurer's personal notes app that only made sense to him, and honestly not even to him anymore)
- 📚 **Materials** get uploaded (PDFs now live in Supabase instead of six different WhatsApp chats, each one replying "cek grup sebelah" when you ask where the file went)
- 👥 **Members** get managed with actual roles, like a legit organization and not a group project where one guy quietly does everything while everyone else reacts with 👍

**Stack:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, Prisma + Supabase (Postgres & Storage), NextAuth (login with phone number + password — because nobody's memorizing an email just for this, we're not that fancy of an org).

---

## ⚙️ Setup (a.k.a. The Sacred Ritual You Must Perform Before Touching This App)

### 1. Make a Supabase project (free, alhamdulillah)

1. Sign up and spin up a new project at [supabase.com](https://supabase.com). Yes, it's free. No, there's no catch. Probably. 👀
2. Go to **Project Settings → Database → Connection string → URI**, copy that connection string (use the _direct connection_, port 5432 — get the port wrong and your app will ghost you harder than your gebetan).
3. Go to **Project Settings → API**, grab your `Project URL`, `anon public` key, and `service_role` key. Guard these like they're the actual physical kas box, because in spirit, they kind of are.
4. Go to **Storage**, create a bucket called `materi`, flip **Public bucket** to ON. Skip this and your PDFs go full introvert mode — technically exist, refuse to be seen by anyone, very mysterious.

### 2. Fill in the environment variables

Copy `.env.example` to `.env`, then fill it out like a responsible adult (an act you will perform maybe twice a year, statistically):

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
NEXTAUTH_SECRET="..."   # generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

⚠️ **Do NOT commit this file.** Kalau sampe kecommit, itu namanya bukan open source, itu namanya sedekah jariyah ke seluruh internet. Very generous of you. Extremely bad idea.

### 3. Install, migrate, seed

```bash
npm install
npm run db:migrate   # spins up the tables in the database
npm run db:seed      # summons your very first admin account into existence
```

Default seed login: phone `081234567890`, password `admin123`.
**Change this password immediately.** `admin123` is basically the "assalamualaikum" of weak passwords — every script kiddie on Earth already knows it by heart, they don't even need to guess, wkwk.

Want it custom instead? Set `SEED_ADMIN_PHONE` / `SEED_ADMIN_PASSWORD` before running `npm run db:seed`.

### 4. Run it, bro

```bash
npm run dev
```

Open `http://localhost:3000`, log in with your freshly seeded admin account, and start adding members via the **Members** menu. Selamat, you're admin now — a title that comes with great power and an even greater tanggung jawab over the kas balance. Semoga amanah.

---

## 🗂️ Module Structure

| Module         | What It Does                                                                                               | Vibe                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Dashboard**  | Summary of the next meeting, assigned officers, cash balance, latest attendance                            | The "biar gausah nanya di grup lagi" tab                             |
| **Schedule**   | CRUD for liqo schedules + officer assignments (MC, Speaker, Notetaker, Documentation, Snacks) — Admin only | The "siapa yang kena giliran minggu ini" wheel, but civilized        |
| **Attendance** | Log attendance per meeting; members can view their own history                                             | No more "I'm 90% sure I checked in" cosmic uncertainty               |
| **Cash**       | Log income/expenses; every role can view balance & history                                                 | Transparency, not vibes-based accounting                             |
| **Materials**  | Upload PDFs to Supabase Storage, link videos, add summaries per meeting                                    | Goodbye to files swallowed whole by WhatsApp's storage limit tyranny |
| **Members**    | Manage member data & roles — Admin only                                                                    | The HR department nobody asked for but everybody secretly needed     |

---

## 🔐 Access Levels

| Role                   | Access                                                                | Basically                                                                  |
| ---------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Admin**              | Everything: schedules, officers, members, cash, attendance, materials | The final boss, the one Whose Wi-Fi password everyone needs                |
| **Officer (Pengurus)** | Enter cash entries, attendance, materials                             | Middle management, doing the actual heavy lifting while Admin "supervises" |
| **Member**             | View schedule, materials, cash, and their own attendance              | Just here to show up, absen, and vibe                                      |

---

## 🛠️ Dev Notes (for future me, who will 100% forget all of this by next week, insyaAllah)

- Shipped with a `.claude/` config in the repo, so yes, this thing was partially vibe-coded with some AI assistance. Zero shame here — even Ustadz pakai kalkulator kok. We move.
- Prisma + Supabase means: if the schema suddenly explodes, run `npm run db:migrate` first before spiraling into a full rage-quit and questioning your career choices.
- If auth randomly breaks, there's a 90% chance it's `NEXTAUTH_SECRET` or `NEXTAUTH_URL` being salah somewhere. It's always the env vars. It is ALWAYS the env vars. Tato ini di lengan kalau perlu.

---

## 🤲 Closing Statement

May this app bring barokah to your liqo, may your cash balance forever stay `> 0`, and may nobody ever again post "siapa yang pegang absen minggu lalu" in the group chat only to be met with three days of silence and a single 🙏 reaction from someone who clearly did not read the message.

Built with 🕌, way too much ☕, sedikit drama Prisma migration, and enough existential dread to fuel at least two more side projects.
