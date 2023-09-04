import React, { useState, useEffect } from 'react';

// Component that simulates a typing effect for the given text
const TypingText = ({ text, typingSpeed }) => {
    // State to handle the portion of the text currently displayed
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
      let index = 0;
      
      // Function that simulates typing one character at a time
      const type = () => {
        // Check if the entire text has been typed
        if (index < text.length) {
          // Update displayed text one character at a time
          setDisplayedText((prevText) => {
              // Only add the next character if the previous text is of the expected length
              if (prevText.length === index) {
                return prevText + text.charAt(index);
              } else {
                // If not, maintain the previous state (this is to prevent unnecessary rerenders and to ensure sequence)
                return prevText;
              }
            });
          // Increment index to get the next character
          index++;
          // Schedule the next typing iteration
          setTimeout(type, typingSpeed);
        }
      };
  
      // Initiate the typing effect only when displayedText is empty (i.e., at the start or when the `text` prop changes)
      if (displayedText === '') {
        type();
      }
    }, [text, typingSpeed, displayedText]);  // Effect dependencies: re-run effect if any of these change

    // Render the currently displayed text
  return <span className='text-5xl font-extrabold'>{displayedText}</span>;
};

// Export the TypingText component for use in other parts of the application
export default TypingText;
