export async function uploadImage(base64: string, fileName: string) {
  const key = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!key) throw new Error("IMAGEKIT_PRIVATE_KEY is missing");

  const body = new FormData();
  body.append("file", base64);
  body.append("fileName", fileName);
  body.append("folder", "/workouts");

  const response = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      body,
      headers: { Authorization: `Basic ${btoa(`${key}:`)}` },
      method: "POST",
    },
  );
  if (!response.ok) throw new Error("Image upload failed");

  return ((await response.json()) as { url: string }).url;
}
