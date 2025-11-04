// src/components/todo/FilterBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppTheme } from '../../theme/light';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Filter enum type passed from TodoScreen
type Filter = 'All' | 'Active' | 'Completed';

interface FilterBarProps {
    filter: Filter;
    setFilter: (filter: Filter) => void;
    count: number; // Number of active items left
}

const filters: Filter[] = ['All', 'Active', 'Completed'];

const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter, count }) => {
    const { currentTheme } = useTheme();
    const clearCompleted = useMutation(api.todos.clearCompleted);

    const handleClearCompleted = async () => {
        try {
            await clearCompleted({});
        } catch (error) {
            console.error("Error clearing completed todos:", error);
        }
    };

    const renderFilterButton = (f: Filter) => (
        <TouchableOpacity 
            key={f}
            onPress={() => setFilter(f)}
            style={styles.filterButton}
        >
            <Text 
                style={[
                    styles.filterText, 
                    { color: currentTheme.textSecondary },
                    filter === f && styles.activeFilterText
                ]}
            >
                {f}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.wrapper}>
            {/* The main bar containing item count and Clear Completed */}
            <View style={[styles.container, { backgroundColor: currentTheme.itemBackground, borderColor: currentTheme.border }]}>
                {/* Items Left Count */}
                <Text style={[styles.itemCount, { color: currentTheme.textSecondary }]}>
                    **{count}** items left
                </Text>

                {/* Filter Buttons (Hidden on small mobile, visible in a separate bar on large screen) */}
                <View style={[styles.filterGroupMobile, styles.filterGroupDesktop]}>
                    {filters.map(renderFilterButton)}
                </View>

                {/* Clear Completed Button */}
                <TouchableOpacity onPress={handleClearCompleted}>
                    <Text style={[styles.clearText, { color: currentTheme.textSecondary }]}>
                        Clear Completed
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Filter Buttons for Mobile (separate bar below list - based on design) */}
            <View style={[styles.container, styles.filterGroupMobile, { backgroundColor: currentTheme.itemBackground, marginTop: 15 }]}>
                {filters.map(renderFilterButton)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 'auto', // Pushes the filter bar to the bottom of the screen
        paddingBottom: 20,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    itemCount: {
        fontSize: 14,
    },
    clearText: {
        fontSize: 14,
    },
    filterGroupMobile: {
        // Hide filter buttons in the main bar on mobile (they are in the second bar)
        // You would use platform or responsive logic here. Assuming a mobile-first design:
        display: 'none', 
        
        // This second container becomes visible on mobile
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    filterGroupDesktop: {
        // Placeholder for desktop/tablet layout where filters are in the main bar
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        left: 0, 
        right: 0,
    },
    filterButton: {
        paddingHorizontal: 5,
    },
    filterText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeFilterText: {
        // Use the primary text color and a different font style for the active filter
        color: 'hsl(220, 98%, 61%)', 
    }
});

export default FilterBar;