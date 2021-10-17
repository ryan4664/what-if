import { PrismaClient, User } from "@prisma/client";

export class UserService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public getUser = async (args): Promise<User> => {
    const { userId } = args;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user == null) {
      throw new Error("User not found");
    }

    return user;
  };

  public create = async (): Promise<User> => {
    return await this.prisma.user.create({
      data: {
        timeShards: 100,
      },
    });
  };
}
