export function GET() {
  return Response.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
    },
    { status: 200 }
  );
}
