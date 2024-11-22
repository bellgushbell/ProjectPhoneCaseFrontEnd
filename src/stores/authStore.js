import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Login, register } from '../api/auth'
import { toast } from 'react-toastify'


const useAuthStore = create(persist((set, get) => ({
    user: null,
    token: '',
    loadingLogin: false,
    loadingRegister: false,
    ResetPasswordEmail: '',

    actionRegister: async (form) => {
        try {
            set({ loadingRegister: true });
            // console.log('action Register in zustand')

            const resp = await register(form)
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(resp.data)
            set({ loadingRegister: false });
            toast.success("Register Successful🤗")
        } catch (err) {
            console.log(err.response.data.message)
            toast.error(err.response.data.message)
            set({ loadingRegister: false });
        } finally {
            set({ loadingRegister: false });
        }


    },


    actionLogin: async (form) => {
        try {
            set({ loadingLogin: true });

            console.log('action Login in zustand', form)

            const resp = await Login(form)
            await new Promise(resolve => setTimeout(resolve, 400));
            console.log(resp)
            // console.log(resp.data.user.role)
            console.log(resp.data.user)
            console.log(resp.data.token)
            set({
                user: resp.data.user,
                token: resp.data.token,
                loadingLogin: false
            })//set เก็บค่าเข้าzustand 

            return resp.data.user.role


        } catch (err) {

            console.log(err)

        } finally {
            set({ loadingLogin: false });
        }

        if (get().token === null || get().token === undefined) {
            // ถ้า token เป็น null หรือ undefined ให้หยุดการโหลดดิ้ง
            set({ loadingLogin: false });
        }


    },

    actionLogout: () => {
        localStorage.clear()
        set({ user: null, token: null })
    },

    // Forgot Password: Store email for reset
    setEmailForReset: (ResetPasswordEmail) => set({ ResetPasswordEmail }),  // ฟังก์ชันเพื่อเก็บอีเมลใน store

}), {
    name: 'state',
    storage: createJSONStorage(() => localStorage) //เก็ยบไว้ในlocal storage key state  {"state":{"user":{"id":2,"firstName":"bobby","lastName":"Codecamp","email":"bobby@ggg.mail","mobile":null,"profileImage":"https://www.svgrepo.com/show/393899/avatar-19.svg","coverImage":null},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzI4MDI0MTY5LCJleHAiOjE3MzA2MTYxNjl9.zO9Yf0nTE26Er3rsjw2XCsLg3PlhVipSe6gTSsw75co"},"version":0}
}))

export default useAuthStore