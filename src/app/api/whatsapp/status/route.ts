import { NextResponse } from "next/server";
import { whatsAppEvolutionService } from "@/lib/whatsapp-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await whatsAppEvolutionService.checkConnectionState();
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        state: "refused",
        error: error?.message || "Failed to query Evolution API",
      },
      { status: 500 }
    );
  }
}
