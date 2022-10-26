const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const roomList = document.getElementById("RoomList");
const room_select = document.getElementById("RoomSelect");
const nickname = document.getElementById("nickname");
const nicknameForm = nickname.querySelector("form");

room.hidden = true;
roomList.hidden = true;

let roomName, userName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  room.hidden = false;
  roomList.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room Name : ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("createRoom", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function handleNameSubmit(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.emit("nickname", roomName, input.value);
  userName = input.value;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room Name : ${roomName}, Your nickname : ${userName}`;
  input.value = "";
}

function handleRoomSelect(event) {
  event.preventDefault();
  console.log(event.target.value);

  socket.emit("leaveRoom", roomName, showRoom);
  socket.emit("createRoom", event.target.value, showRoom);

  roomName = event.target.value;
}

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room Name : ${roomName} (${newCount} people)`;
  addMessage(`${user} arrived! 😸`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room Name : ${roomName} (${newCount} people)`;
  addMessage(`${left} left 😿`);
});

socket.on("room_change", ({ rooms }) => {
  roomList.hidden = false;
  let selectItems = "";

  rooms.forEach((room) => {
    selectItems += `<option value="${room}" ${
      roomName === room && "selected"
    }>${room}</option>`;
  });
  room_select.innerHTML = selectItems;
  console.log(rooms, roomName, selectItems);
});

socket.on("new_message", addMessage);

form.addEventListener("submit", handleRoomSubmit);
nicknameForm.addEventListener("submit", handleNameSubmit);
room_select.addEventListener("change", handleRoomSelect);
