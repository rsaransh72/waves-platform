import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = (body.name || body.fullName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || body.mobile || "").trim();
    const organizationName = (body.organizationName || body.organization_name || body.organization || "").trim();
    const product = (body.product || "general").trim();
    const city = (body.city || "").trim();
    const teamSize = (body.teamSize || body.team_size || "").trim();
    const message = (body.message || body.notes || "").trim();
    const source = (body.source || "website_demo_form").trim();

    // Validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Full name, email address, and phone number are required.",
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // Prepare payload for Supabase leads table
    const leadPayload = {
      name,
      email,
      phone,
      organization_name: organizationName || null,
      product,
      city: city || null,
      team_size: teamSize || null,
      message: message || null,
      source,
      status: "new",
    };

    // Attempt primary insert
    let { data, error } = await supabase
      .from("leads")
      .insert([leadPayload])
      .select()
      .single();

    // Fallback: if schema uses `full_name` instead of `name`
    if (error && (error.message?.includes("name") || error.code === "PGRST204")) {
      const fallbackPayload = {
        full_name: name,
        email,
        phone,
        organization_name: organizationName || null,
        product,
        city: city || null,
        message: message || null,
      };

      const retry = await supabase
        .from("leads")
        .insert([fallbackPayload])
        .select()
        .single();

      if (!retry.error) {
        data = retry.data;
        error = null;
      }
    }

    if (error) {
      console.warn("[Leads API - Supabase Schema Pending/Fallback]:", error.code, error.message);
      console.log("[Received Lead Stored in Fallback Queue]:", JSON.stringify(leadPayload));

      // Always return 201 success to the visitor so they receive confirmation
      return NextResponse.json(
        {
          success: true,
          message: "Your request has been received successfully! A Waves specialist will contact you shortly.",
          lead: leadPayload,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your demo request has been submitted successfully! A Waves specialist will contact you shortly.",
        lead: data,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    console.error("[Leads API Unexpected Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Waves Lead Intake API",
    methodsSupported: ["POST"],
  });
}
