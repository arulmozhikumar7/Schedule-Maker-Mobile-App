import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, Text, Alert} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Form from './Form';
import {utils, write} from 'xlsx';
import RNBU from 'react-native-blob-util';
const TableComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCellIndex, setSelectedCellIndex] = useState(null);
  const [newValue, setNewValue] = useState('');

  const [activities, setActivities] = useState([
    ['', '', '', '', '', '', '', ''],
    ['Mon', '', '', '', '', '', '', ''],
    ['Tue', '', '', '', '', '', '', ''],
    ['Wed', '', '', '', '', '', '', ''],
    ['Thur', '', '', '', '', '', '', ''],
    ['Fri', '', '', '', '', '', '', ''],
    ['Sat', '', '', '', '', '', '', ''],
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
      const worksheetData = [...activities];

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
  const exportToPdf = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              
              table {
                border-collapse: collapse;
                width: 100%;
                
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: center;
                width: 50px;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <table>
              ${activities
                .map(
                  rowData =>
                    `<tr>${rowData
                      .map(item => `<td>${item}</td>`)
                      .join('')}</tr>`,
                )
                .join('')}
            </table>
          </body>
        </html>
      `;
      const options = {
        html: htmlContent,
        fileName: 'activities.pdf', // Specify the file name
        directory: 'Download', // Use the Download directory
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      const mimeType = 'application/pdf';
      const pdfFileName = 'activities.pdf';

      await RNBU.MediaCollection.copyToMediaStore(
        {parentFolder: '', mimeType, name: pdfFileName},
        'Download',
        pdf.filePath,
      );

      Alert.alert('Exported to PDF', `PDF saved to Download folder`);
    } catch (error) {
      Alert.alert(
        'Export Error',
        `Error exporting activities to PDF: ${error}`,
      );
    }
  };

  return (
    <View className="w-[90%] m-5">
      <ScrollView horizontal alwaysBounceVertical={true}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          {activities.map((rowData, rowIndex) => (
            <Row
              className="w-[900px]"
              key={rowIndex}
              data={rowData.map((item, cellIndex) => (
                <TouchableOpacity
                  key={cellIndex}
                  onPress={() => handleRowClick(rowIndex, cellIndex, item)}>
                  <Text className="p-5 text-center">{item}</Text>
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

      <TouchableOpacity
        onPress={exportToPdf}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#197085',
          borderRadius: 5,
        }}>
        <Text style={{color: 'white', textAlign: 'center'}}>Export Pdf</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TableComponent;
