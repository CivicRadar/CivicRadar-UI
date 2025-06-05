import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Tooltip,
  Popover,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import InfoIcon from "@mui/icons-material/Info";
import Picker from "emoji-picker-react";
import { useCitizen } from "../context/CitizenContext";
import { useMayor } from "../context/MayorContext";
import { useAdmin } from "../context/AdminContext";

import { Link } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const toPersianDigits = (num) => {
  return String(num).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};






const AUTH_TOKEN = "your-auth-token-here"; // Fetch dynamically in your app

const getUserRoleLabel = (type) => {
  switch (type) {
    case "Mayor": return "مسئول";
    case "Admin": return "ادمین";
    case "Citizen":
    default:
      return "شهروند";
  }
};
const getRoleColor = (type) => {
  switch (type) {
    case "Mayor":
      return "#2e7d32"; // سبز برای مسئول
    case "Admin":
      return "#1976d2"; // آبی برای ادمین
    default:
      return "#555";
  }
};

const getRoleBackgroundColor = (type) => {
  switch (type) {
    case "Mayor":
      return "#2e7d32";
    case "Admin":
      return "#1976d2";
    default:
      return "#000";
  }
};

const getRoleTextColor = (type) => {
  switch (type) {
    case "Mayor":
      return "#2e7d32";
    case "Admin":
      return "#1976d2";
    default:
      return "#666";
  }
};

const getUserRoleColor = (type) => {
  switch (type) {
    case "Mayor":
      return "#4CAF50"; // سبز روشن برای مسئول
    case "Admin":
      return "#1976d2"; // آبی برای ادمین
    default:
      return "#666";
  }
};

const getUserDotColor = (type) => {
  switch (type) {
    case "Mayor":
      return "#4CAF50"; // سبز نقطه مسئول
    case "Admin":
      return "#1976d2"; // آبی نقطه ادمین
    default:
      return "#000";
  }
};








export default function CommentsSection({ cityProblemId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const commentsContainerRef = useRef();
  const { citizen } = useCitizen();
const { mayor } = useMayor();
const {admin} = useAdmin() ;
const [openLoginDialog, setOpenLoginDialog] = useState(false);
const navigate = useNavigate();

const isLoggedIn = Boolean(citizen || mayor || admin);


  const getValidPictureUrl = (picture) => {
    const baseUrl = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}`;
    if (!picture || picture === "null" || picture === "undefined" || !picture.trim()) {
      return null;
    }
    const cleaned = picture.replace(/^\/+/, "");
    return picture.startsWith("http") ? picture : `${baseUrl}/${cleaned}`;
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment/?CityProblemID=${cityProblemId}`,
        { headers: { Authorization: `Bearer ${AUTH_TOKEN}` }, credentials: "include" }
      );
      
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
  
      const detailed = await Promise.all(
        data.map(async (c) => {
          const pic = getValidPictureUrl(c.SenderPicture);
          const replies = Array.isArray(c.Replies) ? c.Replies : [];
          const formattedReplies = replies.map((r) => ({
            ...r,
            SenderPicture: getValidPictureUrl(r.SenderPicture),
          }));
          const rRes = await fetch(
            `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment-reaction/?CommentID=${c.id}`,
            { headers: { Authorization: `Bearer ${AUTH_TOKEN}` }, credentials: "include" }
          );
          if (!rRes.ok) throw new Error(rRes.statusText);
          const rData = await rRes.json();
          console.log("reaction", rData);

          return {
            ...c,
            SenderPicture: pic,
            liked: rData.Like === true,      // دقیقا true
            disliked: rData.Like === false,  // فقط وقتی false بوده
            Reply: formattedReplies,
          };
          
        })
      );
      setComments(detailed);
    } catch (e) {
      console.error(e);
    }
  };
  

  useEffect(() => {
    fetchComments();
  }, [cityProblemId]);
  

  useEffect(() => {
       if (commentsContainerRef.current) {
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
      IsAnonymous: isAnonymous,
    };
    try {
      // POST new comment
      const postRes = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!postRes.ok) throw new Error(postRes.statusText);
      // re-fetch comments
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment/?CityProblemID=${cityProblemId}`,
        { headers: { Authorization: `Bearer ${AUTH_TOKEN}` }, credentials: "include" }
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      // same mapping as before
      const detailed = await Promise.all(
        data.map(async (c) => {
          const pic = getValidPictureUrl(c.SenderPicture);
          const replies = Array.isArray(c.Replies) ? c.Replies : [];
          const formattedReplies = replies.map((r) => ({
            ...r,
            SenderPicture: getValidPictureUrl(r.SenderPicture),
          }));
          const rRes = await fetch(
            `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment-reaction/?CommentID=${c.id}`,
            { headers: { Authorization: `Bearer ${AUTH_TOKEN}` }, credentials: "include" }
          );
          if (!rRes.ok) throw new Error(rRes.statusText);
          const rData = await rRes.json();
          return {
            ...c,
            SenderPicture: pic,
            liked: rData.Like || false,
            disliked: rData.DisLike || false,
            Reply: formattedReplies,
          };
        })
      );
      setComments(detailed);
      setNewComment("");
      setReplyTo(null);
      setEmojiAnchorEl(null);
      setIsAnonymous(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeyDown = (e, parentId = null) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(parentId);
    }
  };

  const handleReaction = async (commentId, type) => {
    if (!isLoggedIn) {
      setOpenLoginDialog(true);
      return;
    }
    
    const isLike = type === "like";
    const payload = {
      CommentID: commentId,
      Like: isLike,
    };
  
    try {
      // ۱. واکنش رو بفرست
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/comment-reaction/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(res.statusText);
  
      // ۲. بلافاصله UI رو آپدیت کن
      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? {
                ...c,
                liked: isLike,
                disliked: !isLike,
                Likes: isLike ? (c.liked ? c.Likes : c.Likes + 1) : c.Likes - (c.liked ? 1 : 0),
                DisLikes: !isLike ? (c.disliked ? c.DisLikes : c.DisLikes + 1) : c.DisLikes - (c.disliked ? 1 : 0),
              }
            : c
        )
      );
  
      // ۳. آپدیت واقعی (در پس‌زمینه)، تا هم‌راستا بشه با دیتا اصلی
      fetchComments();
  
    } catch (e) {
      console.error("Error updating reaction:", e);
    }
  };
  

  const onEmojiClick = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
  };

  const toggleEmojiPicker = (e) => {
    setEmojiAnchorEl((prev) => (prev ? null : e.currentTarget));
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        height: 600,
        width: "100%",
        boxShadow: "0 0 8px rgba(76, 175, 80, 0.6)",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: 2,
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
          overflowX: "hidden",
          mb: 2,
          maxHeight: 450,
          pr: 1.5,
          pl: 1,
        }}
      >
       {comments.length === 0 ? (
  <Box
    sx={{
      mt: 5,
      textAlign: "center",
      color: "#999",
      fontStyle: "italic",
      fontSize: "1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Box component="span" fontSize="2.2rem">💬</Box>
    <Typography>هنوز هیچ دیدگاهی ثبت نشده است.</Typography>
  </Box>
) : (
  comments.map((comment, index) => {
    // const isMayor = comment.SenderType === "Mayor";
    return (
      <Box
        key={comment.id}
        sx={{
          mb: 2,
          mt: index === 0 ? 1.5 : 0,
          p: 2,
          borderRadius: 2,
          background: "linear-gradient(to bottom left, #ffffff, #f9f9f9)",
          border: "1px solid #e0e0e0",
          boxShadow: `0 0 15px ${
  comment.SenderType === "Admin"
    ? "#1976d2aa" // آبی برای ادمین
    : comment.SenderType === "Mayor"
    ? "#2e7d32aa" // سبز برای مسئول
    : "rgba(0,0,0,0.05)"
}`,



          wordBreak: "break-word",
        }}
      >
              {/* Avatar + Name */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 0.5,
                  borderBottom: "1px solid #eee",
                  pb: "4px",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Avatar
                  src={comment.SenderPicture}
                  sx={{ width: 32, height: 32, boxShadow: "0 0 10px rgba(76,175,80,0.5)" }}
                />
                <Typography
                  variant="subtitle2"
sx={{
  fontWeight: "bold",
  fontSize: "0.9rem",
color: getRoleColor(comment.SenderType)
}}
                >
                  {comment.SenderName || "کاربر ناشناس"}
                </Typography>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
backgroundColor: getRoleBackgroundColor(comment.SenderType)
                  }}
                />
                <Typography
  variant="caption"
sx={{ fontSize: "0.8rem", color: getRoleTextColor(comment.SenderType) }}
>
  {getUserRoleLabel(comment.SenderType)}
</Typography>

              </Box>
  
              <Typography
                variant="body2"
sx={{ mb: 0.5, fontSize: "0.85rem", lineHeight: 1.4, color: "#666" }}

              >
                {comment.Content}
              </Typography>
  
              {/* Reactions */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="تایید کردن" arrow>
                <IconButton
  onClick={() => handleReaction(comment.id, "like")}
  sx={{
    p: 0.5,
    color: comment.liked ? "success.main" : "text.disabled",
    "&:hover": { color: "success.main" },
  }}
>
  <ThumbUpIcon fontSize="small" />
</IconButton>

                </Tooltip>
<Typography variant="caption">
  {toPersianDigits(comment.Likes || 0)}
</Typography>  
                <Tooltip title="رد کردن" arrow>
                <IconButton
  onClick={() => handleReaction(comment.id, "dislike")}
  sx={{
    p: 0.5,
    color: comment.disliked ? "error.main" : "text.disabled",
    "&:hover": { color: "error.main" },
  }}
>
  <ThumbDownIcon fontSize="small" />
</IconButton>

                </Tooltip>
                <Typography variant="caption">
  {toPersianDigits(comment.DisLikes || 0)}
</Typography>
  
                <Tooltip title="پاسخ دادن" arrow>
                  <IconButton onClick={() => {
  if (!isLoggedIn) {
    setOpenLoginDialog(true);
    return;
  }
  setReplyTo(comment.id);
}}
 sx={{ p: 0.5, color: "#999" }}>
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
  
              {/* Replies */}
              {Array.isArray(comment.Reply) &&
                comment.Reply.map((reply, idx) => {
                  const isRepMayor = reply.SenderType === "Mayor";
                  return (
                    <Box
                      key={`${comment.id}-reply-${idx}`}
                      sx={{
                        mt: 1,
                        ml: { xs: 2, sm: 4 },
                        p: 1.5,
                        background: "#fcfcfc",
                        borderRadius: 2,
                        border: "1px solid #ddd",
                        boxShadow: `0 0 ${reply.SenderType === "Citizen" ? "6px" : "10px"} ${getUserRoleColor(reply.SenderType)}66`,

                        wordBreak: "break-word",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 0.5,
                          borderBottom: "1px solid #eee",
                          pb: "4px",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Avatar src={reply.SenderPicture} sx={{ width: 24, height: 24 }} />
                        <Typography
  variant="caption"
  sx={{
    fontWeight: "bold",
    fontSize: "0.8rem",
    color: getUserRoleColor(reply.SenderType)
  }}
>
  {reply.SenderName || "کاربر ناشناس"}
</Typography>

                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
backgroundColor: getUserDotColor(reply.SenderType)
                          }}
                        />
                        <Typography
  variant="caption"
sx={{ fontSize: "0.7rem", color: getUserRoleColor(reply.SenderType) }}
>
  {getUserRoleLabel(reply.SenderType)}
</Typography>

                      </Box>
  
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", lineHeight: 1.4, color: isRepMayor ? "#666" : "#666" }}
                      >
                        {reply.Content}
                      </Typography>
                    </Box>
                  );
                })}
  
              {/* Reply Input */}
              {replyTo === comment.id && (
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1,
                      alignItems: { sm: "center" },
                    }}
                  >
                    <TextField
                      fullWidth
                      multiline
                      minRows={1}
                      maxRows={5}
                      variant="outlined"
                      placeholder="پاسخ خود را بنویسید..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, comment.id)}
                      sx={{
                        fontSize: "0.85rem",
                        boxShadow: "0 0 10px rgba(76,175,80,0.5)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(76,175,80,0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#4CAF50",
                        },
                      }}
                    />
  
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Tooltip title="ایموجی">
                        <IconButton onClick={toggleEmojiPicker}>
                          <EmojiEmotionsIcon />
                        </IconButton>
                      </Tooltip>
  
                      <Tooltip title="ارسال">
                        <IconButton onClick={() => handleAddComment(comment.id)}>
                          <SendIcon />
                        </IconButton>
                      </Tooltip>
  
                      <Tooltip title="لغو پاسخ">
                        <IconButton
                          onClick={() => {
                            setReplyTo(null);
                            setNewComment("");
                            setEmojiAnchorEl(null);
                            setIsAnonymous(false);
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          sx={{
                            color: "#4CAF50",
                            "&.Mui-checked": {
                              color: "#2e7d32",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ color: "#666", fontSize: "0.9rem" }}>
                          ثبت ناشناس 
                        </Typography>
                      }
                    />
                    <Tooltip
  title={
    <span style={{ direction: "rtl", textAlign: "right", display: "block" }}>
      با انتخاب این گزینه نام شما در نظر ثبت شده ناشناس باقی می‌ماند
    .</span>
  }
  arrow
  placement="top"
>
  <InfoIcon sx={{ color: "#4CAF50", fontSize: "1.1rem", mr: 2 }} />
</Tooltip>

                  </Box>
                </Box>
              )}
            </Box>
          );
        })
      )}
      </Box>
  
      {/* New Comment Input */}
      {!replyTo && (
          isLoggedIn ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={5}
              variant="outlined"
              placeholder="نظر خود را بنویسید..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                fontSize: "0.85rem",
                boxShadow: "0 0 10px rgba(76,175,80,0.5)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(76,175,80,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
              }}
            />
  
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="ایموجی">
                <IconButton onClick={toggleEmojiPicker}>
                  <EmojiEmotionsIcon />
                </IconButton>
              </Tooltip>
  
              <Tooltip title="ارسال">
                <IconButton onClick={() => handleAddComment()}>
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  sx={{
                    color: "#4CAF50",
                    "&.Mui-checked": {
                      color: "#2e7d32",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#666", fontSize: "0.9rem" }}>
                  ثبت ناشناس
                </Typography>
              }
            />
            <Tooltip
  title="با انتخاب این گزینه نام شما در نظر ثبت شده ناشناس باقی می‌ماند ."
  arrow
  placement="top"
  PopperProps={{
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
    sx: {
      direction: "rtl", // ⬅️ این مهمه
      textAlign: "right",
    },
  }}
>
  <InfoIcon sx={{ color: "#4CAF50", fontSize: "1.1rem", mr: 2 }} />
</Tooltip>

          </Box>
        </Box>
          ) : (
            <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              backgroundColor: "#e8f5e9",
              border: "1px solid #c8e6c9",
              borderRadius: 2,
              px: 4,
              py: 2.5,
              mt: 3,
              mx: "auto",
              maxWidth: 700,
            }}
          >
            <Box component="span" fontSize="1.8rem">🔓</Box>
            <Typography
              sx={{
                color: "#2e7d32",
                fontSize: "1.05rem",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              برای ثبت نظر،{" "}
              <Link
                to="/signuplogin"
                style={{
                  color: "#1b5e20",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                وارد حساب کاربری شوید یا ثبت‌نام کنید
              </Link>
              .
            </Typography>
          </Box>


        )

      )}
  
      {/* Emoji Picker Popover */}
      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={() => setEmojiAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: { p: 0, m: 0, zIndex: 2000 } }}
      >
        <Picker onEmojiClick={onEmojiClick} />
      </Popover>

      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
  <DialogTitle sx={{ fontWeight: "bold", color: "#388E3C", textAlign: "center" }}>
    ورود یا ثبت‌نام لازم است
  </DialogTitle>
  <DialogContent>
    <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
      برای ثبت واکنش یا ثبت نظر، ابتدا وارد حساب کاربری خود شوید یا ثبت‌نام کنید
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
    <Button onClick={() => setOpenLoginDialog(false)} variant="outlined">
      بستن
    </Button>
    <Button
      variant="contained"
      color="success"
      onClick={() => navigate("/signuplogin")}
    >
      ورود / ثبت‌نام
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}  
