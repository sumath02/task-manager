import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import "./style.css"; // Ensure the updated styles are imported
import { useQuery } from "@tanstack/react-query";
import { registerApi } from "./Api/api";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Register() {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [loader, setLoader] = useState("");
  const [errors, setError] = useState({});
  const [googleLoader, setGoogleLoader] = useState(false);

  const registerUser = useQuery({
    queryKey: ["registerUser", payload],
    queryFn: () => registerApi(payload),
    enabled: payload !== null && Object.keys(errors).length === 0,
    onSuccess: (response) => {
      const message =
        response.status === 200
          ? response?.data?.message
          : response?.response?.data?.message;
      toast[response.status === 200 ? "success" : "error"](message);
      if (response.status === 200) navigate("/login");
    },
    onError: (err) => toast.error(err),
  });

  useEffect(() => {
    setLoader(registerUser?.isFetching);
  }, [registerUser?.isFetching]);

  const handleSubmit = (values, errors, resetForm) => {
    setError(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all the errors before submitting");
    } else {
      setPayload(values);
      resetForm();
    }
  };

  const initialSchema = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const validationSchema = yup.object().shape({
    first_name: yup.string().required("Required"),
    last_name: yup.string().required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    password: yup
      .string()
      .required("Please enter your password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
      ),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setGoogleLoader(true);
      fetch(`${URL}/api/v3/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeResponse.code }),
      })
        .then((response) => response.json())
        .then((data) => {
          setGoogleLoader(false);
          const decode = jwtDecode(data.id_token);
          const payload = {
            first_name: decode.name,
            last_name: "",
            email: decode.email,
            password: decode.sub,
          };
          setPayload(payload);
          registerUser.refetch();
        })
        .catch((error) => {
          setGoogleLoader(false);
          console.error("Error:", error);
        });
    },
    onError: () => {
      setGoogleLoader(false);
      console.error("Google login failed");
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
        <div className="form_container">
          <Form>
            <div className="form_inner_container">
              <h2 className="title_style">Signup</h2>
              <div className="input_div_container">
                {[
                  "first_name",
                  "last_name",
                  "email",
                  "password",
                  "confirm_password",
                ].map((field, index) => (
                  <div className="input_div" key={index}>
                    <Field
                      onChange={handleChange(field)}
                      onBlur={handleBlur(field)}
                      type={field.includes("password") ? "password" : "text"}
                      placeholder={field
                        .replace("_", " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                      value={values[field]}
                      className="input_style"
                    />
                    {touched[field] && errors[field] && (
                      <p className="error_text">{errors[field]}</p>
                    )}
                  </div>
                ))}
                {loader && (
                  <div className="login_google_verification">
                    Registering your id ...
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
                    Signup
                  </button>
                )}
                {googleLoader && (
                  <div className="login_google_verification">
                    Google verification is going on <ClipLoader />
                  </div>
                )}
                <div className="google_sign_container">
                  <span>
                    Already have an account?{" "}
                    <a href="/login" className="redirect">
                      Login
                    </a>
                  </span>
                  <button
                    className="goggle_btn"
                    type="button"
                    onClick={googleLogin}
                  >
                    Signup with <span>Google</span>
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}
