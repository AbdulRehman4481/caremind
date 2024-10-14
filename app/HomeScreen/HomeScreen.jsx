import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Notifications from "expo-notifications";
import dayjs from "dayjs";
import * as speech from "expo-speech";
import messaging from "@react-native-firebase/messaging";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function HomeScreen() {
  const [projectList, setProjectList] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [category, setCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigation = useNavigation();

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log("token", token);
        });
    } else {
      console.log("Did Not Get Token");
    }
    const message = messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(remoteMessage.notification);
        }
      });
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("remoteMessage", remoteMessage);
    });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });
    const unsubscribe2 = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe2;
  }, []);

  const handleNavigateToLogin = () => {
    navigation.navigate("Login");
  };
  const handlePlayText = (text) => {
    console.log("Text-to-Speech:", text);
  };

  const handleTaskCompletion = (status, taskId) => {
    const updatedList = projectList.map((task) => {
      if (task.id === taskId) {
        return { ...task, status };
      }
      return task;
    });
    setProjectList(updatedList);
    setFilteredTasks(
      updatedList.filter((task) => (task.id !== taskId ? task : null))
    );
    updateCategory(category);
  };

  const updateCategory = (selectedCategory) => {
    setCategory(selectedCategory);
    filterTasks(selectedCategory, filterStatus);
  };

  const handleStatusChange = (selectedStatus) => {
    setFilterStatus(selectedStatus);
    filterTasks(category, selectedStatus);
  };
  const filterTasks = (selectedCategory, selectedStatus) => {
    let updatedTasks = projectList;

    if (selectedCategory !== "All") {
      updatedTasks = updatedTasks.filter((task) =>
        task.categories.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    if (selectedStatus !== "all") {
      updatedTasks = updatedTasks.filter(
        (task) => task.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredTasks(updatedTasks);
  };
  const textToSpeech = (text) => {
    speech.speak(text);
  };

  const renderTask = ({ item }) => {
    let cardBgColor = "";
    let textColor = "";

    switch (item.status.toLowerCase()) {
      case "completed":
        cardBgColor = "#00AB55";
        textColor = "white";
        break;
      case "pending":
        cardBgColor = "#E2A03F";
        textColor = "white";
        break;
      case "missed":
        cardBgColor = "#E7515A";
        textColor = "white";
        break;
      default:
        cardBgColor = "#f3f3f3";
        textColor = "black";
        break;
    }
    const imageSource =
      typeof item.image === "string" ? { uri: item.image } : item.image;

    return (
      <View style={[styles.card, { backgroundColor: cardBgColor }]}>
        <Image source={imageSource} style={styles.taskImage} />
        <View style={styles.cardContent}>
          <Text
            style={[styles.cardTitle, { color: textColor }]}
            onPress={() => {
              console.log("press");
              navigation.navigate("Details", { id: item.id });
            }}
          >
            {item.task_title}
          </Text>
          <TouchableOpacity onPress={() => textToSpeech(item.task_description)}>
            <Icon
              name="volume-up"
              size={20}
              style={[styles.icon, { color: textColor }]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.dateRow}>
          {/* <IconCalendar /> */}
          <Text style={[styles.cardDate, { color: textColor }]}>
            {dayjs(item.reminder).format("YYYY-MM-DD HH:mm A")}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          {/* Skip Button */}
          <Button
            // mode="outlined"
            onPress={() => handleTaskCompletion("missed", item.id)}
            style={styles.button}
          >
            <View style={styles.iconWithText}>
              <Icon
                name="step-forward"
                size={20}
                color="red"
                style={styles.iconButtons}
              />
              <Text style={[styles.buttonText, { color: "red" }]}>Skip</Text>
            </View>
          </Button>

          {/* Done Button */}
          <Button
            mode="outlined"
            onPress={() => handleTaskCompletion("completed", item.id)}
            style={styles.button}
          >
            <View style={styles.iconWithText}>
              <Icon
                name="check"
                size={20}
                color="green"
                style={styles.iconButtons}
              />
              <Text style={[styles.buttonText, { color: "green" }]}>Done</Text>
            </View>
          </Button>
        </View>
      </View>
    );
  };
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Notifications.getPermissionsAsync();
  //     if (status !== "granted") {
  //       await Notifications.requestPermissionsAsync();
  //     }
  //   })();

  //   const subscription = Notifications.addNotificationResponseReceivedListener(
  //     (response) => {
  //       const taskId = response.notification.request.content.data.taskId;
  //       if (taskId) {
  //         navigation.navigate("Details", { id: taskId });
  //       } else {
  //         console.error("No taskId found in notification data");
  //       }
  //     }
  //   );

  //   return () => subscription.remove();
  // }, [navigation]);

  // const scheduleNotifications = async () => {
  //   for (const task of filteredTasks) {
  //     const reminderDate = new Date(task.reminder);
  //     const currentTime = new Date();

  //     if (reminderDate > currentTime) {
  //       await Notifications.scheduleNotificationAsync({
  //         content: {
  //           title: task.task_title,
  //           body: `Reminder for: ${task.task_title}`,
  //           data: { taskId: task.id },
  //         },
  //         trigger: {
  //           date: reminderDate,
  //         },
  //       });
  //     }
  //   }
  // };

  // useEffect(() => {
  //   scheduleNotifications();
  // }, [filteredTasks]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(
          "https://consumer-tasks.vercel.app/api/tasks"
        );
        if (!response.ok) {
        }
        const data = await response.json();
        setProjectList(data);
        setFilteredTasks(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}></View>
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={styles.taskList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  taskList: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDate: {
    fontSize: 14,
  },
  taskImage: {
    height: 100,
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  iconWithText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtons: {
    marginRight: 5,
  },
  buttonText: {
    fontSize: 20,
  },
  filterSection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
});

// import { useNavigation } from "@react-navigation/native";
// import React, { useState, useEffect } from "react";
// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Button } from "react-native-paper";
// import Icon from "react-native-vector-icons/FontAwesome5";
// import * as Notifications from "expo-notifications";
// import dayjs from "dayjs";
// import * as speech from "expo-speech";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// export default function HomeScreen() {
//   const [projectList, setProjectList] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [category, setCategory] = useState("All");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const navigation = useNavigation();
//   const handleNavigateToLogin = () => {
//     navigation.navigate("Login");
//   };
//   const handlePlayText = (text) => {
//     console.log("Text-to-Speech:", text);
//   };

//   const handleTaskCompletion = (status, taskId) => {
//     const updatedList = projectList.map((task) => {
//       if (task.id === taskId) {
//         return { ...task, status };
//       }
//       return task;
//     });
//     setProjectList(updatedList);
//     setFilteredTasks(
//       updatedList.filter((task) => (task.id !== taskId ? task : null))
//     );
//     updateCategory(category);
//   };

//   const updateCategory = (selectedCategory) => {
//     setCategory(selectedCategory);
//     filterTasks(selectedCategory, filterStatus);
//   };

//   const handleStatusChange = (selectedStatus) => {
//     setFilterStatus(selectedStatus);
//     filterTasks(category, selectedStatus);
//   };
//   const filterTasks = (selectedCategory, selectedStatus) => {
//     let updatedTasks = projectList;

//     if (selectedCategory !== "All") {
//       updatedTasks = updatedTasks.filter((task) =>
//         task.categories.some(
//           (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
//         )
//       );
//     }

//     if (selectedStatus !== "all") {
//       updatedTasks = updatedTasks.filter(
//         (task) => task.status.toLowerCase() === selectedStatus.toLowerCase()
//       );
//     }

//     setFilteredTasks(updatedTasks);
//   };
//   const textToSpeech = (text) => {
//     speech.speak(text);
//   };

//   const renderTask = ({ item }) => {
//     let cardBgColor = "";
//     let textColor = "";

//     switch (item.status.toLowerCase()) {
//       case "completed":
//         cardBgColor = "#00AB55";
//         textColor = "white";
//         break;
//       case "pending":
//         cardBgColor = "#E2A03F";
//         textColor = "white";
//         break;
//       case "missed":
//         cardBgColor = "#E7515A";
//         textColor = "white";
//         break;
//       default:
//         cardBgColor = "#f3f3f3";
//         textColor = "black";
//         break;
//     }
//     const imageSource =
//       typeof item.image === "string" ? { uri: item.image } : item.image;

//     return (
//       <View style={[styles.card, { backgroundColor: cardBgColor }]}>
//         <Image source={imageSource} style={styles.taskImage} />
//         <View style={styles.cardContent}>
//           <Text
//             style={[styles.cardTitle, { color: textColor }]}
//             onPress={() => {
//               console.log("press");
//               navigation.navigate("Details", { id: item.id });
//             }}
//           >
//             {item.task_title}
//           </Text>
//           <TouchableOpacity onPress={() => textToSpeech(item.task_description)}>
//             <Icon
//               name="volume-up"
//               size={20}
//               style={[styles.icon, { color: textColor }]}
//             />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.dateRow}>
//           {/* <IconCalendar /> */}
//           <Text style={[styles.cardDate, { color: textColor }]}>
//             {dayjs(item.reminder).format("YYYY-MM-DD HH:mm A")}
//           </Text>
//         </View>
//         <View style={styles.buttonRow}>
//           {/* Skip Button */}
//           <Button
//             // mode="outlined"
//             onPress={() => handleTaskCompletion("missed", item.id)}
//             style={styles.button}
//           >
//             <View style={styles.iconWithText}>
//               <Icon
//                 name="step-forward"
//                 size={20}
//                 color="red"
//                 style={styles.iconButtons}
//               />
//               <Text style={[styles.buttonText, { color: "red" }]}>Skip</Text>
//             </View>
//           </Button>

//           {/* Done Button */}
//           <Button
//             mode="outlined"
//             onPress={() => handleTaskCompletion("completed", item.id)}
//             style={styles.button}
//           >
//             <View style={styles.iconWithText}>
//               <Icon
//                 name="check"
//                 size={20}
//                 color="green"
//                 style={styles.iconButtons}
//               />
//               <Text style={[styles.buttonText, { color: "green" }]}>Done</Text>
//             </View>
//           </Button>
//         </View>
//       </View>
//     );
//   };
//   useEffect(() => {
//     (async () => {
//       const { status } = await Notifications.getPermissionsAsync();
//       if (status !== "granted") {
//         await Notifications.requestPermissionsAsync();
//       }
//     })();

//     const subscription = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         const taskId = response.notification.request.content.data.taskId;
//         if (taskId) {
//           navigation.navigate("Details", { id: taskId });
//         } else {
//           console.error("No taskId found in notification data");
//         }
//       }
//     );

//     return () => subscription.remove();
//   }, [navigation]);

//   const scheduleNotifications = async () => {
//     for (const task of filteredTasks) {
//       const reminderDate = new Date(task.reminder);
//       const currentTime = new Date();

//       if (reminderDate > currentTime) {
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: task.task_title,
//             body: `Reminder for: ${task.task_title}`,
//             data: { taskId: task.id },
//           },
//           trigger: {
//             date: reminderDate,
//           },
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     scheduleNotifications();
//   }, [filteredTasks]);

//   useEffect(() => {
//     async function fetchTasks() {
//       try {
//         const response = await fetch(
//           "https://consumer-tasks.vercel.app/api/tasks"
//         );
//         if (!response.ok) {
//         }
//         const data = await response.json();
//         setProjectList(data);
//         setFilteredTasks(data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     }
//     fetchTasks();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.filterSection}></View>
//       <FlatList
//         data={filteredTasks}
//         renderItem={renderTask}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={1}
//         contentContainerStyle={styles.taskList}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   taskList: {
//     paddingBottom: 20,
//   },
//   card: {
//     flex: 1,
//     margin: 10,
//     padding: 15,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
//   cardContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   cardDate: {
//     fontSize: 14,
//   },
//   taskImage: {
//     height: 100,
//     width: "100%",
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   icon: {
//     fontSize: 24,
//   },
//   dateRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   button: {
//     flex: 1,
//     marginHorizontal: 5,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//   },
//   iconWithText: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconButtons: {
//     marginRight: 5,
//   },
//   buttonText: {
//     fontSize: 20,
//   },
//   filterSection: {
//     marginBottom: 20,
//     padding: 10,
//     backgroundColor: "#f8f8f8",
//     borderRadius: 8,
//   },
// });
