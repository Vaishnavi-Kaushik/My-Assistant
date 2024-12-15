let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
// let btn = document.querySelector("#btn");
let chatContainer = document.querySelector(".chat-container");
let userMessage = null;
let Api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDCfisxIr1kSdhC4zFLj2VtwUPypSRUfRU';

document.getElementById('btn').addEventListener('click', sendMessage);
document.getElementById('prompt').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// function sendMessage() {
//     const userInput = document.getElementById('prompt').value.trim();
//     if (userInput.trim() !== '') {
//     console.log(userInput); 
//     document.getElementById('prompt').value = ''; 

//     // Display the user message
//     displayUser (userInput); 
//     showLoading(); 
//     setTimeout(() => getApiResponse(), 500); 
//     }
// }


function sendMessage() {
    userMessage = prompt.value.trim(); // Get the user input and trim whitespace
    console.log("sendMessage called with:", userMessage); // Debugging statement
    if (userMessage === '') {
        console.log("Input is empty, returning."); // Debugging statement
        return; // Do nothing if the input is empty
    }

    console.log(userMessage); 
    prompt.value = ''; // Clear the input field

    // Display the user message
    displayUser (userMessage); 
    showLoading(); 
    // setTimeout(() => getApiResponse(), 500); 
}


function displayUser (message) {
    let html = `<div class="user-chat-box">
                    <div class="img">
                        <img src="user.png" alt="" width="35px">
                    </div>
                    <p class="text" style="margin-top:18px">${message}</p>
                </div>`;
    chatContainer.insertAdjacentHTML('beforeend', html); // Append the user message to the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function createChatbox(html,className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

async function getApiResponse(aiChatbox) {

    let textElement = aiChatbox.querySelector(".text");
    try {

        if (!aiChatbox) {
            console.error("aiChatbox is undefined");
            return; // Exit if aiChatbox is undefined
        }
        
        let response = await fetch(Api_url,{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                contents:[
                    {"role": "user",
                        "parts":[{text: userMessage}]}]
            })
        });
        let data = await response.json();
        let apiResponse = data?.candidates[0].content.parts[0].text;
        textElement.innerText = apiResponse;



    } catch(err) {
        console.log(err);
    }
    finally {
        aiChatbox.querySelector(".loading").style.display="none";

    }
} 


// async function getApiResponse(aiChatbox) {
//     let textElement = aiChatbox.querySelector(".text");
//     try {
//         let response = await fetch(Api_url, {
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify({
//                 contents: [
//                     {"role": "user", "parts": [{text: userMessage}]}
//                 ]
//             })
//         });

//         // Check if the response is OK
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         let data = await response.json();
//         console.log(data); // Log the entire response for debugging

//         // Check if the expected structure exists
//         if (data && data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
//             if (data.candidates[0].content && data.candidates[0].content.parts && Array.isArray(data.candidates[0].content.parts) && data.candidates[0].content.parts.length > 0) {
//                 let apiResponse = data.candidates[0].content.parts[0].text;
//                 textElement.innerText = apiResponse;
//             } else {
//                 textElement.innerText = "No content available in the response.";
//             }
//         } else {
//             textElement.innerText = "No candidates found in the response.";
//         }

//     } catch (err) {
//         console.error(err); // Log the error for debugging
//         textElement.innerText = "An error occurred while fetching the response.";
//     } finally {
//         aiChatbox.querySelector(".loading").style.display = "none";
//     }
// }

function showLoading(){
    let html = `<div class="ai-chat-box">
            <div class="img">
                <img src="ai.png" alt="" width="35px">
            </div>
            <p class="text" style = "margin-top:18px"></p>
            <img class="loading" src="loader.gif" alt="loading" height="50p" style = "margin-top: 10px margin-left: 90px">
        </div>`
    let aiChatbox = createChatbox(html,"ai-chat-box");
    chatContainer.appendChild(aiChatbox);
    getApiResponse(aiChatbox); 
}




btn.addEventListener("click", () => {
    userMessage = prompt.value;
    if(userMessage == "") {
        container.style.display = "flex";

    }
    {
        container.style.display = "none";
    }
    if(!userMessage) return;
    let html = `<div class="img">
                <img src="user.png" alt="" width="35px">
            </div>
            <p class="text" style = "margin-top:18px" ></p>`;
    let userChatbox = createChatbox(html,"user-chat-box");
    userChatbox.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(userChatbox);
    prompt.value = "";
    setTimeout(showLoading,500);
    


});

