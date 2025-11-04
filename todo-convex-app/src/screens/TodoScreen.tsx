import React, { useState, useMemo } from 'react';
import { 
    View, 
    StyleSheet, 
    SafeAreaView, 
    KeyboardAvoidingView, 
    Platform, 
    ImageBackground, 
    Text, 
    ActivityIndicator 
} from 'react-native';
import { useQuery } from 'convex/react'; 
import { api } from '../../convex/_generated/api'; 
import { useTheme } from '../context/ThemeContext';

// Import necessary components
import ThemeSwitcher from '../components/todo/ThemeSwitcher'; 
import TodoInput from '../components/todo/TodoInput';      
import TodoList from '../components/todo/TodoList';        
import FilterBar from '../components/todo/FilterBar';      

// Filter enum (for state management)
type Filter = 'All' | 'Active' | 'Completed';

// 1. Import the image assets (assuming they exist at this path)
const LightBg = require('../../assets/images/android-icon-background.png');
const DarkBg = require('../../assets/images/android-icon-foreground.png');


const TodoScreen: React.FC = () => {
    // --- 2. HOOKS AND STATE MUST BE INSIDE THE FUNCTION ---
    const { currentTheme, theme } = useTheme();
    const [filter, setFilter] = useState<Filter>('All');
    
    // Real-time data fetch from Convex
    const todos = useQuery(api.todos.readTodos);
    
    // --- 3. FILTERING LOGIC (Using React.useMemo) ---
    const filteredTodos = useMemo(() => {
        if (!todos) return [];
        
        switch (filter) {
            case 'Active':
                return todos.filter(t => !t.isCompleted);
            case 'Completed':
                return todos.filter(t => t.isCompleted);
            default:
                return todos;
        }
    }, [todos, filter]);
    
    // Select the background image based on the current theme
    const backgroundImage = theme === 'dark' ? DarkBg : LightBg;


    // --- 4. LOADING STATE CHECK (Must happen before return) ---
    if (todos === undefined) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: currentTheme.background }]}>
                <ActivityIndicator size="large" color={currentTheme.text} />
            </View>
        );
    }

    // --- 5. THE JSX RETURN STATEMENT ---
    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: currentTheme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* 3. Wrap content that needs the image in ImageBackground */}
            <ImageBackground source={backgroundImage} style={styles.imageBackground}>
                <SafeAreaView style={styles.safeArea}>
                    
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: currentTheme.text }]}>T O D O</Text>
                        <ThemeSwitcher />
                    </View>

                    {/* TodoInput is positioned here */}
                    <TodoInput />
                    
                    {/* This inner view holds the list and filter bar */}
                    <View style={[styles.contentWrapper, { backgroundColor: currentTheme.itemBackground }]}>
                        <TodoList todos={filteredTodos} allTodos={todos} />
                    </View>

                    {/* The FilterBar will naturally push to the bottom or stick */}
                    <FilterBar 
                        filter={filter} 
                        setFilter={setFilter} 
                        count={todos.filter(t => !t.isCompleted).length} 
                    />

                </SafeAreaView>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}; 

// --- 6. STYLESHEET MUST BE OUTSIDE THE FUNCTION ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBackground: {
        width: '100%',
        height: 250, 
        position: 'absolute',
        top: 0,
        zIndex: 0,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 20, 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 40,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 8,
    },
    contentWrapper: {
        flex: 1,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 20, 
    },
});

export default TodoScreen;