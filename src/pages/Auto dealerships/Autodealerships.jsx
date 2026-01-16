/** @format */
import { useState } from "react";
import "./Autodealerships.css";
import img from "../../assets/images/img31.png";
import img2 from "../../assets/images/img32.png";
import img3 from "../../assets/images/img33.png";
import img4 from "../../assets/images/img34.png";
import img5 from "../../assets/images/img35.png";
import img6 from "../../assets/images/img36.png";
import img7 from "../../assets/images/img37.png";
import img8 from "../../assets/images/img38.jpg";
import img9 from "../../assets/images/img39.png";
import img10 from "../../assets/images/img40.png";

const Autodealerships = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    dealerName: "",
    email: "",
    phone: "",
    zipCode: "",
    isWorkLicense: false,
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://mamun-reza-freeshops-backend-omega.vercel.app/api/v1/admin/AutoDealerShip/createAutoDealerShipForm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData(initialState);
      } else {
        alert("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <>
      <div className="container-fluid auto-container form">
        <div className="container-fluid px-lg-5">
          <div className="row d-flex align-items-center py-3">
            <div className="col-lg-5 mt-lg-5 ">
              <h6 className="left_heading">
                Freeshoppe’s Verified Dealer program
              </h6>
              <p className="left_paragraph">
                Today, Freeshopps is one of the most popular places in the U.S.
                to shop for used vehicles, and by becoming a Verified Dealer you
                get access to local car buyers that will drive more showroom
                visits by reaching out to Freeshopps's 16+ million monthly
                users.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="container mt-4">
                <div className="card p-4 shadow">
                  <h6 className="mb-3">Tell Us About You:</h6>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          name="firstName"
                          className="form-control"
                          placeholder="First Name"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          name="lastName"
                          className="form-control"
                          placeholder="Last Name"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          name="dealerName"
                          className="form-control"
                          placeholder="Dealership Name"
                          required
                          value={formData.dealerName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Email Address"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder="Phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          name="zipCode"
                          className="form-control"
                          placeholder="Zip Code"
                          required
                          value={formData.zipCode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group mb-3">
                      <p>Do you work for a licensed dealership?</p>
                      {/* <input
                        type="checkbox"
                        name="isWorkLicense"
                        checked={formData.isWorkLicense}
                        onChange={handleChange}
                      /> */}
                    </div>

                    <div className="form-group d-flex  mb-3">
                      <input
                        type="checkbox"
                        name="isWorkLicense"
                        checked={formData.isWorkLicense}
                        onChange={handleChange}
                      />
                      <label
                        className="mx-2 mt-4"
                        htmlFor="marketingConsent"
                      >
                        I consent to receive marketing related text messages
                        from Freeshopps (standard data rates may apply). Your
                        consent is not a condition of purchase.
                      </label>
                    </div>

                    <div className="form-group mb-3">
                      <p>
                        By filling out this form and clicking “Agree & Submit”,
                        you consent to Freeshopps contacting you about their
                        services and acknowledge that you have read, agree, and
                        acknowledge the terms of the OfferUpTerms of Service and
                        Privacy Policy.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="enquiry_form_btn border-0 py-2 w-50"
                    >
                      Agree & Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-3">
        <div className="row">
          <div className="col-lg-6">
            <img src={img} alt="" className="img-fluid" />
          </div>
          <div className="col-lg-6 heading d-flex justify-content-center  flex-column">
            <h6 className="">Freeshoppe’s Verified Dealer program</h6>
            <p className="py-2">
              Today, Freeshopps is one of the most popular places in the U.S. to
              shop for used vehicles, and by becoming a Verified Dealer you get
              access to local car buyers that will drive more showroom visits by
              reaching out to Freeshopps's 16+ million monthly users.
            </p>
          </div>
        </div>
      </div>
      <div className="container py-2 px-3">
        <div className="auto-third px-3 py-4">
          <h5>Everything you need to drive growth</h5>
          <div className="auto-third-cards">
            <div className="auto-third-card">
              <div className="auto-third-card-image">
                <img src={img2} alt="" />
              </div>
              <div className="auto-third-card-text">
                <h6>Vehicle showcase</h6>
                <p>
                  Create trust by showcasing your inventory on Freeshopps and
                  help buyers understand the unique value of your vehicles.
                </p>
              </div>
            </div>
            <div className="auto-third-card">
              <div className="auto-third-card-image">
                <img src={img2} alt="" />
              </div>
              <div className="auto-third-card-text">
                <h6>Targeted to drive leads</h6>
                <p>
                  Your vehicles are shown at the right time based on user
                  searches and activity giving you 60% more qualified leads
                  every month.
                </p>
              </div>
            </div>
            <div className="auto-third-card">
              <div className="auto-third-card-image">
                <img src={img3} alt="" />
              </div>
              <div className="auto-third-card-text">
                <h6>Dealer tools</h6>
                <p>
                  Promote your inventory, connect to your CRM, and leads that
                  are automatically sorted and prioritized based on intent to
                  purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-2 ">
          <div className="auto-second">
            <div className="auto-second-left">
              <img src={img4} alt="" />
            </div>
            <div className="heading auto-second-right">
              <h6>Premium placements. 2x More views.</h6>
              <p>
                Freeshopps Promoted Placements enable you to target buyers
                looking for and most likely to buy your vehicles. Your ad is
                placed at the top ensuring that your listings stay within the
                first scroll of the buyer's app feed.
              </p>
            </div>
          </div>
        </div>
        <div className="container py-2">
          <div className="auto-third p-2">
            <h5>How Promoted Placements work</h5>
            <div className="auto-third-cards">
              <div className="auto-third-card">
                <div className="auto-fouth-card-image">
                  <img src={img5} alt="" />
                </div>
                <div className="auto-fouth-card-text">
                  <h6>List your mattresses</h6>
                  <p>
                    Priority placements in the app and once a user clicks on
                    your ad, they can call you using the click-to-call button,
                    or live chat.
                  </p>
                </div>
              </div>
              <div className="auto-third-card">
                <div className="auto-fouth-card-image">
                  <img src={img6} alt="" />
                </div>
                <div className="auto-fouth-card-text">
                  <h6>Engage in real-time</h6>
                  <p>
                    You can send links, add photos, or set up a time for showing
                    directly through Chat.
                  </p>
                </div>
              </div>
              <div className="auto-third-card">
                <div className="auto-fouth-card-image">
                  <img src={img7} alt="" />
                </div>
                <div className="auto-fouth-card-text">
                  <h6>Dealer Profile</h6>
                  <p>
                    Users can navigate to your profile for a fully branded
                    experience and find business hours, location, and inventory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="auto-container">
        {/* <div className="auto-first">
          <div className="auto-first-left">
            <h1 className="left_heading">Grow Your Dealership with Freeshopps</h1>
            <p className="left_paragraph">
              Freeshopps's Verified Dealer Program helps you reach car buyers
              and get your listings in front of interested car shoppers.
            </p>
          </div>
          <div className="auto-first-right">
            <div className="auto-first-right-div">
              <h6>Tell Us About You:</h6>
              <div className="auto-first-right-inputs">
                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Last Name" />
                <input type="text" placeholder="Dealership Name" />
                <input type="text" placeholder="Email Address" />
                <input type="text" placeholder="Phone" />
                <input type="text" placeholder="Zip Code" />
              </div>
              <div className="auto-first-right-box">
                <p>Do you work for a licensed dealership?</p>
              </div>
              <div className="auto-first-right-checkbox">
                <input type="checkbox" />
                <p>
                  I consent to receive marketing related text messages from
                  Freeshopps (standard data rates may apply). Your consent is
                  not a condition of purchase.
                </p>
              </div>
              <div className="auto-first-right-privacy">
                <p>
                  By filling out this form and clicking “Agree & Submit”, you
                  consent to Freeshopps contacting you about their services and
                  acknowledge that you have read, agree and acknowledge the
                  terms of the OfferUp <span>Terms of Service</span> and{" "}
                  <span>Privacy Policy</span>.
                </p>
              </div>
              <div className="auto-first-right-btn">
                <button className="post-form-inputes-check-btn">
                  Agree & Submit
                </button>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className="auto-second">
          <div className="auto-second-left">
            <img src={img} alt="" className="img-fluid"/>
          </div>
          <div className="auto-second-right">
            <h6>Freeshoppe’s Verified Dealer program</h6>
            <p>
              Today, Freeshopps is one of the most popular places in the U.S. to
              shop for used vehicles, and by becoming a Verified Dealer you get
              access to local car buyers that will drive more showroom visits by
              reaching out to Freeshopps's 16+ million monthly users.
            </p>
          </div>
        </div> */}
        {/* <div className="auto-third">
          <h5>Everything you need to drive growth</h5>
          <div className="auto-third-cards">
            <div className="auto-third-card">
              <div className="auto-third-card-image">
                <img src={img2} alt="" />
              </div>
              <div className="auto-third-card-text">
                <h6>Vehicle showcase</h6>
                <p>
                  Create trust by showcasing your inventory on Freeshopps and
                  help buyers understand the unique value of your vehicles.
                </p>
              </div>
            </div>
            <div className="auto-third-card">
              <div className="auto-third-card-image">
                <img src={img2} alt="" />
              </div>
              <div className="auto-third-card-text">
                <h6>Targeted to drive leads</h6>
                <p>
                  Your vehicles are shown at the right time based on user
                  searches and activity giving you 60% more qualified leads
                  every month.
                </p>
              </div>
            </div>
            <div className="auto-third-card">
              <div className="auto-third-card-image">
                <img src={img3} alt="" />
              </div>
              <div className="auto-third-card-text">
                <h6>Dealer tools</h6>
                <p>
                  Promote your inventory, connect to your CRM, and leads that
                  are automatically sorted and prioritized based on intent to
                  purchase.
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="auto-third">
          <h5>How Promoted Placements work</h5>
          <div className="auto-third-cards">
            <div className="auto-third-card">
              <div className="auto-fouth-card-image">
                <img src={img5} alt="" />
              </div>
              <div className="auto-fouth-card-text">
                <h6>List your mattresses</h6>
                <p>
                  Priority placements in the app and once a user clicks on your
                  ad, they can call you using the click-to-call button, or live
                  chat.
                </p>
              </div>
            </div>
            <div className="auto-third-card">
              <div className="auto-fouth-card-image">
                <img src={img6} alt="" />
              </div>
              <div className="auto-fouth-card-text">
                <h6>Engage in real-time</h6>
                <p>
                  You can send links, add photos, or set up a time for showing
                  directly through Chat.
                </p>
              </div>
            </div>
            <div className="auto-third-card">
              <div className="auto-fouth-card-image">
                <img src={img7} alt="" />
              </div>
              <div className="auto-fouth-card-text">
                <h6>Dealer Profile</h6>
                <p>
                  Users can navigate to your profile for a fully branded
                  experience and find business hours, location, and inventory.
                </p>
              </div>
            </div>
          </div>
        </div> */}
        <div className="auto-fiveth">
          <div className="auto-fiveth-left">
            <img src={img10} alt="" />
          </div>
          <div className="auto-fiveth-right">
            <h2>What our Verified Dealers are saying</h2>
            <p>
              “I’ve been able to generate more sales from OfferUp in 2 months
              than I have in an entire year using other marketplace apps.”{" "}
              <span>Hermes Auto Group</span>{" "}
            </p>
          </div>
        </div>
        <div className="auto-sixeth">
          <h6>Resources and Articles for Dealers</h6>
        </div>
        <div className="auto-second">
          <div className="auto-second-seventh">
            <img src={img8} alt="" />
          </div>
          <div className="auto-second-right">
            <h6>The Freeshopps Verified Dealer Program in 60-Seconds</h6>
            <p>
              Learn the ins and outs of Freeshopps's Verified Dealer Program and
              how it enables dealers to advertise, promote and sell their
              vehicles in front of 20+ million users every month.
            </p>
            <button className="post-form-inputes-check-btn">Read Now</button>
          </div>
        </div>
        <div className="auto-second">
          <div className="auto-second-right">
            <h6>Consumers want a hassle-free car shopping experience</h6>
            <p>
              In the post-pandemic world, consumers have changed. No longer do
              people want to be sold to, but they want to buy something from a
              business. More importantly, they now expect businesses to deliver
              bespoke experiences and prioritize customer experience over
              everything else.
            </p>
            <button className="post-form-inputes-check-btn">Read Now</button>
          </div>
          <div className="auto-second-seventh">
            <img src={img9} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Autodealerships;
