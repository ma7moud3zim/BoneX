import { useEffect } from "react";


// room name :vpaas-magic-cookie-ce97d2eafa90460ba705095c0dad3dc1/SampleAppIllThresholdsBetrayAllTheTime
const JitsiMeet = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://8x8.vc/vpaas-magic-cookie-f1d73713881e4086bc2992b433dc151e/external_api.js";
    script.async = true;
    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        const domain = "8x8.vc";
        const options = {
          roomName: "vpaas-magic-cookie-f1d73713881e4086bc2992b433dc151e/SampleAppSlowRoofsForecastInitially",
          parentNode: document.getElementById("jaas-container"),
        };
        new window.JitsiMeetExternalAPI(domain, options);
      }
    };
    document.body.appendChild(script);
  }, []);

  return <div id="jaas-container" style={{ height: "100vh" }} />;
};

export default JitsiMeet;
