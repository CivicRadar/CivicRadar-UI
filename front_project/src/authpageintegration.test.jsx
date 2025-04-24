import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthPage from "./signuplogin";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { CitizenProvider } from "./context/CitizenContext";
import { MayorProvider } from "./context/MayorContext";
import { AdminProvider } from "./context/AdminContext";
import '@testing-library/jest-dom';

const ProvidersWrapper = ({ children }) => (
  <CitizenProvider>
    <MayorProvider>
      <AdminProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </AdminProvider>
    </MayorProvider>
  </CitizenProvider>
);

describe("Mayor Login Flow", () => {
  it("✅ should login successfully and show alert for mayor", async () => {
    // Mock alert و log
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<AuthPage />, { wrapper: ProvidersWrapper });

    // کلیک روی نقش شهردار
    const mayorToggle = await screen.findByRole("button", { name: /مسئول/i });
    userEvent.click(mayorToggle);

    // پر کردن فرم
    const emailInput = screen.getAllByRole("textbox")[0];
    const passwordInput = screen.getByLabelText(/رمز/i);

    userEvent.clear(emailInput);
    userEvent.type(emailInput, "mayor@gmail.com");

    userEvent.clear(passwordInput);
    userEvent.type(passwordInput, "mayor");

    // کلیک روی دکمه ورود
    const loginBtn = screen.getByRole("button", { name: /ورود/i });
    userEvent.click(loginBtn);

    // کمی صبر برای گرفتن پاسخ واقعی
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // بررسی اینکه alert اجرا شده
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("ورود شهردار موفقیت‌آمیز بود! ✅");
    });

    // بررسی اینکه log jwt زده شده
    const logCalls = consoleSpy.mock.calls.map((call) => call[0]);
    const hasJwtLog = logCalls.some((msg) =>
      msg.includes("JWT Token Saved (Mayor)")
    );
    expect(hasJwtLog).toBe(true);
  });
});
it("🔴 should show error if password is incorrect", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
  
    render(<AuthPage />, { wrapper: ProvidersWrapper });
  
    const mayorToggle = await screen.findByRole("button", { name: /مسئول/i });
    userEvent.click(mayorToggle);
  
    const emailInput = screen.getAllByRole("textbox")[0];
    const passwordInput = screen.getByLabelText(/رمز/i);
  
    userEvent.clear(emailInput);
    userEvent.type(emailInput, "mayor@gmail.com");
  
    userEvent.clear(passwordInput);
    userEvent.type(passwordInput, "mayo2r");
  
    const loginBtn = screen.getByRole("button", { name: /ورود/i });
    userEvent.click(loginBtn);
  
    // کمی صبر بده
    await new Promise((resolve) => setTimeout(resolve, 1500));
  
    // حالا بررسی کنیم alert صدا زده **نشده**
    expect(alertMock).not.toHaveBeenCalled();
  
    // و پیام خطا توی صفحه باشه
    await waitFor(() => {
      expect(
        screen.getByText(/ایمیل یا رمز عبور نادرست است/i)
      ).toBeInTheDocument();
    });
  });
  
