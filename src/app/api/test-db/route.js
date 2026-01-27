import { connectDB } from '@/backend/db';

export async function GET() {
    try {
        await connectDB();
        return Response.json({
            success: true,
            message: 'Connected to MongoDB Atlas successfully!'
        });
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}