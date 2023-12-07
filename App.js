import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Alert, BackHandler, Image, Modal, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import MessageList from "./components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';
import Toolbar from "./components/Toolbar";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        createImageMessage('https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U'),
        createTextMessage('Tech Diggers'),
        createTextMessage('Hello'),
        createLocationMessage({
          latitude: 14.5919708, 
          longitude: 121.107063,
        }),
      ],
      fullScreenImage: null,
      isInputFocused: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  handleBackPress = () => {
    if (this.state.fullScreenImage) {
      this.setState({ fullScreenImage: null });
      return true;
    }
    return false;
  };

  handlePressMessage = (message) => {
    if (message.type === 'image') {
      this.setState({ fullScreenImage: message.uri });
    } else {
      Alert.alert(
        'Delete Message',
        'Are you sure you want to delete this message?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => this.deleteMessage(message),
            style: 'destructive',
          },
        ],
      );
    }
  };

  handlePressToolbarCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is not granted');
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log("Camera result:", result); 
  
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      console.log('Captured image URI:', result.assets[0].uri);
      this.setState({
        messages: [createImageMessage(result.assets[0].uri), ...this.state.messages],
      });
    }
  };
  handlePressToolbarLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      messages: [createLocationMessage({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }), ...this.state.messages],
    });
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  deleteMessage = (message) => {
    const updatedMessages = this.state.messages.filter(m => m !== message);
    this.setState({ messages: updatedMessages });
  };

  renderMessageList() {
    const { messages } = this.state;
  
    return (
      <ScrollView style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
        {this.renderFullScreenImage()}
      </ScrollView>
    );
  }
  

  renderFullScreenImage() {
    const { fullScreenImage } = this.state;

    if (!fullScreenImage) {
      return null;
    }

    return (
      <Modal
        transparent
        animationType="slide"
        visible={!!fullScreenImage}
        onRequestClose={() => this.setState({ fullScreenImage: null })}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity
            style={styles.fullScreenImageWrapper}
            onPress={() => this.setState({ fullScreenImage: null })}
          >
            <Image style={styles.fullScreenImage} source={{ uri: fullScreenImage }} />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <KeyboardAvoidingView 
    behavior={Platform.OS === "ios" ? "padding" : "height"} 
    
  >
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
      </KeyboardAvoidingView>
    );
  }



  render() {
    return (
      <View style={styles.container}>
        {this.renderMessageList()}
        {this.renderToolbar()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreenImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Message;