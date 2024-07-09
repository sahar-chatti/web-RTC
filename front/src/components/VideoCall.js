import React, { useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
function VideoCall() {
  const user = useSelector((state) => state.user);
  useEffect(() => {
    function getUrlParams(url) {
      let urlStr = url.split("?")[1];
      const urlSearchParams = new URLSearchParams(urlStr);
      const result = Object.fromEntries(urlSearchParams.entries());
      return result;
    }

    const roomID =
      getUrlParams(window.location.href)["roomID"] ||
      Math.floor(Math.random() * 10000) + "";
    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = user.name + user._id;
    const appID = """""""";
    const serverSecret = "e09ddaa37915f4afea6f2901a20d3628";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: document.querySelector("#app"),
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      maxUsers: 50,
      layout: "Grid",
      showLayoutButton: true,
    });
  }, []);

  return (
    <>
      {user && <div id="app" style={{ height: "100vh", width: "100%" }}></div>}
      {!user && <div>No body else</div>}
    </>
  );
}
export default VideoCall;
