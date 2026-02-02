import { NextRequest, NextResponse } from "next/server";
import { slidesStore } from "@/lib/stores";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("📥 Webhook received from Manus");
    console.log("📦 Body keys:", Object.keys(body));
    
    const { taskId, slides, userName } = body;
    
    if (!taskId) {
      console.error("❌ Webhook: Missing taskId");
      return NextResponse.json({ error: "taskId manquant" }, { status: 400 });
    }
    
    if (!slides || !Array.isArray(slides)) {
      console.error("❌ Webhook: Invalid slides format");
      return NextResponse.json({ error: "Format slides invalide" }, { status: 400 });
    }
    
    console.log(`✅ Webhook: Received ${slides.length} slides for task ${taskId}`);
    
    // Find the slide data by manusTaskId
    let found = false;
    for (const [id, data] of slidesStore.entries()) {
      if (data.manusTaskId === taskId) {
        data.slides = slides;
        data.status = 'completed';
        slidesStore.set(id, data);
        found = true;
        console.log(`✅ Updated slides for ID ${id}`);
        break;
      }
    }
    
    if (!found) {
      // Store with taskId as key if original not found
      console.log(`⚠️ Original task not found, storing with taskId: ${taskId}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Received ${slides.length} slides`,
      taskId 
    });
    
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Erreur webhook" },
      { status: 500 }
    );
  }
}

// Allow GET for testing
export async function GET() {
  return NextResponse.json({ 
    status: "Webhook endpoint ready",
    usage: "POST with { taskId, slides: [...] }"
  });
}
