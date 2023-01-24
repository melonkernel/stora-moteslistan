import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Select, Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const SheetData = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filteredColumns, setFilteredColumns] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [allNames, setAllNames] = useState([]);

  const hasBeen = (dateVal) => {
    var Currentdate = new Date();
    var dateArr = dateVal.split(".");
    var year = Currentdate.getFullYear();
    // 5.2 => 2023-5-2
    var inputDate = new Date('"' + year + "-" + dateArr[1] + "-" + dateArr[0] + '"').setHours(0, 0, 0, 0);
    var toDay = new Date().setHours(0, 0, 0, 0);
    if(toDay > inputDate){
        return false;
    }
    return true;

  }

  const isANameIn = (names, list) => {
    for (let name of names) {
        for (let listName of list) {
            if (listName.includes(name)) {
                return true;
            }
        }
    }
    return false;
  }

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
            fixed: index===0 ? 'left': 'none',
            participants: [...new Set(arr.slice(5).map(names => names.split('\n')).flat())],
            hasBeen: hasBeen(arr[0])
        };});
        setColumns([...events.filter(event => event.hasBeen)]);
        setFilteredColumns([...events.filter(event => event.hasBeen)]);

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
        setAllNames([...names].sort().map(name=>{return {"value":name, "label":name};}));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {

    setFilteredColumns([
        ...columns.slice(0, 1),
        ...columns.slice(1).filter(event => !nameFilter.length || isANameIn(nameFilter, event.participants))
            .map(event => {
                event.render = (text, record) => {
                return {
                    props: {
                        style: { background: nameFilter && isANameIn(nameFilter, text.split(", ")) ? "silver" : "" }
                    },
                    children: <div>{text}</div>
                };
            }
            return event;

        })
    ]);

  }, [nameFilter, columns]);

  const handleFilter = (value) => {
    setNameFilter(value);
  };

  return (
    <div>


        <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Filtrera för person(er)"
            onChange={handleFilter}
            options={allNames}
        />

      <Table
        dataSource={data}
        columns={filteredColumns}
        pagination={false}
        scroll={{ x: 1024, y: 500 }}
        size="small"
    />
    <br/>
    <Button type="primary" icon={<UserAddOutlined />} href="https://www.google.com/url?q=https%3A%2F%2Fbit.ly%2Febeneser2023&sa=D&sntz=1&usg=AOvVaw0SV87vYJlz1t_vYmOqpmUn">
      Jag vill också hjälpa till...
    </Button>
    </div>
  );
};

export default SheetData;