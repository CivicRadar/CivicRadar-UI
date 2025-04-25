import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Link,
  Badge,
} from '@mui/material';
import { Notifications, ArrowForward, Refresh } from '@mui/icons-material';

// تبدیل تاریخ به فرمت فارسی و قابل خواندن
const formatPersianDate = (dateString) => {
  const date = new Date(dateString);
  const persianDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
  return persianDate;
};

export default function CitizenNotification() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Fetch notifications with polling
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/notification/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401 || response.status === 403) {
        console.error("User not authenticated, redirecting to login...");
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Notifications API Response:", data);
        setNotifications(Array.isArray(data) ? data : []);
        setError(null);
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
        setNotifications([]);
        setError(`خطا در دریافت اعلان‌ها: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setError('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    }
  };

  // Mark notifications as seen
  const markNotificationsAsSeen = async () => {
    try {
      // Get all unseen notification IDs
      const unseenNotifications = notifications.filter(notif => !notif.Seen);
      if (unseenNotifications.length === 0) return;

      for (const notif of unseenNotifications) {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/notification/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ NotificationID: notif.id }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to mark notification ${notif.id} as seen: ${response.statusText}`, errorText);
          setError(`خطا در علامت‌گذاری اعلان با شناسه ${notif.id}: ${response.statusText}`);
          return;
        }
      }

      // Update local state to mark notifications as seen
      setNotifications((prev) =>
        prev.map((notif) =>
          unseenNotifications.some(unseen => unseen.id === notif.id)
            ? { ...notif, Seen: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notifications as seen:", error);
      setError('خطا در علامت‌گذاری اعلان‌ها. لطفاً دوباره تلاش کنید.');
    }
  };

  // Polling effect
  useEffect(() => {
    fetchNotifications(); // Initial fetch
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Handle opening the notification dialog
  const handleOpen = () => {
    setOpen(true);
    fetchNotifications(); // Fetch on open for immediate update
    // Removed markNotificationsAsSeen from here
  };

  // Handle closing the notification dialog
  const handleClose = () => {
    setOpen(false);
    setError(null); // Clear error on close
    markNotificationsAsSeen(); // Mark notifications as seen when dialog closes
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notifications.filter(n => !n.Seen).length} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        dir="rtl"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          اعلان‌ها
          <IconButton
            onClick={fetchNotifications}
            sx={{ position: 'absolute', left: 8, top: 8 }}
          >
            <Refresh />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'right' }}>
              {error}
            </Typography>
          )}
          <List>
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <React.Fragment key={notif.id}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: notif.Seen ? 0.5 : 1, // Fade effect for seen notifications
                    }}
                  >
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mb: 0.5, textAlign: 'right' }}
                        >
                          {formatPersianDate(notif.Date)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {!notif.Seen && (
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                backgroundColor: 'red',
                                borderRadius: '50%',
                                ml: 1, // Margin-left for RTL (places circle to the right of the message)
                              }}
                            />
                          )}
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 'bold', textAlign: 'right' }}
                          >
                            {notif.Message}
                          </Typography>
                        </Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ textAlign: 'right' }}
                        >
                          فرستنده: {notif.SenderFullName || 'نامشخص'}
                        </Typography>
                      </Box>
                      <Link
                        href={`/report/${notif.CityProblemID}`}
                        sx={{
                          color: '#4CAF50',
                          display: 'flex',
                          alignItems: 'center',
                          textDecoration: 'none',
                          ml: 2,
                        }}
                      >
                        <ArrowForward sx={{ ml: 0.5, color: '#4CAF50' }} />
                        رفتن به صفحه گزارش
                      </Link>
                    </Box>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: 'right' }}
              >
                اعلانی برای نمایش وجود ندارد
              </Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}