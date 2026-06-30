import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  generateVerificationToken,
} from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/email";
import { checkRateLimit, AUTH_RATE_LIMIT } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = checkRateLimit(`register:${ip}`, AUTH_RATE_LIMIT);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error?.issues?.[0]?.message 
        ?? parsed.error?.message 
        ?? "Validation failed";
      return NextResponse.json(
        { success: false, error: firstIssue },
        { status: 400 }
      );
    }

    const { name, email, username, password, role } = parsed.data;

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Check if username exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: "This username is already taken" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const emailVerifyToken = generateVerificationToken();
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username: slugify(username),
        password: hashedPassword,
        role: role === "CONTRIBUTOR" ? "CONTRIBUTOR" : "USER",
        emailVerifyToken,
        emailVerifyExpires,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
      },
    });

    // Create contributor profile if role is CONTRIBUTOR
    if (role === "CONTRIBUTOR") {
      await prisma.contributorProfile.create({
        data: { userId: user.id },
      });
    }

    // Send verification email (non-blocking)
    sendVerificationEmail(email, name, emailVerifyToken).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
