const request = require("supertest");
const ioClient = require("socket.io-client");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
require('dotenv').config()

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
};

// Firebase uygulamasını başlat
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Test kullanıcı bilgileri
const TEST_USER_EMAIL = "22360859028@ogr.btu.edu.tr";
const TEST_USER_PASSWORD = "123456";

// Bağlanılacak sunucu
const BASE_URL = "http://localhost:3000";

// Testler
describe("REST API (localhost:3000)", () => {
  it("GET / should return Hello World", async () => {
    const res = await request(BASE_URL).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello World!");
  });

  it("GET /getUsers should return user list", async () => {
    const res = await request(BASE_URL).get("/getUsers");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /protected with Firebase JWT should return user", async () => {
    // Firebase login -> JWT al
    const userCredential = await signInWithEmailAndPassword(
      auth,
      TEST_USER_EMAIL,
      TEST_USER_PASSWORD
    );
    const token = await userCredential.user.getIdToken();

    // JWT'yi Authorization header ile gönder
    const res = await request(BASE_URL)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("This is a protected route");
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(TEST_USER_EMAIL);
  });
});

describe("Socket.IO (localhost:3000)", () => {
    let socket;
    
    beforeEach((done) => {
        // Bağlantı öncesi temiz bir başlangıç
        socket = ioClient(BASE_URL, {
            transports: ['websocket'],
            forceNew: true
        });
        
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            done();
        });
        
        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            done(err);
        });
    });

    afterEach(() => {
        // Test sonrası bağlantıyı kapat
        if (socket && socket.connected) {
            socket.disconnect();
        }
    });

    it("Should connect and receive code", (done) => {
        // Önce dinleyiciyi ayarla, sonra veriyi gönder
        socket.on("receive-code", (code) => {
            try {
                expect(code).toBe("TESTCODE");
                done();
            } catch (err) {
                done(err);
            }
        });

        // Veriyi gönder
        socket.emit("send-code", "TESTCODE");
    }, 10000);
});