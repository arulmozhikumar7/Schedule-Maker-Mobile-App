import {View, ScrollView, TouchableOpacity, Text, Alert} from 'react-native';
import React, {useState} from 'react';
import {Table, Row, Rows} from 'react-native-table-component';
const TableComponent = () => {
  const [activities, setActivities] = useState([
    ['8:00AM to 9:00AM', '', '', '', '', '', ''],
    ['9:00AM to 10:00AM', '', '', '', '', '', ''],
    ['10:00AM to 11:00AM', '', '', '', '', '', ''],
    ['12:00PM to 1:00PM', '', '', '', '', '', ''],
    ['2:00PM to 3:00AM', '', '', '', '', '', ''],
    ['3:00AM to 4:00AM', '', '', '', '', '', ''],
    ['4:00AM to 5:00AM', '', '', '', '', '', ''],
  ]);
  const handleRowClick = (index, cellIndex) => {
    Alert.alert(`Row: ${index + 1}, Cell: ${cellIndex}`);
  };
  return (
    <View className="w-[90%] m-5">
      <ScrollView horizontal alwaysBounceVertical={true}>
        <Table
          borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}
          className="ml-1">
          <Row
            data={['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
            style={{height: '10%', backgroundColor: '#f1f8ff'}}
            className="w-[900px]"
            textStyle={{textAlign: 'center', fontWeight: 'bold'}}
          />
          {activities.map((rowData, rowIndex) => (
            <Row
              borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}
              className="w-[900px]"
              data={rowData.map((item, cellIndex) => (
                <TouchableOpacity
                  key={cellIndex}
                  onPress={() => handleRowClick(rowIndex, cellIndex)}>
                  <Text className="text-center">{item}</Text>
                </TouchableOpacity>
              ))}
              style={{height: 80}}
              textStyle={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 15,
              }}
            />
          ))}
        </Table>
      </ScrollView>
    </View>
  );
};

export default TableComponent;
