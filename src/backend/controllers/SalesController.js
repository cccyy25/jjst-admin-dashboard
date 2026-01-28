import { connectDB } from '../db';
import { Sales, Staff } from '../Models';
import { toStartOfDayUTC8, toEndOfDayUTC8, toStartOfMonthUTC8, toEndOfMonthUTC8 } from '../utils/timezone';

/**
 * SalesController - handles sales-related operations
 */
export class SalesController {
    async getByBranchAndDate(branch, date = null) {
        await connectDB();
        const query = { branch };

        if (date) {
            // Use UTC+8 timezone for date filtering
            const startOfDay = toStartOfDayUTC8(date);
            const endOfDay = toEndOfDayUTC8(date);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const salesList = await Sales.find(query)
            .populate('responsiblePersons', 'name')
            .sort({ date: -1, createdAt: -1 });
        return { salesList };
    }

    async getById(id) {
        await connectDB();
        const sales = await Sales.findById(id).populate('responsiblePersons', 'name');
        return { sales };
    }

    async create(data) {
        await connectDB();
        // Convert date string to UTC+8 start of day
        if (data.date && typeof data.date === 'string') {
            data.date = toStartOfDayUTC8(data.date);
        }
        const sales = await Sales.create(data);
        const populated = await Sales.findById(sales._id).populate('responsiblePersons', 'name');
        return { sales: populated };
    }

    async update(id, data) {
        await connectDB();
        // Convert date string to UTC+8 start of day
        if (data.date && typeof data.date === 'string') {
            data.date = toStartOfDayUTC8(data.date);
        }
        const sales = await Sales.findByIdAndUpdate(id, data, { new: true })
            .populate('responsiblePersons', 'name');
        return { sales };
    }

    async delete(id) {
        await connectDB();
        const sales = await Sales.findByIdAndDelete(id);
        return { success: !!sales };
    }

    async getMonthlySalesByStaff(year, month, branch = null) {
        await connectDB();

        const startOfMonth = toStartOfMonthUTC8(year, month);
        const endOfMonth = toEndOfMonthUTC8(year, month);

        // Build query - optionally filter by branch
        const query = {
            date: { $gte: startOfMonth, $lte: endOfMonth }
        };
        if (branch) {
            query.branch = branch;
        }

        // Get all sales for the month
        const salesList = await Sales.find(query).populate('responsiblePersons', 'name');

        // Get all staff
        const allStaff = await Staff.find({ isActive: true });

        // Calculate totals
        let totalGolden = 0;
        let totalServiceProduct = 0;
        let totalSurcharge = 0;
        const byPayment = {
            'QR': 0,
            'Cash': 0,
            'Bank Transfer': 0,
            'Credit Card': 0,
        };

        // Calculate staff breakdown
        const staffSales = {};

        // Initialize all staff with zero sales
        allStaff.forEach(staff => {
            staffSales[staff._id.toString()] = {
                staffId: staff._id.toString(),
                staffName: staff.name,
                totalSales: 0,
                goldenSales: 0,
                serviceProductSales: 0,
            };
        });

        // Process each sale
        salesList.forEach(sale => {
            const salesPerPax = sale.salesAmount / sale.responsiblePersons.length;

            // Add to overall totals
            if (sale.type === 'Golden') {
                totalGolden += sale.salesAmount;
            } else {
                totalServiceProduct += sale.salesAmount;
            }

            // Add surcharge to total
            totalSurcharge += sale.surcharge || 0;

            // Add to payment method totals
            if (byPayment[sale.paymentMethod] !== undefined) {
                byPayment[sale.paymentMethod] += sale.salesAmount;
            }

            // Add to each responsible person's total
            sale.responsiblePersons.forEach(person => {
                const staffId = person._id.toString();
                if (!staffSales[staffId]) {
                    staffSales[staffId] = {
                        staffId,
                        staffName: person.name,
                        totalSales: 0,
                        goldenSales: 0,
                        serviceProductSales: 0,
                    };
                }

                staffSales[staffId].totalSales += salesPerPax;
                if (sale.type === 'Golden') {
                    staffSales[staffId].goldenSales += salesPerPax;
                } else {
                    staffSales[staffId].serviceProductSales += salesPerPax;
                }
            });
        });

        // Convert to array and sort by total sales
        const staffSalesArray = Object.values(staffSales)
            .sort((a, b) => b.totalSales - a.totalSales);

        return {
            totalGolden,
            totalServiceProduct,
            totalSales: totalGolden + totalServiceProduct,
            totalSurcharge,
            byPayment,
            staffSales: staffSalesArray,
        };
    }
}

export const salesController = new SalesController();