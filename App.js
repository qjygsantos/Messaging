import React, { useState } from 'react';
import { StatusBar, View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { createTextMessage, createImageMessage, createLocationMessage } from './utils/MessageUtils';

import Status from './components/Status';
import MessageList from './components/MessageList';

export default function App() {
  const [messages, setMessages] = useState([
    createTextMessage('Tech Diggers Emtech3'),
    createImageMessage(require('messaging/assets/favicon.png')),
  
  ]);

  const [fullscreenImageUri, setFullscreenImageUri] = useState(null);

  const handlePressDelete = (item) => {
    const updatedMessages = messages.filter((message) => message.id !== item.id);
    setMessages(updatedMessages);
  };

  const handlePressImage = (uri) => {
    setFullscreenImageUri(uri);
  };

  const handleCloseFullscreenImage = () => {
    setFullscreenImageUri(null);
  };


  return (
    <View style={styles.container}>
      <Status/>

      <View style={styles.content}>
        <MessageList messages = {messages} onPressDelete = {handlePressDelete} onPressImage = {handlePressImage}
        />
      </View>

      <View style={styles.toolbar}>
        <Text>Toolbar</Text>
      </View>

      <View style={styles.inputMethodEditor}>
        <Text>IME</Text>
      </View>

    {fullscreenImageUri && (
      <Modal animationType='slide' transparent = {false} visible = {!!fullscreenImageUri}>
        <TouchableOpacity style = {styles.fullscreenContainer} onPress = {handleCloseFullscreenImage}>
          <Image style = {styles.fullscreenImage} source ={{uri: fullscreenImageUri}}/>
        </TouchableOpacity>
      </Modal>
    )}
    </View>
  
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
    backgroundColor: 'white',
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    resizeMode: 'contain',
    width: '100%',
    aspectRatio: 1,
  },
});
 