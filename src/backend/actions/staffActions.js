'use server';

import { staffController } from '../controllers';

export async function getStaffList() {
    const result = await staffController.getAll();
    return { staffList: JSON.parse(JSON.stringify(result.staffList)) };
}

export async function getStaff(id) {
    const result = await staffController.getById(id);
    return { staff: JSON.parse(JSON.stringify(result.staff)) };
}

export async function createStaff(data) {
    const result = await staffController.create(data);
    return { staff: JSON.parse(JSON.stringify(result.staff)) };
}

export async function updateStaff(id, data) {
    const result = await staffController.update(id, data);
    return { staff: JSON.parse(JSON.stringify(result.staff)) };
}

export async function deleteStaff(id) {
    return staffController.delete(id);
}