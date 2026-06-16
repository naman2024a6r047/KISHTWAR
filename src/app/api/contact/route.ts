import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { sendContactNotificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message, recipientId, recipientType } = parsed.data;

    // Create the message in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        recipientId: recipientId || null,
        recipientType,
      },
    });

    // Send notification email to admin/recipient
    const adminEmail = process.env.SMTP_USER || "admin@kishtwar.gov.in";
    
    // If recipient is a contributor, we can fetch their email
    let recipientEmail = adminEmail;
    if (recipientType === "CONTRIBUTOR" && recipientId) {
      const recipientUser = await prisma.user.findUnique({
        where: { id: recipientId },
        select: { email: true },
      });
      if (recipientUser) {
        recipientEmail = recipientUser.email;
      }
    }

    // Trigger email send in background
    sendContactNotificationEmail(
      recipientEmail,
      name,
      email,
      subject || "New inquiry from Kishtwar Tourism",
      message
    ).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully. Our team will get back to you shortly.",
      data: contactMessage,
    });
  } catch (error) {
    console.error("Contact form API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
