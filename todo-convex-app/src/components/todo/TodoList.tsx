// src/components/todo/TodoList.tsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { useTheme } from '../context/ThemeContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import TodoItem from './TodoItem'; // To be created next
import { Id } from '../../convex/_generated/dataModel';

// Define the structure of the ToDo object from Convex
interface Todo {
    _id: Id<'todos'>;
    title: string;
    isCompleted: boolean;
    sortKey: number;
}

interface TodoListProps {
    todos: Todo[]; // Filtered list (Active/Completed/All)
    allTodos: Todo[]; // The full list, needed for sorting logic
}

const TodoList: React.FC<TodoListProps> = ({ todos, allTodos }) => {
    const { currentTheme } = useTheme();
    // Get the Convex mutation for updating the sort order
    const updateSortOrder = useMutation(api.todos.updateSortOrder);

    // Filter out completed tasks if the list passed is filtered (e.g., Active view)
    // IMPORTANT: DraggableFlatList must operate on the full, unfiltered set of items 
    // that are currently visible and ordered. Since our Convex query sorts by sortKey, 
    // we use the 'todos' prop directly here.

    // --- RENDER ITEM FUNCTION ---
    const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<Todo>) => {
        return (
            <ScaleDecorator>
                {/* TodoItem will handle completion and deletion logic */}
                <TodoItem 
                    todo={item} 
                    drag={drag} 
                    isActive={isActive} 
                    currentTheme={currentTheme}
                />
            </ScaleDecorator>
        );
    }, [currentTheme]);

    // --- DRAG END HANDLER (The core logic for Convex update) ---
    const handleDragEnd = async ({ data: newData }: { data: Todo[] }) => {
        if (!newData || newData.length === 0) return;
        
        // 1. Prepare the batch update payload for Convex
        const updates = newData.map((item, index) => ({
            id: item._id,
            // Assign the new index as the new sortKey
            sortKey: index, 
        }));

        // 2. Call the Convex mutation to update all sort keys in a single transaction
        try {
            await updateSortOrder({ updates });
            console.log("Sort order updated successfully in Convex.");
        } catch (error) {
            console.error("Failed to update sort order:", error);
            // Optionally, implement rollback or error state handling here
        }
    };

    if (todos.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
                    {`No tasks yet. Time to create a new todo!`}
                </Text>
            </View>
        );
    }
    
    return (
        <View style={styles.listContainer}>
            <DraggableFlatList
                data={todos}
                keyExtractor={(item) => item._id}
                onDragEnd={handleDragEnd}
                renderItem={renderItem}
                // Important to prevent background artifacts during drag
                activationDistance={20} 
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        zIndex: 1, // Ensure the list items sit above other elements when dragging
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default TodoList;