import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth-helpers"
import { getSaldoKas } from "@/lib/queries"
import { formatRupiah, formatTanggalPendek } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { TransactionDialog } from "./transaction-dialog"
import { DeleteTransactionButton } from "./delete-transaction-button"

export default async function KasPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  const user = await requireUser()
  const { new: openNew } = await searchParams
  const canManage = user.role === "ADMIN" || user.role === "PENGURUS"

  const [saldo, transactions] = await Promise.all([
    getSaldoKas(),
    prisma.transaction.findMany({
      orderBy: { tanggal: "desc" },
      include: { recordedBy: { select: { nama: true } } },
    }),
  ])

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kas</h1>
          <p className="text-muted-foreground">
            Pemasukan & pengeluaran, transparan buat semua.
          </p>
        </div>
        {canManage && <TransactionDialog defaultOpen={openNew === "1"} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            Saldo Saat Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            <AnimatedCounter value={saldo} prefix="Rp " />
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Riwayat Transaksi
        </h2>
        <div className="grid gap-2">
          {transactions.length === 0 && (
            <p className="text-muted-foreground py-6 text-center">
              Belum ada transaksi.
            </p>
          )}
          {transactions.map((tx) => (
            <Card key={tx.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {tx.type === "PEMASUKAN" ? (
                    <ArrowUpCircle className="size-5 text-primary" />
                  ) : (
                    <ArrowDownCircle className="size-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium">{tx.kategori}</p>
                    <p className="text-muted-foreground text-sm">
                      {formatTanggalPendek(tx.tanggal)} &middot; oleh{" "}
                      {tx.recordedBy.nama}
                      {tx.keterangan ? ` · ${tx.keterangan}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <p
                    className={
                      tx.type === "PEMASUKAN"
                        ? "font-medium text-primary"
                        : "font-medium text-destructive"
                    }
                  >
                    {tx.type === "PEMASUKAN" ? "+" : "-"}
                    {formatRupiah(tx.jumlah)}
                  </p>
                  {canManage && (
                    <DeleteTransactionButton transactionId={tx.id} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
