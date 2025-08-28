// npm start
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

export default function App() {
  // Muscle group dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null); // selected muscle group id
  const [items, setItems] = useState([
    { label: 'Chest', value: 1 },
    { label: 'Triceps', value: 2 },
    { label: 'Shoulders', value: 3 },
    { label: 'Back', value: 4 },
    { label: 'Biceps', value: 5 },
    { label: 'Legs', value: 6 },
  ]);

  // Each muscle group holds an array of exercises
  const [workouts, setWorkouts] = useState({
    1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  });

  const [nextExerciseId, setNextExerciseId] = useState(1);
  const [lastAddedId, setLastAddedId] = useState(null);

  const addExercise = () => {
    if (!value) return;
    const id = nextExerciseId;
    const newExercise = { id, name: '', sets: [] };
    setWorkouts(prev => ({
      ...prev,
      [value]: [...(prev[value] || []), newExercise],
    }));
    setNextExerciseId(id + 1);
    setLastAddedId(id);
  };

  const updateExerciseName = (exerciseId, text) => {
    setWorkouts(prev => {
      const list = prev[value] || [];
      const updatedList = list.map(ex => ex.id === exerciseId ? { ...ex, name: text } : ex);
      return { ...prev, [value]: updatedList };
    });
  };

  const removeExercise = (exerciseId) => {
    setWorkouts(prev => {
      const list = prev[value] || [];
      const updatedList = list.filter(ex => ex.id !== exerciseId);
      return { ...prev, [value]: updatedList };
    });
  };

  const addSet = (muscleId, exerciseId) => {
    setWorkouts(prev => {
      const updated = { ...prev };
      const exercise = updated[muscleId].find(e => e.id === exerciseId);
      const newId = (exercise.sets?.length || 0) + 1;
      const newSet = { id: newId, reps: 0, weight: 0, completed: false };
      exercise.sets = [...(exercise.sets || []), newSet];
      return updated;
    });
  };

  const updateSet = (muscleId, exerciseId, setId, field, newValue) => {
    setWorkouts(prev => {
      const updated = { ...prev };
      const exercise = updated[muscleId].find(e => e.id === exerciseId);
      const set = exercise.sets.find(s => s.id === setId);
      set[field] = Number(newValue);
      return updated;
    });
  };

  const toggleComplete = (muscleId, exerciseId, setId) => {
    setWorkouts(prev => {
      const updated = { ...prev };
      const exercise = updated[muscleId].find(e => e.id === exerciseId);
      const set = exercise.sets.find(s => s.id === setId);
      set.completed = !set.completed;
      return updated;
    });
  };

  const renderExerciseCard = ({ item }) => (
    <View style={styles.card}>
      {/* Header with exercise name + remove button */}
      <View style={styles.cardHeader}>
        <TextInput
          value={item.name}
          onChangeText={(t) => updateExerciseName(item.id, t)}
          placeholder="Exercise name (e.g., Bench Press)"
          style={styles.cardTitleInput}
          autoFocus={item.id === lastAddedId}
          placeholderTextColor="#9aa0a6"
        />
        <TouchableOpacity onPress={() => removeExercise(item.id)} style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Sets list */}
      {item.sets?.map((set) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setLabel}>Set {set.id}</Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={set.reps.toString()}
            onChangeText={(text) => updateSet(value, item.id, set.id, "reps", text)}
            placeholder="Reps"
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={set.weight.toString()}
            onChangeText={(text) => updateSet(value, item.id, set.id, "weight", text)}
            placeholder="Weight"
          />

          <TouchableOpacity onPress={() => toggleComplete(value, item.id, set.id)}>
            <Text style={{ fontSize: 20, color: set.completed ? "green" : "red" }}>
              {set.completed ? "✓" : "✗"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Set button */}
      <TouchableOpacity
        style={styles.addSetBtn}
        onPress={() => addSet(value, item.id)}
      >
        <Text style={styles.addSetBtnText}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );

  const currentExercises = value ? (workouts[value] || []) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select a muscle group..."
          containerStyle={{ width: '90%', marginBottom: 12 }}
          style={{ borderColor: '#d0d5dd' }}
          dropDownContainerStyle={{ borderColor: '#d0d5dd' }}
        />

        {value && (
          <TouchableOpacity style={styles.addBtn} onPress={addExercise}>
            <Text style={styles.addBtnText}>+ Add exercise</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={currentExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderExerciseCard}
          contentContainerStyle={{ paddingBottom: 24, alignItems: 'center', width: '100%' }}
          ListEmptyComponent={
            value ? (
              <Text style={styles.emptyText}>No exercises yet. Tap “+ Add exercise”.</Text>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 70, // adjust spacing from top
  },

  addBtn: {
    width: '90%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#94a3b8',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },

  card: {
    width: 350,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    paddingVertical: 6,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeBtnText: {
    fontSize: 22,
    lineHeight: 22,
    color: '#64748b',
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  setLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 6,
    width: 70,
    marginHorizontal: 4,
    textAlign: "center",
  },
  addSetBtn: {
    marginTop: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  addSetBtnText: {
    fontWeight: "600",
    color: "#0f172a",
  },

  emptyText: {
    marginTop: 8,
    color: '#64748b',
  },
});
