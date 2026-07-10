import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  createSession,
  deleteSession,
  isSecureRequest,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const refreshTokenValue = request.cookies.get("refresh_token")?.value;

    if (!refreshTokenValue) {
      return NextResponse.json(
        { success: false, error: "No refresh token provided" },
        { status: 401 }
      );
    }

    // Verify the refresh token
    const payload = await verifyToken(refreshTokenValue);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Check if session exists in database
    const session = await prisma.session.findUnique({
      where: { refreshToken: refreshTokenValue },
    });

    if (!session || session.expiresAt < new Date()) {
      // Delete expired session if it exists
      if (session) {
        await deleteSession(refreshTokenValue);
      }
      return NextResponse.json(
        { success: false, error: "Session expired. Please login again." },
        { status: 401 }
      );
    }

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        username: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      await deleteSession(refreshTokenValue);
      return NextResponse.json(
        { success: false, error: "Account not found or suspended" },
        { status: 401 }
      );
    }

    // Rotate tokens (invalidate old, create new)
    await deleteSession(refreshTokenValue);

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    const newAccessToken = await generateAccessToken(tokenPayload);
    const newRefreshToken = await generateRefreshToken(tokenPayload);

    // Create new session
    await createSession(user.id, newRefreshToken);

    // Build response and set cookies directly on it
    const secure = isSecureRequest(request);
    const response = NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
    });

    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
