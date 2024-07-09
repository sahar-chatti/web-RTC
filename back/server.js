const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const x = require("./models/User");
const Group = require("./models/Group");
const User = x.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const Message = require("./models/Message");

//const rooms = ['general','tech','finance','crypto'];
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
require("./connection");

const server = require("http").createServer(app);
const PORT = 5001;
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

/*app.get('/rooms',(req,res)=>{
    res.json(rooms)
})*/

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });
  socket.on("message-room", async (room, content, sender, time, date) => {
    console.log("new message", content);
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit("room-messages", roomMessages);

    socket.broadcast.emit("notifications", room);
  });

  app.delete("/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});
app.delete("/groups/:groupId", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const deletedGroup = await Group.findByIdAndDelete(groupId);
    if (deletedGroup) {
      res.status(200).json(deletedGroup);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/chat", async (req, res) => {
  try {
    const { _id } = req.body;

    const user = await User.findById(_id);

    res.status(201).json(user);
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json("An error occurred");
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { _id, name } = req.body;

    // Find the user by name
    const friend = await User.findOne({ name });
    const user = await User.findById(_id);

    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the friend already exists in the user's friendsList
    const isFriendAdded = user.friendsList.some(
      (friendId) => friendId.toString() === friend._id.toString()
    );

    if (isFriendAdded) {
      return res.status(400).json({ message: "Friend already added" });
    }

    // Add the friend's _id to the user's friendsList
    user.friendsList.push(friend);

    // Add the user's _id to the friend's friendsList
    friend.friendsList.push(user);

    // Save the updated user and friend objects
    await user.save();
    await friend.save();

    res.status(201).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("An error occurred");
  }
});

// ...

// Route to get the friend list for a user
app.get("/users/:userId/friends", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID and populate the friendsList field
    const user = await User.findById(userId).populate("friendsList");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the friend list from the user object

    res.status(200).json(user.friendsList);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("An error occurred");
  }
});
app.delete("/chat/:userId/friends/:friendId", async (req, res) => {
  try {
    const { friendId, userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(userId, { $pull: { friendsList: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friendsList: userId } });
    // Find the friend to be removed
    /*const friendIndex = user.friendsList.findIndex((friend) => friend._id.toString() === friendId);

    if (friendIndex === -1) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Remove the friend from the user's friendsList
    user.friendsList.splice(friendIndex, 1);*/

    // Save the updated user object in the database
    await user.save();

    res.status(200).json({ message: "Friend deleted" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("An error occurred");
  }
});

app.delete("/user/:userId/group/:GroupId", async (req, res) => {
  try {
    const { GroupId, userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the Group to be removed
    const groupIndex = user.groups.findIndex(
      (group) => group.toString() === GroupId
    );

    if (groupIndex === -1) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the friend from the user's Groups
    user.groups.splice(groupIndex, 1);

    // Save the updated user object in the database
    await user.save();

    res.status(200).json({ message: "Group deleted" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("An error occurred");
  }
});

app.post("/groups", async (req, res) => {
  try {
    const { userId, groupName } = req.body;

    // Create a new group
    const group = new Group({
      name: groupName,
      members: [userId],
      createdBy: userId,
    });

    // Save the group to the database
    await group.save();

    // Add the group to the user's groups list
    const user = await User.findById(userId);
    user.groups.push(group._id);
    await user.save();

    res.status(201).json(group);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("An error occurred");
  }
});

// Assuming you have the necessary imports and setup for Express and Mongoose

app.post("/addMember", async (req, res) => {
  try {
    const { groupName, memberName } = req.body;

    console.log(req.body);

    // Find the member by name in the User collection
    const member = await User.findOne({ name: memberName });
    console.log("member", member);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Find the group by name in the Group collection
    const group = await Group.findOne({ name: groupName });
    console.log("group", group);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the member is already a member of the group
    if (group.members.includes(member._id)) {
      return res
        .status(400)
        .json({ message: "Member is already in the group" });
    }

    if (member.groups.includes(group._id)) {
      return res
        .status(400)
        .json({ message: "Member is already in the group" });
    }

    // Add the member to the group
    group.members.push(member._id);
    member.groups.push(group._id);

    await group.save();
    await member.save();

    res.status(200).json({ group });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/groups/created-by/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId).populate("groups");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the created groups from the user object
    const group = user.groups;

    res.status(200).json({ group });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("An error occurred");
  }
});

/*app.get('/allgroups/:userId',async(req,res)=>{
  try{
    const { userId } = req.params
    const user = await User.findById(userId)
    const group=[]
    //console.log(user)
    const groups = await Group.find()
    console.log(groups)
    if (!groups) {
      return res.status(404).json({ message: 'Group not found' });
    }
    groups.map((group)=>group.members.some((member)=>member.toString()===user._id.toString() ?  : group ))

    console.log(group)
    /*if(Avaible){
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ groups });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json('An error occurred');
  }

  
})*/
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.json("User not existed");
    }
    const secret = "jwt_secret_key" + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "1d",
    });
    const link = `/reset/${user._id}/${token}`;

    res.json(link);
  });
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  console.log(user);

  const secret = "jwt_secret_key" + user.password;
  try {
    jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt(10);
    console.log(req.body.password);

    password = await bcrypt.hash(req.body.password, salt);
    console.log(req.body.password);
    console.log(user.password);
    await User.findByIdAndUpdate(id, { password: password });
    console.log(req.body.password);
    console.log(user.password);
    res.json(user.password);
  } catch (e) {
    res.json(e);
  }
});

server.listen(PORT, () => {
  console.log("listening to port", PORT);
});
