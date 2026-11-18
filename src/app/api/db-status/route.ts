import { NextResponse } from "next/server";
import { getDatabaseProviderInfo, readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [info, db] = await Promise.all([
      getDatabaseProviderInfo(),
      readDb(),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: info,
      metrics: {
        productsCount: db.products.length,
        availableProducts: db.products.filter((p) => !p.isSold).length,
        soldProducts: db.products.filter((p) => p.isSold).length,
        storesCount: db.stores.length,
        ordersCount: db.orders.length,
        offersCount: Object.keys(db.offers || {}).length,
        auditLogsCount: db.auditLogs.length,
      },
      instructions: !info.isConfigured
        ? "Para conectar o banco permanente gratuito Supabase, adicione NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env.local ou nas Environment Variables da Vercel."
        : "Banco permanente Supabase ativo. Dados persistem indefinidamente mesmo após novos deploys ou reinicialização de servidores serverless.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Erro ao obter status do banco de dados",
      },
      { status: 500 }
    );
  }
}
