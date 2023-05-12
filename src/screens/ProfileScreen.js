import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "./../Store";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

function ProfileScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState([]);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("shippingAddress"));
    if (items) {
      setAddress([items]);
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
      });
      toast.error(getError(err));
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <Row>
        <Col md={8}>
          <h1 className="my-3">User Profile</h1>
          <form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="mb-3">
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Col>
        <Col md={4}>
          <h1 className="my-3">Address</h1>
          {address ? (
            <div className="add-container">
              {address?.map((item, index) => {
                return (
                  <div key={index}>
                    <h6>Province: {item?.province}</h6>
                    <h6>City/Kabupaten: {item?.city}</h6>
                    <h6>District/Kecamatan: {item?.district}</h6>
                    <h6>Postal Code/Kode Pos: {item?.postalCode}</h6>
                    <h6>Address Detail: {item?.address}</h6>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="add-container">
              <h5>No data address yet</h5>
            </div>
          )}
          <div className="mt-3">
            <Button
              type="button"
              variant="light"
              onClick={() => {
                navigate(`/shipping`);
              }}
            >
              Edit Address
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ProfileScreen;
