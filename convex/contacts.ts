import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

// Type for group summary returned in contacts
type ContactGroup = {
  id: Id<"groups">;
  name: string;
  description?: string;
  memberCount: number;
  type: "group";
};

type ContactUser = {
  id: Id<"users">;
  name: string;
  email: string;
  imageUrl?: string;
  type: "user";
};

type UserDoc = Doc<"users">;

// GET ALL CONTACTS
export const getAllContacts = query({
  args: {},
  handler: async (
    ctx
  ): Promise<{
    users: {
      id: Id<"users">;
      name: string;
      email: string;
      imageUrl?: string;
      type: "user";
    }[];
    groups: {
      id: Id<"groups">;
      name: string;
      description?: string;
      memberCount: number;
      type: "group";
    }[];
  }> => {
    const currentUser: Doc<"users"> | null = await ctx.runQuery(
      api.users.current
    );
    if (!currentUser) throw new Error("Unauthorized");

    const expensesYouPaid = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_group", (q) =>
        q.eq("paidByUserId", currentUser._id).eq("groupId", undefined)
      )
      .collect();

    const expensesNotPaidByYou = await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", undefined))
      .collect();

    const filteredExpenses = expensesNotPaidByYou.filter(
      (e) =>
        e.paidByUserId !== currentUser._id &&
        e.splits.some((s) => s.userId === currentUser._id)
    );

    const personalExpenses = [...expensesYouPaid, ...filteredExpenses];

    const contactsIds = new Set<Id<"users">>();
    for (const exp of personalExpenses) {
      if (exp.paidByUserId !== currentUser._id) {
        contactsIds.add(exp.paidByUserId as Id<"users">);
      }
      for (const split of exp.splits) {
        if (split.userId !== currentUser._id) {
          contactsIds.add(split.userId as Id<"users">);
        }
      }
    }

    const contactUsers = (
      await Promise.all(
        [...contactsIds].map(async (id) => {
          const user = await ctx.db.get(id);
          if (!user || "members" in user) return null;
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            type: "user" as const,
          };
        })
      )
    ).filter((u): u is NonNullable<typeof u> => u !== null);

    const groups = await ctx.db.query("groups").collect();

    const userGroups = groups
      .filter((g) => g.members.some((m) => m.userId === currentUser._id))
      .map((g) => ({
        id: g._id,
        name: g.name,
        description: g.description,
        memberCount: g.members.length,
        type: "group" as const,
      }));

    return {
      users: contactUsers,
      groups: userGroups,
    };
  },
});

// CREATE GROUP
export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    members: v.array(v.id("users")),
  },
  handler: async (ctx, args): Promise<Id<"groups">> => {
    const currentUser: UserDoc | null = await ctx.runQuery(api.users.current);
    if (!currentUser) throw new Error("Unauthorized");

    const trimmedName = args.name.trim();
    if (!trimmedName) throw new Error("Group name cannot be empty");

    const uniqueMembers = new Set<Id<"users">>(args.members);
    uniqueMembers.add(currentUser._id);

    for (const id of uniqueMembers) {
      const user = await ctx.db.get(id);
      if (!user || "members" in user) {
        throw new Error(`User with ID ${id} not found`);
      }
    }

    const now = Date.now();
    const members = [...uniqueMembers].map((id) => ({
      userId: id,
      role: id === currentUser._id ? "admin" : "member",
      joinedAt: now,
    }));

    return await ctx.db.insert("groups", {
      name: trimmedName,
      description: args.description?.trim() ?? "",
      createdBy: currentUser._id,
      members,
    });
  },
});
