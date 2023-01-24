import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'antd';

const SheetData = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    axios
      .get('https://sheets.googleapis.com/v4/spreadsheets/1g7JIGmfrRMuz-B7gQqRRB5rHym7Bise5ViSywsv64Bo/values/Uppgifter?alt=json&key=AIzaSyCqz4QkS4hElN5KGFvpJhqsRxVhbzTTYEg')
      .then((response) => {

        const jobNames = response.data.values[0];
        const values = response.data.values;
        const events = values.map((arr,index) => {return {
            title: arr[0],
            dataIndex: index+1,
            key: index+1,
            width: index===0 ? 100: 180,
            fixed: index===0 ? 'left': 'none'
        };});
        setColumns([...events]);
        const daaata = jobNames.map((jobName, jobIndex) => [
            jobName,
            ...values.map(eventJobs => (!eventJobs[jobIndex] ? "" : eventJobs[jobIndex]).trim().replace(/\n/, ", ") )
        ]);
        setData(daaata);

        /*
        setData(values);
        setFilteredData(data);
        // Extract all unique names from the data
        const names = new Set();
        values.forEach((row) => {
            row.slice(5).forEach((column) => {
                column.split('\n').forEach(name => names.add(name))
            });
        });
        setAllNames([...names]);*/
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
            pageSize:100,
        }}
        scroll={{ x: 1024, y: 800 }}
    />
    </div>
  );
};

export default SheetData;