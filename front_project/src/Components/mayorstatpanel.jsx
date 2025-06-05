import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import moment from "moment-jalaali";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

moment.loadPersian({ dialect: "persian-modern" });

const baseURL = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}`;

const pieColors = ["#f87171", "#60a5fa", "#34d399"];

const statusMap = {
  PendingReview: "در انتظار بررسی",
  UnderConsideration: "در حال بررسی",
  IssueResolved: "حل شده",
};
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 1,
            padding: "6px 10px",
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {label}
          </Typography>
          <Typography variant="body2" color="primary">
            مقدار: {toFaNumber(payload[0].value)}
          </Typography>
        </Box>
      );
    }
  
    return null;
  };
  

const toFaNumber = (num) =>
  String(num).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
  }) => {
    if (percent === 0) return null; 
  
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 24;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${statusMap[name]}: ${toFaNumber((percent * 100).toFixed(0))}٪`}
      </text>
    );
  };
  

export default function MayorStatsPanel() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRefs = useRef([]);
  const [isExporting, setIsExporting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const problemTypeMap = {
    Lighting: "روشنایی",
    Garbage: "زباله",
    Street: "خیابان",
    Other: "سایر",
  };
  const orgTypeMap = {
  Water: "آب",
  Waste: "پسماند",
  Gas: "گاز",
  Electricity: "برق",
};

  const engagementMap = {
    Likes: "پسندیده",
    Dislikes: "نپسندیده",
  };
  const barColors = ["#8884d8", "#82ca9d", "#ffbb28", "#ff6b6b"];

  
  
  

  const pieOuter = isMobile ? 90 : 160;
  const pieActiveOuter = isMobile ? 140 : 180;

  const handleActivate = (_, index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    contentRefs.current = new Array(7).fill().map(() => React.createRef());
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseURL}/stats/mayor-performance/`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات آمار");
        const data = await res.json();
        console.log(data);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const exportToPDF = async () => {
    setIsExporting(true);

    document.body.classList.add("pdf-exporting");
  
    const pdf     = new jsPDF("p", "mm", "a4");
    const pageW   = pdf.internal.pageSize.getWidth();
    const pageH   = pdf.internal.pageSize.getHeight();
    let   yOffset = 0;
  
    for (const ref of contentRefs.current) {
      const el = ref.current;
      if (!el) continue;
  
      const targets = isMobile ? Array.from(el.children) : [el];
  
      for (const target of targets) {
        if (!(target instanceof HTMLElement) || target.offsetHeight === 0) continue;
  
        const canvas   = await html2canvas(target, { scale: 3, useCORS: true, backgroundColor: "#fff" });
        const imgData  = canvas.toDataURL("image/jpeg", 1);
        const props    = pdf.getImageProperties(imgData);
  
        // نسبت بدون سقف ۱ ➜ اجازهٔ بزرگ شدن
        const ratio    = Math.min(pageW / props.width, pageH / props.height);
        const imgW     = props.width  * ratio;
        const imgH     = props.height * ratio;
  
        if (yOffset + imgH > pageH) {
          pdf.addPage();
          yOffset = 0;
        }
  
        // const x = pageW - imgW; // اگر می‌خواهی راست‌چین شود
        const x = (pageW - imgW) / 2; // یا این برای وسط‌چین
        pdf.addImage(imgData, "JPEG", x, yOffset, imgW, imgH);
        yOffset += imgH + 5;
      }
    }
  
    document.body.classList.remove("pdf-exporting");
    setIsExporting(false);
    pdf.save("شهردار-آمار.pdf");
  };
  
  
  
  
  

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>در حال دریافت اطلاعات آمار...</Typography>
      </Box>
    );
  if (error)
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  const formattedLastCoopDate = stats.Mayor_LastCooperation
    ? toFaNumber(moment(stats.Mayor_LastCooperation).format("jYYYY/jMM/jDD"))
    : "—";

  const pieData = Object.entries(stats.problem_status_pie_chart).map(
    ([name, value]) => ({ name, value })
  );
  const barData = Object.entries(stats.problem_type_bar_chart).map(
    ([name, value]) => ({
      name: problemTypeMap[name] || name,
      value,
    })
  );
  
  const likeData = Object.entries(stats.engagement_bar_chart).map(
    ([name, value]) => ({
      name: engagementMap[name] || name,
      value,
    })
  );
  
  const lineData = Object.entries(stats.resolved_over_time_line_chart).map(
    ([date, value]) => {
      const enMoment = moment(date, "MMMM YYYY", "en", true);
      const faLabel = enMoment.isValid()
        ? toFaNumber(enMoment.locale("fa").format("jYYYY/jMM"))
        : "تاریخ نامعتبر";
  
      return {
        name: faLabel,
        value,
      };
    }
  );
  
  
  
  

  return (
    <Box dir="rtl">
      <Typography variant="h4" fontWeight="bold" mb={3}>
        آمار عملکرد شهردار
      </Typography>

      <Box textAlign="left" mb={2}>
      <Button
          variant="contained"
          disabled={isExporting}
          sx={{
            backgroundColor: "#22c55e",
            "&:hover": { backgroundColor: "#16a34a" },
            px: 3,
            py: 1.5,
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: 2,
            gap: 1.5,
            display: "flex",
            alignItems: "center",
          }}
          onClick={exportToPDF}
        >
          {isExporting ? (
            <>
              <CircularProgress size={20} color="inherit" />
              <Typography variant="button" sx={{ mr: 1 }}>
                در حال آماده‌سازی...
              </Typography>
            </>
          ) : (
            <>
              <PictureAsPdfIcon sx={{ fontSize: 22 }} />
              دانلود PDF
            </>
          )}
        </Button>
</Box>


      <Box ref={contentRefs.current[0]}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            اطلاعات شهردار
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>نام: {stats.Mayor_Name}</Typography>
          <Typography>ایمیل: {stats.Mayor_Email}</Typography>
          <Typography>شهرها: {stats.Mayor_Cities.join("، ")}</Typography>
          <Typography>استان‌ها: {stats.Mayor_Provinces.join("، ")}</Typography>
          <Typography>
            تعداد مشکلات ثبت‌شده: {toFaNumber(stats.Mayor_CityProblems)}
          </Typography>
          <Typography>تاریخ آخرین همکاری: {formattedLastCoopDate}</Typography>
        </Paper>
      </Box>

      <Box ref={contentRefs.current[1]}>
  <Paper sx={{ p: 3, mb: 4 }}>
    <Typography variant="h6" fontWeight="bold" mb={1}>
      سازمان‌های زیرمجموعه
    </Typography>
    <Divider sx={{ my: 2 }} />
    {stats.Organizations && stats.Organizations.length > 0 ? (
      stats.Organizations.map((org, index) => (
        <Box
          key={org.id}
          sx={{
            mb: 2,
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography>🔹 نوع سازمان: {orgTypeMap[org.Type] || org.Type}</Typography>
          <Typography>👤 مدیر: {org.OrganHead_FullName}</Typography>
          <Typography>📧 ایمیل: {org.OrganHead_Email}</Typography>
          <Typography>📞 شماره تماس: {toFaNumber(org.OrganHead_Number)}</Typography>
          <Typography>📍 شهر: {org.CityName} | استان: {org.ProvinceName}</Typography>
        </Box>
      ))
    ) : (
      <Typography color="text.secondary">
        در حال حاضر هیچ سازمانی ثبت نشده است.
      </Typography>
    )}
  </Paper>
</Box>



      <Grid container spacing={2}>
        <Grid item xs={12} ref={contentRefs.current[2]}>
  <Paper sx={{ p: 2, overflow: "hidden" }}>
    <Typography
      variant="h6"
      fontWeight="bold"
      mb={1}
      textAlign="right"
    >
      وضعیت مشکلات
    </Typography>

    <Box sx={{ overflowX: isMobile ? "auto" : "visible" }}>
      <ResponsiveContainer
        width="100%"
        height={isMobile ? 250 : 450}
      >
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={isMobile ? 80 : 160}
            activeIndex={activeIndex}
            activeOuterRadius={isMobile ? 100 : 180}
            onMouseEnter={handleActivate}
            onClick={handleActivate}
            labelLine={false}
            isAnimationActive
            label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
              if (percent === 0) return null;
              const RADIAN = Math.PI / 180;
              const radius = outerRadius - 20;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              return (
                <text
                  x={x}
                  y={y}
                  fill="#000"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isMobile ? 10 : 14}
                  fontWeight="bold"
                >
                  {`${statusMap[name]}: ${toFaNumber((percent * 100).toFixed(0))}٪`}
                </text>
              );
            }}
          >
            {pieData.map((_, index) => (
              <Cell
                key={index}
                fill={pieColors[index % pieColors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box mt={3} px={1}>
  <Typography
    variant="body2"
    sx={{
      color: "text.secondary",
      lineHeight: 2,
      fontSize: isMobile ? "0.85rem" : "1rem",
      borderRight: "4px solid #60a5fa",
      pr: 2,
      borderRadius: "4px",
      backgroundColor: "#f9fafb",
    }}
  >
    📊 این نمودار نمای کلی‌ای از وضعیت رسیدگی به گزارش‌های شهروندان را نمایش می‌دهد.
    <br />
    🔴 <strong>در انتظار بررسی</strong>: گزارش‌هایی که هنوز بررسی نشده‌اند.
    <br />
    🔵 <strong>در حال بررسی</strong>: گزارش‌هایی که در حال پیگیری هستند.
    <br />
    🟢 <strong>حل شده</strong>: گزارش‌هایی که با موفقیت رسیدگی شده‌اند.
    <br />
    با نگاه به این نمودار می‌توانید اولویت‌بندی بهتری برای پیگیری‌ها انجام دهید.
  </Typography>
</Box>


    </Box>
  </Paper>
</Grid>



<Grid item xs={12} ref={contentRefs.current[3]}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" fontWeight="bold" mb={1}>
      انواع مشکلات
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData}>
        <XAxis
          dataKey="name"
          interval={0}                      
          tick={{
            angle: isMobile ? -90 : 0,     
            textAnchor: isMobile ? "end" : "middle",
            dy: isMobile ? 27 : 0,
            fontSize: isMobile ? 10 : 18,
          }}
        />
        <YAxis
          tickFormatter={toFaNumber}
          tick={{ textAnchor: "end", dx: -25 }}
          allowDecimals={false}
          domain={[0, "dataMax"]}
          label={{
            value: "تعداد گزارشات",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle", fontSize: 14, fill: "#555" },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          label={{
            position: "center",
            content: (props) => {
              const { x, y, width, height, value } = props;
              return (
                <text
                  x={x + width / 2}
                  y={y + height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={22}
                  fontWeight="bold"
                >
                  {toFaNumber(value)}
                </text>
              );
            },
          }}
        >
          {barData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={barColors[index % barColors.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <Box mt={3} px={1}>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          lineHeight: 2,
          fontSize: isMobile ? "0.85rem" : "1rem",
          borderRight: "4px solid #8884d8",
          pr: 2,
          borderRadius: "4px",
          backgroundColor: "#f9fafb",
        }}
      >
        🛠️ این نمودار تعداد گزارش‌های ثبت‌شده را بر اساس نوع مشکل نمایش می‌دهد.
        <br />
        🔹 <strong>روشنایی</strong>: شامل خرابی چراغ‌ها و تیرهای برق.
        <br />
        🔸 <strong>زباله</strong>: مواردی مربوط به انباشت یا رهاسازی زباله.
        <br />
        🚧 <strong>خیابان</strong>: نظیر چاله‌ها، خرابی آسفالت یا سد معبر.
        <br />
        📌 <strong>سایر</strong>: مشکلاتی که در دسته‌بندی‌های مشخص‌شده نمی‌گنجند.
        <br />
        با استفاده از این نمودار می‌توان فهمید کدام حوزه‌ها بیشتر مورد توجه شهروندان قرار گرفته‌اند.
      </Typography>
    </Box>
  </Paper>
</Grid>


        <Grid item xs={12} ref={contentRefs.current[4]}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" fontWeight="bold" mb={1}>
      میزان تعامل
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={likeData}>
  <XAxis dataKey="name" />
  <YAxis
    tickFormatter={toFaNumber}
    tick={{ textAnchor: "end", dx: -20 }}
    label={{
      value: "تعداد پسندیده/نپسندیده",
      angle: -90,
      position: "insideLeft",
      style: { textAnchor: "middle", fontSize: 14, fill: "#555" },
    }}
  />
  <Tooltip content={<CustomTooltip />} />
  <Bar
    dataKey="value"
    label={{
      position: "center",
      content: (props) => {
        const { x, y, width, height, value } = props;
        return (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={22}
            fontWeight="bold"
          >
            {toFaNumber(value)}
          </text>
        );
      },
    }}
  >
    {likeData.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={entry.name === "پسندیده" ? "#34d399" : "#fca5a5"} 
      />
    ))}
  </Bar>
</BarChart>

    </ResponsiveContainer>
    <Box mt={3} px={1}>
  <Typography
    variant="body2"
    sx={{
      color: "text.secondary",
      lineHeight: 2,
      fontSize: isMobile ? "0.85rem" : "1rem",
      borderRight: "4px solid #34d399",
      pr: 2,
      borderRadius: "4px",
      backgroundColor: "#f9fafb",
    }}
  >
    📊 این نمودار میزان تعامل کاربران با گزارشات را نمایش می‌دهد.
    <br />
    ✅ <strong>پسندیده</strong> با رنگ سبز نشان‌دهنده تعداد کاربرانی است که گزارش ها را مفید دانسته‌اند.
    <br />
    ❌ <strong>نپسندیده</strong> با رنگ قرمز نمایش داده شده و نشان‌دهنده نارضایتی یا عدم تأیید گزارش ها است.
    <br />
    این آمار به تحلیل بازخورد عمومی کاربران نسبت به گزارشات شهری کمک می‌کند.
  </Typography>
</Box>

  </Paper>
</Grid>


        <Grid item xs={12} ref={contentRefs.current[5]}>
        <Paper sx={{ p: 2, minHeight: 500 }}>
  <Typography variant="h6" fontWeight="bold" mb={1}>
    روند حل مشکلات
  </Typography>
  <ResponsiveContainer width="100%" height={400}>
    <LineChart
      data={lineData}
      margin={{ top: 20, right: 30, left: 20, bottom: 70 }} 
    >
      <XAxis
        dataKey="name"
        interval={0}
        tick={{
          angle: -90,
          textAnchor: "end",
          dy: 45,
          fontSize: 12,
        }}
      />
   <YAxis
  tickFormatter={(v) => toFaNumber(Math.round(v))}
  tick={{ textAnchor: "end", dx: -35 }}
  label={{
    value: "تعداد مشکل حل شده",
    angle: -90,
    position: "insideLeft",
    style: {
      textAnchor: "middle",
      fontSize: 14,
      fill: "#555",
    },
    dx: -15, 
  }}
/>



<Tooltip content={<CustomTooltip />} />
<Line
        type="monotone"
        dataKey="value"
        stroke="#ff7300"
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
  <Box mt={3} px={1}>
  <Typography
    variant="body2"
    sx={{
      color: "text.secondary",
      lineHeight: 2,
      fontSize: isMobile ? "0.85rem" : "1rem",
      borderRight: "4px solid #ff7300",
      pr: 2,
      borderRadius: "4px",
      backgroundColor: "#fefcfb",
    }}
  >
    📈 این نمودار نشان‌دهنده <strong>روند زمانی حل شدن مشکلات</strong> در طی ماه‌های گذشته است.
    <br />
    محور افقی بازه‌های زمانی (ماه و سال) را نمایش می‌دهد و محور عمودی، تعداد مشکلاتی را که در آن بازه زمانی به وضعیت «حل شده» رسیده‌اند، نشان می‌دهد.
    <br />
    این اطلاعات می‌تواند در تحلیل سرعت رسیدگی و عملکرد کلی شهردار مؤثر باشد.
  </Typography>
</Box>

</Paper>

</Grid>

<Grid item xs={12} ref={contentRefs.current[6]}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" fontWeight="bold" mb={1}>
      مدت زمان رسیدگی
    </Typography>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={[
          {
            name: "روشنایی",
            UnderConsideration: stats.transition_time_bar_chart.Lighting_UnderConsideration,
            IssueResolved: stats.transition_time_bar_chart.Lighting_IssueResolved,
          },
          {
            name: "زباله",
            UnderConsideration: stats.transition_time_bar_chart.Garbage_UnderConsideration,
            IssueResolved: stats.transition_time_bar_chart.Garbage_IssueResolved,
          },
          {
            name: "خیابان",
            UnderConsideration: stats.transition_time_bar_chart.Street_UnderConsideration,
            IssueResolved: stats.transition_time_bar_chart.Street_IssueResolved,
          },
          {
            name: "سایر",
            UnderConsideration: stats.transition_time_bar_chart.Other_UnderConsideration,
            IssueResolved: stats.transition_time_bar_chart.Other_IssueResolved,
          },
        ]}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <XAxis
          dataKey="name"
          interval={0}
          tick={{
            angle: -90,
            dy: 40,
            fontSize: 18,
          }}
        />
        <YAxis
  tickFormatter={(value) => toFaNumber(Number(value).toFixed(2))}
  tick={{ textAnchor: "end", dx: -40 }}
  label={{
    value: "میانگین زمان بررسی / حل شدن (روز)",
    angle: -90,
    position: "insideLeft",
    style: {
      textAnchor: "middle",
      fontSize: 14,
      fill: "#555",
    },
    dx: -15, 
  }}
/>

        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Box
                  sx={{
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    padding: "8px 12px",
                    boxShadow: 2,
                    maxWidth: 220,
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    direction: "rtl",
                    fontSize: "0.875rem",
                  }}
                >
                  <Typography fontWeight="bold" mb={0.5}>
                    نوع: {label}
                  </Typography>
                  <Typography color="primary.main">
                    میانگین زمان تا بررسی (روز):{" "}
                    {toFaNumber(Number(payload[0]?.value ?? 0).toFixed(6))}
                  </Typography>
                  {payload[1] && (
                    <Typography color="error">
                      میانگین زمان تا حل شدن (روز):{" "}
                      {toFaNumber(Number(payload[1]?.value ?? 0).toFixed(6))}
                    </Typography>
                  )}
                </Box>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="UnderConsideration"
          name="میانگین زمان تا بررسی (روز)"
          fill="#60a5fa"
        />
        <Bar
          dataKey="IssueResolved"
          name="میانگین زمان تا حل شدن (روز)"
          fill="#f87171"
        />
      </BarChart>
    </ResponsiveContainer>
    <Box mt={3} px={1}>
  <Typography
    variant="body2"
    sx={{
      color: "text.secondary",
      lineHeight: 2,
      fontSize: isMobile ? "0.85rem" : "1rem",
      borderRight: "4px solid #60a5fa",
      pr: 2,
      borderRadius: "4px",
      backgroundColor: "#f8fafc",
    }}
  >
    ⏱️ در این نمودار، <strong>میانگین مدت زمان رسیدگی</strong> به هر نوع مشکل نمایش داده شده است.
    <br />
    نوارهای آبی نشان‌دهنده زمان متوسط تا آغاز بررسی، و نوارهای قرمز زمان متوسط تا حل کامل مشکل هستند.
    <br />
    این داده‌ها به مدیران شهری کمک می‌کند تا تشخیص دهند کدام نوع مشکلات نیازمند بهبود در سرعت رسیدگی هستند.
  </Typography>
</Box>

  </Paper>
</Grid>


      </Grid>
    </Box>
  );
}
