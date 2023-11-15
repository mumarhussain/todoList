import React, { useState, useEffect } from "react";
import { Button, Checkbox, Input, Spin, Table, Upload, DatePicker } from "antd";
import { TimePicker } from "antd";
import { useStore } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useToasts } from "react-toast-notifications";
import Modal from "antd/es/modal/Modal";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Column from "antd/es/table/Column";
import "react-day-picker/dist/style.css";
import "./style.css";

function TodosModal({ modalOpen, setModalOpen }) {
  const initialFormState = {
    title: "",
    description: "",
    date: "",
    time: "",
  };
  const [userInfo, setUserInfo] = useState(initialFormState);
  const [isButtonShow, setIsButtonShow] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [imageObject, setImageObject] = useState([]);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const {
    tasks,
    deleteTask,
    addTaskInfo,
    getImages,
    updateTask,
    completeTask,
  } = useStore();

  const todoId = Math.random().toString(36).substring(2);
  const format = "HH:mm";
  const { addToast } = useToasts();
  useEffect(() => {
    if (date && time) {
      const isoDateString = `${date}T${time}`;
      const notificationDate = new Date(isoDateString);
      const formattedDate = notificationDate.toISOString().split("T")[0];
      const formattedTime = notificationDate
        .toISOString()
        .split("T")[1]
        .split(".")[0];
      const secondsDiff =
        (notificationDate.getTime() - new Date().getTime()) / 1000;

      const timeoutId = setTimeout(() => {
        addToast("Your task is overdue!", {
          appearance: "success",
          autoDismiss: true,
        });
      }, secondsDiff * 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [addToast, date, time]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTodo = async () => {
    setLoading(true);
    if (!userInfo?.title || !userInfo?.description || !date) {
      return;
    }
    const folderName = "images";
    const imageUrls = await Promise.all(
      imageObject.map(async (image) => {
        const fileName = `${folderName}/${image.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        return url;
      })
    );
    const tasksInfo = {
      title: userInfo.title,
      description: userInfo.description,
      date: date,
      todoId: todoId,
      image: imageUrls,
      time: time,
    };
    try {
      await setDoc(doc(db, "currentTodos", todoId), tasksInfo);
    } catch (error) {}
    addTaskInfo(tasksInfo);
    setUserInfo(initialFormState);
    setFileList([]);
    setImageObject([]);
    setModalOpen(false);
    setLoading(false);
  };

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => {
        setFileList((prev) => [...prev, { url: reader.result }]);
        setImageObject((prevImageObject) => [...prevImageObject, file]);
        getImages(fileList);
      };
    };

    return false;
  };

  const handleRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = [...fileList];
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const handleDeleteTodo = async (id) => {
    const updatedTasks = tasks.filter((task) => task.todoId !== id);
    console.log(updatedTasks);
    deleteTask(updatedTasks);
  };

  const handleEdit = async (id) => {
    setOpenEditModal(true);
    setModalOpen((prevState) => !prevState);
    const selectedIndex = tasks.findIndex((task) => task.todoId === id);
    let selectedTask = tasks[selectedIndex];
    console.log(selectedTask, " selected");
    setSelectedTaskIndex(selectedIndex);
    setUserInfo(selectedTask);
    setFileList(selectedTask.image.map((url) => ({ url })));
  };

  const updateTodo = async (id) => {
    setLoading(true);
    try {
      if (!userInfo?.title || !userInfo?.description || !date) {
        throw new Error("Please provide all required information.");
      }
      const folderName = "images";
      const imageUrls = await Promise.all(
        imageObject.map(async (image) => {
          const fileName = `${folderName}/${image.name}`;
          const storageRef = ref(storage, fileName);
          await uploadBytes(storageRef, image);
          const url = await getDownloadURL(storageRef);
          return url;
        })
      );
      const tasksInfo = {
        title: userInfo.title,
        description: userInfo.description,
        date: date,
        todoId: todoId,
        image: imageUrls,
        time: time,
      };
      let allData = [...tasks];
      allData[selectedTaskIndex] = tasksInfo;
      updateTask(allData);
      setModalOpen(false);
      setLoading(false);
      setUserInfo(initialFormState);
    } catch (error) {}
  };

  const onCheckBoxChange = (id) => {
    setIsButtonShow((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCompleteTasks = async () => {
    try {
      await Promise.all(
        isButtonShow.map(async (todoId) => {
          await deleteDoc(doc(db, "currentTodos", todoId));
        })
      );
      const completedTasks = tasks.filter((task) =>
        isButtonShow.includes(task.todoId)
      );
      await Promise.all(
        completedTasks.map(async (task) => {
          const { todoId, ...taskData } = task;
          await setDoc(doc(db, "completeTasks", todoId), taskData);
        })
      );

      const remainingTasks = tasks.filter(
        (task) => !isButtonShow.includes(task.todoId)
      );
      completeTask(remainingTasks);
      setIsButtonShow([]);
    } catch (error) {
      alert("Error completing tasks");
    }
    setLoading(false);
  };

  const onDateChange = (date, dateString) => {
    setDate(dateString);
    console.log(dateString);
  };

  dayjs.extend(customParseFormat);
  const onTimeChange = (time, timeString) => {
    setTime(timeString);

    console.log(timeString);
  };

  return (
    <>
      {/* {loading ? (
        <div className="flex justify-center items-center h-[100vh] spinner">
          <Spin size="default" />
        </div>
      ) : (
        <> */}
      <div>
        <div className="flex justify-end mx-10 mb-3 space-x-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-400 w-32 py-2 rounded-md text-white font-bold "
          >
            Add Task
          </button>
          {isButtonShow?.length > 0 ? (
            <button
              onClick={() => {
                handleCompleteTasks();
                setLoading(true);
              }}
              className=" border border-blue-400 w-36 hover:bg-blue-400 hover:text-white py-2 rounded-md text-blue-400 font-bold "
            >
              {loading ? <Spin /> : "Completed Task"}
            </button>
          ) : null}
        </div>

        <Table
          dataSource={tasks.slice().reverse()}
          pagination={false}
          className="myTable mx-10"
        >
          <Column
            title="Check box"
            dataIndex="todoId"
            key="todoId"
            render={(todoId) => (
              <div>
                <Checkbox onClick={() => onCheckBoxChange(todoId)} />
              </div>
            )}
          />
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
                  onClick={() => {
                    setIsOpen(true);
                    setPreviewImage(image);
                    setPhotoIndex(0);
                  }}
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
                  onClick={() => handleEdit(todoId)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  width={15}
                  className="ml-3 text-red-500 text-lg cursor-pointer"
                  onClick={() => handleDeleteTodo(todoId)}
                />
              </div>
            )}
          />
        </Table>
        <Modal
          className="modal text-center w-full md:height[620px] p-0"
          centered
          open={modalOpen}
          width={580}
          style={{ height: 620, padding: 0 }}
          onCancel={() => {
            setModalOpen(false);
            setUserInfo(initialFormState);
            setOpenEditModal(false);
            setFileList([]);
            setImageObject([]);
          }}
          okButtonProps={{ className: "custom-ok-button" }}
          closeIcon={
            <div className=" right-2 ">
              <svg
                onClick={() => setModalOpen(false)}
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white cursor-pointer md:-mt-[10px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width={20}
                height={20}
              >
                <pat
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>{" "}
            </div>
          }
          footer={[
            <div className=" pb-5 mr-3" key={"index"}>
              <Button
                key="cancel"
                onClick={() => {
                  setModalOpen(false);
                  setUserInfo(initialFormState);
                  setOpenEditModal(false);
                  setFileList([]);
                  setImageObject([]);
                }}
                className=" button  border-primary text-primary hover:bg-none "
              >
                Cancel
              </Button>

              <Button
                key="ok"
                type="primary"
                onClick={() => {
                  openEditModal ? updateTodo(userInfo?.todoId) : handleTodo();
                }}
                className="button  text-white bg-blue-600 font-bold hover:bg-none"
              >
                {openEditModal ? (
                  loading ? (
                    <Spin />
                  ) : (
                    "Update"
                  )
                ) : loading ? (
                  <Spin />
                ) : (
                  "Add Task"
                )}
              </Button>
            </div>,
          ]}
        >
          <div className=" w-full h-full flex items-center flex-col">
            <div className="mr-auto w-full flex rounded-t-md bg-blue-500">
              <p className="text-xl pl-3 text-white py-4">
                {" "}
                {openEditModal ? "Update Todos" : "Add New Todos"}
              </p>
            </div>
            <div className=" md:p-5 rounded-md mb-2 flex flex-col  w-[85%]  justify-center ">
              <div className="flex flex-col items-start relative md:mt-3 mt-4">
                <div className="absolute top-[calc(50%_-_56.5px)] z-20 left-[19.89px] rounded-3xs bg-white w-[50.67px] h-[22.56px] flex flex-row py-px px-1 box-border items-center justify-center">
                  <p className="absolute text-lg leading-[100%] z-20 pt-1 ">
                    Title
                  </p>
                </div>
                <div className=" flex flex-col md:flex-row  md:justify-between w-[100%]">
                  <Input
                    placeholder="Add Title Here"
                    type="text"
                    name="title"
                    value={userInfo.title}
                    onChange={handleChange}
                    className="border outline-none md:w-[700px] z-10 w-full rounded-[10px]  mb-8 py-5 flex justify-center text-xs relative"
                  />
                </div>
              </div>

              <p className="mb-2 font-Manrope font-bold  pl-5 lg:pl-0">Image</p>
              <div className=" flex flex-start w-full  pl-5 lg:pl-0 mb-8">
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  fileList={fileList}
                  onRemove={handleRemove}
                  beforeUpload={beforeUpload}
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: true,
                  }}
                >
                  {fileList?.length < 5 && "+ Upload"}
                </Upload>
              </div>

              <div className="flex flex-col items-start relative">
                <div className="absolute top-[calc(50%_-_60.5px)] z-20 left-[19.89px] rounded-3xs bg-white w-[105.67px] h-[22.56px] flex flex-row py-px px-1 box-border items-center justify-center">
                  <p className="absolute text-lg leading-[100%] z-20 pt-1">
                    Description
                  </p>
                </div>
                <div className=" flex flex-col md:flex-row  md:justify-between w-[100%]">
                  <Input
                    placeholder="Add Description Here"
                    type="text"
                    name="description"
                    value={userInfo.description}
                    onChange={handleChange}
                    className="border outline-none md:w-[700px] z-10 w-full rounded-[10px]  mb-10  py-5 flex justify-center text-xs relative"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start relative">
                <div className="absolute top-[calc(50%_-_65.5px)] z-20 left-[19.89px] rounded-3xs bg-white w-[50.67px] h-[22.56px] flex flex-row py-px px-1 box-border items-center justify-center">
                  <p className="absolute text-lg leading-[100%] z-20 pt-1 ">
                    Date
                  </p>
                </div>
                <div className=" flex flex-col md:flex-row  md:justify-between w-[100%]">
                  <DatePicker
                    onChange={onDateChange}
                    className="border outline-none md:w-[450px] z-10 w-full rounded-[10px]  mb-10 py-5 flex justify-center text-xs relative"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start relative">
                <div className="absolute top-[calc(50%_-_59.5px)] z-20 left-[19.89px] rounded-3xs bg-white w-[50.67px] h-[22.56px] flex flex-row py-px px-1 box-border items-center justify-center">
                  <p className="absolute text-lg leading-[100%] z-20 pt-1 ">
                    Time
                  </p>
                </div>
                <TimePicker
                  onChange={onTimeChange}
                  className="border outline-none md:w-[450px] z-10 w-full rounded-[10px]  mb-8 py-5 flex justify-center text-xs relative"
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
      {/* </>
      )} */}
    </>
  );
}

export default TodosModal;
