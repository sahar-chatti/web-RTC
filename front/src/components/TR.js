import React, { useContext } from "react";
import { useState } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./Sidebar.css";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";

const TR = () => {
  const [show, setShow] = useState(false);
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return <></>;
};

export default TR;
