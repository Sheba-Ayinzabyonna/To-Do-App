// src/components/todo/ThemeSwitcher.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
    const { theme, toggleTheme, currentTheme } = useTheme();
    
    // Determine the icon and its color based on the current theme
    const isDark = theme === 'dark';
    const iconName = isDark ? 'sun' : 'moon';
    
    // Use the opposite text color for the icon to ensure contrast 
    // against the header background.
    const iconColor = isDark ? currentTheme.text : currentTheme.textSecondary; 

    return (
        <TouchableOpacity 
            onPress={toggleTheme} 
            style={styles.container}
            accessibilityLabel={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
        >
            <Feather 
                name={iconName as keyof typeof Feather.glyphMap} // Cast for correct type
                size={24} 
                color={iconColor}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        // Adjust touch target area if needed
    },
});

export default ThemeSwitcher;