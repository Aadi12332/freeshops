// src/components/CreateAccountPage.jsx
import React from "react";
import "./CreateAccountPage.css";
// OPTIONAL: import DOMPurify if you want to sanitize (example below)
// import DOMPurify from "dompurify";

const CreateAccountPage = () => {
  // Example: this pageData would come from your editor/backend as a single payload
  const pageData = {
    breadcrumbsHtml:
      '<a href="#">Freeshopps Support</a> &gt; <a href="#">Getting Started</a> &gt; <a href="#">Freeshopps Basics</a>',
    titleHtml: "Create an <em>account</em>", // heading from editor (HTML allowed)
    updatedHtml: "Updated <strong>3 months</strong> ago",
    introHtml:
      'Creating a <b>Freeshopps</b> account is quick and simple. Visit <a href="#">Freeshopps.com</a>.',
    notesHtml: [
      "Per our Posting Rules, we only allow <strong>one</strong> active Freeshopps account per user.",
      "If you select <b>Continue With Email</b>, do not reuse an email linked to a deleted account.",
    ],
    tabsHtml: ["<span>Mobile</span>", "<span>Desktop</span>"],
    instructionsHtml: [
      `Download the Freeshopps app from your app store.
        <ul>
          <li><a href='#'>App Store (iOS)</a></li>
          <li><a href='#'>Google Play (Android)</a></li>
        </ul>`,
      "Open the app and tap <strong>Log In</strong>.",
      `On the <strong>Sign Up / Log In</strong> pop-up, select how you want to set up your account:
        <ul>
          <li><strong>Continue With Email:</strong> email + password</li>
          <li><strong>Continue With Google:</strong> use Google account</li>
        </ul>`,
    ],
    username: {
      headingHtml: "Choose an <strong>appropriate</strong> username", // H2 from editor
      textHtml:
        "This name will display on your public profile. Use your real name, business name, or a nickname.",
      guidelinesHtml: [
        "No offensive, profane, or sexually explicit names.",
        "Do not impersonate other people or businesses.",
        "Do not include contact info like phone or email.",
      ],
    },
  };

  // Helper to render HTML (optionally sanitize before returning)
  const renderHtml = (htmlString) => {
    // If using DOMPurify for security:
    // const clean = DOMPurify.sanitize(htmlString);
    // return { __html: clean };

    // If you are not sanitizing (only for trusted sources), return directly:
    return { __html: htmlString };
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <nav
          className="breadcrumbs"
          dangerouslySetInnerHTML={renderHtml(pageData.breadcrumbsHtml)}
        />

        <header>
          <h1 dangerouslySetInnerHTML={renderHtml(pageData.titleHtml)} />
          <p className="meta-info" dangerouslySetInnerHTML={renderHtml(pageData.updatedHtml)} />
        </header>

        <p dangerouslySetInnerHTML={renderHtml(pageData.introHtml)} />

        <div className="note-box">
          <p><strong>NOTE</strong></p>
          <p dangerouslySetInnerHTML={renderHtml(pageData.notesHtml[0])} />
        </div>

        <div className="tabs-container">
          {pageData.tabsHtml.map((tHtml, i) => (
            <div key={i} className={`tab ${i === 0 ? "active-tab" : ""}`}>
              <span dangerouslySetInnerHTML={renderHtml(tHtml)} />
            </div>
          ))}
        </div>

        <div className="tab-content">
          <ol className="instructions-list">
            {pageData.instructionsHtml.map((stepHtml, idx) => (
              <li key={idx} dangerouslySetInnerHTML={renderHtml(stepHtml)} />
            ))}
          </ol>
        </div>

        <div className="note-box">
          <p><strong>NOTE</strong></p>
          <p dangerouslySetInnerHTML={renderHtml(pageData.notesHtml[1])} />
        </div>

        <section className="username-section">
          <h2 dangerouslySetInnerHTML={renderHtml(pageData.username.headingHtml)} />
          <p dangerouslySetInnerHTML={renderHtml(pageData.username.textHtml)} />
          <p>Your name should adhere to the following guidelines:</p>
          <ul className="guidelines-list">
            {pageData.username.guidelinesHtml.map((g, i) => (
              <li key={i} dangerouslySetInnerHTML={renderHtml(g)} />
            ))}
          </ul>
        </section>

        <section>
          <h2>Secure your account</h2>
          {/* content here */}
        </section>
      </main>

   
    </div>
  );
};

export default CreateAccountPage;
