import { getAPIData,  getUserFromSession, getNowDate} from "../utils/utils.js";
import { openForeignProfile } from './foreign.profile.js';
import { API_PORT} from "./index.js"

export async function getMessages() {

    const user = getUserFromSession();

    const messagesArray = await getAPIData(
        `${location.protocol}//${location.hostname}${API_PORT}/api/read/messages/${user?._id}`,
        'GET'
    );


    const receivedMessagesArray = [];
    const sentMessagesArray = []
    

    for (const message of messagesArray) {  
        if (message.receiver_id === user?._id) {
            message.receiver_username = user?.username;

            const foreignUser = await getAPIData(
                `${location.protocol}//${location.hostname}${API_PORT}/api/read/user/${message.sender_id}`,
                'GET'
            );

            message.sender_username = foreignUser.username;
            receivedMessagesArray.push(message);
        } else {
            const foreignUser = await getAPIData(
                `${location.protocol}//${location.hostname}${API_PORT}/api/read/user/${message.receiver_id}`,
                'GET'
            );

            message.sender_username = user?.username;
            message.receiver_username = foreignUser.username;
            sentMessagesArray.push(message);
        }
    }

    // @ts-expect-error Window declaration
    window.receivedMessagesArray = receivedMessagesArray;
    // @ts-expect-error Window declaration
    window.sentMessagesArray = sentMessagesArray;

    renderReceivedMessages(receivedMessagesArray);
}


/**
 * Render the received messages in the message list container.
 * @param {Message[]} receivedMessagesArray - Array of received Message objects.
 */
function renderReceivedMessages(receivedMessagesArray){

    const receivedBtn = document.getElementById('received-btn');
    const sentBtn = document.getElementById('sent-btn');

    receivedBtn?.classList.remove('bg-amber-400')
    receivedBtn?.classList.add('bg-amber-600')

    sentBtn?.classList.remove('bg-amber-600')
    sentBtn?.classList.add('bg-amber-400')

    const messageContainer = document.getElementById('message-list-container')
    if(messageContainer) messageContainer.innerHTML = ''

    receivedMessagesArray.forEach(function (/** @type {Message} */ message){

        let html = ''

        if(message.isNew === true){

            html = `<div class="bg-amber-100 shadow-md rounded-lg overflow-hidden flex items-center p-2 border border-solid border-gray-200 w-full cursor-pointer h-20 message-card">
                <div class="flex flex-col flex-grow">
                <p class=" mr-4 w-52 truncate">De: ${message.sender_username}</p>
                <span class="text-m w-52 font-bold text-gray-800 truncate">${message.title}</span>
                </div
                
                <span  class="text-sm text-gray-600 ml-auto pr-8">${message.date}</span>
                </div>`


        }else{

            html = `<div class="bg-white shadow-md rounded-lg overflow-hidden flex items-center p-2 border border-solid border-gray-200 w-full cursor-pointer h-20 message-card">
                <div class="flex flex-col flex-grow">
                <p class=" mr-4 w-52 truncate">De: ${message.sender_username}</p>
                <span class="text-m w-52 text-gray-800 truncate">${message.title}</span>
                </div
                
                <span  class="text-sm text-gray-600 ml-auto pr-8">${message.date}</span>
                </div>`
        }

            messageContainer?.insertAdjacentHTML('afterbegin', html);

            const newMessageCard = messageContainer?.firstElementChild

            newMessageCard?.addEventListener('click', () => seeMessage(message, true));
        
    })

}


/**
 * Render the sent messages in the message list container.
 * @param {Message[]} sentMessagesArray - Array of sent Message objects.
 */
function renderSentMessages(sentMessagesArray){

    const receivedBtn = document.getElementById('received-btn');
    const sentBtn = document.getElementById('sent-btn');

    sentBtn?.classList.remove('bg-amber-400')
    sentBtn?.classList.add('bg-amber-600')

    receivedBtn?.classList.remove('bg-amber-600')
    receivedBtn?.classList.add('bg-amber-400')

    const messageContainer = document.getElementById('message-list-container')
    if(messageContainer) messageContainer.innerHTML = ''

    sentMessagesArray.forEach(function (/** @type {Message} */ message){

        

        const html = `<div class="bg-red-50 shadow-md rounded-lg overflow-hidden flex items-center p-2 border border-gray-200 w-full cursor-pointer h-20 message-card">
                <div class="flex flex-col flex-grow">
                <p class=" mr-4 w-52 truncate">Para: ${message.receiver_username}</p>
                <span class="text-m w-52 font-bold text-gray-800 truncate">${message.title}</span>
                </div
                
                <span  class="text-sm text-gray-600 ml-auto pr-8">${message.date}</span>
                </div>`

            messageContainer?.insertAdjacentHTML('afterbegin', html)

            const newMessageCard = messageContainer?.firstElementChild

            newMessageCard?.addEventListener('click', () => seeMessage(message, false));
    
    })

}


/**
 * Displays a message and updates its status.
 * 
 * This function checks if the message is new and updates its status to not new.
 * It renders the list of received messages and manages the visibility of message-related UI elements.
 * It also sets the message details in the UI and configures the response form based on the enabledResponse flag.
 * 
 * @param {Message} message - The message object containing details like sender, title, and content.
 * @param {boolean} enabledResponse - A flag indicating whether the response form should be enabled.
 * 
 * @returns {Promise<void>}
 */

async function seeMessage(message, enabledResponse){

    if (message.isNew) {
        message.isNew = false;
        await updateMessageStatusToFalse(message._id);

        // @ts-expect-error Window declaration
        renderReceivedMessages(window.receivedMessagesArray);
    }

    const messageForm = document.getElementById('message-form-container') 

    if (!enabledResponse) {
        messageForm?.classList.add('__hidden');
    } else {
        messageForm?.classList.remove('__hidden');
    }

    const messagePlaceholder = document.getElementById('deployed-message-screensaver')
    const messageContainer = document.getElementById('deployed-message-container')
    const messageSender = document.getElementById('message-sender')
    messageSender?.setAttribute('data-id', message.sender_id)
    const messageTitle = document.getElementById('message-title')
    const messageBody = document.getElementById('message-content')

    if(messageSender) messageSender.textContent = message.sender_username
    if(messageTitle) messageTitle.textContent = message.title
    if(messageBody) messageBody.textContent = message.message

    messagePlaceholder?.classList.add('__hidden')
    messageContainer?.classList.remove('__hidden')

    const sendReplyBtn = document.getElementById('send-reply-btn')
    if (sendReplyBtn) sendReplyBtn.onclick = () => answerMessage(message);

    messageSender?.addEventListener('click', () => openForeignProfile('message-sender'))
}


/**
 * Updates a message to set its isNew property to false.
 * @param {string} messageId - The id of the message to update.
 * @returns {Promise<void>}
 */
async function updateMessageStatusToFalse(messageId) {

    const payload = JSON.stringify({isNew : false});

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const apiData = await getAPIData(
      `${location.protocol}//${location.hostname}${API_PORT}/api/update/message/${messageId}`,
      'PATCH', payload
    );
  }

/**
 * Answers a message by creating a new message with the same receiver and sender.
 * The title of the new message is "Re: <original title>" and the content is
 * taken from the "answer-message" textarea.
 * @param {Message} message - The message to answer.
 */
async function answerMessage(message){

    const answerTitle = `Re: ${message.title}`
    const answerContent = /** @type {HTMLFormElement} */ (document.getElementById('answer-message'))?.value

    const date = getNowDate()


    const answerMessage = {
        sender_id: getUserFromSession()?._id,
        receiver_id: message.sender_id,
        title: answerTitle,
        message: answerContent,
        date: date,
        isNew: true
    }

    const payload = JSON.stringify(answerMessage)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/message`,'POST', payload);

    getMessages()
}

/**
 * Assigns event listeners to the "received" and "sent" buttons to render the
 * corresponding message lists when clicked.
 */
export function assignMessageListeners(){
    document.getElementById('received-btn')?.addEventListener('click', () => {

        // @ts-expect-error Window declaration
        renderReceivedMessages(window.receivedMessagesArray);
    });
    document.getElementById('sent-btn')?.addEventListener('click', () => {
        // @ts-expect-error Window declaration
        renderSentMessages(window.sentMessagesArray);
    });
}

