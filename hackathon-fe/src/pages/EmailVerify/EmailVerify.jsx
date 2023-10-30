import { Link, useParams, useSearchParams } from "react-router-dom";

import styles from './EmailVerify.module.css';
import { useEffect, useState } from "react";
import { resendEmail, verifyEmail } from "../../utilities/users-service";
import { CircularProgress, Typography } from "@mui/material";
import Footer from "../../components/Footer/Footer";

export default function EmailVerify() {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [isResent,setIsResent] = useState(false);
    const [params] = useSearchParams();

    useEffect(() => {
        const token = params.get('t');
        const verify = async () => {
            try {
                const response = await verifyEmail(token);
                setIsVerified(true);
            } catch (error) {
                setIsVerified(false);
            }finally{
                setIsVerifying(false);
            }
        }
        verify();
    }, []);

    const handleResend = async () =>{
        setIsVerifying(true);
        await resendEmail();
        setIsResent(true);
        setIsVerifying(false);
    }

    return (
        <>
            <div className={styles["container"]}>
                {isVerifying && 
                <>
                <div><Typography>Please wait...</Typography></div>
                <CircularProgress color="secondary" />
                </>}
                {
                    !isVerified && !isVerifying && !isResent &&
                    <>
                    <Typography variant="h5" className={styles["error"]}>Could not verify your email.</Typography>
                    <Typography variant="h6"><Link onClick={handleResend}>Click</Link> to resend the verification email</Typography>
                    </>
                }
                {
                    isVerified && !isVerifying && 
                    <>
                    <Typography variant="h5" className={styles["success"]}>Email verified</Typography>
                    </>
                }
                {
                    !isVerified && !isVerifying && isResent &&
                    <>
                    <Typography variant="h5">Email resent. Please check your inbox</Typography>
                    </>
                }
            </div>
            <Footer />
        </>
    );
}