import {key} from "./key"
import {getMic} from "./deviceAccess"

export async function init(eventListenerMap={message: e => console.log(e)}) {
  // // Get an ephemeral key from your server - see server code below
  // const tokenResponse = await fetch("/session");
  // const data = await tokenResponse.json();
  const EPHEMERAL_KEY = key

  // Create a peer connection
  const pc = new RTCPeerConnection();

  // Set up to play remote audio from the model
  const audioEl = document.createElement("audio");
  audioEl.autoplay = true;
  pc.ontrack = e => audioEl.srcObject = e.streams[0];

  // Add local audio track for microphone input in the browser
  let ms
  try {
    ms = await getMic()
    console.log({ms})
  } catch (error) {
    console.error("GetUserMediaError --- ", error)
    throw error
  }
  pc.addTrack(ms.getTracks()[0]);

  // Set up data channel for sending and receiving events
  const dc = pc.createDataChannel("oai-events");
  Object.keys(eventListenerMap).forEach(k => {
    dc.addEventListener(k, e => {
      eventListenerMap[k](e, dc)
    })
  })

  // Start the session using the Session Description Protocol (SDP)
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const baseUrl = "https://api.openai.com/v1/realtime";
  const model = "gpt-4o-realtime-preview";
  const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
    method: "POST",
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${EPHEMERAL_KEY}`,
      "Content-Type": "application/sdp"
    },
  });

  const answer = {
    type: "answer",
    sdp: await sdpResponse.text(),
  };
  console.log(answer)
  await pc.setRemoteDescription(answer);
  
  return {
    channel: dc,
    peerConnection: pc,
    stream: ms
  }
}

export function close({channel, peerConnection, stream}) {
  channel.close()
  stream.getTracks().forEach(track => track.stop())
  peerConnection.close()
}