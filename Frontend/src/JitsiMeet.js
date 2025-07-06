import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// room name :vpaas-magic-cookie-ce97d2eafa90460ba705095c0dad3dc1/SampleAppIllThresholdsBetrayAllTheTime
// script.src = "https://8x8.vc/vpaas-magic-cookie-f1d73713881e4086bc2992b433dc151e/external_api.js";
const JitsiMeet = () => {
  const navigate = useNavigate();
let role=JSON.parse(sessionStorage.getItem("userInfo")).role;
  useEffect(() => {
    let api = null;
    const script = document.createElement("script");
    script.src = "https://8x8.vc/vpaas-magic-cookie-f1d73713881e4086bc2992b433dc151e/external_api.js";
    script.async = true;

    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        const domain = "8x8.vc";
        api = new window.JitsiMeetExternalAPI(domain, {
          roomName:
            "vpaas-magic-cookie-ce97d2eafa90460ba705095c0dad3dc1/SampleAppIllThresholdsBetrayAllTheTime",
          parentNode: document.getElementById("jaas-container"),
        });

        // listen for the built-in “meeting ended” signal
        api.addEventListener("readyToClose", () => {
          alert("The meeting has ended. Redirecting…");
          if(role==="Doctor")
          navigate("/homed");
        else 
          navigate("/");
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      // clean up Jitsi and script on component unmount
      if (api) api.dispose();
      document.body.removeChild(script);
    };
  }, [navigate]);

  return <div id="jaas-container" style={{ height: "100vh" }} />;
};
export default JitsiMeet;