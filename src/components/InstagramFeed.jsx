import React, { useEffect, useState } from "react";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      const accessToken = "YOUR_ACCESS_TOKEN"; // Reemplaza con tu token
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url&access_token=${accessToken}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Error fetching Instagram posts:", error);
      }
    };

    fetchInstagramPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} style={{ margin: "20px 0" }}>
          {post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM" ? (
            <img src={post.media_url} alt={post.caption} style={{ width: "100%" }} />
          ) : post.media_type === "VIDEO" ? (
            <video controls style={{ width: "100%" }}>
              <source src={post.media_url} type="video/mp4" />
            </video>
          ) : null}
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default InstagramFeed;
