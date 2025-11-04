import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// --- QUERY: Read all todos, sorted by the sortKey ---
export const readTodos = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("todos")
      .order("asc")
      // .order("by_sortKey")
      .collect();
  },
});

// --- MUTATION: Create a new todo ---
export const createTodo = mutation({
  args: { title: v.string() },
  handler: async (ctx, { title }) => {
    // Find the current highest sort key to place the new item at the bottom
    const latestTodo = await ctx.db
      .query("todos")
       .order("desc")
        // .order("by_sortKey")
      .first();
    
    const sortKey = (latestTodo?.sortKey ?? 0) + 1;

    return ctx.db.insert("todos", {
      title,
      isCompleted: false,
      sortKey,
    });
  },
});

// --- MUTATION: Toggle complete status ---
export const toggleTodo = mutation({
  args: { id: v.id("todos"), isCompleted: v.boolean() },
  handler: async (ctx, { id, isCompleted }) => {
    await ctx.db.patch(id, { isCompleted });
  },
});

// --- MUTATION: Delete a todo ---
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// --- MUTATION: Update sort order (for Drag and Drop) ---
export const updateSortOrder = mutation({
    args: {
        // Expects an array of objects: [{id: ConvexId, sortKey: number}, ...]
        updates: v.array(v.object({
            id: v.id("todos"),
            sortKey: v.number(),
        })),
    },
    handler: async (ctx, { updates }) => {
        // Use Promise.all to run all patches concurrently
        const patchPromises = updates.map(update => 
            ctx.db.patch(update.id, { sortKey: update.sortKey })
        );
        await Promise.all(patchPromises);
    }
});

// Add this to the bottom of convex/todos.ts

// --- MUTATION: Clear all completed todos (batch delete) ---
export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Find all todos that are completed
    const completedTodos = await ctx.db
      .query("todos")
      .withIndex("by_completion", (q) => q.eq("isCompleted", true))
      .collect();

    if (completedTodos.length === 0) {
      return 0; // Nothing to delete
    }

    // 2. Map the results to an array of delete promises
    const deletePromises = completedTodos.map(todo => 
      ctx.db.delete(todo._id)
    );

    // 3. Execute all deletions concurrently
    await Promise.all(deletePromises);
    
    return completedTodos.length; // Return count of deleted items
  },
});