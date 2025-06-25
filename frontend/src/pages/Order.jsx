import React, { useState } from "react";
import { useCartData } from "../store/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../store/AppContext";

export default function Order() {
  const { getTotal, item, cartItems } = useCartData();
  const { backendUrl } = useAppContext();
  const [error, setError] = useState();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      setError("login first");
      return;
    }
    const formdata = new FormData(e.target);
    const address = Object.fromEntries(formdata);
    let items = [];
    for (const x of item) {
      if (cartItems[x._id] > 0) {
        let temp = {
          item: x,
          qty: cartItems[x._id],
        };
        items.push(temp);
      }
    }
    const total = getTotal();

    const data = {
      address,
      items,
      amount: total,
    };
    const res = await axios.post(backendUrl + "/orders/place", data, {
      headers: { token: localStorage.getItem("token") },
    });
    console.log(res);

    if (res.data.success) {
      navigate("/myorders");
    } else {
      console.log("error");
    }
  }

  return (
    <div id="order">
      <form onSubmit={handleSubmit}>
        <div className="order_left">
          <h2>Delivery information</h2>

          <div className="order_grp">
            <input
              required
              type="text"
              name="first name"
              placeholder="first name"
            />
            <input
              required
              type="text"
              name="last name"
              placeholder="last name"
            />
          </div>
          <input
            required
            type="text"
            name="email"
            placeholder="email address"
          />
          <input required type="text" name="street" placeholder="street" />
          <div className="order_grp">
            <input required type="text" name="city" placeholder="city" />
            <input required type="text" name="state" placeholder="state" />
          </div>
          <div className="order_grp">
            <input
              required
              type="text"
              name="zip code"
              placeholder="zip code"
            />
            <input required type="text" name="country" placeholder="country" />
          </div>
          <input required type="text" name="number" placeholder="number" />
        </div>
        <div className="cart_left">
          <h2>cart total</h2>
          <div className="cart_left_item">
            <p>subtotal</p>
            <p>${getTotal()}</p>
          </div>
          <hr />
          <div className="cart_left_item">
            <p>Delivery Fee</p>
            <p>${2}</p>
          </div>
          <hr />
          <div className="cart_left_item_toal cart_left_item">
            <p>total</p>
            <p>${getTotal() + 2}</p>
          </div>
          {error ? (
            <p
              style={{
                color: "red",
                position: "relative",
                top: "20px",
              }}
            >
              {error}
            </p>
          ) : (
            <></>
          )}
          <button disabled={error ? true : false}>Order now</button>
        </div>
      </form>
    </div>
  );
}
