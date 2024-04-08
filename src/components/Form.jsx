import {View, Text, Modal, Pressable, TextInput} from 'react-native';
import React, {useState} from 'react';

const Form = ({modalVisible, setModalVisible, onSubmit}) => {
  const [taskName, setTaskName] = useState('');

  const handleSubmit = () => {
    if (!taskName.trim()) {
      alert('Please enter a task name');
      return;
    }
    // Pass the task name to the onSubmit function
    onSubmit(taskName);
    // Clear the input field and close the modal
    setTaskName('');
  };
  const handleDelete = () => {
    setTaskName('');
    onSubmit(taskName);
    setModalVisible(false);
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View className="flex-1 justify-center items-center bg-[#00000080]">
        <View className="bg-white p-6  w-[80%] rounded-2xl">
          <Text className="text-text-color mb-1">Task Name:</Text>
          <TextInput
            className="rounded-2xl mb-3 p-3 border border-[#197085]"
            value={taskName}
            onChangeText={setTaskName}
          />

          <Pressable
            className="bg-[#197085] p-3 rounded-2xl mb-5"
            onPress={handleSubmit}>
            <Text className="text-center text-white">Add Value</Text>
          </Pressable>
          <Pressable
            className="bg-[#197085] p-3 rounded-2xl"
            onPress={handleDelete}>
            <Text className="text-center text-white">Delete Value</Text>
          </Pressable>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={{marginTop: 10}}>
            <Text className="text-center text-text-color">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Form;
