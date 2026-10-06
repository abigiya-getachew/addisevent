export function GET() {
  return Response.json(
    { error: "API route is not implemented yet" },
    { status: 501 },
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ route?: string[] }> },
) {
  const { route } = await params;
  if (route?.join("/") !== "v1/auth/register") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:5000";

  try {
    const upstream = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    });

    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to reach the account API:", error);
    return Response.json(
      { error: "Account service is unavailable. Please try again." },
      { status: 502 },
    );
  }
}