
//برای بهینه تر کردن کار 
//تامامی  ای پی ای ها  در 
// فایل های جداگانه نوشته میشود

// درود دوستان این پایین 
//sign up  
// برای شهروندا هستش 
// ساخت اکانت شهردار توسط ادمین انجام میشود 
export const signupCitizen = async (citizenData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/signup/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(citizenData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Signup Error Response:", errorData);
            console.log(typeof errorData) ;
            let errorMessage = "Signup failed!";
            if (errorData.detail) {
                errorMessage = errorData.detail; 
            } else if (typeof errorData === "string") {
                errorMessage = errorData;
            }

            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in Citizen Signup:", error);
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
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData) ;
            throw new Error(errorData?.detail || "Login failed!");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in Citizen Login:", error.message);
        throw error;
    }
};
