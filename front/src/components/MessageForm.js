import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./MessageForm.css";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
import Aos from "aos";
import "aos/dist/aos.css";
function MessageForm() {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });

  const {
    socket,
    currentRoom,
    setRooms,
    setMessages,
    messages,
    privateMemberMsg,
    rooms,
  } = useContext(AppContext);
  const messageEndRef = useRef(null);
  function getRooms() {
    fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return month + "/" + day + "/" + year;
  }

  function handleSubmit(e) {
    e.preventDefault();
  }
  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  const todayDate = getFormattedDate();
  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });
  function handleSubmit(e) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  }

  return (
    <div className=" pb-3" data-aos="zoom-in">
      <div className="messages-output bg-opacity-25 mb-5">
        {user && !privateMemberMsg?._id && (
          <div className="alert alert-light conversation-info">
            You are in the {currentRoom} room
          </div>
        )}
        {user && privateMemberMsg?._id && (
          <>
            <div className="alert alert-light conversation-info">
              Your Conversation with {privateMemberMsg.name}{" "}
              <img
                src={privateMemberMsg.picture}
                className="conversation-profile-pic"
              />
            </div>
          </>
        )}
        {!user && (
          <div className=" opacity-75 alert alert-success text-primary text-center">
            Please login{" "}
          </div>
        )}

        {user &&
          messages.map(({ _id: date, messagesByDate }, idx) => (
            <div key={idx}>
              <p className="alert alert-info text-center message-date-indicator">
                {" "}
                {date}{" "}
              </p>
              {messagesByDate?.map(
                ({ content, time, from: sender }, msgIdx) => (
                  <div
                    className={
                      sender?.email == user?.email
                        ? "message"
                        : "incoming-message"
                    }
                    key={msgIdx}
                  >
                    <div className="message-inner">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={sender.picture}
                          style={{
                            width: 35,
                            height: 35,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: 10,
                          }}
                        />
                        <p className="message-sender">
                          {sender._id == user?._id ? "You" : sender.name}
                        </p>
                      </div>
                      <p className="message-content">{content}</p>
                      <p className="message-timestamp-left">{time}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        <div ref={messageEndRef} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Row className="pb-5">
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your message"
                disabled={!user || currentRoom.length == 0}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "blueviolet" }}
              disabled={!user || currentRoom.length == 0}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default MessageForm;
