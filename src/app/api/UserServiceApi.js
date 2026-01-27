import { userController } from '@/backend/controllers';

export class UserServiceApi {
    static async getAllUsers() {
        console.log("intializing");
        const res = await userController.getAll();
        console.log("gjeijgfe")
        if (!res.ok) {
            throw new Error("Failed to fetch users");
        }

        return res.json();
    }
}