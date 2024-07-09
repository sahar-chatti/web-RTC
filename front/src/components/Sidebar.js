import { ListGroup, Row, Col, Button } from "react-bootstrap";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logger from "use-reducer-logger";
import Aos from "aos";
import "aos/dist/aos.css";

import "./Sidebar.css";
import LoadingBox from "./Loading";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, friendList: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Sidebar() {
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [friendsList, setFriendList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [groups, setGroups] = useState([]);

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
  /*const [{ loading, error, friendList }, dispatching] = useReducer(
    logger(reducer),
    {
      friendList: [],
      loading: true,
      error: "",
    }
  );*/

  function getRooms() {
    fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

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
  useEffect(() => {}, []);

  /*const handleAddMember = () => {
    setMembersGroup([...membersGroup, memberName]);
    setMemberName('');
  };
  const handleDeleteMember = (index) => {
    const updatedMembers = [...membersGroup];
    updatedMembers.splice(index, 1);
    setMembersGroup(updatedMembers);
  };
   */
  useEffect(() => {
    if (user) {
      socket.emit("new-user");
    }
  }, []);

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
  /*const handleFriendClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: user._id, name: name }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add friend');
      }
  
      // Handle the response accordingly
      const responseData = await response.text();
      console.log(responseData);
  
      // Update the friendList state if the friend is not already added
      const isFriendAdded = friendList.find((friend) => friend[0]._id === userfriend[0]._id);
      if (!isFriendAdded) {
        setFriendList([...friendList, userfriend]);
      }
    } catch (error) {
      console.error(error);
    }
  };*/
  const handleFriendClick = async () => {
    try {
      const response = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: user._id, name: name }),
      });

      if (!response.ok) {
        console.log(response);
        toast.error("Please Try Again");
        throw new Error("Failed to add friend");
      }

      const updatedUser = await response.json();

      console.log(updatedUser);
      setFriendList([...updatedUser.friendsList]);
      toast.success("Friend Added Successfully");
      setName("");
    } catch (error) {
      console.log("Please Try Again");
    }
  };

  // ...

  /*const saveFriendList = async (userId, friendList) => {
      try {
        const response = await fetch('http://localhost:5001/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId:user._id, friendsList:friendList }),
        });
    
        if (!response.ok) {
          throw new Error('Error saving friend list');
        }
    
        console.log('Friend list saved:', user.friendsList);
      } catch (error) {
        alert('Error saving friend list:', error);
      }
    };*/
  const handleDeleteFriend = async (friendId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/chat/${user._id}/friends/${friendId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete friend");
      }

      // Remove the friend from the friendList in the front-end
      const updatedFriendList = friendsList.filter(
        (friend) => friend._id !== friendId
      );
      setFriendList(updatedFriendList);
      setCurrentRoom("");
      toast.success("Friend Deleted Successfully.Just Wait to clear Message");
      setTimeout(() => {
        window.location.reload();
      }, 7000);
    } catch (error) {
      console.error(error);
    }
  };

  /*useEffect(() => {
    const fetchFriendList = async () => {
      dispatching({ type: "FETCH_REQUEST" });
      try {
        const response = await fetch(
          `http://localhost:5001/users/${user._id}/friends`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch friend list");
        }

        const friendListData = await response.json();
        setFriendList(friendListData);
        dispatching({ type: "FETCH_SUCCESS", payload: friendListData });
      } catch (error) {
        dispatching({ type: "FETCH_FAIL", payload: error });
      }
    };

    // Call the fetchFriendList function
    fetchFriendList();
  }, [friendsList]);*/
  useEffect(() => {
    const fetchMyGroups = async () => {
      // Fetch the groups created by the user from the back-end
      try {
        const response = await fetch(
          `http://localhost:5001/users/${user._id}/friends`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Groups");
        }
        const data = await response.json();
        setFriendList(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMyGroups();
  }, [friendsList]);

  if (!user) {
    return;
    <></>;
  }

  return (
    <div data-aos="fade-right">
      {/* <h2 className='text-white'>Avaible rooms</h2>
    <ListGroup>
    <ul>
        {/*groups.map((group) => (
          <li key={group._id}>
            <h3>{group.name}</h3>
            <p>Members:</p>
            <ul>
              {group.members.map((member) => (
                <li key={member._id}>{member.name}</li>
              ))}
            </ul>
          </li>
              ))}
      </ul>
    {/*rooms.map((room, idx) => (
            <ListGroup.Item key={idx}onClick={()=>joinRoom(room)} 
            active={room==currentRoom} style={{cursor:'pointer',display:'flex',justifyContent:'space-between'}}>
                {room} {currentRoom !== room && <span className='badge rounded-pill bg-primary'>{user.newMessages[room]}</span>}
            </ListGroup.Item>
   
    ))}
  </ListGroup>*/}

      <ListGroup className="mb-5">
        <div className="mt-5 mx-2">
          <input
            type="text"
            className="input border-white text-white border-5 rounded-5"
            placeholder="Search For Friend"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="noselect blue bt" onClick={handleFriendClick}>
            Add Friend
          </button>
          <ToastContainer />
        </div>
        {members.map((member) =>
          member.name.toLowerCase() == name.toLowerCase() &&
          member._id !== user._id ? (
            <ListGroup.Item
              key={member.id}
              style={{ cursor: "pointer" }}
              active={privateMemberMsg?._id == member?._id}
              onClick={() => handlePrivateMemberMsg(member)}
              disabled={member._id === user._id}
            >
              <Row>
                <Col xs={2} className="member-status">
                  <img src={member.picture} className="member-status-img" />
                  {member.status == "online" ? (
                    <i className="fas fa-circle sidebar-online-status"></i>
                  ) : (
                    <i className="fas fa-circle sidebar-offline-status"></i>
                  )}
                </Col>
                <Col xs={9}>
                  {member.name}
                  {member._id === user?._id && " (You)"}
                  {member.status == "offline" && " (offline)"}
                </Col>
                <Col xs={1}>
                  <span className="badge rounded-pill bg-primary">
                    {user.newMessages[orderIds(member._id, user._id)]}
                  </span>
                </Col>
              </Row>
            </ListGroup.Item>
          ) : (
            <></>
          )
        )}
      </ListGroup>
      <h2 className="text-white text-center">My Members</h2>

      <ListGroup
        className="mt-5 d-flex flex-column align-items-center"
        style={{ marginTop: 50 }}
      >
        {loading ? (
          <LoadingBox />
        ) : (
          friendsList.map((friend) =>
            friend._id != user._id ? (
              <ListGroup.Item
                key={friend.id}
                className="bg-secondary bg-opacity-50 text-white w-75 rounded-5"
                style={{ cursor: "pointer", marginBottom: 10 }}
                active={privateMemberMsg?._id == friend?._id}
                onClick={() => handlePrivateMemberMsg(friend)}
              >
                <Row>
                  <Col xs={2} className="member-status">
                    <img src={friend.picture} className="member-status-img" />
                    {friend.status == "online" ? (
                      <i className="fas fa-circle sidebar-online-status"></i>
                    ) : (
                      <i className="fas fa-circle sidebar-offline-status"></i>
                    )}
                  </Col>
                  <Col xs={7}>
                    {friend.name}
                    {friend._id === user?._id}
                    {friend.status == "offline"}
                  </Col>

                  <Col xs={1}>
                    <span className="badge rounded-pill bg-primary">
                      {user.newMessages[orderIds(user._id, friend._id)]}
                    </span>
                  </Col>

                  <Col xs={1}>
                    <span onClick={() => handleDeleteFriend(friend._id)}>
                      <i class="fa-solid fa-minus-circle fa-beat"></i>
                    </span>
                  </Col>
                </Row>
              </ListGroup.Item>
            ) : (
              <></>
            )
          )
        )}
      </ListGroup>
    </div>
  );
}

export default Sidebar;
