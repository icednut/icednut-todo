import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import Todo from "./Todo";
import {AppLoading} from "expo";
import uuid from "react-native-uuid";

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo: "",
    loadedTodos: false,
    todos: {}
  };

  componentDidMount = () => {
    this._loadTodos();
  };

  render() {
    const {newTodo, loadedTodos, todos} = this.state;
    // console.log(todos);
    if (!loadedTodos) {
      return <AppLoading/>;
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Icednut To Do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} b
            placeholder={"New To Do"} 
            placeholderTextColor={"#999"} 
            returnKeyType={"done"} 
            autoCorrect={false} 
            value={newTodo} 
            onChangeText={this._controlNewTodo}
            onSubmitEditing={this._addTodo}
          />
          <ScrollView contentContainerStyle={styles.todos}>
            {Object.values(todos).reverse().map(todo => 
              <Todo 
                key={todo.id} {...todo} 
                deleteTodo={this._deleteTodo}
                completeTodo={this._completeTodo}
                uncompleteTodo={this._uncompleteTodo}
                updateTodo={this._updateTodo}
              />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewTodo = text => {
    this.setState({
      newTodo: text
    });
  };

  _loadTodos = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      console.log(todos);
      this.setState({
        loadedTodos: true,
        todos: JSON.parse(todos)
      });
    } catch(err) {
      console.log(err);
    }
  };

  _addTodo = () => {
    const {newTodo} = this.state;
    if (newTodo !== "") {
      this.setState(prevState => {
        const ID = uuid.v4();
        const newTodoObject = {
          [ID] : {
            id: ID,
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newTodo: "",
          todos: {
            ...prevState.todos,
            ...newTodoObject
          }
        }
        this._saveTodos(newState.todos);
        return {...newState};
      });
    }
  }

  _deleteTodo = (id) => {
    this.setState(prevState => {
      const todos = prevState.todos;
      delete todos[id];
      const newState = {
        ...prevState,
        ...todos
      };
      this._saveTodos(newState.todos);
      return {...newState};
    })
  }

  _uncompleteTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: false
          }
        }
      }
      this._saveTodos(newState.todos);
      return {...newState};
    });
  }

  _completeTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: true
          }
        }
      }
      this._saveTodos(newState.todos);
      return {...newState};
    });
  }

  _updateTodo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            text: text
          }
        }
      }
      this._saveTodos(newState.todos);
      return {...newState};
    });
  }

  _saveTodos = (newTodos) => {
    const saveTodos = AsyncStorage.setItem("todos", JSON.stringify(newTodos))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 40,
    marginBottom: 30,
    fontWeight: "200"
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  todos: {
    alignItems: "center"
  }
});
