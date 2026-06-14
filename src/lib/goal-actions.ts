"use server";

/**
 * @module goal-actions
 * @description Server actions for creating, updating, and deleting
 * user sustainability goals. All mutations require authentication.
 */

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { goalSchema, type GoalInput } from "@/lib/validators";
import type { ActionResult } from "@/lib/actions";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Retrieves the authenticated user's ID from the current session.
 *
 * @throws {Error} If no valid session or user ID is found.
 */
async function getSessionUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

// ---------------------------------------------------------------------------
// Create Goal
// ---------------------------------------------------------------------------

/**
 * Creates a new sustainability goal for the authenticated user.
 *
 * @param input - Goal data to validate and persist.
 * @returns The created goal's ID on success.
 */
export async function createGoal(
  input: GoalInput
): Promise<ActionResult<{ goalId: string }>> {
  try {
    const data = goalSchema.parse(input);
    const userId = await getSessionUserId();

    const goal = await prisma.goal.create({
      data: {
        userId,
        title: data.title,
        targetValue: data.targetValue,
        deadline: new Date(data.deadline),
      },
    });

    revalidatePath("/dashboard/goals");
    return { success: true, data: { goalId: goal.id } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create goal";
    console.error("Error creating goal:", error);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Update Goal Progress
// ---------------------------------------------------------------------------

/**
 * Updates the current progress value of an existing goal.
 * Automatically marks the goal as completed when progress reaches the target.
 *
 * @param goalId - The goal to update.
 * @param currentVal - The new progress value.
 */
export async function updateGoalProgress(
  goalId: string,
  currentVal: number
): Promise<ActionResult<{ updated: boolean }>> {
  try {
    const userId = await getSessionUserId();

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      return { success: false, error: "Goal not found" };
    }

    const isCompleted = currentVal >= goal.targetValue;

    await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentVal,
        isCompleted,
      },
    });

    revalidatePath("/dashboard/goals");
    return { success: true, data: { updated: true } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update goal";
    console.error("Error updating goal:", error);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Delete Goal
// ---------------------------------------------------------------------------

/**
 * Permanently deletes a goal belonging to the authenticated user.
 *
 * @param goalId - The goal to delete.
 */
export async function deleteGoal(
  goalId: string
): Promise<ActionResult<{ deleted: boolean }>> {
  try {
    const userId = await getSessionUserId();

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      return { success: false, error: "Goal not found" };
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });

    revalidatePath("/dashboard/goals");
    return { success: true, data: { deleted: true } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete goal";
    console.error("Error deleting goal:", error);
    return { success: false, error: message };
  }
}
