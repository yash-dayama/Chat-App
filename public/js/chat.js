const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

// socket.on('countUpdated', (count) => {
//     console.log('Count has been updated', count);
// })

// document.querySelector('#increment').addEventListener('click', () =>{
//     console.log('Clicked');
//     socket.emit('increment')
// })

socket.on('message', (message) => {
    console.log(message);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled')
    // disable 
    const message = e.target.elements.message.value
    // const message = document.querySelector('input').value
    socket.emit('sendMessage', message, (error) => {
        // enable
        console.log(error)
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        
        if(error){
            return console.log(error);
        } 

        console.log('Message delivered');
    })
})

$sendLocationButton.addEventListener('click', ()=> {
    if(!navigator.geolocation){
        return alert('Geo location not supported by browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')
    
    
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location Shared !');
        }
        )
    })
})