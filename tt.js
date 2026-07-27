

const rooms = [
  {
    id: 'room-101',
    type: 'Single Room',
    capacity: 2,
    bookedGuests: 1,
  },
  {
    id: 'room-202',
    type: 'Double Room',
    capacity: 2,
    bookedGuests: 2,
  },
];


function findRoomByIdWithCallback(roomId, callback) {
 
  setTimeout(() => {
   
    const room = rooms.find((roomItem) => roomItem.id === roomId);

    
    if (!room) {
      callback(new Error('Room was not found'));
      return;
    }

    callback(null, { ...room });
  }, 50);
}

***************************************
function findRoomById(roomId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
     
      if (!roomId) {
        reject(new Error('Room id is required'));
        return;
      }

    
      const room = rooms.find((roomItem) => roomItem.id === roomId);

     
      if (!room) {
        reject(new Error('Room was not found'));
        return;
      }

     
      resolve({ ...room });
    }, 50);
  });
}

**************************************
function calculateAvailableBeds(room) {
 
  return Math.max(room.capacity - room.bookedGuests, 0);
}


function getRooms() {
  return rooms.map((room) => ({ ...room }));
}


function ensureRoomAvailable(room) {

  if (calculateAvailableBeds(room) <= 0) {
    throw new Error('No beds available in this room');
  }

  return true;
}


******************************************************
function validateGuest(guest) {
  
  const name = guest?.name?.trim() ?? '';


  const email = guest?.email?.trim().toLowerCase() ?? '';

  
  if (!name) {
    throw new Error('Guest name is required');
  }


  if (!email.includes('@')) {
    throw new Error('A valid guest email is required');
  }


  return { name, email };
}
**********************************************
function bookRoomWithPromises(roomId, guest) {
  return findRoomById(roomId).then((room) => {
  
    const validGuest = validateGuest(guest);

   
    ensureRoomAvailable(room);

    
    return {
      id: `booking-${room.id}`,,
      status: 'confirmed',
      guest: validGuest,
      roomId: room.id,
      availableBeds: calculateAvailableBeds(room),
    };
  });
}

***************************************************

async function bookRoom(roomId, guest) {
  try {
  
    const room = await findRoomById(roomId);

  
    const validGuest = validateGuest(guest);

   
    ensureRoomAvailable(room);

  
    return {
      status: 'success',
      message: 'Room booked successfully.',
      booking: {
        id: `booking-${room.id}`,,
        status: 'confirmed',
        guest: validGuest,
        roomId: room.id,
      },
    };
  } catch (error) {

    return {
      status: 'error',
      message: error.message,
    };
  }
}
************************************************
function printScenario(label, result) {

  console.log(`\\n${label}`);

 
  console.log(JSON.stringify(result, null, 2));
}
***********************************************
async function runDemonstration() {
  console.log('Hotel Booking System');

 
  findRoomByIdWithCallback('room-101', (error, room) => {
    if (error) {
      console.error('Callback failed:', error.message);
      return;
    }

    console.log(`Callback lookup: ${room.type}`);
  });


  await findRoomById('room-101')
    .then((room) => {
      const beds = calculateAvailableBeds(room);
      console.log(`Promise lookup: ${beds} beds available`);
    })
    .catch((error) => {
      console.error('Promise failed:', error.message);
    });


  const booking1 = await bookRoomWithPromises('room-101', {
    name: 'Ahmed',
    email: 'AHMED@EMAIL.COM',
  });

  printScenario('Promise booking succeeds', booking1);

  
  const booking2 = await bookRoom('room-101', {
    name: '  Youssef Sameh  ',
    email: '  YOUSSEF@EMAIL.COM  ',
  });

  printScenario('async/await booking succeeds', booking2);

 
  const invalidGuest = await bookRoom('room-101', {
    name: 'Omar',
    email: 'wrong-email',
  });

  printScenario('Invalid email is rejected', invalidGuest);

  
  const fullRoom = await bookRoom('room-202', {
    name: 'Salma',
    email: 'salma@example.com',
  });

  printScenario('Full room is rejected', fullRoom);

 
  const missingRoom = await bookRoom('room-999', {
    name: 'Ali',
    email: 'ali@example.com',
  });

  printScenario('Missing room is rejected', missingRoom);
}


runDemonstration();
