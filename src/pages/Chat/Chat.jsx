/** @format */

import QRcode from "../../components/CommonComponent/QRcode";
import "./Chat.css";
import { IoSettingsOutline, IoSearch, IoArrowBack } from "react-icons/io5";
import { FaRegFaceSmile, FaStar } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import img14 from "../../assets/images/img18.jpg"; // Default/fallback image
import endPoints from "../../Repository/apiConfig";
import { getApi } from "../../Repository/Api";
import { db } from "../../../firebaseConfig";
import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import EmojiPicker from 'emoji-picker-react';
import { useStripeCheckout } from "../../Context/StripeCheckoutContext";
import { LoginModalfirst } from "../../components/Modals/Modals";

const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);
    return isMobile;
};

const Chat = () => {
  const location = useLocation();
  const productID = location.state?.data._id;
  const productDetailsFromNav = location.state?.data?.productdetails || "";

  const receiverDataFromNav = location.state?.data?.userId;
  const receiverIdFromNav = receiverDataFromNav?._id;
  const receiverFullNameFromNav = receiverDataFromNav?.fullName;
  const receiverImageFromNav = receiverDataFromNav?.image;
  const receiverPhoneFromNav = receiverDataFromNav?.phone;
  const receiverRatingsFromNav = receiverDataFromNav?.ratings;
  const receiverRoleFromNav = receiverDataFromNav?.role;

  const { ProductInchat, ProductInNochat ,sendMsgNotification} = useStripeCheckout();

  const userDataString = localStorage.getItem("user");
  const currentUserData = userDataString ? JSON.parse(userDataString) : {};
  const CurrentUserID = currentUserData?.data?._id;

  const currentUserFullName = currentUserData?.data?.fullName || "";
  const currentUserImage = currentUserData?.data?.image || "";
  const currentUserPhone = currentUserData?.data?.phone || "";
  const currentUserRatings = currentUserData?.data?.ratings ?? 0; // Ensure 0 if null/undefined
  const currentUserRole = currentUserData?.data?.role; // Will be handled with fallback in newChatDocData

  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [messagesChat, setMessagesChat] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const isMobile = useIsMobile();
const [showLoginModal, setShowLoginModal] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
useEffect(() => {
  const token = localStorage.getItem("token"); // or your key, e.g., 'authToken'
  if (token) {
    setIsLoggedIn(true);
  } else {
    setShowLoginModal(true);
    setIsLoggedIn(false);
  }
}, []);


console.log('selectedChat',selectedChat)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const syncUserDataToFirebase = async () => {
    if (!CurrentUserID || !currentUserFullName) {
      console.log("DEBUG: Current user data not available for syncing.");
      return;
    }
    try {
      const chatRef = collection(db, "chats");
      const updates = [];
      const userChatsQuery = query(chatRef, where("participants", "array-contains", CurrentUserID));
      const userChatsSnapshot = await getDocs(userChatsQuery);

      userChatsSnapshot.forEach((docSnap) => {
        const chatData = docSnap.data();
        let chatModified = false;
        let updatePayload = {};

        // Ensure currentUser fields have fallbacks for comparison/update
        const currentName = currentUserFullName || "";
        const currentImage = currentUserImage || ""; // Use empty or a placeholder if img14 is not suitable here
        const currentPhone = currentUserPhone || "";
        const currentRatings = currentUserRatings ?? 0;
        const currentRole = currentUserRole || "User";


        if (chatData.senderId === CurrentUserID) {
          if (chatData.username !== currentName) { updatePayload.username = currentName; chatModified = true; }
          if (chatData.userImage !== currentImage) { updatePayload.userImage = currentImage; chatModified = true; }
          if (chatData.senderPhone !== currentPhone) { updatePayload.senderPhone = currentPhone; chatModified = true;}
          if (chatData.senderRatings !== currentRatings) { updatePayload.senderRatings = currentRatings; chatModified = true;}
          if (chatData.senderRole !== currentRole) { updatePayload.senderRole = currentRole; chatModified = true;}
        } else if (chatData.Receiver === CurrentUserID) {
          if (chatData.fullname !== currentName) { updatePayload.fullname = currentName; chatModified = true; }
          if (chatData.receiverImage !== currentImage) { updatePayload.receiverImage = currentImage; chatModified = true; }
          if (chatData.receiverPhone !== currentPhone) { updatePayload.receiverPhone = currentPhone; chatModified = true;}
          if (chatData.receiverRatings !== currentRatings) { updatePayload.receiverRatings = currentRatings; chatModified = true;}
          if (chatData.receiverRole !== currentRole) { updatePayload.receiverRole = currentRole; chatModified = true;}
        }

        if (chatModified) {
          updates.push(updateDoc(doc(db, "chats", docSnap.id), updatePayload));
        }
      });

      if (updates.length > 0) {
        await Promise.all(updates);
        console.log("DEBUG: User data synced to Firebase.");
        fetchChats();
      }
    } catch (error) {
      console.error("DEBUG: Error syncing user data to Firebase:", error);
    }
  };

  const messageSend = async () => {
    if (!message.trim() || !CurrentUserID) {
      console.log("DEBUG: Message is empty or CurrentUserID is missing. Not sending.");
      return;
    }
const data={
  body:"New Message Recieved",
  userId:selectedChat.senderId
}

sendMsgNotification(data,selectedChat?.senderId)



    try {
      let chatId;
      let currentChatPartnerId;

      if (selectedChat) {
        if (selectedChat.participants && selectedChat.participants.length === 2) {
            currentChatPartnerId = selectedChat.participants.find(pId => pId !== CurrentUserID);
        } else if (selectedChat.senderId && selectedChat.Receiver) {
            currentChatPartnerId = (CurrentUserID === selectedChat.senderId) ? selectedChat.Receiver : selectedChat.senderId;
        } else if (selectedChat.ownerId && selectedChat.userid) { // Fallback for old structure
             currentChatPartnerId = (CurrentUserID === selectedChat.userid) ? selectedChat.ownerId : selectedChat.userid;
        }

        if (!currentChatPartnerId && selectedChat.id) {
            console.error("DEBUG: Could not determine partner ID from selectedChat:", selectedChat);
            if(selectedChat.participants && selectedChat.participants.includes(CurrentUserID)){
                currentChatPartnerId = selectedChat.participants.find(p => p !== CurrentUserID);
            }
            if(!currentChatPartnerId){
                 console.error("DEBUG: messageSend: Partner ID cannot be resolved from selected chat even with participants check.");
                 return;
            }
        }
      } else {
        currentChatPartnerId = receiverIdFromNav;
      }

      if (!currentChatPartnerId) {
        console.error(
          "DEBUG: messageSend: No recipient defined. CurrentUserID:", CurrentUserID,
          "SelectedChat:", selectedChat,
          "ReceiverIdFromNav (for new chat):", receiverIdFromNav
        );
        return;
      }

      if (selectedChat?.id) {
        chatId = selectedChat.id;
      } else {
        const chatRef = collection(db, "chats");
        const q = query(chatRef, where("participants", "array-contains", CurrentUserID));
        const existingChatsSnap = await getDocs(q);
        let foundChat = null;
        existingChatsSnap.forEach(docSnap => { // Renamed doc to docSnap to avoid conflict
            const chatData = docSnap.data();
            if (chatData.participants.includes(currentChatPartnerId)) {
                foundChat = { id: docSnap.id, ...chatData };
            }
        });

        if (foundChat) {
          chatId = foundChat.id;
        } else {
          if (!receiverFullNameFromNav && !receiverImageFromNav && currentChatPartnerId) {
            console.warn("DEBUG: Creating new chat, but Receiver's details (fullName, image) from navigation are missing for partner ID:", currentChatPartnerId);
          }
          const newChatDocData = {
            senderId: CurrentUserID,
            username: currentUserFullName || "User", // Fallback for username
            userImage: currentUserImage || img14,
            senderPhone: currentUserPhone || "",
            senderRatings: currentUserRatings ?? 0,
            senderRole: currentUserRole || "User", // Fallback for senderRole

            Receiver: currentChatPartnerId,
            fullname: receiverFullNameFromNav || "Chat Partner",
            receiverImage: receiverImageFromNav || img14,
            receiverPhone: receiverPhoneFromNav || "",
            receiverRatings: receiverRatingsFromNav ?? 0,
            receiverRole: receiverRoleFromNav || "User", // Fallback for receiverRole

            participants: [CurrentUserID, currentChatPartnerId].sort(),
            lastMessage: message,
            timestamp: serverTimestamp(),
            lastMessageTime: serverTimestamp(),
            productdetails: productDetailsFromNav || "",
          };
          console.log("DEBUG: Creating new chat document with data:", newChatDocData);
          const newChatDocRef = await addDoc(chatRef, newChatDocData);
          chatId = newChatDocRef.id;
        }
      }

      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: CurrentUserID,
        message: message,
        timestamp: serverTimestamp(),
      });

      const chatDocRef = doc(db, "chats", chatId);
      await updateDoc(chatDocRef, {
        lastMessage: message,
        lastMessageTime: serverTimestamp(),
      });

      setMessage("");
      setShowEmojiPicker(false);
      fetchChats(chatId); // Refresh and ensure this chat (new or existing) is selected
    } catch (error) {
      console.error("DEBUG: Error sending message:", error);
    }
  };

const fetchChats = async (forceSelectChatId = null) => {
    try {
      if (!CurrentUserID) {
        setChatList([]);
        setSelectedChat(null);
        setMessagesChat([]);
        return;
      }
      const chatRef = collection(db, "chats");
      const userChatsQuery = query(chatRef, where("participants", "array-contains", CurrentUserID));
      const querySnapshot = await getDocs(userChatsQuery);
      let fetchedChats = [];
      querySnapshot.forEach((docSnap) => { // Renamed doc to docSnap
        fetchedChats.push({ id: docSnap.id, ...docSnap.data() });
      });

      const sortedChats = [...fetchedChats].sort((a, b) => (b.lastMessageTime?.seconds || 0) - (a.lastMessageTime?.seconds || 0));
      setChatList(sortedChats);

      let newActiveChat = null;

      if (forceSelectChatId) {
        newActiveChat = sortedChats.find(chat => chat.id === forceSelectChatId);
      } else {
        const navigatedChat = receiverIdFromNav ? sortedChats.find(chat =>
          chat.participants.includes(receiverIdFromNav) && chat.participants.includes(CurrentUserID)
        ) : null;

        if (navigatedChat && !selectedChat) { // Only select navChat if nothing is currently selected (initial load with nav)
          newActiveChat = navigatedChat;
        } else if (selectedChat) { // If a chat is already selected, try to maintain it
          const currentSelectionInList = sortedChats.find(c => c.id === selectedChat.id);
          if (currentSelectionInList) {
            newActiveChat = currentSelectionInList;
          } else {
            newActiveChat = null; // Previously selected chat is gone
          }
        }
        // If newActiveChat is still null here, no default selection occurs
      }

      if (selectedChat?.id !== newActiveChat?.id ||
        (newActiveChat && selectedChat && selectedChat.id === newActiveChat.id && JSON.stringify(selectedChat) !== JSON.stringify(newActiveChat))) {
        setSelectedChat(newActiveChat);
      } else if (!newActiveChat && selectedChat) {
        setSelectedChat(null); // Ensure deselection if no active chat determined
      }

      if (!newActiveChat) {
        setMessagesChat([]);
      }
    } catch (error) {
      console.error("DEBUG: Error fetching chats:", error);
      setChatList([]);
      setSelectedChat(null);
      setMessagesChat([]);
    }
  };


 const fetchProfile = () => {
    getApi(endPoints.auth.getProfile, { setResponse: (data) => setProfile(data) });
  };

 const handleKeyPress = (e) => {


    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); messageSend();



 }
  };
 const onEmojiClick = (emojiData) => setMessage((prev) => prev + emojiData.emoji);

 useEffect(() => {
    if (CurrentUserID) {
      fetchProfile();
      syncUserDataToFirebase(); // May call fetchChats()
      fetchChats(); // Ensures chats are loaded and initial nav selection is attempted
    } else {
      setChatList([]); setMessagesChat([]); setSelectedChat(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CurrentUserID]);

 useEffect(() => {
    let unsubscribe = () => {};
    if (selectedChat?.id) {
      const messagesRef = collection(db, "chats", selectedChat.id, "messages");
      const q = query(messagesRef, orderBy("timestamp"));
      unsubscribe = onSnapshot(q, (snapshot) => {
        let msgs = []; snapshot.forEach((docSnap) => msgs.push({ id: docSnap.id, ...docSnap.data() })); // Renamed doc
        setMessagesChat(prev => JSON.stringify(prev) !== JSON.stringify(msgs) ? (setTimeout(scrollToBottom, 0), msgs) : prev);
      }, (error) => { console.error("DEBUG: Snapshot error:", error); setMessagesChat([]); });
    } else { setMessagesChat([]); }
    return () => unsubscribe();
  }, [selectedChat?.id]);

 useEffect(() => {
    if (productID && CurrentUserID) {
      if (selectedChat) {
        let partnerInSelectedChatId;
        if (selectedChat.participants?.length === 2) {
            partnerInSelectedChatId = selectedChat.participants.find(pId => pId !== CurrentUserID);
        } else if (selectedChat.senderId && selectedChat.Receiver) {
            partnerInSelectedChatId = (selectedChat.senderId === CurrentUserID) ? selectedChat.Receiver : selectedChat.senderId;
        }
        if (partnerInSelectedChatId === receiverIdFromNav || (selectedChat.participants && selectedChat.participants.includes(receiverIdFromNav))) {
          ProductInchat(productID);
        } else { ProductInNochat(productID); }
      } else if (receiverIdFromNav) { ProductInNochat(productID); }
      else { ProductInNochat(productID); }
    } else if (productID) { ProductInNochat(productID); }
    return () => { if (productID) ProductInNochat(productID); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productID, selectedChat, receiverIdFromNav, CurrentUserID]);

 const chatPartner = useMemo(() => {
    if (selectedChat) {
      if (CurrentUserID === selectedChat.senderId) {
        return {
          img: selectedChat.receiverImage || img14,
          fullname: selectedChat.fullname || "Chat Partner",
          phone: selectedChat.receiverPhone || "",
          ratings: selectedChat.receiverRatings ?? 0,
          role: selectedChat.receiverRole || "User",
        };
      } else if (CurrentUserID === selectedChat.Receiver) {
        return {
          img: selectedChat.userImage || img14,
          fullname: selectedChat.username || "Chat Partner",
          phone: selectedChat.senderPhone || "",
          ratings: selectedChat.senderRatings ?? 0,
          role: selectedChat.senderRole || "User",
        };
      } else if (selectedChat.participants?.length === 2) {
          const partnerId = selectedChat.participants.find(p => p !== CurrentUserID);
          if (partnerId === selectedChat.senderId) {
            return {
                img: selectedChat.userImage || img14, fullname: selectedChat.username || "Chat Partner",
                phone: selectedChat.senderPhone || "", ratings: selectedChat.senderRatings ?? 0, role: selectedChat.senderRole || "User",
            };
          } else if (partnerId === selectedChat.Receiver) {
            return {
                img: selectedChat.receiverImage || img14, fullname: selectedChat.fullname || "Chat Partner",
                phone: selectedChat.receiverPhone || "", ratings: selectedChat.receiverRatings ?? 0, role: selectedChat.receiverRole || "User",
            };
          }
      }
      console.warn("DEBUG: chatPartner: Could not determine partner roles clearly in selectedChat", selectedChat);
      const otherParticipantId = selectedChat.participants?.find(p => p !== CurrentUserID);
      if (otherParticipantId === selectedChat.Receiver) { // Assuming Receiver field corresponds to fullname/receiverImage
          return { img: selectedChat.receiverImage || img14, fullname: selectedChat.fullname || "Partner", phone: selectedChat.receiverPhone || "", ratings: selectedChat.receiverRatings ?? 0, role: selectedChat.receiverRole || "User" };
      } else if (otherParticipantId === selectedChat.senderId) { // Assuming senderId field corresponds to username/userImage
          return { img: selectedChat.userImage || img14, fullname: selectedChat.username || "Partner", phone: selectedChat.senderPhone || "", ratings: selectedChat.senderRatings ?? 0, role: selectedChat.senderRole || "User" };
      }
    } else if (receiverIdFromNav && CurrentUserID) {
      return {
        img: receiverImageFromNav || img14,
        fullname: receiverFullNameFromNav || "User",
        phone: receiverPhoneFromNav || "",
        ratings: receiverRatingsFromNav ?? 0,
        role: receiverRoleFromNav || "User",
      };
    }
    return { img: img14, fullname: "No Chat Selected", phone: "", ratings: 0, role: "User" };
  }, [selectedChat, CurrentUserID, receiverIdFromNav, receiverImageFromNav, receiverFullNameFromNav, receiverPhoneFromNav, receiverRatingsFromNav, receiverRoleFromNav]);


 return (
    <>
      <div className="home-container container-fluid">
        <div className="home-app">{/* <QRcode /> */}</div>
        <div className={`chat-container ${selectedChat && isMobile ? 'mobile-chat-active' : 'mobile-list-active'}`}>
          <div className="chat-container-left">
            <div className="chat-left-top">
              <div className="chat-left-top-left"><p>Inbox</p></div>
              <IoSettingsOutline />
            </div>
            <div className="chat-left-searchbar">
              <IoSearch />
              <input type="search" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="chat-left-main">
              {chatList
                .filter((chat) => {
                  let partnerNameForSearch = "";
                  if (chat.senderId === CurrentUserID) partnerNameForSearch = chat.fullname;
                  else if (chat.Receiver === CurrentUserID) partnerNameForSearch = chat.username;
                  else {
                    const otherId = chat.participants?.find(p => p !== CurrentUserID);
                    if (otherId === chat.Receiver) partnerNameForSearch = chat.fullname;
                    else if (otherId === chat.senderId) partnerNameForSearch = chat.username;
                  }
                  return (partnerNameForSearch || "").toLowerCase().includes(searchQuery.toLowerCase());
                })
                .map((chat) => {
                  let displayName, displayImg, displayRole;
                  if (CurrentUserID === chat.senderId) {
                    displayName = chat.fullname || "Chat Partner";
                    displayImg = chat.receiverImage || img14;
                    displayRole = chat.receiverRole || "User";
                  } else if (CurrentUserID === chat.Receiver) {
                    displayName = chat.username || "Chat Partner";
                    displayImg = chat.userImage || img14;
                    displayRole = chat.senderRole || "User";
                  } else {
                    const otherParticipantId = chat.participants?.find(p => p !== CurrentUserID);
                    if (otherParticipantId === chat.Receiver) {
                        displayName = chat.fullname || "Partner";
                        displayImg = chat.receiverImage || img14;
                        displayRole = chat.receiverRole || "User";
                    } else if (otherParticipantId === chat.senderId) {
                        displayName = chat.username || "Partner";
                        displayImg = chat.userImage || img14;
                        displayRole = chat.senderRole || "User";
                    } else {
                        displayName = "Chat"; displayImg = img14; displayRole = "User";
                    }
                  }

                  return (
                    <div className={`chat-left-main-div ${selectedChat?.id === chat.id ? "active-chat" : ""}`}
                      onClick={() => { setSelectedChat(chat); setShowEmojiPicker(false); }} key={chat.id} >
                      <div className="chat-left-main-div-top">
                        <div className="chat-left-main-div-image">
                          <div className="chat-left-main-div-img"><img src={displayImg} alt={displayName} onError={(e) => e.target.src = img14} /></div>
                          <div className="chat-left-main-div-name"><h6>{displayName}</h6><p>{displayRole}</p></div>
                        </div>
                        <span>{chat.lastMessageTime?.seconds ? new Date(chat.lastMessageTime.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                      </div>
              _       <div className="chat-left-main-div-message"><p>{chat.lastMessage || "No messages."}</p></div>
                    </div>);
                })}
              {chatList.length === 0 && CurrentUserID && (<div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>No conversations.</div>)}
              {!CurrentUserID && (<div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>Loading...</div>)}
            </div>
          </div>

          {(selectedChat || (receiverIdFromNav && CurrentUserID && !selectedChat && isMobile) || !isMobile) ? ( // Adjusted logic for showing middle container especially for mobile new chat
            <div className="chat-container-middle">
              {(selectedChat || (receiverIdFromNav && CurrentUserID && !selectedChat) ) ? ( // Show content if chat selected OR if starting new chat via nav
                <>
                  <div className="chat-container-middle-top">
                    {isMobile && (selectedChat || (receiverIdFromNav && !selectedChat)) && (<button className="chat-back-button" onClick={() => setSelectedChat(null)}><IoArrowBack /></button>)}
                    <div className="chat-middle-main-div-image">
                      <div className="chat-middle-main-div-img"><img src={chatPartner.img} alt={chatPartner.fullname} onError={(e) => e.target.src = img14} /></div>
                      <div className="chat-middle-main-div-name"><h6>{chatPartner.fullname}</h6><p>{chatPartner.role}</p></div>
                    </div>
                    <div className="chat-container-middle-right"></div>
                  </div>
                  <div className="chat-main-container">
                    {messagesChat.length === 0 && (<div style={{ textAlign: 'center', padding: '20px', color: 'gray', margin: 'auto' }}>
                      {(selectedChat || (receiverIdFromNav && !selectedChat)) ? "No messages. Start the conversation!" : "Select a chat to view messages."}
                    </div>)}
                    {messagesChat.map((msg, index) => {
                      const senderName = msg.senderId === CurrentUserID ? (currentUserFullName || "Me") : chatPartner.fullname;
                      return (
                      <div key={msg.id || `msg-${index}`} className={msg.senderId === CurrentUserID ? "chat-main-right-message" : "chat-main-left-message"}>
                        {msg.senderId !== CurrentUserID && (<div className="chat-main-left-message-img"><img src={chatPartner.img} alt="Partner" onError={(e) => e.target.src = img14} /></div>)}
                        <div className={msg.senderId === CurrentUserID ? "chat-main-right-message-text" : "chat-main-left-message-text"}>
                          <div className="message-sender-name" style={{fontSize: '0.75em', color: msg.senderId === CurrentUserID ? '#999' : '#888', marginBottom: '2px', textAlign: msg.senderId === CurrentUserID ? 'right' : 'left'}}>
                             {senderName}
                          </div>
                          <div className={msg.senderId === CurrentUserID ? "chat-main-right-message-div" : "chat-main-left-message-div"}><p>{msg.message}</p></div>
                          <span>{msg.timestamp?.seconds ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Sending..."}</span>
                        </div>
                        {msg.senderId === CurrentUserID && (<div className="chat-main-left-message-img"><img src={currentUserImage || profile?.data?.image || img14} alt="Me" className="user_avatar" onError={(e) => e.target.src = img14} /></div>)}
                      </div> );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="chat-main-input">
                    {showEmojiPicker && (<div className="emoji-picker-container"><EmojiPicker onEmojiClick={onEmojiClick} searchDisabled previewConfig={{ showPreview: false }} height={350} width="100%" /></div>)}
                    <input type="text" placeholder="Write a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} onClick={() => setShowEmojiPicker(false)} />
                    <div className="chat-main-input-icons">
                      <FaRegFaceSmile style={{cursor: 'pointer'}} onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(!showEmojiPicker); }} />
                      <div className="chat-main-input-icon-send" onClick={messageSend} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') messageSend(); }}><LuSend /></div>
                    </div>
                  </div>
                </>
              ) : (<div className="chat-container-middle-placeholder"><p>Select a chat to start messaging.</p></div>)}
            </div>
          ) : null}

          <div className="chat-container-right">
            {(selectedChat || (receiverIdFromNav && CurrentUserID && !selectedChat)) ? (
              <>
                <div className="chat-right-top">
                  <div className="chat-right-image"><img src={chatPartner.img} alt={chatPartner.fullname} onError={(e) => e.target.src = img14} /></div>
                  <div className="chat-right-name">
                    <h6>{chatPartner.fullname}</h6><p>{chatPartner.role}</p>
                    <span><FaStar style={{ color: "#ffc107" }} /> {chatPartner.ratings || 0} (Rating)</span>
                  </div>
                </div>
                {chatPartner.phone && <div className="chat-right-detail">Phone: {chatPartner.phone}</div>}
                {(selectedChat?.productdetails || (productDetailsFromNav && !selectedChat && receiverIdFromNav)) &&
                  <div className="chat-right-detail">Product Details: {selectedChat?.productdetails || productDetailsFromNav}</div>
                }
              </>
            ) : (<div className="chat-right-placeholder"></div>)}
          </div>
        </div>
   {!isLoggedIn && (
  <LoginModalfirst
    show={showLoginModal}
    onHide={() => setShowLoginModal(false)}
    shownext={() => {
      setShowLoginModal(false);
      const token = localStorage.getItem("token");
      if (token) setIsLoggedIn(true);
    }}
  />
)}
      </div>
    </>
 );
};

export default Chat;