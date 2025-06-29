// Simple API endpoint to check if the server is reachable
export function GET() {
  return Response.json({ status: 'ok', message: 'Server is reachable' });
}