import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PDF_MIME = "application/pdf";
const IMAGE_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/heic",
  "image/heif",
]);

function inferMimeType(file: File): string | null {
  const lowerName = file.name.toLowerCase();

  if (file.type === PDF_MIME || lowerName.endsWith(".pdf")) {
    return PDF_MIME;
  }

  if (file.type === DOCX_MIME || lowerName.endsWith(".docx")) {
    return DOCX_MIME;
  }

  if (IMAGE_MIMES.has(file.type)) {
    return file.type;
  }

  if (lowerName.endsWith(".png")) {
    return "image/png";
  }

  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (lowerName.endsWith(".webp")) {
    return "image/webp";
  }

  if (lowerName.endsWith(".heic")) {
    return "image/heic";
  }

  if (lowerName.endsWith(".heif")) {
    return "image/heif";
  }

  return null;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const uploaded = formData.get("file");

  if (!(uploaded instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Upload a PDF, DOCX, or resume image." },
      { status: 400 },
    );
  }

  if (uploaded.size <= 0 || uploaded.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "File must be between 1 byte and 8 MB." },
      { status: 400 },
    );
  }

  const mimeType = inferMimeType(uploaded);
  if (!mimeType) {
    return NextResponse.json(
      { ok: false, error: "Supported formats: PDF, DOCX, PNG, JPG, JPEG, WEBP, HEIC." },
      { status: 400 },
    );
  }

  const bytes = await uploaded.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const prompt = [
    "You are a resume parser for ATS evaluation and OCR.",
    "Extract all resume text from the uploaded document or image.",
    "Return plain text only.",
    "Preserve section headings when possible (Experience, Projects, Skills, Education).",
    "Do not add commentary.",
  ].join("\n");

  const response = await getGeminiModel().generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: base64,
            },
          },
        ],
      },
    ],
  });

  const extractedText = response.response.text().trim();

  if (!extractedText) {
    return NextResponse.json(
      { ok: false, error: "Unable to extract text from this file." },
      { status: 422 },
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      fileName: uploaded.name,
      extractedText,
    },
  });
}