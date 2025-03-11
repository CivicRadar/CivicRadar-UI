
//برای بهینه تر کردن کار 
//تامامی  ای پی ای ها  در 
// فایل های جداگانه نوشته میشود

const API_BASE_URL = "http://127.0.0.1:8000/auth";

// درود دوستان این پایین 
//sign up  
// برای شهروندا هستش 
// ساخت اکانت شهردار توسط ادمین انجام میشود 
export const signupCitizen = async (citizenData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/signup/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify(citizenData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || "Signup failed!");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in Citizen Signup:", error.message);
        throw error;
    }
};

//درود دوستان این  پایین  لاگین
//  برای همه ی پنل های شهردار
//  و  شهروند و  ادمین  است
//   عملا با فیلد تایپ
//   انتخاب میشود که به کی لاگین شود

export const loginCitizenapi = async (loginData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || "Login failed!");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in Citizen Login:", error.message);
        throw error;
    }
};
