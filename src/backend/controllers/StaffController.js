import { connectDB } from '../db';
import { Staff } from '../Models';

/**
 * StaffController - handles staff-related operations
 */
export class StaffController {
    async getAll() {
        await connectDB();
        const staffList = await Staff.find({}).sort({ createdAt: -1 });
        return { staffList };
    }

    async getById(id) {
        await connectDB();
        const staff = await Staff.findById(id);
        return { staff };
    }

    async create(data) {
        await connectDB();
        const staff = await Staff.create(data);
        return { staff };
    }

    async update(id, data) {
        await connectDB();
        const staff = await Staff.findByIdAndUpdate(id, data, { new: true });
        return { staff };
    }

    async delete(id) {
        await connectDB();
        await Staff.findByIdAndDelete(id);
        return { success: true };
    }
}

export const staffController = new StaffController();