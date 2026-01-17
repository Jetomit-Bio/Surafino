import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "No file uploaded" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const isVideo = file.type.startsWith("video/");
  const folder = isVideo ? "videos" : "images";

  const uploadDir = path.join(
    process.cwd(),
    "public/uploads",
    folder
  );

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const safeName = file.name.replace(/\s+/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const filepath = path.join(uploadDir, filename);

  fs.writeFileSync(filepath, buffer);

  return NextResponse.json({
    url: `/uploads/${folder}/${filename}`,
    type: isVideo ? "video" : "image",
  });
}
