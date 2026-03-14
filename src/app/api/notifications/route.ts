import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/notifications — List notifications for a user
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    let query = db
      .selectFrom("notifications")
      .where("user_id", "=", userId)
      .selectAll();

    if (unreadOnly) {
      query = query.where("read", "=", false);
    }

    const notifications = await query
      .orderBy("created_at", "desc")
      .limit(50)
      .execute();

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// PATCH /api/notifications — Mark as read
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { notificationIds, userId, markAllRead } = body;

    if (markAllRead && userId) {
      await db
        .updateTable("notifications")
        .set({ read: true })
        .where("user_id", "=", userId)
        .where("read", "=", false)
        .execute();
    } else if (notificationIds?.length) {
      await db
        .updateTable("notifications")
        .set({ read: true })
        .where("id", "in", notificationIds)
        .execute();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
