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

export default App;