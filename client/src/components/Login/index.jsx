import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { loginApi } from "./API/api";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
export default function Login() {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [loader, setLoader] = useState("");
  const [errors, setError] = useState({});
  const [googleLoader, setGoogleLoader] = useState(false);

  const LoginUser = useQuery({
    queryKey: ["LoginUser", payload],
    queryFn: () => loginApi(payload),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: payload !== null && Object.keys(errors).length === 0,
    onSuccess: (response) => {
      let message = "";
      if (response.status === 200) {
        const token = response.data.token;
        const userId = response.data.userId;
        console.log(response.data);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        toast.success("Login successful");
        navigate("/task-manager");
      } else {
        message = response?.response?.data?.message;
        toast.error(message);
      }
    },
    onError: (err) => {
      let message = response?.response?.data?.message;
      toast.error(err);
    },
  });

  useEffect(() => {
    setLoader(LoginUser?.isFetching);
  }, [LoginUser?.isFetching]);

  const initialSchema = {
    email: "",
    password: "",
  };
  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Required"),
    password: yup.string().required("Please enter your password"),
  });

  const handleSubmit = (values, errors, resetForm) => {
    setError(errors);
    const size = Object.keys(errors).length;
    if (size > 0) {
      console.log(errors);
      toast.error("Please fix all the errors before submitting");
    } else {
      setPayload(values);
      resetForm();
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      // Send the authorization code to the backend server
      setGoogleLoader(true);
      fetch(`${URL}/api/v3/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeResponse.code }),
      })
        .then((response) => response.json())
        .then((data) => {
          var decode = jwtDecode(data.id_token);
          const payload = { email: decode.email, password: decode.sub };
          setPayload(payload);
          setGoogleLoader(false);
          LoginUser.refetch();
        })
        .catch((error) => {
          setGoogleLoader(false);
          console.error("Error:", error);
        });
    },
    onError: () => {
      // Handle login errors here
      setGoogleLoader(false);
      toast.error("Google login failed");
    },
    flow: "auth-code",
  });

  return (
    <Formik initialValues={initialSchema} validationSchema={validationSchema}>
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        touched,
        resetForm,
        isValid,
        dirty,
      }) => (
        <div className="mycard">
          <Form>
            <div className="login_form_container">
              <div className="login_form_inner_container">
                <h2 className="title_style" style={{ width: "100%" }}>
                  Login
                </h2>
                <div></div>
                <div className="login_input_div_container">
                  <div
                    className="login_input_div"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Field
                      onChange={handleChange("email")}
                      onBlur={handleBlur("email")}
                      type="text"
                      placeholder="Email"
                      value={values.email}
                      className="input_login_style"
                    />
                    {touched.email && errors.email && (
                      <p className="error_text">{errors.email}</p>
                    )}
                  </div>
                  <div
                    className="login_input_div"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Field
                      onChange={handleChange("password")}
                      onBlur={handleBlur("password")}
                      type="password"
                      placeholder="Password"
                      value={values.password}
                      className="input_login_style"
                    />
                    {touched.password && errors.password && (
                      <p className="error_text">{errors.password}</p>
                    )}
                  </div>
                  {loader && (
                    <div className="login_google_verification">
                      Logging you in...
                      <ClipLoader />
                    </div>
                  )}
                  {!loader && (
                    <button
                      type="button"
                      className="btn"
                      disabled={!isValid || !dirty}
                      style={{ opacity: !isValid || !dirty ? 0.5 : 1 }}
                      onClick={() => handleSubmit(values, errors, resetForm)}
                    >
                      Login
                    </button>
                  )}
                  {googleLoader && (
                    <div className="login_google_verification">
                      Google verification is going on <ClipLoader />
                    </div>
                  )}
                  <div className="google_login_container">
                    <span>
                      Don't have an account ?{" "}
                      <a href="/sign-in" className="redirect">
                        Signup
                      </a>
                    </span>
                    <button
                      className="goggle_btn"
                      type="button"
                      onClick={googleLogin}
                    >
                      Login with <span>Google</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}
