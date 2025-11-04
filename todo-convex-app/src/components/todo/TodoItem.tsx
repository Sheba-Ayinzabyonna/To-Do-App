// src/components/todo/TodoItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { AppTheme } from '../../theme/light'; // Import theme type
import { Feather } from '@expo/vector-icons'; // Example icon library

// Define Todo type again for clarity
interface Todo {
    _id: Id<'todos'>;
    title: string;
    isCompleted: boolean;
    sortKey: number;
}

interface TodoItemProps {
    todo: Todo;
    drag: () => void; // Provided by DraggableFlatList for initiating drag
    isActive: boolean; // True while being dragged
    currentTheme: AppTheme;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, drag, isActive, currentTheme }) => {
    // Convex Mutations
    const toggleTodo = useMutation(api.todos.toggleTodo);
    const deleteTodo = useMutation(api.todos.deleteTodo);

    const handleToggle = () => {
        toggleTodo({ id: todo._id, isCompleted: !todo.isCompleted });
    };

    const handleDelete = () => {
        deleteTodo({ id: todo._id });
        // NOTE: For a pixel-perfect app, you'd integrate swipe-to-delete 
        // using react-native-swipe-list-view or similar here.
    };

    return (
        <View 
            style={[
                styles.itemContainer,
                { backgroundColor: currentTheme.itemBackground, borderColor: currentTheme.border },
                isActive && styles.dragging, // Apply dragging style
            ]}
        >
            {/* 1. Drag Handle (Left Side) - Pressable used for drag initiation */}
            <Pressable 
                onLongPress={drag} 
                style={styles.dragHandle}
                // Accessibility note: Tell screen readers this element can be dragged
                accessible={true}
                accessibilityLabel="Drag handle to reorder task"
            >
                <Feather name="menu" size={24} color={currentTheme.textSecondary} />
            </Pressable>

            {/* 2. Completion Checkbox */}
            <TouchableOpacity onPress={handleToggle} style={styles.checkbox}>
                <View 
                    style={[
                        styles.circle, 
                        { borderColor: todo.isCompleted ? 'transparent' : currentTheme.textSecondary },
                        todo.isCompleted && styles.completedCircle
                    ]}
                >
                    {todo.isCompleted && (
                        <Feather name="check" size={16} color={currentTheme.itemBackground} />
                    )}
                </View>
            </TouchableOpacity>

            {/* 3. Task Title */}
            <Text 
                style={[
                    styles.title, 
                    { color: currentTheme.text },
                    todo.isCompleted && styles.completedText
                ]}
                numberOfLines={1}
            >
                {todo.title}
            </Text>

            {/* 4. Delete Button (For simplicity, use a button instead of swipe) */}
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Feather name="x" size={20} color={currentTheme.textSecondary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 8,
        elevation: 1,
        // The border is for visual separation in the light theme
        borderBottomWidth: 1, 
    },
    dragging: {
        opacity: 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    dragHandle: {
        paddingHorizontal: 10,
        marginRight: 5,
    },
    checkbox: {
        padding: 8,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedCircle: {
        // Use the gradient colors for the background of the completed circle
        backgroundColor: 'hsl(280, 87%, 65%)', 
        borderColor: 'hsl(280, 87%, 65%)',
    },
    title: {
        flex: 1,
        fontSize: 16,
        marginHorizontal: 10,
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.6,
    },
    deleteButton: {
        padding: 8,
    },
});

export default TodoItem;





// // src/components/todo/TodoList.tsx
// import React, { useCallback } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
// import { useTheme } from '../context/ThemeContext';
// import { useMutation } from 'convex/react';
// import { api } from '../../convex/_generated/api';
// import TodoItem from './TodoItem'; // To be created next
// import { Id } from '../../convex/_generated/dataModel';

// // Define the structure of the ToDo object from Convex
// interface Todo {
//     _id: Id<'todos'>;
//     title: string;
//     isCompleted: boolean;
//     sortKey: number;
// }

// interface TodoListProps {
//     todos: Todo[]; // Filtered list (Active/Completed/All)
//     allTodos: Todo[]; // The full list, needed for sorting logic
// }

// const TodoList: React.FC<TodoListProps> = ({ todos, allTodos }) => {
//     const { currentTheme } = useTheme();
//     // Get the Convex mutation for updating the sort order
//     const updateSortOrder = useMutation(api.todos.updateSortOrder);

//     // Filter out completed tasks if the list passed is filtered (e.g., Active view)
//     // IMPORTANT: DraggableFlatList must operate on the full, unfiltered set of items 
//     // that are currently visible and ordered. Since our Convex query sorts by sortKey, 
//     // we use the 'todos' prop directly here.

//     // --- RENDER ITEM FUNCTION ---
//     const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<Todo>) => {
//         return (
//             <ScaleDecorator>
//                 {/* TodoItem will handle completion and deletion logic */}
//                 <TodoItem 
//                     todo={item} 
//                     drag={drag} 
//                     isActive={isActive} 
//                     currentTheme={currentTheme}
//                 />
//             </ScaleDecorator>
//         );
//     }, [currentTheme]);

//     // --- DRAG END HANDLER (The core logic for Convex update) ---
//     const handleDragEnd = async ({ data: newData }: { data: Todo[] }) => {
//         if (!newData || newData.length === 0) return;
        
//         // 1. Prepare the batch update payload for Convex
//         const updates = newData.map((item, index) => ({
//             id: item._id,
//             // Assign the new index as the new sortKey
//             sortKey: index, 
//         }));

//         // 2. Call the Convex mutation to update all sort keys in a single transaction
//         try {
//             await updateSortOrder({ updates });
//             console.log("Sort order updated successfully in Convex.");
//         } catch (error) {
//             console.error("Failed to update sort order:", error);
//             // Optionally, implement rollback or error state handling here
//         }
//     };

//     if (todos.length === 0) {
//         return (
//             <View style={styles.emptyContainer}>
//                 <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
//                     {`No tasks yet. Time to create a new todo!`}
//                 </Text>
//             </View>
//         );
//     }
    
//     return (
//         <View style={styles.listContainer}>
//             <DraggableFlatList
//                 data={todos}
//                 keyExtractor={(item) => item._id}
//                 onDragEnd={handleDragEnd}
//                 renderItem={renderItem}
//                 // Important to prevent background artifacts during drag
//                 activationDistance={20} 
//                 contentContainerStyle={{ paddingBottom: 20 }}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     listContainer: {
//         flex: 1,
//         zIndex: 1, // Ensure the list items sit above other elements when dragging
//         marginTop: 10,
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     emptyText: {
//         fontSize: 16,
//         textAlign: 'center',
//     },
// });

// export default TodoList;