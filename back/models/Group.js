const mongoose = require('mongoose');
const GroupSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Group name is required"],
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  });
const Group = mongoose.model('Group',GroupSchema);
module.exports =Group 