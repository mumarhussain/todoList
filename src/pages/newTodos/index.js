import React, { useEffect, useState } from "react";
import { Table } from "antd";
import Column from "antd/es/table/Column";
import { collection, getDocs } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../firebase";

function UpcomingTodos() {
  const [upcomingData, setUpcomingData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "UpcomingTodos"));
        const dataArr = [];

        querySnapshot.forEach((doc) => {
          dataArr.push(doc.data());
        });

        setUpcomingData(dataArr);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log(upcomingData);
  return (
    <div>
      {/* <Table dataSource={upcomingData} pagination={false}>
      
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Date" dataIndex="date" key="date" />
        <Column
          title="Images"
          dataIndex="image"
          key="image"
          render={(image) => (
            <div className="flex items-center cursor-pointer">
              <img
                alt="sdf"
                width={200}
                height={200}
                src={image && image.length > 0 ? image[0] : ""}
                className="ml-3 w-[80px]"
             
              />
            </div>
          )}
        />
        <Column
          title="Edit"
          dataIndex="todoId"
          key="todoId"
          render={(todoId) => (
            <div>
              <FontAwesomeIcon
                icon={faPenToSquare}
                width={15}
                className="ml-3 text-green-500 text-lg cursor-pointer"
              />
              <FontAwesomeIcon
                icon={faTrash}
                width={15}
                className="ml-3 text-red-500 text-lg cursor-pointer"
              />
            </div>
          )}
        />
      </Table> */}
    </div>
  );
}

export default UpcomingTodos;
