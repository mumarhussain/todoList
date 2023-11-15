import { Spin, Table } from "antd";
import Column from "antd/es/table/Column";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

function CompletedTodos() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "completeTasks"));
        const dataArr = [];
        querySnapshot.forEach((doc) => {
          dataArr.push(doc.data());
        });
        setCompletedTasks(dataArr);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[100vh] spinner">
          <Spin size="default" />
        </div>
      ) : (
        <>
          <div>
            <Table dataSource={completedTasks} pagination={false} className="myTable mx-10">
              <Column title="Title" dataIndex="title" key="title" />
              <Column
                title="Description"
                dataIndex="description"
                key="description"
              />
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
            </Table>
          </div>
        </>
      )}
    </>
  );
}

export default CompletedTodos;
