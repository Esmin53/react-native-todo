import { Text, View, StyleSheet, FlatList, ScrollView, Pressable, TextInput } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';

import { data } from "@/data/todos";
import { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";

export default function Index() {
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)

  const styles = createStyles(theme)

  const [todos, setTodos] = useState(data)
  const [newTodo, setNewTodo] = useState<string >("")

  const deleteTodos = (id: number) => {
    let temp = todos.filter((item) => item.id !== id);

    setTodos(temp)
  }

  const completeTask = (id: number) => {
    setTodos((prev) => prev.map((item) => {
      if(item.id !== id) {
        return item
      } else {
        return {
          ...item,
          completed: !item.completed
        }
      }
    }))
  }

  const addNewTask = () => {
    if(newTodo.length < 1) return

    setTodos(() => [{
      completed: false,
      id: todos.length + 1,
      title: newTodo
    }, ...todos])
  }

  const todosHeader = <View style={styles.header}>
    <Text style={{
          color: theme?.text,
          fontSize: 16,
          fontWeight: "700",
          marginTop: 8
    }}>Add a new task: </Text>
    <View style={{
      width: "75%",
      height: 2,
      backgroundColor: theme?.green
    }} />
    <View style={styles.headerWrapper}>
      <TextInput value={newTodo} 
      onChangeText={(text) => setNewTodo(text)}
      style={styles.textInput}
      placeholder="eg. Finish the project report"/>
      <Pressable style={styles.button} onTouchStart={addNewTask}>
        <AntDesign name="check" size={32} color={theme?.green} />
      </Pressable>
      <Pressable style={styles.button} onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}>
        {colorScheme === 'dark' ? 
        <Octicons name="sun" size={24} color={theme?.text} /> :
        <Octicons name="moon" size={24} color={theme?.text} />}
      </Pressable>
    </View>
  </View>

  return (
        <SafeAreaView style={{
          height: "100%",
          backgroundColor: theme?.background,
        }}>
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={todosHeader}
            renderItem={({ item}) => <View style={styles.todoContainer}
            >
               <Text style={[styles.text,
                item.completed ? styles.completedTask : {}
               ]}>{item.title}</Text>
               <View style={styles.buttonContainer}>
                  <Pressable style={styles.button} onTouchStart={() => completeTask(item.id)}>
                    {
                      item.completed ? <MaterialIcons name="restart-alt" size={32} color={theme?.red} />
                      : <AntDesign name="check" size={32} color={theme?.green} />
                    }
                  </Pressable>
                  <Pressable style={styles.button} onPress={() => deleteTodos(item.id)}>
                    <AntDesign name="delete" size={32} color={theme?.red} />
                  </Pressable>
               </View>
            </View> }
          />
        </SafeAreaView>
  );
}

function createStyles(theme: {
  text: string,
  background: string,
  secondaryBackground: string,
  button: string,
  green: string,
  red: string
} | null) {
  return StyleSheet.create({
    contentContainer: {
      backgroundColor: theme?.background,
      paddingVertical: 14,
      paddingHorizontal: 10,
      gap: 6,
    },
    header: {
      width: "100%",
      marginVertical: 12,
      borderRadius: 6,
      backgroundColor: theme?.secondaryBackground,
      display: "flex",
      flexDirection: "column",
      paddingHorizontal: 6,
      paddingVertical: 4
    },
    headerWrapper: {
      width: "100%",
      borderRadius: 6,
      backgroundColor: theme?.secondaryBackground,
      height: 56,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 6
    },
    textInput: {
      flex: 1,
      height: "80%",
      backgroundColor: theme?.button,
      paddingHorizontal: 6,
      borderRadius: 4
    },
    todoContainer: {
      width: "100%",
      height: 56,
      backgroundColor: theme?.secondaryBackground,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 6,
      paddingHorizontal: 4,
      shadowRadius: 6
      
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 4
    },
    button: {
      height: "80%",
      aspectRatio: 16/16,
      backgroundColor: theme?.button,
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    text: {
      color: theme?.text,
      fontSize: 15,
      flex: 1,
      fontWeight: "600",
    },
    completedTask: {
      textDecorationLine: "line-through",
      textDecorationStyle: "solid",
      textDecorationColor: "#b0c4b1"
    }
  })
}
