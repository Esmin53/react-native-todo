import { router, useLocalSearchParams } from "expo-router";
import {View, Text, Pressable, StyleSheet, TextInput} from "react-native"

import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function editScreen() {
    const {id} = useLocalSearchParams()
    const [todo, setTodo] = useState< { id: number
        title: string
        completed: boolean} | null>(null)

    const { colorScheme, theme, setColorScheme } = useContext(ThemeContext)

    const styles = createStyles(theme)

    useEffect(() => {
        const getTodo = async () => {
            const jsonData = await AsyncStorage.getItem("TodoApp")

            const storageTodos: { id: number
                title: string
                completed: boolean}[] = jsonData !== null ? JSON.parse(jsonData) : null

            if(storageTodos.length && storageTodos !== null) {
                let tempTodo = storageTodos.find((item) => item.id === Number(id))
                if(tempTodo)
                setTodo(tempTodo)
            }
        }

        getTodo()
    }, [])

    const handleSave = async () => {
        try {
            const savedTodo = {...todo, title: todo?.title}

            const jsonValue = await AsyncStorage.getItem("TodoApp")

            const storageTodos: { id: number
                title: string
                completed: boolean}[] = jsonValue !== null ? JSON.parse(jsonValue) : null

                if(storageTodos.length && storageTodos !== null) {
                    let otherTodos= storageTodos.filter((item) => item.id !== savedTodo.id)
                    
                    const allTodos = [...otherTodos, savedTodo]

                    await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos))
                } else {
                    await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTodo]))
                }

                router.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                {todo ? <TextInput 
                    style={styles.input}
                    placeholder="Edit"
                    placeholderTextColor={theme?.text}
                    value={todo?.title || ""}
                    onChangeText={(text) => setTodo(prev => ({...prev!, title: text}))}
                /> : null}
      <Pressable style={styles.button} onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}>
        {colorScheme === 'dark' ? 
        <Octicons name="sun" size={24} color={theme?.text} /> :
        <Octicons name="moon" size={24} color={theme?.text} />}
      </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable style={[styles.saveButton, {backgroundColor: theme?.red}]} onPress={() => router.push("/")}>
                    <Text style={styles.saveButtonText}>Cancel</Text>
                </Pressable>

            </View>
        </SafeAreaView>
    )
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
        container: {
            flex: 1,
            width: "100%",
            backgroundColor: theme?.background
        },
        inputContainer: {
            display: "flex",
            flexDirection: "row",
            color: theme?.text,
            padding: 10,
            paddingBottom: 5,
            gap: 6,
            maxWidth: 1024
        },
        input: {
            flex: 1,
            color: theme?.text,
            backgroundColor: theme?.secondaryBackground,
            borderRadius: 4,
            paddingLeft: 6
            
        },
        button: {
            height: 42,
            aspectRatio: 16/16,
            backgroundColor: theme?.button,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
        saveButton: {
            flex: 1,
            borderRadius: 5,
            padding: 12,
            textAlign: "center",
            backgroundColor: theme?.green,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
        },
        saveButtonText: {
            color: theme?.text
        }
    })
}