import { NextResponse } from "next/server";
import {
  getRefreshToken,
  deleteSession,
  clearAuthCookies,
} from "@/lib/auth";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      // Delete the session from database
      await deleteSession(refreshToken);
    }

    // Clear cookies regardless
    await clearAuthCookies();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear cookies even if there's an error
    await clearAuthCookies();
    return NextResponse.json({
      success: true,
      message: "Logged out",
    });
  }
}
