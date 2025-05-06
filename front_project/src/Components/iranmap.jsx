// src/components/IranMapSection.jsx

import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect
} from 'react';
import { IranMap } from 'react-iran-map';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import '../App.css';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort"; 
import CheckIcon from "@mui/icons-material/Check";
import { ListItemIcon, ListItemText } from "@mui/material";


export default function IranMapSection() {
  const wrapperRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mapData, setMapData] = useState({});
  const [provinceLabels, setProvinceLabels] = useState({});
  const [provinceIdMapping, setProvinceIdMapping] = useState({});
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [citySearch, setCitySearch] = useState('');
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [sortMode, setSortMode] = useState('alphabetical'); // یا 'count'

  const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);

const handleMenuClick = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
  setAnchorEl(null);
};

const handleSortSelect = (mode) => {
  setSortMode(mode);
  handleMenuClose();
};

  useLayoutEffect(() => {
    if (!loadingMap && wrapperRef.current) {
      const svg = wrapperRef.current.querySelector('svg');
      svg?.querySelectorAll('text, tspan, title, desc').forEach(el => el.remove());
    }
  }, [loadingMap]);

  useEffect(() => {
    fetchProvincesData();
  }, []);

  const provinceNameMapping = {
    "اردبیل": "ardabil", "اصفهان": "isfahan", "البرز": "alborz", "ایلام": "ilam",
    "آذربایجان شرقی": "eastAzerbaijan", "آذربایجان غربی": "westAzerbaijan", "بوشهر": "bushehr", "تهران": "tehran",
    "چهارمحال و بختیاری": "chaharmahalandBakhtiari", "خراسان جنوبی": "southKhorasan", "خراسان رضوی": "razaviKhorasan",
    "خراسان شمالی": "northKhorasan", "خوزستان": "khuzestan", "زنجان": "zanjan", "سمنان": "semnan",
    "سیستان و بلوچستان": "sistanAndBaluchestan", "فارس": "fars", "قزوین": "qazvin", "قم": "qom",
    "کردستان": "kurdistan", "کرمان": "kerman", "کهگیلویه و بویراحمد": "kohgiluyehAndBoyerAhmad", "کرمانشاه": "kermanshah",
    "گلستان": "golestan", "گیلان": "gilan", "لرستان": "lorestan", "مازندران": "mazandaran",
    "مرکزی": "markazi", "هرمزگان": "hormozgan", "همدان": "hamadan", "یزد": "yazd"
  };

  const fetchProvincesData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/provinces-report-count/`, {
        credentials: 'include'
      });
      const data = await res.json();

      const tempMapData = {};
      const tempLabels = {};
      const tempIdMapping = {};

      data.forEach(prov => {
        const eng = provinceNameMapping[prov.Name];
        if (eng) {
          tempLabels[eng] = prov.Name;
          tempMapData[eng] = prov.problems_count;
          tempIdMapping[eng] = prov.id;
        }
      });

      setProvinceLabels(tempLabels);
      setMapData(tempMapData);
      setProvinceIdMapping(tempIdMapping);
    } catch (err) {
      console.error('Error loading provinces data:', err);
    } finally {
      setLoadingMap(false);
    }
  };

  const handleSelectProvince = async prov => {
    const key = prov.name;
    const id = provinceIdMapping[key];
    if (!id) return;

    setLoadingCities(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/complex-report-count/?Province_ID=${id}`, {
        credentials: 'include'
      });
      const citiesArr = await res.json();
      const cities = {};
      citiesArr.forEach(c => {
        cities[c.Name] = c.problems_count;
      });

      setSelectedProvince({
        key,
        id,
        label: provinceLabels[key] || prov.faName,
        count: mapData[key] ?? 0,
        cities
      });
    } catch (err) {
      console.error('Error loading cities:', err);
    } finally {
      setLoadingCities(false);
    }
  };

  const mapHeight = isMobile ? 300 : 700;

  return (
    <Box sx={{ fontFamily: 'Vazir', direction: 'rtl', p: isMobile ? 1 : 4 }}>
      <Typography variant={isMobile ? 'h6' : 'h5'} align="center" mb={isMobile ? 2 : 3}>
        نقشه گزارش‌ها بر اساس استان
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'stretch', maxWidth: 1000, mx: 'auto' }}>
        {/* نقشه */}
        <Box
          ref={wrapperRef}
          className="iran-map-wrapper no-labels"
          sx={{ flex: 1, width: '100%', maxWidth: isMobile ? '100%' : 600, height: mapHeight }}
        >
          {loadingMap ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <IranMap
              data={mapData}
              colorRange="34, 115, 226"
              deactiveProvinceColor="#e3f2fd"
              selectedProvinceColor="#ff7043"
              textColor="transparent"
              width="100%"
              height="100%"
              tooltipTitle="تعداد گزارش:"
              selectProvinceHandler={handleSelectProvince}
            />
          )}
        </Box>

        {/* اطلاعات شهرها */}
        {selectedProvince && (
          <Box
            sx={{
              flexBasis: { xs: '100%', md: '30%' },
              p: 2,
              borderRadius: 2,
              bgcolor: '#e6f4ea',
              border: '1px solid #3bcc6d',
              color: '#2e7d32',
              fontWeight: 'bold',
              boxShadow: 2,
              minHeight: mapHeight,
              maxHeight: mapHeight,
              height: mapHeight,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold" mb={2} textAlign="center">
              {selectedProvince.label} – {selectedProvince.count} گزارش
            </Typography>

            <TextField
              placeholder="جستجوی شهر..."
              size="small"
              fullWidth
              sx={{ mb: 1.5, bgcolor: 'white', borderRadius: 1 }}
              value={citySearch}
              onChange={e => setCitySearch(e.target.value)}
            />

<Tooltip title="مرتب‌سازی">
  <IconButton
    onClick={handleMenuClick}
    sx={{
      alignSelf: "flex-end",
      mb: 2,
      color: "#388e3c",
      border: "1px solid #388e3c",
      borderRadius: 2,
      p: 1
    }}
  >
    <SortIcon />
  </IconButton>
</Tooltip>

<Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
  <MenuItem onClick={() => handleSortSelect("alphabetical")} sx={{ direction: "rtl" }}>
    {sortMode === "alphabetical" && (
      <ListItemIcon sx={{ minWidth: 0, ml: 1 }}>
        <CheckIcon sx={{ color: "#388e3c" }} />
      </ListItemIcon>
    )}
    <ListItemText
      primary="مرتب‌سازی الفبایی"
      sx={{
        textAlign: "right",
        color: sortMode === "alphabetical" ? "#388e3c" : "inherit",
        fontWeight: sortMode === "alphabetical" ? "bold" : "normal"
      }}
    />
  </MenuItem>

  <MenuItem onClick={() => handleSortSelect("count")} sx={{ direction: "rtl" }}>
    {sortMode === "count" && (
      <ListItemIcon sx={{ minWidth: 0, ml: 1 }}>
        <CheckIcon sx={{ color: "#388e3c" }} />
      </ListItemIcon>
    )}
    <ListItemText
      primary="بر اساس تعداد گزارش"
      sx={{
        textAlign: "right",
        color: sortMode === "count" ? "#388e3c" : "inherit",
        fontWeight: sortMode === "count" ? "bold" : "normal"
      }}
    />
  </MenuItem>
</Menu>




            {/* لیست شهرها */}
            <Box
              component="ul"
              sx={{
                listStyle: 'none',
                p: 0,
                m: 0,
                flexGrow: 1,
                overflowY: 'auto',
                fontSize: 14,
                color: '#1b5e20'
              }}
            >
              {loadingCities ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (() => {
                const filtered = Object.entries(selectedProvince.cities)
                  .filter(([city, count]) => count > 0 && city.includes(citySearch));

                const sorted = [...filtered].sort((a, b) =>
                  sortMode === 'alphabetical'
                    ? a[0].localeCompare(b[0], 'fa')
                    : b[1] - a[1]
                );

                return sorted.length > 0 ? (
                  sorted.map(([city, count]) => (
                    <li key={city} style={{ marginBottom: 6 }}>
                      • {city} – {count} گزارش
                    </li>
                  ))
                ) : (
                  <Typography align="center" color="text.secondary" mt={2}>
                    گزارشی ثبت نشده است.
                  </Typography>
                );
              })()}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
