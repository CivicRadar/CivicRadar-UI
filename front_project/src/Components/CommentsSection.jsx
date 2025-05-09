import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Tooltip,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "emoji-picker-react";

// Assuming CityProblemID is 1 for this example; you can pass it as a prop if needed
// const CITY_PROBLEM_ID = 1;
const API_BASE_URL = "http://127.0.0.1:8000";
const COMMENT_API_URL = `${API_BASE_URL}/communicate/`;
// Replace with dynamic auth token retrieval (e.g., from context or local storage)
const AUTH_TOKEN = "your-auth-token-here"; // Should be dynamically fetched

function CommentsSection({ cityProblemId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentsContainerRef = useRef(null);

  // Function to ensure a valid picture URL
  const getValidPictureUrl = (picture) => {
    const baseUrl = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}`;
  
    if (!picture || picture === "null" || picture === "undefined" || picture.trim() === "") {
      return null;
    }
  
    const cleanedPath = picture.replace(/^\/+/, ""); // حذف اسلش اضافه اول مسیر
    return picture.startsWith("http") ? picture : `${baseUrl}/${cleanedPath}`;
  };
  
  
  

  // Fetch comments and user reactions on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment/?CityProblemID=${cityProblemId}`, {
          headers: {
            "Authorization": `Bearer ${AUTH_TOKEN}`,
          },
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched comments:", data); // Debug log to check comment data

        const commentsWithDetails = await Promise.all(data.map(async (comment) => {
          const senderPicture = getValidPictureUrl(comment.SenderPicture);
          const replies = Array.isArray(comment.Replies) ? comment.Replies : [];
          const formattedReplies = replies.map((reply) => ({
            ...reply,
            SenderPicture: getValidPictureUrl(reply.SenderPicture),
          }));

          // Fetch the user's reaction status for this comment
          const reactionResponse = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment-reaction/?CommentID=${comment.id}`, {
            headers: {
              "Authorization": `Bearer ${AUTH_TOKEN}`,
            },
            credentials: "include",
          });
          if (!reactionResponse.ok) throw new Error(`HTTP error! status: ${reactionResponse.status}`);
          const reactionData = await reactionResponse.json();
          console.log(`Reaction for comment ${comment.id}:`, reactionData); // Debug log to check reaction data

          return {
            ...comment,
            SenderPicture: senderPicture,
            liked: reactionData.Like || false,
            disliked: reactionData.DisLike || false,
            Reply: formattedReplies,
          };
        }));
        setComments(commentsWithDetails);
      } catch (error) {
        console.error("Error fetching comments or reactions:", error);
      }
    };
    fetchComments();
  }, []);

  // Scroll to bottom only when a new comment is added
  useEffect(() => {
    if (commentsContainerRef.current && !replyTo) {
      commentsContainerRef.current.scrollTo({
        top: commentsContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [comments.length]);

  const handleAddComment = async (parentId = null) => {
    if (!newComment.trim()) return;

    const payload = {
      CityProblemID: cityProblemId,
      Content: newComment,
      IsAReply: parentId !== null,
      ReplyID: parentId || 0,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const newCommentData = await response.json();
      const updatedResponse = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment/?CityProblemID=${cityProblemId}`, {
        headers: {
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
        credentials: "include",
      });
      if (!updatedResponse.ok) throw new Error(`HTTP error! status: ${updatedResponse.status}`);
      const updatedData = await updatedResponse.json();
      console.log("Updated comments after adding:", updatedData); // Debug log

      const commentsWithDetails = await Promise.all(updatedData.map(async (comment) => {
        const senderPicture = getValidPictureUrl(comment.SenderPicture);
        const replies = Array.isArray(comment.Replies) ? comment.Replies : [];
        const formattedReplies = replies.map((reply) => ({
          ...reply,
          SenderPicture: getValidPictureUrl(reply.SenderPicture),
        }));
        const reactionResponse = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment-reaction/?CommentID=${comment.id}`, {
          headers: {
            "Authorization": `Bearer ${AUTH_TOKEN}`,
          },
          credentials: "include",
        });
        if (!reactionResponse.ok) throw new Error(`HTTP error! status: ${reactionResponse.status}`);
        const reactionData = await reactionResponse.json();
        console.log(`Reaction for comment ${comment.id} after adding comment:`, reactionData); // Debug log

        return {
          ...comment,
          SenderPicture: senderPicture,
          liked: reactionData.Like || false,
          disliked: reactionData.DisLike || false,
          Reply: formattedReplies,
        };
      }));
      setComments(commentsWithDetails);

      setNewComment("");
      setReplyTo(null);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleKeyDown = (event, parentId = null) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment(parentId);
    }
  };

  const handleReaction = async (commentId, reactionType) => {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    const isLike = reactionType === "like";
    const currentLikeStatus = comment.liked;
    const currentDislikeStatus = comment.disliked;

    // Prevent re-liking if already liked
    if (isLike && currentLikeStatus) return; // Already liked, do nothing

    // Allow dislike action even if already disliked, to toggle off
    const newLikeStatus = isLike ? true : false;
    const newDislikeStatus = !isLike ? !currentDislikeStatus : false;

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment-reaction/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
        credentials: "include",
        body: JSON.stringify({
          CommentID: commentId,
          Like: newLikeStatus,
          DisLike: newDislikeStatus,
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Fetch updated comment data to ensure counts are accurate
      const updatedResponse = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment/?CityProblemID=${cityProblemId}`, {
        headers: {
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
        credentials: "include",
      });
      if (!updatedResponse.ok) throw new Error(`HTTP error! status: ${updatedResponse.status}`);
      const updatedData = await updatedResponse.json();
      const updatedComment = updatedData.find((c) => c.id === commentId);

      setComments(
        comments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                liked: newLikeStatus,
                Likes: updatedComment.Likes || 0, // Use updated count from API
                disliked: newDislikeStatus,
                DisLikes: updatedComment.DisLikes || 0, // Use updated count from API
              }
            : c
        )
      );
    } catch (error) {
      console.error(`Error updating ${reactionType}:`, error);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
  };

  return (
    <Box
      sx={{
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        height: "600px",
        width: "100%",
        boxShadow: "0 0 8px rgba(76, 175, 80, 0.6)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "15px",
          color: "#388E3C",
        }}
      >
        دیدگاه‌ها
      </Typography>

      <Box
        ref={commentsContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "15px",
          maxHeight: "450px",
        }}
      >
        {comments.map((comment) => {
          const isMayor = comment.SenderType === "Mayor";
          return (
            <Box
              key={comment.id}
              sx={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                ...(isMayor && {
                  boxShadow: "0 0 15px rgba(76, 175, 80, 0.7)",
                }),
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
              >
                <Avatar
                  src={comment.SenderPicture}
                  sx={{
                    width: 32,
                    height: 32,
                    marginLeft: "8px",
                    boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
                  }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      color: isMayor ? "#4CAF50" : "inherit",
                    }}
                  >
                    {comment.SenderName || "کاربر ناشناس"}
                  </Typography>
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: isMayor ? "#4CAF50" : "#000",
                      marginLeft: "4px",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.8rem",
                      color: isMayor ? "#4CAF50" : "#666",
                    }}
                  >
                    {isMayor ? "مسئول" : "شهروند"}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  marginBottom: "5px",
                  fontSize: "0.85rem",
                  lineHeight: "1.3",
                  color: isMayor ? "#4CAF50" : "#666",
                }}
              >
                {comment.Content}
              </Typography>
              <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <Tooltip title="تایید کردن" arrow>
                  <IconButton
                    sx={{
                      color: comment.liked ? "#4CAF50" : "#999",
                      "&:hover": { color: "#4CAF50" },
                      padding: "4px",
                    }}
                    onClick={() => handleReaction(comment.id, "like")}
                  >
                    <ThumbUpIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                </Tooltip>
                <Typography sx={{ fontSize: "0.8rem" }}>{comment.Likes || 0}</Typography>

                <Tooltip title="رد کردن" arrow>
                  <IconButton
                    sx={{
                      color: comment.disliked ? "#F44336" : "#999",
                      "&:hover": { color: "#F44336" },
                      padding: "4px",
                    }}
                    onClick={() => handleReaction(comment.id, "dislike")}
                  >
                    <ThumbDownIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                </Tooltip>
                <Typography sx={{ fontSize: "0.8rem" }}>{comment.DisLikes || 0}</Typography>

                <Tooltip title="پاسخ دادن" arrow>
                  <IconButton
                    sx={{ color: "#999", padding: "4px" }}
                    onClick={() => setReplyTo(comment.id)}
                  >
                    <ReplyIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                </Tooltip>
              </Box>

              {Array.isArray(comment.Reply) &&
                comment.Reply.map((reply, index) => {
                  const isReplyMayor = reply.SenderType === "Mayor";
                  return (
                    <Box
                      key={reply.id || `reply-${comment.id}-${index}`}
                      sx={{
                        marginTop: "8px",
                        padding: "8px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "6px",
                        marginRight: "20px",
                        ...(isReplyMayor && {
                          boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
                        }),
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "4px",
                        }}
                      >
                        <Avatar
                          src={reply.SenderPicture}
                          sx={{
                            width: 24,
                            height: 24,
                            marginLeft: "8px",
                            boxShadow: "0 0 8px rgba(76, 175, 80, 0.4)",
                          }}
                        />
                        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "0.8rem",
                              color: isReplyMayor ? "#4CAF50" : "inherit",
                            }}
                          >
                            {reply.SenderName || "کاربر ناشناس"}
                          </Typography>
                          <Box
                            sx={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: isReplyMayor ? "#4CAF50" : "#000",
                              marginLeft: "4px",
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.7rem",
                              color: isReplyMayor ? "#4CAF50" : "#666",
                            }}
                          >
                            {isReplyMayor ? "مسئول" : "شهروند"}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.8rem",
                          lineHeight: "1.2",
                          color: isReplyMayor ? "#4CAF50" : "#666",
                        }}
                      >
                        {reply.Content}
                      </Typography>
                    </Box>
                  );
                })}

              {replyTo === comment.id && (
                <Box sx={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                  <Box sx={{ position: "relative", flex: 1 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="پاسخ خود را بنویسید..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, comment.id)}
                      sx={{
                        backgroundColor: "#fff",
                        "& .MuiInputBase-root": { 
                          fontSize: "0.85rem", 
                          padding: "6px",
                          boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(76, 175, 80, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#4CAF50",
                        },
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        left: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#4CAF50",
                        padding: "4px",
                      }}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <EmojiEmotionsIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                    {showEmojiPicker && (
                      <Box sx={{ position: "absolute", bottom: "100%", left: 0, zIndex: 1 }}>
                        <Picker onEmojiClick={onEmojiClick} />
                      </Box>
                    )}
                  </Box>
                  <Tooltip title="ارسال" arrow>
                    <IconButton
                      sx={{
                        color: "#4CAF50",
                        "&:hover": {
                          color: "#45a049",
                          boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
                        },
                        padding: "4px",
                        transform: "scaleX(-1)",
                      }}
                      onClick={() => handleAddComment(comment.id)}
                    >
                      <SendIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {!replyTo && (
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Box sx={{ position: "relative", flex: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="نظر خود را بنویسید..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              sx={{
                backgroundColor: "#fff",
                "& .MuiInputBase-root": { 
                  fontSize: "0.85rem", 
                  padding: "6px",
                  boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(76, 175, 80, 0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                left: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#4CAF50",
                padding: "4px",
              }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <EmojiEmotionsIcon sx={{ fontSize: "18px" }} />
            </IconButton>
            {showEmojiPicker && (
              <Box sx={{ position: "absolute", bottom: "100%", left: 0, zIndex: 1 }}>
                <Picker onEmojiClick={onEmojiClick} />
              </Box>
            )}
          </Box>
          <Tooltip title="ارسال" arrow>
            <IconButton
              sx={{
                color: "#4CAF50",
                "&:hover": {
                  color: "#45a049",
                  boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
                },
                padding: "4px",
                transform: "scaleX(-1)",
              }}
              onClick={() => handleAddComment()}
            >
              <SendIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}

export default CommentsSection;