import React from 'react';
import './twitchChat.module.css';

const TwitchChat = () => {
  return (
    <iframe
      src="https://www.twitch.tv/embed/spriteclub/chat?parent=mugen.spriteclub.tv&parent=spriteclub.tv&parent=www.spriteclub.tv"
      id="thisChat"
      className="chat "
      title="Twitch Chat"
      style={{ height: '100%', display: 'flex' }}
    >
      It seems your browser does not support iframes.
    </iframe>
  );
};

export default TwitchChat;

