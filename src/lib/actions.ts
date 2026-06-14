"use server";

/**
 * @module actions
 * @description Server-side actions for persisting carbon footprint records,
 * retrieving dashboard data, and fetching the community leaderboard.
 *
 * All actions authenticate the caller via NextAuth session before
 * performing any database operations. Input is validated using
 * Zod schemas from {@link module:validators}.
 */

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { footprintSchema, type FootprintInput } from "@/lib/validators";
import { computeCarbonScore, BADGE_DEFINITIONS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Shared result type
// ---------------------------------------------------------------------------

/** Discriminated union representing a success or failure outcome. */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Retrieves the authenticated user's ID from the current session.
 *
 * @throws {Error} If no valid session or user ID is found.
 * @returns The authenticated user's ID string.
 */
async function getSessionUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

// ---------------------------------------------------------------------------
// Save Footprint
// ---------------------------------------------------------------------------

/**
 * Persists a carbon footprint record for the authenticated user and
 * recalculates their eco score.
 *
 * @param inputData - Raw footprint data to validate and save.
 * @returns A result containing the new record ID on success.
 */
export async function saveFootprint(
  inputData: FootprintInput
): Promise<ActionResult<{ recordId: string }>> {
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

    // Recalculate user eco score based on latest emissions
    const newScore = computeCarbonScore(data.total);

    await prisma.user.update({
      where: { id: userId },
      data: { carbonScore: newScore },
    });

    // Auto-award badges based on milestones
    await awardBadges(userId);

    revalidatePath("/dashboard");
    revalidatePath("/community");

    return { success: true, data: { recordId: record.id } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save footprint";
    console.error("Error saving footprint:", error);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Dashboard Data
// ---------------------------------------------------------------------------

/**
 * Fetches the authenticated user's complete dashboard data including
 * footprint history, goals, and badges.
 *
 * @returns The user record with related data, or an error message.
 */
export async function getDashboardData(): Promise<
  ActionResult<{
    id: string;
    name: string | null;
    email: string | null;
    carbonScore: number;
    footprints: Array<{
      id: string;
      transport: number;
      energy: number;
      food: number;
      lifestyle: number;
      total: number;
      date: Date;
    }>;
    goals: Array<{
      id: string;
      title: string;
      targetValue: number;
      currentVal: number;
      deadline: Date;
      isCompleted: boolean;
      createdAt: Date;
    }>;
    badges: Array<{
      id: string;
      name: string;
      icon: string;
      awardedAt: Date;
    }>;
  }>
> {
  try {
    const userId = await getSessionUserId();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        footprints: {
          orderBy: { date: "asc" },
        },
        goals: {
          orderBy: { createdAt: "desc" },
        },
        badges: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, data: user };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch data";
    console.error("Error fetching dashboard data:", error);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Community Leaderboard
// ---------------------------------------------------------------------------

/**
 * Retrieves the top 10 users ranked by their carbon eco score
 * for the community leaderboard.
 *
 * @returns An array of user summaries sorted by score descending.
 */
export async function getCommunityLeaderboard(): Promise<
  ActionResult<Array<{ id: string; name: string | null; carbonScore: number }>>
> {
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
    const message =
      error instanceof Error ? error.message : "Failed to fetch leaderboard";
    console.error("Error fetching leaderboard:", error);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Badge Awarding
// ---------------------------------------------------------------------------

/**
 * Checks the user's milestones and awards any badges they have
 * earned but not yet received.
 *
 * @param userId - The user to check and potentially award badges.
 */
async function awardBadges(userId: string): Promise<void> {
  try {
    const [footprintCount, existingBadges] = await Promise.all([
      prisma.footprintRecord.count({ where: { userId } }),
      prisma.badge.findMany({
        where: { userId },
        select: { name: true },
      }),
    ]);

    const existingNames = new Set(existingBadges.map((b) => b.name));

    const newBadges = BADGE_DEFINITIONS.filter(
      (badge) => badge.condition(footprintCount) && !existingNames.has(badge.name)
    );

    if (newBadges.length > 0) {
      await prisma.badge.createMany({
        data: newBadges.map((badge) => ({
          userId,
          name: badge.name,
          icon: badge.icon,
        })),
      });
    }
  } catch (error) {
    // Badge awarding is non-critical — log but don't fail the parent action
    console.error("Error awarding badges:", error);
  }
}
