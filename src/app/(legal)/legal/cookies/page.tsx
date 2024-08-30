import React from 'react';

const CookiesPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-navy">Cookies Policy</h1>

      <section className="mb-8">
        <p className="mb-4">
          This Cookies Policy explains how SparkMind ("we", "us", and "our") uses cookies and
          similar technologies to recognize you when you visit our website at https://sparkmind.com
          ("Website"). It explains what these technologies are and why we use them, as well as your
          rights to control our use of them.
        </p>
        <p className="mb-4">
          This policy is effective as of 1 June 2023 and was last updated on 1 June 2023.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">What are cookies?</h2>
        <p className="mb-4">
          Cookies are small data files that are placed on your computer or mobile device when you
          visit a website. Cookies are widely used by website owners in order to make their websites
          work, or to work more efficiently, as well as to provide reporting information.
        </p>
        <p className="mb-4">
          Cookies set by the website owner (in this case, SparkMind) are called "first party
          cookies". Cookies set by parties other than the website owner are called "third party
          cookies". Third party cookies enable third party features or functionality to be provided
          on or through the website (e.g. like advertising, interactive content and analytics). The
          parties that set these third party cookies can recognize your computer both when it visits
          the website in question and also when it visits certain other websites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">Why do we use cookies?</h2>
        <p className="mb-4">
          We use first party and third party cookies for several reasons. Some cookies are required
          for technical reasons in order for our Website to operate, and we refer to these as
          "essential" or "strictly necessary" cookies. Other cookies also enable us to track and
          target the interests of our users to enhance the experience on our Website. Third parties
          serve cookies through our Website for advertising, analytics and other purposes. This is
          described in more detail below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">Types of cookies we use</h2>
        <p className="mb-4">
          The specific types of first and third party cookies served through our Website and the
          purposes they perform are described below:
        </p>
        <ul className="list-disc list-inside mb-4 text-navy">
          <li>
            <strong>Essential website cookies:</strong> These cookies are strictly necessary to
            provide you with services available through our Website and to use some of its features,
            such as access to secure areas.
          </li>
          <li>
            <strong>Performance and functionality cookies:</strong> These cookies are used to
            enhance the performance and functionality of our Website but are non-essential to their
            use. However, without these cookies, certain functionality may become unavailable.
          </li>
          <li>
            <strong>Analytics and customization cookies:</strong> These cookies collect information
            that is used either in aggregate form to help us understand how our Website is being
            used or how effective our marketing campaigns are, or to help us customize our Website
            for you.
          </li>
          <li>
            <strong>Advertising cookies:</strong> These cookies are used to make advertising
            messages more relevant to you. They perform functions like preventing the same ad from
            continuously reappearing, ensuring that ads are properly displayed for advertisers, and
            in some cases selecting advertisements that are based on your interests.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">How can you control cookies?</h2>
        <p className="mb-4">
          You have the right to decide whether to accept or reject cookies. You can exercise your
          cookie preferences by clicking on the appropriate opt-out links provided in the cookie
          banner or privacy preference center on our Website.
        </p>
        <p className="mb-4">
          You can set or amend your web browser controls to accept or refuse cookies. If you choose
          to reject cookies, you may still use our Website though your access to some functionality
          and areas of our Website may be restricted. As the means by which you can refuse cookies
          through your web browser controls vary from browser-to-browser, you should visit your
          browser's help menu for more information.
        </p>
        <p className="mb-4">
          In addition, most advertising networks offer you a way to opt out of targeted advertising.
          If you would like to find out more information, please visit
          http://www.aboutads.info/choices/ or http://www.youronlinechoices.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-navy">
          How often will we update this Cookie Policy?
        </h2>
        <p className="mb-4">
          We may update this Cookie Policy from time to time in order to reflect, for example,
          changes to the cookies we use or for other operational, legal or regulatory reasons.
          Please therefore re-visit this Cookie Policy regularly to stay informed about our use of
          cookies and related technologies.
        </p>
        <p className="mb-4">
          The date at the top of this Cookie Policy indicates when it was last updated.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-navy">
          Where can you get further information?
        </h2>
        <p className="mb-4">
          If you have any questions about our use of cookies or other technologies, please email us
          at privacy@sparkmind.com.
        </p>
      </section>
    </div>
  );
};

export default CookiesPage;
