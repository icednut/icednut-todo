import React, {Component} from "react";
import {View, Text, Button, TouchableOpacity, StyleSheet, Dimensions, TextInput} from "react-native";
import PropTypes from "prop-types";

const {width, height} = Dimensions.get("window");

export default class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isEditing: false, todoValue: props.text};
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
  }
  state = {
    isEditing: false,
    todoValue: ""
  };
  
  render() {
    const {isEditing, todoValue} = this.state;
    const {text, isCompleted, id, deleteTodo} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View style={[styles.circle, isCompleted ? styles.completeCircle : styles.uncompleteCircle]}>
            </View>
          </TouchableOpacity>
          {isEditing ? (
          <TextInput 
            style={[styles.text, styles.input, isCompleted ? styles.completeText : styles.uncompleteText]} 
            value={todoValue} 
            multiline={true}
            onChangeText={this._controlInput}
            returnKeyType={"done"}
            onBlur={this._finishEditing}
          />
          ) : (
          <Text style={[styles.text, isCompleted ? styles.completeText : styles.uncompleteText]}>
            {text}
          </Text>)}
        </View>
        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✅</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✏️</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPressOut={() => deleteTodo(id)}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  _toggleComplete = () => {
    this.setState(prevState => {
      return ({
        isCompleted: !prevState.isCompleted
      });
    });
  }

  _startEditing = () => {
    this.setState({
      isEditing: true
    });
  }

  _finishEditing = () => {
    this.setState({
      isEditing: false
    });
  }

  _controlInput = (text) => {
    this.setState({ todoValue: text });
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "red",
    borderWidth: 3,
    marginRight: 20
  },
  completeCircle: {
    borderColor: "#bbb"
  },
  uncompleteCircle: {
    borderColor: "#F23657"
  },
  completeText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompleteText: {
    color: "#353839"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  input: {
    marginVertical: 20,
    width: width / 2
  }
});