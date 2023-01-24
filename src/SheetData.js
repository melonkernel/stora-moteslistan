import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, AutoComplete } from 'antd';

const SheetData = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [allNames, setAllNames] = useState([]);

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
            width: index===0 ? 140: 185,
            fixed: index===0 ? 'left': 'none'
        };});
        setColumns([...events]);

        setData(jobNames.map((jobName, jobIndex) => [
            jobName,
            ...values.map(eventJobs => (!eventJobs[jobIndex] ? "" : eventJobs[jobIndex]).trim().replace(/\n/, ", ") )
        ]));

        const names = new Set();
        values.slice(1).forEach((row) => {
            row.slice(5).forEach((column) => {
                column.split('\n').forEach(name => names.add(name))
            });
        });
        setAllNames([...names]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
/*
  useEffect(() => {

    const included = Array(data[0].length()).fill(false);
    data.forEach(row => {
        row.forEach((column, index) => {
            if (column.includes(nameFilter)) {
                included[index] = true;
            }
        })
    })


  }, [nameFilter, data]);*/

  const handleFilter = (value) => {
    setNameFilter(value);
  };

  return (
    <div>
    <AutoComplete
        style={{ width: 300 }}
        onSelect={handleFilter}
        onSearch={handleFilter}
        placeholder="Filter by name"
        dataSource={allNames}
      />
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