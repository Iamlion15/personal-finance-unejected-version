import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';
import { getUserData } from '../Utils/asyncStorageLoginDetails';
import axios from 'axios';
import { clearChats, addChat } from '../redux/slices/chatSlice';
import { useDispatch } from 'react-redux';

type SendMessageModalProps = {
    isVisible: boolean;
    onClose: () => void;
    admin: string;
    fetchChats: () => void;
};

type SendMessagePayload = {
    receiver: string;
    title: string;
    content: string;
};

const SendMessageModal: React.FC<SendMessageModalProps> = ({ isVisible, onClose, admin, fetchChats }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({ title: '', message: '' });
    const dispatch = useDispatch();
    const resetForm = () => {
        setTitle('');
        setMessage('');
        setErrors({ title: '', message: '' });
    };


    const handleSend = async () => {
        const newErrors = { title: '', message: '' };
        let hasError = false;

        if (!title.trim()) {
            newErrors.title = 'Title is required';
            hasError = true;
        }
        if (!message.trim()) {
            newErrors.message = 'Message is required';
            hasError = true;
        }

        setErrors(newErrors);

        if (!hasError) {
            try {
                const apiUrl = process.env.EXPO_PUBLIC_API_URL;
                const token = await getUserData();
                const config = {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                };

                const body = {
                    receiver: admin,
                    title: title.trim(),
                    content: message.trim(),
                };

                const response = await axios.post(`${apiUrl}/user/api/v1/message/send`, body, config);
                // await fetchChats()
                dispatch(clearChats());
                dispatch(addChat(response.data.message));
                resetForm();
                onClose();
            } catch (error) {
                console.error('Failed to send message:', error);
                // optionally show error UI here
            }
        }
    };


    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => {
                resetForm();
                onClose();
            }}
            onBackButtonPress={() => {
                resetForm();
                onClose();
            }}
            backdropOpacity={0.4}
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
        >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} className="">
                <View className="w-[90%] bg-white rounded-2xl p-6 shadow-lg">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-xl font-semibold text-gray-900">Send Message</Text>
                        <TouchableOpacity
                            onPress={() => {
                                resetForm();
                                onClose();
                            }}
                            className="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300"
                        >
                            <Feather name="x" size={22} color="#1F2937" />
                        </TouchableOpacity>
                    </View>

                    {/* Title Input */}
                    <View className="mb-4">
                        <Text className="text-sm text-gray-800 mb-1">Title</Text>
                        <TextInput
                            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-gray-100 focus:border-blue-500"
                            placeholder="Enter message title"
                            placeholderTextColor="#9CA3AF"
                            value={title}
                            onChangeText={(text) => {
                                setTitle(text);
                                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                            }}
                        />
                        {errors.title && (
                            <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>
                        )}
                    </View>

                    {/* Message Input */}
                    <View className="mb-6">
                        <Text className="text-sm text-gray-800 mb-1">Message</Text>
                        <TextInput
                            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-gray-100 h-28 focus:border-blue-500"
                            placeholder="Type your message..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            textAlignVertical="top"
                            value={message}
                            onChangeText={(text) => {
                                setMessage(text);
                                if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                            }}
                        />
                        {errors.message && (
                            <Text className="text-red-500 text-xs mt-1">{errors.message}</Text>
                        )}
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row justify-end space-x-3">
                        <TouchableOpacity
                            className="bg-gray-200 mx-4 rounded-xl px-6 py-3 shadow-sm"
                            onPress={() => {
                                resetForm();
                                onClose();
                            }}
                            activeOpacity={0.7}
                        >
                            <Text className="text-gray-800 font-semibold text-base">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`rounded-xl px-6 py-3 shadow-sm ${title.trim() && message.trim() && 'bg-blue-500'}`}
                            onPress={handleSend}
                            disabled={!title.trim() || !message.trim()}
                        >
                            <Text className={`${title.trim() && message.trim() ? 'text-white' : 'text-black'} font-semibold text-base`}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default SendMessageModal;
