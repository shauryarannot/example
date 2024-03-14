let APP_ID="e161b5bd94e74c709137e3b1fcdfef88"
let token=null
let uid=String(Math.floor(Math.random()*10000))
let client;
let channel;
let localStream;
let remoteStream;
let peerConnection;

const servers={
    iceServers:[
        
        {
            urls:['stun:stun.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
        
    ]
}

let cameraPermission= async () =>{
    client=await AgoraRTM.createInstance(APP_ID)
    await client.login({uid,token})

    channel=client.createChannel('main')
    await channel.join()

    channel.on('MemberJoined',handelUserJoined)

    localStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
    document.querySelector('#user1').srcObject=localStream
    createOffer()
}

let handelUserJoined = async (MemberID) =>{
    console.log('A new user joined the room', MemberID);
}


let createOffer = async () => {

    peerConnection=new RTCPeerConnection(servers)

    remoteStream=new MediaStream()
    document.querySelector('#user2').srcObject=remoteStream

    localStream.getTracks().forEach((track)=>{
        peerConnection.addTrack(track,localStream);
    });

    peerConnection.ontrack=(event)=>{
        event.streams[0].getTracks().forEach((track)=>{
            remoteStream.addTrack()
        });
    }

    peerConnection.onicecandidate=async (event)=>{
        if(event.candidate){
            console.log('New ICE candidate',event.candidate);
        }
    }

    let offer=await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    console.log("Offer:", offer);
}

cameraPermission()