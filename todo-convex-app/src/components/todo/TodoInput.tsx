// src/components/todo/TodoInput.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';

const TodoInput: React.FC = () => {
    const { currentTheme } = useTheme();
    const [title, setTitle] = useState('');
    // Get the Convex mutation for creating todos
    const createTodo = useMutation(api.todos.createTodo);

    const handleCreateTodo = async () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        try {
            // Call the Convex mutation
            await createTodo({ title: trimmedTitle });
            setTitle(''); // Clear input on success
            Keyboard.dismiss();
        } catch (error) {
            console.error("Failed to create todo:", error);
            // Implement error handling UI (e.g., a toast message)
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.itemBackground, borderColor: currentTheme.border }]}>
            {/* The completion circle design, but non-interactive here (or make it a dummy) */}
            <View style={styles.iconPlaceholder}>
                <Feather name="circle" size={20} color={currentTheme.textSecondary} />
            </View>
            
            <TextInput
                style={[styles.input, { color: currentTheme.text, borderBottomColor: currentTheme.border }]}
                placeholder="Create a new todo..."
                placeholderTextColor={currentTheme.inputPlaceholder}
                value={title}
                onChangeText={setTitle}
                onSubmitEditing={handleCreateTodo} // Allows submitting by pressing 'Enter'/'Done'
                returnKeyType="done"
                accessibilityLabel="New todo input field"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    iconPlaceholder: {
        paddingRight: 15,
        opacity: 0.6,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 5, // Ensures good touch target
    },
});

export default TodoInput;