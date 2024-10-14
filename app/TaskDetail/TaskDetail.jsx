import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as speech from "expo-speech";
export default function TaskDetail({ route }) {
  const { id } = route.params;
  const [task, setTask] = useState(null);

  const textToSpeech = (text) => {
    speech.speak(text);
  };

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(
          `https://consumer-tasks.vercel.app/api/tasks/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTask(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchTasks();
  }, []);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!task) {
    return <Text>Loading....</Text>;
  }

  const imageSource =
    typeof task.image === "string" ? { uri: task.image } : task.image;
  return (
    <View style={styles.container}>
      <View>
        <Image source={imageSource} style={styles.image} />
      </View>

      {/* Task Details */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.task_title}</Text>
          <TouchableOpacity onPress={()=>{textToSpeech(task.task_description)}}>
            <Icon name="volume-high-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeRow}>
          <Icon name="calendar-outline" size={16} color="#555" />
          <Text style={styles.dateText}>
            {dayjs(task.reminder).format("YYYY-MM-DD HH:mm A")}
          </Text>
          <Icon name="time-outline" size={16} color="#555" />
          <Text style={styles.dateText}>
            {" "}
            {dayjs(task.reminder).format(" HH:mm A")}
          </Text>
        </View>

        <Text style={styles.description}>{task.task_description}</Text>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              isCompleted ? styles.completedButton : styles.defaultButton,
            ]}
            onPress={() => setIsCompleted(!isCompleted)}
          >
            <Icon
              name={
                isCompleted ? "checkmark-circle-outline" : "checkmark-circle"
              }
              size={24}
              color={isCompleted ? "green" : "#fff"}
              style={styles.icon}
            />
            <Text
              style={[
                styles.buttonText,
                isCompleted ? styles.completedText : styles.defaultText,
              ]}
            >
              {isCompleted ? "Completed" : "Mark as Done"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.skipButton]}>
            <Icon
              name="play-skip-forward-outline"
              size={24}
              color="red"
              style={styles.icon}
            />
            <Text style={[styles.buttonText, styles.skipText]}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  image: { width: "100%", height: 200, resizeMode: "cover" },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 30,
  },
  content: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: { marginLeft: 5, marginRight: 20, color: "#555" },
  description: { fontSize: 16, color: "#555", marginBottom: 20 },
  medicationBox: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 8 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  medicationText: { fontSize: 16, color: "#555" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    padding: 10,
    borderRadius: 5,
  },
  defaultButton: { backgroundColor: "#28a745" },
  completedButton: {
    borderWidth: 1,
    borderColor: "green",
    backgroundColor: "#fff",
    marginRight: 2,
  },
  skipButton: {
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "#fff",
    marginLeft: 10,
    alignItems:"center"
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 3,
  },
 
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  defaultText: { color: "#fff" },
  completedText: { color: "green" },
  skipText: { color: "red" },
  icon: { marginRight: 1 }, // <-- Added the icon style here
});
