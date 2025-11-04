
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    title: v.string(),
    // description: v.optional(v.string()),
    // dueDate: v.optional(v.number()), // Unix timestamp
      isCompleted: v.boolean(),
    sortKey:v.number(),
  }).index("by_sortKey", ["sortKey"]) 
  .index("by_completion",["isCompleted"]),
});


