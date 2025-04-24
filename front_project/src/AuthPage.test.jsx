import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthPage from "./signuplogin"; // مسیر درست فایل اصلی
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { CitizenProvider } from "./context/CitizenContext";
import { MayorProvider } from "./context/MayorContext";
import { AdminProvider } from "./context/AdminContext";
import * as api from "./services/signup_login_api";

// mock useNavigate
const mockNavigate = vi.fn(); // ✅ اینجا تعریف شده

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // ✅ از همون بالا استفاده می‌کنه
  };
});

// mock api
vi.mock("./services/signup_login_api", () => ({
  loginCitizenapi: vi.fn(),
  signupCitizen: vi.fn(),
}));

const renderWithProviders = (ui) =>
  render(
    <BrowserRouter>
      <CitizenProvider>
        <MayorProvider>
          <AdminProvider>{ui}</AdminProvider>
        </MayorProvider>
      </CitizenProvider>
    </BrowserRouter>
  );

describe("🧪 AuthPage Full Test", () => {
  test("1️⃣ صفحه و فیلدها به درستی نمایش داده می‌شوند", () => {
    renderWithProviders(<AuthPage />);
    expect(screen.getByLabelText(/ایمیل/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/رمز عبور/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ورود/i })).toBeInTheDocument();
  });

  test("2️⃣ هنگام وارد کردن ایمیل نامعتبر، خطا نمایش داده شود", async () => {
    renderWithProviders(<AuthPage />);
    fireEvent.change(screen.getByLabelText(/ایمیل/i), {
      target: { value: "wrongemail" },
    });
    fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
      target: { value: "ValidPass@1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ورود/i }));

    await waitFor(() =>
      expect(screen.getByText(/فرمت ایمیل نامعتبر است/i)).toBeInTheDocument()
    );
  });

  test("3️⃣ در حالت ثبت‌نام، رمز عبور ضعیف باعث خطا می‌شود", async () => {
    renderWithProviders(<AuthPage />);
    fireEvent.click(screen.getByText(/ثبت‌نام کنید/i)); // رفتن به signup

    fireEvent.change(screen.getByLabelText(/نام کامل/i), {
      target: { value: "علی رضایی" },
    });
    fireEvent.change(screen.getByLabelText(/ایمیل/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ثبت‌نام/i }));

    await waitFor(() => {
      expect(screen.getByText(/رمز عبور ضعیف است/i)).toBeInTheDocument();
    });
  });

  test("4️⃣ تغییر نقش بین شهروند، مسئول و ادمین", () => {
    renderWithProviders(<AuthPage />);
    fireEvent.click(screen.getByRole("button", { name: /مسئول/i }));
    expect(screen.getByText(/ورود مسئول/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ادمین/i }));
    expect(screen.getByText(/ورود ادمین/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /شهروند/i }));
    expect(screen.getByText(/ورود شهروند/i)).toBeInTheDocument();
  });

  test("ورود موفق شهروند با navigate", async () => {
    const fakeResponse = {
      jwt: "mocked-jwt",
      name: "کاربر تست",
    };
  
    api.loginCitizenapi.mockResolvedValue(fakeResponse);
  
    renderWithProviders(<AuthPage />);
    fireEvent.change(screen.getByLabelText(/ایمیل/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
      target: { value: "Test@1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ورود/i }));
  
    await waitFor(() => {
      expect(api.loginCitizenapi).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/CitizenDashboard");
    });
  });
  test("ورود ناموفق شهروند با ایمیل/رمز اشتباه پیام خطا نمایش دهد", async () => {
    // شبیه‌سازی پاسخ ناموفق API
    api.loginCitizenapi.mockResolvedValue({
      fail: "your email or password is incorrect",
    });
  
    renderWithProviders(<AuthPage />);
    
    fireEvent.change(screen.getByLabelText(/ایمیل/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
      target: { value: "WrongPass@123" },
    });
  
    fireEvent.click(screen.getByRole("button", { name: /ورود/i }));
  
    await waitFor(() => {
      expect(screen.getByText(/ایمیل یا رمز عبور نادرست است/i)).toBeInTheDocument();
    });
  });
  
  
  
  
  
  
});
