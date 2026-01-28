'use server';

import { salesController } from '../controllers';
import { staffController } from '../controllers';

export async function getSalesByBranch(branch, date = null) {
    const result = await salesController.getByBranchAndDate(branch, date);
    return { salesList: JSON.parse(JSON.stringify(result.salesList)) };
}

export async function getSales(id) {
    const result = await salesController.getById(id);
    return { sales: JSON.parse(JSON.stringify(result.sales)) };
}

export async function createSales(data) {
    const result = await salesController.create(data);
    return { sales: JSON.parse(JSON.stringify(result.sales)) };
}

export async function updateSales(id, data) {
    const result = await salesController.update(id, data);
    return { sales: JSON.parse(JSON.stringify(result.sales)) };
}

export async function deleteSales(id) {
    const result = await salesController.delete(id);
    return { success: result.success };
}

export async function getActiveStaff() {
    const result = await staffController.getAll();
    const activeStaff = result.staffList.filter(s => s.isActive);
    return { staffList: JSON.parse(JSON.stringify(activeStaff)) };
}

export async function getMonthlySales(year, month, branch = null) {
    const result = await salesController.getMonthlySalesByStaff(year, month, branch);
    return JSON.parse(JSON.stringify(result));
}