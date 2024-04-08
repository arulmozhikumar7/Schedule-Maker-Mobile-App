import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, Text, Alert} from 'react-native';
import {Table, Row} from 'react-native-table-component';

import Form from './Form';
import {utils, write} from 'xlsx';
import RNBU from 'react-native-blob-util';
const TableComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCellIndex, setSelectedCellIndex] = useState(null);
  const [newValue, setNewValue] = useState('');

  const [activities, setActivities] = useState([
    ['8:00AM to 9:00AM', '', '', '', '', '', ''],
    ['9:00AM to 10:00AM', '', '', '', '', '', ''],
    ['10:00AM to 11:00AM', '', '', '', '', '', ''],
    ['12:00PM to 1:00PM', '', '', '', '', '', ''],
    ['2:00PM to 3:00AM', '', '', '', '', '', ''],
    ['3:00AM to 4:00AM', '', '', '', '', '', ''],
    ['4:00AM to 5:00AM', '', '', '', '', '', ''],
  ]);

  const handleRowClick = (rowIndex, cellIndex, newValue) => {
    setSelectedRow(rowIndex);
    setSelectedCellIndex(cellIndex);
    setModalVisible(true);
    setNewValue(newValue);
  };

  const handleFormSubmit = newValue => {
    const updatedActivities = [...activities];
    updatedActivities[selectedRow][selectedCellIndex] = newValue;
    setActivities(updatedActivities);
    setModalVisible(false);
    setSelectedRow(null);
    setSelectedCellIndex(null);
  };
  const exportToCsv = async () => {
    try {
      const headers = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const worksheetData = [headers, ...activities];

      const worksheet = utils.aoa_to_sheet(worksheetData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Activities');

      const buf = write(workbook, {type: 'buffer', bookType: 'xlsx'});

      const filename = RNBU.fs.dirs.DocumentDir + '/activities.xlsx';
      await RNBU.fs.writeFile(filename, Array.from(buf), 'ascii');

      const mimeType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      await RNBU.MediaCollection.copyToMediaStore(
        {parentFolder: '', mimeType, name: 'activities.xlsx'},
        'Download',
        filename,
      );

      Alert.alert(
        'Exported to Excel',
        `Activities exported to Download folder`,
      );
    } catch (error) {
      Alert.alert('Export Error', `Error exporting activities: ${error}`);
    }
  };

  const convertToCsv = data => {
    const csvRows = [];
    for (const row of data) {
      csvRows.push(row.join(','));
    }
    return csvRows.join('\n');
  };

  return (
    <View className="w-[90%] m-5">
      <ScrollView horizontal alwaysBounceVertical={true}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row
            className="w-[900px]"
            data={['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
            style={{height: '10%', backgroundColor: '#f1f8ff'}}
            textStyle={{textAlign: 'center', fontWeight: 'bold'}}
          />
          {activities.map((rowData, rowIndex) => (
            <Row
              className="w-[900px]"
              key={rowIndex}
              data={rowData.map((item, cellIndex) => (
                <TouchableOpacity
                  key={cellIndex}
                  onPress={() => handleRowClick(rowIndex, cellIndex, item)}>
                  <Text className="text-center p-5">{item}</Text>
                </TouchableOpacity>
              ))}
              style={{height: 80, backgroundColor: '#ffffff'}}
              textStyle={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 15,
              }}
            />
          ))}
        </Table>
      </ScrollView>
      <Form
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmit={handleFormSubmit}
      />
      <TouchableOpacity
        onPress={exportToCsv}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#197085',
          borderRadius: 5,
        }}>
        <Text style={{color: 'white', textAlign: 'center'}}>Export CSV</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TableComponent;
