import React from 'react';

const LiveStream = () => {
  return (
    <div className="w-full h-full border border-gray-300 rounded-xl overflow-hidden">
      <iframe
        title="Twitch Stream"
        src="https://player.twitch.tv/?channel=your_channel_name&parent=your_website_domain"
        frameborder="0"
        allowfullscreen="true"
        scrolling="no"
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default LiveStream;