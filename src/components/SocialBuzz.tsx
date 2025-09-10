import React from 'react';
import { Instagram, Hash, Heart, MessageCircle, Share } from 'lucide-react';

const SocialBuzz: React.FC = () => {
  // Mock social media posts
  const socialPosts = [
    {
      id: 1,
      username: "arpittaryaa",
      content: "Can't wait for Team Welcome's Dandiya Event! 💃 Already practicing my moves! #DandiyaEvent2025 #TeamWelcome",
      likes: 60,
      comments: 12,
      timeAgo: "2h",
      avatar: "/avatar1.png"
    },
    {
      id: 2,
      username: "unknown_rahul28",
      content: "This is going to be EPIC! The beats will shake the ground! 🔥🥁 #MahaBhanga #NavratriVibes",
      likes: 102,
      comments: 23,
      timeAgo: "4h",
      avatar: "/avatar2.jpg"
    },
    {
      id: 3,
      username: "_chiraa.g",
      content: "Mukut Regency is going to witness something magical! ✨ Team Welcome always delivers! #DandiyaEvent2025",
      likes: 73,
      comments: 8,
      timeAgo: "6h",
      avatar: "/avatar3.jpg"
    },
    {
      id: 4,
      username: "rupanshu_gupta._",
      content: "Booked my tickets! Who else is ready for the cultural blast? 🎉 #TeamWelcome #DandiyaNight",
      likes: 113,
      comments: 15,
      timeAgo: "8h",
      avatar: "/avatar4.jpg"
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Hash className="w-8 h-8 text-yellow-300 mr-3" />
          <h3 className="text-3xl font-bold text-white">Social Buzz</h3>
        </div>
        <p className="text-white/80">See what people are saying about our event!</p>
        <div className="mt-4">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm">
            #DandiyaEvent2025 #TeamWelcome #DivineCelebration
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {socialPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={post.avatar}
                  alt={`Avatar of ${post.username}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold">@{post.username}</span>
                  <Instagram className="w-4 h-4 text-pink-400" />
                </div>
                <span className="text-white/60 text-sm">{post.timeAgo} ago</span>
              </div>
            </div>
            
            <p className="text-white mb-4 leading-relaxed">{post.content}</p>
            
            <div className="flex items-center justify-between text-white/70">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 hover:text-red-400 cursor-pointer transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments}</span>
                </div>
              </div>
              <Share className="w-5 h-5 hover:text-yellow-400 cursor-pointer transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-6 border border-pink-400/30">
          <Instagram className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <h4 className="text-white font-bold text-lg mb-2">Share Your Excitement!</h4>
          <p className="text-white/80 mb-4">
            Post about the event and tag us for a chance to win exclusive merchandise!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-pink-500/30 text-pink-200 px-3 py-1 rounded-full text-sm">#DandiyaEvent2025</span>
            <span className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm">#TeamWelcome</span>
            <span className="bg-orange-500/30 text-orange-200 px-3 py-1 rounded-full text-sm">#DivineCelebration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialBuzz;
