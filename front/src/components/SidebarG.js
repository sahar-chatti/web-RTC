import { ListGroup, Row, Col, Button, Modal } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sidebar.css";
import LoadingBox from "./Loading";
import Aos from "aos";
import "aos/dist/aos.css";

const SidebarG = () => {
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });

  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [groups, setGroups] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const user = useSelector((state) => state.user);
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);
  const dispatch = useDispatch();

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }

  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert("Please login");
    }
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    dispatch(resetNotifications(room));

    socket.off("notifications").on("notifications", (room) => {
      dispatch(addNotifications(room));
    });
  }
  useEffect(() => {
    if (user) {
      socket.emit("new-user");
    }
  }, [user]);

  socket.off("new-user").on("new-user", (payload) => {
    console.log(payload);
    setMembers(payload);
    console.log(members);
  });
  function handlePrivateMemberMsg(member) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }
  const createGroup = async (userId, groupName) => {
    try {
      const response = await fetch("http://localhost:5001/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, groupName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      const group = await response.json();
      // Handle the created group data
      console.log(group);
      setGroupName("");
      toast.success("Group Created");

      //setGroups([...groups,group])
    } catch (error) {
      console.error(error);
    }
  };

  const quitGroup = async (groupId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/user/${user._id}/group/${groupId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("U are Quit this Group.Please Wait");
        // Perform any additional actions or UI updates
      } else {
        toast.info("Failed to quit group.Please Refresh the Page");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleQuitGroup = (groupId) => {
    if (window.confirm("Are you sure you want to quit this group?")) {
      quitGroup(groupId);
      setTimeout(() => {
        window.location.reload();
      }, 7000);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:5001/groups/${groupId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Filter out the deleted group from the groups state
        setGroups(groups.filter((group) => group._id !== groupId));
        setCurrentRoom("");
        toast.success("Group deleted successfully,Please Wait");
        setTimeout(() => {
          window.location.reload();
        }, 7000);
      } else {
        toast.error("Failed to delete group");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      deleteGroup(groupId);
    }
  };
  const addMemberToGroup = async () => {
    try {
      const response = await fetch("http://localhost:5001/addMember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupName, memberName }),
      });

      if (response.ok) {
        toast.success("Member added to group");
        setMemberName("");
        // Perform any additional actions or UI updates
      } else {
        toast("Failed to add member to group");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    const fetchMyGroups = async () => {
      // Fetch the groups created by the user from the back-end
      try {
        const response = await fetch(
          `http://localhost:5001/groups/created-by/${user._id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Groups");
        }
        const data = await response.json();
        setGroups(data.group);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMyGroups();
  }, [groups]);
  if (!user) {
    return;
    <></>;
  }

  return (
    <>
      {" "}
      <div data-aos="fade-left">
        <div className="my-5">
          <input
            type="text"
            placeholder="Group Name"
            className="input border-white text-white border-5 rounded-5"
            value={groupName}
            required
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            className="noselect blue bt"
            onClick={() => createGroup(user._id, groupName)}
          >
            Create Group
          </button>
        </div>

        <div>
          <h2 className="text-white text-center">My Groups</h2>
          <ListGroup className="my-5 d-flex flex-column align-items-center">
            {loading ? (
              <LoadingBox />
            ) : (
              groups.map((group) => (
                <ListGroup.Item
                  key={group._id}
                  onClick={() => joinRoom(group.name)}
                  className="bg-secondary bg-opacity-50 text-white w-75 rounded-5"
                  active={group.name === currentRoom}
                  style={{
                    cursor: "pointer",
                    marginBottom: 10,
                  }}
                >
                  <Row>
                    <Col xs={5}>{group.name}</Col>
                    <Col xs={3}>
                      <i
                        onClick={() => handleDeleteGroup(group._id)}
                        class="fa-sharp fa-solid fa-trash fa-beat"
                      ></i>
                    </Col>
                    <Col xs={3}>
                      <i
                        onClick={() => handleQuitGroup(group._id)}
                        class="fa-sharp fa-solid mt-1 fa-door-open fa-beat"
                      ></i>
                    </Col>
                    {currentRoom.name !== group.name && (
                      <Col xs={1} className="badge rounded-5 bg-primary">
                        {user.newMessages[group.name]}
                      </Col>
                    )}
                  </Row>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </div>

        <h2 className="text-white mb-3 text-center">Add Member in ur Group</h2>
        <Button variant="primary" onClick={handleShow}>
          Add Friend
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton className=" bg-secondary">
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body className=" bg-secondary">
            <ListGroup className="mb-5">
              <div className="d-flex flex-column align-items-center">
                <input
                  type="text"
                  className="input mb-3 border-white text-white border-5"
                  placeholder="Member Name"
                  required
                  style={{ width: 200, borderRadius: 25 }}
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />
                {members.map((member) =>
                  member.name.toLowerCase() == memberName.toLowerCase() &&
                  member._id != user._id ? (
                    <ListGroup.Item
                      key={member.id}
                      style={{ cursor: "pointer" }}
                      className="rounded-5 border-danger  border-2 opacity-75 mb-3"
                      disabled
                    >
                      <Row className="text-center">
                        <Col xs={4} className="member-status">
                          <img
                            src={member.picture}
                            className="member-status-img"
                          />
                          {member.status == "online" ? (
                            <i className="fas fa-circle sidebar-online-status mx-2"></i>
                          ) : (
                            <i className="fas fa-circle sidebar-offline-status mx-2"></i>
                          )}
                        </Col>
                        <Col xs={8}>
                          {member.name}
                          {member._id === user?._id}
                          {member.status == "offline"}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ) : (
                    <></>
                  )
                )}
                <select
                  className="select bg-dark bg-opacity-50 text-white rounded-3 mb-4"
                  style={{ width: 200, height: 45 }}
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                >
                  <option value="">Select Group</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </ListGroup>
          </Modal.Body>
          <Modal.Footer className="d-flex align-items-center justify-content-center">
            <button
              className="noselect blue w-25 bt"
              onClick={addMemberToGroup}
            >
              Add Member
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default SidebarG;
