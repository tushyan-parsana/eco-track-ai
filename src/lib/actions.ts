"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getSessionUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

import { z } from "zod";

const footprintSchema = z.object({
  transport: z.number().min(0),
  energy: z.number().min(0),
  food: z.number().min(0),
  lifestyle: z.number().min(0),
  total: z.number().min(0),
});

export async function saveFootprint(inputData: {
  transport: number;
  energy: number;
  food: number;
  lifestyle: number;
  total: number;
}) {
  try {
    const data = footprintSchema.parse(inputData);
    const userId = await getSessionUserId();

    const record = await prisma.footprintRecord.create({
      data: {
        userId,
        transport: data.transport,
        energy: data.energy,
        food: data.food,
        lifestyle: data.lifestyle,
        total: data.total,
      },
    });

    // Update user's carbon score (inverse to their total emissions, simple calculation for demo)
    // For example, base 100 minus (total / 100). Minimum 0.
    const scoreDeduction = Math.min(100, Math.round(data.total / 100));
    const newScore = Math.max(0, 100 - scoreDeduction);

    await prisma.user.update({
      where: { id: userId },
      data: { carbonScore: newScore },
    });

    revalidatePath("/dashboard");
    revalidatePath("/community");
    
    return { success: true, recordId: record.id };
  } catch (error) {
    console.error("Error saving footprint:", error);
    return { success: false, error: "Failed to save footprint" };
  }
}

export async function getDashboardData() {
  try {
    const userId = await getSessionUserId();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        footprints: {
          orderBy: { date: "asc" },
        },
        goals: true,
        badges: true,
      },
    });

    if (!user) throw new Error("User not found");

    return { success: true, data: user };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function getCommunityLeaderboard() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { carbonScore: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        carbonScore: true,
      },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { success: false, error: "Failed to fetch leaderboard" };
  }
}
