import React from 'react';
import { View, Text, Modal, Button, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { MessageShape } from '../utils/MessageUtils';
import MapView from 'react-native-maps';

const keyExtractor = (item) => item.id.toString();

export default class MessageList extends React.Component {
    static propTypes = {
        messages: PropTypes.array.isRequired,
        onPressDelete: PropTypes.func,
        onPressImage: PropTypes.func,
    };

    static defaultProps = {
        onPressDelete: () => {},
        onPressImage: () => {},
    };

    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            deleteItem: null,
        };
    }

    handlePressMessage = (item) => {
        this.setState({showModal: true, deleteItem: item});
    };

    handleDeleteConfirm = () => {
        this.props.onPressDelete(this.state.deleteItem);
        this.setState({showModal: false, deleteItem: null});
    };

    handleDeleteCancel = () => {
        this.setState({showModal: false, deleteItem: null});
    };


    renderMessageItem = ({ item }) => (
        <TouchableOpacity onPress = {() => this.handlePressMessage(item)}>
            {this.renderMessageBody(item)}
        </TouchableOpacity>
    );


    renderMessageBody = ({type, text, uri, coordinate}) => {
        switch (type) {
            case 'text':
                return (
                    <View style = {styles.messageBubble}>
                        <Text style = {styles.text}>{text}</Text>
                    </View>
                );
            case 'image':
                return (
                    <TouchableOpacity onPress={() => this.props.onPressImage(uri)}>
                        <View style = {styles.imageContainer}>
                          <Image source = {uri} style = {styles.image}/>
                        </View>

                    </TouchableOpacity>    
                );

            case 'location': 
                return (
                <View style = {styles.mapContainer}>
                    <Text>Location MEssage</Text>

                </View>
            );

            default:
                return null;
            }
    };

    render() {
        const { messages } = this.props;
        return (
            <View style = {styles.container}>
                <FlatList
                    style={styles.list}
                    inverted
                    data={messages}
                    renderItem={this.renderMessageItem}
                    keyExtractor={keyExtractor}
                    keyboardShouldPersistTaps='handled'
                />

                <Modal animationType='slide' transparent = {true} visible = {this.state.showModal} onRequestClose={() => this.handleDeleteCancel()}>
                    <View style = {styles.modalContainer}>
                        <View style = {styles.modalContent}>
                            <Text>Are you sure you want to delete this message?</Text>
                            <View style = {styles.modalButtonContainer}>
                                <Button title = 'Cancel' onPress={() => this.handleDeleteCancel()}/>
                                <Button title = 'Delete' onPress={() => this.handleDeleteConfirm()}/>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    
    }

    
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        overflow: 'visible',
    },
    list:{
        flex: 1,
    },

    messageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 60,
        marginBottom: 10,
    },
    messageBubble: {
        borderRadius: 10,
        padding: 10,
        margin: 5,
        backgroundColor: 'grey',
        maxWidth: '80%',
        alignSelf: 'flex-end',
    },
    messageText: {
        fontSize: 16,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        resizeMode: 'contain',
        width: '100%',
        aspectRatio: 1,
    },
    mapContainer: {
        width: 200,
        height: 200,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',

        },
    modalContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },

});

