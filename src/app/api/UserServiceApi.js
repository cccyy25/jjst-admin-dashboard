import { userController } from '@/backend/controllers';

// GET /api/users
export async function GET() {
    const result = await userController.getAll();
    return Response.json(result);
}

// POST /api/users
export async function POST(request) {
    const data = await request.json();
    const result = await userController.create(request, data);
    return Response.json(result, { status: 201 });
}
