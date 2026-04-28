// --- NFT STATE VARIABLES ---
let purchaseCount = 0; 

// We now use an array to store a list of all buyers and their signature positions
let signatureWall = []; 

// --- IMAGE ASSET VARIABLES ---
let appleImages = [];
let totalAppleStages = 5; 

// Mock list of buyers to simulate the blockchain history
let simulatedBuyers = [
  "Alice.eth", 
  "CryptoBob", 
  "Web3_Charlie", 
  "Dave_The_Whale",
  "Eve_The_Collector"
];

function preload() {
  // Make sure your files are named apple_0.png, apple_1.png, etc.
  for (let i = 0; i < totalAppleStages; i++) {
    appleImages[i] = loadImage('assets/apple_' + i + '.png');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(20, 20, 20); 

  // --- 1. DRAW THE SIGNATURE WALL ---
  // We loop through every buyer that has been added to our wall
  for (let i = 0; i < signatureWall.length; i++) {
    let sig = signatureWall[i]; // Get the current signature data
    
    push(); // Save current drawing settings
    translate(sig.x, sig.y); // Move to the signature's random spot
    rotate(sig.angle); // Tilt the text slightly
    
    fill(255, 255, 255, 70); // White text with 70/255 opacity
    textSize(28);
    textStyle(BOLD);
    text(sig.name, 0, 0); // Draw the name
    pop(); // Restore drawing settings so the apple doesn't tilt!
  }

  // --- 2. DRAW THE APPLE ---
  // This sits on top of the signature wall
  let currentStageIndex = min(purchaseCount, totalAppleStages - 1);

  let currentAppleImage = appleImages[currentStageIndex];

  if (currentAppleImage) {
    // CRITICAL: Your apple PNGs MUST have transparent backgrounds, 
    // otherwise a white box will cover up the signatures behind it!
    let maxAppleDisplaySize = min(width, height) * 0.4;
    // Scale image proportionally so every stage fits cleanly in the canvas.
    let scaleFactor = min(
      maxAppleDisplaySize / currentAppleImage.width,
      maxAppleDisplaySize / currentAppleImage.height
    );
    let drawW = currentAppleImage.width * scaleFactor;
    let drawH = currentAppleImage.height * scaleFactor;
    image(currentAppleImage, width / 2, height * 0.72, drawW, drawH);
  } else {
    // Just a placeholder if your images aren't loaded yet
    fill(220, 50, 50);
    noStroke();
    let simulatedSize = min(width, height) * 0.32 - (currentStageIndex * 20); 
    ellipse(width / 2, height * 0.72, simulatedSize, simulatedSize);
  }
}

function windowResized() {
  let oldWidth = width;
  let oldHeight = height;

  resizeCanvas(windowWidth, windowHeight);

  // Keep existing signatures in roughly the same relative place after resize.
  if (oldWidth > 0 && oldHeight > 0) {
    let scaleX = width / oldWidth;
    let scaleY = height / oldHeight;
    for (let i = 0; i < signatureWall.length; i++) {
      signatureWall[i].x *= scaleX;
      signatureWall[i].y *= scaleY;
      signatureWall[i].y = constrain(signatureWall[i].y, 80, height * 0.48);
    }
  }
}

// --- SIMULATION FUNCTION ---
function mousePressed() {
  // If there are still bites left to take...
  if (purchaseCount < totalAppleStages - 1) {
    
    // Get the next buyer's name from our mock list
    let newBuyerName = simulatedBuyers[purchaseCount]; 
    
    // Create a new "signature" object with a random position and tilt
    let newSignature = {
      name: newBuyerName,
      x: random(100, width - 100), // Random horizontal spot (keeping away from edges)
      y: random(80, height * 0.48), // Keep names on the upper half
      angle: random(-0.2, 0.2) // Slight random tilt for a handwritten feel
    };
    
    // Add this new signature to our wall list
    signatureWall.push(newSignature);
    
    // Increase the bite count
    purchaseCount++; 
  }
}