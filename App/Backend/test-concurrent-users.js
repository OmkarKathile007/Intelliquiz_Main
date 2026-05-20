const io = require('socket.io-client');

// ============ CONFIGURATION ============
const SERVER_URL = 'http://localhost:5000';
const NUM_USERS = 200;  
const ROOM_ID = 'test-room-123';
// ======================================

let stats = {
  connected: 0,
  errors: 0,
  messagesReceived: 0,
  responseTimes: []
};

console.log(`\n🚀 Testing ${NUM_USERS} concurrent users...\n`);

// Create fake users
for (let i = 0; i < NUM_USERS; i++) {
  setTimeout(() => {
    createFakeUser(i);
  }, i * 50); // 50ms delay between each connection
}

function createFakeUser(userId) {
  const socket = io(SERVER_URL, {
    transports: ['websocket']
  });

  const startTime = Date.now();

  socket.on('connect', () => {
    stats.connected++;
    const connectTime = Date.now() - startTime;
    stats.responseTimes.push(connectTime);
    
    console.log(`✅ User ${userId} connected in ${connectTime}ms (Total: ${stats.connected}/${NUM_USERS})`);
    
    // Join room
    socket.emit('joinRoom', ROOM_ID, `Player-${userId}`);
  });

  socket.on('newQuestion', (data) => {
    stats.messagesReceived++;
    
    // Auto-answer randomly after 1-2 seconds
    setTimeout(() => {
      const answer = Math.floor(Math.random() * 4);
      socket.emit('submitAnswer', ROOM_ID, answer);
    }, 1000 + Math.random() * 1000);
  });

  socket.on('answerResult', (data) => {
    stats.messagesReceived++;
  });

  socket.on('connect_error', (error) => {
    stats.errors++;
    console.error(`❌ User ${userId} failed: ${error.message}`);
  });
}

// Print final results after 30 seconds
setTimeout(() => {
  console.log('\n' + '='.repeat(50));
  console.log('📊 LOAD TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Target Users:        ${NUM_USERS}`);
  console.log(`✅ Connected:        ${stats.connected} (${(stats.connected/NUM_USERS*100).toFixed(1)}%)`);
  console.log(`❌ Errors:           ${stats.errors}`);
  console.log(`📨 Messages Received: ${stats.messagesReceived}`);
  
  if (stats.responseTimes.length > 0) {
    const avgTime = stats.responseTimes.reduce((a,b) => a+b, 0) / stats.responseTimes.length;
    const maxTime = Math.max(...stats.responseTimes);
    console.log(`⚡ Avg Response Time: ${avgTime.toFixed(0)}ms`);
    console.log(`⏱️  Max Response Time: ${maxTime}ms`);
  }
  
  console.log('='.repeat(50));
  
  // Verdict
  if (stats.connected === NUM_USERS && avgTime < 200) {
    console.log('✅ VERDICT: System handling load well!');
  } else if (stats.connected >= NUM_USERS * 0.9) {
    console.log('⚠️  VERDICT: System under stress but functional');
  } else {
    console.log('❌ VERDICT: System cannot handle this load');
  }
  
  console.log('\n');
  process.exit(0);
}, 30000);