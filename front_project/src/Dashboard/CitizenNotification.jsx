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
  Tooltip,
} from '@mui/material';
import { Notifications, ArrowForward, AirplanemodeActive, AirplanemodeInactive } from '@mui/icons-material';

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
  const [isNotificationActive, setIsNotificationActive] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/notification/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401 || response.status === 403) {
        console.error("User not authenticated, redirecting to login...");
        window.location.href = '/signuplogin';
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

  const fetchNotificationActivationState = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/notifs/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Notification Activation State:", data);
        setIsNotificationActive(!data.NotificationDeactivationTime);
      } else {
        console.error("Failed to fetch notification activation state:", response.statusText);
        setError(`خطا در دریافت وضعیت اعلان‌ها: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching notification activation state:", error);
      setError('خطا در ارتباط با سرور برای وضعیت اعلان‌ها.');
    }
  };

  const toggleNotificationActivation = async () => {
    const newState = !isNotificationActive;
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/notifs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ Activate: newState }),
      });

      if (response.ok) {
        await fetchNotificationActivationState();
        if (newState) {
          fetchNotifications();
        }
      } else {
        console.error("Failed to toggle notification activation:", response.statusText);
        setError(`خطا در تغییر وضعیت اعلان‌ها: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error toggling notification activation:", error);
      setError('خطا در تغییر وضعیت اعلان‌ها.');
    }
  };

  const markNotificationsAsSeen = async () => {
    try {
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

  useEffect(() => {
    fetchNotificationActivationState();
    fetchNotifications();
    const interval = setInterval(() => {
      if (isNotificationActive) {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isNotificationActive]);

  const handleOpen = () => {
    setOpen(true);
    fetchNotifications();
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    markNotificationsAsSeen();
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
          <Tooltip title={isNotificationActive ? 'غیر فعال کردن اعلان‌ها' : 'فعال کردن اعلان‌ها'} arrow>
          <IconButton
              onClick={toggleNotificationActivation}
              sx={{
                position: 'absolute',
                left: 8,
                top: 8,
                color: isNotificationActive ? '#999' : '#4CAF50', // Gray when active, green when inactive
              }}
            >
              {isNotificationActive ? <AirplanemodeInactive /> : <AirplanemodeActive />}
            </IconButton>
          </Tooltip>
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
                      opacity: notif.Seen ? 0.5 : 1,
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
                                ml: 1,
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
                        href={`/reports/${notif.CityProblemID}`}
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