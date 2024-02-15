import { Metadata } from "next";
import AuthForm from "./auth-form";

export const metadata: Metadata = {
    title: "innercircle | All events",
};

export default async function LoginPage() {

    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <AuthForm />
        </div>
    );
}
