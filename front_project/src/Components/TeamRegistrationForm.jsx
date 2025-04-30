import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getCity, getProvince } from "../services/admin-api";
import "./tr.css";          

// اعتبارسنجی ایمیل
const isValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    String(email).toLowerCase()
  );

export default function TeamRegistrationForm() {
  // ---- state ----
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [formData, setFormData] = useState({
    Type: "",
    OrganHead_FullName: "",
    OrganHead_Email: "",
    OrganHead_Number: "",
  });

  const typeOptions = [
    { label: "آب", value: "Water" },
    { label: "پسماند", value: "Waste" },
    { label: "گاز", value: "Gas" },
    { label: "برق", value: "Electricity" },
  ];

  const [errors, setErrors] = useState({});

  // ---- fetch استان/شهر ----
  useEffect(() => {
    getProvince().then(setProvinces).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getCity(selectedProvince.id).then(setCities).catch(console.error);
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedProvince]);

  // ---- handlers ----
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const errs = {};
    if (!formData.OrganHead_FullName) errs.OrganHead_FullName = "نام مسئول الزامی است";
    if (!formData.OrganHead_Email) errs.OrganHead_Email = "ایمیل الزامی است";
    else if (!isValidEmail(formData.OrganHead_Email)) errs.OrganHead_Email = "ایمیل معتبر نیست";
    if (!formData.OrganHead_Number) errs.OrganHead_Number = "شماره تماس الزامی است";
    if (!formData.Type) errs.Type = "نوع سازمان را انتخاب کنید";
    if (!selectedCity) errs.city = "شهر را انتخاب کنید";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { CityID: selectedCity.id, ...formData };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/mayor-delegate/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "خطای سرور");
      }
      const data = await res.json();
      Swal.fire({
        icon: "success",
        title: "عملیات با موفقیت انجام شد",
        html: `<b>نام مسئول:</b> ${data.OrganHead_FullName}`,
        confirmButtonText: "باشه",
        background: "#e6f4ea", // سبز روشن
        color: "#1b5e20",       // متن سبز تیره
        confirmButtonColor: "#388e3c", // دکمه سبز
        customClass: {
          confirmButton: "swal-confirm-btn",
          title: "swal-title",
        },
      });
      
      handleReset();
    } catch (err) {
      Swal.fire({ icon: "error", title: "خطا", text: err.message });
    }
  };

  const handleReset = () => {
    setFormData({ Type: "", OrganHead_FullName: "", OrganHead_Email: "", OrganHead_Number: "" });
    setSelectedProvince(null);
    setSelectedCity(null);
    setErrors({});
  };

  // ---- UI ----
  return (
    <form dir="rtl" className="form-container" onSubmit={handleSubmit}>
      <h2 className="title">ثبت تیم جدید</h2>

      {/* --- اطلاعات مسئول --- */}
      <fieldset>
        <legend>نام و اطلاعات مسئول</legend>

        <div className="form-control">
          <label>نام مسئول</label>
          <input
            name="OrganHead_FullName"
            value={formData.OrganHead_FullName}
            onChange={handleChange}
            className={errors.OrganHead_FullName ? "error" : ""}
            type="text"
          />
          {errors.OrganHead_FullName && <small>{errors.OrganHead_FullName}</small>}
        </div>

        <div className="form-control">
          <label>ایمیل</label>
          <input
            name="OrganHead_Email"
            value={formData.OrganHead_Email}
            onChange={handleChange}
            className={errors.OrganHead_Email ? "error" : ""}
            type="email"
          />
          {errors.OrganHead_Email && <small>{errors.OrganHead_Email}</small>}
        </div>

        <div className="form-control">
          <label>شماره تماس</label>
          <input
            name="OrganHead_Number"
            value={formData.OrganHead_Number}
            onChange={handleChange}
            className={errors.OrganHead_Number ? "error" : ""}
            type="tel"
          />
          {errors.OrganHead_Number && <small>{errors.OrganHead_Number}</small>}
        </div>

        <div className="form-control">
          <label>نوع سازمان</label>
          <select
            name="Type"
            value={formData.Type}
            onChange={handleChange}
            className={errors.Type ? "error" : ""}
          >
            <option value="">-- انتخاب کنید --</option>
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.Type && <small>{errors.Type}</small>}
        </div>
      </fieldset>

      {/* --- موقعیت جغرافیایی --- */}
      <fieldset>
        <legend>موقعیت جغرافیایی</legend>

        <div className="grid-2">
          <div className="form-control">
            <label>استان</label>
            <select
              value={selectedProvince?.id || ""}
              onChange={(e) =>
                setSelectedProvince(provinces.find((p) => p.id === +e.target.value) || null)
              }
            >
              <option value="">-- انتخاب کنید --</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label>شهر</label>
            <select
              className={errors.city ? "error" : ""}
              value={selectedCity?.id || ""}
              onChange={(e) =>
                setSelectedCity(cities.find((c) => c.id === +e.target.value) || null)
              }
            >
              <option value="">-- انتخاب کنید --</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.Name}
                </option>
              ))}
            </select>
            {errors.city && <small>{errors.city}</small>}
          </div>
        </div>
      </fieldset>

      {/* --- دکمه‌ها --- */}
      <div className="btn-group">
        <button type="submit" className="btn success">
          ثبت تیم
        </button>
        <button type="button" className="btn danger" onClick={handleReset}>
          بازنشانی
        </button>
      </div>
    </form>
  );
}
