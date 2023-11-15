import { Table } from "antd";
import Column from "antd/es/table/Column";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

function CompletedTodos() {
  const [completedTasks, setCompletedTasks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "completeTasks"));
        const dataArr = [];
        querySnapshot.forEach((doc) => {
          dataArr.push(doc.data());
        });
        setCompletedTasks(dataArr);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log(completedTasks);
  return (
    <div>
      <Table dataSource={completedTasks} pagination={false}>
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
                onClick={() => {
                  // setIsOpen(true);
                  // setPreviewImage(image);
                  // setPhotoIndex(0);
                }}
              />
            </div>
          )}
        />
      </Table>
    </div>
  );
}

export default CompletedTodos;
